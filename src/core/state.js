export const state = {
	currentStage: 0,
	singleMode: false,
	webcamVideo: null,
	webcamCanvas: null,
	stream: null,
	isRunning: false,
	passTimer: 0,
	passTimestamp: 0,
	holdCountdown: 0,
	holdInterval: null,
	phase: "video",
	stagePassed: false,
	patientId: "",
	stageAttempts: {},
	stageAIConfidence: {},
	stagePharmacist: {},
	lastAIConfidence: 0,
	sessionDataSent: false,
};

export function resetStageTracking() {
	state.stagePassed = false;
	state.passTimestamp = 0;
	state.passTimer = 0;
	state.holdCountdown = 0;
	if (state.holdInterval) {
		clearInterval(state.holdInterval);
		state.holdInterval = null;
	}
}

export function resetSessionData() {
	state.sessionDataSent = false;
	state.stageAttempts = {};
	state.stageAIConfidence = {};
	state.stagePharmacist = {};
	state.lastAIConfidence = 0;
	for (let i = 1; i <= 4; i++) {
		state.stageAttempts[i] = 0;
		state.stageAIConfidence[i] = 0;
		state.stagePharmacist[i] = "not_recorded";
	}
}

export function getPatientIdFromURL() {
	return new URLSearchParams(window.location.search).get("id") || "";
}
