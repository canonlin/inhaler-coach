/**
 * Real inhaler object detection, replacing the colour filter that mistook a
 * nostril and a door handle for the inhaler.
 *
 * A YOLO11-nano detector trained (on the GPU box, from the six pharmacist videos
 * auto-labelled by an open-vocabulary model) to find the Symbicort Rapihaler as
 * an OBJECT — shape, not just redness. On a live webcam of a person holding
 * NOTHING it fires on ~0 % of frames, where the colour filter fired on 70–97 %.
 *
 * This class is a thin client: the model runs in a Web Worker (inhaler-worker.js)
 * so the ~200–400 ms wasm inference never blocks the main thread (that blocking
 * was the collector's preview ghosting and signal-loop starvation). `detect`
 * grabs a frame as an ImageBitmap — cheap, and transferable — and hands it off;
 * the worker letterboxes, runs the model, and returns the best box in normalized
 * frame coordinates so the step logic (canister distance-to-mouth / height) is
 * unchanged, just fed a trustworthy box.
 */

const EMPTY = { present: false, score: 0, center: null, box: null };

export class InhalerDetector {
	constructor() {
		this.worker = null;
		this.ready = false;
		this.seq = 0;
		this.pending = new Map();
		this._readyResolve = null;
		this._readyPromise = new Promise((r) => {
			this._readyResolve = r;
		});
	}

	/** Spins up the worker and resolves once the model is loaded. */
	async load() {
		if (this.worker) return this._readyPromise;
		this.worker = new Worker(
			new URL("./inhaler-worker.js", import.meta.url),
			{ type: "module" },
		);
		this.worker.onmessage = (e) => {
			const { id, result, error, ready } = e.data;
			if (ready) {
				this.ready = true;
				this._readyResolve?.();
				return;
			}
			const resolve = this.pending.get(id);
			if (resolve) {
				this.pending.delete(id);
				resolve(error ? EMPTY : result);
			}
		};
		// Nudge the worker to load the model now, not on first detect.
		this.worker.postMessage({ warmup: true });
		return this._readyPromise;
	}

	/**
	 * @param {CanvasImageSource} source - the raw video frame
	 * @param {number} srcW @param {number} srcH - its natural pixel size
	 * @param {number} conf - confidence floor
	 * @returns {Promise<{present:boolean, score:number,
	 *   center:{x:number,y:number}|null, box:{x,y,w,h}|null}>} normalized 0..1
	 */
	async detect(source, srcW, srcH, conf = 0.35) {
		if (!this.worker || !srcW || !srcH) return EMPTY;
		let bitmap;
		try {
			bitmap = await createImageBitmap(source);
		} catch {
			return EMPTY;
		}
		const id = ++this.seq;
		const done = new Promise((resolve) => this.pending.set(id, resolve));
		this.worker.postMessage({ id, bitmap, srcW, srcH, conf }, [bitmap]);
		return done;
	}

	reset() {}
}
