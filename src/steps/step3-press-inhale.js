/**
 * Press + inhale correctness — by the inhaler's POSTURE, not by hearing the spray.
 *
 * Everything else was a dead end, each for a measured reason: the webcam mic
 * can't hear the actuation (the spray is below its noise floor), the thumb-press
 * landmark heuristic fires ~0 % of the time, and the mm canister travel is
 * invisible. What actually separates a correct actuation from an incorrect one,
 * on the pharmacist's OWN labelled data (0519, 吸壓 correct vs incorrect), is
 * where the red canister is and whether it is held still:
 *
 *                 canister vertical position     position steadiness
 *   correct           0.35  (up, at the mouth)      steady
 *   incorrect         0.85  (down, away)            ~2× more movement
 *
 * A half-frame separation in position — because a correct actuation means the
 * inhaler is AT THE MOUTH and HELD STEADY while you press and breathe in, and a
 * wrong one has it down at your waist or wandering. So this scores exactly that:
 * the red canister present, close to the mouth, and steady. The windowed spray
 * analysis (press-analyzer.js) is a bonus confirmation on the rare audible spray,
 * not the gate; the device posture is.
 *
 * Thresholds are calibrated to that data but, like the shake detector, want a
 * live-camera pass to pin down. The required breath-hold DURATION is enforced by
 * the caller (stage.holdSeconds).
 */

/** How close the canister centre must be to the mouth (normalized distance) to
 * count as "at the mouth". */
const AT_MOUTH_DIST = 0.22;

/** How steady the device must be held. `steadiness` is 0..1 from device-tracker
 * (1 = rock steady). Correct presses were ~2× steadier than incorrect. */
const MIN_STEADY = 0.45;

export class PressInhaleDetector {
	/**
	 * @param {{present:boolean, center:{x:number,y:number}|null, steadiness:number}} device
	 * @param {{x:number,y:number}|null} mouthPoint - mouth centre from the face mesh
	 */
	detect({ device, mouthPoint }) {
		const present = !!device?.present;
		const atMouth =
			present &&
			mouthPoint != null &&
			dist(device.center, mouthPoint) < AT_MOUTH_DIST;
		const steady = (device?.steadiness ?? 0) >= MIN_STEADY;

		const correct = present && atMouth && steady;
		return {
			present,
			atMouth,
			steady,
			pressing: correct,
			shouldStartBreathHold: correct,
			confidence:
				(present ? 0.34 : 0) + (atMouth ? 0.33 : 0) + (steady ? 0.33 : 0),
		};
	}

	reset() {}
}

function dist(a, b) {
	if (!a || !b) return Infinity;
	return Math.hypot(a.x - b.x, a.y - b.y);
}
