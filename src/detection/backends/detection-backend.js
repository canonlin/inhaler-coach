/**
 * @typedef {Object} DetectionResult
 * @property {Array<{x: number, y: number, z: number}> | null} pose - 33 normalized [0,1] landmarks
 * @property {Array<{x: number, y: number, z: number}> | null} face - 468 normalized [0,1] landmarks
 * @property {Array<{x: number, y: number, z: number}> | null} hands - 21 normalized [0,1] landmarks
 */

/**
 * @interface DetectionBackend
 */
export class DetectionBackend {
	/**
	 * Initialize the backend (load models, create contexts)
	 * @returns {Promise<void>}
	 */
	async initialize() {
		throw new Error("initialize() must be implemented");
	}

	/**
	 * Process a video frame and return landmarks
	 * @param {HTMLCanvasElement} canvas - Input frame
	 * @param {DOMHighResTimeStamp} timestamp - Frame timestamp
	 * @returns {DetectionResult}
	 */
	processFrame() {
		throw new Error("processFrame() must be implemented");
	}

	/**
	 * Clean up resources
	 */
	destroy() {
		throw new Error("destroy() must be implemented");
	}
}
