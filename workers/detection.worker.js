/**
 * Detection worker — owns the TF.js WASM backend and all three landmark models.
 *
 * TF.js WASM inference is synchronous: it holds the thread for the whole
 * forward pass. Run it on the main thread and the page stops painting and
 * stops responding to input for as long as inference takes. Everything the
 * models touch therefore lives in here, and the main thread only ships frames
 * in and reads landmarks out.
 *
 * Protocol:
 *   main → worker  { type: 'init' }
 *                  { type: 'detect', id, bitmap, needs: {pose, face, hands} }
 *   worker → main  { type: 'ready' } | { type: 'error', message }
 *                  { type: 'result', id, pose, face, hands }
 */

import { normalizeKeypoints } from "../src/detection/backends/normalize.js";

let poseDetector = null;
let faceDetector = null;
let handDetector = null;

async function initialize() {
	const tf = await import("@tensorflow/tfjs-core");
	const wasmBackend = await import("@tensorflow/tfjs-backend-wasm");

	wasmBackend.setWasmPaths(
		"https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-wasm@4.22.0/dist/",
	);

	await tf.setBackend("wasm");
	await tf.ready();

	const poseDetection = await import("@tensorflow-models/pose-detection");
	const faceLandmarksDetection = await import(
		"@tensorflow-models/face-landmarks-detection"
	);
	const handPoseDetection = await import("@tensorflow-models/hand-pose-detection");

	[poseDetector, faceDetector, handDetector] = await Promise.all([
		poseDetection.createDetector(poseDetection.SupportedModels.BlazePose, {
			runtime: "tfjs",
			modelType: "lite",
		}),
		faceLandmarksDetection.createDetector(
			faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh,
			{ runtime: "tfjs", maxFaces: 1, refineLandmarks: false },
		),
		// 'full' rather than 'lite': the lite model loses a fast-moving hand, and a
		// fast-moving hand is exactly what shaking is. Measured 2026-07-15 on a
		// full collection run, it saw the hand in only 13% of frames during a
		// normal shake — the single most important task in the protocol.
		handPoseDetection.createDetector(
			handPoseDetection.SupportedModels.MediaPipeHands,
			{ runtime: "tfjs", maxHands: 1, modelType: "full" },
		),
	]);
}

function first(results) {
	return results && results.length > 0 ? results[0] : null;
}

async function detect(bitmap, needs) {
	const w = bitmap.width;
	const h = bitmap.height;

	const [poses, faces, hands] = await Promise.all([
		needs.pose ? poseDetector.estimatePoses(bitmap) : null,
		needs.face ? faceDetector.estimateFaces(bitmap) : null,
		needs.hands ? handDetector.estimateHands(bitmap) : null,
	]);

	const pose = first(poses)?.keypoints;
	const face = first(faces)?.keypoints;
	const hand = first(hands)?.keypoints;

	return {
		pose: pose ? normalizeKeypoints(pose, w, h) : null,
		face: face ? normalizeKeypoints(face, w, h) : null,
		hands: hand ? normalizeKeypoints(hand, w, h) : null,
	};
}

self.onmessage = async (e) => {
	const msg = e.data;

	if (msg.type === "init") {
		try {
			await initialize();
			self.postMessage({ type: "ready" });
		} catch (err) {
			self.postMessage({
				type: "error",
				message: err.message,
				stack: err.stack,
			});
		}
		return;
	}

	if (msg.type === "detect") {
		try {
			const result = await detect(msg.bitmap, msg.needs);
			self.postMessage({ type: "result", id: msg.id, ...result });
		} catch (err) {
			self.postMessage({
				type: "result",
				id: msg.id,
				pose: null,
				face: null,
				hands: null,
				error: err.message,
			});
		} finally {
			msg.bitmap.close();
		}
	}
};
