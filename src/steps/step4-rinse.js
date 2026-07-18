/**
 * Rinse detection, by sustained motion in the mouth region.
 *
 * The previous version scored a static POSTURE — hand-to-face distance, head
 * tilt, elbow angle — which anyone just holding a cup near their face passes
 * without rinsing at all. Rinsing is not a pose; it is an action: swishing water
 * moves the cheeks and jaw vigorously. So, like shaking, it is a MOTION signal,
 * measured against the same frame's background for scale-invariance.
 *
 * Validated on the pharmacist's own Teachable Machine labels (the 0519 dataset):
 * a correct rinse showed ~2.8× the mouth-region pixel motion of an incorrect one
 * (2.81 vs 1.01), across her hand-labelled correct/incorrect sequences. Motion
 * amplitude — not posture — is what separated them.
 *
 * The threshold is in the same hand/background ratio units as the shake detector
 * and, like it, wants a live-camera pass to pin down; what the data supports is
 * the shape — sustained mouth-region motion above a scale-free floor. The
 * required DURATION is enforced by the caller (stage.passSeconds).
 */

/** Mouth-region motion must stand this far above the background to count as
 * rinsing. Same dimensionless ratio as the shake detector; runtime-calibrate. */
const RINSE_RATIO = 8;

/** Smooth over a short window so a single jittery frame doesn't decide it. */
const WINDOW_MS = 1000;
const MIN_SAMPLES = 2;

export class RinseDetector {
	constructor() {
		this.samples = [];
	}

	/**
	 * @param {number} mouthRatio - mouth-region motion ÷ background (from MotionEnergy)
	 * @param {number} timestamp
	 */
	update(mouthRatio, timestamp) {
		this.samples.push({ r: mouthRatio, t: timestamp });
		this.samples = this.samples.filter((s) => s.t > timestamp - WINDOW_MS);
	}

	detect() {
		if (this.samples.length < MIN_SAMPLES) {
			return { rinsing: false, ratio: 0, confidence: 0 };
		}
		const ratio = median(this.samples.map((s) => s.r));
		return {
			rinsing: ratio >= RINSE_RATIO,
			ratio,
			// 0..1 for the status display: how far past the threshold it is.
			confidence: Math.max(0, Math.min(1, ratio / RINSE_RATIO)),
		};
	}

	reset() {
		this.samples = [];
	}
}

function median(values) {
	const v = [...values].sort((a, b) => a - b);
	const mid = Math.floor(v.length / 2);
	return v.length % 2 ? v[mid] : (v[mid - 1] + v[mid]) / 2;
}

/**
 * Mouth+cheek bounding box from face-mesh landmarks, padded, normalized.
 * Uses the lip and mouth-corner points and pads out to the cheeks — where the
 * swish actually shows. Returns null without landmarks.
 */
export function mouthROI(faceLandmarks, pad = 0.9) {
	if (!faceLandmarks || faceLandmarks.length < 468) return null;
	// upper/lower lip and the two mouth corners
	const idx = [13, 14, 61, 291];
	const pts = idx.map((i) => faceLandmarks[i]).filter(Boolean);
	if (pts.length < 3) return null;

	const xs = pts.map((p) => p.x);
	const ys = pts.map((p) => p.y);
	const minX = Math.min(...xs);
	const maxX = Math.max(...xs);
	const minY = Math.min(...ys);
	const maxY = Math.max(...ys);
	const w = maxX - minX || 0.05;
	const h = maxY - minY || 0.03;

	return {
		x: Math.max(0, minX - w * pad),
		y: Math.max(0, minY - h * pad),
		w: Math.min(1, w * (1 + 2 * pad)),
		h: Math.min(1, h * (1 + 2 * pad)),
	};
}
