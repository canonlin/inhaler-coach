import { DetectionBackend } from "./backends/detection-backend.js";

/**
 * Orchestrates detection backend initialization with automatic fallback.
 * Tries MediaPipe (WebGL) first, falls back to TF.js (WASM) on failure.
 */
export class DetectionManager {
	constructor() {
		/** @type {DetectionBackend|null} */
		this.backend = null;
		/** @type {'mediapipe'|'tfjs'|null} */
		this.activeBackend = null;
		this.isInitialized = false;
		this.initializePromise = null;
	}

	/**
	 * Initialize detection with automatic fallback
	 */
	async initialize() {
		if (this.isInitialized) {
			console.log("[DetectionManager] already initialized, skipping");
			return;
		}
		if (this.initializePromise) return this.initializePromise;

		this.initializePromise = this.initializeBackends();
		try {
			await this.initializePromise;
		} catch (error) {
			// A later retry must get a fresh initialization attempt rather than the
			// same rejected promise.
			this.initializePromise = null;
			throw error;
		}
	}

	async initializeBackends() {
		console.log("[DetectionManager] initialize() called");
		// Try MediaPipe first
		let mediaPipeBackend = null;
		try {
			console.log("[DetectionManager] trying MediaPipe...");
			const { MediaPipeBackend } = await import(
				"./backends/mediapipe-backend.js"
			);
			mediaPipeBackend = new MediaPipeBackend();
			await mediaPipeBackend.initialize();
			this.backend = mediaPipeBackend;
			this.activeBackend = "mediapipe";
			this.isInitialized = true;
			console.log("[DetectionManager] MediaPipe backend initialized (WebGL)");
			return;
		} catch (e) {
			mediaPipeBackend?.destroy();
			console.warn("[DetectionManager] MediaPipe failed:", e.message);
		}

		// Fallback to TF.js, off the main thread. WASM inference is synchronous,
		// so running it inline would freeze the UI for the length of every
		// forward pass.
		let tfjsBackend = null;
		try {
			console.log("[DetectionManager] trying TF.js...");
			const { TFJSWorkerBackend } = await import(
				"./backends/tfjs-worker-backend.js"
			);
			tfjsBackend = new TFJSWorkerBackend();
			await tfjsBackend.initialize();
			this.backend = tfjsBackend;
			this.activeBackend = "tfjs";
			this.isInitialized = true;
			console.log(
				"[DetectionManager] TF.js backend initialized (WASM, in worker)",
			);
			return;
		} catch (e) {
			tfjsBackend?.destroy();
			console.error("[DetectionManager] TF.js also failed:", e.message);
			throw new Error(`No detection backend available: ${e.message}`);
		}
	}

	/**
	 * Process a video frame
	 * @param {HTMLCanvasElement} canvas
	 * @param {DOMHighResTimeStamp} timestamp
	 * @returns {Promise<import('./backends/detection-backend.js').DetectionResult>}
	 */
	async processFrame(canvas, timestamp, needs) {
		if (!this.isInitialized || !this.backend) {
			return { pose: null, face: null, hands: null };
		}
		return this.backend.processFrame(canvas, timestamp, needs);
	}

	/**
	 * Get the name of the active backend
	 * @returns {'mediapipe'|'tfjs'|null}
	 */
	getBackendName() {
		return this.activeBackend;
	}

	destroy() {
		this.backend?.destroy();
		this.backend = null;
		this.activeBackend = null;
		this.isInitialized = false;
		this.initializePromise = null;
	}
}
