export class ExhaleDetector {
	constructor() {
		this.opticalFlowThreshold = 0.5;
		this.rppgCooldownMs = 1000;
		this.lastDetectionTime = 0;
	}

	detect({ mar, opticalFlow, rppg, handPosition }) {
		// Phase 2: Fuse MAR + optical flow peak + rPPG coherence + hand position
		const now = Date.now();
		if (now - this.lastDetectionTime < this.rppgCooldownMs) {
			return { exhaling: false, confidence: 0 };
		}

		let confidence = 0;
		let factors = 0;

		if (mar !== undefined) {
			confidence += mar > 0.5 ? 0.4 : 0;
			factors++;
		}
		if (opticalFlow?.magnitude !== undefined) {
			confidence += opticalFlow.magnitude > this.opticalFlowThreshold ? 0.3 : 0;
			factors++;
		}
		if (rppg?.confidence !== undefined) {
			confidence += rppg.confidence * 0.2;
			factors++;
		}
		if (handPosition !== undefined) {
			confidence += handPosition < 0.3 ? 0.1 : 0;
			factors++;
		}

		const finalConfidence = factors > 0 ? confidence : 0;
		if (finalConfidence > 0.5) this.lastDetectionTime = now;

		return {
			exhaling: finalConfidence > 0.5,
			confidence: finalConfidence,
		};
	}

	reset() {
		this.lastDetectionTime = 0;
	}
}
