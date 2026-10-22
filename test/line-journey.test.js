/**
 * The QCC first-month learning journey.
 *
 * Two halves. The schedule is a pure function and is checked as one: day 3,
 * 7, 14, 24, 28, each with the content the pharmacist asked for. The
 * dispatcher is checked against a real database, because the things that can
 * go wrong there — a patient without consent, a pre-intervention case, the
 * same touch twice, the month's free allowance running out — are all
 * database facts, not function facts.
 *
 * The database half works on today's dates on purpose. A push is billed in the
 * month it is sent, so a test that sends a May message in October would be
 * testing an accounting rule nobody uses.
 *
 * The transport is a live-channel stub rather than the recording one: a
 * recording is a rehearsal, and a rehearsal reaches no phone, costs nothing
 * and must not stand in for a delivery.
 */
import assert from "node:assert/strict";
import { after, before, describe, it } from "node:test";

import { createPool, hashMrn } from "../api/db.mjs";
import {
	buildJourney,
	JOURNEY_DAYS,
	JOURNEY_TOUCHES_PER_CASE,
	renderJourneyMessage,
} from "../api/line/journey.mjs";
import { makeLineService } from "../api/line/service.mjs";
import { createRecordingTransport } from "../api/line/transport.mjs";
import { makeRoutes } from "../api/routes.mjs";

const URL = process.env.DATABASE_URL;
const SALT = "test-salt";

if (!URL) {
	console.error("DATABASE_URL is not set. Run via: bun run test");
	process.exit(1);
}

const ENROLMENT = "2026-05-04";
const DEVICE = "MDI";

/** A date in the hospital's timezone, offset from today. */
function localDate(offsetDays = 0) {
	const d = new Date();
	d.setDate(d.getDate() + offsetDays);
	return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
		d.getDate(),
	).padStart(2, "0")}`;
}

const TODAY = localDate(0);
const MONTH = TODAY.slice(0, 7);

/** A transport that reaches no phone but claims it did, like the live one. */
function liveStub(sink) {
	return {
		channel: "live",
		async send(to, message) {
			sink.push({ to, message });
			return { ok: true, status: 200 };
		},
	};
}

describe("the learning journey schedule", () => {
	it("runs on the five days the pharmacist named", () => {
		const j = buildJourney({ caseDate: ENROLMENT });
		assert.deepEqual(
			j.map((t) => t.day),
			[3, 7, 14, 24, 28],
		);
		assert.deepEqual(JOURNEY_DAYS, [3, 7, 14, 24, 28]);
	});

	it("dates every touch from the enrolment, not from today", () => {
		const j = buildJourney({ caseDate: ENROLMENT });
		assert.equal(j[0].dueOn, "2026-05-07");
		assert.equal(j[0].key, "2026-05-07:care");
		assert.equal(j[2].dueOn, "2026-05-18");
		assert.equal(j[4].dueOn, "2026-06-01");
	});

	it("makes every touch a push, because a push is what costs quota", () => {
		for (const t of buildJourney({ caseDate: ENROLMENT })) {
			assert.equal(t.kind, "push");
		}
	});

	it("costs five messages a case, which is the quota arithmetic", () => {
		assert.equal(JOURNEY_TOUCHES_PER_CASE, 5);
	});

	it("opens with the caring check the pharmacist asked for", () => {
		const [d3] = buildJourney({ caseDate: ENROLMENT });
		const msg = renderJourneyMessage(d3, { drugLabel: "Symbicort" });
		assert.equal(msg.type, "flex");
		assert.match(msg.altText, /第 3 天/);
		const actions = JSON.stringify(msg.contents);
		assert.match(actions, /view_video/, "the day-3 card can open the video");
		assert.match(actions, /常見問題/, "and the FAQ");
	});

	it("sends the video on day 7 and the quiz on day 24", () => {
		const j = buildJourney({ caseDate: ENROLMENT });
		const d7 = renderJourneyMessage(j[1], { videoInfo: null });
		const d24 = renderJourneyMessage(j[3], { quizInfo: null });
		assert.match(d7.altText, /標準操作短片/);
		assert.match(d24.altText, /隨堂小測驗/);
	});

	it("asks a closed question on day 14, so the answer is one tap", () => {
		const j = buildJourney({ caseDate: ENROLMENT });
		const d14 = renderJourneyMessage(j[2], { drugLabel: "Symbicort" });
		assert.equal(d14.type, "text");
		assert.ok(d14.quickReply, "a closed question yields a tap, not free text");
		assert.equal(d14.quickReply.items.length, 3);
	});

	it("ends with the return-visit reminder on day 28", () => {
		const j = buildJourney({ caseDate: ENROLMENT });
		const d28 = renderJourneyMessage(j[4], {});
		assert.match(d28.altText, /28 天回診/);
	});
});

describe("dispatching the journey", () => {
	let pool;
	let api;
	let line;
	const captured = [];

	before(async () => {
		pool = createPool(URL);
		api = makeRoutes({ query: (t, p) => pool.query(t, p), salt: SALT });
		line = makeLineService({
			query: (t, p) => pool.query(t, p),
			transport: liveStub(captured),
		});
		await pool.query(
			"TRUNCATE line_events, line_deliveries, line_identities, line_medications, followups, physician_queries, session_stages, sessions, case_knowledge, case_steps, clinical_measurements, med_reconciliation, cases, patients RESTART IDENTITY CASCADE",
		);
	});

	after(async () => {
		await pool?.end();
	});

	/** A patient on the journey: a case, consent, a linked account, a device. */
	async function enrolledPatient(
		mrn,
		{ consent = true, stage = "改善後", enrolledDaysAgo = 3 } = {},
	) {
		const c = await api.createCase({
			mrn,
			caseDate: localDate(-enrolledDaysAgo),
			pharmacist: "黃永成",
			drug: "Symbicort",
			qccStage: stage,
			steps: { MDI_搖: "正確" },
		});
		const { rows } = await pool.query(
			"SELECT id FROM patients WHERE mrn_hash = $1",
			[hashMrn(mrn, SALT)],
		);
		const patientId = rows[0].id;
		if (consent) {
			await pool.query(
				"UPDATE patients SET consent_line = true WHERE id = $1",
				[patientId],
			);
			await pool.query(
				"INSERT INTO line_identities (patient_id, line_user_id) VALUES ($1,$2)",
				[patientId, `U_${mrn}`],
			);
			await pool.query(
				`INSERT INTO line_medications (patient_id, role, drug_id, drug_name, device_line, ics)
				 VALUES ($1,'maintenance','Symbicort_Rapihaler','Symbicort Rapihaler',$2,true)`,
				[patientId, DEVICE],
			);
		}
		return { ...c, patientId, lineUserId: `U_${mrn}` };
	}

	async function deliveriesFor(lineUserId) {
		const { rows } = await pool.query(
			"SELECT touch, kind, channel FROM line_deliveries WHERE line_user_id = $1",
			[lineUserId],
		);
		return rows;
	}

	it("sends nothing before the touch is due", async () => {
		await enrolledPatient("JRN000001");
		const r = await line.dispatchJourney({ date: localDate(-1) });
		assert.equal(r.ok, true);
		assert.equal(r.due, 0);
		assert.equal(r.sent, 0);
	});

	it("sends the day-3 touch on the day it falls due", async () => {
		const r = await line.dispatchJourney({ date: TODAY });
		assert.equal(r.due, 1);
		assert.equal(r.sent, 1);
		assert.match(r.sentTouches[0].touch, /:care$/);
		const { rows } = await pool.query(
			"SELECT kind, channel, payload FROM line_deliveries WHERE touch = $1",
			[r.sentTouches[0].touch],
		);
		assert.equal(rows.length, 1);
		assert.equal(rows[0].kind, "push");
		assert.equal(rows[0].channel, "live");
		assert.match(rows[0].payload.altText, /第 3 天/);
	});

	it("does not message the same patient twice on the same day", async () => {
		const before = captured.length;
		const r = await line.dispatchJourney({ date: TODAY });
		assert.equal(r.sent, 0, "the touch was already sent");
		assert.equal(r.skipped.length, 1);
		assert.match(r.skipped[0].reason, /already messaged/);
		assert.equal(
			captured.length - before,
			0,
			"the transport was not called again",
		);
	});

	it("leaves a patient who never consented alone", async () => {
		const p = await enrolledPatient("JRN000002", { consent: false });
		await line.dispatchJourney({ date: TODAY });
		assert.deepEqual(await deliveriesFor(p.lineUserId), []);
	});

	it("leaves the pre-intervention cohort alone", async () => {
		const p = await enrolledPatient("JRN000003", { stage: "改善前" });
		await line.dispatchJourney({ date: TODAY });
		assert.deepEqual(await deliveriesFor(p.lineUserId), []);
	});

	it("sends the day-7 touch to a patient enrolled on the right day", async () => {
		const p = await enrolledPatient("JRN000004", { enrolledDaysAgo: 7 });
		const r = await line.dispatchJourney({ date: TODAY });
		assert.equal(r.sent, 1);
		assert.match(r.sentTouches[0].touch, /:keypoints$/);
		assert.equal((await deliveriesFor(p.lineUserId)).length, 1);
	});

	it("reports the month it has spent", async () => {
		const q = await line.quotaUsage({ month: MONTH });
		assert.equal(q.ok, true);
		assert.equal(q.billable, 2, "two messages went out this month");
		assert.equal(q.recorded, 0, "and no rehearsal was counted against them");
		assert.equal(q.limit, 200);
		assert.ok(q.remaining > 0);
		assert.equal(q.caseCapacity, Math.floor(q.remaining / 5));
	});

	it("lists every case on the journey with what was sent", async () => {
		const board = await line.journeyBoard({ month: localDate(-3).slice(0, 7) });
		assert.equal(board.ok, true);
		for (const row of board.cases) {
			assert.equal(
				row.touches.length,
				5,
				"every case carries the five touches",
			);
		}
		// The day-3 patient was enrolled three days ago, so it is in this
		// month's board, and its touch was sent today.
		const reached = board.cases.find((r) => r.mrnTail === "01");
		assert.ok(reached, "the day-3 patient is on the board");
		assert.equal(reached.sentCount, 1);
		assert.equal(reached.touches.filter((t) => t.sent).length, 1);
	});
});

describe("a rehearsal is not a delivery", () => {
	let pool;
	const original = process.env.LINE_FREE_QUOTA;

	before(async () => {
		pool = createPool(URL);
		await pool.query(
			"TRUNCATE line_events, line_deliveries, line_identities, line_medications, followups, physician_queries, session_stages, sessions, case_knowledge, case_steps, clinical_measurements, med_reconciliation, cases, patients RESTART IDENTITY CASCADE",
		);
	});

	after(async () => {
		if (original === undefined) delete process.env.LINE_FREE_QUOTA;
		else process.env.LINE_FREE_QUOTA = original;
		await pool?.end();
	});

	it("does not spend the allowance, and does not stop the real message", async () => {
		const api = makeRoutes({ query: (t, p) => pool.query(t, p), salt: SALT });
		await api.createCase({
			mrn: "RSH000001",
			caseDate: localDate(-3),
			pharmacist: "黃永成",
			drug: "Symbicort",
			steps: { MDI_搖: "正確" },
		});
		const { rows } = await pool.query(
			"SELECT id FROM patients WHERE mrn_hash = $1",
			[hashMrn("RSH000001", SALT)],
		);
		await pool.query("UPDATE patients SET consent_line = true WHERE id = $1", [
			rows[0].id,
		]);
		await pool.query(
			"INSERT INTO line_identities (patient_id, line_user_id) VALUES ($1,$2)",
			[rows[0].id, "U_RSH000001"],
		);

		// The rehearsal: the recording transport, no phone.
		const rehearsal = makeLineService({
			query: (t, p) => pool.query(t, p),
			transport: createRecordingTransport({ insert: async () => {} }),
		});
		const r1 = await rehearsal.dispatchJourney({ date: TODAY });
		assert.equal(r1.sent, 1, "the rehearsal ran");
		const q1 = await rehearsal.quotaUsage({ month: MONTH });
		assert.equal(q1.billable, 0, "a rehearsal costs nothing");
		assert.equal(q1.recorded, 1, "but it is visible as a rehearsal");

		// The real thing, on the same day.
		const real = [];
		const live = makeLineService({
			query: (t, p) => pool.query(t, p),
			transport: liveStub(real),
		});
		const r2 = await live.dispatchJourney({ date: TODAY });
		assert.equal(r2.sent, 1, "the rehearsal did not block the real message");
		assert.equal(real.length, 1);
		const q2 = await live.quotaUsage({ month: MONTH });
		assert.equal(
			q2.billable,
			1,
			"and now the month has really spent one message",
		);
	});
});

describe("the monthly free allowance", () => {
	let pool;
	let line;
	const original = process.env.LINE_FREE_QUOTA;

	before(async () => {
		pool = createPool(URL);
		line = makeLineService({
			query: (t, p) => pool.query(t, p),
			transport: liveStub([]),
		});
	});

	after(async () => {
		if (original === undefined) delete process.env.LINE_FREE_QUOTA;
		else process.env.LINE_FREE_QUOTA = original;
		await pool?.end();
	});

	it("stops sending when the month's allowance is gone", async () => {
		// The free plan cannot buy more messages, so running past the limit is
		// not a billing problem to solve later — it is a stop.
		process.env.LINE_FREE_QUOTA = "1";
		await pool.query("DELETE FROM line_deliveries");
		await pool.query("DELETE FROM line_identities");
		await pool.query("DELETE FROM line_medications");
		await pool.query("DELETE FROM cases");
		await pool.query("DELETE FROM patients");

		const api = makeRoutes({ query: (t, p) => pool.query(t, p), salt: SALT });
		for (const mrn of ["QTA000001", "QTA000002"]) {
			await api.createCase({
				mrn,
				caseDate: localDate(-3),
				pharmacist: "黃永成",
				drug: "Symbicort",
				steps: { MDI_搖: "正確" },
			});
			const { rows } = await pool.query(
				"SELECT id FROM patients WHERE mrn_hash = $1",
				[hashMrn(mrn, SALT)],
			);
			await pool.query(
				"UPDATE patients SET consent_line = true WHERE id = $1",
				[rows[0].id],
			);
			await pool.query(
				"INSERT INTO line_identities (patient_id, line_user_id) VALUES ($1,$2)",
				[rows[0].id, `U_${mrn}`],
			);
		}

		const first = await line.dispatchJourney({ date: TODAY });
		assert.equal(
			first.sent,
			1,
			"one message fits inside a one-message allowance",
		);
		assert.ok(first.stopped, "and the patient who did not fit is reported");
		assert.match(first.stopped.reason, /allowance/);

		const second = await line.dispatchJourney({ date: TODAY });
		assert.equal(second.sent, 0, "the allowance is spent");
		assert.ok(second.stopped, "and the stop is reported, not silent");
	});
});

/*
 * One unreachable patient must not cost the others their message.
 *
 * This was found by trying to send for real: the first recipient was refused
 * by LINE, and the whole day's batch stopped there. A patient who unfollowed
 * the account, or a recipient LINE refuses for any reason, would have cost
 * every other patient that day's message.
 *
 * The failure must be recorded and visible, and the batch must continue.
 */
describe("a patient who cannot be reached", () => {
	let pool;
	let api;
	let line;

	before(async () => {
		pool = createPool(URL);
		api = makeRoutes({ query: (t, p) => pool.query(t, p), salt: SALT });
		line = makeLineService({
			query: (t, p) => pool.query(t, p),
			transport: {
				channel: "live",
				async send(to) {
					// This patient is not a friend of the account any more.
					if (to.endsWith("UNREACHABLE")) {
						return {
							ok: false,
							status: 400,
							body: '{"message":"Failed to send messages"}',
						};
					}
					return { ok: true, status: 200 };
				},
			},
		});
		await pool.query(
			"TRUNCATE line_events, line_deliveries, line_identities, line_medications, followups, physician_queries, session_stages, sessions, case_knowledge, case_steps, clinical_measurements, med_reconciliation, cases, patients RESTART IDENTITY CASCADE",
		);
	});

	after(async () => {
		await pool?.end();
	});

	async function enrolled(mrn) {
		await api.createCase({
			mrn,
			caseDate: localDate(-3),
			pharmacist: "黃永成",
			drug: "Symbicort",
			qccStage: "改善後",
			steps: { MDI_搖: "正確" },
		});
		const { rows } = await pool.query(
			"SELECT id FROM patients WHERE mrn_hash = $1",
			[hashMrn(mrn, SALT)],
		);
		await pool.query("UPDATE patients SET consent_line = true WHERE id = $1", [
			rows[0].id,
		]);
		await pool.query(
			"INSERT INTO line_identities (patient_id, line_user_id) VALUES ($1,$2)",
			[rows[0].id, `U_${mrn}`],
		);
	}

	it("records the failure and still delivers to everyone else", async () => {
		await enrolled("JRNUNREACHABLE");
		await enrolled("JRNREACHABLE");

		const r = await line.dispatchJourney({ date: TODAY });

		assert.equal(r.ok, true, "the batch itself did not fail");
		assert.equal(r.failedCount, 1, "the unreachable patient is reported");
		assert.match(r.failed[0].reason, /Failed to send messages/);
		assert.equal(r.sent, 1, "the other patient still received the message");
	});

	it("leaves no delivery row behind for the failed send", async () => {
		const { rows } = await pool.query(
			"SELECT count(*)::int AS n FROM line_deliveries WHERE line_user_id = $1",
			["U_JRNUNREACHABLE"],
		);
		assert.equal(rows[0].n, 0, "a failed push is not recorded as sent");
	});

	it("does not spend the monthly allowance on a failed send", async () => {
		const q = await line.quotaUsage({ month: MONTH });
		assert.equal(q.billable, 1, "only the delivered message counts");
	});
});
