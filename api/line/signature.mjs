/**
 * The LINE webhook signature.
 *
 * A webhook endpoint that answers anyone is an open door: a stranger can post
 * a fake `follow` event and make the bot greet them, or post a fake
 * `postback` and make the system believe a patient answered a quiz. The
 * hospital's patient roster is behind that endpoint, so the request has to
 * prove it came from LINE before it is parsed.
 *
 * LINE signs the raw request body with HMAC-SHA256 keyed by the channel
 * secret, base64-encoded, in `X-Line-Signature`. The raw bytes matter: parsing
 * the JSON and re-serialising it changes the bytes, and the signature stops
 * matching. So the HTTP edge reads the body as text and verifies that text.
 *
 * @see https://developers.line.biz/en/reference/messaging-api/#verify-signature
 */

import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * The header LINE sends, and the value it must equal.
 *
 * @param {string} secret channel secret
 * @param {string} body the exact request body, unmodified
 * @returns {string} base64 HMAC-SHA256
 */
export function signBody(secret, body) {
	return createHmac("sha256", secret).update(body, "utf8").digest("base64");
}

/**
 * Verify a signature.
 *
 * A missing secret is reported as a failure rather than a pass. The caller
 * decides what a failure means: in production a configured secret makes it a
 * 401, and an unconfigured secret is a misconfiguration the caller should see
 * rather than a silent "everything is fine".
 *
 * @param {{secret?: string, body: string, signature?: string}} input
 * @returns {{ok: boolean, reason?: string}}
 */
export function verifySignature({ secret, body, signature }) {
	if (!secret) return { ok: false, reason: "no channel secret configured" };
	if (!signature) return { ok: false, reason: "missing X-Line-Signature" };

	const expected = Buffer.from(signBody(secret, body), "utf8");
	const received = Buffer.from(String(signature), "utf8");
	if (expected.length !== received.length) {
		return { ok: false, reason: "signature mismatch" };
	}
	return timingSafeEqual(expected, received)
		? { ok: true }
		: { ok: false, reason: "signature mismatch" };
}
