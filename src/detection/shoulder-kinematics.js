/**
 * Shoulder kinematics tracker for inhalation elevation, breath-holding stability,
 * and deep exhalation dynamics.
 *
 * Calibrated on 1150806 clinical pharmacist dataset (954 frames across 5 pharmacists):
 * - Normalised by shoulder span: D_span = hypot(X_left - X_right, Y_left - Y_right)
 *   to ensure invariance to body size, chair distance, and camera FOV.
 * - Empirical measurements from 1150806:
 *   - Quiet tidal breathing / still: head-shoulder range <= 0.038 spans, shoulder Y range <= 0.040 spans.
 *   - Deep exhalation: head-shoulder relative excursion >= 0.060 spans OR shoulder drop >= 0.045 spans.
 *   - Inhalation upward elevation: +0.10 ~ +0.30 spans.
 */

export const SHOULDER_THRESHOLDS = {
	minConfidence: 0.4,
	elevationThreshold: 0.04,
	stabilityMaxStep: 0.04,
	exhaleHeadDistThreshold: 0.040,
	exhaleDropThreshold: 0.040,
	exhaleHeadTurnThreshold: 0.045,
	exhaleProminentDropThreshold: 0.065,
	exhaleMaxHorizontalDrift: 0.18,
	historyWindowMs: 3500,
	baselineAlpha: 0.20,
	smoothAlpha: 0.35,
};

export class ShoulderKinematicsTracker {
	constructor(thresholds = {}) {
		this.cfg = { ...SHOULDER_THRESHOLDS, ...thresholds };
		this.reset();
	}

	reset() {
		this.baselineY = null;
		this.smoothedY = null;
		this.smoothedX = null;
		this.prevY = null;
		this.smoothedSpan = null;
		this.peakElevatedY = null;
		this.baselineLocked = false;
		this.lastTimestamp = 0;
		this.history = [];
	}

	/**
	 * Locks the current shoulder position as the baseline for the upcoming inhale.
	 * Call when inhaler reaches the mouth.
	 */
	lockBaseline() {
		if (this.smoothedY !== null) {
			this.baselineY = this.smoothedY;
			this.peakElevatedY = this.smoothedY;
			this.baselineLocked = true;
		}
	}

	unlockBaseline() {
		this.baselineLocked = false;
	}

	/**
	 * Process pose landmarks for current frame.
	 * @param {Array<{x:number, y:number, visibility?:number}>|null} poseLandmarks
	 * @param {number} timestamp
	 * @returns {{
	 *   valid: boolean,
	 *   framed: boolean,
	 *   framingMsg: string,
	 *   elevation: number,
	 *   isElevated: boolean,
	 *   isStable: boolean,
	 *   isDropping: boolean,
	 *   isStill: boolean,
	 *   exhaleActive: boolean,
	 *   shoulderY: number|null,
	 *   shoulderSpan: number|null,
	 *   confidence: number
	 * }}
	 */
	update(poseLandmarks, timestamp = 0) {
		if (!poseLandmarks || poseLandmarks.length < 13) {
			return {
				valid: false,
				framed: false,
				framingMsg: "未偵測到人體姿態，請面向鏡頭",
				elevation: 0,
				isElevated: false,
				isStable: false,
				isDropping: false,
				isStill: true,
				exhaleActive: false,
				shoulderY: this.smoothedY,
				shoulderSpan: this.smoothedSpan,
				confidence: 0,
			};
		}

		const ls = poseLandmarks[11];
		const rs = poseLandmarks[12];
		if (!ls || !rs) {
			return {
				valid: false,
				framed: false,
				framingMsg: "未完整偵測到雙肩，請面向鏡頭",
				elevation: 0,
				isElevated: false,
				isStable: false,
				isDropping: false,
				isStill: true,
				exhaleActive: false,
				shoulderY: this.smoothedY,
				shoulderSpan: this.smoothedSpan,
				confidence: 0,
			};
		}

		const conf = Math.min(ls.visibility ?? 1.0, rs.visibility ?? 1.0);
		if (conf < this.cfg.minConfidence) {
			return {
				valid: false,
				framed: false,
				framingMsg: "雙肩模糊或光線不足，請調整位置",
				elevation: 0,
				isElevated: false,
				isStable: false,
				isDropping: false,
				isStill: true,
				exhaleActive: false,
				shoulderY: this.smoothedY,
				shoulderSpan: this.smoothedSpan,
				confidence: conf,
			};
		}

		// Boundary & framing checks:
		// 1. Vertical boundary: shoulders must not be cut off at the bottom or top of the camera
		if (ls.y > 0.88 || rs.y > 0.88) {
			return {
				valid: true,
				framed: false,
				framingMsg: "距離鏡頭太近，請後退讓雙肩完整入鏡",
				elevation: 0,
				isElevated: false,
				isStable: false,
				isDropping: false,
				isStill: true,
				exhaleActive: false,
				shoulderY: (ls.y + rs.y) / 2.0,
				shoulderSpan: Math.hypot(ls.x - rs.x, ls.y - rs.y),
				confidence: conf,
			};
		}
		if (ls.y < 0.05 || rs.y < 0.05) {
			return {
				valid: true,
				framed: false,
				framingMsg: "位置太高，請調整鏡頭角度讓雙肩完整入鏡",
				elevation: 0,
				isElevated: false,
				isStable: false,
				isDropping: false,
				isStill: true,
				exhaleActive: false,
				shoulderY: (ls.y + rs.y) / 2.0,
				shoulderSpan: Math.hypot(ls.x - rs.x, ls.y - rs.y),
				confidence: conf,
			};
		}
		// 2. Horizontal boundary
		if (ls.x < 0.02 || ls.x > 0.98 || rs.x < 0.02 || rs.x > 0.98) {
			return {
				valid: true,
				framed: false,
				framingMsg: "肩膀超出畫面邊緣，請居中入座",
				elevation: 0,
				isElevated: false,
				isStable: false,
				isDropping: false,
				isStill: true,
				exhaleActive: false,
				shoulderY: (ls.y + rs.y) / 2.0,
				shoulderSpan: Math.hypot(ls.x - rs.x, ls.y - rs.y),
				confidence: conf,
			};
		}

		const rawY = (ls.y + rs.y) / 2.0;
		const rawX = (ls.x + rs.x) / 2.0;
		const rawSpan = Math.hypot(ls.x - rs.x, ls.y - rs.y);

		// Span boundary check:
		if (rawSpan < 0.10) {
			return {
				valid: true,
				framed: false,
				framingMsg: "距離太遠，請稍微靠近鏡頭",
				elevation: 0,
				isElevated: false,
				isStable: false,
				isDropping: false,
				isStill: true,
				exhaleActive: false,
				shoulderY: rawY,
				shoulderSpan: rawSpan,
				confidence: conf,
			};
		}
		if (rawSpan > 0.82) {
			return {
				valid: true,
				framed: false,
				framingMsg: "距離太近，請稍微退後",
				elevation: 0,
				isElevated: false,
				isStable: false,
				isDropping: false,
				isStill: true,
				exhaleActive: false,
				shoulderY: rawY,
				shoulderSpan: rawSpan,
				confidence: conf,
			};
		}

		// Span smoothing
		this.smoothedSpan =
			this.smoothedSpan === null
				? rawSpan
				: this.smoothedSpan * 0.9 + rawSpan * 0.1;

		const span = Math.max(this.smoothedSpan, 0.05);

		// Height & Horizontal smoothing
		const lastSmooth = this.smoothedY;
		this.smoothedY =
			lastSmooth === null
				? rawY
				: lastSmooth * (1 - this.cfg.smoothAlpha) + rawY * this.cfg.smoothAlpha;

		const lastSmoothX = this.smoothedX;
		this.smoothedX =
			lastSmoothX === null
				? rawX
				: lastSmoothX * (1 - this.cfg.smoothAlpha) + rawX * this.cfg.smoothAlpha;

		const stepDiff =
			lastSmooth === null ? 0 : Math.abs(this.smoothedY - lastSmooth) / span;

		// Head tracking: supports both facing front (頭正) and turning/tilting sideways (頭偏)
		// Landmark 0: nose, 7: left ear, 8: right ear
		const nose = poseLandmarks[0];
		const noseConf = nose ? (nose.visibility ?? 1.0) : 0;
		const leftEar = poseLandmarks[7];
		const rightEar = poseLandmarks[8];
		let headX = null;
		let headY = null;

		if (nose && noseConf >= 0.35) {
			headX = nose.x;
			headY = nose.y;
		} else if (
			leftEar &&
			rightEar &&
			(leftEar.visibility ?? 1) >= 0.3 &&
			(rightEar.visibility ?? 1) >= 0.3
		) {
			headX = (leftEar.x + rightEar.x) / 2;
			headY = (leftEar.y + rightEar.y) / 2;
		} else if (leftEar && (leftEar.visibility ?? 1) >= 0.3) {
			headX = leftEar.x;
			headY = leftEar.y;
		} else if (rightEar && (rightEar.visibility ?? 1) >= 0.3) {
			headX = rightEar.x;
			headY = rightEar.y;
		}

		// 2D Euclidean distance capturing both vertical neck expansion/drop (頭正) and horizontal turn (頭偏)
		const headDist =
			headX !== null && headY !== null
				? Math.hypot(this.smoothedX - headX, this.smoothedY - headY) / span
				: 1.0;
		// Head horizontal offset relative to shoulder center (captures lateral head rotation)
		const headTurn =
			headX !== null ? Math.abs(this.smoothedX - headX) / span : 0;

		// Maintain sliding window buffer (~3.5s)
		this.history.push({
			t: timestamp,
			y: this.smoothedY,
			x: this.smoothedX,
			span,
			headDist,
			headTurn,
		});

		// Prune older than historyWindowMs, retaining at least 3 frames
		while (
			this.history.length > 3 &&
			timestamp - this.history[0].t > this.cfg.historyWindowMs
		) {
			this.history.shift();
		}

		// Calculate windowed excursion metrics
		let headDistRange = 0;
		let headTurnRange = 0;
		let yDrop = 0;
		let xRange = 0;
		let yRange = 0;
		let minY = this.smoothedY;

		if (this.history.length >= 3) {
			const hDists = this.history.map((h) => h.headDist);
			const turns = this.history.map((h) => h.headTurn);
			const ys = this.history.map((h) => h.y);
			const xs = this.history.map((h) => h.x);

			headDistRange = Math.max(...hDists) - Math.min(...hDists);
			headTurnRange = Math.max(...turns) - Math.min(...turns);
			yRange = (Math.max(...ys) - Math.min(...ys)) / span;
			minY = Math.min(...ys); // highest shoulder point in window
			yDrop = (this.smoothedY - minY) / span;
			xRange = (Math.max(...xs) - Math.min(...xs)) / span;
		}

		// Baseline tracking
		if (!this.baselineLocked || this.baselineY === null) {
			this.baselineY =
				this.baselineY === null
					? this.smoothedY
					: this.baselineY * (1 - this.cfg.baselineAlpha) +
						this.smoothedY * this.cfg.baselineAlpha;
			this.peakElevatedY = this.smoothedY;
		}

		// In screen coordinates, y decreases as shoulders rise
		const elevation = (this.baselineY - this.smoothedY) / span;

		if (this.peakElevatedY === null || this.smoothedY < this.peakElevatedY) {
			this.peakElevatedY = this.smoothedY;
		}

		// Drop from the highest point achieved during this breath hold
		const dropFromPeak = (this.smoothedY - this.peakElevatedY) / span;

		const isElevated = elevation >= this.cfg.elevationThreshold;
		const isStable = stepDiff <= this.cfg.stabilityMaxStep;
		const isDropping = dropFromPeak >= this.cfg.exhaleDropThreshold;

		// Physiological exhalation dynamics supporting both 頭正 (Head Straight) and 頭偏 (Head Turned/Tilted):
		// 1. 頭偏 (Head Turned / Tilted Exhale):
		//    User turns head to the side to exhale away from inhaler (clinical guideline).
		//    Distinct lateral head rotation excursion accompanied by shoulder relaxation:
		const isHeadTurnExhale =
			headTurnRange >= (this.cfg.exhaleHeadTurnThreshold || 0.045) &&
			yDrop >= 0.020;

		// 2. 頭正 (Head Straight Exhale):
		//    User faces camera, relaxes chest and drops shoulders.
		//    2D head distance excursion and shoulder relaxation drop:
		const isHeadStraightExhale =
			yDrop >= this.cfg.exhaleDropThreshold &&
			headDistRange >= this.cfg.exhaleHeadDistThreshold;

		// 3. 顯著深吐氣 (Prominent Exhale):
		const isProminentDrop =
			yDrop >= (this.cfg.exhaleProminentDropThreshold || 0.065) ||
			headDistRange >= (this.cfg.exhaleProminentDropThreshold || 0.065) + 0.005;

		const hasExhaledDrop =
			isHeadTurnExhale || isHeadStraightExhale || isProminentDrop;

		// Sustained lowered posture: user maintains empty lungs with lowered relaxed shoulders.
		// Shoulders must remain below the window's highest position by at least 0.020 spans
		// (not bouncing back up or inhaling).
		const isMaintainingDrop = (this.smoothedY - minY) / span >= 0.020;

		// Motionless baseline: user is motionless at resting baseline with NO exhalation drop or head turn.
		const isStill =
			yDrop < 0.025 && headDistRange < 0.030 && headTurnRange < 0.035;

		// Exhale active: has dropped, is maintaining lowered relaxed shoulders,
		// not elevated/shrugging, and not swaying horizontally.
		const exhaleActive =
			!isElevated &&
			hasExhaledDrop &&
			isMaintainingDrop &&
			xRange <= this.cfg.exhaleMaxHorizontalDrift;

		this.prevY = this.smoothedY;
		this.lastTimestamp = timestamp;

		return {
			valid: true,
			framed: true,
			framingMsg: "",
			elevation,
			isElevated,
			isStable,
			isDropping,
			isStill,
			exhaleActive,
			shoulderY: this.smoothedY,
			shoulderSpan: span,
			confidence: conf,
		};
	}
}
