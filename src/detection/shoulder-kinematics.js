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
	minConfidence: 0.5,
	elevationThreshold: 0.04,
	stabilityMaxStep: 0.04,
	exhaleHeadDistThreshold: 0.055,
	exhaleDropThreshold: 0.050,
	exhaleMaxHorizontalDrift: 0.045,
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
		if (ls.y > 0.85 || rs.y > 0.85) {
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
		if (ls.y < 0.15 || rs.y < 0.15) {
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
		if (ls.x < 0.05 || ls.x > 0.95 || rs.x < 0.05 || rs.x > 0.95) {
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
		if (rawSpan < 0.15) {
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
		if (rawSpan > 0.70) {
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

		// Head distance tracking (via nose if available)
		const nose = poseLandmarks[0];
		const noseConf = nose ? (nose.visibility ?? 1.0) : 0;
		const headDist =
			nose && noseConf >= 0.4
				? Math.abs(this.smoothedY - nose.y) / span
				: 1.0;

		// Maintain sliding window buffer (~3.5s)
		this.history.push({
			t: timestamp,
			y: this.smoothedY,
			x: this.smoothedX,
			span,
			headDist,
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
		let yDrop = 0;
		let xRange = 0;
		let yRange = 0;

		if (this.history.length >= 3) {
			const hDists = this.history.map((h) => h.headDist);
			const ys = this.history.map((h) => h.y);
			const xs = this.history.map((h) => h.x);

			headDistRange = Math.max(...hDists) - Math.min(...hDists);
			yRange = (Math.max(...ys) - Math.min(...ys)) / span;
			const minY = Math.min(...ys); // highest shoulder point in window
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

		// Still / Tidal breathing: low movement range and low head distance variance in recent 2s
		const recent = this.history.filter((h) => timestamp - h.t <= 2000);
		let isStill = false;
		if (recent.length >= 5) {
			const rYs = recent.map((h) => h.y);
			const rHds = recent.map((h) => h.headDist);
			const rYRange = (Math.max(...rYs) - Math.min(...rYs)) / span;
			const rHdRange = Math.max(...rHds) - Math.min(...rHds);
			isStill = rYRange < 0.035 && rHdRange < 0.045;
		}

		// Exhale active: positive respiratory excursion (head-shoulder delta OR shoulder drop),
		// relaxed shoulders (not elevated / shrugging), low horizontal drift, and actively NOT still
		const exhaleActive =
			!isElevated &&
			!isStill &&
			xRange <= this.cfg.exhaleMaxHorizontalDrift &&
			(headDistRange >= this.cfg.exhaleHeadDistThreshold ||
				yDrop >= this.cfg.exhaleDropThreshold);

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
