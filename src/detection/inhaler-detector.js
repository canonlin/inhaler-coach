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

/**
 * Turn the frame-by-frame YOLO result into the device observation consumed by
 * the coaching steps.
 *
 * The detector is intentionally tuned for precision and therefore flickers on
 * motion blur and partial hand/mouth occlusion.  A positive observation is safe
 * to keep briefly (the validation no-inhaler clips have essentially no false
 * positives), while treating every missed frame as "device gone" makes a
 * five-second coaching step impossible to complete.  This tracker also derives
 * steadiness from YOLO centres, replacing the old red-pixel tracker as the
 * authoritative pass/fail signal.
 */
export class InhalerObservationTracker {
	constructor({ persistenceMs = 1200, historyMs = 1200 } = {}) {
		this.persistenceMs = persistenceMs;
		this.historyMs = historyMs;
		this.reset();
	}

	observe(result, timestamp) {
		if (result?.present && result.center) {
			this.lastPositive = {
				...result,
				center: { ...result.center },
				box: result.box ? { ...result.box } : null,
			};
			this.lastPositiveAt = timestamp;
			this.history.push({
				x: result.center.x,
				y: result.center.y,
				t: timestamp,
			});
		}
		this.history = this.history.filter(
			(sample) => sample.t > timestamp - this.historyMs,
		);
		return this.current(timestamp);
	}

	current(timestamp) {
		if (
			!this.lastPositive ||
			timestamp - this.lastPositiveAt > this.persistenceMs
		) {
			return { ...EMPTY, steadiness: 0, observedAt: null };
		}
		return {
			...this.lastPositive,
			steadiness: this.steadiness(),
			observedAt: this.lastPositiveAt,
		};
	}

	seenRecently(timestamp, maxAgeMs = this.persistenceMs) {
		return (
			this.lastPositive !== null && timestamp - this.lastPositiveAt <= maxAgeMs
		);
	}

	steadiness() {
		if (this.history.length < 3) return 0;
		const spread = (axis) => {
			const values = this.history.map((sample) => sample[axis]);
			const mean =
				values.reduce((sum, value) => sum + value, 0) / values.length;
			return Math.sqrt(
				values.reduce((sum, value) => sum + (value - mean) ** 2, 0) /
					values.length,
			);
		};
		// Position is normalized to the frame.  About 2% jitter is a steady hold;
		// 15% travel is deliberate waving.  Use both axes so a horizontal sweep
		// cannot look steady merely because its height is unchanged.
		const positionStd = Math.hypot(spread("x"), spread("y"));
		return Math.max(0, Math.min(1, 1 - positionStd / 0.15));
	}

	reset() {
		this.lastPositive = null;
		this.lastPositiveAt = 0;
		this.history = [];
	}
}

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
		this.worker = new Worker(new URL("./inhaler-worker.js", import.meta.url), {
			type: "module",
		});
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
