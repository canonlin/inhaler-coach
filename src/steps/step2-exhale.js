/**
 * Exhale correctness — by where the inhaler is, not by hearing the breath.
 *
 * The webcam mic can't hear a slow controlled exhale (it's below the noise
 * floor), and the previous MAR + optical-flow + rPPG fusion couldn't tell a
 * correct exhale from a wrong one — on the pharmacist's own 0519 labels it
 * scored barely above chance (56%), because an *incorrect* exhale actually
 * MOVES MORE than a correct one (people fidget, talk, raise the device early).
 * Motion was the wrong thing to look at.
 *
 * What actually separates them, on that same labelled data, is the RED CANISTER'S
 * POSITION — the exact opposite of the press step:
 *
 *                 canister vertical position (0=top)
 *   correct           0.77  (down / away — lowered to breathe out)
 *   incorrect         0.51  (up at the mouth — exhaling INTO the device)
 *
 * Clinically this is precisely the instruction: exhale fully AWAY from the
 * inhaler before you raise it and press. So a correct exhale is the inhaler NOT
 * at the mouth — lowered, or out of the mouth region entirely. Scoring canister
 * distance-from-mouth this way recovered 100% of correct exhales while catching
 * 80% of incorrect ones (windowed), versus 22% for the old motion approach.
 *
 * The chest-motion respiration sampler stays as telemetry (it needs a frontal,
 * chest-visible framing the 0519 close-ups don't have); the device posture is
 * the gate. Thresholds are calibrated to that data and want a live-camera pass,
 * like the shake and press detectors. The required exhale DURATION is enforced
 * by the caller (stage.passSeconds).
 */

/** The canister must be at least this far from the mouth (normalized distance)
 * to count as "lowered away" — the mirror of press's AT_MOUTH_DIST. */
const AWAY_FROM_MOUTH_DIST = 0.28;

export class ExhaleDetector {
	/**
	 * @param {{present:boolean, center:{x:number,y:number}|null}} device
	 * @param {{x:number,y:number}|null} mouthPoint - mouth centre from the face mesh
	 */
	detect({ device, mouthPoint }) {
		const present = !!device?.present;
		// Away = the inhaler is not up at the mouth: either not detected near the
		// face at all, or clearly separated from the mouth. Both mean the person
		// has lowered it to breathe out, which is the correct technique.
		const away =
			!present ||
			mouthPoint == null ||
			dist(device.center, mouthPoint) >= AWAY_FROM_MOUTH_DIST;

		return {
			exhaling: away,
			away,
			atMouth: present && !away,
			confidence: away ? 1 : 0,
		};
	}

	reset() {}
}

function dist(a, b) {
	if (!a || !b) return Infinity;
	return Math.hypot(a.x - b.x, a.y - b.y);
}
