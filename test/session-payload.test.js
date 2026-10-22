/** The session payload the AI end posts to /api/sessions. */
import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { buildSessionPayload } from "../src/core/data-logger.js";
import { resetSessionData, state } from "../src/core/state.js";

function seed(overrides = {}) {
	resetSessionData();
	state.patientId = "A123456789";
	state.stageAttempts = { 1: 3, 2: 5, 3: 2, 4: 1 };
	state.stageAIConfidence = { 1: 0.87, 2: 0.62, 3: 0.91, 4: 0.74 };
	state.stagePharmacist = {
		1: "correct",
		2: "incorrect",
		3: "correct",
		4: "not_recorded",
	};
	Object.assign(state, overrides);
}

describe("session payload", () => {
	it("maps the four scored stages, skipping the intro video", () => {
		seed();
		const { stages } = buildSessionPayload();
		assert.deepEqual(Object.keys(stages).sort(), ["1", "2", "3", "4"]);
		assert.equal(
			stages["0"],
			undefined,
			"stage 0 is the intro and carries no judgement",
		);
	});

	it("carries attempts, confidence and the pharmacist verdict", () => {
		seed();
		const { stages } = buildSessionPayload();
		assert.deepEqual(stages["1"], {
			a: 3,
			c: 0.87,
			p: "correct",
			passed: false,
		});
		assert.equal(stages["2"].a, 5);
		assert.equal(stages["2"].p, "incorrect");
	});

	it("sends the medical record number in the body, not a query string", () => {
		seed();
		const body = JSON.stringify(buildSessionPayload());
		assert.ok(body.includes('"mrn":"A123456789"'));
		assert.ok(
			!body.includes("?"),
			"no query string, so the id stays out of access logs",
		);
	});

	it("keeps confidence within the database CHECK range", () => {
		seed();
		for (const s of Object.values(buildSessionPayload().stages)) {
			assert.ok(s.c >= 0 && s.c <= 1, `confidence ${s.c} out of range`);
			assert.ok(Number.isInteger(s.a) && s.a >= 0);
		}
	});

	it("defaults an unset stage verdict instead of sending undefined", () => {
		seed();
		delete state.stagePharmacist[4];
		const { stages } = buildSessionPayload();
		assert.equal(stages["4"].p, "not_recorded");
	});
});
describe("session reporting", () => {
	it("refuses to send without a patient id rather than sending an empty one", async () => {
		const { sendSessionData } = await import("../src/core/data-logger.js");
		resetSessionData();
		state.patientId = "";
		const r = await sendSessionData();
		assert.equal(r.sent, false);
		assert.equal(r.why, "no patient id");
	});

	it("holds back the send until the pharmacist has judged every stage", async () => {
		const { sendSessionData } = await import("../src/core/data-logger.js");
		resetSessionData();
		state.patientId = "A123456789";
		state.stagePharmacist = { 1: "correct", 2: "", 3: "correct", 4: "correct" };
		const r = await sendSessionData();
		assert.equal(r.sent, false);
		assert.match(r.why, /stage 2/);
	});

	it("posts to the v2 API path, not the retired Apps Script", async () => {
		const { SESSION_ENDPOINT } = await import("../src/core/data-logger.js");
		assert.match(SESSION_ENDPOINT, /\/api\/sessions$/);
		assert.ok(!SESSION_ENDPOINT.includes("script.google.com"));
	});
});
