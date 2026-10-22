/**
 * The QCC first-month learning journey.
 *
 * The pharmacist's plan, in the order they stated it: day 3 a caring check-in
 * with buttons, day 7 the clinical points with the video, day 14 the two-week
 * reminder, day 24 a quiz whose answers become the measurement, day 28 the
 * return-visit reminder. Five touches, one case, one month.
 *
 * This is a different program from the error-driven reinforcement schedule in
 * schedule.mjs. That one answers "which step did this patient get wrong, and
 * how do we fix it"; this one answers "this person is in their first month —
 * what do they need to hear, and when". They overlap on days 3 and 7, so the
 * dispatcher sends at most one push per patient per day.
 *
 * The schedule is a pure function of the case date: given the same enrolment
 * it says the same thing, which is what makes the dry run meaningful.
 */

import {
	buildCareCheckFlex,
	buildClinicReminderFlex,
	buildQuizCardFlex,
	buildVideoCardFlex,
} from "./flex.mjs";

/** Days after enrolment, in order. The first month, five touches. */
export const JOURNEY_DAYS = [3, 7, 14, 24, 28];

/** Pushes one case costs. The quota arithmetic depends on this number. */
export const JOURNEY_TOUCHES_PER_CASE = JOURNEY_DAYS.length;

/** What each touch is for, in the pharmacist's words. */
const PURPOSES = [
	{ day: 3, purpose: "care", label: "關懷訊息＋按鈕互動" },
	{ day: 7, purpose: "keypoints", label: "臨床使用重點＋短影音" },
	{ day: 14, purpose: "fortnight", label: "兩週使用重點" },
	{ day: 24, purpose: "quiz", label: "隨堂小測驗（收集指標）" },
	{ day: 28, purpose: "clinic", label: "回診提醒" },
];

/**
 * The journey for one case.
 *
 * @param {{caseDate: string, deviceLine?: string}} input
 * @returns {Array<{key: string, day: number, kind: string, purpose: string, label: string, deviceLine: string, dueOn: string}>}
 */
export function buildJourney({ caseDate, deviceLine = "MDI" }) {
	const date = new Date(`${caseDate}T00:00:00Z`);
	const at = (day) =>
		new Date(date.getTime() + day * 86400000).toISOString().slice(0, 10);

	return PURPOSES.map(({ day, purpose, label }) => ({
		key: `${at(day)}:${purpose}`,
		day,
		kind: "push",
		purpose,
		label,
		deviceLine,
		dueOn: at(day),
	}));
}

/**
 * The message for one touch.
 *
 * The video and quiz cards are the same templates the patient can open at any
 * time from the menu, so the scheduled message and the tapped one say the
 * same thing.
 *
 * @param {object} touch
 * @param {{drugLabel?: string, videoInfo?: object|null, quizInfo?: object|null}} ctx
 */
export function renderJourneyMessage(
	touch,
	{ drugLabel = "", videoInfo = null, quizInfo = null } = {},
) {
	switch (touch.purpose) {
		case "care":
			return buildCareCheckFlex({
				deviceType: touch.deviceLine,
				drugLabel,
			});
		case "keypoints":
			return buildVideoCardFlex({
				deviceType: touch.deviceLine,
				videoInfo,
			});
		case "fortnight":
			return buildFortnightCheck({ drugLabel });
		case "quiz":
			return buildQuizCardFlex({
				deviceType: touch.deviceLine,
				quizInfo,
			});
		case "clinic":
			return buildClinicReminderFlex();
		default:
			return { type: "text", text: "您的吸入劑使用提醒。" };
	}
}

/**
 * The two-week check.
 *
 * A closed question, so the answer is one tap: free to send, free to reply,
 * and countable. An open question here would get a patient typing to a bot at
 * the worst possible moment.
 */
function buildFortnightCheck({ drugLabel }) {
	const head = drugLabel ? `${drugLabel}｜` : "";
	return {
		type: "text",
		text: `${head}用到第 2 週了，習慣了嗎？\n再確認三件事：\n1. 每次用之前有沒有搖勻？\n2. 吸之前有沒有先吐氣？\n3. 吸完有沒有閉氣 5 秒？`,
		quickReply: {
			items: [
				{
					type: "action",
					action: { type: "message", label: "都做對了", text: "都做對了" },
				},
				{
					type: "action",
					action: {
						type: "message",
						label: "還有一兩個不順",
						text: "還有一兩個不順",
					},
				},
				{
					type: "action",
					action: {
						type: "message",
						label: "忘了怎麼用",
						text: "忘了怎麼用",
					},
				},
			],
		},
	};
}
