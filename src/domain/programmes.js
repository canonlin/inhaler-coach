/**
 * The programmes this platform measures.
 *
 * One back office, one database, one sign-in — and more than one programme.
 *
 * ① QCC／深耕計畫（醫品品質改善）: every inhaler on the formulary, measured
 *    by 改善前後對比 — the enrollment is the 前測, M1 is the 後測.
 * ② 研究計畫（AI 練習 vs 一般衛教）: 吸必擴 patients only, measured by the
 *    difference between two groups.
 *
 * They share the cases and they do not share a measurement. So each programme
 * says three things here: who it counts (scope), how it is measured
 * (measurement), and what its denominator is. The third one is the one that
 * gets forgotten: a number without its denominator is a number about the wrong
 * thing, and the screen prints the denominator next to every figure.
 *
 * Adding a programme is an entry here — not another item in the navigation.
 * The navigation is the pharmacist's jobs (record, follow up, read the
 * results, edit the teaching material); a programme is a measurement, and the
 * outcomes screen grows a tab for it. A fifth navigation item per programme
 * would make the back office a list of studies instead of a place to work.
 */
import { STUDY_COHORT_LABEL, STUDY_TARGET } from "./study-arm.js";

export const PROGRAMME_QCC = "qcc";
export const PROGRAMME_RESEARCH = "research";

/**
 * @typedef {object} Programme
 * @property {string} id            Stable id; the join between the declaration and the measurement.
 * @property {string} label          What the screen calls it.
 * @property {string} scope          Which rows this programme counts.
 * @property {string} measurement    How it is measured.
 * @property {string} denominator    What its numbers are counted over, in the pharmacist's words.
 * @property {string} [note]         One line the screen shows under the tab.
 */

/** @type {readonly Programme[]} */
export const PROGRAMMES = [
	{
		id: PROGRAMME_QCC,
		label: "QCC／深耕計畫",
		scope: "enrolment",
		measurement: "before-after",
		denominator: "收案病人",
		note: "每一種吸入劑都收案，改善前後用同一套清單比較。",
	},
	{
		id: PROGRAMME_RESEARCH,
		label: `研究計畫：${STUDY_COHORT_LABEL}`,
		scope: "study-arm",
		measurement: "two-groups",
		denominator: "研究病人",
		note: `AI 練習與一般衛教兩組比較，計畫收 ${STUDY_TARGET} 人。`,
	},
];

/** The programme with this id, or undefined. */
export function programmeById(id) {
	return PROGRAMMES.find((p) => p.id === id);
}
