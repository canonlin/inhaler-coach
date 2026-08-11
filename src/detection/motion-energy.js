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
	 * @returns {{hand:number, background:number, ratio:number}}
	 */
	sample(source, roi) {
		this.ctx.drawImage(source, 0, 0, GRID, GRID);
		const { data } = this.ctx.getImageData(0, 0, GRID, GRID);

		const gray = new Float32Array(GRID * GRID);
		for (let i = 0; i < gray.length; i++) {
			const p = i * 4;
			gray[i] = 0.299 * data[p] + 0.587 * data[p + 1] + 0.114 * data[p + 2];
		}

		if (!this.previous || this.previous.length !== gray.length) {
			this.previous = gray;
			return { hand: 0, background: 0, ratio: 0 };
		}

		const handCells = [];
		const backgroundCells = [];

		for (let row = 0; row < GRID; row++) {
			for (let col = 0; col < GRID; col++) {
				const i = row * GRID + col;
				const diff = Math.abs(gray[i] - this.previous[i]);
				const inHand =
					roi !== null &&
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
			return { hand: 0, background: 0, ratio: 0 };
		}

		// The 90th percentile, not the mean.
		//
		// Most of the hand box is skin that isn't going anywhere — the parts that
		// actually move are the canister and a few fingers, a small fraction of the
		// cells. Averaging over the whole box dilutes them into the still majority:
		// measured 2026-07-15, a wrist-only shake read 2.5 against 2.3 for a
		// motionless hand, i.e. the motion had been averaged out of existence. A
		// high percentile reports the cells that are moving.
		handCells.sort((a, b) => a - b);
		const hand = handCells[Math.floor(handCells.length * 0.9)];

		// Median, not mean: the patient's own face and body are in the background
		// too, and they move. The median ignores them and reports the noise floor.
		backgroundCells.sort((a, b) => a - b);
		const background = backgroundCells[Math.floor(backgroundCells.length / 2)];

		// Floor the denominator — a perfectly static background would otherwise
		// make any hand motion look infinite.
		const ratio = hand / Math.max(background, 0.5);

		return { hand, background, ratio };
	}

	reset() {
		this.previous = null;
	}
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

	return {
		x: Math.max(0, minX - w * pad),
		y: Math.max(0, minY - h * pad),
		w: Math.min(1, w * (1 + 2 * pad)),
		h: Math.min(1, h * (1 + 2 * pad)),
	};
}
