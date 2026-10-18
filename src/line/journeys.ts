/**
 * Client for the journey endpoint. Thin by design: validation lives in
 * validate.ts, so a failed submit shows the server's message verbatim rather
 * than a client-side paraphrase of it.
 */

import type { RegistrationInput } from "./validate";

export interface JourneyResponse {
	ok: boolean;
	patientId: string;
	tag1: string;
	tag2: string;
	medications: { role: string; drugName: string }[];
}

export async function submitJourney(
	input: RegistrationInput & { lineUserId: string },
): Promise<JourneyResponse> {
	const res = await fetch("/api/line/journeys", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(input),
	});
	const body = (await res.json()) as
		| JourneyResponse
		| { ok: boolean; message?: string };
	if (!res.ok || body.ok !== true) {
		throw new Error(
			(body as { message?: string }).message ?? "送出失敗，請稍後再試。",
		);
	}
	return body as JourneyResponse;
}
