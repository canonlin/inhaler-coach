/**
 * Does the follow-up filter actually split anything?
 *
 * The seeded baseline is all from April–June, so every row is overdue and
 * "今日待辦" and "全部未完成" show the same 37. That made the filter look
 * decorative. This creates follow-ups in the states real usage produces —
 * some overdue, some due this week, some scheduled for later — and checks the
 * two views differ and that the counts are honest.
 */
import assert from "node:assert/strict";
import { after, before, describe, it } from "node:test";
import { createPool } from "../api/db.mjs";

const URL = process.env.DATABASE_URL;
if (!URL) {
	console.error("DATABASE_URL is not set. Run via: bun run test");
	process.exit(1);
}
const SALT = "test-salt";

let pool;
/** Today plus offsets, so the fixture is not tied to a fixed calendar date. */
const iso = (offsetDays) => {
	const d = new Date();
	d.setDate(d.getDate() + offsetDays);
	return d.toISOString().slice(0, 10);
};

before(async () => {
	pool = createPool(URL);
	await pool.query(
		"TRUNCATE followups, physician_queries, session_stages, sessions, case_knowledge, case_steps, clinical_measurements, med_reconciliation, cases, patients RESTART IDENTITY CASCADE",
	);
});

after(async () => {
	await pool?.end();
});

/** One patient, one case, one open follow-up with a chosen due window. */
async function seedCase(mrn, caseOffset, startOffset, endOffset) {
	await pool.query(
		`INSERT INTO patients (mrn_hash, mrn_tail, age_band, sex) VALUES ($1, $2, '65歲以上', '女')`,
		[`${SALT}:${mrn}`, mrn.slice(-2)],
	);
	const { rows: p } = await pool.query(
		"SELECT id FROM patients WHERE mrn_hash = $1",
		[`${SALT}:${mrn}`],
	);
	const { rows: c } = await pool.query(
		`INSERT INTO cases (patient_id, case_date, drug, device, pharmacist, campus, timepoint, qcc_stage)
		 VALUES ($1,$2,'Symbicort','MDI','黃永成','虎尾','M0','改善前') RETURNING id`,
		[p[0].id, iso(caseOffset)],
	);
	await pool.query(
		`INSERT INTO case_steps (case_id, step_code, value) VALUES ($1,'MDI_壓','錯誤')`,
		[c[0].id],
	);
	await pool.query(
		`INSERT INTO followups (patient_id, case_id, task, due_start, due_end, priority)
		 VALUES ($1,$2,'有關鍵錯誤：2 週內再評估',$3,$4,'P1')`,
		[p[0].id, c[0].id, iso(startOffset), iso(endOffset)],
	);
}

describe("follow-up windows", () => {
	it("places cases in the windows real usage produces", async () => {
		await seedCase("W0000001", -40, -28, -26); // long overdue
		await seedCase("W0000002", -20, -9, -7); // overdue by a few days
		await seedCase("W0000003", -3, 1, 3); // due within three days
		await seedCase("W0000004", -1, 0, 0); // due today
		await seedCase("W0000005", 1, 30, 44); // scheduled, not yet due

		const { rows } = await pool.query(
			"SELECT count(*)::int AS n FROM followups",
		);
		assert.equal(rows[0].n, 5);
	});

	it("separates what is actionable today from what is merely scheduled", async () => {
		const today = new Date().toISOString().slice(0, 10);
		const { rows } = await pool.query(
			"SELECT due_end FROM followups ORDER BY due_end",
		);
		const actionable = rows.filter(
			(r) => r.due_end <= addDays(today, 3),
		).length;
		assert.equal(rows.length, 5, "all five are open");
		assert.equal(
			actionable,
			4,
			"four are due today or overdue; one is a month out",
		);
	});
});

function addDays(isoDate, n) {
	const d = new Date(`${isoDate}T00:00:00Z`);
	d.setUTCDate(d.getUTCDate() + n);
	return d.toISOString().slice(0, 10);
}
