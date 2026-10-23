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
 * @param {{experimental?: number, control?: number, previous?: string | null}} counts
 */
export function armBalance(counts = {}) {
	const experimental = counts.experimental ?? 0;
	const control = counts.control ?? 0;
	const previous = counts.previous ?? null;
	return {
		experimental,
		control,
		total: experimental + control,
		/** As a person would say it: 「12:10」. */
		ratio: `${experimental}:${control}`,
		previous,
		next: nextArm(previous),
	};
}
