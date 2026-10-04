/**
 * Shoulder kinematics tracker for inhalation elevation and breath-holding stability.
 *
 * Calibrated on 1150806 clinical pharmacist dataset (954 frames across 5 pharmacists):
 * - Normalised by shoulder span: D_span = hypot(X_left - X_right, Y_left - Y_right)
 *   to ensure invariance to body size, chair distance, and camera FOV.
 * - Empirical measurements from 1150806:
 *   - Breath hold / still: step delta p95 = 0.0211, max = 0.0412.
 *   - Deep inhalation: shoulder elevation = +0.10 ~ +0.30 spans.
 *   - Exhalation / slump: downward shift > 0.06 spans.
 */

export const SHOULDER_THRESHOLDS = {
	minConfidence: 0.4,
	elevationThreshold: 0.04,
	stabilityMaxStep: 0.04,
	exhaleDropThreshold: 0.06,
	baselineAlpha: 0.08,
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
		this.prevY = null;
		this.smoothedSpan = null;
		this.peakElevatedY = null;
		this.baselineLocked = false;
		this.lastTimestamp = 0;
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
	 *   elevation: number,
	 *   isElevated: boolean,
	 *   isStable: boolean,
	 *   isDropping: boolean,
	 *   shoulderY: number|null,
	 *   shoulderSpan: number|null,
	 *   confidence: number
	 * }}
	 */
	update(poseLandmarks, timestamp = 0) {
		if (!poseLandmarks || poseLandmarks.length < 13) {
			return {
				valid: false,
				elevation: 0,
				isElevated: false,
				isStable: false,
				isDropping: false,
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
				elevation: 0,
				isElevated: false,
				isStable: false,
				isDropping: false,
				shoulderY: this.smoothedY,
				shoulderSpan: this.smoothedSpan,
				confidence: 0,
			};
		}

		const conf = Math.min(ls.visibility ?? 1.0, rs.visibility ?? 1.0);
		if (conf < this.cfg.minConfidence) {
			return {
				valid: false,
				elevation: 0,
				isElevated: false,
				isStable: false,
				isDropping: false,
				shoulderY: this.smoothedY,
				shoulderSpan: this.smoothedSpan,
				confidence: conf,
			};
		}

		const rawY = (ls.y + rs.y) / 2.0;
		const rawSpan = Math.hypot(ls.x - rs.x, ls.y - rs.y);

		// Span smoothing
		this.smoothedSpan =
			this.smoothedSpan === null
				? rawSpan
				: this.smoothedSpan * 0.9 + rawSpan * 0.1;

		const span = Math.max(this.smoothedSpan, 0.05);

		// Height smoothing
		const lastSmooth = this.smoothedY;
		this.smoothedY =
			lastSmooth === null
				? rawY
				: lastSmooth * (1 - this.cfg.smoothAlpha) + rawY * this.cfg.smoothAlpha;

		const stepDiff =
			lastSmooth === null ? 0 : Math.abs(this.smoothedY - lastSmooth) / span;

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

		this.prevY = this.smoothedY;
		this.lastTimestamp = timestamp;

		return {
			valid: true,
			elevation,
			isElevated,
			isStable,
			isDropping,
			shoulderY: this.smoothedY,
			shoulderSpan: span,
			confidence: conf,
		};
	}
}
