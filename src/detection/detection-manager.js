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

		// Fallback to TF.js
		try {
			const { TFJSBackend } = await import("./backends/tfjs-backend.js");
			const backend = new TFJSBackend();
			await backend.initialize();
			this.backend = backend;
			this.activeBackend = "tfjs";
			this.isInitialized = true;
			console.log("Detection: TF.js backend initialized (WASM)");
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
	 * @returns {import('./backends/detection-backend.js').DetectionResult}
	 */
	processFrame(canvas, timestamp) {
		if (!this.isInitialized || !this.backend) {
			return { pose: null, face: null, hands: null };
		}
		return this.backend.processFrame(canvas, timestamp);
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
