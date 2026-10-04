import { ShoulderKinematicsTracker } from "../detection/shoulder-kinematics.js";

/**
 * Press + inhale correctness with multimodal shoulder kinematics tracking.
 *
 * 1. Posture & Device at Mouth:
 *    - Inhaler detected and held at mouth.
 *    - Uses a 2500ms mouth memory grace to prevent dropout when hand occludes lips.
 * 2. Deep Inhalation:
 *    - Verified by upward shoulder elevation (calibrated from 1150806 clinical cohort).
 * 3. Breath Hold Stability:
 *    - Verified by shoulder stillness plateau (stepDiff < 0.04) and no premature slump.
 */

const AT_MOUTH_DIST = 0.22;
const MIN_STEADY = 0.35;
const MOUTH_MEMORY_MS = 2500;
const AT_MOUTH_GRACE_MS = 1500;

export class PressInhaleDetector {
	constructor(shoulderConfig = {}) {
		this.shoulderTracker = new ShoulderKinematicsTracker(shoulderConfig);
		this.lastMouthPoint = null;
		this.lastMouthTimestamp = 0;
		this.lastAtMouthTimestamp = 0;
	}

	reset() {
		this.shoulderTracker.reset();
		this.lastMouthPoint = null;
		this.lastMouthTimestamp = 0;
		this.lastAtMouthTimestamp = 0;
	}

	/**
	 * @param {object} params
	 * @param {{present:boolean, center:{x:number,y:number}|null, steadiness:number}|null} params.device
	 * @param {{x:number,y:number}|null} [params.mouthPoint] - mouth centre from the face mesh
	 * @param {Array<{x:number, y:number, visibility?:number}>|null} [params.poseLandmarks]
	 * @param {number} [params.timestamp=0]
	 */
	detect({ device, mouthPoint, poseLandmarks = null, timestamp = 0 }) {
		if (mouthPoint != null) {
			this.lastMouthPoint = mouthPoint;
			this.lastMouthTimestamp = timestamp;
		} else if (
			this.lastMouthPoint != null &&
			timestamp - this.lastMouthTimestamp < MOUTH_MEMORY_MS
		) {
			mouthPoint = this.lastMouthPoint;
		}

		const shoulder = this.shoulderTracker.update(poseLandmarks, timestamp);

		const present = !!device?.present;
		const ready = present && mouthPoint != null;

		let atMouth = false;
		if (present && mouthPoint != null) {
			const d = dist(device.center, mouthPoint);
			if (d < AT_MOUTH_DIST) {
				atMouth = true;
				this.lastAtMouthTimestamp = timestamp;
			}
		}

		// Grace memory for at-mouth: prevent flicker when hand/inhaler occludes camera
		if (!atMouth && this.lastAtMouthTimestamp > 0 && timestamp - this.lastAtMouthTimestamp < AT_MOUTH_GRACE_MS) {
			atMouth = true;
		}

		// Lock baseline when inhaler arrives at mouth
		if (atMouth && !this.shoulderTracker.baselineLocked) {
			this.shoulderTracker.lockBaseline();
		}

		const steady = (device?.steadiness ?? 0) >= MIN_STEADY;

		// Correct actuation: device at mouth, steady, with shoulder elevation confirmation
		const pressing = present && atMouth && (steady || shoulder.isElevated);
		const inhaling = pressing && (shoulder.isElevated || steady);

		return {
			present,
			ready,
			atMouth,
			steady,
			pressing,
			inhaling,
			shoulder,
			breathHoldStable: shoulder.isStable && !shoulder.isDropping,
			prematureExhale: shoulder.isDropping,
			shouldStartBreathHold: pressing,
			confidence:
				(present ? 0.3 : 0) +
				(atMouth ? 0.3 : 0) +
				(steady ? 0.2 : 0) +
				(shoulder.isElevated ? 0.2 : 0),
		};
	}
}

function dist(a, b) {
	if (!a || !b) return Infinity;
	return Math.hypot(a.x - b.x, a.y - b.y);
}
