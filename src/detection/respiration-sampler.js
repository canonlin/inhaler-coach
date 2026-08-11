import { analyzeRespiration } from "./respiration-analyzer.js";

/**
 * Runtime side of breath detection: turns the live camera into the two signals
 * respiration-analyzer.js consumes — chest vertical motion (the real channel)
 * and forehead green (rPPG, kept for telemetry only; it is motion here, not
 * blood — see the analyzer header).
 *
 * The chest ROI is anchored on the blue surgical mask, because on this footage
 * the mask segments far more reliably than the face landmarks. Everything runs on
 * a small downscaled grid; the whole point is a cheap per-frame sample buffered
 * across the exhale step, then judged as a completed window (like the press
 * analyzer). Not yet validated on a live camera — the ROI proportions and the
 * detection threshold were fixed on recorded video and will want a real run.
 */

const GRID_W = 96;
const GRID_H = 54; // 16:9

function isBlueMask(r, g, b) {
	return b > 90 && b - r > 25 && g > 60;
}
function isRed(r, g, b) {
	return r > 110 && r - g > 50 && r - b > 50;
}

export class RespirationSampler {
	constructor() {
		this.canvas = document.createElement("canvas");
		this.canvas.width = GRID_W;
		this.canvas.height = GRID_H;
		this.ctx = this.canvas.getContext("2d", { willReadFrequently: true });
		this.prevGray = null;
		this.center = null; // smoothed mask centre {y, x, h}
		this.chest = 0; // cumulative vertical displacement
		this.buffer = []; // {t, chest, green}
		this.fps = 15; // nominal; the analyzer only needs it for the band edges
	}

	/** @param {CanvasImageSource} source - raw camera frame @param {number} t
	 * @returns {{t:number, chest:number, green:number}|null} the sample just
	 *   buffered, or null when no chest ROI was available this frame (no mask, or
	 *   the first frame with nothing to difference against). The collector stamps
	 *   the return onto each logged frame; the coaching app ignores it. */
	sample(source, t) {
		this.ctx.drawImage(source, 0, 0, GRID_W, GRID_H);
		const { data } = this.ctx.getImageData(0, 0, GRID_W, GRID_H);

		const gray = new Float32Array(GRID_W * GRID_H);
		const green = new Float32Array(GRID_W * GRID_H);
		const red = new Uint8Array(GRID_W * GRID_H);
		let mcy = 0;
		let mcx = 0;
		let mTop = GRID_H;
		let mBot = 0;
		let mn = 0;
		for (let i = 0; i < gray.length; i++) {
			const p = i * 4;
			const r = data[p];
			const g = data[p + 1];
			const b = data[p + 2];
			gray[i] = 0.299 * r + 0.587 * g + 0.114 * b;
			green[i] = g;
			if (isRed(r, g, b)) red[i] = 1;
			if (isBlueMask(r, g, b)) {
				const row = (i / GRID_W) | 0;
				const col = i % GRID_W;
				mcy += row;
				mcx += col;
				if (row < mTop) mTop = row;
				if (row > mBot) mBot = row;
				mn++;
			}
		}

		if (mn > 40) {
			const c = { y: mcy / mn, x: mcx / mn, h: mBot - mTop };
			// Heavy smoothing so the ROI is stable frame to frame.
			this.center = this.center
				? {
						y: this.center.y * 0.8 + c.y * 0.2,
						x: this.center.x * 0.8 + c.x * 0.2,
						h: this.center.h * 0.8 + c.h * 0.2,
					}
				: c;
		}

		let sample = null;
		if (this.center && this.prevGray) {
			const { chestVel, fore } = this.measure(gray, green, red);
			this.chest += chestVel;
			sample = { t, chest: this.chest, green: fore };
			this.buffer.push(sample);
		}
		this.prevGray = gray;
		return sample;
	}

	/** Global vertical Lucas-Kanade velocity in the chest ROI, plus forehead green. */
	measure(gray, green, red) {
		const c = this.center;
		const r0 = Math.min(GRID_H - 2, Math.round(c.y + c.h * 0.7));
		const r1 = GRID_H - 1;
		const c0 = Math.max(1, Math.round(c.x - GRID_W * 0.22));
		const c1 = Math.min(GRID_W - 2, Math.round(c.x + GRID_W * 0.22));

		let num = 0;
		let den = 0;
		for (let row = r0; row <= r1; row++) {
			for (let col = c0; col <= c1; col++) {
				const i = row * GRID_W + col;
				if (red[i]) continue; // ignore the inhaler
				const iy = gray[i + GRID_W] - gray[i - GRID_W]; // vertical gradient
				const it = gray[i] - this.prevGray[i]; // temporal gradient
				num += -it * iy;
				den += iy * iy;
			}
		}
		const chestVel = den > 1e-3 ? num / den : 0;

		// Forehead ROI (above the mask) — telemetry-only rPPG.
		const fr0 = Math.max(0, Math.round(c.y - c.h * 1.1));
		const fr1 = Math.max(1, Math.round(c.y - c.h * 0.5));
		const fc0 = Math.max(0, Math.round(c.x - GRID_W * 0.12));
		const fc1 = Math.min(GRID_W - 1, Math.round(c.x + GRID_W * 0.12));
		let gs = 0;
		let gn = 0;
		for (let row = fr0; row < fr1; row++) {
			for (let col = fc0; col <= fc1; col++) {
				gs += green[row * GRID_W + col];
				gn++;
			}
		}
		return { chestVel, fore: gn ? gs / gn : 0 };
	}

	/** Judge the buffered window. `baseline` (chest/green band amplitudes from a
	 * quiet moment) enables the robust relative test; without it the analyzer
	 * falls back to rate + periodicity. */
	analyze(baseline = null) {
		const chest = this.buffer.map((s) => s.chest);
		const green = this.buffer.map((s) => s.green);
		return analyzeRespiration(chest, green, this.effectiveFps(), baseline);
	}

	/** Actual sampling rate from the buffer timestamps (the loop rate varies). */
	effectiveFps() {
		if (this.buffer.length < 2) return this.fps;
		const span =
			(this.buffer.at(-1).t - this.buffer[0].t) / (this.buffer.length - 1);
		return span > 0 ? 1000 / span : this.fps;
	}

	reset() {
		this.prevGray = null;
		this.center = null;
		this.chest = 0;
		this.buffer = [];
	}
}
