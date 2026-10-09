/**
 * API handlers. Every handler takes an injected `query` so the whole surface is
 * testable against a real Postgres without starting a server.
 *
 * PHI rule: a response may carry mrn_tail, never mrn_hash.
 */
import { ALL_STEP_CODES, isCritical } from "../src/domain/steps.js";
import { ALL_DRUGS, drugOf } from "../src/domain/drugs.js";
import { KNOWLEDGE, PHARMACISTS } from "../src/domain/roster.js";
import { hashMrn, mrnTail } from "./db.mjs";
import { pareto, stepErrorRates, summarise } from "./metrics.mjs";

class HttpError extends Error {
	constructor(status, message) {
		super(message);
		this.status = status;
	}
}

const bad = (msg) => {
	throw new HttpError(400, msg);
};

/**
 * Every case, with its step results already aggregated in Postgres. One query,
 * no N+1.
 */
const ROW_SQL = `
	SELECT c.id, c.case_date, c.timepoint, c.qcc_stage, c.device, c.drug,
	       c.pharmacist, c.campus, c.record_id, c.has_ics, c.needs_shake,
	       p.mrn_tail,
	       -- ::int matters: count() returns bigint, which pg hands back as a
	       -- string, and knowledgeStats rejects a non-integer score.
	       -- NULL when nothing was answered, so an unanswered case is excluded
	       -- from the mean rather than scoring zero.
	       CASE WHEN EXISTS (SELECT 1 FROM case_knowledge ck WHERE ck.case_id = c.id)
	            THEN (SELECT count(*) FROM case_knowledge ck
	                  WHERE ck.case_id = c.id AND ck.answer = '對')::int
	       END AS knowledge_score,
	       COALESCE((SELECT jsonb_object_agg(cs.step_code, cs.value)
	                 FROM case_steps cs WHERE cs.case_id = c.id), '{}'::jsonb) AS steps
	FROM cases c
	JOIN patients p ON p.id = c.patient_id
`;

/**
 * @param {{query: Function, salt: string}} deps
 */
export function makeRoutes({ query, salt }) {
	const countCases = async () => {
		const { rows } = await query("SELECT count(*)::int AS n FROM cases");
		return rows[0].n;
	};

	/** GET /api/health */
	async function health() {
		const { rows } = await query("SELECT now() AS now, current_database() AS db");
		return { ok: true, db: rows[0].db, now: rows[0].now, cases: await countCases() };
	}

	/**
	 * POST /api/cases — case, steps, knowledge answers and clinical measures in
	 * one transaction. The pharmacist app works offline, so a partial write must
	 * never be reachable.
	 */
	async function createCase(body) {
		const mrn = String(body.mrn ?? "").trim();
		if (!mrn) bad("mrn is required");
		if (!body.caseDate) bad("caseDate is required");

		const drug = drugOf(body.drug);
		const timepoint = body.timepoint ?? "M0";
		if (!["M0", "M1", "M3"].includes(timepoint)) bad(`unknown timepoint ${timepoint}`);
		if (!PHARMACISTS.includes(body.pharmacist)) bad(`unknown pharmacist ${body.pharmacist}`);

		const steps = body.steps ?? {};
		for (const code of Object.keys(steps)) {
			if (!ALL_STEP_CODES.includes(code)) bad(`unknown step ${code}`);
			if (!["正確", "錯誤", "na"].includes(steps[code])) bad(`bad value for ${code}`);
		}
		const knowledge = body.knowledge ?? {};
		for (const [k, v] of Object.entries(knowledge)) {
			const i = Number.parseInt(k, 10);
			if (Number.isNaN(i) || i < 1 || i > 10) bad(`bad knowledge index ${k}`);
			if (!["對", "不對"].includes(v)) bad(`bad knowledge answer for Q${i}`);
		}

		const recordId = body.recordId ?? cryptoRandomId();

		// A case with a critical error comes back. This is the prototype's
		// 燈號 rule: ★ critical error -> re-check within 2 weeks; any other
		// error -> the routine M1 window; all correct -> no follow-up.
		const wrongCodes = Object.entries(steps)
			.filter(([, v]) => v === "錯誤")
			.map(([code]) => code);
		const hasCritical = wrongCodes.some((c) => isCritical(c));
		const followup = hasCritical
			? { task: "有關鍵錯誤：2 週內再評估", days: 14, priority: "P1" }
			: wrongCodes.length
				? { task: `${timepoint === "M0" ? "M1" : timepoint} 評估`, days: 14, priority: "P2" }
				: null;

		const { rows } = await query(
			`WITH ins_p AS (
			   INSERT INTO patients (mrn_hash, mrn_tail, age_band, sex, diagnosis, study_id)
			   VALUES ($1,$2,$3,$4,$5,$6)
			   ON CONFLICT (mrn_hash) DO UPDATE SET age_band = EXCLUDED.age_band
			   -- mrn_tail comes back via RETURNING: a data-modifying CTE cannot
			   -- re-read the row it just inserted by joining back to the patients
			   -- table, because that read sees the pre-statement snapshot.
			   RETURNING id, mrn_tail
			 ), ins_c AS (
			   INSERT INTO cases (patient_id, case_date, timepoint, qcc_stage, campus,
			                      pharmacist, device, drug, has_ics, needs_shake, case_type,
			                      factors, use_qcc, use_research, record_id)
			   SELECT id,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20 FROM ins_p
			   -- case_date comes back via RETURNING for the same reason as
			   -- mrn_tail: a sibling CTE reading the cases table sees the old snapshot.
			   RETURNING id, patient_id, record_id, case_date
			 ), ins_s AS (
			   INSERT INTO case_steps (case_id, step_code, value, note)
			   SELECT ins_c.id, e.key, e.value, COALESCE($22::jsonb ->> e.key, '')
			   FROM ins_c, jsonb_each_text($21::jsonb) AS e(key, value)
			   RETURNING 1
			 ), ins_k AS (
			   INSERT INTO case_knowledge (case_id, q_index, answer)
			   SELECT ins_c.id, (e.key)::int, e.value
			   FROM ins_c, jsonb_each_text($23::jsonb) AS e(key, value)
			   WHERE (e.key)::int BETWEEN 1 AND 10
			   RETURNING 1
			 ), ins_m AS (
			   INSERT INTO clinical_measurements (case_id, kind, value, text_value)
			   SELECT ins_c.id, e.key, NULLIF(e.value,'')::numeric, NULLIF(e.value,'')
			   FROM ins_c, jsonb_each_text($24::jsonb) AS e(key, value)
			   RETURNING 1
			 )
			 , ins_f AS (
			   INSERT INTO followups (patient_id, case_id, task, due_start, due_end, priority)
			   SELECT ins_c.patient_id, ins_c.id, $25::text,
			          (ins_c.case_date + $26::int)::date,
			          (ins_c.case_date + $27::int)::date,
			          $28::text
			   FROM ins_c WHERE $25::text IS NOT NULL
			   RETURNING 1
			 )
			 SELECT ins_c.record_id, ins_p.mrn_tail,
			        (SELECT count(*) FROM ins_s)::int AS steps,
			        (SELECT count(*) FROM ins_k)::int AS knowledge,
			        (SELECT count(*) FROM ins_m)::int AS measures,
			        (SELECT count(*) FROM ins_f)::int AS followup
			 FROM ins_c JOIN ins_p ON ins_p.id = ins_c.patient_id`,
			[
				hashMrn(mrn, salt),
				mrnTail(mrn),
				body.ageBand ?? "18-64歲",
				body.sex ?? null,
				body.diagnosis ?? null,
				body.studyId ?? null,
				body.caseDate,
				timepoint,
				body.qccStage ?? "改善後",
				body.campus ?? "虎尾",
				body.pharmacist,
				drug.device,
				body.drug,
				drug.hasIcs,
				drug.needsShake,
				body.caseType ?? null,
				// factors is text[] — pass the array, not a JSON string.
				body.factors ?? [],
				body.useQcc !== false,
				Boolean(body.useResearch),
				recordId,
				JSON.stringify(steps),
				JSON.stringify(body.stepNotes ?? {}),
				JSON.stringify(knowledge),
				JSON.stringify(body.measurements ?? {}),
				followup?.task ?? null,
				followup ? followup.days : 0,
				// A routine window ends six weeks after the critical-error one.
				followup ? (hasCritical ? 14 : 42) : 0,
				followup?.priority ?? null,
			],
		);

		if (!rows[0]) throw new HttpError(500, "insert produced no row");
		return { ok: true, ...rows[0] };
	}

	/** GET /api/cases — filters: qccStage, timepoint, campus, pharmacist, drug */
	async function listCases(q = {}) {
		const where = [];
		const params = [];
		for (const [key, col] of [
			["qccStage", "c.qcc_stage"],
			["timepoint", "c.timepoint"],
			["campus", "c.campus"],
			["pharmacist", "c.pharmacist"],
			["drug", "c.drug"],
		]) {
			if (q[key]) {
				params.push(q[key]);
				where.push(`${col} = $${params.length}`);
			}
		}
		params.push(Number(q.limit) || 200);
		const { rows } = await query(
			`${ROW_SQL} ${where.length ? `WHERE ${where.join(" AND ")}` : ""}
			 ORDER BY c.case_date DESC, c.id LIMIT $${params.length}`,
			params,
		);
		return { ok: true, cases: rows.map(present) };
	}

	/** GET /api/metrics/summary — what the admin dashboard renders. */
	async function summary(q = {}) {
		const params = [];
		let where = "";
		if (q.qccStage) {
			params.push(q.qccStage);
			where = `WHERE c.qcc_stage = $${params.length}`;
		}
		const { rows } = await query(`${ROW_SQL} ${where}`, params);
		const shaped = rows.map(shape);
		return {
			ok: true,
			...summarise(shaped),
			pareto: pareto(shaped),
			stepRates: stepErrorRates(shaped),
			enrolment: {
				target: Number(q.target) || 61,
				after: shaped.filter((r) => r.qccStage === "改善後").length,
			},
		};
	}

	/**
	 * POST /api/sessions — replaces the Apps Script `ai_coach_record` call.
	 * Carries attempts, AI confidence and the pharmacist's own verdict per stage.
	 */
	async function recordSession(body) {
		const mrn = String(body.mrn ?? "").trim();
		if (!mrn) bad("mrn is required");
		const stages = body.stages ?? {};
		for (const k of Object.keys(stages)) {
			if (!/^[0-4]$/.test(k)) bad(`stage must be 0-4, got ${k}`);
		}
		const { rows } = await query(
			`WITH ins_p AS (
			   INSERT INTO patients (mrn_hash, mrn_tail, age_band)
			   VALUES ($1,$2,$3)
			   ON CONFLICT (mrn_hash) DO UPDATE SET age_band = patients.age_band
			   RETURNING id
			 ), ins_s AS (
			   INSERT INTO sessions (patient_id, device, completed_at)
			   SELECT id,$4,CASE WHEN $5 THEN now() END FROM ins_p RETURNING id
			 ), ins_st AS (
			   INSERT INTO session_stages (session_id, stage, attempts, ai_confidence,
			                              pharmacist, passed)
			   SELECT ins_s.id, (e.key)::int,
			          COALESCE(NULLIF(e.value->>'a','')::int, 0),
			          COALESCE(NULLIF(e.value->>'c','')::numeric, 0),
			          COALESCE(NULLIF(e.value->>'p',''),'not_recorded'),
			          NULLIF(e.value->>'passed','')::boolean
			   FROM ins_s, jsonb_each($6::jsonb) AS e(key, value)
			   WHERE (e.key)::int BETWEEN 0 AND 4
			   RETURNING 1
			 )
			 SELECT (SELECT count(*) FROM ins_st)::int AS stages FROM ins_s`,
			[
				hashMrn(mrn, salt),
				mrnTail(mrn),
				body.ageBand ?? "18-64歲",
				body.device ?? "MDI",
				Boolean(body.completed),
				JSON.stringify(stages),
			],
		);
		return { ok: true, ...rows[0] };
	}

	/** GET /api/reference — the spine, so a client never hardcodes it. */
	async function reference() {
		return { ok: true, drugs: ALL_DRUGS, pharmacists: PHARMACISTS, knowledge: KNOWLEDGE, steps: ALL_STEP_CODES };
	}

	/** GET /api/followups — the pharmacist's open queue. */
	async function followups() {
		const { rows } = await query(
			`SELECT f.id, f.task, f.due_start, f.due_end, f.priority, f.status,
			        p.mrn_tail, c.drug, c.device, c.pharmacist
			 FROM followups f
			 JOIN patients p ON p.id = f.patient_id
			 LEFT JOIN cases c ON c.id = f.case_id
			 WHERE f.status = 'open'
			 ORDER BY f.due_start`,
		);
		const today = new Date().toISOString().slice(0, 10);
		return {
			ok: true,
			followups: rows.map((r) => ({
				...r,
				overdue: r.due_end < today,
				dueSoon: r.due_end >= today && r.due_end <= addDays(today, 3),
			})),
		};
	}

	return { health, createCase, listCases, summary, recordSession, reference, followups };
}

function addDays(iso, n) {
	const d = new Date(`${iso}T00:00:00Z`);
	d.setUTCDate(d.getUTCDate() + n);
	return d.toISOString().slice(0, 10);
}

function cryptoRandomId() {
	const rand = Math.floor(Math.random() * 1e6)
		.toString(36)
		.toUpperCase();
	return `C-${Date.now().toString(36).toUpperCase()}-${rand}`;
}

/** DB row → the shape metrics.mjs expects. */
export function shape(r) {
	return {
		timepoint: r.timepoint,
		qccStage: r.qcc_stage,
		device: r.device,
		drug: r.drug,
		steps: r.steps ?? {},
		knowledgeScore: r.knowledge_score,
	};
}

/** Never let mrn_hash escape. */
export function present(r) {
	const { knowledge_score: k, ...rest } = r;
	return { ...rest, knowledgeScore: k };
}

export { HttpError };