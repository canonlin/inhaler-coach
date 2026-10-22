/**
 * Integration test against a real Postgres. Skips with a clear message when
 * DATABASE_URL is absent, so the unit gate never breaks on a machine without a
 * database.
 *
 * Run:  DATABASE_URL=postgres://postgres:devpw@localhost:55432/inhaler bun run test
 */
import assert from "node:assert/strict";
import { after, before, beforeEach, describe, it } from "node:test";

import { createPool, hashMrn } from "../api/db.mjs";
import { makeRoutes } from "../api/routes.mjs";

// scripts/test.mjs refuses to start without this, so reaching here with no URL
// means the file was invoked directly rather than through the gate.
const URL = process.env.DATABASE_URL;
if (!URL) {
	console.error("DATABASE_URL is not set. Run via: bun run test");
	process.exit(1);
}
const SALT = "test-salt";

if (false) {
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
		await pool.query(
			"TRUNCATE followups, physician_queries, session_stages, sessions, case_knowledge, case_steps, clinical_measurements, med_reconciliation, cases, patients RESTART IDENTITY CASCADE",
		);
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

		it("says whether this deployment really sends or only rehearses", async () => {
			// The deployment check script reads this. Without it, a check run
			// from a laptop reports the laptop's environment variables and calls
			// a live deployment "still in rehearsal".
			const r = await api.health();
			assert.ok(
				["live", "rehearsal"].includes(r.lineSending),
				`lineSending was ${r.lineSending}`,
			);
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
				knowledge: { 1: "對", 3: "不對" },
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
			const before = await pool.query(
				"SELECT count(*)::int AS n FROM patients",
			);
			await api.createCase({
				mrn: "A123456789",
				caseDate: "2026-06-15",
				pharmacist: "林家薐",
				drug: "Symbicort",
				timepoint: "M1",
				steps: { MDI_搖: "正確", MDI_含: "正確" },
			});
			const after = await pool.query("SELECT count(*)::int AS n FROM patients");
			assert.equal(
				after.rows[0].n,
				before.rows[0].n,
				"must not duplicate the patient",
			);
		});
	});

	describe("GET /api/metrics/summary", () => {
		it("computes the error rate from stored step results", async () => {
			const r = await api.summary({});
			assert.equal(r.ok, true);
			// 2 cases, 5 assessed steps, 1 wrong.
			assert.equal(r.total, 2);
			assert.equal(r.after.wrongSteps, 1);
			// Per the plan the rate is per person: one of the two cases has at
			// least one wrong step. The step-level figure is kept separately
			// because it answers a different question.
			assert.equal(r.after.peopleWithError, 1);
			assert.equal(r.after.errorRate, 0.5);
			assert.ok(Math.abs(r.after.stepErrorRate - 1 / 5) < 1e-12);
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
			assert.equal(
				r.knowledge.cases,
				1,
				"only the case that recorded answers counts",
			);
			assert.equal(r.knowledge.mean, 1);
		});

		it("tracks enrolment against the target", async () => {
			const r = await api.summary({ target: 61 });
			assert.equal(r.enrolment.target, 61);
			assert.equal(r.enrolment.after, 2);
		});

		/*
		 * The default is the plan's own enrolment figure, 「預計收案 30 位病人」
		 * (計畫書 line 112). It used to fall back to 61 — the baseline cohort —
		 * so with no target supplied the page showed 收案 2/61 and read as if
		 * the intervention had to reach every baseline patient. Nothing caught
		 * it because the neighbouring test passes a target explicitly and so
		 * never exercises the fallback.
		 */
		it("falls back to the plan's enrolment target, not the cohort size", async () => {
			const r = await api.summary({});
			assert.equal(r.enrolment.target, 30);
		});
	});

	describe("POST /api/sessions", () => {
		it("records AI coaching attempts, confidence and the pharmacist verdict", async () => {
			const r = await api.recordSession({
				mrn: "A123456789",
				device: "MDI",
				completed: true,
				stages: {
					1: { a: 3, c: 0.87, p: "correct", passed: true },
					2: { a: 5, c: 0.62, p: "incorrect", passed: false },
				},
			});
			assert.equal(r.ok, true);
			assert.equal(r.stages, 2);

			const { rows } = await pool.query(
				"SELECT stage, attempts, ai_confidence, pharmacist FROM session_stages ORDER BY stage",
			);
			assert.deepEqual(rows[0], {
				stage: 1,
				attempts: 3,
				ai_confidence: "0.87",
				pharmacist: "correct",
			});
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
			assert.equal(
				rows[0].due_end,
				"2026-08-12",
				"six weeks: the routine window",
			);
		});

		it("does not enqueue a follow-up when every step was correct", async () => {
			const before = await pool.query(
				"SELECT count(*)::int AS n FROM followups",
			);
			await api.createCase({
				mrn: "E444555666",
				caseDate: "2026-07-01",
				pharmacist: "林亭君",
				drug: "Symbicort",
				steps: { MDI_搖: "正確", MDI_開: "正確" },
			});
			const after = await pool.query(
				"SELECT count(*)::int AS n FROM followups",
			);
			assert.equal(after.rows[0].n, before.rows[0].n);
		});
	});

	describe("closing a follow-up", () => {
		async function aCaseThatNeedsFollowup() {
			return api.createCase({
				mrn: "CLOSE0001",
				caseDate: "2026-05-04",
				pharmacist: "黃永成",
				drug: "Symbicort",
				// A critical step wrong is what enqueues a P1.
				steps: { MDI_壓: "錯誤" },
			});
		}

		async function openFollowupsFor(mrn) {
			const { rows } = await pool.query(
				`SELECT f.id FROM followups f JOIN patients p ON p.id = f.patient_id
				 WHERE p.mrn_hash = $1 AND f.status = 'open'`,
				[hashMrn(mrn, SALT)],
			);
			return rows;
		}

		it("enqueues a follow-up when a critical step is wrong", async () => {
			await aCaseThatNeedsFollowup();
			const open = await openFollowupsFor("CLOSE0001");
			assert.equal(open.length, 1, "a wrong critical step must enqueue work");
		});

		it("closes it and records who closed it", async () => {
			const [{ id }] = await openFollowupsFor("CLOSE0001");
			const r = await api.closeFollowup({ id, by: "黃永成" });
			assert.equal(r.ok, true);
			assert.equal(r.status, "done");
			assert.ok(r.completed_at, "a close must say when");
			assert.equal(r.completed_by, "黃永成");
			assert.equal((await openFollowupsFor("CLOSE0001")).length, 0);
		});

		it("refuses an unattributed close", async () => {
			await aCaseThatNeedsFollowup();
			const [{ id }] = await openFollowupsFor("CLOSE0001");
			await assert.rejects(() => api.closeFollowup({ id }), /by is required/);
		});

		it("reports a second close as a conflict, not a silent success", async () => {
			const [{ id }] = await openFollowupsFor("CLOSE0001");
			await api.closeFollowup({ id, by: "黃永成" });
			await assert.rejects(
				() => api.closeFollowup({ id, by: "林怡君" }),
				/already done by 黃永成/,
			);
		});

		it("reports a missing follow-up as not found", async () => {
			await assert.rejects(
				() =>
					api.closeFollowup({
						id: "00000000-0000-0000-0000-000000000000",
						by: "x",
					}),
				/not found/,
			);
		});

		it("can record that a follow-up was missed", async () => {
			await aCaseThatNeedsFollowup();
			const [{ id }] = await openFollowupsFor("CLOSE0001");
			const r = await api.closeFollowup({ id, by: "黃永成", status: "missed" });
			assert.equal(r.status, "missed");
		});

		it("never lets the database hold a close with no timestamp", async () => {
			const { rows } = await pool.query(
				`SELECT count(*)::int AS n FROM followups
				 WHERE (status = 'open') <> (completed_at IS NULL)`,
			);
			assert.equal(
				rows[0].n,
				0,
				"the CHECK constraint should make this impossible",
			);
		});
	});

	describe("pending AI session", () => {
		it("returns the camera's verdicts so the pharmacist does not re-enter them", async () => {
			await api.recordSession({
				mrn: "T900900900",
				device: "MDI",
				completed: true,
				stages: {
					1: { a: 2, c: 0.88, p: "correct", passed: true },
					2: { a: 4, c: 0.61, p: "incorrect", passed: false },
					3: { a: 3, c: 0.79, p: "correct", passed: true },
				},
			});
			const r = await api.pendingSession({ mrn: "T900900900" });
			assert.equal(r.ok, true);
			assert.equal(r.found, true);
			assert.equal(r.steps.MDI_搖.value, "正確");
			assert.equal(r.steps.MDI_吐.value, "錯誤", "stage 2 failed");
			// Stage 3 covers three checklist steps.
			assert.equal(r.steps.MDI_壓.value, "正確");
			assert.equal(r.steps.MDI_吸.value, "正確");
			assert.equal(r.steps.MDI_閉.value, "正確");
			assert.equal(r.steps.MDI_漱, undefined, "stage 4 was not recorded");
		});

		it("never invents a verdict for a stage the camera did not score", async () => {
			const r = await api.pendingSession({ mrn: "T900900900" });
			assert.equal(r.steps.MDI_漱, undefined);
		});

		it("reports not found rather than an error when the patient has not practised", async () => {
			const r = await api.pendingSession({ mrn: "NOPRACTICE" });
			assert.equal(r.ok, true);
			assert.equal(r.found, false);
			assert.deepEqual(r.steps, {});
		});
	});

	/*
	 * Moved to the end of this file on purpose.
	 *
	 * GET /api/metrics/summary has no setup of its own — it reads whatever the
	 * preceding block left in the database — so anything inserted before it
	 * inherits that responsibility and silently breaks a suite several blocks
	 * away. This block truncates and reseeds per test, which is exactly the
	 * wrong shape to sit in the middle of the chain.
	 */
	/*
	 * There was no way to read a patient's history back at all: /api/cases
	 * filters by cohort and nothing in the frontend called it. This covers
	 * the lookup that replaced that, including the property that matters
	 * most about it — the record number is compared by hash and never
	 * appears in a URL or in the response.
	 */
	describe("POST /api/cases/lookup", () => {
		beforeEach(async () => {
			await pool.query(
				"TRUNCATE followups, physician_queries, session_stages, sessions, case_knowledge, case_steps, clinical_measurements, med_reconciliation, cases, patients RESTART IDENTITY CASCADE",
			);
			await api.createCase({
				mrn: "H9990001",
				caseDate: "2026-05-04",
				pharmacist: "黃永成",
				drug: "Symbicort",
				qccStage: "改善前",
				timepoint: "M0",
				steps: { MDI_壓: "錯誤", MDI_吸: "正確" },
			});
			await api.createCase({
				mrn: "H9990001",
				caseDate: "2026-06-04",
				pharmacist: "黃永成",
				drug: "Symbicort",
				qccStage: "改善後",
				timepoint: "M1",
				steps: { MDI_壓: "正確", MDI_吸: "正確" },
			});
			await api.createCase({
				mrn: "H9990002",
				caseDate: "2026-05-06",
				pharmacist: "林家薐",
				drug: "Breztri",
				qccStage: "改善前",
				timepoint: "M0",
				steps: { MDI_吸: "錯誤" },
			});
		});

		it("returns one patient's cases, newest first", async () => {
			const r = await api.lookupCases({ mrn: "H9990001" });
			assert.equal(r.ok, true);
			assert.equal(r.found, true);
			assert.equal(r.cases.length, 2, "only this patient's two cases");
			assert.deepEqual(
				r.cases.map((c) => c.timepoint),
				["M1", "M0"],
				"newest first, so a before/after reads top to bottom",
			);
		});

		it("carries the step verdicts, so a before/after needs no second call", async () => {
			const r = await api.lookupCases({ mrn: "H9990001" });
			assert.deepEqual(r.cases[0].steps, { MDI_壓: "正確", MDI_吸: "正確" });
			assert.deepEqual(r.cases[1].steps, { MDI_壓: "錯誤", MDI_吸: "正確" });
		});

		it("never echoes the full record number back", async () => {
			const r = await api.lookupCases({ mrn: "H9990001" });
			assert.ok(
				!JSON.stringify(r).includes("H9990001"),
				"only the masked tail may leave the server",
			);
		});

		it("reports an unknown patient without creating one", async () => {
			const r = await api.lookupCases({ mrn: "H0000000" });
			assert.equal(r.found, false);
			assert.deepEqual(r.cases, []);
			const { rows } = await pool.query(
				"SELECT count(*)::int AS n FROM patients WHERE mrn_tail = '00'",
			);
			assert.equal(rows[0].n, 0, "a lookup must not insert");
		});

		it("refuses an empty record number", async () => {
			await assert.rejects(
				() => api.lookupCases({ mrn: "  " }),
				/mrn is required/,
			);
		});
	});
	/*
	 * At the end for the reason the lookup block below also gives: the
	 * summary suite reads whatever the preceding block left behind, so a
	 * truncating block placed before it breaks a suite it never mentions.
	 */
	/*
	 * The queue holds only the masked tail, so a row could not be opened: there
	 * was no way to get from "this patient is overdue on 7 steps" to "here is
	 * what they actually did". These cover the two fields that make the row
	 * actionable, and the filter that reaches the same records by product.
	 */
	describe("queue rows are actionable", () => {
		beforeEach(async () => {
			await pool.query(
				"TRUNCATE followups, physician_queries, session_stages, sessions, case_knowledge, case_steps, clinical_measurements, med_reconciliation, cases, patients RESTART IDENTITY CASCADE",
			);
			await api.createCase({
				mrn: "H7770001",
				caseDate: "2026-04-21",
				pharmacist: "黃永成",
				drug: "Symbicort",
				qccStage: "改善前",
				timepoint: "M0",
				steps: { MDI_壓: "錯誤", MDI_搖: "正確" },
			});
			await api.createCase({
				mrn: "H7770002",
				caseDate: "2026-04-22",
				pharmacist: "林家薐",
				drug: "Breztri",
				qccStage: "改善前",
				timepoint: "M0",
				steps: { MDI_壓: "錯誤" },
			});
		});

		it("carries the ids a row needs to be opened", async () => {
			const r = await api.followups();
			assert.equal(r.followups.length, 2);
			for (const f of r.followups) {
				assert.ok(f.case_id, "the row must name the case it came from");
				assert.ok(f.patient_id, "the row must name the patient");
				assert.ok(
					f.device,
					"a row that cannot be grouped by device cannot be worked",
				);
			}
		});

		it("never carries the record number itself", async () => {
			const r = await api.followups();
			const body = JSON.stringify(r);
			assert.ok(
				!body.includes("H7770001"),
				"only the masked tail may leave the server",
			);
			assert.ok(!body.includes("H7770002"));
			for (const f of r.followups) {
				assert.equal(String(f.mrn_tail).length, 2, "the tail is two digits");
			}
		});

		it("reaches one patient's records from the queue, by id rather than by name", async () => {
			const r = await api.followups();
			const row = r.followups.find((f) => f.drug === "Symbicort");
			const cases = await api.listCases({ patientId: row.patient_id });
			assert.equal(cases.cases.length, 1);
			assert.equal(cases.cases[0].drug, "Symbicort");
			// Wrong id returns nothing rather than somebody else's records.
			const missing = await api.listCases({
				patientId: "00000000-0000-0000-0000-000000000000",
			});
			assert.deepEqual(missing.cases, []);
		});

		it("filters by device and by product", async () => {
			const byDevice = await api.listCases({ device: "MDI" });
			assert.equal(byDevice.cases.length, 2, "both fixtures are pMDI");
			const byDrug = await api.listCases({ drug: "Breztri" });
			assert.equal(byDrug.cases.length, 1);
			assert.equal(byDrug.cases[0].drug, "Breztri");
		});

		it("reads and updates admin configuration dynamically", async () => {
			const initial = await api.getAdminConfig();
			assert.equal(initial.ok, true);
			assert.ok(Array.isArray(initial.config.videos));
			assert.ok(Array.isArray(initial.config.drugs));
			assert.ok(typeof initial.config.quizzes === "object");

			// Update videos configuration
			const updatedVideo = [
				{
					id: "TEST_MDI_1",
					title: "測試專用操作教學",
					type: "MDI",
					videoUrl: "https://example.com/test-mdi.mp4",
				},
			];
			const updateRes = await api.updateAdminConfig({
				key: "videos",
				value: updatedVideo,
				user: "head_pharmacist",
			});
			assert.equal(updateRes.ok, true);

			const after = await api.getAdminConfig();
			assert.equal(after.config.videos.length, 1);
			assert.equal(after.config.videos[0].title, "測試專用操作教學");
			assert.equal(after.config.updated.videos.by, "head_pharmacist");
		});
	});
}
