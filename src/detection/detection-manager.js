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
	}

	/**
	 * Initialize detection with automatic fallback
	 */
	async initialize() {
		if (this.isInitialized) {
			console.log("[DetectionManager] already initialized, skipping");
			return;
		}
		console.log("[DetectionManager] initialize() called");
		// Try MediaPipe first
		try {
			console.log("[DetectionManager] trying MediaPipe...");
			const { MediaPipeBackend } = await import(
				"./backends/mediapipe-backend.js"
			);
			const backend = new MediaPipeBackend();
			await backend.initialize();
			this.backend = backend;
			this.activeBackend = "mediapipe";
			this.isInitialized = true;
			console.log("[DetectionManager] MediaPipe backend initialized (WebGL)");
			return;
		} catch (e) {
			console.warn("[DetectionManager] MediaPipe failed:", e.message);
		}

		// Fallback to TF.js, off the main thread. WASM inference is synchronous,
		// so running it inline would freeze the UI for the length of every
		// forward pass.
		try {
			console.log("[DetectionManager] trying TF.js...");
			const { TFJSWorkerBackend } = await import(
				"./backends/tfjs-worker-backend.js"
			);
			const backend = new TFJSWorkerBackend();
			await backend.initialize();
			this.backend = backend;
			this.activeBackend = "tfjs";
			this.isInitialized = true;
			console.log("[DetectionManager] TF.js backend initialized (WASM, in worker)");
			return;
		} catch (e) {
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
	}
}
