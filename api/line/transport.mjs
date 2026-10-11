/**
 * How a message leaves the system.
 *
 * Two implementations of one interface:
 *   RecordingTransport — writes to line_deliveries instead of sending. This is
 *                       what makes the whole flow verifiable with no LINE
 *                       account: every message the system would have sent is
 *                       captured, with the same payload bytes.
 *   LiveTransport      — POSTs to api.line.me. Needs a channel access token.
 *
 * Both produce the identical request body. Swapping them changes one line.
 */

export const QUOTA_FREE_KINDS = new Set(["welcome", "reply"]);

/**
 * @param {{url?: string, token: string, fetchImpl?: typeof fetch}} cfg
 */
export function createLiveTransport({
	url = "https://api.line.me/v2/bot/message/push",
	token,
	fetchImpl = fetch,
} = {}) {
	if (!token)
		throw new Error("LiveTransport needs a LINE channel access token");

	return {
		channel: "live",
		/** @returns {Promise<{ok: boolean, status: number, body?: string}>} */
		async send(to, message) {
			const res = await fetchImpl(url, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ to, messages: [message] }),
			});
			return {
				ok: res.ok,
				status: res.status,
				body: res.ok ? undefined : await res.text(),
			};
		},
	};
}

/**
 * Captures instead of sending. Used by tests and by the pre-launch dry run so
 * that a campaign can be inspected before a single person is messaged.
 *
 * @param {{insert: Function}} deps
 */
export function createRecordingTransport({ insert }) {
	if (typeof insert !== "function")
		throw new Error("RecordingTransport needs an insert function");

	return {
		channel: "recording",
		async send(to, message) {
			await insert({ to, message });
			return { ok: true, status: 0 };
		},
	};
}

/**
 * Whether a send consumes the monthly quota.
 *
 * LINE bills push and broadcast; replies, greetings and keyword responses are
 * free. Getting this wrong is how a hospital quietly exhausts its 200 free
 * messages in three weeks.
 *
 * @param {string} kind 'push' | 'reply' | 'welcome'
 */
export function countsAgainstQuota(kind) {
	return !QUOTA_FREE_KINDS.has(kind);
}

/**
 * Free-tier arithmetic, so the plan can be checked before it runs.
 * Taiwan's Communication plan allows 200 messages a month and cannot buy more.
 *
 * @param {Array<{kind: string}>} planned
 * @param {{limit?: number}} [opts]
 */
export function quotaCheck(planned, { limit = 200 } = {}) {
	const billable = planned.filter((p) => countsAgainstQuota(p.kind)).length;
	return {
		billable,
		free: limit - billable,
		withinFreeTier: billable <= limit,
		/** Hard stop: the free plan cannot exceed the limit. */
		hardStop: billable > limit,
	};
}
