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
 * inhaler before you raise it and press. So a correct exhale is the inhaler
 * visibly lowered away from the mouth. A missing face/device is kept as
 * uncertainty rather than treated as proof of a correct exhale. Scoring
 * distance-from-mouth recovered 100% of correct exhales while catching 80% of
 * incorrect ones (windowed), versus 22% for the old motion approach.
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
		// Missing inputs are uncertainty, never evidence of a correct exhale.  The
		// previous implementation treated a lost face or missed inhaler as a perfect
		// pass, so covering the camera could complete the step.
		if (!mouthPoint || !present || !device.center) {
			return {
				exhaling: false,
				away: false,
				atMouth: false,
				ready: false,
				confidence: 0,
			};
		}
		// Away = the inhaler is not up at the mouth: either not detected near the
		// face or clearly separated from the mouth.  The device must remain visible
		// so the app can distinguish a correct posture from a failed detector.
		const away = dist(device.center, mouthPoint) >= AWAY_FROM_MOUTH_DIST;

		return {
			exhaling: away,
			away,
			atMouth: present && !away,
			ready: true,
			confidence: away ? 1 : 0,
		};
	}

	reset() {}
}

function dist(a, b) {
	if (!a || !b) return Infinity;
	return Math.hypot(a.x - b.x, a.y - b.y);
}
