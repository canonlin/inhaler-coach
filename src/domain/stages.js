/**
 * Bridge between the AI coaching flow and the technique checklist.
 *
 * The camera scores four stages; the check table has thirty-three steps. This
 * maps each AI-judged step back to the stage that produced its score, so a
 * pharmacist confirms what the camera saw instead of re-entering it.
 *
 * Stage numbers come from src/config/stages.js. Keep the two in step: a stage
 * added there without a line here will be silently ignored.
 */

/** Stage id → the steps it judges. */
export const STAGE_STEPS = {
	1: ["MDI_搖"],
	2: ["MDI_吐"],
	3: ["MDI_壓", "MDI_吸", "MDI_閉"],
	4: ["MDI_漱"],
};

/** Step code → the stage that judges it. */
export const STEP_STAGE = Object.fromEntries(
	Object.entries(STAGE_STEPS).flatMap(([stage, codes]) =>
		codes.map((c) => [c, Number(stage)]),
	),
);

/**
 * Turn one stage's result into the checklist verdicts it implies.
 *
 * `passed` is the camera's call on the whole stage, so every step in that stage
 * inherits it. Attempts and confidence travel with it so the pharmacist can see
 * how sure the camera was rather than a bare verdict.
 *
 * @param {number} stage
 * @param {{passed: boolean|null, attempts: number, ai_confidence: number}} result
 * @returns {Record<string, {value: '正確'|'錯誤', attempts: number, confidence: number}>}
 */
export function stageVerdicts(stage, result) {
	if (result.passed == null) return {};
	const out = {};
	for (const code of STAGE_STEPS[stage] ?? []) {
		out[code] = {
			value: result.passed ? "正確" : "錯誤",
			attempts: result.attempts ?? 0,
			confidence: Number(result.ai_confidence ?? 0),
		};
	}
	return out;
}
