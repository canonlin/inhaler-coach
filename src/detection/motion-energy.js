/**
 * Motion energy in the hand region, measured against the background in the same
 * frame.
 *
 * Landmark-based shake detection failed outright: BlazePose's wrist landmark
 * carries no trace of the shake at all (measured 2026-07-15 — the spectrum while
 * shaking was indistinguishable from the spectrum while holding still). Shaking
 * an inhaler is a small, fast wrist motion, and a landmark the model smooths
 * temporally doesn't resolve it. Pixel differencing does: it doesn't care where
 * the hand is, only that the pixels there are changing.
 *
 * But raw pixel change is not comparable across sessions. Measured, same person,
 * same action:
 *
 *              still      shaking
 *   session 1    7.3        10.4
 *   session 2   13–15      25–35
 *
 * Session 2's *still* reading exceeds session 1's *shaking* reading — lighting
 * and camera distance shift the absolute scale by 3×. Any fixed threshold is
 * therefore wrong somewhere, and a threshold of 9 passed a motionless hand.
 *
 * The fix is a baseline taken in SPACE, not in time: the same frame's background
 * cells give the sensor's noise floor under exactly these conditions, right now.
 * A temporal baseline was the other candidate and it's unusable — it assumes the
 * patient holds still before they shake, and nobody does that. They pick up the
 * inhaler and shake it.
 *
 *   ratio = motion in the hand region / motion in the background
 *
 * Shaking drives the hand region far above the background. A still hand sits at
 * the background, because both are just sensor noise.
 */

/**
 * Resolution the frame is reduced to before differencing.
 *
 * This governs what size of motion survives. At 32, the whole 480×360 frame
 * collapses onto 32×32 cells, the hand occupies roughly 6×6 of them, and a small
 * wrist-only shake averages away inside a single cell: measured 2026-07-15, a
 * gentle wrist shake registered 2.1 against 2.2 for a motionless hand — the
 * motion was simply not in the signal. Only a vigorous whole-forearm shake
 * survived, so the detector worked for one style of shaking and silently failed
 * for the others.
 *
 * At 96 the hand spans ~20×20 cells and small motion has somewhere to live.
 */
const GRID = 96;
const EMPTY_MOTION = {
	hand: 0,
	background: 0,
	ratio: 0,
	flowX: 0,
	flowY: 0,
	observed: false,
};

export class MotionEnergy {
	constructor() {
		this.canvas = document.createElement("canvas");
		this.canvas.width = GRID;
		this.canvas.height = GRID;
		this.ctx = this.canvas.getContext("2d", { willReadFrequently: true });
		this.previous = null;
	}

	/**
	 * @param {HTMLCanvasElement} source - the webcam frame
	 * @param {{x:number,y:number,w:number,h:number}|null} roi - hand box, normalized
	 * @param {number} actionPercentile - percentile used inside the ROI
	 * @returns {{hand:number, background:number, ratio:number, flowX:number, flowY:number, observed:boolean}}
	 */
	sample(source, roi, actionPercentile = 0.9) {
		this.ctx.drawImage(source, 0, 0, GRID, GRID);
		const { data } = this.ctx.getImageData(0, 0, GRID, GRID);

		const gray = new Float32Array(GRID * GRID);
		for (let i = 0; i < gray.length; i++) {
			const p = i * 4;
			gray[i] = 0.299 * data[p] + 0.587 * data[p + 1] + 0.114 * data[p + 2];
		}

		if (!this.previous || this.previous.length !== gray.length) {
			this.previous = gray;
			return { ...EMPTY_MOTION, observed: roi !== null };
		}

		// When roi is null (no hand/inhaler detected), return ratio 0.
		// We cannot distinguish shaking from background noise without a ROI,
		// and whole-frame mode gives false positives.
		if (roi === null) {
			this.previous = gray;
			return { ...EMPTY_MOTION };
		}

		const flow = estimateGlobalFlow(this.previous, gray, roi);

		const handCells = [];
		const backgroundCells = [];

		for (let row = 0; row < GRID; row++) {
			for (let col = 0; col < GRID; col++) {
				const i = row * GRID + col;
				const diff = Math.abs(gray[i] - this.previous[i]);
				const inHand =
					col / GRID >= roi.x &&
					col / GRID <= roi.x + roi.w &&
					row / GRID >= roi.y &&
					row / GRID <= roi.y + roi.h;
				if (inHand) handCells.push(diff);
				else backgroundCells.push(diff);
			}
		}

		// The reference frame is updated on EVERY call, including the ones where
		// there is no hand to measure. It has to be: it holds the whole frame, not
		// the hand region, so it stays valid whether or not the hand model saw
		// anything. Discarding it whenever tracking blinked meant the next frame
		// had nothing to difference against and reported zero motion — and hand
		// tracking blinks most exactly when the hand is moving fastest. The harder
		// someone shook, the more of their shake was recorded as no motion at all.
		this.previous = gray;

		if (handCells.length === 0 || backgroundCells.length === 0) {
			return { ...EMPTY_MOTION };
		}

		// A high percentile, not the mean.
		//
		// The default 90th percentile preserves the calibrated collector/rinse
		// behaviour. Stage 1 explicitly requests 98th because its padded ROI keeps a
		// fast shake in frame, leaving moving canister edges in only 1–7% of cells;
		// direction, sample rate and reversals are gated separately there.
		handCells.sort((a, b) => a - b);
		const percentile = Math.max(0, Math.min(0.999, actionPercentile));
		const hand = handCells[Math.floor(handCells.length * percentile)];

		// Median, not mean: the patient's own face and body are in the background
		// too, and they move. The median ignores them and reports the noise floor.
		backgroundCells.sort((a, b) => a - b);
		const background = backgroundCells[Math.floor(backgroundCells.length / 2)];

		// Floor the denominator — a perfectly static background would otherwise
		// make any hand motion look infinite.
		const ratio = hand / Math.max(background, 0.5);

		return { hand, background, ratio, ...flow, observed: true };
	}

	reset() {
		this.previous = null;
	}
}

/**
 * Estimate one translational optical-flow vector inside the normalized ROI.
 * This is the two-axis Lucas–Kanade least-squares system already used by the
 * respiration sampler, applied to the hand/inhaler region. It is not a pass
 * condition by itself; the shake detector consumes its direction over time.
 */
function estimateGlobalFlow(previous, current, roi) {
	const row0 = Math.max(1, Math.floor(roi.y * GRID));
	const row1 = Math.min(GRID - 2, Math.ceil((roi.y + roi.h) * GRID));
	const col0 = Math.max(1, Math.floor(roi.x * GRID));
	const col1 = Math.min(GRID - 2, Math.ceil((roi.x + roi.w) * GRID));

	let xx = 0;
	let xy = 0;
	let yy = 0;
	let xt = 0;
	let yt = 0;

	for (let row = row0; row <= row1; row++) {
		for (let col = col0; col <= col1; col++) {
			const i = row * GRID + col;
			const ix = (current[i + 1] - current[i - 1]) / 2;
			const iy = (current[i + GRID] - current[i - GRID]) / 2;
			const it = current[i] - previous[i];
			xx += ix * ix;
			xy += ix * iy;
			yy += iy * iy;
			xt += -ix * it;
			yt += -iy * it;
		}
	}

	const determinant = xx * yy - xy * xy;
	if (determinant <= 1e-6) return { flowX: 0, flowY: 0 };

	return {
		flowX: (xt * yy - yt * xy) / determinant,
		flowY: (yt * xx - xt * xy) / determinant,
	};
}

/**
 * Bounding box around hand landmarks, padded, in normalized coordinates.
 * Returns null when there are no landmarks to bound.
 */
export function handROI(handLandmarks, pad = 0.25) {
	if (!handLandmarks?.length) return null;

	const xs = handLandmarks.map((p) => p.x);
	const ys = handLandmarks.map((p) => p.y);
	const minX = Math.min(...xs);
	const maxX = Math.max(...xs);
	const minY = Math.min(...ys);
	const maxY = Math.max(...ys);

	const w = maxX - minX;
	const h = maxY - minY;
	const x = Math.max(0, minX - w * pad);
	const y = Math.max(0, minY - h * pad);

	return {
		x,
		y,
		w: Math.min(1 - x, w * (1 + 2 * pad)),
		h: Math.min(1 - y, h * (1 + 2 * pad)),
	};
}

/** Expand an existing normalized ROI while keeping it inside the frame. */
export function padROI(roi, pad = 0.4) {
	if (!roi) return null;
	const x = Math.max(0, roi.x - roi.w * pad);
	const y = Math.max(0, roi.y - roi.h * pad);
	const right = Math.min(1, roi.x + roi.w * (1 + pad));
	const bottom = Math.min(1, roi.y + roi.h * (1 + pad));
	return { x, y, w: right - x, h: bottom - y };
}
