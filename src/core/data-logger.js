/**
 * Sends the AI coaching result to the v2 API.
 *
 * Previously this POSTed to a Google Apps Script endpoint with query-string
 * parameters, which put the coaching data in a different database from the one
 * the dashboard reads. Both now live behind POST /api/sessions.
 *
 * The medical record number never leaves the browser in a URL: it goes in the
 * request body, and the API returns only a display tail.
 */
import { state } from "./state.js";

// import.meta.env exists only under Vite; the unit tests import this file
// directly, so resolve defensively.
const BASE = (import.meta.env?.BASE_URL ?? "/").replace(/\/$/, "");
export const SESSION_ENDPOINT = `${BASE}/api/sessions`.replace(/\/{2,}/g, "/");

/** Stage 0 is the intro video and carries no technique judgement. */
const SCORED_STAGES = [1, 2, 3, 4];

/**
 * Collect the per-stage result the API expects:
 *   a       attempts
 *   c       AI confidence 0–1
 *   p       pharmacist verdict: correct | incorrect | not_recorded
 *   passed  whether the stage was cleared
 */
export function buildSessionPayload() {
	const stages = {};
	for (const i of SCORED_STAGES) {
		stages[String(i)] = {
			a: state.stageAttempts[i] ?? 0,
			c: state.stageAIConfidence[i] ?? 0,
			p: state.stagePharmacist[i] ?? "not_recorded",
			passed: Boolean(state.stagePassed),
		};
	}
	return {
		mrn: state.patientId,
		device: "MDI",
		completed: true,
		stages,
	};
}

/**
 * @returns {Promise<{sent: boolean, why?: string, record?: object}>}
 */
export async function sendSessionData() {
	if (!state.patientId) return { sent: false, why: "no patient id" };
	if (state.sessionDataSent) return { sent: false, why: "already sent" };

	for (const i of SCORED_STAGES) {
		if (!state.stagePharmacist[i] || state.stagePharmacist[i] === "") {
			return { sent: false, why: `stage ${i} not recorded by the pharmacist` };
		}
	}

	// Mark before awaiting: a double-tap must not create two sessions, and a
	// failed send is retried by the caller rather than silently double-posted.
	state.sessionDataSent = true;

	try {
		const res = await fetch(SESSION_ENDPOINT, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(buildSessionPayload()),
		});
		const json = await res.json().catch(() => ({}));
		if (!res.ok || json.ok === false) {
			state.sessionDataSent = false;
			return { sent: false, why: json.error ?? `HTTP ${res.status}` };
		}
		return { sent: true, record: json };
	} catch (e) {
		state.sessionDataSent = false;
		return {
			sent: false,
			why: e instanceof Error ? e.message : "network error",
		};
	}
}
