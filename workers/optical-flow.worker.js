self.onmessage = (e) => {
	// 會收到 { type, frameData, roi }；Phase 2 才會用到後面兩個
	const { type } = e.data;

	if (type === "compute-flow") {
		// Phase 2: Farnebäck dense optical flow computation
		// Will receive raw frame data and ROI coordinates
		// Returns mean flow vector within ROI
		const result = {
			meanFlowX: 0,
			meanFlowY: 0,
			magnitude: 0,
			confidence: 0,
		};
		self.postMessage(result);
	}
};
