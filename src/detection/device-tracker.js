/**
 * Tracks the inhaler itself, by colour, instead of the hand or the sound.
 *
 * Every earlier attempt at the actuation ("press") anchored on something that
 * isn't reliably there: the hand model blinks on fast motion, and a webcam mic at
 * arm's length can't hear the propellant hiss (2026-07-18: 0 of ~10 real sprays
 * heard across five people; handling the device was louder and flatter than the
 * spray). But the Symbicort Rapihaler is a bright RED canister on a white body —
 * the most distinctive object in frame. Colour-segmenting it works for all five
 * people during actuation (a red blob is present in 89–100 % of frames), whether
 * or not the hand model or the microphone caught anything.
 *
 * This relocates the whole actuation problem from "hear/see the spray" to "track
 * the device", and it serves the WHOLE protocol, not one step:
 *
 *   - priming — two test sprays into the air, held up and AWAY from the face;
 *   - actuation — one press at the mouth, during an inhale.
 *
 * The press in both is the same physical event: the red canister pushed DOWN into
 * the body (`canisterY` dips briefly). Whether it counts as priming or actuation
 * is decided by CONTEXT — where the device is (away from the face vs at the mouth)
 * and the sequence it arrives in — not by the press itself. So this tracker is
 * deliberately position-agnostic: it reports where the canister is and how it
 * moves; the steps layer the context on top.
 *
 * What is validated here and now (five people, from video): red-canister
 * PRESENCE, CENTRE, BOUNDING BOX and AREA. What is NOT yet validated, and is
 * therefore exposed as raw signal rather than a hard decision: the press DIP. In
 * the collected data the pharmacists wave the device at the camera (demonstrating,
 * not inhaling), so its position swings ±0.6 of the frame continuously and the
 * dip is buried under that gross motion. The dip only separates when the device
 * is held STEADY — which is the real gesture in both priming and actuation, and
 * exactly what the wave-at-camera demo lacks. Hence `steadiness` below: a dip is
 * only meaningful while the device is steady, and the threshold for "a dip"
 * still needs a few steady-hold clips (into-air AND at-mouth) to set.
 */

/** Downscaled working resolution. Wide enough to keep the canister a solid blob,
 * small enough to scan every frame cheaply. 16:9 to match the camera. */
const GRID_W = 160;
const GRID_H = 90;

/** A pixel is "canister red" if it is strongly red and clearly not skin, paper,
 * or the beige clinic wall — red dominant over both other channels. Tuned on the
 * five-person footage; this is device-specific (the red Rapihaler), and a
 * differently-coloured inhaler would need its own colour test. */
export function isCanisterRed(r, g, b) {
	return r > 110 && r - g > 50 && r - b > 50;
}

/** Below this fraction of the frame, treat it as no device rather than a stray
 * red speck. The smallest genuine canister measured ran ~0.2 % of the frame. */
const MIN_AREA_FRACTION = 0.0015;

/**
 * Pure core: find the red canister in one RGBA frame. Separated from the canvas
 * so it can be tested without a DOM. `roi` (normalized) optionally restricts the
 * search near the hand, to reject other red objects in the room.
 *
 * @param {Uint8ClampedArray} data - RGBA, length w*h*4
 * @returns {{present:boolean, area:number, center:{x:number,y:number}|null,
 *            bbox:{top:number,bottom:number,left:number,right:number}|null,
 *            width:number, height:number}}
 */
export function analyzeRedFrame(data, w, h, roi = null) {
	let n = 0;
	let sx = 0;
	let sy = 0;
	let top = h;
	let bottom = 0;
	let left = w;
	let right = 0;

	const rx0 = roi ? roi.x * w : 0;
	const rx1 = roi ? (roi.x + roi.w) * w : w;
	const ry0 = roi ? roi.y * h : 0;
	const ry1 = roi ? (roi.y + roi.h) * h : h;

	for (let row = 0; row < h; row++) {
		if (row < ry0 || row > ry1) continue;
		for (let col = 0; col < w; col++) {
			if (col < rx0 || col > rx1) continue;
			const i = (row * w + col) * 4;
			if (isCanisterRed(data[i], data[i + 1], data[i + 2])) {
				n++;
				sx += col;
				sy += row;
				if (row < top) top = row;
				if (row > bottom) bottom = row;
				if (col < left) left = col;
				if (col > right) right = col;
			}
		}
	}

	if (n / (w * h) < MIN_AREA_FRACTION) {
		return {
			present: false,
			area: 0,
			center: null,
			bbox: null,
			width: 0,
			height: 0,
		};
	}

	return {
		present: true,
		area: n / (w * h),
		center: { x: sx / n / w, y: sy / n / h },
		bbox: {
			top: top / h,
			bottom: bottom / h,
			left: left / w,
			right: right / w,
		},
		width: (right - left) / w,
		height: (bottom - top) / h,
	};
}

export class DeviceTracker {
	constructor() {
		this.canvas = document.createElement("canvas");
		this.canvas.width = GRID_W;
		this.canvas.height = GRID_H;
		this.ctx = this.canvas.getContext("2d", { willReadFrequently: true });
		/** Short history of canister vertical position, for the dip signal and for
		 * measuring how steady the device is being held. */
		this.history = [];
	}

	/**
	 * @param {CanvasImageSource} source - the raw camera frame (not the landmark-
	 *   drawn canvas)
	 * @param {{x:number,y:number,w:number,h:number}|null} roi - optional hand box
	 * @param {number} timestamp
	 */
	sample(source, roi, timestamp) {
		this.ctx.drawImage(source, 0, 0, GRID_W, GRID_H);
		const { data } = this.ctx.getImageData(0, 0, GRID_W, GRID_H);
		const dev = analyzeRedFrame(data, GRID_W, GRID_H, roi);

		if (dev.present) {
			this.history.push({ y: dev.center.y, h: dev.height, t: timestamp });
			this.history = this.history.filter((s) => s.t > timestamp - 1200);
		}

		return {
			...dev,
			steadiness: this.steadiness(),
			// Raw signal for a press: how far the canister has dipped from its recent
			// resting position. Only trustworthy while steadiness is high — see the
			// header. Consumers must NOT treat this as a confirmed press yet.
			dip: dev.present ? this.dipFromRest(dev.center.y) : 0,
		};
	}

	/** Low spread of the canister's recent vertical position => being held steady.
	 * Returned as 0..1 (1 = rock steady). The demo footage sits near 0. */
	steadiness() {
		if (this.history.length < 5) return 0;
		const ys = this.history.map((s) => s.y);
		const mean = ys.reduce((a, b) => a + b, 0) / ys.length;
		const variance = ys.reduce((a, b) => a + (b - mean) ** 2, 0) / ys.length;
		// std in frame units; ~0.02 (2 % of frame height) is steady, ~0.2 is waving.
		return Math.max(0, 1 - Math.sqrt(variance) / 0.15);
	}

	/** Downward excursion from the recent median resting height (positive = the
	 * canister moved down, i.e. was pressed). */
	dipFromRest(y) {
		if (this.history.length < 5) return 0;
		const ys = this.history.map((s) => s.y).sort((a, b) => a - b);
		const rest = ys[Math.floor(ys.length / 2)];
		return Math.max(0, y - rest);
	}

	reset() {
		this.history = [];
	}
}
