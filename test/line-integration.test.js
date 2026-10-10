/**
 * LINE against a real database, still without a LINE account.
 *
 * The recording transport captures each message into line_deliveries, so this
 * proves the chain end to end: consent, identity, scheduling, payload shape,
 * quota and engagement recording. Only the HTTPS call to api.line.me is out of
 * reach, and that is the only thing the token would unlock.
 */
import assert from "node:assert/strict";
import { after, before, describe, it } from "node:test";

import { createPool, hashMrn } from "../api/db.mjs";
import { makeRoutes } from "../api/routes.mjs";
import { makeLineService } from "../api/line/service.mjs";
import { createRecordingTransport } from "../api/line/transport.mjs";
import { CRITICAL_STEP_CODES } from "../src/domain/steps.js";

const URL = process.env.DATABASE_URL;
const SALT = "test-salt";

// scripts/test.mjs refuses to start without this, so reaching here with no URL
// means the file was invoked directly rather than through the gate.
if (!URL) {
	console.error("DATABASE_URL is not set. Run via: bun run test");
	process.exit(1);
}

if (true) {
	let pool;
	let api;
	let line;
	/** What the transport was asked to send, in order. */
	const captured = [];

	before(async () => {
		pool = createPool(URL);
		api = makeRoutes({ query: (t, p) => pool.query(t, p), salt: SALT });
		line = makeLineService({
			query: (t, p) => pool.query(t, p),
			transport: createRecordingTransport({
				insert: async (m) => {
					captured.push(m);
				},
			}),
		});
		await pool.query(
			"TRUNCATE line_events, line_deliveries, line_identities, followups, physician_queries, session_stages, sessions, case_knowledge, case_steps, clinical_measurements, med_reconciliation, cases, patients RESTART IDENTITY CASCADE",
		);
	});

	after(async () => {
		await pool?.end();
	});

	async function aCaseWithError() {
		const c = await api.createCase({
			mrn: "LINE000001",
			caseDate: "2026-05-04",
			pharmacist: "黃永成",
			drug: "Symbicort",
			steps: { MDI_搖: "錯誤", MDI_開: "正確" },
			demonstrated: { MDI_搖: false },
		});
		const { rows } = await pool.query("SELECT id FROM patients WHERE mrn_hash = $1", [
			hashMrn("LINE000001", SALT),
		]);
		return { ...c, patientId: rows[0].id };
	}

	describe("consent and identity", () => {
		it("refuses to plan before consent is given", async () => {
			const c = await aCaseWithError();
			const plan = await line.plan({ caseId: c.id });
			assert.equal(plan.ok, true, "planning is allowed; sending is not");
			assert.equal(plan.consentLine, false);
			assert.equal(plan.linked, false);
			assert.equal(plan.planned.length, 3, "the schedule is computed regardless");
		});

		it("links a LINE account once the patient consents", async () => {
			await aCaseWithError();
			const r = await line.link({ mrn: hashMrn("LINE000001", SALT), lineUserId: "U_LINE_001" });
			assert.equal(r.ok, true);
			const { rows } = await pool.query("SELECT line_user_id FROM line_identities");
			assert.equal(rows[0].line_user_id, "U_LINE_001");
		});

		it("records consent on the patient row", async () => {
			const { rows } = await pool.query("SELECT consent_line FROM patients");
			assert.equal(rows[0].consent_line, true);
		});

		it("refuses an unknown patient rather than creating one", async () => {
			await assert.rejects(
				() => line.link({ mrn: hashMrn("NOBODY", SALT), lineUserId: "U_X" }),
				/patient not found/,
			);
		});
	});

	describe("planning", () => {
		it("plans three touches and shows the quota it will consume", async () => {
			const plan = await line.plan({ caseId: (await aCaseWithError()).id });
			assert.equal(plan.linked, true);
			assert.equal(plan.planned.length, 3);
			assert.deepEqual(plan.planned.map((p) => p.day), [1, 3, 7]);
			assert.equal(plan.quota.billable, 3);
			assert.ok(plan.quota.withinFreeTier);
		});

		it("renders every planned touch into a sendable LINE payload", async () => {
			const plan = await line.plan({ caseId: (await aCaseWithError()).id });
			for (const touch of plan.planned) {
				assert.ok(touch.message, `${touch.key} has no message`);
				assert.ok(["text", "flex", "image", "video"].includes(touch.message.type));
			}
			const remind = plan.planned[0].message;
			assert.match(remind.text, /搖/);
		});

		it("explains itself when nothing needs reinforcing", async () => {
			const clean = await api.createCase({
				mrn: "LINE000001",
				caseDate: "2026-06-01",
				pharmacist: "黃永成",
				drug: "Symbicort",
				timepoint: "M1",
				steps: { MDI_搖: "正確", MDI_開: "正確" },
			});
			const plan = await line.plan({ caseId: clean.id });
			assert.deepEqual(plan.planned, []);
			assert.match(plan.reason, /沒有需要加強/);
		});
	});

	describe("delivery and engagement", () => {
		it("records what would have been sent", async () => {
			const c = await aCaseWithError();
			const plan = await line.plan({ caseId: c.id });
			const first = plan.planned[0];
			const sent = await line.send({
				patientId: c.patientId,
				lineUserId: "U_LINE_001",
				touch: first.key,
				kind: first.kind,
				message: first.message,
				sentOn: "2026-05-05",
			});
			assert.equal(sent.ok, true);
			assert.equal(sent.counted, true, "a push consumes quota");

			const { rows } = await pool.query(
				"SELECT kind, channel, payload FROM line_deliveries WHERE touch = $1",
				[first.key],
			);
			assert.equal(rows[0].kind, "push");
			assert.equal(rows[0].channel, "recording");
			assert.match(rows[0].payload.text, /搖/);
		});

		it("attributes a reply back to the patient through the LINE identity", async () => {
			const r = await line.recordEvent({
				eventId: "evt-1",
				type: "message",
				lineUserId: "U_LINE_001",
				payload: { text: "都做對了" },
			});
			assert.equal(r.ok, true);
			assert.equal(r.recorded, true);
			assert.ok(r.patientId, "the event resolves to a patient");
		});

		it("ignores a replayed webhook rather than double counting", async () => {
			const again = await line.recordEvent({
				eventId: "evt-1",
				type: "message",
				lineUserId: "U_LINE_001",
			});
			assert.equal(again.recorded, false, "LINE retries; a retry must not double count");
		});

		it("rejects an event naming a step the spine does not define", async () => {
			await assert.rejects(
				() =>
					line.recordEvent({
						eventId: "evt-2",
						type: "step_view",
						stepCode: "XXX_搖",
						lineUserId: "U_LINE_001",
					}),
				/unknown step XXX_搖/,
			);
		});

		it("does not message a patient twice when the cron retries", async () => {
			const c = await aCaseWithError();
			const plan = await line.plan({ caseId: c.id });
			const touch = plan.planned[1]; // a distinct day, so the touch key differs
			const before = captured.length;
			const args = {
				patientId: c.patientId,
				lineUserId: "U_LINE_001",
				touch: touch.key,
				kind: touch.kind,
				message: touch.message,
				sentOn: "2026-05-07",
			};
			const first = await line.send(args);
			const second = await line.send(args);
			assert.equal(first.ok, true);
			assert.equal(second.ok, true);
			assert.equal(second.skipped, "already sent", "the retry must not re-message");
			assert.equal(captured.length - before, 1, "the transport was called once");
		});

		it("releases the claim when the send fails, so a LINE outage is retryable", async () => {
			const c = await aCaseWithError();
			const plan = await line.plan({ caseId: c.id });
			const touch = plan.planned[2];

			// Swap in a transport that fails, the way LINE does on a 5xx.
			const failing = makeLineService({
				query: (t, p) => pool.query(t, p),
				transport: { channel: "live", async send() { return { ok: false, status: 500, body: "boom" }; } },
			});
			await assert.rejects(
				() => failing.send({
					patientId: c.patientId,
					lineUserId: "U_LINE_001",
					touch: touch.key,
					kind: touch.kind,
					message: touch.message,
					sentOn: "2026-05-11",
				}),
				/boom/,
			);
			const { rows } = await pool.query(
				"SELECT count(*)::int AS n FROM line_deliveries WHERE touch = $1",
				[touch.key],
			);
			assert.equal(rows[0].n, 0, "a failed send must leave nothing claimed");
		});

		it("counts no quota for a touch that was skipped", async () => {
			const c = await aCaseWithError();
			const plan = await line.plan({ caseId: c.id });
			const args = {
				patientId: c.patientId,
				lineUserId: "U_LINE_001",
				touch: plan.planned[0].key,
				kind: "push",
				message: plan.planned[0].message,
				sentOn: "2026-05-05",
			};
			await line.send(args);
			const again = await line.send(args);
			assert.equal(again.counted, false, "a message never sent cannot consume quota");
		});

		it("reports response rate per message kind", async () => {
			const e = await line.engagement({ since: "2026-01-01" });
			assert.equal(e.ok, true);
			const push = e.byKind.find((k) => k.kind === "push");
			assert.ok(push.sent >= 1);
		});
	});
}
