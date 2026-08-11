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

/**
 * Jump straight into a stage: ?stage=1 .. ?stage=4. Used for testing, so a
 * refresh doesn't mean sitting through the intro video again.
 * @returns {number|null}
 */
export function getStageFromURL() {
	const raw = new URLSearchParams(window.location.search).get("stage");
	if (raw === null) return null;
	const idx = Number.parseInt(raw, 10);
	return Number.isInteger(idx) && idx >= 1 && idx <= 4 ? idx : null;
}

// --- Session persistence -----------------------------------------------
// Keeps the measurement data (attempts, AI confidence, pharmacist calls) across
// a refresh so a reload mid-session doesn't silently lose what has been logged.
// It deliberately does NOT restore navigation — where you land is decided by the
// URL alone (?stage=N), never by leftover storage. Cleared when the tab closes,
// on restart, on finish, and whenever the URL carries ?reset=1.

const STORAGE_KEY = "inhaler-coach:session";

/** Fields worth carrying across a refresh — no DOM nodes, no MediaStreams. */
const PERSISTED_FIELDS = [
	"patientId",
	"stageAttempts",
	"stageAIConfidence",
	"stagePharmacist",
	"sessionDataSent",
];

export function persistState() {
	const snapshot = {};
	for (const key of PERSISTED_FIELDS) {
		snapshot[key] = state[key];
	}
	try {
		sessionStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
	} catch (e) {
		console.warn("Failed to persist session state:", e.message);
	}
}

/** Reapplies the logged session data onto `state`. Never touches navigation. */
export function restorePersistedState() {
	if (new URLSearchParams(window.location.search).get("reset") === "1") {
		clearPersistedState();
		return;
	}

	let snapshot;
	try {
		const raw = sessionStorage.getItem(STORAGE_KEY);
		if (!raw) return;
		snapshot = JSON.parse(raw);
	} catch (e) {
		console.warn("Failed to restore session state:", e.message);
		clearPersistedState();
		return;
	}

	if (!snapshot) return;
	for (const key of PERSISTED_FIELDS) {
		if (snapshot[key] !== undefined) state[key] = snapshot[key];
	}
}

export function clearPersistedState() {
	try {
		sessionStorage.removeItem(STORAGE_KEY);
	} catch {
		// storage unavailable (private mode) — nothing to clear
	}
}
