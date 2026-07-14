import { angle, distance2D } from "../utils/math.js";

function lm(landmarks, idx) {
	const p = landmarks[idx];
	return p ? { x: p.x, y: p.y, z: p.z || 0 } : { x: 0, y: 0, z: 0 };
}

export function extractPoseFeatures(landmarks) {
	if (!landmarks || landmarks.length < 33) return null;

	const leftWrist = lm(landmarks, 15);
	const rightWrist = lm(landmarks, 16);
	const leftElbow = lm(landmarks, 13);
	const rightElbow = lm(landmarks, 14);
	const leftShoulder = lm(landmarks, 11);
	const rightShoulder = lm(landmarks, 12);
	const nose = lm(landmarks, 0);
	const leftEar = lm(landmarks, 7);
	const rightEar = lm(landmarks, 8);

	const dominantWrist = leftWrist.y < rightWrist.y ? leftWrist : rightWrist;
	const dominantElbow = leftWrist.y < rightWrist.y ? leftElbow : rightElbow;
	const dominantShoulder =
		leftWrist.y < rightWrist.y ? leftShoulder : rightShoulder;

	const handFaceDist = distance2D(dominantWrist, nose);
	const elbowAng = angle(dominantShoulder, dominantElbow, dominantWrist);

	const shoulderCenter = {
		x: (leftShoulder.x + rightShoulder.x) / 2,
		y: (leftShoulder.y + rightShoulder.y) / 2,
	};
	const headTilt =
		Math.atan2(rightEar.y - leftEar.y, rightEar.x - leftEar.x) *
		(180 / Math.PI);

	return {
		leftWrist,
		rightWrist,
		dominantWrist,
		leftElbow,
		rightElbow,
		nose,
		leftShoulder,
		rightShoulder,
		shoulderCenter,
		handFaceDistance: handFaceDist,
		elbowAngle: elbowAng,
		headTilt,
	};
}
