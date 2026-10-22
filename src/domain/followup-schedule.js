/**
 * The return-visit schedule for the pharmacist's Checklist.
 *
 * 10/19 會議記錄【五】：「Checklist 的時機點是在個案加入後，等他第 28 天（或第 14、21
 * 天）回診時，後台清單會提示今天有哪些病患需要進行 Checklist 追蹤，藥師點進去就能勾選
 * 填寫，不需要再人工記日子。」
 *
 * So the days on which the patient is expected back are fixed here, once, and
 * both the API (which enqueues the slots) and the pharmacist app (which labels
 * them) read this list. A schedule written twice is a schedule that will
 * disagree with itself the first time it changes.
 *
 * Why three days and not one: the patient comes back on whichever of them the
 * clinic happens to see them, and the whole point of the reminder is that the
 * pharmacist does not have to keep the days in their head. One slot would
 * either prompt too early (and be ignored) or too late (and be missed).
 *
 * The pharmacist does the Checklist once, at the visit that actually happened;
 * the other two slots are superseded rather than left to rot — see the close
 * endpoint in api/routes.mjs.
 */

/**
 * One planned return visit.
 *
 * @typedef {object} ReturnVisit
 * @property {string} slot  stored in followups.slot: 'D14' | 'D21' | 'D28'
 * @property {number} day   days after the case date
 * @property {string} label what the pharmacist reads
 */

/** @type {ReturnVisit[]} */
export const RETURN_VISITS = [
	{ slot: "D14", day: 14, label: "第 14 天回診" },
	{ slot: "D21", day: 21, label: "第 21 天回診" },
	{ slot: "D28", day: 28, label: "第 28 天回診" },
];

/**
 * The task a slot carries in the queue.
 *
 * A critical error is what the ★ rule was for — 「2 週內再評估」 — so it rides
 * along on the first slot instead of creating a task of its own: two rows for
 * one visit is one visit the pharmacist works twice.
 *
 * @param {ReturnVisit} visit
 * @param {boolean} hasCritical
 * @returns {string}
 */
export function slotTask(visit, hasCritical) {
	const base = `${visit.slot} 回診 Checklist`;
	return visit.day === 14 && hasCritical ? `${base}（有關鍵錯誤）` : base;
}

/**
 * What the pharmacist should see first today.
 *
 * A critical error outranks everything (P1), the first return visit outranks
 * the later ones (P2), and the rest are routine (P3).
 *
 * @param {ReturnVisit} visit
 * @param {boolean} hasCritical
 * @returns {"P1"|"P2"|"P3"}
 */
export function slotPriority(visit, hasCritical) {
	if (hasCritical && visit.day === 14) return "P1";
	return visit.day === 14 ? "P2" : "P3";
}
