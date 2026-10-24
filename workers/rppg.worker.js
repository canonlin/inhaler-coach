self.onmessage = (e) => {
	// 會收到 { type, greenChannelSamples, sampleRate }；Phase 2 才會用到後面兩個
	const { type } = e.data;

	if (type === "process-rppg") {
		// Phase 2: rPPG signal processing
		// - Bandpass filter (0.1-0.5 Hz for breathing rate)
		// - Extract RSA (respiratory sinus arrhythmia) component
		// - Return breathing confidence signal
		const result = {
			filteredSignal: [],
			breathingRate: 0,
			confidence: 0,
		};
		self.postMessage(result);
	}
};
