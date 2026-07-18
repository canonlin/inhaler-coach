/**
 * The collector's live detector read-out — and the per-session confusion matrix.
 *
 * The recorder logs, every frame, the same signals the coaching app's detectors
 * consume (motion vs background, the red canister's position/area, steadiness).
 * This module runs the CURRENT detectors over those signals so the collector can
 * (a) show the pharmacist, in a side panel, what the detector thinks in real time
 * while they record, and (b) score every task against its known ground truth and
 * save that — turning each recording into labelled, IN-DOMAIN validation data,
 * which is exactly what the 0519 seed set (a different person and framing) lacks.
 *
 * The thresholds mirror the shipped detectors (step1-shake / step2-exhale /
 * step3-press-inhale). Two differences from the coaching app, both because the
 * collector runs without the face mesh (for speed): exhale and press judge the
 * canister's ABSOLUTE height instead of its distance to the mouth. That raw-Y
 * signal is the one validated on 0519; distance-to-mouth (stronger, person-
 * invariant) is what the coaching app uses when the face mesh is on.
 */

/** Shake: hand-region motion this many times the background counts as shaking
 * (step1-shake.js RATIO_SHAKE). */
const RATIO_SHAKE = 8;
/** Press: canister above this normalized height (0=top) is "up at the mouth". */
const PRESS_Y_UP = 0.5;
/** Exhale: canister at or below this height — or mostly absent — is "lowered
 * away" (the correct pre-actuation posture; mirror of step2). */
const EXHALE_Y_AWAY = 0.6;
const PRESENT_FRAC = 0.5;

/** Which detector to run for each task, and what it should conclude. A metric
 * of null is not judged (e.g. spray counting is audio-only). `expect` null means
 * "show the read-out but don't score it" — genuinely ambiguous tasks. */
export const TASK_JUDGE = {
	still: { metric: "shake", expect: false },
	move: { metric: "shake", expect: false },
	shake_normal: { metric: "shake", expect: true },
	shake_hard: { metric: "shake", expect: true },
	shake_gentle: { metric: "shake", expect: true },
	shake_limited: { metric: "shake", expect: true },
	spray_x2: { metric: "shake", expect: true },
	press_air_steady: { metric: "press", expect: null }, // up but not at a mouth
	press_mouth_steady: { metric: "press", expect: true },
	handle: { metric: "press", expect: false },
	exhale: { metric: "exhale", expect: true },
	speak: { metric: "exhale", expect: false },
};

const median = (xs) => {
	if (!xs.length) return 0;
	const v = [...xs].sort((a, b) => a - b);
	const m = v.length >> 1;
	return v.length % 2 ? v[m] : (v[m - 1] + v[m]) / 2;
};

/**
 * Run one metric over a window of logged frames.
 * @param {"shake"|"press"|"exhale"} metric
 * @param {Array} frames - recorder frame objects ({motionHand,motionBg,dev,steady})
 * @returns {{pass:boolean, label:string, detail:string, ready:boolean}}
 */
export function judge(metric, frames) {
	if (frames.length < 2)
		return { pass: false, label: "偵測中…", detail: "", ready: false };

	// Every step first requires a REAL inhaler in frame (the object detector, not
	// the old colour filter). No inhaler → nothing can pass, whatever the motion.
	// shake reads the presence flag stamped on the motion sample; press/exhale
	// read the detection box `det` = [present, cx, cy, score].
	const inhalerFrac =
		metric === "shake"
			? frames.filter((f) => f.inhaler).length / frames.length
			: frames.filter((f) => f.det).length / frames.length;
	const hasInhaler = inhalerFrac >= PRESENT_FRAC;

	if (metric === "shake") {
		const ratios = frames
			.filter((f) => f.motionBg > 0.01)
			.map((f) => f.motionHand / f.motionBg);
		const r = ratios.length ? median(ratios) : 0;
		if (!hasInhaler)
			return { pass: false, label: "沒看到吸入器", detail: "把吸入器拿進畫面再搖", ready: true };
		return {
			pass: r >= RATIO_SHAKE,
			label: r >= RATIO_SHAKE ? "搖晃中" : "沒在搖",
			detail: `動作強度 ${r.toFixed(0)}（門檻 ${RATIO_SHAKE}）`,
			ready: true,
		};
	}

	if (!hasInhaler)
		return { pass: false, label: "沒看到吸入器", detail: "把吸入器拿進畫面", ready: true };

	// Canister vertical position from the real detection box.
	const y = median(frames.filter((f) => f.det).map((f) => f.det[2]));

	if (metric === "press") {
		const up = y < PRESS_Y_UP;
		return {
			pass: up,
			label: up ? "對準嘴邊" : "抬到嘴邊",
			detail: `吸入器高度 ${y.toFixed(2)}（需 <${PRESS_Y_UP}）`,
			ready: true,
		};
	}

	if (metric === "exhale") {
		const away = y >= EXHALE_Y_AWAY;
		return {
			pass: away,
			label: away ? "吸入器已移開" : "吸入器還在嘴邊",
			detail: `吸入器高度 ${y.toFixed(2)}（移開需 ≥${EXHALE_Y_AWAY}）`,
			ready: true,
		};
	}

	return { pass: false, label: "—", detail: "", ready: false };
}

/**
 * Score every task in a finished session against its expected outcome.
 * @param {Array} frames - inference-rate frames (canister/steadiness), tagged with `label`
 * @param {Array} [motion] - fast fixed-rate shake-motion samples, tagged with `label`
 * @returns {Array<{taskId,metric,expected,predicted,pass,match,n,detail}>}
 */
export function judgeSession(frames, motion = []) {
	const out = [];
	for (const [taskId, spec] of Object.entries(TASK_JUDGE)) {
		if (!spec.metric) continue;
		// Shake must be judged on the dense, fixed-rate motion series — its ratio
		// is meaningless at the inference loop's slow, variable rate.
		const src = spec.metric === "shake" ? motion : frames;
		const taskFrames = src.filter((f) => f.label === taskId);
		if (taskFrames.length < 2) continue;
		const r = judge(spec.metric, taskFrames);
		out.push({
			taskId,
			metric: spec.metric,
			expected: spec.expect,
			predicted: r.pass,
			match: spec.expect == null ? null : r.pass === spec.expect,
			n: taskFrames.length,
			detail: r.detail,
		});
	}
	return out;
}
