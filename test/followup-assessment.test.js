/**
 * Closing a follow-up must produce an assessment.
 *
 * This is the loop the plan's before/after depends on, and nothing tested it.
 * Closing used to flip a status and record who did it, so a pharmacist could
 * empty the queue and the outcomes page would gain nothing — consistent with 37
 * open follow-ups, a 0% completion rate, and no M1 produced by real work.
 */
import assert from "node:assert/strict";
import { after, before, describe, it } from "node:test";

import { createPool } from "../api/db.mjs";
import { makeRoutes } from "../api/routes.mjs";

const URL = process.env.DATABASE_URL;
if (!URL) {
	console.error("DATABASE_URL is not set. Run via: bun run test");
	process.exit(1);
}

let pool;
let api;

const getPool = async () => pool;

describe("closing a follow-up records the assessment", () => {
	before(async () => {
		pool = createPool(URL);
		api = makeRoutes({ query: (t, p) => pool.query(t, p), salt: "test-salt" });
		await pool.query(
			"TRUNCATE followups, physician_queries, session_stages, sessions, case_knowledge, case_steps, clinical_measurements, med_reconciliation, cases, patients RESTART IDENTITY CASCADE",
		);
		await api.createCase({
			mrn: "FU0000001",
			caseDate: "2026-05-04",
			pharmacist: "黃永成",
			drug: "Symbicort",
			qccStage: "改善前",
			timepoint: "M0",
			steps: { MDI_壓: "錯誤", MDI_吸: "正確" },
		});
	});

	after(async () => {
		await pool?.end();
	});

	/*
	 * The queue has to say which steps to re-check. The task string says a
	 * critical error happened; without the codes the row cannot be worked, only
	 * acknowledged.
	 */
	it("tells the pharmacist which steps to re-check", async () => {
		const { followups } = await api.followups();
		const f = followups.find((x) => x.mrn_tail === "01");
		assert.ok(f, "the seeded case should have queued a follow-up");
		assert.deepEqual(
			f.wrongSteps,
			["MDI_壓"],
			`got ${JSON.stringify(f.wrongSteps)}`,
		);
	});

	it("produces an M1 assessment on the case that created it", async () => {
		const { followups } = await api.followups();
		const f = followups.find((x) => x.mrn_tail === "01");

		const res = await api.closeFollowup({
			id: f.id,
			by: "黃永成",
			status: "done",
			assessment: {
				steps: { MDI_壓: "正確" },
				demonstrated: { MDI_壓: true },
			},
		});

		assert.equal(res.ok, true);
		assert.ok(res.assessment, "closing with an assessment must report one");

		const p = await getPool();
		// The same patient, not a second one: mrn_hash is the patient key and the
		// queue only carries mrn_tail, so re-deriving from the tail would fork.
		const { rows: people } = await p.query(
			"SELECT count(*)::int AS n FROM patients WHERE mrn_tail = '01'",
		);
		assert.equal(people[0].n, 1, "the M1 must belong to the original patient");

		const { rows: m1 } = await p.query(
			`SELECT c.timepoint, c.qcc_stage, cs.value
			 FROM cases c JOIN case_steps cs ON cs.case_id = c.id
			 WHERE cs.step_code = 'MDI_壓'
			 ORDER BY c.case_date`,
		);
		assert.equal(m1.length, 2, "one M0 and one M1 should record the step");
		assert.deepEqual(
			m1.map((r) => r.value),
			["錯誤", "正確"],
			"the M1 must carry what was re-checked",
		);
		assert.ok(
			m1.some((r) => r.timepoint === "M1" && r.qcc_stage === "改善後"),
			"the assessment is an M1 in the after cohort",
		);
	});

	/*
	 * If the assessment is not valid, the follow-up must stay open. Marking it
	 * closed without a recorded assessment is the dead end this removed, and it
	 * would also lose the queue item silently.
	 */
	it("refuses to close without losing the item when the assessment is invalid", async () => {
		await api.createCase({
			mrn: "FU0000002",
			caseDate: "2026-06-04",
			pharmacist: "林家薐",
			drug: "Symbicort",
			qccStage: "改善前",
			timepoint: "M0",
			steps: { MDI_吸: "錯誤" },
		});
		const { followups } = await api.followups();
		const f = followups.find((x) => x.mrn_tail === "02");
		assert.ok(f, "second follow-up queued");

		await assert.rejects(
			() =>
				api.closeFollowup({
					id: f.id,
					by: "林家薐",
					status: "done",
					assessment: { steps: { NOPE_壓: "正確" } },
				}),
			/unknown step/,
		);

		const { followups: still } = await api.followups();
		assert.ok(
			still.some((x) => x.id === f.id),
			"a rejected assessment must leave the follow-up open",
		);
	});

	it("still allows closing without an assessment", async () => {
		const { followups } = await api.followups();
		const f = followups.find((x) => x.mrn_tail === "02");
		const res = await api.closeFollowup({
			id: f.id,
			by: "林家薐",
			status: "missed",
		});
		assert.equal(res.ok, true);
		assert.equal(res.assessment, undefined, "a miss records no assessment");
	});
});
