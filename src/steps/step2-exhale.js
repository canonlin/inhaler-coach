/**
 * Stage 2 is posture acquisition followed by truthful timed coaching.
 *
 * A webcam cannot reliably prove a slow exhale or lung emptying. It can verify
 * the clinically important visible constraint: the inhaler is away from the
 * mouth before the user breathes out. Face and inhaler are therefore acquired,
 * one clearly-away observation locks the posture, and the caller then runs the
 * configured exhale timer without requiring ONNX to remain visible. This avoids
 * both false physiological claims and detector-flicker resets.
 */

/** The canister must be at least this far from the mouth (normalized distance)
 * to count as "lowered away" — the mirror of press's AT_MOUTH_DIST. */
const AWAY_FROM_MOUTH_DIST = 0.28;
const HAND_AWAY_FROM_MOUTH_DIST = 0.32;
const FACE_MEMORY_MS = 3000;

export class ExhaleDetector {
	constructor() {
		this.reset();
	}

	/**
	 * @param {{present:boolean, center:{x:number,y:number}|null}} device
	 * @param {{x:number,y:number}|null} mouthPoint - mouth centre from the face mesh
	 */
	detect({ device, mouthPoint, handPoint = null, timestamp = 0 }) {
		if (mouthPoint) {
			this.faceAcquired = true;
			this.lastMouthPoint = { ...mouthPoint };
			this.lastMouthAt = timestamp;
		}

		const present = !!device?.present;
		let awayObservedNow = false;
		let awayEvidence = null;
		let atMouth = false;
		const mouthIsRecent =
			this.lastMouthPoint && timestamp - this.lastMouthAt <= FACE_MEMORY_MS;
		if (present && device.center) {
			this.targetAcquired = true;
			if (mouthIsRecent) {
				awayObservedNow =
					dist(device.center, this.lastMouthPoint) >= AWAY_FROM_MOUTH_DIST;
				atMouth = !awayObservedNow;
				if (awayObservedNow) awayEvidence = "device";
			}
		}
		// Once the inhaler has been acquired, the holding hand may remain visible
		// after the canister is lowered out of frame or blurred. Its separation from
		// the remembered mouth position is valid visible evidence of moving away.
		if (
			!awayObservedNow &&
			this.targetAcquired &&
			mouthIsRecent &&
			handPoint &&
			dist(handPoint, this.lastMouthPoint) >= HAND_AWAY_FROM_MOUTH_DIST
		) {
			awayObservedNow = true;
			awayEvidence = "hand";
		}
		if (awayObservedNow) this.awayLocked = true;

		return {
			// Compatibility name: this starts the timed coaching gate. It does not
			// claim that pulmonary airflow itself was sensed.
			exhaling: this.awayLocked,
			away: this.awayLocked,
			awayLocked: this.awayLocked,
			awayObservedNow,
			awayEvidence,
			atMouth,
			faceAcquired: this.faceAcquired,
			targetAcquired: this.targetAcquired,
			ready: this.faceAcquired && this.targetAcquired,
			phase: !this.faceAcquired
				? "acquire-face"
				: !this.targetAcquired
					? "acquire-inhaler"
					: !this.awayLocked
						? "move-away"
						: "guided-exhale",
			confidence: this.awayLocked ? 1 : 0,
		};
	}

	reset() {
		this.faceAcquired = false;
		this.targetAcquired = false;
		this.awayLocked = false;
		this.lastMouthPoint = null;
		this.lastMouthAt = Number.NEGATIVE_INFINITY;
	}
}

function dist(a, b) {
	if (!a || !b) return Infinity;
	return Math.hypot(a.x - b.x, a.y - b.y);
}
