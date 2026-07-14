export class PressInhaleDetector {
	constructor() {
		this.pressHoldMs = 1000;
		this.breathHoldSeconds = 3;
		this.lastPressTime = 0;
	}

	detect({ handFeatures, faceFeatures, chestExpansion }) {
		// Phase 3: Fuse hand-face proximity + lip seal + press MLP + chest expansion
		let confidence = 0;

		if (handFeatures?.isPressing) confidence += 0.35;
		if (handFeatures?.faceProximity > 0.7) confidence += 0.15;
		if (faceFeatures?.lipSealed) confidence += 0.2;
		if (chestExpansion > 0.1) confidence += 0.2;

		return {
			pressing: confidence > 0.5,
			confidence,
			shouldStartBreathHold: confidence > 0.6,
		};
	}

	reset() {
		this.lastPressTime = 0;
	}
}
