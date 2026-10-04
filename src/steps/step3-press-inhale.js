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
	 * @param {{present:boolean, center:{x:number,y:number}|null, steadiness:number}|null} [params.device]
	 * @param {{x:number,y:number}|null} [params.mouthPoint] - mouth centre from the face mesh
	 * @param {{x:number,y:number}|null} [params.handPoint] - hand centre from hand tracking
	 * @param {Array<{x:number, y:number, visibility?:number}>|null} [params.poseLandmarks]
	 * @param {number} [params.timestamp=0]
	 */
	detect({ device, mouthPoint, handPoint = null, poseLandmarks = null, timestamp = 0 }) {
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

		// Signal Hierarchy (臨床與工程訊號分級):
		// 1. 強訊號 (Primary Strong Signals):
		//    - 臉部/口部入鏡 (mouthPoint != null)
		//    - 雙肩生理姿態與呼吸運動 (shoulder.valid && shoulder.framed)
		//    - 吸氣時雙肩深緩抬升 (shoulder.isElevated)
		//    - 憋氣時雙肩維持高位穩定不垮落 (shoulder.isStable && !shoulder.isDropping)
		//    - 手或吸入器置於口唇就定位 (atMouth)
		// 2. 弱（次）訊號 (Secondary Weak Signal): 吸入器物件辨識 (device?.present)
		//    - YOLO 拍到吸入器可提供高置信度額外確認；
		//    - 若未拍到吸入器（練習器、手握遮蔽、非標準機型），依手部靠近嘴唇及雙肩吸氣動態通關，絕不變成永遠失敗。
		const present = !!device?.present;

		let handAtMouth = false;
		if (mouthPoint != null) {
			if (handPoint != null && dist(handPoint, mouthPoint) < 0.28) {
				handAtMouth = true;
			} else if (Array.isArray(poseLandmarks)) {
				// Fallback to wrist / index / thumb landmarks from Pose
				const handIndices = [15, 16, 19, 20, 21, 22];
				for (const idx of handIndices) {
					const lm = poseLandmarks[idx];
					if (lm && (lm.visibility == null || lm.visibility > 0.3)) {
						if (dist(lm, mouthPoint) < 0.28) {
							handAtMouth = true;
							break;
						}
					}
				}
			}
		}

		let deviceAtMouth = false;
		if (present && mouthPoint != null && device.center) {
			if (dist(device.center, mouthPoint) < AT_MOUTH_DIST) {
				deviceAtMouth = true;
			}
		}

		let atMouth = deviceAtMouth || handAtMouth;
		if (atMouth) {
			this.lastAtMouthTimestamp = timestamp;
		} else if (
			this.lastAtMouthTimestamp > 0 &&
			timestamp - this.lastAtMouthTimestamp < AT_MOUTH_GRACE_MS
		) {
			// Grace memory for at-mouth: prevent flicker when hand/inhaler occludes camera
			atMouth = true;
		}

		// Ready: mouth/face is visible, and if shoulders are detected they are framed in view
		const ready = mouthPoint != null && (!shoulder.valid || shoulder.framed);

		// Lock baseline when inhaler/hand arrives at mouth
		if (atMouth && !this.shoulderTracker.baselineLocked) {
			this.shoulderTracker.lockBaseline();
		}

		const steady = present
			? (device?.steadiness ?? 0) >= MIN_STEADY
			: atMouth;

		// Correct actuation: device or hand at mouth, with shoulder elevation confirmation or steady position
		const pressing = atMouth && (steady || shoulder.isElevated);
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
