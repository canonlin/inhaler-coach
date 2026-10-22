/**
 * The return-visit schedule: the thing the pharmacist asked for.
 *
 * 10/19 會議記錄【五】：「Checklist 的時機點是在個案加入後，等他第 28 天（或第 14、21
 * 天）回診時，後台清單會提示今天有哪些病患需要進行 Checklist 追蹤，藥師點進去就能勾選
 * 填寫，不需要再人工記日子。」
 *
 * Three claims are tested here, and each of them was a gap:
 *
 *   1. The days are the system's business. Before this, a follow-up existed
 *      only when the patient had an error, and its window was a range of days
 *      — so 「今天該做誰」 could not be answered at all.
 *   2. A visit that happened retires the other planned visits. Left open,
 *      they would each come due in turn and ask for a second Checklist the
 *      patient has already had.
 *   3. A visit that did not happen retires nothing. The patient may still
 *      come on the next one.
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

/** Today, in the same shape the API reads dates in. */
const today = () => new Date().toISOString().slice(0, 10);

/** A date `n` days from today. */
function daysFromToday(n) {
	const d = new Date();
	d.setDate(d.getDate() + n);
	return d.toISOString().slice(0, 10);
}

/** One enrollment, three planned visits. */
async function enroll(mrn, caseOffset, steps = {}) {
	return api.createCase({
		mrn,
		caseDate: daysFromToday(caseOffset),
		pharmacist: "黃永成",
		drug: "Symbicort",
		qccStage: "改善前",
		timepoint: "M0",
		steps,
	});
}

describe("the return-visit schedule", () => {
	before(async () => {
		pool = createPool(URL);
		api = makeRoutes({ query: (t, p) => pool.query(t, p), salt: "test-salt" });
		await pool.query(
			"TRUNCATE followups, physician_queries, session_stages, sessions, case_knowledge, case_steps, clinical_measurements, med_reconciliation, cases, patients RESTART IDENTITY CASCADE",
		);
	});

	after(async () => {
		await pool?.end();
	});

	it("plans three return visits, 14, 21 and 28 days out", async () => {
		// Thirty days ago, so all three of its visits are already in the past
		// and the only visit that falls on today belongs to the next test.
		await enroll("SCHED0001", -30, { MDI_搖: "錯誤" });
		const { rows } = await pool.query(
			`SELECT f.slot, f.due_start, f.due_end, f.priority, f.status, f.task
			 FROM followups f JOIN patients p ON p.id = f.patient_id
			 WHERE p.mrn_tail = '01' ORDER BY f.due_start`,
		);
		assert.equal(rows.length, 3);
		assert.deepEqual(
			rows.map((r) => r.slot),
			["D14", "D21", "D28"],
		);
		assert.deepEqual(
			rows.map((r) => r.due_start),
			[daysFromToday(-16), daysFromToday(-9), daysFromToday(-2)],
		);
		for (const r of rows) {
			// One day, not a window: the queue has to be able to say 「今天」.
			assert.equal(r.due_end, r.due_start);
			assert.equal(r.status, "open");
		}
	});

	it("says which patients are due today", async () => {
		// Enrolled 14 days ago: its first visit is today.
		await enroll("SCHED0002", -14, { MDI_開: "錯誤" });
		const { followups, dueToday } = await api.followups();
		const mine = followups.filter((f) => f.mrn_tail === "02");
		assert.equal(mine.length, 3);
		assert.equal(
			mine.filter((f) => f.dueToday).length,
			1,
			"exactly one visit falls today",
		);
		const today_ = mine.find((f) => f.dueToday);
		assert.equal(today_.slot, "D14");
		assert.equal(today_.due_end, today());
		assert.equal(dueToday, 1);
	});

	it("keeps a missed visit from retiring the others", async () => {
		const { followups } = await api.followups();
		const d14 = followups.find((f) => f.mrn_tail === "02" && f.slot === "D14");
		const res = await api.closeFollowup({
			id: d14.id,
			by: "黃永成",
			status: "missed",
		});
		assert.equal(res.status, "missed");
		assert.equal(
			res.superseded,
			0,
			"a visit that did not happen retires nothing",
		);

		const after = await api.followups();
		assert.equal(
			after.followups.filter((f) => f.mrn_tail === "02").length,
			2,
			"the patient can still come on the other days",
		);
	});

	it("retires the other planned visits once the visit happened", async () => {
		const { followups } = await api.followups();
		const d21 = followups.find((f) => f.mrn_tail === "02" && f.slot === "D21");
		const res = await api.closeFollowup({
			id: d21.id,
			by: "黃永成",
			status: "done",
			assessment: { steps: { MDI_開: "正確" }, demonstrated: {} },
		});
		assert.equal(res.superseded, 1, "the D28 visit is now moot");

		const p = await getPool();
		const { rows } = await p.query(
			`SELECT f.slot, f.status, f.completed_note
			 FROM followups f JOIN patients p ON p.id = f.patient_id
			 WHERE p.mrn_tail = '02' ORDER BY f.due_start`,
		);
		const bySlot = Object.fromEntries(rows.map((r) => [r.slot, r]));
		assert.equal(bySlot.D14.status, "missed");
		assert.equal(bySlot.D21.status, "done");
		assert.equal(bySlot.D28.status, "superseded");
		assert.equal(bySlot.D28.completed_note, "同次回診已完成");

		// The retired visit is not outstanding work any more.
		const open = await api.followups();
		assert.equal(open.followups.filter((f) => f.mrn_tail === "02").length, 0);
	});

	it("records the visit as an M1 in the after cohort", async () => {
		const p = await getPool();
		const { rows } = await p.query(
			`SELECT c.timepoint, c.qcc_stage
			 FROM cases c JOIN patients p ON p.id = c.patient_id
			 WHERE p.mrn_tail = '02' ORDER BY c.timepoint`,
		);
		assert.equal(rows.length, 2, "the enrollment and its follow-up visit");
		assert.equal(rows[1].timepoint, "M1");
		assert.equal(rows[1].qcc_stage, "改善後");
	});

	it("does not count a retired visit as outstanding or missed", async () => {
		const { engagement } = await api.summary();
		// Three visits for tail 01, three for tail 02: one missed, one done,
		// one retired, and two still open.
		assert.equal(engagement.fu_open, 3, "the visits still to come");
		assert.equal(engagement.fu_done, 1);
		assert.equal(engagement.fu_missed, 1);
		assert.equal(engagement.fu_superseded, 1);
	});

	it("leaves an M1 without a schedule of its own", async () => {
		const before = await pool.query("SELECT count(*)::int AS n FROM followups");
		await api.createCase({
			mrn: "SCHED0003",
			caseDate: today(),
			pharmacist: "林家薐",
			drug: "Symbicort",
			timepoint: "M1",
			qccStage: "改善後",
			steps: { MDI_開: "正確" },
		});
		const after = await pool.query("SELECT count(*)::int AS n FROM followups");
		assert.equal(
			after.rows[0].n,
			before.rows[0].n,
			"an M1 that planned three more visits would grow the queue forever",
		);
	});
});
