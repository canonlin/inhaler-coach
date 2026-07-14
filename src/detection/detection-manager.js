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
		// Try MediaPipe first
		try {
			const { MediaPipeBackend } = await import(
				"./backends/mediapipe-backend.js"
			);
			const backend = new MediaPipeBackend();
			await backend.initialize();
			this.backend = backend;
			this.activeBackend = "mediapipe";
			this.isInitialized = true;
			console.log("Detection: MediaPipe backend initialized (WebGL)");
			return;
		} catch (e) {
			console.warn("MediaPipe initialization failed, trying TF.js:", e.message);
		}

		// Fallback to TF.js, off the main thread. WASM inference is synchronous,
		// so running it inline would freeze the UI for the length of every
		// forward pass.
		try {
			const { TFJSWorkerBackend } = await import(
				"./backends/tfjs-worker-backend.js"
			);
			const backend = new TFJSWorkerBackend();
			await backend.initialize();
			this.backend = backend;
			this.activeBackend = "tfjs";
			this.isInitialized = true;
			console.log("Detection: TF.js backend initialized (WASM, in worker)");
			return;
		} catch (e) {
			console.error("TF.js initialization also failed:", e.message);
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
