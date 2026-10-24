/**
 * API handlers. Every handler takes an injected `query` so the whole surface is
 * testable against a real Postgres without starting a server.
 *
 * PHI rule: a response may carry mrn_tail, never mrn_hash.
 */

import { ALL_DRUGS, drugOf } from "../src/domain/drugs.js";
import {
	ENROLLMENT_BASIC_FIELDS,
	STAGE_BEFORE,
	stageForTimepoint,
} from "../src/domain/enrollment-sheet.js";
import {
	RETURN_VISITS,
	slotPriority,
	slotTask,
} from "../src/domain/followup-schedule.js";
import { KNOWLEDGE, PHARMACISTS } from "../src/domain/roster.js";
import { stageVerdicts } from "../src/domain/stages.js";
import { ALL_STEP_CODES, isCritical } from "../src/domain/steps.js";
import {
	ARM_CONTROL,
	ARM_EXPERIMENTAL,
	ARM_LABEL,
	ARM_SOURCE_ALTERNATING,
	ARM_SOURCE_MANUAL,
	armBalance,
	armSourceFor,
	inStudyCohort,
	isArm,
	nextArm,
	STUDY_COHORT_LABEL,
	STUDY_TARGET,
} from "../src/domain/study-arm.js";
import { hashMrn, mrnTail } from "./db.mjs";
import { HttpError } from "./http-error.mjs";
import { exportEnrollment, importEnrollment } from "./import-export.mjs";
import { DEFAULT_QUIZZES, DEFAULT_VIDEOS } from "./line/config.mjs";
import { CLINICAL_DRUG_CARDS } from "./line/flex.mjs";
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
import { writeXlsx } from "./xlsx.mjs";

// Re-exported so the callers that already import HttpError from here keep
// working; the class itself lives in its own module because the auth layer
// needs it too.

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

	/*
	 * ── the 1:1 allocation ──────────────────────────────────────────────────
	 *
	 * The study runs one patient against one: 實驗組 (AI 練習) and 對照組
	 * (一般衛教), alternating, one to one. The pharmacist may put any single
	 * patient in the other group, and the count on screen has to show it.
	 *
	 * The rule lives in src/domain/study-arm.js and nowhere else, because the
	 * form that shows the suggestion, the API that allocates the arm and the
	 * count that stays on screen all have to agree on it. What lives here is
	 * the part that is the database's business: the pointer to the last arm
	 * allocated, and the check that makes sure two enrollments at the same
	 * moment cannot both be told they are the next experimental patient.
	 */
	const ARM_ALLOC_KEY = "study_arm_alloc";

	/**
	 * The arm the last patient was allocated, or null when there is none yet.
	 *
	 * It is a pointer, not a counter. The counts are always read from the cases
	 * table, because the cases are the record: a counter that drifted away
	 * from them would be a second, disagreeing truth about who is in which arm.
	 */
	async function armPointer() {
		// The row is seeded by db/schema.sql. The insert here is the belt to
		// that braces: a database that was migrated before the seed existed
		// still has to be able to allocate.
		await query(
			`INSERT INTO admin_config (config_key, config_value)
			 VALUES ($1, '{"lastArm": null}'::jsonb)
			 ON CONFLICT (config_key) DO NOTHING`,
			[ARM_ALLOC_KEY],
		);
		const { rows } = await query(
			`SELECT config_value->>'lastArm' AS last_arm
			   FROM admin_config WHERE config_key = $1`,
			[ARM_ALLOC_KEY],
		);
		return rows[0]?.last_arm ?? null;
	}

	/**
	 * The arm this patient already has, if any.
	 *
	 * The arm belongs to the patient, not to the row. An M1 assessment and a
	 * re-enrollment are the same person, so they carry the arm the enrollment
	 * was given — otherwise one patient would sit in two groups and the balance
	 * on screen would be counting rows instead of people.
	 */
	async function patientArm(mrn, patientId) {
		const mrnHash = mrn ? hashMrn(mrn, salt) : null;
		const { rows } = await query(
			`SELECT c.study_arm, c.arm_source
			   FROM cases c JOIN patients p ON p.id = c.patient_id
			  WHERE c.study_arm IS NOT NULL
			    AND (($1::text IS NOT NULL AND p.mrn_hash = $1::text)
			      OR ($2::uuid IS NOT NULL AND p.id = $2::uuid))
			  ORDER BY c.created_at ASC
			  LIMIT 1`,
			[mrnHash, patientId],
		);
		return rows[0] ?? null;
	}

	/**
	 * How many people the study has enrolled.
	 *
	 * People, not rows: the plan enrolled a hundred patients, and a patient
	 * with an M1 assessment and a re-enrollment is still one patient.
	 */
	async function studyEnrolled() {
		const { rows } = await query(
			`SELECT count(DISTINCT patient_id)::int AS people
			   FROM cases
			  WHERE study_arm IS NOT NULL`,
		);
		return rows[0]?.people ?? 0;
	}

	/**
	 * Has the plan taken everyone it was going to take?
	 */
	async function studyIsFull() {
		return (await studyEnrolled()) >= STUDY_TARGET;
	}

	/**
	 * What happens when the plan is full and a new patient arrives.
	 *
	 * The case is still enrolled — the checklist, the follow-up visits and the
	 * before/after comparison are the QCC's, and they do not stop because a
	 * study finished. What stops is the group.
	 *
	 * An explicit request is refused rather than dropped: the screen hides the
	 * choice when the study is full, so a request means the screen is out of
	 * date, and quietly dropping the arm would leave the pharmacist believing
	 * the patient is in the study.
	 */
	function whenStudyIsFull(requestedArm) {
		if (requestedArm !== null) {
			throw new HttpError(
				409,
				`研究計畫已收滿 ${STUDY_TARGET} 人，這位病人不再分派組別。請重新整理頁面後再收案。`,
			);
		}
		return {
			arm: null,
			armSource: null,
			previous: null,
			allocate: false,
			full: true,
		};
	}

	/**
	 * How the arm was decided.
	 *
	 * The rotation's own choice is the rotation's choice; a group the
	 * pharmacist moved is her choice, and the study has to be able to tell the
	 * two apart. A patient who already had an arm keeps how they got it.
	 */
	function decideArmSource(requestedArm, suggested, inherited, allocate) {
		if (!requestedArm) return inherited?.arm_source ?? ARM_SOURCE_ALTERNATING;
		if (!allocate) return ARM_SOURCE_MANUAL;
		return armSourceFor(requestedArm, suggested);
	}

	/**
	 * Which arm this case gets, and how it was decided.
	 *
	 * A new patient gets the rotation's next arm unless the pharmacist names
	 * one. A patient who already has an arm keeps it — an M1 assessment and a
	 * re-enrollment are the same person, and giving them a second arm would
	 * put one patient in two groups and turn the balance on screen into a
	 * count of rows.
	 *
	 * A case outside the research cohort carries no arm at all. NULL is not
	 * the same as 對照組: it means the case was never in the study, and a QCC
	 * analysis that treated NULL as a group would be inventing one.
	 *
	 * The plan takes a hundred people. A hundred and first is not a patient
	 * the plan agreed to see, so a new patient does not enter a study that is
	 * already full. A patient who is already in the study keeps their arm
	 * whatever the count says: the cap is about new people, not about the ones
	 * already counted.
	 */
	async function decideArm(mrn, patientId, requestedArm, inCohort) {
		if (!inCohort)
			return { arm: null, armSource: null, previous: null, allocate: false };
		const inherited = await patientArm(mrn, patientId);
		const allocate = !inherited;
		if (allocate && (await studyIsFull())) return whenStudyIsFull(requestedArm);
		const previous = allocate ? await armPointer() : null;
		// What this patient would get if nobody decided otherwise: the
		// rotation's next arm for a new patient, and the opposite of what they
		// already have for one who does.
		const suggested = allocate
			? nextArm(previous)
			: nextArm(inherited.study_arm);
		const arm = requestedArm ?? inherited?.study_arm ?? suggested;
		const armSource = decideArmSource(
			requestedArm,
			suggested,
			inherited,
			allocate,
		);
		return { arm, armSource, previous, allocate };
	}

	/**
	 * GET /api/study/arms — the balance, and where the rotation points next.
	 *
	 * The counts are people, not rows: the pharmacist asks 「兩組各幾個人」 and
	 * the answer is people. The case counts come with them so the number can
	 * be reconciled against the list.
	 */
	async function studyArms() {
		const { rows } = await query(
			`SELECT study_arm,
			        count(DISTINCT patient_id)::int AS people,
			        count(*)::int AS cases
			   FROM cases
			  WHERE study_arm IS NOT NULL
			  GROUP BY study_arm`,
		);
		const counts = { experimental: 0, control: 0 };
		const cases = { experimental: 0, control: 0 };
		for (const r of rows) {
			counts[r.study_arm] = r.people;
			cases[r.study_arm] = r.cases;
		}
		const previous = await armPointer();
		return {
			ok: true,
			...armBalance({ ...counts, previous }),
			cases,
		};
	}

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
				// Whether this deployment really sends, or only rehearses.
				// The deployment check script reads this: it is the only honest
				// way to report the state of a deployed system from a laptop
				// whose own environment variables say nothing about it.
				lineSending: line.channel === "live" ? "live" : "rehearsal",
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
		if (!["M0", "M1", "M3", "M6"].includes(timepoint))
			bad(`unknown timepoint ${timepoint}`);
		if (!PHARMACISTS.includes(body.pharmacist))
			bad(`unknown pharmacist ${body.pharmacist}`);

		/*
		 * Which measurement this row is.
		 *
		 * It follows from the timepoint and from nothing else. M0 is the
		 * enrollment — the patient's baseline — so it is 前測＝改善前; M1 and
		 * later are the follow-ups, so they are 後測＝改善後. 10/19 會議【八】:
		 * 林藥師「因為我現在是對策前，後面沒有追蹤分析，未來我是想做一個月後
		 * （M1）追蹤成效有沒有改善」。 QCC 附件七 compares the two the same
		 * way: 改善前後對比 is M0 vs M1.
		 *
		 * It used to be 「改善後」 for everything, which meant a newly enrolled
		 * patient had no before-measurement to be compared against and never
		 * appeared in the before/after numbers at all.
		 *
		 * A caller that names a stage which disagrees with the timepoint is
		 * refused rather than quietly corrected: the two words say the same
		 * thing, so one of them is a mistake, and a silent fix would leave the
		 * mistake in the record of whoever typed it.
		 */
		const stage = stageForTimepoint(timepoint);
		if (body.qccStage && body.qccStage !== stage) {
			bad(
				`追蹤時間點 ${timepoint} 是${
					stage === STAGE_BEFORE ? "前測" : "後測"
				}（${stage}），不能記成${body.qccStage}`,
			);
		}

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
		// error -> the routine M1 window.
		const wrongCodes = Object.entries(steps)
			.filter(([, v]) => v === "錯誤")
			.map(([code]) => code);
		const hasCritical = wrongCodes.some((c) => isCritical(c));

		/*
		 * The return-visit slots.
		 *
		 * 10/19 會議記錄【五】：個案加入後，等他第 28 天（或第 14、21 天）回診時，
		 * 後台清單會提示今天有哪些病患需要進行 Checklist 追蹤，藥師點進去就能勾選填寫，
		 * 不需要再人工記日子。
		 *
		 * So an enrollment enqueues its three planned return visits, and the day
		 * of the visit is what the queue shows. A critical error rides on the
		 * first slot instead of creating a second row for the same visit.
		 *
		 * Only for an enrollment. A follow-up assessment creates an M1, and an
		 * M1 that enqueued three more slots would grow the queue every time a
		 * pharmacist worked through it.
		 */
		/*
		 * The 基本表格.
		 *
		 * Checked here rather than left to the database's CHECK constraints,
		 * because a constraint violation arrives as a 500 — which tells the
		 * pharmacist nothing about which field was wrong. The option lists are
		 * the domain's, the same ones the form shows and the sheet's columns
		 * carry.
		 */
		const basicOption = (value, key) => {
			if (value === undefined || value === null || value === "") return null;
			const field = ENROLLMENT_BASIC_FIELDS.find((f) => f.key === key);
			if (!field?.options?.includes(value)) {
				bad(`${field?.label ?? key} 不接受這個值：${value}`);
			}
			return value;
		};
		const caseType = basicOption(body.caseType, "caseType");
		const ageBand = basicOption(body.ageBand, "ageBand") ?? "18-64歲";
		const sex = basicOption(body.sex, "sex");
		const usageDuration = basicOption(body.usageDuration, "usageDuration");
		const priorEducation = basicOption(body.priorEducation, "priorEducation");
		const educationMinutes =
			body.educationMinutes === undefined ||
			body.educationMinutes === null ||
			body.educationMinutes === ""
				? null
				: Math.round(Number(body.educationMinutes));

		const slots =
			timepoint === "M0"
				? RETURN_VISITS.map((visit) => ({
						task: slotTask(visit, hasCritical),
						day: visit.day,
						priority: slotPriority(visit, hasCritical),
						slot: visit.slot,
					}))
				: [];

		/*
		 * Which arm of the study this case belongs to.
		 *
		 * The pharmacist may name one. Left out, the rotation decides. The
		 * check is here rather than in the database's CHECK constraint, because
		 * a constraint violation arrives as a 500 and tells the pharmacist
		 * nothing about which field was wrong.
		 *
		 * The allocation belongs to the research plan, and the research plan is
		 * the cohort: 吸必擴. A case for another inhaler is a QCC case, and a
		 * QCC case does not carry a research label — it would count as a
		 * person who is not in the study, and the balance on screen would be
		 * a number about the wrong programme.
		 */
		const inCohort = inStudyCohort(drug.name);
		const requestedArm =
			body.studyArm === undefined ||
			body.studyArm === null ||
			body.studyArm === ""
				? null
				: String(body.studyArm);
		if (requestedArm !== null && !isArm(requestedArm)) {
			bad(
				`研究組別只能是 ${ARM_LABEL[ARM_EXPERIMENTAL]} 或 ${ARM_LABEL[ARM_CONTROL]}`,
			);
		}
		if (requestedArm !== null && !inCohort) {
			bad(
				`研究計畫的組別分派目前只適用於 ${STUDY_COHORT_LABEL}，${drug.label} 不在研究範圍內`,
			);
		}

		const baseParams = [
			// $1 is the patient handle the branch above expects: the existing
			// id when one was given, otherwise the hash of the record number.
			patientId ?? hashMrn(mrn, salt),
			patientId ? "" : mrnTail(mrn),
			ageBand,
			sex,
			body.diagnosis ?? null,
			body.studyId ?? null,
			body.caseDate,
			timepoint,
			// The stage is the timepoint's, not the caller's: M0 is 前測
			//（改善前）, M1 and later are 後測（改善後）. See the rule above.
			stage,
			body.campus ?? "虎尾",
			body.pharmacist,
			drug.device,
			body.drug,
			drug.hasIcs,
			drug.needsShake,
			caseType,
			// factors is text[] — pass the array, not a JSON string.
			body.factors ?? [],
			body.useQcc !== false,
			Boolean(body.useResearch),
			recordId,
			JSON.stringify(steps),
			JSON.stringify(body.stepNotes ?? {}),
			JSON.stringify(knowledge),
			JSON.stringify(body.measurements ?? {}),
			slots.map((s) => s.task),
			slots.map((s) => s.day),
			slots.map((s) => s.priority),
			slots.map((s) => s.slot),
			JSON.stringify(demonstrated),
			usageDuration,
			priorEducation,
			educationMinutes,
		];

		/*
		 * Allocate the arm and write the case in one statement.
		 *
		 * The allocation is the rotation's decision and the pharmacist may
		 * override it, so the two have to land together: an arm that was
		 * allocated but never written to a case would leave the pointer one
		 * ahead of the record, and the next patient would be told they are the
		 * next experimental one when they are not.
		 *
		 * The check inside the statement is what keeps two enrollments at the
		 * same moment from claiming the same patient slot: the allocation only
		 * goes through if the pointer still says what it said when the arm was
		 * decided. When it does not, the statement writes nothing at all — not
		 * the case, not the steps — and the loop below reads the pointer again
		 * and starts over. That is why the case insert is conditional on the
		 * allocation having gone through.
		 */
		let rows = [];
		// Whether this case went in without a group because the plan was full.
		// The pharmacist is told; she is not left to wonder.
		let studyFull = false;
		for (let attempt = 0; attempt < 5; attempt++) {
			const { arm, armSource, previous, allocate, full } = await decideArm(
				mrn,
				patientId,
				requestedArm,
				inCohort,
			);
			studyFull = Boolean(full);

			const result = await query(
				`WITH alloc AS (
			   UPDATE admin_config
			      SET config_value = jsonb_set(config_value, '{lastArm}', to_jsonb($33::text)),
			          updated_at = now(), updated_by = 'study-arm-allocation'
			    WHERE config_key = 'study_arm_alloc'
			      AND $36::boolean
			      -- The pointer still says what it said when this arm was
			      -- decided. If it does not, another enrollment got there
			      -- first and this statement writes nothing.
			      AND config_value->>'lastArm' IS NOT DISTINCT FROM $35::text
			   RETURNING config_key
			 ), ins_p AS (
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
			                      usage_duration, prior_education, education_minutes,
			                      factors, use_qcc, use_research, record_id,
			                      study_arm, arm_source)
			   -- $30..$32 are the 基本表格 columns that used to be accepted by
			   -- the API and then dropped on the floor: the case was written
			   -- without them, so the sheet's row and the platform's row were
			   -- never the same thing.
			   SELECT id,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$30,$31,$32,$17,$18,$19,$20,
			          $33,$34
			   FROM ins_p
			   -- Nothing is written unless the allocation went through: a case
			   -- without an arm is a case the study cannot count.
			   WHERE $36::boolean = false OR EXISTS (SELECT 1 FROM alloc)
			   -- case_date comes back via RETURNING for the same reason as
			   -- mrn_tail: a sibling CTE reading the cases table sees the old snapshot.
			   RETURNING id, patient_id, record_id, case_date, study_arm, arm_source
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
			   INSERT INTO followups (patient_id, case_id, task, due_start, due_end, priority, slot)
			   -- One row per planned return visit. The four arrays are parallel:
			   -- unnest of an empty array yields no rows, which is how an M1 (no
			   -- slots) inserts nothing at all.
			   SELECT ins_c.patient_id, ins_c.id, s.task,
			          (ins_c.case_date + s.day)::date,
			          (ins_c.case_date + s.day)::date,
			          s.priority,
			          s.slot
			   FROM ins_c
			   CROSS JOIN unnest($25::text[], $26::int[], $27::text[], $28::text[])
			        AS s(task, day, priority, slot)
			   RETURNING 1
			 )
			 SELECT ins_c.id, ins_c.record_id, ins_c.patient_id, ins_p.mrn_tail,
			        ins_c.study_arm, ins_c.arm_source,
			        (SELECT count(*) FROM ins_s)::int AS steps,
			        (SELECT count(*) FROM ins_k)::int AS knowledge,
			        (SELECT count(*) FROM ins_m)::int AS measures,
			        (SELECT count(*) FROM ins_f)::int AS followup
			 FROM ins_c JOIN ins_p ON ins_p.id = ins_c.patient_id`,
				[
					...baseParams,
					// $33 the arm, $34 how it was decided, $35 the pointer the
					// arm was decided against, $36 whether this case allocates.
					arm,
					armSource,
					previous,
					allocate,
				],
			);
			rows = result.rows;
			if (rows[0]) break;
			// The allocation lost the race: the pointer moved, so this arm was
			// decided against a value that is no longer true. Read it again.
		}

		if (!rows[0]) throw new HttpError(409, "剛好有別人同時在收案，請再按一次");
		return { ok: true, ...rows[0], studyFull };
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
			   -- Planned visits that another visit replaced. Not outstanding work
			   -- and not a missed visit either: the patient came back once and
			   -- was seen.
			   (SELECT count(*) FROM followups WHERE status = 'superseded')::int AS fu_superseded,
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
		//
		// Superseded visits are excluded from the cohort entirely. A visit that
		// another visit replaced was never outstanding, so counting it as
		// "due but not done" would report a completion rate that measures the
		// schedule rather than the pharmacist.
		const { rows: dueRows } = await query(
			`SELECT
			   count(*) FILTER (WHERE due_end <= current_date
			                    AND status <> 'superseded')::int AS due,
			   count(*) FILTER (WHERE due_end <= current_date
			                    AND status = 'done')::int AS due_done
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
				enrolled: await enrolledCount(),
			},
			engagement: await engagement(),
		};
	}

	/**
	 * How many patients have been enrolled in the platform.
	 *
	 * The enrollment is the case that scheduled the return visits: only an
	 * enrollment does that, and a row imported from the pharmacist's sheet never
	 * does — which is what separates this study's 收案 from the 對策前 cohort
	 * she collected in April and May.
	 *
	 * It used to be counted as the 改善後 cases. That worked only while the
	 * enrollment was filed as 改善後; the enrollment is 前測（改善前） now
	 * (10/19 會議【八】), so the same count would have measured the return
	 * visits instead of the enrollments — and the tile would have said 收案 0/30
	 * on a platform where thirty patients had been enrolled.
	 */
	async function enrolledCount() {
		const { rows } = await query(
			`SELECT count(*)::int AS n FROM cases c
			 WHERE c.timepoint = 'M0'
			   AND EXISTS (SELECT 1 FROM followups f WHERE f.case_id = c.id)`,
		);
		return rows[0]?.n ?? 0;
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
			`SELECT f.id, f.task, f.due_start, f.due_end, f.priority, f.status, f.slot,
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
		const list = rows.map((r) => ({
			...r,
			wrongSteps: r.wrong_steps ?? [],
			overdue: r.due_end < today,
			// Today is inside the due window. A scheduled return visit is a
			// one-day window, so this is exactly 「今天這位要回診」; a wider
			// legacy window counts every day it spans, which is what a window
			// means.
			dueToday: r.due_start <= today && today <= r.due_end,
			dueSoon: r.due_end >= today && r.due_end <= addDays(today, 3),
		}));
		return {
			ok: true,
			followups: list,
			// The queue's own summary. 「今天有誰要回診」 is the question the
			// pharmacist asks first (10/19 會議【五】), and 「還有多少沒做」 is
			// the one they ask second, so both are counted here rather than left
			// for the screen to work out from the rows.
			dueToday: list.filter((f) => f.dueToday).length,
			overdue: list.filter((f) => f.overdue).length,
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
				// No stage is named: an M1 is the after-measurement (後測＝改善後)
				// because the rule follows from the timepoint. The enrollment it
				// is compared against is the 改善前 row, and that pairing is the
				// whole point of the queue.
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
		if (rows[0]) {
			/*
			 * The other planned return visits.
			 *
			 * An enrollment has three slots — D14, D21, D28 — and the patient
			 * comes back once, on whichever of them the clinic saw them. When
			 * that visit is closed, the other two are not outstanding work and
			 * not missed visits either: they were replaced by the one that
			 * happened.
			 *
			 * Left open, each would come due in turn and ask for a second
			 * Checklist the patient has already had, and the queue would fill
			 * with work that no longer exists — the failure mode of a
			 * reminder that never gets to stop.
			 *
			 * A miss does not supersede anything: the patient did not come, so
			 * the next slot is still a real chance to see them.
			 */
			let superseded = 0;
			if (status === "done") {
				const { rows: gone } = await query(
					`UPDATE followups SET status = 'superseded', completed_at = now(),
					        completed_by = $2,
					        completed_note = COALESCE(completed_note, '同次回診已完成')
					 WHERE status = 'open' AND id <> $1
					   AND patient_id = (SELECT patient_id FROM followups WHERE id = $1)
					   AND case_id IS NOT DISTINCT FROM
					       (SELECT case_id FROM followups WHERE id = $1)
					 RETURNING id`,
					[id, by],
				);
				superseded = gone.length;
			}
			return {
				ok: true,
				...rows[0],
				// Present only when an assessment was recorded, so a caller can
				// tell "closed" from "closed and measured".
				...(assessment ? { assessment } : {}),
				// How many other planned visits this one replaced.
				superseded,
			};
		}

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

	/**
	 * POST /api/line/dispatch — send the journey touches that are due today.
	 *
	 * The endpoint a scheduler calls once a day. It refuses to send more than
	 * the month's free allowance allows, and it will not message a patient who
	 * was already messaged that day.
	 *
	 * `dry_run` computes the whole day without sending anything: the way to
	 * see what a deployment would do before it does it to a patient.
	 */
	async function lineDispatch(body) {
		const flag = body?.dry_run ?? body?.dryRun;
		return line.dispatchJourney({
			date: body?.date ? String(body.date) : undefined,
			dryRun: flag === true || flag === "true" || flag === "1",
		});
	}

	/** GET /api/line/quota?month=YYYY-MM — what the month has cost so far. */
	async function lineQuota({ month }) {
		const now = new Date();
		const target = month
			? String(month)
			: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
		return line.quotaUsage({ month: target });
	}

	/** GET /api/line/journey?month=YYYY-MM — who has been reached, who has not. */
	async function lineJourney({ month }) {
		if (!month) bad("month is required");
		return line.journeyBoard({ month: String(month) });
	}

	/**
	 * POST /api/import/cases — import the pharmacist's QCC sheet.
	 *
	 * The body is the workbook itself. `?stage=改善前|改善後` says which
	 * measurement the rows belong to, because the sheet does not say: it is
	 * the pharmacist's pre-intervention data, and the stage is a fact about
	 * the study, not about the row.
	 *
	 * `?dry_run=true` parses and reports without writing anything.
	 */
	async function importCases(body, params) {
		if (!Buffer.isBuffer(body) || body.length === 0) {
			bad("the request body must be an .xlsx file");
		}
		return importEnrollment(query, {
			buffer: body,
			salt,
			stage: params?.stage ? String(params.stage) : undefined,
			dryRun: params?.dry_run === "true" || params?.dry_run === "1",
		});
	}

	/**
	 * GET /api/export/cases.xlsx?month=&stage= — the cases as a spreadsheet.
	 *
	 * The record number is not in it: only the tail, which is what a screen
	 * is allowed to show.
	 */
	async function exportCases(params) {
		const { sheets } = await exportEnrollment(query, {
			month: params?.month ? String(params.month) : undefined,
			stage: params?.stage ? String(params.stage) : undefined,
		});
		return writeXlsx(sheets);
	}

	/** GET /api/admin/config — fetch dynamic configuration for videos, quizzes, and drug photos */
	async function getAdminConfig() {
		const defaults = {
			videos: DEFAULT_VIDEOS ?? [],
			quizzes: DEFAULT_QUIZZES ?? {},
			drugs: CLINICAL_DRUG_CARDS,
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
		studyArms,
		lineLink,
		linePlan,
		lineJourneys,
		lineSend,
		lineEvent,
		lineEngagement,
		lineDispatch,
		lineQuota,
		lineJourney,
		importCases,
		exportCases,
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
		// Which of a patient's two measurements counts when there are more than
		// two: the later one. The pairing must not depend on the order the
		// database happened to return the rows in.
		id: r.id ?? null,
		caseDate: r.case_date ?? null,
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
