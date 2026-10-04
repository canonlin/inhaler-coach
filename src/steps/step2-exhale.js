import { ShoulderKinematicsTracker } from "../detection/shoulder-kinematics.js";

/**
 * Stage 2: Exhalation guidance with shoulder kinematics monitoring.
 *
 * Clinical rationale:
 * The user exhales slowly and completely to empty the lungs before inhaling the drug.
 * An inhaler is NOT required in this step (the user may set it down, hold it at their
 * side, or rest their hands). Requiring an inhaler causes severe false negatives.
 *
 * Physical & physiological kinematics:
 * - During relaxed exhalation, the chest and respiratory muscles relax; shoulders
 *   remain stable or gently lower without elevation.
 * - Paradoxical shrugging (shoulder elevation >= 0.04 spans) indicates inhalation or
 *   tension, which is flagged to guide the user to relax.
 * - MediaPipe Pose landmarks 11 & 12 (left & right shoulders) provide body tracking.
 * - If an inhaler happens to be detected right at the mouth (< 0.28 dist), the user
 *   is warned not to exhale into the mouthpiece.
 */

const AT_MOUTH_DIST = 0.28;
const FACE_MEMORY_MS = 3000;

export class ExhaleDetector {
	/**
	 * @param {Object} [options]
	 * @param {Object} [options.shoulderConfig]
	 */
	constructor(options = {}) {
		this.shoulderTracker = new ShoulderKinematicsTracker(
			options.shoulderConfig,
		);
		this.reset();
	}

	/**
	 * @param {Object} params
	 * @param {Array<{x:number, y:number, visibility?:number}>|null} [params.poseLandmarks]
	 * @param {{x:number, y:number}|null} [params.mouthPoint]
	 * @param {{present:boolean, center:{x:number, y:number}|null}|null} [params.device]
	 * @param {number} [params.timestamp=0]
	 */
	detect({
		poseLandmarks = null,
		mouthPoint = null,
		device = null,
		handPoint = null,
		timestamp = 0,
	} = {}) {
		if (mouthPoint) {
			this.faceAcquired = true;
			this.lastMouthPoint = { ...mouthPoint };
			this.lastMouthAt = timestamp;
		}

		// Shoulder kinematics tracking
		const shoulder = this.shoulderTracker.update(poseLandmarks, timestamp);
		if (shoulder.valid) {
			this.poseAcquired = true;
		}

		const ready = this.poseAcquired || this.faceAcquired;

		// Optional check: is an inhaler accidentally placed directly in front of the mouth?
		let atMouth = false;
		const mouthIsRecent =
			this.lastMouthPoint && timestamp - this.lastMouthAt <= FACE_MEMORY_MS;
		if (device?.present && device.center && mouthIsRecent) {
			atMouth = dist(device.center, this.lastMouthPoint) < AT_MOUTH_DIST;
		}

		// In screen coords, shoulder elevation >= 0.04 spans indicates shrugging/inhalation
		const shrugging = shoulder.valid && shoulder.isElevated;

		// Exhaling is active when body/shoulders are ready, shoulders are relaxed (not shrugging),
		// and the inhaler is not placed right at the mouth.
		const isExhaling = ready && !shrugging && !atMouth;
		if (isExhaling) {
			this.awayLocked = true;
		}

		const phase = !ready
			? "acquire-posture"
			: atMouth
				? "remove-inhaler"
				: shrugging
					? "relax-shoulders"
					: "guided-exhale";

		return {
			ready,
			faceAcquired: this.faceAcquired,
			poseAcquired: this.poseAcquired,
			targetAcquired: ready, // backwards compatibility
			awayLocked: this.awayLocked,
			exhaling: isExhaling,
			shrugging,
			atMouth,
			shoulder,
			phase,
			confidence: ready ? (shoulder.valid ? shoulder.confidence : 0.8) : 0,
		};
	}

	reset() {
		this.shoulderTracker.reset();
		this.faceAcquired = false;
		this.poseAcquired = false;
		this.awayLocked = false;
		this.lastMouthPoint = null;
		this.lastMouthAt = Number.NEGATIVE_INFINITY;
	}
}

function dist(a, b) {
	if (!a || !b) return Infinity;
	return Math.hypot(a.x - b.x, a.y - b.y);
}
