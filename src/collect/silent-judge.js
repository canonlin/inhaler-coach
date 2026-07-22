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
 * step3-press-inhale):
 *   - shake / press run the same motion-ratio and canister-height tests the
 *     coaching app uses. Press judges the canister's ABSOLUTE height rather than
 *     its distance to the mouth, because the collector runs without the face mesh
 *     (for speed); that raw-Y signal is the one validated on 0519.
 *   - exhale runs the SHIPPED respiration detector (analyzeRespiration) over the
 *     chest-motion series the recorder now logs per frame (`resp`), not a canister
 *     proxy. This is the point of capturing the respiration channel in the
 *     collector: it turns each exhale/speak clip into in-domain validation of the
 *     detector the coaching app actually ships. rPPG (forehead green) rides along
 *     as telemetry but does not decide — it is motion here, not blood volume.
 */

import { analyzeRespiration } from "../detection/respiration-analyzer.js";

/** Shake: hand-region motion this many times the background counts as shaking
 * (step1-shake.js RATIO_SHAKE). */
const RATIO_SHAKE = 8;
/** Press: canister above this normalized height (0=top) is "up at the mouth". */
const PRESS_Y_UP = 0.5;
/** How much of the window must contain a detection to count as "inhaler present".
 * Low, and matched to the recorder's own presence smoothing, so the per-task
 * verdict agrees with the always-on read-out instead of lagging half a window
 * behind it (they were desyncing). Detection false positives are ~0, so a small
 * fraction is safe. */
const PRESENT_FRAC = 0.25;

/** Fast-fail capture thresholds. Deliberately "basically never" levels, so the
 * gate only fires on a clearly broken capture (nothing recorded, inhaler never
 * seen, mask never found) — not on borderline ones. A false alarm wastes the
 * pharmacist's time and erodes trust; missing a systematic setup problem wastes
 * the whole session. These are tuned to catch the latter without the former. */
const MIN_FRAMES = 10;
/** Exhale: minimum frames that produced a chest signal (mask ROI found). Below
 * this the respiration detector has nothing to band-pass, so the clip can't
 * validate anything — almost always "no blue mask / torso out of frame". */
const MIN_RESP_FRAMES = 20;

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

	// Exhale is judged from breathing, not the inhaler — the person exhales with
	// the device lowered, so there is no inhaler gate here. Run the shipped
	// respiration detector over the logged chest-motion series (`resp[0]`).
	if (metric === "exhale") {
		const series = frames.filter((f) => f.resp);
		if (series.length < 2)
			return {
				pass: false,
				label: "偵測中…",
				detail: "沒有胸口訊號",
				ready: false,
			};
		const r = analyzeRespiration(
			series.map((f) => f.resp[0]),
			series.map((f) => f.resp[1]),
			estimateFps(series),
		);
		return {
			pass: r.detected,
			label: r.detected ? "偵測到吐氣" : "沒偵測到呼吸",
			detail: r.detected
				? `呼吸 ${r.rateBpm.toFixed(0)} 次/分（胸口振幅 ${r.chest.amplitude.toFixed(1)}）`
				: `胸口振幅 ${r.chest.amplitude.toFixed(1)}、週期性 ${r.chest.periodicity.toFixed(2)}（不足）`,
			ready: true,
		};
	}

	// Shake and press both require a REAL inhaler in frame (the object detector,
	// not the old colour filter). No inhaler → nothing can pass. shake reads the
	// presence flag stamped on the motion sample; press reads the detection box
	// `det` = [present, cx, cy, score].
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
			return {
				pass: false,
				label: "沒看到吸入器",
				detail: "把吸入器拿進畫面再搖",
				ready: true,
			};
		return {
			pass: r >= RATIO_SHAKE,
			label: r >= RATIO_SHAKE ? "搖晃中" : "沒在搖",
			detail: `動作強度 ${r.toFixed(0)}（門檻 ${RATIO_SHAKE}）`,
			ready: true,
		};
	}

	if (metric === "press") {
		if (!hasInhaler)
			return {
				pass: false,
				label: "沒看到吸入器",
				detail: "把吸入器拿進畫面",
				ready: true,
			};
		// Canister vertical position from the real detection box.
		const y = median(frames.filter((f) => f.det).map((f) => f.det[2]));
		const up = y < PRESS_Y_UP;
		return {
			pass: up,
			label: up ? "對準嘴邊" : "抬到嘴邊",
			detail: `吸入器高度 ${y.toFixed(2)}（需 <${PRESS_Y_UP}）`,
			ready: true,
		};
	}

	return { pass: false, label: "—", detail: "", ready: false };
}

/** Sampling rate from the window's frame timestamps (ms) — the inference loop
 * runs at a variable few-fps rate, and analyzeRespiration needs it for the
 * breathing band edges. */
function estimateFps(frames) {
	if (frames.length < 2) return 15;
	const span = (frames.at(-1).t - frames[0].t) / (frames.length - 1);
	return span > 0 ? 1000 / span : 15;
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

/**
 * Fast-fail check for the task that was just recorded: did the capture even give
 * the detector something usable to judge?
 *
 * This is the "validator" half of the collector. Without it, a systematic setup
 * problem — camera too far so the inhaler is never detected, no blue surgical
 * mask so the chest ROI is never found, torso out of frame — is invisible until
 * the whole session is analysed offline, by which point all ten clips are wasted.
 * Surfacing it at the review step lets the pharmacist fix the setup and redo the
 * ONE task, before recording nine more useless ones.
 *
 * Crucially this judges CAPTURE VALIDITY, not model correctness. It must never
 * fire just because the detector disagreed with ground truth: that disagreement,
 * on a valid capture, is the single most valuable thing the collector produces —
 * an in-domain sample the shipped model gets wrong. Forcing a redo there would
 * quietly filter the dataset down to cases the model already handles, which is
 * the exact opposite of what this collection is for.
 *
 * @param {string} taskId
 * @param {Array} frames - the recorder's inference-rate frames so far
 * @param {Array} motion - the recorder's fast shake-motion samples so far
 * @returns {{ok:boolean, reason:string}}
 */
export function captureHealth(taskId, frames, motion = []) {
	const spec = TASK_JUDGE[taskId];
	if (!spec?.metric) return { ok: true, reason: "" };

	const src = spec.metric === "shake" ? motion : frames;
	const f = src.filter((x) => x.label === taskId);
	if (f.length < MIN_FRAMES)
		return {
			ok: false,
			reason: "這一項幾乎沒錄到畫面，確認相機有開、再錄一次",
		};

	if (spec.metric === "shake" || spec.metric === "press") {
		const present =
			spec.metric === "shake"
				? f.filter((x) => x.inhaler).length
				: f.filter((x) => x.det).length;
		if (present / f.length < PRESENT_FRAC)
			return {
				ok: false,
				reason:
					"整段幾乎沒偵測到吸入器 — 把吸入器拿進畫面、離鏡頭近一點再錄一次",
			};
	}

	if (spec.metric === "exhale") {
		const withChest = f.filter((x) => x.resp).length;
		if (withChest < MIN_RESP_FRAMES)
			return {
				ok: false,
				reason: "沒抓到胸口起伏 — 確認有戴藍色口罩、上半身在畫面裡再錄一次",
			};
	}

	return { ok: true, reason: "" };
}
