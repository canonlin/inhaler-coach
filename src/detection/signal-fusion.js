export class SignalFusion {
	constructor() {
		this.weights = {
			pose: 0.3,
			face: 0.25,
			hand: 0.2,
			opticalFlow: 0.15,
			rppg: 0.1,
		};
	}

	fuse(signals) {
		// Phase 2-3: Multi-modal signal fusion for final decision
		// Combine all feature vectors with weighted confidence
		let totalConfidence = 0;
		let totalWeight = 0;

		for (const [key, signal] of Object.entries(signals)) {
			if (signal && this.weights[key]) {
				totalConfidence += signal.confidence * this.weights[key];
				totalWeight += this.weights[key];
			}
		}

		return {
			confidence: totalWeight > 0 ? totalConfidence / totalWeight : 0,
			decision: totalWeight > 0 ? totalConfidence / totalWeight > 0.5 : false,
		};
	}
}
