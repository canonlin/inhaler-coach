import { ShoulderKinematicsTracker } from "../detection/shoulder-kinematics.js";
import { extractFaceFeatures } from "../detection/face-features.js";

/**
 * Stage 2: Exhalation (吐氣)
 *
 * Clinical objective:
 * - Patient must exhale fully away from the inhaler mouthpiece before inhalation.
 * - Monitored via Pose & Face Mesh landmarks:
 *   1. Must NOT shrug shoulders (indicates tension or premature inhalation).
 *   2. Must exhibit active respiratory excursion (head-shoulder distance change and shoulder relaxation drop)
 *      OR active pursed-lip breathing (縮唇吐氣吹氣).
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
	 * @param {Array}  [input.faceLandmarks]
	 * @param {number} [input.timestamp]
	 */
	detect({ device = null, mouthPoint = null, poseLandmarks = null, faceLandmarks = null, timestamp = 0 } = {}) {
		if (mouthPoint) {
			this.faceAcquired = true;
			this.lastMouthPoint = { ...mouthPoint };
			this.lastMouthAt = timestamp;
		}

		// Shoulder kinematics tracking (re-evaluated on every frame, never latched)
		const shoulder = this.shoulderTracker.update(poseLandmarks, timestamp);
		const ready = shoulder.valid && shoulder.framed;

		// Face Mesh: Pursed-lip breathing detection (縮唇呼氣)
		let mouthPursed = false;
		let faceFeatures = null;
		if (faceLandmarks) {
			this.faceAcquired = true;
			faceFeatures = extractFaceFeatures(faceLandmarks);
			mouthPursed = Boolean(faceFeatures?.pursedLips);
		}

		// Check: is an inhaler accidentally placed directly in front of the mouth?
		let atMouth = false;
		const mouthIsRecent =
			this.lastMouthPoint && timestamp - this.lastMouthAt <= FACE_MEMORY_MS;
		if (device?.present && device.center && mouthIsRecent) {
			atMouth = dist(device.center, this.lastMouthPoint) < AT_MOUTH_DIST;
		}

		// In screen coords, shoulder elevation >= 0.04 spans indicates shrugging/inhalation
		const shrugging = shoulder.valid && shoulder.isElevated;

		// Signal Hierarchy (臨床與工程訊號分級):
		// 1. 強訊號 (Primary Strong Signal): 雙肩生理姿態與縮唇呼吸運動
		//    - 雙肩完整入鏡未被邊界裁切 (ready: shoulder.valid && shoulder.framed)
		//    - 吐氣時雙肩自然放鬆下沉 (shoulder.exhaleActive) 或 縮唇呼氣 (mouthPursed)
		//    - 未聳肩緊繃 (shrugging = false)
		// 2. 弱（次）訊號 (Secondary Weak Signal): 手上有無拿吸入器
		//    - 不要求必須持拿吸入器 (deviceInHand 是次要狀態，不阻礙吐氣通關)
		//    - 負向防呆：僅在吸入器明確貼近嘴唇時提示移開，避免含著吸嘴吐氣
		const deviceInHand = Boolean(device?.present);
		const isExhaling = ready && !shrugging && !atMouth && (shoulder.exhaleActive || mouthPursed);

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
			mouthPursed,
			faceFeatures,
			deviceInHand,
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
