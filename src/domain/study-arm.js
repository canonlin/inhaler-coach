/**
 * Which arm an enrollment belongs to.
 *
 * The study is 1:1 and alternating: the first patient is experimental, the
 * second control, the third experimental, and so on. The pharmacist may
 * override any single case — a patient who will not use the camera, a case
 * she knows belongs in the other arm — so the rotation is a suggestion and
 * the override is a fact of the record.
 *
 * The rotation lives here, in the domain, because three things have to agree
 * on it: the form that shows the suggestion, the API that assigns the arm, and
 * the count that stays on screen while she works.
 *
 * The suggestion follows the last arm that was assigned, whatever its source.
 * That makes the sequence self-correcting: if she moves one case to the other
 * arm, the next suggestion moves with it and the 1:1 holds. If the suggestion
 * ignored overrides, a single override would silently shift every case after
 * it, and the balance would have to be repaired by hand.
 */
export const ARM_EXPERIMENTAL = "experimental";
export const ARM_CONTROL = "control";
export const ARMS = [ARM_EXPERIMENTAL, ARM_CONTROL];

/** How the arm was decided. A manual override is a fact about the study. */
export const ARM_SOURCE_ALTERNATING = "alternating";
export const ARM_SOURCE_MANUAL = "manual";

/**
 * The research cohort — the products the 1:1 allocation applies to.
 *
 * The allocation belongs to the research plan, and the research plan is 100
 * Symbicort patients, 50 AI and 50 usual education. The QCC is a different
 * programme: it covers every inhaler, and its measurement is the before/after
 * of 改善前後對比, not a group allocation.
 *
 * Putting an arm on every enrolment — which is what this file did first —
 * makes three things wrong at once. The balance on screen counts people who
 * are not in the study. The rotation spends its 50/50 on inhalers the study
 * never enrolled. And a QCC case ends up carrying a research label that no
 * QCC analysis should ever read.
 *
 * The list is one place, so the API, the form and the documents agree about
 * who is in the study. When the research plan widens, this is the line that
 * changes. The label is the name the pharmacist says; the catalogue carries
 * the English one, and the two have to travel together.
 */
export const STUDY_COHORT = [
	{ name: "Symbicort", label: "吸必擴（Symbicort Rapihaler）" },
];

/** The product keys in the research cohort. */
export const STUDY_COHORT_DRUGS = STUDY_COHORT.map((c) => c.name);

/**
 * How many people the research plan takes.
 *
 * 100 Symbicort patients, 50 AI and 50 usual education. The number is the
 * plan's, and it is the reason the balance on screen is worth watching: a
 * hundred and one people is a different study from a hundred, and the 50/50
 * the analysis compares is a 50/50 the plan actually ran.
 *
 * The count is people, not cases: a patient with an M1 assessment and a
 * re-enrollment is one person, and the plan enrolled one hundred people.
 */
export const STUDY_TARGET = 100;

/** How the cohort is named on screen. */
export const STUDY_COHORT_LABEL = STUDY_COHORT.map((c) => c.label).join("、");

/**
 * Is this product in the research cohort?
 *
 * @param {string} drugName the spreadsheet key of the product
 * @returns {boolean}
 */
export function inStudyCohort(drugName) {
	return STUDY_COHORT_DRUGS.includes(String(drugName));
}

/**
 * The name of each arm.
 *
 * The cast is what tells the type checker that a screen may ask for an arm by
 * name: without it the object keeps the shape of its two keys, and looking up
 * an arm that came from the database is an error rather than a lookup.
 */
export const ARM_LABEL = /** @type {Record<string, string>} */ ({
	[ARM_EXPERIMENTAL]: "實驗組",
	[ARM_CONTROL]: "對照組",
});

/** What each arm means, for the pharmacist who is about to assign one. */
export const ARM_MEANING = /** @type {Record<string, string>} */ ({
	[ARM_EXPERIMENTAL]: "AI 練習",
	[ARM_CONTROL]: "一般衛教",
});

/**
 * @param {unknown} value
 * @returns {boolean}
 */
export function isArm(value) {
	return ARMS.includes(String(value));
}

/**
 * The arm that comes after the given one. With no previous case, the first
 * patient is experimental.
 *
 * @param {string | null | undefined} previous
 * @returns {string}
 */
export function nextArm(previous) {
	if (previous === ARM_EXPERIMENTAL) return ARM_CONTROL;
	if (previous === ARM_CONTROL) return ARM_EXPERIMENTAL;
	return ARM_EXPERIMENTAL;
}

/**
 * Whether the arm the pharmacist chose came from the rotation or replaced it.
 *
 * @param {string} chosen
 * @param {string} suggested
 * @returns {string}
 */
export function armSourceFor(chosen, suggested) {
	return chosen === suggested ? ARM_SOURCE_ALTERNATING : ARM_SOURCE_MANUAL;
}

/**
 * What stays on screen while she works: the counts, the ratio, and the arm the
 * rotation suggests next.
 *
 * The target and the room left are part of it because the plan has a number: a
 * pharmacist who cannot see that the study has taken everyone it was going to
 * take will keep allocating, and the balance will drift away from the 50/50
 * the analysis compares.
 *
 * @param {{experimental?: number, control?: number, previous?: string | null}} counts
 */
export function armBalance(counts = {}) {
	const experimental = counts.experimental ?? 0;
	const control = counts.control ?? 0;
	const previous = counts.previous ?? null;
	const target = STUDY_TARGET;
	const enrolled = experimental + control;
	return {
		experimental,
		control,
		total: enrolled,
		/** As a person would say it: 「12:10」. */
		ratio: `${experimental}:${control}`,
		previous,
		next: nextArm(previous),
		target,
		enrolled,
		/** Has the study taken everyone the plan says it takes? */
		full: enrolled >= target,
		/** How many people the plan still has room for. */
		remaining: Math.max(0, target - enrolled),
	};
}
