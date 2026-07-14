export class MovingAverage {
	constructor(windowSize) {
		this.windowSize = windowSize || 5;
		this.buffer = [];
	}

	add(value) {
		this.buffer.push(value);
		if (this.buffer.length > this.windowSize) {
			this.buffer.shift();
		}
	}

	get() {
		if (this.buffer.length === 0) return 0;
		return this.buffer.reduce((a, b) => a + b, 0) / this.buffer.length;
	}

	reset() {
		this.buffer = [];
	}
}

export class BandpassFilter {
	constructor(lowCut, highCut, sampleRate) {
		this.lowCut = lowCut || 0.1;
		this.highCut = highCut || 0.5;
		this.sampleRate = sampleRate || 30;
		this.buffer = [];
		this.maxBuffer = 300;
	}

	process(sample) {
		this.buffer.push(sample);
		if (this.buffer.length > this.maxBuffer) {
			this.buffer.shift();
		}
		return this.butterworthFilter(sample);
	}

	butterworthFilter(sample) {
		// Simple moving average as placeholder for proper bandpass
		if (this.buffer.length < 3) return sample;
		const recent = this.buffer.slice(-5);
		return recent.reduce((a, b) => a + b, 0) / recent.length;
	}

	reset() {
		this.buffer = [];
	}
}

export class ExponentialSmoothing {
	constructor(alpha) {
		this.alpha = alpha || 0.3;
		this.value = null;
	}

	process(sample) {
		if (this.value === null) {
			this.value = sample;
		} else {
			this.value = this.alpha * sample + (1 - this.alpha) * this.value;
		}
		return this.value;
	}

	reset() {
		this.value = null;
	}
}
