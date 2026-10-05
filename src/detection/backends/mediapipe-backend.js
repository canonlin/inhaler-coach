import {
	FaceLandmarker,
	FilesetResolver,
	HandLandmarker,
	PoseLandmarker,
} from "@mediapipe/tasks-vision";
import { ALL_SIGNALS, DetectionBackend } from "./detection-backend.js";

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
		this.lastTimestamp = 0;
	}

	async initialize() {
		if (!isWebGLAvailable()) {
			throw new Error("WebGL not available — MediaPipe requires WebGL");
		}

		const origin =
			typeof location !== "undefined" && location.origin
				? location.origin
				: "";
		const basePath = import.meta.env.BASE_URL || "/";
		const base = origin ? new URL(basePath, origin).href : basePath;

		const wasmPath = origin
			? new URL("mediapipe/", base).href
			: `${basePath}mediapipe/`;
		const posePath = origin
			? new URL("models/mediapipe/pose_landmarker_lite.task", base).href
			: `${basePath}models/mediapipe/pose_landmarker_lite.task`;
		const facePath = origin
			? new URL("models/mediapipe/face_landmarker.task", base).href
			: `${basePath}models/mediapipe/face_landmarker.task`;
		const handPath = origin
			? new URL("models/mediapipe/hand_landmarker.task", base).href
			: `${basePath}models/mediapipe/hand_landmarker.task`;

		const vision = await FilesetResolver.forVisionTasks(wasmPath);

		const [poseLandmarker, faceLandmarker, handLandmarker] =
			await Promise.all([
				PoseLandmarker.createFromOptions(vision, {
					baseOptions: {
						modelAssetPath: posePath,
						delegate: "CPU",
					},
					runningMode: "VIDEO",
					numPoses: 1,
					minPoseDetectionConfidence: 0.5,
					minPosePresenceConfidence: 0.5,
					minTrackingConfidence: 0.5,
				}),
				FaceLandmarker.createFromOptions(vision, {
					baseOptions: {
						modelAssetPath: facePath,
						delegate: "CPU",
					},
					runningMode: "VIDEO",
					numFaces: 1,
					minFaceDetectionConfidence: 0.5,
					minFacePresenceConfidence: 0.5,
					minTrackingConfidence: 0.5,
					outputFaceBlendshapes: true,
				}),
				HandLandmarker.createFromOptions(vision, {
					baseOptions: {
						modelAssetPath: handPath,
						delegate: "CPU",
					},
					runningMode: "VIDEO",
					numHands: 1,
					minHandDetectionConfidence: 0.5,
					minHandPresenceConfidence: 0.5,
					minTrackingConfidence: 0.5,
				}),
			]);

		this.poseLandmarker = poseLandmarker;
		this.faceLandmarker = faceLandmarker;
		this.handLandmarker = handLandmarker;
		this.isInitialized = true;
	}

	async processFrame(canvas, timestamp, needs = ALL_SIGNALS) {
		if (!this.isInitialized) {
			return { pose: null, face: null, faceBlendshapes: null, hands: null };
		}

		// detectForVideo requires strictly increasing timestamps per landmarker.
		const ts = Math.max(timestamp, this.lastTimestamp + 1);
		this.lastTimestamp = ts;

		const poseResult = needs.pose
			? this.poseLandmarker.detectForVideo(canvas, ts)
			: null;
		const faceResult = needs.face
			? this.faceLandmarker.detectForVideo(canvas, ts)
			: null;
		const handResult = needs.hands
			? this.handLandmarker.detectForVideo(canvas, ts)
			: null;

		return {
			pose: poseResult?.landmarks?.[0] || null,
			face: faceResult?.faceLandmarks?.[0] || null,
			faceBlendshapes: faceResult?.faceBlendshapes?.[0]?.categories || null,
			hands: handResult?.landmarks?.[0] || null,
		};
	}

	destroy() {
		this.poseLandmarker?.close();
		this.faceLandmarker?.close();
		this.handLandmarker?.close();
		this.isInitialized = false;
	}
}
