function lm(landmarks, idx) {
	const p = landmarks[idx];
	return p ? { x: p.x, y: p.y, z: p.z || 0 } : null;
}

function dist2D(a, b) {
	if (!a || !b) return 0;
	const dx = a.x - b.x;
	const dy = a.y - b.y;
	return Math.sqrt(dx * dx + dy * dy);
}

function fingerCurled(landmarks, tip, pip) {
	const t = lm(landmarks, tip);
	const p = lm(landmarks, pip);
	if (!t || !p) return false;
	return t.y > p.y;
}

function isGripping(landmarks) {
	const fingers = [
		[8, 6],
		[12, 10],
		[16, 14],
		[20, 18],
	];
	let curled = 0;
	for (const [tip, pip] of fingers) {
		if (fingerCurled(landmarks, tip, pip)) curled++;
	}
	return curled >= 3;
}

function isPressing(landmarks) {
	const thumbTip = lm(landmarks, 4);
	const thumbBase = lm(landmarks, 2);
	if (!thumbTip || !thumbBase) return false;
	return thumbTip.y > thumbBase.y + 0.03;
}

export function extractHandFeatures(landmarks, poseNose) {
	if (!landmarks || landmarks.length < 21) return null;

	const wrist = lm(landmarks, 0);
	const indexTip = lm(landmarks, 8);
	const middleTip = lm(landmarks, 12);
	const palmCenter = lm(landmarks, 9);

	const faceProximity =
		poseNose && palmCenter ? dist2D(palmCenter, poseNose) : null;

	return {
		gripPosture: isGripping(landmarks) ? "grip" : "idle",
		isPressing: isPressing(landmarks),
		faceProximity,
		wrist,
		indexTip,
		middleTip,
		palmCenter,
	};
}
