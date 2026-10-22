/**
 * LINE: verifiable without an account.
 *
 * The schedule, the rendered payloads, the quota arithmetic and the engagement
 * logic are all exercised here through the recording transport. The only thing
 * not verified is the final HTTPS call to api.line.me, which needs a real
 * channel access token and a real phone to observe.
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
	buildSchedule,
	renderMessage,
	setCriticalCodes,
} from "../api/line/schedule.mjs";
import {
	countsAgainstQuota,
	createRecordingTransport,
	quotaCheck,
} from "../api/line/transport.mjs";
import { CRITICAL_STEP_CODES, STEP_BY_CODE } from "../src/domain/steps.js";

setCriticalCodes(CRITICAL_STEP_CODES);

const CASE = "2026-05-04";

describe("LINE schedule", () => {
	it("schedules nothing when every step was correct", () => {
		const s = buildSchedule({
			caseDate: CASE,
			steps: { MDI_搖: "正確", MDI_吐: "正確" },
		});
		assert.deepEqual(
			s,
			[],
			"no point reminding a patient about a step they already do",
		);
	});

	it("schedules day 1, 3 and 7 for a case with errors", () => {
		const s = buildSchedule({ caseDate: CASE, steps: { MDI_搖: "錯誤" } });
		assert.deepEqual(
			s.map((t) => t.day),
			[1, 3, 7],
		);
		assert.equal(s[0].kind, "push");
	});

	it("dates the touches relative to the case, not today", () => {
		const s = buildSchedule({ caseDate: CASE, steps: { MDI_搖: "錯誤" } });
		assert.equal(s[0].key, "2026-05-05:remind");
		assert.equal(s[2].key, "2026-05-11:visit");
	});

	it("puts the critical step first", () => {
		const s = buildSchedule({
			caseDate: CASE,
			steps: { MDI_開: "錯誤", MDI_搖: "錯誤" }, // 開 is ordinary, 搖 is ★
		});
		assert.deepEqual(s[0].stepCodes, ["MDI_搖", "MDI_開"]);
	});

	it("ignores steps that do not apply", () => {
		const s = buildSchedule({
			caseDate: CASE,
			steps: { MDI_漱: "na", MDI_搖: "錯誤" },
		});
		assert.deepEqual(s[0].stepCodes, ["MDI_搖"]);
	});

	it("carries whether the patient actually performed the step", () => {
		const s = buildSchedule({
			caseDate: CASE,
			steps: { MDI_搖: "錯誤" },
			demonstrated: { MDI_搖: true },
		});
		assert.equal(s[0].demonstratedCount, 1);
	});
});

describe("LINE messages", () => {
	const steps = STEP_BY_CODE;

	it("names the step that actually went wrong", () => {
		const [d1] = buildSchedule({ caseDate: CASE, steps: { MDI_搖: "錯誤" } });
		const msg = renderMessage(d1, { drugLabel: "Symbicort Rapihaler", steps });
		assert.equal(msg.type, "text");
		assert.match(msg.text, /搖：瓶底向上搖勻/);
		assert.match(msg.text, /Symbicort Rapihaler/);
	});

	it("does not congratulate a patient for performing a step they got wrong", () => {
		const [withDemo] = buildSchedule({
			caseDate: CASE,
			steps: { MDI_搖: "錯誤" },
			demonstrated: { MDI_搖: true },
		});
		const msg = renderMessage(withDemo, { drugLabel: "Symbicort", steps });
		assert.match(
			msg.text,
			/操作過.*還是不對/,
			"says they tried and still got it wrong",
		);
		assert.ok(
			!/做出來/.test(msg.text),
			"must not claim they succeeded at a failed step",
		);
	});

	it("distinguishes never attempting the step from attempting it wrongly", () => {
		const [notDemo] = buildSchedule({
			caseDate: CASE,
			steps: { MDI_搖: "錯誤" },
		});
		const msg = renderMessage(notDemo, { drugLabel: "Symbicort", steps });
		assert.match(msg.text, /沒做到/);
	});

	it("asks a closed question on day 3 so the reply is structured and free", () => {
		const [, d3] = buildSchedule({ caseDate: CASE, steps: { MDI_搖: "錯誤" } });
		const msg = renderMessage(d3, { drugLabel: "Symbicort", steps });
		assert.ok(msg.quickReply, "a closed question yields a tap, not free text");
		assert.equal(msg.quickReply.items.length, 3);
		for (const item of msg.quickReply.items) {
			assert.equal(item.type, "action");
		}
	});

	it("produces a valid LINE text payload shape", () => {
		const [d1] = buildSchedule({ caseDate: CASE, steps: { MDI_吐: "錯誤" } });
		const msg = renderMessage(d1, { drugLabel: "Symbicort", steps });
		assert.deepEqual(Object.keys(msg).sort(), ["text", "type"]);
		assert.equal(typeof msg.text, "string");
		assert.ok(
			msg.text.length > 0 && msg.text.length <= 5000,
			"LINE caps a text message",
		);
	});
});

describe("LINE quota", () => {
	it("treats replies and greetings as free, push as billable", () => {
		assert.equal(countsAgainstQuota("push"), true);
		assert.equal(countsAgainstQuota("reply"), false);
		assert.equal(countsAgainstQuota("welcome"), false);
	});

	it("counts three billable messages per corrected case", () => {
		const s = buildSchedule({ caseDate: CASE, steps: { MDI_搖: "錯誤" } });
		const q = quotaCheck(s);
		assert.equal(q.billable, 3);
		assert.ok(q.withinFreeTier);
		assert.ok(!q.hardStop);
	});

	it("fits the 50-cases-per-month cohort inside the 200 free tier", () => {
		// 50 new cases a month, three pushes each.
		const s = [];
		for (let i = 0; i < 50; i += 1) {
			s.push(...buildSchedule({ caseDate: CASE, steps: { MDI_搖: "錯誤" } }));
		}
		const q = quotaCheck(s);
		assert.equal(q.billable, 150);
		assert.equal(q.free, 50);
		assert.ok(
			q.withinFreeTier,
			"150 of 200 leaves headroom for a 33% enrolment rise",
		);
	});

	it("flags the hard stop the free plan cannot buy past", () => {
		const s = [];
		for (let i = 0; i < 80; i += 1) {
			s.push(...buildSchedule({ caseDate: CASE, steps: { MDI_搖: "錯誤" } }));
		}
		const q = quotaCheck(s);
		assert.equal(q.billable, 240);
		assert.equal(
			q.hardStop,
			true,
			"the free plan stops sending; it cannot be topped up",
		);
	});

	it("needs no quota at all for a cohort with nothing wrong", () => {
		const q = quotaCheck([]);
		assert.equal(q.billable, 0);
		assert.equal(q.free, 200);
	});
});

describe("recording transport", () => {
	it("captures exactly what would have been sent", async () => {
		const sent = [];
		const t = createRecordingTransport({ insert: async (x) => sent.push(x) });
		const [d1] = buildSchedule({ caseDate: CASE, steps: { MDI_搖: "錯誤" } });
		const msg = renderMessage(d1, {
			drugLabel: "Symbicort",
			steps: STEP_BY_CODE,
		});

		const res = await t.send("U1234567890", msg);
		assert.equal(res.ok, true);
		assert.equal(t.channel, "recording");
		assert.equal(sent.length, 1);
		assert.equal(sent[0].to, "U1234567890");
		assert.deepEqual(
			sent[0].message,
			msg,
			"the captured payload is the payload",
		);
	});
});
