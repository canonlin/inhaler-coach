export class RinseDetector {
	constructor() {
		this.handFaceDistanceThreshold = 0.3;
		this.headTiltThreshold = 15;
		this.elbowAngleMin = 60;
	}

	detect({ poseFeatures }) {
		// Phase 1: Use hand-face proximity + elbow angle + head tilt rules
		if (!poseFeatures) return { rinsing: false, confidence: 0 };

		let confidence = 0;

		if (poseFeatures.handFaceDistance < this.handFaceDistanceThreshold) {
			confidence += 0.4;
		}
		if (Math.abs(poseFeatures.headTilt) > this.headTiltThreshold) {
			confidence += 0.3;
		}
		if (poseFeatures.elbowAngle > this.elbowAngleMin) {
			confidence += 0.3;
		}

		return {
			rinsing: confidence > 0.6,
			confidence,
		};
	}

	reset() {}
}
