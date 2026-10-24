/**
 * Quick lookup: one patient, one screen.
 *
 * The back office was promised four blocks on 2026-10-19 (10/19 會議【五】) and
 * this is the third one, which never got built. It answers one question — what
 * does the platform hold about this patient — and the rules it has to keep:
 *
 * - the record number is hashed server-side and never comes back; only the
 *   tail is shown;
 * - a patient with nothing in the platform is said to have nothing, rather
 *   than being shown as an empty screen;
 * - the visits, the planned return visits and the camera practice come back
 *   together, because a pharmacist asking about a patient wants the whole
 *   picture, not three tabs.
 */
import assert from "node:assert/strict";
import { after, before, describe, it } from "node:test";

import { createPool, hashMrn } from "../api/db.mjs";
import { makeRoutes } from "../api/routes.mjs";

const URL = process.env.DATABASE_URL;
if (!URL) {
	console.error("DATABASE_URL is not set. Run via: bun run test");
	process.exit(1);
}
const SALT = "test-salt";
const MRN = "A123456789";

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

describe("quick lookup", () => {
	it("finds the patient's whole record", async () => {
		const patient = await pool.query(
			`INSERT INTO patients (mrn_hash, mrn_tail, age_band, sex)
			 VALUES ($1, $2, $3, $4) RETURNING id`,
			[hashMrn(MRN, SALT), "6789", "65歲以上", "女"],
		);
		const id = patient.rows[0].id;
		const c = await pool.query(
			`INSERT INTO cases (patient_id, case_date, timepoint, qcc_stage, campus,
			                    pharmacist, device, drug, has_ics)
			 VALUES ($1, $2::date, $3, $4, $5, $6, $7, $8, $9) RETURNING id`,
			[
				id,
				"2026-05-04",
				"M0",
				"改善前",
				"虎尾",
				"黃永成",
				"MDI",
				"Symbicort",
				false,
			],
		);
		await pool.query(
			`INSERT INTO case_steps (case_id, step_code, value) VALUES ($1, $2, $3)`,
			[c.rows[0].id, "MDI_搖", "錯誤"],
		);
		await pool.query(
			`INSERT INTO followups (patient_id, case_id, task, due_start, due_end, priority, status, slot)
			 VALUES ($1, $2, $3, $4::date, $5::date, $6, $7, $8)`,
			[
				id,
				c.rows[0].id,
				"回診評估",
				"2026-05-18",
				"2026-05-18",
				"P1",
				"open",
				"D14",
			],
		);
		await pool.query(
			`INSERT INTO sessions (patient_id, case_id, device, drug) VALUES ($1, $2, $3, $4)`,
			[id, c.rows[0].id, "MDI", "Symbicort"],
		);

		const r = await api.lookupPatient({ mrn: MRN });
		assert.equal(r.ok, true);
		assert.equal(r.found, true);
		// The tail, so the row can be recognised; never the record number.
		assert.equal(r.mrnTail, "6789");
		assert.equal(JSON.stringify(r).includes(MRN), false, "病歷號碼沒有回來");
		assert.equal(r.cases.length, 1);
		assert.equal(r.cases[0].drug, "Symbicort");
		assert.equal(r.cases[0].steps.MDI_搖, "錯誤");
		assert.equal(r.followups.length, 1);
		assert.equal(r.followups[0].slot, "D14");
		assert.equal(r.sessions.length, 1);
		assert.equal(r.sessions[0].drug, "Symbicort");
	});

	it("says so when the patient has nothing here", async () => {
		const r = await api.lookupPatient({ mrn: "NOBODY" });
		assert.equal(r.ok, true);
		assert.equal(r.found, false);
		assert.equal(r.cases, undefined);
	});

	it("refuses an empty record number", async () => {
		await assert.rejects(() => api.lookupPatient({ mrn: "  " }), /mrn/);
	});
});
