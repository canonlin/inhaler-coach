/**
 * Convert pixel-space keypoints to normalized [0,1] coordinates
 * matching MediaPipe Tasks Vision output format.
 *
 * @param {Array<{x: number, y: number, z?: number, score?: number, name?: string}>} keypoints
 * @param {number} imageWidth - Width of the input image in pixels
 * @param {number} imageHeight - Height of the input image in pixels
 * @returns {Array<{x: number, y: number, z: number}>}
 */
export function normalizeKeypoints(keypoints, imageWidth, imageHeight) {
	if (!keypoints || keypoints.length === 0) return [];
	return keypoints.map((kp) => ({
		x: kp.x / imageWidth,
		y: kp.y / imageHeight,
		z: (kp.z || 0) / imageWidth,
	}));
}

/**
 * Extract first result from TF.js detector output array
 * @param {Array} results - TF.js detector.estimatePoses/estimateFaces/estimateHands result
 * @returns {Object|null} - First result or null if empty
 */
export function extractFirstResult(results) {
	return results && results.length > 0 ? results[0] : null;
}
