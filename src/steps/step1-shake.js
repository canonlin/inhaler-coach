export class ShakeDetector {
	constructor() {
		this.minAmplitude = 10;
		this.minZeroCrossings = 4;
		this.windowMs = 2000;
		this.yHistory = [];
	}

	update(wristY, timestamp) {
		this.yHistory.push({ y: wristY, t: timestamp });
		const cutoff = timestamp - this.windowMs;
		this.yHistory = this.yHistory.filter((p) => p.t > cutoff);
	}

	detect() {
		if (this.yHistory.length < 10) return { shaking: false, confidence: 0 };
		const ys = this.yHistory.map((p) => p.y);
		const amplitude = Math.max(...ys) - Math.min(...ys);
		let zeroCrossings = 0;
		for (let i = 1; i < ys.length; i++) {
			if (ys[i] - ys[i - 1] > 0 !== ys[i - 1] - ys[i - 2] > 0) {
				zeroCrossings++;
			}
		}
		const confidence = Math.min(1, amplitude / (this.minAmplitude * 2));
		return {
			shaking:
				amplitude >= this.minAmplitude &&
				zeroCrossings >= this.minZeroCrossings,
			confidence,
		};
	}

	reset() {
		this.yHistory = [];
	}
}
