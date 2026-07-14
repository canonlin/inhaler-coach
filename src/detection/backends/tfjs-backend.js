import { DetectionBackend } from "./detection-backend.js";
import { extractFirstResult, normalizeKeypoints } from "./normalize.js";

export class TFJSBackend extends DetectionBackend {
	constructor() {
		super();
		this.poseDetector = null;
		this.faceDetector = null;
		this.handDetector = null;
		this.isInitialized = false;
		this.imageWidth = 640;
		this.imageHeight = 480;
	}

	async initialize() {
		const tf = await import("@tensorflow/tfjs-core");
		await import("@tensorflow/tfjs-backend-wasm");

		await tf.setBackend("wasm");
		await tf.ready();

		const poseDetection = await import("@tensorflow-models/pose-detection");
		const faceLandmarksDetection = await import(
			"@tensorflow-models/face-landmarks-detection"
		);
		const handPoseDetection = await import(
			"@tensorflow-models/hand-pose-detection"
		);

		const [poseDetector, faceDetector, handDetector] = await Promise.all([
			poseDetection.createDetector(poseDetection.SupportedModels.BlazePose, {
				runtime: "tfjs",
				modelType: "heavy",
			}),
			faceLandmarksDetection.createDetector(
				faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh,
				{ runtime: "tfjs", maxFaces: 1, refineLandmarks: false },
			),
			handPoseDetection.createDetector(
				handPoseDetection.SupportedModels.MediaPipeHands,
				{ runtime: "tfjs", maxHands: 1, modelType: "full" },
			),
		]);

		this.poseDetector = poseDetector;
		this.faceDetector = faceDetector;
		this.handDetector = handDetector;
		this.isInitialized = true;
	}

	processFrame(canvas) {
		if (!this.isInitialized) {
			return { pose: null, face: null, hands: null };
		}

		this.imageWidth = canvas.width;
		this.imageHeight = canvas.height;

		const poseResult = this.detectPose(canvas);
		const faceResult = this.detectFace(canvas);
		const handResult = this.detectHand(canvas);

		return {
			pose: poseResult,
			face: faceResult,
			hands: handResult,
		};
	}

	detectPose(canvas) {
		try {
			const poses = this.poseDetector.estimatePoses(canvas);
			const first = extractFirstResult(poses);
			if (!first?.keypoints) return null;
			return normalizeKeypoints(
				first.keypoints,
				this.imageWidth,
				this.imageHeight,
			);
		} catch (e) {
			console.warn("TF.js pose detection failed:", e.message);
			return null;
		}
	}

	detectFace(canvas) {
		try {
			const faces = this.faceDetector.estimateFaces(canvas);
			const first = extractFirstResult(faces);
			if (!first?.keypoints) return null;
			return normalizeKeypoints(
				first.keypoints,
				this.imageWidth,
				this.imageHeight,
			);
		} catch (e) {
			console.warn("TF.js face detection failed:", e.message);
			return null;
		}
	}

	detectHand(canvas) {
		try {
			const hands = this.handDetector.estimateHands(canvas);
			const first = extractFirstResult(hands);
			if (!first?.keypoints) return null;
			return normalizeKeypoints(
				first.keypoints,
				this.imageWidth,
				this.imageHeight,
			);
		} catch (e) {
			console.warn("TF.js hand detection failed:", e.message);
			return null;
		}
	}

	destroy() {
		this.poseDetector?.dispose();
		this.faceDetector?.dispose();
		this.handDetector?.dispose();
		this.isInitialized = false;
	}
}
