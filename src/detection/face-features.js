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

export function extractFaceFeatures(landmarks) {
	if (!landmarks || landmarks.length < 468) return null;

	return {
		mar: computeMAR(landmarks),
		lipSealed: isLipSealed(landmarks),
		jawOpen: computeMAR(landmarks) > 0.6,
	};
}
