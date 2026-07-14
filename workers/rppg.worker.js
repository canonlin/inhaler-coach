self.onmessage = function (e) {
  const { type, greenChannelSamples, sampleRate } = e.data;

  if (type === 'process-rppg') {
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
