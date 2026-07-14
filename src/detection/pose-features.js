import { angle, distance2D } from "../utils/math.js";

function lm(landmarks, idx) {
	const p = landmarks[idx];
	return p
		? { x: p.x, y: p.y, z: p.z || 0, score: p.score ?? null }
		: { x: 0, y: 0, z: 0, score: 0 };
}

/** Sticky choice of which arm to track, with hysteresis. */
let lockedSide = null;

/** How much better the other wrist must be before we switch to it. */
const SWITCH_MARGIN = 0.08;

function pickDominantSide(leftWrist, rightWrist) {
	const leftScore = leftWrist.score ?? 0;
	const rightScore = rightWrist.score ?? 0;

	// Prefer the wrist the model can actually see; fall back to the raised one.
	const scoreGap = leftScore - rightScore;
	const preferred =
		Math.abs(scoreGap) > 0.2
			? scoreGap > 0
				? "left"
				: "right"
			: leftWrist.y < rightWrist.y
				? "left"
				: "right";

	if (lockedSide === null) {
		lockedSide = preferred;
		return lockedSide;
	}

	if (preferred === lockedSide) return lockedSide;

	// Only defect if the other side is clearly, not marginally, better.
	const locked = lockedSide === "left" ? leftWrist : rightWrist;
	const other = lockedSide === "left" ? rightWrist : leftWrist;
	const lockedScore = locked.score ?? 0;
	const otherScore = other.score ?? 0;

	const clearlyBetter =
		otherScore > lockedScore + SWITCH_MARGIN ||
		(lockedScore < 0.5 && otherScore > 0.7);

	if (clearlyBetter) lockedSide = preferred;
	return lockedSide;
}

/** Call when a stage starts, so a new attempt can pick a different hand. */
export function resetDominantSide() {
	lockedSide = null;
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

	// Which arm is "the" arm, decided fresh every frame, was a bug: when both
	// wrists sit at a similar height the comparison flips between hands from one
	// frame to the next, and the tracked point teleports across the frame.
	// Measured 2026-07-15 on a *motionless* hand: 23 cross-frame jumps in 206
	// frames, producing a fake 0.368 amplitude — larger than a real shake.
	//
	// Lock onto a side and only switch when the other wrist is clearly better,
	// so a near-tie can't oscillate.
	const side = pickDominantSide(leftWrist, rightWrist);
	const dominantWrist = side === "left" ? leftWrist : rightWrist;
	const dominantElbow = side === "left" ? leftElbow : rightElbow;
	const dominantShoulder = side === "left" ? leftShoulder : rightShoulder;

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
