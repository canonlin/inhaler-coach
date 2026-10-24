/**
 * The research plan's measurement: two groups, before and after.
 *
 * The QCC measures every inhaler by 改善前後對比; the research plan measures
 * 吸必擴 patients by the difference between two groups. Same cases, different
 * measurement — so this file holds the research one and nothing else.
 *
 * The rules it keeps:
 *
 * - **NULL is not 對照組.** A case with no arm was never in the study. It is
 *   not counted as a control; it is not counted at all.
 * - **People, not rows.** A patient with an M1 assessment and a
 *   re-enrollment is one patient, and the plan enrolled people.
 * - **The denominator travels with the number.** Every figure below carries
 *   how many people it is counted over, because a rate without its denominator
 *   is a number about the wrong thing.
 */
import { STAGE_AFTER, STAGE_BEFORE } from "../src/domain/enrollment-sheet.js";
import {
	ARM_CONTROL,
	ARM_EXPERIMENTAL,
	ARM_LABEL,
	STUDY_TARGET,
} from "../src/domain/study-arm.js";
import { mcnemar, techniqueStats } from "./metrics.mjs";

/**
 * How many people each group needs before the two groups are compared.
 *
 * A difference between two error rates needs both sides to carry enough people
 * for the difference to be about the intervention rather than about two
 * individuals. Below this floor the numbers are still shown — they are real and
 * they belong on screen — but the comparison is withheld, because a gap
 * computed from one or two people per group is a story, not a result.
 */
export const MIN_PAIRED_PER_GROUP = 5;

/**
 * @typedef {object} GroupOutcome
 * @property {string} arm
 * @property {string} label
 * @property {number} people      People in this group, across every visit.
 * @property {object} before
 * @property {object} after
 * @property {object} paired       McNemar on the people measured twice.
 */

/**
 * @param {Array<object>} rows rows carrying patientId, qccStage and studyArm
 * @returns {{groups: GroupOutcome[], enough: boolean, people: number, comparison: object|null}}
 */
export function researchOutcome(rows) {
	const withArm = rows.filter((r) => r.studyArm);
	const groups = [ARM_EXPERIMENTAL, ARM_CONTROL].map((arm) => {
		const mine = withArm.filter((r) => r.studyArm === arm);
		return {
			arm,
			label: ARM_LABEL[arm],
			people: new Set(mine.map((r) => r.patientId).filter(Boolean)).size,
			before: techniqueStats(mine.filter((r) => r.qccStage === STAGE_BEFORE)),
			after: techniqueStats(mine.filter((r) => r.qccStage === STAGE_AFTER)),
			paired: mcnemar(mine),
		};
	});

	const [experimental, control] = groups;
	const enough =
		experimental.paired.measured >= MIN_PAIRED_PER_GROUP &&
		control.paired.measured >= MIN_PAIRED_PER_GROUP;

	return {
		groups,
		enough,
		people: experimental.people + control.people,
		/** The plan's own number, so the screen prints it beside the count. */
		target: STUDY_TARGET,
		/**
		 * The comparison the study is for: how much lower the AI group's
		 * post-intervention error rate is than the usual-education group's.
		 *
		 * Positive means the AI group is doing better (lower error rate). It is
		 * null when either group is below the floor, and the screen says so
		 * rather than printing a gap out of one or two people.
		 */
		comparison: enough
			? {
					/** The AI group's error rate after the intervention. */
					experimentalAfter: experimental.after.errorRate,
					/** The usual-education group's error rate after it. */
					controlAfter: control.after.errorRate,
					/** control − experimental: positive means the AI group is better. */
					gap: control.after.errorRate - experimental.after.errorRate,
					/** How many people each side of the comparison is counted over. */
					experimentalPeople: experimental.paired.measured,
					controlPeople: control.paired.measured,
				}
			: null,
	};
}
