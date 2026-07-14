import { ALL_SIGNALS, DetectionBackend } from "./detection-backend.js";

const EMPTY = { pose: null, face: null, hands: null };

/**
 * TF.js WASM detection, running entirely inside a Web Worker.
 *
 * The main thread never touches a model here — it hands the worker an
 * ImageBitmap and gets landmarks back. Inference cost no longer shows up as UI
 * jank, because it isn't on the UI thread at all.
 *
 * Frames are dropped, never queued: if the worker is still busy when the next
 * frame arrives, that frame is skipped and the caller gets the most recent
 * landmarks instead. A queue would grow without bound whenever inference is
 * slower than the capture loop, which is exactly the runaway that made the page
 * unusable before.
 */
export class TFJSWorkerBackend extends DetectionBackend {
	constructor() {
		super();
		this.worker = null;
		this.isInitialized = false;
		this.busy = false;
		this.lastResult = EMPTY;
		this.nextId = 0;
		this.pending = new Map();
	}

	async initialize() {
		this.worker = new Worker(
			new URL("../../../workers/detection.worker.js", import.meta.url),
			{ type: "module" },
		);

		this.worker.onmessage = (e) => {
			const msg = e.data;
			if (msg.type === "result") {
				const resolve = this.pending.get(msg.id);
				this.pending.delete(msg.id);
				this.busy = false;
				if (msg.error) console.warn("Worker detection error:", msg.error);
				const result = { pose: msg.pose, face: msg.face, hands: msg.hands };
				this.lastResult = result;
				resolve?.(result);
			}
		};

		await new Promise((resolve, reject) => {
			const onReady = (e) => {
				if (e.data.type === "ready") {
					this.worker.removeEventListener("message", onReady);
					resolve();
				} else if (e.data.type === "error") {
					this.worker.removeEventListener("message", onReady);
					reject(new Error(e.data.message));
				}
			};
			this.worker.addEventListener("message", onReady);
			this.worker.onerror = (e) =>
				reject(new Error(e.message || "worker failed to load"));
			this.worker.postMessage({ type: "init" });
		});

		this.isInitialized = true;
	}

	async processFrame(canvas, _timestamp, needs = ALL_SIGNALS) {
		if (!this.isInitialized) return EMPTY;

		// Worker still chewing on the previous frame — skip this one.
		if (this.busy) return this.lastResult;

		this.busy = true;
		const bitmap = await createImageBitmap(canvas);
		const id = this.nextId++;

		return new Promise((resolve) => {
			this.pending.set(id, resolve);
			this.worker.postMessage({ type: "detect", id, bitmap, needs }, [bitmap]);
		});
	}

	destroy() {
		this.worker?.terminate();
		this.worker = null;
		this.pending.clear();
		this.isInitialized = false;
		this.busy = false;
	}
}
