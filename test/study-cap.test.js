/**
 * The research plan's hundred.
 *
 * The plan is 100 Symbicort patients, 50 AI and 50 usual education. Nothing
 * stopped the hundred and first from being allocated a group, and one extra
 * person makes the balance the analysis compares a different balance from the
 * one the plan agreed to run.
 *
 * The hundred are written directly rather than through the API: what is under
 * test here is the hundred-and-first, not the ninety-nine before it.
 */
import assert from "node:assert/strict";
import { after, before, describe, it } from "node:test";

import { createPool, hashMrn } from "../api/db.mjs";
import { makeRoutes } from "../api/routes.mjs";
import { STUDY_TARGET } from "../src/domain/study-arm.js";

const URL = process.env.DATABASE_URL;
if (!URL) {
	console.error("DATABASE_URL is not set. Run via: bun run test");
	process.exit(1);
}
const SALT = "test-salt";

let pool;
let api;

before(async () => {
	pool = createPool(URL);
	api = makeRoutes({ query: (t, p) => pool.query(t, p), salt: SALT });
	await pool.query(
		"TRUNCATE followups, physician_queries, session_stages, sessions, case_knowledge, case_steps, clinical_measurements, med_reconciliation, cases, patients RESTART IDENTITY CASCADE",
	);
});

after(async () => {
	await pool?.end();
});

/** Fill the study with people, split the way the rotation splits them. */
async function fillStudy(n) {
	const hashes = Array.from({ length: n }, (_, i) =>
		hashMrn(`cap-${i + 1}`, SALT),
	);
	await pool.query(
		`WITH ins AS (
		   INSERT INTO patients (mrn_hash, mrn_tail, age_band, sex)
		   SELECT h, '00', '65歲以上', '男' FROM unnest($1::text[]) AS h
		   RETURNING id, mrn_hash
		 )
		 INSERT INTO cases (patient_id, case_date, timepoint, qcc_stage, campus,
		                    pharmacist, device, drug, study_arm, arm_source)
		 SELECT id, DATE '2026-05-04', 'M0', '改善前', '虎尾', '黃永成', 'MDI',
		        'Symbicort',
		        CASE WHEN row_number() OVER (ORDER BY mrn_hash) % 2 = 1
		             THEN 'experimental' ELSE 'control' END,
		        'alternating'
		   FROM ins`,
		[hashes],
	);
}

const caseFor = (mrn, extra = {}) => ({
	mrn,
	caseDate: "2026-06-04",
	pharmacist: "黃永成",
	drug: "Symbicort",
	timepoint: "M0",
	steps: {},
	...extra,
});

describe("the research plan's hundred", () => {
	it("says how many people the plan takes", () => {
		assert.equal(STUDY_TARGET, 100);
	});

	it("enrols the hundred and first patient without a group", async () => {
		await fillStudy(STUDY_TARGET);
		const r = await api.createCase(caseFor("cap-101"));
		assert.equal(r.ok, true);
		// The case is enrolled: the checklist, the follow-up visits and the
		// before/after comparison all still happen. What stops is the group.
		assert.equal(r.study_arm, null);
		assert.equal(r.studyFull, true);
		assert.ok(r.followup > 0, "追蹤照常排");
	});

	it("says so rather than dropping the group quietly", async () => {
		// A screen that still offers the buttons is a screen that is out of
		// date. Refusing says the plan is full; dropping the arm would leave
		// the pharmacist believing the patient is in the study.
		await assert.rejects(
			() => api.createCase(caseFor("cap-102", { studyArm: "experimental" })),
			/研究計畫已收滿/,
		);
	});

	it("keeps a patient who is already in the study in their group", async () => {
		// The cap is about new people. An M1 assessment is the same person, and
		// a second group would put one patient in two.
		const r = await api.createCase(caseFor("cap-1", { timepoint: "M1" }));
		assert.equal(r.ok, true);
		assert.ok(
			r.study_arm === "experimental" || r.study_arm === "control",
			`組別是 ${r.study_arm}`,
		);
		assert.equal(r.studyFull, false);
	});

	it("reports the plan's number on the balance on screen", async () => {
		const b = await api.studyArms();
		assert.equal(b.target, STUDY_TARGET);
		assert.equal(b.full, true);
		assert.equal(b.remaining, 0);
		// The hundred people, not the hundred and one: a patient with an M1
		// assessment is still one patient.
		assert.equal(b.enrolled, STUDY_TARGET);
	});
});
