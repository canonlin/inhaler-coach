/**
 * The LINE touch schedule.
 *
 * Pure functions: given a case, they say what to send and when. No I/O, no
 * tokens. That is the point — the whole schedule is verifiable before a LINE
 * account exists, and only the final HTTP hop is left unverified.
 *
 * Design follows the diagnosis in
 * docs/superpowers/specs/2026-10-09-first-encounter-tam-design.md: only about
 * 42% of observed errors are forgetting, so the schedule reinforces rather than
 * re-teaches, and every message names the step that actually went wrong.
 */

/**
 * One scheduled contact. `day` is days after the case date.
 *
 * @typedef {object} Touch
 * @property {string} key           `${date}:${name}`, unique per touch
 * @property {number} day           days after the case date
 * @property {'welcome'|'push'|'reply'} kind
 * @property {string[]} stepCodes   steps this touch is about, worst first
 * @property {number} demonstratedCount how many the patient actually performed
 */

/**
 * Build the schedule for one case.
 *
 * A case with nothing wrong schedules nothing: there is no point reminding a
 * patient about a step they already do.
 *
 * @param {{caseDate: string, steps: Record<string,string>, demonstrated?: Record<string,boolean>}} input
 * @returns {Touch[]}
 */
export function buildSchedule({ caseDate, steps, demonstrated = {} }) {
	const date = new Date(`${caseDate}T00:00:00Z`);
	const at = (day) => new Date(date.getTime() + day * 86400000).toISOString().slice(0, 10);

	const wrong = Object.entries(steps ?? {})
		.filter(([, v]) => v === "錯誤")
		.map(([code]) => code);
	if (!wrong.length) return [];

	// Rank by criticality first: a wrong ★ step outranks a wrong ordinary one.
	const ordered = wrong.sort((a, b) => criticalRank(b) - criticalRank(a) || a.localeCompare(b));
	const demonstratedCount = ordered.filter((c) => demonstrated[c]).length;

	return [
		{
			key: `${at(1)}:remind`,
			day: 1,
			kind: "push",
			stepCodes: ordered,
			demonstratedCount,
		},
		{
			key: `${at(3)}:selfcheck`,
			day: 3,
			kind: "push",
			stepCodes: ordered,
			demonstratedCount,
		},
		{
			key: `${at(7)}:visit`,
			day: 7,
			kind: "push",
			stepCodes: ordered,
			demonstratedCount,
		},
	];
}

/**
 * Render a touch as the message that would be sent.
 *
 * Returns a LINE-shaped message object, so the recording transport and the real
 * one send identical bytes.
 *
 * @param {Touch} touch
 * @param {{drugLabel: string, steps: Record<string, object>}} ctx
 * @returns {object} a LINE message payload
 */
export function renderMessage(touch, { drugLabel, steps }) {
	const named = touch.stepCodes.map((c) => {
		const s = steps[c];
		return { code: c, char: s?.char ?? c, text: s?.text ?? c };
	});
	const title = named[0] ? `${named[0].char}：${named[0].text}` : "";

	switch (touch.key.split(":")[1]) {
		case "remind":
			// Every step in this schedule is one the patient got wrong, so
			// "performed it" never means "did it correctly". Praising a patient
			// for performing a step they failed would contradict the visit they
			// just had. The two cases need different words, not softer praise.
			return {
				type: "text",
				text:
					touch.demonstratedCount === touch.stepCodes.length
						? `${drugLabel}｜${title}\n昨天你有操作過，但這一步還是不對。\n「點下面選單 → 今天的練習」照著做一次就好。`
						: `${drugLabel}｜${title}\n這個步驟昨天沒做到，今天再試一次。\n「點下面選單 → 今天的練習」`,
			};
		case "selfcheck":
			return {
				type: "text",
				text: `${drugLabel}｜今天試過了嗎？`,
				quickReply: {
					items: [
						{ type: "action", action: { type: "message", label: "都做對了", text: "都做對了" } },
						{ type: "action", action: { type: "message", label: "還有一兩個不順", text: "還有一兩個不順" } },
						{ type: "action", action: { type: "message", label: "忘了怎麼用", text: "忘了怎麼用" } },
					],
				},
			};
		case "visit":
			return {
				type: "text",
				text: `${drugLabel}｜一週了。\n回診時我們會再看你操作一次：${title}`,
			};
		default:
			return { type: "text", text: title };
	}
}

/** Critical steps first, then alphabetical so the order is stable. */
function criticalRank(code) {
	return CRITICAL.has(code) ? 1 : 0;
}

/**
 * Set of ★ codes. Injected by the caller in tests; defaults to the pMDI set so
 * this module has no import cycle with the spine.
 */
let CRITICAL = new Set();
export function setCriticalCodes(codes) {
	CRITICAL = new Set(codes);
}