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

export function isPursedLips(landmarks, blendshapes = null) {
	// 1. Direct neural classification via MediaPipe FaceBlendshapes (Google ARKit 52 blendshapes):
	// Highly robust across real webcams, lighting, and diverse human facial morphologies.
	if (Array.isArray(blendshapes)) {
		const pucker = blendshapes.find((c) => c.categoryName === "mouthPucker");
		const funnel = blendshapes.find((c) => c.categoryName === "mouthFunnel");
		const score = Math.max(pucker?.score || 0, funnel?.score || 0);
		if (score >= 0.22) return true;
	}

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

	// 3D forward protrusion (嘟嘴向前突出):
	// In MediaPipe 3D coordinates, z decreases (more negative) towards camera.
	// When lips pucker, lip center protrudes forward relative to mouth corners.
	const cornerZ = (lc.z + rc.z) / 2;
	const lipCenterZ = (topLip.z + botLip.z) / 2;
	const protrusion = cornerZ - lipCenterZ;

	// Outer lip vermilion aspect ratio (outer apex 0 to 17):
	const upperApex = lm(landmarks, 0);
	const lowerApex = lm(landmarks, 17);
	const outerHeight =
		upperApex && lowerApex ? dist2D(upperApex, lowerApex) : mouthHeight;
	const outerAspect = mouthWidth > 0 ? outerHeight / mouthWidth : 0;

	// Pursed lips (縮唇呼氣 / puckered lips blowing):
	// Must distinguish active pursing/blowing from resting neutral face (which has normWidth ~0.52-0.67, mar < 0.03, protrusion <= 0.005):
	// A. 3D forward protrusion: lips puckered towards camera
	const is3DProtrusion =
		protrusion >= 0.010 && (outerAspect >= 0.25 || mar >= 0.025);
	// B. Narrow puckered contraction (mouth width contracted relative to face)
	const isNarrowPucker = normWidth < 0.48 && mar <= 0.50;
	// C. Whistle / round blowing mouth: pronounced vertical-to-horizontal aspect
	const isWhistle = outerAspect >= 0.40 && normWidth < 0.65;
	// D. Puckered slit blowing: deliberate slit opening with contracted mouth or protrusion
	const isPuckeredSlit =
		mar >= 0.04 &&
		mar <= 0.35 &&
		(normWidth < 0.58 || protrusion >= 0.008);

	return Boolean(
		is3DProtrusion || isNarrowPucker || isWhistle || isPuckeredSlit,
	);
}

export function extractFaceFeatures(landmarks, blendshapes = null) {
	if (!landmarks || landmarks.length < 292) return null;

	const mar = computeMAR(landmarks);
	return {
		mar,
		lipSealed: isLipSealed(landmarks),
		jawOpen: mar > 0.6,
		pursedLips: isPursedLips(landmarks, blendshapes),
	};
}

