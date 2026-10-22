/**
 * The webhook signature.
 *
 * The webhook is the only public write path into a roster of real patients.
 * A request that cannot prove it came from LINE must not be answered, and a
 * deploy that has no secret configured must say so rather than quietly
 * accepting everything.
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { signBody, verifySignature } from "../api/line/signature.mjs";

const SECRET = "test-channel-secret";
const BODY = JSON.stringify({
	destination: "U0123456789",
	events: [{ type: "follow", replyToken: "rt" }],
});

describe("LINE webhook signature", () => {
	it("accepts the signature LINE would have produced", () => {
		const verdict = verifySignature({
			secret: SECRET,
			body: BODY,
			signature: signBody(SECRET, BODY),
		});
		assert.equal(verdict.ok, true);
	});

	it("rejects a signature made with a different secret", () => {
		const verdict = verifySignature({
			secret: SECRET,
			body: BODY,
			signature: signBody("someone-elses-secret", BODY),
		});
		assert.equal(verdict.ok, false);
		assert.match(verdict.reason, /mismatch/);
	});

	it("rejects a body that changed after it was signed", () => {
		const signature = signBody(SECRET, BODY);
		const verdict = verifySignature({
			secret: SECRET,
			body: BODY.replace("follow", "message"),
			signature,
		});
		assert.equal(
			verdict.ok,
			false,
			"a body edited in flight is not the body LINE sent",
		);
	});

	it("rejects a request with no signature header", () => {
		const verdict = verifySignature({ secret: SECRET, body: BODY });
		assert.equal(verdict.ok, false);
		assert.match(verdict.reason, /missing/);
	});

	it("treats an unconfigured secret as a failure, not a pass", () => {
		const verdict = verifySignature({
			secret: undefined,
			body: BODY,
			signature: signBody(SECRET, BODY),
		});
		assert.equal(verdict.ok, false);
		assert.match(verdict.reason, /no channel secret/);
	});
});

describe("the webhook endpoint", () => {
	/** A request shaped like the one Vercel hands the function. */
	function fakeReq(body, signature) {
		const headers = signature ? { "x-line-signature": signature } : {};
		return {
			method: "POST",
			url: "/api/line/webhook",
			headers,
			async *[Symbol.asyncIterator]() {
				yield Buffer.from(body, "utf8");
			},
		};
	}

	function fakeRes() {
		const res = { statusCode: 200, payload: null, headers: {} };
		res.setHeader = (k, v) => {
			res.headers[k] = v;
		};
		res.status = (code) => {
			res.statusCode = code;
			return res;
		};
		res.end = (payload) => {
			res.payload = payload ? JSON.parse(payload) : null;
			return res;
		};
		return res;
	}

	async function callWebhook(req) {
		const { default: handler } = await import("../api/index.mjs");
		const res = fakeRes();
		await handler(req, res);
		return res;
	}

	const original = process.env.LINE_CHANNEL_SECRET;
	const originalRoutes = globalThis.__inhalerRoutes;

	/** Stand in for the router: the edge is what is under test here. */
	function stubRoutes() {
		globalThis.__inhalerRoutes = {
			lineEvent: async () => ({ ok: true, received: 1, processed: [] }),
		};
	}

	it("answers a correctly signed webhook", async () => {
		process.env.LINE_CHANNEL_SECRET = SECRET;
		stubRoutes();
		const res = await callWebhook(fakeReq(BODY, signBody(SECRET, BODY)));
		assert.equal(res.statusCode, 200);
		assert.equal(res.payload.ok, true);
		assert.equal(res.payload.signatureVerified, true);
	});

	it("refuses a webhook with the wrong signature", async () => {
		process.env.LINE_CHANNEL_SECRET = SECRET;
		stubRoutes();
		const res = await callWebhook(fakeReq(BODY, signBody("wrong", BODY)));
		assert.equal(res.statusCode, 401);
		assert.equal(res.payload.ok, false);
	});

	it("refuses a webhook with no signature at all", async () => {
		process.env.LINE_CHANNEL_SECRET = SECRET;
		stubRoutes();
		const res = await callWebhook(fakeReq(BODY));
		assert.equal(res.statusCode, 401);
	});

	it("says so when the deploy has no secret configured", async () => {
		delete process.env.LINE_CHANNEL_SECRET;
		stubRoutes();
		const res = await callWebhook(fakeReq(BODY, signBody(SECRET, BODY)));
		assert.equal(
			res.statusCode,
			200,
			"an unconfigured deploy is not a broken deploy",
		);
		assert.equal(
			res.payload.signatureVerified,
			false,
			"but the response must not claim the request was verified",
		);
	});

	// The environment is process-wide; put it back so another file is not
	// affected by what this one did.
	process.on("exit", () => {
		if (original === undefined) delete process.env.LINE_CHANNEL_SECRET;
		else process.env.LINE_CHANNEL_SECRET = original;
		if (originalRoutes === undefined) delete globalThis.__inhalerRoutes;
		else globalThis.__inhalerRoutes = originalRoutes;
	});
});
