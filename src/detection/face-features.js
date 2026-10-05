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

function computeMAR(landmarks) {
	const upperOuter = [13, 14];
	const lowerOuter = [17, 18];
	const leftCorner = [61];
	const rightCorner = [291];

	let verDist = 0;
	for (let i = 0; i < upperOuter.length; i++) {
		const u = lm(landmarks, upperOuter[i]);
		const l = lm(landmarks, lowerOuter[i]);
		if (u && l) verDist += dist2D(u, l);
	}
	verDist /= upperOuter.length;

	const lc = lm(landmarks, leftCorner[0]);
	const rc = lm(landmarks, rightCorner[0]);
	const horDist = lc && rc ? dist2D(lc, rc) : 1;

	return horDist > 0 ? verDist / horDist : 0;
}

function isLipSealed(landmarks) {
	const upperLip = lm(landmarks, 13);
	const lowerLip = lm(landmarks, 14);
	if (!upperLip || !lowerLip) return false;
	return dist2D(upperLip, lowerLip) < 0.02;
}

export function isPursedLips(landmarks) {
	if (!landmarks || landmarks.length < 292) return false;
	const lc = lm(landmarks, 61);
	const rc = lm(landmarks, 291);
	const topLip = lm(landmarks, 13);
	const botLip = lm(landmarks, 14);
	const leftEye = lm(landmarks, 33);
	const rightEye = lm(landmarks, 263);

	if (!lc || !rc || !topLip || !botLip) return false;

	const mouthWidth = dist2D(lc, rc);
	const mouthHeight = dist2D(topLip, botLip);
	const mar = mouthWidth > 0 ? mouthHeight / mouthWidth : 0;

	let eyeSpan = 0.25;
	if (leftEye && rightEye) {
		const d = dist2D(leftEye, rightEye);
		if (d > 0.05) eyeSpan = d;
	}
	const normWidth = mouthWidth / eyeSpan;

	// Pursed lips (縮唇吐氣 / puckered lips):
	// 1. Mouth width contracts inwards (normWidth < 0.65) and mouth has rounded opening (mar >= 0.16)
	// 2. High aspect ratio whistle puckering (mar >= 0.28)
	return Boolean((normWidth < 0.65 && mar >= 0.16) || (mar >= 0.28 && normWidth < 0.75));
}

export function extractFaceFeatures(landmarks) {
	if (!landmarks || landmarks.length < 292) return null;

	const mar = computeMAR(landmarks);
	return {
		mar,
		lipSealed: isLipSealed(landmarks),
		jawOpen: mar > 0.6,
		pursedLips: isPursedLips(landmarks),
	};
}

