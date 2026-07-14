import {
	FaceLandmarker,
	FilesetResolver,
	HandLandmarker,
	PoseLandmarker,
} from "@mediapipe/tasks-vision";
import { DetectionBackend } from "./detection-backend.js";

function isWebGLAvailable() {
	try {
		const c = document.createElement("canvas");
		return !!(
			c.getContext("webgl2") ||
			c.getContext("webgl") ||
			c.getContext("experimental-webgl")
		);
	} catch {
		return false;
	}
}

export class MediaPipeBackend extends DetectionBackend {
	constructor() {
		super();
		this.poseLandmarker = null;
		this.faceLandmarker = null;
		this.handLandmarker = null;
		this.isInitialized = false;
	}

	async initialize() {
		if (!isWebGLAvailable()) {
			throw new Error("WebGL not available — MediaPipe requires WebGL");
		}

		const vision = await FilesetResolver.forVisionTasks(
			"https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm",
		);

		this.poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
			baseOptions: {
				modelAssetPath:
					"https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_heavy/float16/1/pose_landmarker_heavy.task",
				delegate: "CPU",
			},
			runningMode: "VIDEO",
			numPoses: 1,
			minPoseDetectionConfidence: 0.5,
			minPosePresenceConfidence: 0.5,
			minTrackingConfidence: 0.5,
		});

		this.faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
			baseOptions: {
				modelAssetPath:
					"https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
				delegate: "CPU",
			},
			runningMode: "VIDEO",
			numFaces: 1,
			minFaceDetectionConfidence: 0.5,
			minFacePresenceConfidence: 0.5,
			minTrackingConfidence: 0.5,
			outputFaceBlendshapes: false,
		});

		this.handLandmarker = await HandLandmarker.createFromOptions(vision, {
			baseOptions: {
				modelAssetPath:
					"https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
				delegate: "CPU",
			},
			runningMode: "VIDEO",
			numHands: 1,
			minHandDetectionConfidence: 0.5,
			minHandPresenceConfidence: 0.5,
			minTrackingConfidence: 0.5,
		});

		this.isInitialized = true;
	}

	processFrame(canvas, timestamp) {
		if (!this.isInitialized) {
			return { pose: null, face: null, hands: null };
		}

		const ctx = canvas.getContext("2d");
		const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

		const poseResult = this.poseLandmarker.detectForVideo(imageData, timestamp);
		const faceResult = this.faceLandmarker.detectForVideo(imageData, timestamp);
		const handResult = this.handLandmarker.detectForVideo(imageData, timestamp);

		return {
			pose: poseResult.landmarks?.[0] || null,
			face: faceResult.faceLandmarks?.[0] || null,
			hands: handResult.landmarks?.[0] || null,
		};
	}

	destroy() {
		this.poseLandmarker?.close();
		this.faceLandmarker?.close();
		this.handLandmarker?.close();
		this.isInitialized = false;
	}
}
