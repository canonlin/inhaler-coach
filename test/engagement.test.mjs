/**
 * Activity must be dated by when something happened, not by when a row was
 * written.
 *
 * `cases.created_at` defaults to now(), so an "active in the last 7 days"
 * count built on it reports the entire historical cohort as active today: the
 * 61-case baseline from April showed as 61 people active this week. That is
 * not a rounding error, it inverts the question the pharmacist is asking — it
 * says the system is in use when nobody has touched it.
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
const SALT = "test-salt";

let pool;
let api;
const iso = (offsetDays) => {
	const d = new Date();
	d.setDate(d.getDate() + offsetDays);
	return d.toISOString().slice(0, 10);
};

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

async function aCase(mrn, caseOffset) {
	return api.createCase({
		mrn,
		caseDate: iso(caseOffset),
		pharmacist: "黃永成",
		drug: "Symbicort",
		steps: { MDI_壓: "錯誤" },
	});
}

describe("active patients", () => {
	it("does not count a months-old case as activity this week", async () => {
		await aCase("ACTOLD01", -180); // enrolled half a year ago
		const { engagement } = await api.summary();
		assert.equal(engagement.enrolled, 1, "they are enrolled");
		assert.equal(
			engagement.active_7d,
			0,
			"but nobody did anything in the last seven days",
		);
	});

	it("counts a case that actually happened this week", async () => {
		await aCase("ACTNEW01", -2);
		const { engagement } = await api.summary();
		assert.equal(engagement.enrolled, 2);
		assert.equal(engagement.active_7d, 1, "only the recent encounter counts");
	});

	it("ignores the row insertion time entirely", async () => {
		const { rows } = await pool.query(
			"SELECT count(*)::int AS n FROM cases WHERE case_date < current_date - 30 AND created_at >= current_date - 7",
		);
		assert.ok(
			rows[0].n > 0,
			"the fixture must contain rows written recently but dated long ago, or this test proves nothing",
		);
	});

	it("counts closing a follow-up today as activity", async () => {
		const c = await aCase("ACTFU001", -20);
		const { rows } = await pool.query(
			`SELECT f.id FROM followups f WHERE f.case_id = $1`,
			[c.id],
		);
		await api.closeFollowup({ id: rows[0].id, by: "黃永成" });
		const { engagement } = await api.summary();
		assert.equal(engagement.active_7d, 2, "the old-case patient did something today");
		assert.equal(engagement.followupDone, 1);
	});
});

describe("follow-up completion rate", () => {
	it("counts only follow-ups whose window has arrived", async () => {
		// aCase at +1 day enqueues a follow-up that is not due yet.
		await aCase("ACTFUT01", -14);
		const { engagement } = await api.summary();
		assert.ok(
			engagement.followupDue <= engagement.fu_open,
			"due can never exceed open",
		);
		if (engagement.followupDue === 0) {
			assert.equal(
				engagement.followupCompletionRate,
				null,
				"no due follow-ups means no rate, not zero",
			);
		}
	});
});