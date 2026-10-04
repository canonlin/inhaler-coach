import { ShoulderKinematicsTracker } from "../detection/shoulder-kinematics.js";

/**
 * Stage 2: Exhalation (吐氣)
 *
 * Clinical objective:
 * - Patient must exhale fully away from the inhaler mouthpiece before inhalation.
 * - Monitored via Pose landmarks (shoulders + head relative excursion):
 *   1. Must NOT shrug shoulders (indicates tension or premature inhalation).
 *   2. Must exhibit active respiratory excursion (head-shoulder distance change and shoulder relaxation drop)
 *      calibrated on 1150806 clinical pharmacist dataset.
 *   3. Inhaler must NOT be at the mouth during exhalation.
 *   4. Normal tidal breathing / sitting still must NOT pass without active exhalation.
 */

const FACE_MEMORY_MS = 600;
const AT_MOUTH_DIST = 0.28;

export class ExhaleDetector {
	constructor(options = {}) {
		this.shoulderTracker = new ShoulderKinematicsTracker(options.shoulder || {});
		this.faceAcquired = false;
		this.lastMouthPoint = null;
		this.lastMouthAt = Number.NEGATIVE_INFINITY;
	}

	/**
	 * Detect exhalation status for current frame.
	 * @param {Object} input
	 * @param {Object} [input.device]
	 * @param {Object} [input.mouthPoint]
	 * @param {Array}  [input.poseLandmarks]
	 * @param {number} [input.timestamp]
	 */
	detect({ device = null, mouthPoint = null, poseLandmarks = null, timestamp = 0 } = {}) {
		if (mouthPoint) {
			this.faceAcquired = true;
			this.lastMouthPoint = { ...mouthPoint };
			this.lastMouthAt = timestamp;
		}

		// Shoulder kinematics tracking (re-evaluated on every frame, never latched)
		const shoulder = this.shoulderTracker.update(poseLandmarks, timestamp);
		const ready = shoulder.valid && shoulder.framed;

		// Check: is an inhaler accidentally placed directly in front of the mouth?
		let atMouth = false;
		const mouthIsRecent =
			this.lastMouthPoint && timestamp - this.lastMouthAt <= FACE_MEMORY_MS;
		if (device?.present && device.center && mouthIsRecent) {
			atMouth = dist(device.center, this.lastMouthPoint) < AT_MOUTH_DIST;
		}

		// In screen coords, shoulder elevation >= 0.04 spans indicates shrugging/inhalation
		const shrugging = shoulder.valid && shoulder.isElevated;

		// Active exhalation requires:
		// 1. Posture/shoulders acquired and properly framed
		// 2. Not shrugging / tense
		// 3. Not holding inhaler at mouth
		// 4. Positive respiratory excursion (calibrated on 1150806 GT)
		const isExhaling = ready && !shrugging && !atMouth && shoulder.exhaleActive;

		const phase = !ready
			? "acquire-posture"
			: atMouth
				? "remove-inhaler"
				: shrugging
					? "relax-shoulders"
					: isExhaling
						? "guided-exhale"
						: "wait-for-exhale";

		return {
			ready,
			faceAcquired: this.faceAcquired,
			poseAcquired: shoulder.valid,
			targetAcquired: ready, // backwards compatibility
			awayLocked: isExhaling,
			framingMsg: shoulder.framingMsg,
			exhaling: isExhaling,
			shrugging,
			atMouth,
			shoulder,
			phase,
			confidence: ready ? shoulder.confidence : 0,
		};
	}

	reset() {
		this.shoulderTracker.reset();
		this.faceAcquired = false;
		this.lastMouthPoint = null;
		this.lastMouthAt = Number.NEGATIVE_INFINITY;
	}
}

function dist(a, b) {
	if (!a || !b) return Infinity;
	return Math.hypot(a.x - b.x, a.y - b.y);
}
