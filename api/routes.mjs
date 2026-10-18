/**
 * API handlers. Every handler takes an injected `query` so the whole surface is
 * testable against a real Postgres without starting a server.
 *
 * PHI rule: a response may carry mrn_tail, never mrn_hash.
 */

import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { ALL_DRUGS, drugOf } from "../src/domain/drugs.js";
import { KNOWLEDGE, PHARMACISTS } from "../src/domain/roster.js";
import { stageVerdicts } from "../src/domain/stages.js";
import { ALL_STEP_CODES, isCritical } from "../src/domain/steps.js";
import { hashMrn, mrnTail } from "./db.mjs";
import { makeLineService } from "./line/service.mjs";
import {
	createLiveTransport,
	createRecordingTransport,
} from "./line/transport.mjs";
import { handleLineWebhook } from "./line/webhook.mjs";
import {
	pareto,
	stepComparison,
	stepErrorRates,
	summarise,
} from "./metrics.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));

function loadDefaultJson(relPath) {
	try {
		return JSON.parse(readFileSync(resolve(__dirname, relPath), "utf8"));
	} catch {
		return null;
	}
}

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
	       c.patient_id,
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
export function makeRoutes({ query, salt, lineTransport }) {
	/**
	 * How LINE messages leave.
	 *
	 * Defaults to recording. A deploy without a token must never be able to
	 * message a patient, so reaching a real phone needs both a token and
	 * LINE_SEND_ENABLED — one switch, or the account alone would be enough.
	 */
	const line = makeLineService({
		query,
		transport:
			lineTransport ??
			(process.env.LINE_CHANNEL_ACCESS_TOKEN &&
			process.env.LINE_SEND_ENABLED === "true"
				? createLiveTransport({ token: process.env.LINE_CHANNEL_ACCESS_TOKEN })
				: createRecordingTransport({
						insert: async () => {
							// Plan-only callers never send, so nothing to capture here.
						},
					})),
	});

	const countCases = async () => {
		const { rows } = await query("SELECT count(*)::int AS n FROM cases");
		return rows[0].n;
	};

	/** GET /api/health */
	async function health() {
		try {
			const { rows } = await query(
				"SELECT now() AS now, current_database() AS db",
			);
			return {
				ok: true,
				db: rows[0].db,
				now: rows[0].now,
				cases: await countCases(),
			};
		} catch (err) {
			return {
				ok: true,
				status: "ready",
				db: "disconnected",
				error: err.message,
			};
		}
	}

	/**
	 * POST /api/cases — case, steps, knowledge answers and clinical measures in
	 * one transaction. The pharmacist app works offline, so a partial write must
	 * never be reachable.
	 */
	async function createCase(body) {
		/*
		 * `patientId` lets a follow-up closure attach the new assessment to the
		 * patient the queue already points at. The queue carries only mrn_tail —
		 * the full record number is hashed on the way in and is not recoverable
		 * from a row — so the id is the only correct handle, and re-deriving it
		 * from a tail would silently create a second patient.
		 */
		const patientId = body.patientId ?? null;
		const mrn = String(body.mrn ?? "").trim();
		if (!mrn && !patientId) bad("mrn or patientId is required");
		if (!body.caseDate) bad("caseDate is required");

		const drug = drugOf(body.drug);
		const timepoint = body.timepoint ?? "M0";
		if (!["M0", "M1", "M3"].includes(timepoint))
			bad(`unknown timepoint ${timepoint}`);
		if (!PHARMACISTS.includes(body.pharmacist))
			bad(`unknown pharmacist ${body.pharmacist}`);

		const steps = body.steps ?? {};
		const demonstrated = body.demonstrated ?? {};
		for (const code of Object.keys(steps)) {
			if (!ALL_STEP_CODES.includes(code)) bad(`unknown step ${code}`);
			if (!["正確", "錯誤", "na"].includes(steps[code]))
				bad(`bad value for ${code}`);
		}
		for (const code of Object.keys(demonstrated)) {
			if (!ALL_STEP_CODES.includes(code)) bad(`unknown step ${code}`);
			if (typeof demonstrated[code] !== "boolean")
				bad(`demonstrated must be boolean for ${code}`);
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
				? {
						task: `${timepoint === "M0" ? "M1" : timepoint} 評估`,
						days: 14,
						priority: "P2",
					}
				: null;

		const { rows } = await query(
			`WITH ins_p AS (
			   ${
						patientId
							? `SELECT $1::uuid AS id,
			             (SELECT mrn_tail FROM patients WHERE id = $1::uuid) AS mrn_tail,
			             -- $2..$6 carry the record number and demographics, which an
			             -- existing patient already has. They are projected so their
			             -- types resolve: node-postgres sends every parameter
			             -- untyped, and Postgres refuses the whole statement with
			             -- 「could not determine data type of parameter」 for any
			             -- placeholder it cannot infer from context. Referencing
			             -- them here also keeps both branches on one numbering.
			             $2::text AS _mrn, $3::text AS _age, $4::text AS _sex,
			             $5::text AS _dx, $6::text AS _study`
							: `INSERT INTO patients (mrn_hash, mrn_tail, age_band, sex, diagnosis, study_id)
			   VALUES ($1,$2,$3,$4,$5,$6)
			   ON CONFLICT (mrn_hash) DO UPDATE SET age_band = EXCLUDED.age_band
			   -- mrn_tail comes back via RETURNING: a data-modifying CTE cannot
			   -- re-read the row it just inserted by joining back to the patients
			   -- table, because that read sees the pre-statement snapshot.
			   RETURNING id, mrn_tail`
}
			 ), ins_c AS (
			   INSERT INTO cases (patient_id, case_date, timepoint, qcc_stage, campus,
			                      pharmacist, device, drug, has_ics, needs_shake, case_type,
			                      factors, use_qcc, use_research, record_id)
			   SELECT id,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20 FROM ins_p
			   -- case_date comes back via RETURNING for the same reason as
			   -- mrn_tail: a sibling CTE reading the cases table sees the old snapshot.
			   RETURNING id, patient_id, record_id, case_date
			 ), ins_s AS (
			   INSERT INTO case_steps (case_id, step_code, value, note, demonstrated)
			   SELECT ins_c.id, e.key, e.value, COALESCE($22::jsonb ->> e.key, ''),
			          COALESCE(($29::jsonb ->> e.key)::boolean, false)
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
			 SELECT ins_c.id, ins_c.record_id, ins_p.mrn_tail,
			        (SELECT count(*) FROM ins_s)::int AS steps,
			        (SELECT count(*) FROM ins_k)::int AS knowledge,
			        (SELECT count(*) FROM ins_m)::int AS measures,
			        (SELECT count(*) FROM ins_f)::int AS followup
			 FROM ins_c JOIN ins_p ON ins_p.id = ins_c.patient_id`,
			[
				// $1 is the patient handle the branch above expects: the existing
				// id when one was given, otherwise the hash of the record number.
				patientId ?? hashMrn(mrn, salt),
				patientId ? "" : mrnTail(mrn),
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
				JSON.stringify(demonstrated),
			],
		);

		if (!rows[0]) throw new HttpError(500, "insert produced no row");
		return { ok: true, ...rows[0] };
	}

	/**
	 * POST /api/cases/lookup — one patient's history, by record number.
	 *
	 * This exists because there was no way to answer 「這位病人上次幾分」 at all:
	 * /api/cases filters by cohort and the frontend never called it, so a
	 * pharmacist could record a case and close a follow-up but could not read
	 * back anything they had already written down.
	 *
	 * A POST rather than `?mrn=` for the same reason session reporting posts its
	 * identifier — a record number in a query string ends up in browser history,
	 * proxy logs and any shared link. The number is hashed here and only the
	 * hash is compared.
	 *
	 * Newest first, each with its step verdicts, so a before/after reads side by
	 * side without opening anything else.
	 */
	async function lookupCases(body) {
		const mrn = String(body?.mrn ?? "").trim();
		if (!mrn) bad("mrn is required");
		const { rows: ids } = await query(
			`SELECT c.id FROM cases c
			 JOIN patients p ON p.id = c.patient_id
			 WHERE p.mrn_hash = $1`,
			[hashMrn(mrn, salt)],
		);
		if (ids.length === 0) return { ok: true, found: false, cases: [] };
		const { rows } = await query(
			`${ROW_SQL} WHERE c.id = ANY($1::uuid[])
			 ORDER BY c.case_date DESC, c.id DESC`,
			[ids.map((r) => r.id)],
		);
		return { ok: true, found: true, cases: rows.map(present) };
	}

	/** GET /api/cases — filters: qccStage, timepoint, campus, pharmacist, drug, device, patientId */
	async function listCases(q = {}) {
		const where = [];
		const params = [];
		for (const [key, col] of [
			["qccStage", "c.qcc_stage"],
			["timepoint", "c.timepoint"],
			["campus", "c.campus"],
			["pharmacist", "c.pharmacist"],
			["drug", "c.drug"],
			// Device before drug, because it is the coarser and more useful cut:
			// the steps a patient is taught are defined by device.
			["device", "c.device::text"],
			/*
			 * A UUID, not a record number. The queue holds the masked tail only —
			 * that is enough to recognise a row and not enough to pull the rest
			 * of a patient's history, so the identifier that does the lookup is
			 * the internal id. It is opaque and carries no clinical meaning,
			 * which is why it is acceptable in a URL where an MRN would not be.
			 */
			["patientId", "c.patient_id::text"],
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

	/**
	 * Is anyone actually using this?
	 *
	 * The technique metrics say whether the teaching worked. They say nothing
	 * about whether people showed up, practised, or answered — and a platform
	 * whose follow-up completion is zero can show a stable error rate for that
	 * reason alone. A pharmacist asked to judge whether the system is heading
	 * the right way needs both, so this is measured separately rather than
	 * inferred from the step table.
	 *
	 * Every number here is currently zero on a fresh database. That is the point:
	 * "nobody has used it" has to be visible, not an empty screen.
	 */
	async function engagement() {
		const { rows } = await query(
			`SELECT
			   (SELECT count(DISTINCT patient_id) FROM cases)::int AS enrolled,
			   (SELECT count(DISTINCT patient_id) FROM sessions)::int AS practised,
			   (SELECT count(DISTINCT patient_id) FROM sessions
			     WHERE completed_at IS NOT NULL)::int AS completed_practice,
			   (SELECT count(DISTINCT patient_id) FROM line_identities)::int AS line_linked,
			   (SELECT count(DISTINCT patient_id) FROM line_events)::int AS line_responded,
			   (SELECT count(*) FROM followups WHERE status = 'open')::int AS fu_open,
			   (SELECT count(*) FROM followups WHERE status = 'done')::int AS fu_done,
			   (SELECT count(*) FROM followups WHERE status = 'missed')::int AS fu_missed,
			   -- Activity is when something HAPPENED, not when the row was
			   -- written. cases.created_at defaults to now(), so using it makes
			   -- every historical case look like activity today: the 61-case
			   -- baseline from April reported 61 people active in the last 7 days.
			   (SELECT count(DISTINCT p.id) FROM patients p
			     WHERE EXISTS (SELECT 1 FROM cases c WHERE c.patient_id = p.id
			                   AND c.case_date >= current_date - 7)
			        OR EXISTS (SELECT 1 FROM sessions s WHERE s.patient_id = p.id
			                   AND s.started_at::date >= current_date - 7)
			        OR EXISTS (SELECT 1 FROM line_events e WHERE e.patient_id = p.id
			                   AND e.created_at::date >= current_date - 7)
			        OR EXISTS (SELECT 1 FROM followups f WHERE f.patient_id = p.id
			                   AND f.completed_at::date >= current_date - 7))::int AS active_7d`,
		);
		const e = rows[0];
		// Only follow-ups whose window has actually arrived count. Counting a
		// task enqueued today as "not yet due" is not the same as counting it as
		// missed, and the plan's definition uses the due cohort.
		const { rows: dueRows } = await query(
			`SELECT
			   count(*) FILTER (WHERE due_end <= current_date)::int AS due,
			   count(*) FILTER (WHERE due_end <= current_date AND status = 'done')::int AS due_done
			 FROM followups`,
		);
		const due = dueRows[0]?.due ?? 0;
		const dueDone = dueRows[0]?.due_done ?? 0;
		return {
			...e,
			followupDue: due,
			followupDone: dueDone,
			followupCompletionRate: due > 0 ? dueDone / due : null,
		};
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
		const baseline = shaped.filter((r) => r.qccStage === "改善前");
		const after = shaped.filter((r) => r.qccStage === "改善後");
		return {
			ok: true,
			...summarise(shaped),
			pareto: pareto(shaped),
			stepRates: stepErrorRates(shaped),
			/*
			 * The before → after pair, for the heatmap. Computed from the two
			 * cohorts separately rather than by filtering the combined rate: the
			 * whole point of the panel is that a step is compared with itself,
			 * and a single rate over both cohorts cannot say which side moved.
			 *
			 * When `qccStage` narrows the query to one cohort, the other side is
			 * empty and every cell reads 「沒有資料」 — which is correct, and
			 * better than silently showing the combined figure under both
			 * headings.
			 */
			stepsBeforeAfter: stepComparison(baseline, after),
			enrolment: {
				// The plan's own figure, used when the caller supplies none:
				// 「預計收案 30 位病人」(計畫書 line 112). The previous fallback
				// was 61, which is the baseline cohort — so the outcomes page
				// claimed a target the study never set, and read as if the
				// intervention had to reach every baseline patient.
				target: Number(q.target) || 30,
				after: shaped.filter((r) => r.qccStage === "改善後").length,
			},
			engagement: await engagement(),
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
		// The drug must be the spreadsheet key. Storing a display label here
		// would leave the pharmacist's checklist unable to resolve it, so it is
		// rejected rather than stored and silently ignored later.
		if (body.drug != null && body.drug !== "") drugOf(body.drug);
		const { rows } = await query(
			`WITH ins_p AS (
			   INSERT INTO patients (mrn_hash, mrn_tail, age_band)
			   VALUES ($1,$2,$3)
			   ON CONFLICT (mrn_hash) DO UPDATE SET age_band = patients.age_band
			   RETURNING id
			 ), ins_s AS (
			   INSERT INTO sessions (patient_id, device, drug, completed_at)
			   SELECT id,$4,$7,CASE WHEN $5 THEN now() END FROM ins_p RETURNING id
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
				body.drug ?? null,
			],
		);
		return { ok: true, ...rows[0] };
	}

	/** GET /api/reference — the spine, so a client never hardcodes it. */
	async function reference() {
		return {
			ok: true,
			drugs: ALL_DRUGS,
			pharmacists: PHARMACISTS,
			knowledge: KNOWLEDGE,
			steps: ALL_STEP_CODES,
		};
	}

	/**
	 * GET /api/sessions/pending?mrn= — the pharmacist types the record number and
	 * the camera's results come back already filled in. This is what removes the
	 * eight taps from the form.
	 */
	async function pendingSession(q = {}) {
		const mrn = String(q.mrn ?? "").trim();
		if (!mrn) bad("mrn is required");
		const { rows } = await query(
			`SELECT s.id, s.device, s.drug, s.started_at,
			        COALESCE(jsonb_object_agg(st.stage,
			          jsonb_build_object('passed', st.passed,
			                             'attempts', st.attempts,
			                             'ai_confidence', st.ai_confidence))
			        FILTER (WHERE st.stage IS NOT NULL), '{}'::jsonb) AS stages
			 FROM sessions s
			 JOIN patients p ON p.id = s.patient_id
			 LEFT JOIN session_stages st ON st.session_id = s.id
			 WHERE p.mrn_hash = $1
			 GROUP BY s.id
			 ORDER BY s.started_at DESC
			 LIMIT 1`,
			[hashMrn(mrn, salt)],
		);
		if (!rows[0]) return { ok: true, found: false, steps: {} };

		const steps = {};
		for (const [stage, result] of Object.entries(rows[0].stages)) {
			Object.assign(steps, stageVerdicts(Number(stage), result));
		}
		return {
			ok: true,
			found: true,
			device: rows[0].device,
			drug: rows[0].drug ?? undefined,
			startedAt: rows[0].started_at,
			steps,
		};
	}

	/**
	 * GET /api/followups — the pharmacist's open queue.
	 *
	 * Carries the steps the original case got wrong. The queue used to say only
	 * 「有關鍵錯誤：2 週內再評估」, which tells a pharmacist that something failed
	 * but not what to re-check — the step codes were already in case_steps and
	 * were being thrown away. A follow-up row that cannot say what to check
	 * cannot be worked, which is consistent with a completion rate of zero.
	 *
	 * Aggregated in SQL rather than per row so the queue stays one request; a
	 * follow-up row with no linked case (possible: the FK is ON DELETE SET NULL)
	 * yields an empty list rather than dropping the row.
	 */
	async function followups() {
		const { rows } = await query(
			`SELECT f.id, f.task, f.due_start, f.due_end, f.priority, f.status,
			        f.case_id, p.id AS patient_id,
			        p.mrn_tail, c.drug, c.device, c.pharmacist,
			        COALESCE(w.steps, '[]'::json) AS wrong_steps
			 FROM followups f
			 JOIN patients p ON p.id = f.patient_id
			 LEFT JOIN cases c ON c.id = f.case_id
			 LEFT JOIN LATERAL (
			     SELECT json_agg(cs.step_code) AS steps
			     FROM case_steps cs
			     WHERE cs.case_id = f.case_id AND cs.value = '錯誤'
			 ) w ON true
			 WHERE f.status = 'open'
			 ORDER BY f.due_start`,
		);
		const today = new Date().toISOString().slice(0, 10);
		return {
			ok: true,
			followups: rows.map((r) => ({
				...r,
				wrongSteps: r.wrong_steps ?? [],
				overdue: r.due_end < today,
				dueSoon: r.due_end >= today && r.due_end <= addDays(today, 3),
			})),
		};
	}

	/**
	 * POST /api/followups/close — record that a follow-up was actually done.
	 *
	 * The baseline had 62 cases at M0 and zero at M1. A queue that can be read
	 * but not closed cannot produce an M1, so closing is a first-class action
	 * rather than a database edit nobody makes.
	 *
	 * Re-closing is rejected rather than silently ignored: the second click is
	 * either a double tap or two pharmacists disagreeing, and both deserve to be
	 * visible.
	 */
	async function closeFollowup(body) {
		const id = String(body?.id ?? "");
		const by = String(body?.by ?? "").trim();
		if (!id) bad("id is required");
		if (!by) bad("by is required: an unattributed close cannot be audited");
		const status = body?.status === "missed" ? "missed" : "done";

		/*
		 * An assessment on the close is the M1 evaluation, and it is the point of
		 * the follow-up: closing used to record only who and when, so the queue
		 * could be emptied without producing a single assessment row, and the
		 * before/after the plan is built on could never gain a case from real
		 * work. Thirty-seven open follow-ups and a 0% completion rate are the
		 * same fact.
		 *
		 * The case is written first. If the assessment is invalid the whole
		 * closure is rejected and the follow-up stays open, because a follow-up
		 * marked done with no recorded assessment is exactly the dead end this
		 * removes.
		 */
		let assessment = null;
		if (body?.assessment && status === "done") {
			const { rows: ctx } = await query(
				`SELECT f.case_id, f.patient_id, c.drug, c.device, c.campus, c.timepoint
				 FROM followups f LEFT JOIN cases c ON c.id = f.case_id
				 WHERE f.id = $1 AND f.status = 'open'`,
				[id],
			);
			if (!ctx[0])
				throw new HttpError(404, "follow-up not found or already closed");
			if (!ctx[0].drug)
				bad(
					"this follow-up has no linked case, so an assessment cannot be recorded against it",
				);

			assessment = await createCase({
				patientId: ctx[0].patient_id,
				caseDate: new Date().toISOString().slice(0, 10),
				timepoint: "M1",
				qccStage: "改善後",
				campus: ctx[0].campus ?? "虎尾",
				pharmacist: by,
				drug: ctx[0].drug,
				steps: body.assessment.steps ?? {},
				knowledge: body.assessment.knowledge ?? {},
				demonstrated: body.assessment.demonstrated ?? {},
			});
		}

		const { rows } = await query(
			`UPDATE followups SET status = $2, completed_at = now(), completed_by = $3,
			        completed_note = NULLIF($4, '')
			 WHERE id = $1 AND status = 'open'
			 RETURNING id, status, completed_at, completed_by`,
			[id, status, by, String(body?.note ?? "").trim()],
		);
		if (rows[0])
			return {
				ok: true,
				...rows[0],
				// Present only when an assessment was recorded, so a caller can
				// tell "closed" from "closed and measured".
				...(assessment ? { assessment } : {}),
			};

		// Distinguish "already closed" from "no such row": the first is a
		// conflict the caller can show, the second is a bad id.
		const { rows: existing } = await query(
			"SELECT id, status, completed_by FROM followups WHERE id = $1",
			[id],
		);
		if (!existing[0]) throw new HttpError(404, "follow-up not found");
		throw new HttpError(
			409,
			`already ${existing[0].status}${existing[0].completed_by ? ` by ${existing[0].completed_by}` : ""}`,
		);
	}

	/**
	 * POST /api/line/link — bind a LINE account to a patient and record consent.
	 *
	 * The record number is hashed here and nowhere else, so a plain identifier
	 * never reaches the LINE layer.
	 */
	async function lineLink(body) {
		if (!body?.mrn || !body?.lineUserId) bad("mrn and lineUserId are required");
		return line.link({
			mrn: hashMrn(String(body.mrn), salt),
			lineUserId: String(body.lineUserId),
		});
	}

	/** GET /api/line/plan?case_id= — what would be sent, and what it costs. */
	async function linePlan({ case_id }) {
		if (!case_id) bad("case_id is required");
		return line.plan({ caseId: String(case_id) });
	}

	/**
	 * POST /api/line/journeys — the LIFF registration endpoint.
	 *
	 * Mirrors the pharmacist's POST /api/journeys/start minus the parts this
	 * schema refuses to invent: no patient row is created (the pharmacy
	 * counter owns that, with age band and MRN tail), no name is stored
	 * (patients have no name column), and nothing is sent (D0 stays on the
	 * pharmacist-triggered send path). What it does: validate, link with
	 * consent, file the medication list, return the dual tags.
	 */
	async function lineJourneys(body) {
		if (!body?.identifier || !String(body.identifier).trim())
			bad("identifier is required");
		if (!body?.name || !String(body.name).trim()) bad("name is required");
		if (!body?.lineUserId) bad("lineUserId is required");
		return line.register({
			mrn: hashMrn(String(body.identifier), salt),
			lineUserId: String(body.lineUserId),
			medications: Array.isArray(body.medications) ? body.medications : [],
		});
	}

	/**
	 * POST /api/line/send — deliver one planned touch.
	 *
	 * Refuses unless the patient has both consented and a linked account, so a
	 * missing consent cannot be routed around by calling this directly.
	 */
	async function lineSend(body) {
		const { rows } = await query(
			`SELECT p.id, li.line_user_id FROM patients p
			 JOIN line_identities li ON li.patient_id = p.id
			 WHERE p.mrn_hash = $1 AND p.consent_line`,
			[hashMrn(String(body?.mrn ?? ""), salt)],
		);
		if (!rows[0])
			throw new HttpError(403, "no consented LINE account for this patient");
		return line.send({
			patientId: rows[0].id,
			lineUserId: rows[0].line_user_id,
			touch: String(body.touch),
			kind: String(body.kind),
			message: body.message,
			sentOn: String(body.sentOn),
		});
	}

	/** POST /api/line/event — the webhook. Handles conversational bot replies & dedupe. */
	async function lineEvent(body) {
		return handleLineWebhook({
			events: body?.events ?? [],
			query,
			transport: line.transport,
			salt,
		});
	}

	/** GET /api/line/engagement?since= — did the channel actually work. */
	async function lineEngagement({ since }) {
		return line.engagement({ since: since ?? "1970-01-01" });
	}

	/** GET /api/admin/config — fetch dynamic configuration for videos, quizzes, and drug photos */
	async function getAdminConfig() {
		const defaults = {
			videos: loadDefaultJson("../src/line/data/videos.json") ?? [],
			quizzes: loadDefaultJson("../src/line/data/quizzes.json") ?? {},
			drugs: loadDefaultJson("../src/line/data/drugs.json") ?? [],
		};

		try {
			const { rows } = await query(
				"SELECT config_key, config_value, updated_at, updated_by FROM admin_config",
			);
			const out = { ...defaults, updated: {} };
			for (const r of rows) {
				const val =
					typeof r.config_value === "string"
						? JSON.parse(r.config_value)
						: r.config_value;
				out[r.config_key] = val;
				out.updated[r.config_key] = {
					at: r.updated_at,
					by: r.updated_by,
				};
			}
			return { ok: true, config: out };
		} catch {
			return { ok: true, config: { ...defaults, updated: {} } };
		}
	}

	/** POST /api/admin/config — update dynamic configuration */
	async function updateAdminConfig(body) {
		const key = body?.key || body?.section;
		const value = body?.value ?? body?.data;
		const user = body?.user || "admin";

		if (!key || !["videos", "quizzes", "drugs"].includes(key)) {
			bad("Invalid config key. Allowed: videos, quizzes, drugs");
		}
		if (value === undefined) {
			bad("Value is required");
		}

		try {
			await query(
				`INSERT INTO admin_config (config_key, config_value, updated_at, updated_by)
				 VALUES ($1, $2, now(), $3)
				 ON CONFLICT (config_key) DO UPDATE
				 SET config_value = $2, updated_at = now(), updated_by = $3`,
				[key, JSON.stringify(value), user],
			);
			return { ok: true, key, updated: true };
		} catch (err) {
			return { ok: false, error: err.message };
		}
	}

	return {
		health,
		createCase,
		listCases,
		lookupCases,
		summary,
		recordSession,
		reference,
		followups,
		closeFollowup,
		pendingSession,
		lineLink,
		linePlan,
		lineJourneys,
		lineSend,
		lineEvent,
		lineEngagement,
		getAdminConfig,
		updateAdminConfig,
		lineChannel: line.channel,
		lineTransport: line.transport,
	};
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
		// Needed to pair a patient's before and after; the plan's design is
		// single-group pre-post, so the analysis unit is the person, not the case.
		patientId: r.patient_id ?? null,
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
