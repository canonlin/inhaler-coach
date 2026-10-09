/**
 * Integration test against a real Postgres. Skips with a clear message when
 * DATABASE_URL is absent, so the unit gate never breaks on a machine without a
 * database.
 *
 * Run:  DATABASE_URL=postgres://postgres:devpw@localhost:55432/inhaler npm run test:api
 */
import assert from "node:assert/strict";
import { after, before, describe, it } from "node:test";

import { createPool } from "../api/db.mjs";
import { makeRoutes } from "../api/routes.mjs";

const URL = process.env.DATABASE_URL;
const SALT = "test-salt";

if (!URL) {
	describe("api integration (skipped)", () => {
		it("needs DATABASE_URL", { skip: "DATABASE_URL not set" }, () => {
			assert.ok(true);
		});
	});
} else {
	let pool;
	let api;

	before(async () => {
		pool = createPool(URL);
		api = makeRoutes({ query: (t, p) => pool.query(t, p), salt: SALT });
		// Start from a known state; the schema is applied by db/schema.sql.
		await pool.query("TRUNCATE followups, physician_queries, session_stages, sessions, case_knowledge, case_steps, clinical_measurements, med_reconciliation, cases, patients RESTART IDENTITY CASCADE");
	});

	after(async () => {
		await pool?.end();
	});

	describe("GET /api/health", () => {
		it("reports the live database", async () => {
			const r = await api.health();
			assert.equal(r.ok, true);
			assert.equal(r.cases, 0);
			assert.ok(r.now);
		});
	});

	describe("POST /api/cases", () => {
		it("writes a case with steps, knowledge and measures in one transaction", async () => {
			const r = await api.createCase({
				mrn: "A123456789",
				caseDate: "2026-05-04",
				pharmacist: "黃永成",
				drug: "Symbicort",
				qccStage: "改善後",
				timepoint: "M0",
				steps: { MDI_搖: "正確", MDI_吐: "錯誤", MDI_開: "正確" },
				knowledge: { "1": "對", "3": "不對" },
				measurements: { PIF: "62", CAT: "14" },
			});
			assert.equal(r.ok, true);
			assert.equal(r.steps, 3);
			assert.equal(r.knowledge, 2);
			assert.equal(r.measures, 2);
			assert.equal(r.mrn_tail, "89");
		});

		it("never returns the hashed medical record number", async () => {
			const r = await api.listCases({});
			assert.ok(!("mrn_hash" in r.cases[0]));
			assert.equal(r.cases[0].mrn_tail, "89");
		});

		it("rejects a step code the spine does not define", async () => {
			await assert.rejects(
				() =>
					api.createCase({
						mrn: "A999",
						caseDate: "2026-05-04",
						pharmacist: "黃永成",
						drug: "Symbicort",
						steps: { XXX_搖: "正確" },
					}),
				/unknown step XXX_搖/,
			);
		});

		it("rejects an unknown pharmacist rather than inventing one", async () => {
			await assert.rejects(
				() =>
					api.createCase({
						mrn: "A999",
						caseDate: "2026-05-04",
						pharmacist: "不存在",
						drug: "Symbicort",
					}),
				/unknown pharmacist/,
			);
		});

		it("rejects an unknown drug", async () => {
			await assert.rejects(
				() =>
					api.createCase({
						mrn: "A999",
						caseDate: "2026-05-04",
						pharmacist: "黃永成",
						drug: "NotARealInhaler",
					}),
				/unknown drug/,
			);
		});

		it("reuses the patient row when the same MRN returns", async () => {
			const before = await pool.query("SELECT count(*)::int AS n FROM patients");
			await api.createCase({
				mrn: "A123456789",
				caseDate: "2026-06-15",
				pharmacist: "林家薐",
				drug: "Symbicort",
				timepoint: "M1",
				steps: { MDI_搖: "正確", MDI_含: "正確" },
			});
			const after = await pool.query("SELECT count(*)::int AS n FROM patients");
			assert.equal(after.rows[0].n, before.rows[0].n, "must not duplicate the patient");
		});
	});

	describe("GET /api/metrics/summary", () => {
		it("computes the error rate from stored step results", async () => {
			const r = await api.summary({});
			assert.equal(r.ok, true);
			// 2 cases, 5 assessed steps, 1 wrong.
			assert.equal(r.total, 2);
			assert.equal(r.after.wrongSteps, 1);
			assert.ok(Math.abs(r.after.errorRate - 1 / 5) < 1e-12);
		});

		it("excludes an unrecorded step from the denominator", async () => {
			const r = await api.summary({});
			const rates = new Map(r.stepRates.map((x) => [x.stepCode, x]));
			assert.equal(rates.get("MDI_開").assessed, 1, "recorded once");
			// MDI_漱 was never recorded for these cases, so it must not appear.
			assert.equal(rates.has("MDI_漱"), false);
		});

		it("counts knowledge answers as integers, not bigint strings", async () => {
			const r = await api.summary({});
			assert.equal(r.knowledge.cases, 1, "only the case that recorded answers counts");
			assert.equal(r.knowledge.mean, 1);
		});

		it("tracks enrolment against the target", async () => {
			const r = await api.summary({ target: 61 });
			assert.equal(r.enrolment.target, 61);
			assert.equal(r.enrolment.after, 2);
		});
	});

	describe("POST /api/sessions", () => {
		it("records AI coaching attempts, confidence and the pharmacist verdict", async () => {
			const r = await api.recordSession({
				mrn: "A123456789",
				device: "MDI",
				completed: true,
				stages: {
					"1": { a: 3, c: 0.87, p: "correct", passed: true },
					"2": { a: 5, c: 0.62, p: "incorrect", passed: false },
				},
			});
			assert.equal(r.ok, true);
			assert.equal(r.stages, 2);

			const { rows } = await pool.query(
				"SELECT stage, attempts, ai_confidence, pharmacist FROM session_stages ORDER BY stage",
			);
			assert.deepEqual(rows[0], { stage: 1, attempts: 3, ai_confidence: "0.87", pharmacist: "correct" });
			assert.equal(rows[1].attempts, 5);
			assert.equal(rows[1].pharmacist, "incorrect");
		});

		it("keeps a session without any stages", async () => {
			const r = await api.recordSession({ mrn: "B222333444", stages: {} });
			assert.equal(r.ok, true);
			assert.equal(r.stages, 0);
		});
	});

	describe("GET /api/reference", () => {
		it("serves the spine so a client never hardcodes it", async () => {
			const r = await api.reference();
			assert.equal(r.steps.length, 33);
			assert.equal(r.drugs.length, 17);
			assert.equal(r.knowledge.length, 10);
			assert.ok(r.pharmacists.includes("黃永成"));
		});
	});

	describe("filtering", () => {
		it("filters cases by stage", async () => {
			const r = await api.listCases({ qccStage: "改善前" });
			assert.equal(r.cases.length, 0);
			const all = await api.listCases({});
			assert.equal(all.cases.length, 2);
		});

		it("filters cases by timepoint", async () => {
			const r = await api.listCases({ timepoint: "M1" });
			assert.equal(r.cases.length, 1);
			assert.equal(r.cases[0].timepoint, "M1");
		});
	});
	describe("follow-up enqueue", () => {
		it("enqueues a P1 follow-up within 2 weeks for a critical error", async () => {
			await api.createCase({
				mrn: "C777888999",
				caseDate: "2026-07-01",
				pharmacist: "劉士宏",
				drug: "Symbicort",
				steps: { MDI_搖: "錯誤", MDI_開: "正確" }, // MDI_搖 is critical
			});
			const { rows } = await pool.query(
				`SELECT f.task, f.due_start, f.due_end, f.priority
				 FROM followups f JOIN patients p ON p.id = f.patient_id
				 WHERE p.mrn_tail = '99'`,
			);
			assert.equal(rows.length, 1);
			assert.equal(rows[0].priority, "P1");
			assert.equal(rows[0].due_start, "2026-07-15", "two weeks after the case");
			assert.equal(rows[0].due_end, "2026-07-15");
		});

		it("enqueues a routine M1 follow-up for a non-critical error", async () => {
			await api.createCase({
				mrn: "D111222333",
				caseDate: "2026-07-01",
				pharmacist: "曾彥哲",
				drug: "Symbicort",
				steps: { MDI_開: "錯誤" }, // MDI_開 is not critical
			});
			const { rows } = await pool.query(
				`SELECT f.priority, f.due_end
				 FROM followups f JOIN patients p ON p.id = f.patient_id
				 WHERE p.mrn_tail = '33'`,
			);
			assert.equal(rows.length, 1);
			assert.equal(rows[0].priority, "P2");
			assert.equal(rows[0].due_end, "2026-08-12", "six weeks: the routine window");
		});

		it("does not enqueue a follow-up when every step was correct", async () => {
			const before = await pool.query("SELECT count(*)::int AS n FROM followups");
			await api.createCase({
				mrn: "E444555666",
				caseDate: "2026-07-01",
				pharmacist: "林亭君",
				drug: "Symbicort",
				steps: { MDI_搖: "正確", MDI_開: "正確" },
			});
			const after = await pool.query("SELECT count(*)::int AS n FROM followups");
			assert.equal(after.rows[0].n, before.rows[0].n);
		});
	});
}
