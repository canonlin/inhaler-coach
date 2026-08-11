import { STAGES } from "../config/stages.js";
import { ActuationDetector } from "../detection/actuation-detector.js";
import { AudioFeatures } from "../detection/audio-features.js";
import { DetectionManager } from "../detection/detection-manager.js";
import { DeviceTracker } from "../detection/device-tracker.js";
import { extractFaceFeatures } from "../detection/face-features.js";
import { extractHandFeatures } from "../detection/hand-features.js";
import {
	InhalerDetector,
	InhalerObservationTracker,
} from "../detection/inhaler-detector.js";
import { handROI, MotionEnergy } from "../detection/motion-energy.js";
import {
	extractPoseFeatures,
	resetDominantSide,
} from "../detection/pose-features.js";
import { analyzePressWindow } from "../detection/press-analyzer.js";
import { RespirationSampler } from "../detection/respiration-sampler.js";
import { ShakeDetector } from "../steps/step1-shake.js";
import { ExhaleDetector } from "../steps/step2-exhale.js";
import { PressInhaleDetector } from "../steps/step3-press-inhale.js";
import { mouthROI, RinseDetector } from "../steps/step4-rinse.js";
import {
	hideCountdown,
	hideStatus,
	setOverlay,
	setStatusDetecting,
	setStatusFail,
	setStatusSuccess,
	showCountdown,
} from "../ui/feedback.js";
import {
	drawFaceLandmarks,
	drawHandLandmarks,
	drawPoseLandmarks,
} from "../ui/overlay.js";
import {
	hideNextBtn,
	hideRetryBtn,
	resetButtons,
	setBtnTryUnlocked,
	setBtnTryVisible,
	setModelLabel,
	setStageBadge,
	setStageHeaderVisible,
	setStageHint,
	setStagePaddingLeft,
	setStageTitle,
	setTopbarLeft,
	setTopbarText,
	setTopbarVisible,
	setVideoLabel,
	showAISection,
	showNextBtn,
	showPharmacistBtn,
	showRetryBtn,
	showScreen,
	showVideoSection,
} from "../ui/screens.js";
import {
	hideSideProgress,
	initDotsAsPending,
	markDotDone,
	resetDots,
	showSideProgress,
	updateDots,
} from "../ui/side-progress.js";
import { sendSessionData } from "./data-logger.js";
import {
	clearPersistedState,
	getPatientIdFromURL,
	getStageFromURL,
	persistState,
	resetSessionData,
	resetStageTracking,
	restorePersistedState,
	state,
} from "./state.js";
import { startWebcam, stopWebcam } from "./webcam.js";

const $ = (id) => document.getElementById(id);

const detection = new DetectionManager();
const inhalerDetector = new InhalerDetector();
const inhalerObservation = new InhalerObservationTracker();
const shakeDetector = new ShakeDetector();
const rinseDetector = new RinseDetector();
const pressInhale = new PressInhaleDetector();
const exhaleDetector = new ExhaleDetector();
const motionEnergy = new MotionEnergy();
// A second, independent frame-differencer for the shake step. It runs in the
// fixed-rate motion loop (below), not the inference loop, so it needs its own
// previous-frame state — the two loops sample at different moments and would
// otherwise corrupt each other's reference frame.
const shakeMotion = new MotionEnergy();
// Mouth-region motion for the rinse step — its own differencer so its previous
// frame isn't clobbered by the hand sampler.
const rinseMotion = new MotionEnergy();
// Tracks the inhaler itself by colour (the red canister). Runs live and is
// logged alongside the other signals; it does NOT yet gate pass/fail — the press
// decision awaits a learned model trained on steady-hold clips. See
// device-tracker.js and audio-actuation memory.
const deviceTracker = new DeviceTracker();
const audio = new AudioFeatures();
const actuation = new ActuationDetector();

// The press step (Stage 3) is judged as a COMPLETED window, not continuously —
// a real-time detector floods on erratic waving (see press-analyzer.js). These
// buffers fill during the press stage; the analyzer reads the whole buffer.
let pressAudioBuf = [];
let pressDeviceBuf = [];
const isPressStage = () => STAGES[state.currentStage]?.id === 3;

// Exhale (Stage 2) breathing: chest-motion sampled live, judged as a window (see
// respiration-sampler.js). Telemetry alongside the existing model for now.
const respiration = new RespirationSampler();
const isExhaleStage = () => STAGES[state.currentStage]?.id === 2;

export function initApp() {
	state.patientId = getPatientIdFromURL();
	resetSessionData();

	if (state.patientId) {
		$("patient-id-display").textContent = `研究編號：${state.patientId}`;
	}

	$("btn-start").onclick = startGame;
	$("btn-try").onclick = startAIPhase;
	$("btn-back-video").onclick = backToVideo;
	$("btn-pharmacist").onclick = pharmacistConfirm;
	$("btn-retry").onclick = retryStage;
	$("btn-restart").onclick = restartGame;

	restorePersistedState();
	showScreen("screen-intro");
	initDetection();

	const stage = getStageFromURL();
	if (stage !== null) {
		jumpToStage(stage);
	}
}

/**
 * ?stage=N — go straight to a stage. The demo video is still there if you want
 * it, but the try button is unlocked immediately rather than gated on watching
 * it through; sitting through the video is the thing this shortcut exists to
 * skip. The camera still only starts when you click.
 */
async function jumpToStage(idx) {
	state.singleMode = false;
	state.currentStage = idx;

	showSideProgress();
	initDotsAsPending();
	showScreen("screen-stage");
	await loadStage(idx);

	setBtnTryVisible();
	setBtnTryUnlocked("📷 換我操作 →", startAIPhase);
}

function startGame() {
	state.singleMode = false;
	state.currentStage = 0;
	showSideProgress();
	initDotsAsPending();
	showScreen("screen-stage");
	loadStage(0);
}

function restartGame() {
	state.currentStage = 0;
	resetSessionData();
	clearPersistedState();
	showScreen("screen-intro");
	hideSideProgress();
	resetDots();
}

function backToVideo() {
	stopWebcam();
	state.isRunning = false;
	showVideoSection();
	hideStatus();
	$("btn-pharmacist").classList.add("hidden");
	hideNextBtn();
	hideRetryBtn();
	const stage = STAGES[state.currentStage];
	setVideoSrc(stage.videoURL);
	resetBtnTry();
}

async function loadStage(idx) {
	stopWebcam();
	resetStageTracking();
	state.phase = "video";

	const stage = STAGES[idx];
	updateDots(idx);

	if (stage.isIntro) {
		setStageHeaderVisible(false);
		hideSideProgress();
		setTopbarLeft("0");
		setStagePaddingLeft("0");
	} else {
		setStageHeaderVisible(true);
		setStageBadge(stage.badge, stage.badgeClass);
		setStageTitle(stage.name, stage.titleClass);
		showSideProgress();
		setTopbarLeft("140px");
		setStagePaddingLeft("156px");
	}

	setStageHint(stage.hint);
	setTopbarText(`${stage.badge}｜${stage.name}`);
	setTopbarVisible(true);
	showVideoSection();
	hideStatus();
	resetButtons();
	setOverlay("none");
	setModelLabel(stage.isIntro ? "開場影片" : "偵測系統就緒");

	setVideoSrc(stage.videoURL);
	setVideoLabel(
		stage.isIntro ? "🎬 整體衛教影片" : `藥師示範影片｜${stage.name}`,
	);

	persistState();

	onVideoEndCallback = () => {
		if (!state.stagePassed) {
			setBtnTryVisible();
			if (stage.isIntro) {
				setBtnTryUnlocked("✅ 影片看完，開始挑戰！", startAIPhase);
			} else {
				setBtnTryUnlocked("📷 我看完了！換我操作 →", startAIPhase);
			}
		}
	};
}

async function initDetection() {
	setModelLabel("⏳ 載入偵測模型...");
	try {
		await Promise.all([
			detection.isInitialized ? Promise.resolve() : detection.initialize(),
			inhalerDetector.load(),
		]);
		const name = detection.getBackendName();
		setModelLabel(
			`✅ ${name === "mediapipe" ? "MediaPipe" : "TF.js"}＋吸入器 YOLO 就緒`,
		);
	} catch (e) {
		console.error("Detection init error:", e);
		setModelLabel("❌ 偵測模型載入失敗");
	}
}

let ytPlayer = null;
let onVideoEndCallback = null;

function loadYouTubeAPI() {
	return new Promise((resolve) => {
		if (window.YT?.Player) {
			resolve();
			return;
		}
		const tag = document.createElement("script");
		tag.src = "https://www.youtube.com/iframe_api";
		document.head.appendChild(tag);
		window.onYouTubeIframeAPIReady = resolve;
	});
}

function extractVideoId(url) {
	const match = url?.match(/(?:embed\/|v=)([\w-]+)/);
	return match ? match[1] : null;
}

async function setVideoSrc(url) {
	const container = $("video-iframe-wrap");
	const oldIframe = $("video-iframe");
	const oldDiv = $("yt-player");
	if (oldDiv) oldDiv.remove();

	if (url?.includes("youtube")) {
		const videoId = extractVideoId(url);
		if (!videoId) {
			oldIframe.style.display = "";
			oldIframe.src = url;
			return;
		}
		await loadYouTubeAPI();
		oldIframe.style.display = "none";
		const div = document.createElement("div");
		div.id = "yt-player";
		div.style.cssText = "width:100%;height:100%;position:absolute;inset:0;";
		container.appendChild(div);
		if (ytPlayer) {
			try {
				ytPlayer.destroy();
			} catch (_) {}
			ytPlayer = null;
		}
		ytPlayer = new YT.Player("yt-player", {
			videoId,
			playerVars: { autoplay: 0, rel: 0, modestbranding: 1 },
			events: {
				onStateChange: (e) => {
					if (e.data === YT.PlayerState.ENDED && onVideoEndCallback) {
						onVideoEndCallback();
					}
				},
			},
		});
	} else {
		oldIframe.style.display = "";
		oldIframe.src = url;
	}
}

async function startAIPhase() {
	const stage = STAGES[state.currentStage];
	state.phase = "ai";

	setVideoSrc("");
	showAISection();
	setStatusDetecting("🤖 AI 偵測中，請開始操作...");

	if (stage.isIntro) {
		state.currentStage = 1;
		loadStage(1);
		return;
	}

	if (!state.stageAttempts[state.currentStage])
		state.stageAttempts[state.currentStage] = 0;
	state.stageAttempts[state.currentStage]++;
	persistState();

	showPharmacistBtn();
	showRetryBtn();

	if (!detection.isInitialized || !inhalerDetector.ready) {
		await initDetection();
	}

	shakeDetector.reset();
	shakeMotion.reset();
	deviceTracker.reset();
	inhalerObservation.reset();
	respiration.reset();
	pressAudioBuf = [];
	pressDeviceBuf = [];
	lastShakeSampleAt = 0;
	rinseDetector.reset();
	rinseMotion.reset();
	resetDominantSide();

	actuation.reset();

	try {
		const { stream } = await startWebcam();
		if (!audio.isReady) {
			await audio.initialize(stream);
		}
		// Audio runs on its own 100 Hz timer — a spray is too short to measure at
		// render-loop rate.
		audio.startSampling((sound, timestamp) => {
			if (isPressStage() && sound) {
				pressAudioBuf.push([timestamp, sound.highBand]);
			}
			if (actuation.update(sound, timestamp)) {
				console.log(`Actuation detected (total: ${actuation.count})`);
			}
		});
		predictionLoop();
		shakeMotionLoop();
		startInhalerLoop();
	} catch (_e) {
		setStatusFail("❌ 無法啟動攝影機，請確認瀏覽器權限");
	}
}

/** Run YOLO independently so object inference never stalls MediaPipe. */
const INHALER_CONFIDENCE = 0.3;
const INHALER_INTERVAL_MS = 200;
let inhalerLoopGeneration = 0;

async function startInhalerLoop() {
	const generation = ++inhalerLoopGeneration;
	while (state.isRunning && generation === inhalerLoopGeneration) {
		const startedAt = performance.now();
		const video = state.webcamVideo;
		if (inhalerDetector.ready && video?.readyState >= 2) {
			try {
				const result = await inhalerDetector.detect(
					video,
					video.videoWidth,
					video.videoHeight,
					INHALER_CONFIDENCE,
				);
				inhalerObservation.observe(result, performance.now());
			} catch (error) {
				console.error("Inhaler YOLO error:", error);
			}
		}
		const elapsed = performance.now() - startedAt;
		await new Promise((resolve) =>
			setTimeout(resolve, Math.max(0, INHALER_INTERVAL_MS - elapsed)),
		);
	}
}

/**
 * The hand model loses a fast-moving hand, and a fast-moving hand is exactly
 * what shaking looks like — measured 2026-07-15, it went blind for two full
 * seconds in the middle of a shake. Reuse the last known box for a moment
 * rather than dropping the motion signal precisely when it matters. A shaking
 * hand doesn't travel far, so a slightly stale box still frames it.
 */
const ROI_GRACE_MS = 600;
let lastROI = null;
let lastROIAt = 0;

function resolveHandROI(hands, timestamp) {
	const roi = handROI(hands);
	if (roi) {
		lastROI = roi;
		lastROIAt = timestamp;
		return roi;
	}
	if (lastROI && timestamp - lastROIAt < ROI_GRACE_MS) {
		return lastROI;
	}
	lastROI = null;
	return null;
}

/**
 * Which models a stage actually needs. On the TF.js WASM backend every model
 * blocks the main thread, so running all three when a stage only reads wrist
 * position is what freezes the page.
 */
function signalsNeededFor(stage) {
	// Shaking tracks the hand: the hand model's null-when-absent behaviour is a
	// presence gate the pose model doesn't give us.
	if (stage.specialMode === "shake")
		return { pose: true, face: false, hands: true };
	// Rinse now watches the mouth: it needs the face mesh, not the hands.
	if (stage.id === 4) return { pose: true, face: true, hands: false };
	if (stage.id === 2) return { pose: true, face: true, hands: false };
	return { pose: true, face: true, hands: true };
}

const MEASURE_MODE =
	new URLSearchParams(window.location.search).get("measure") === "1";

async function predictionLoop() {
	if (!state.isRunning || state.stagePassed) return;

	const canvas = $("webcam-canvas");
	const ctx = canvas.getContext("2d", { willReadFrequently: true });
	const video = state.webcamVideo;

	if (video && video.readyState >= 2) {
		ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
	}

	const timestamp = performance.now();

	try {
		const needs = signalsNeededFor(STAGES[state.currentStage]);
		const results = await detection.processFrame(canvas, timestamp, needs);

		// The webcam may have been torn down while inference was in flight.
		if (!state.isRunning || state.stagePassed) return;

		drawPoseLandmarks(ctx, results.pose);
		drawFaceLandmarks(ctx, results.face);
		drawHandLandmarks(ctx, results.hands);

		const poseFeatures = extractPoseFeatures(results.pose);
		const faceFeatures = extractFaceFeatures(results.face);
		const handFeatures = extractHandFeatures(results.hands, poseFeatures?.nose);

		updateFeatureDisplay(poseFeatures, faceFeatures, handFeatures);

		const stage = STAGES[state.currentStage];
		const now = Date.now();

		// Sample every frame, even without a hand: the sampler needs the previous
		// frame to difference against, and skipping the call throws that away.
		const roi = resolveHandROI(results.hands, timestamp);
		const motion = motionEnergy.sample(canvas, roi);

		// Inhaler (red canister) track — sample the raw video, not `canvas`, which
		// already has landmark overlays drawn on it. Logged for telemetry and the
		// eventual learned press model; not a pass/fail input yet.
		const video = state.webcamVideo;
		const device =
			video && video.readyState >= 2
				? deviceTracker.sample(video, roi, timestamp)
				: null;
		const detectedDevice = inhalerObservation.current(timestamp);
		if (isPressStage() && device) {
			pressDeviceBuf.push([timestamp, device.present ? device.center.y : null]);
		}
		if (isExhaleStage() && video && video.readyState >= 2) {
			respiration.sample(video, timestamp);
		}

		const sound = audio.sample();

		recordSignalSample(
			now,
			poseFeatures,
			handFeatures,
			results.hands,
			motion,
			sound,
			device,
			detectedDevice,
		);

		// ?measure=1 — record signals only. No pass/fail evaluation, so nothing
		// can trip waitForPharmacist() and kill the camera mid-recording. Used to
		// gather the data a real threshold has to be calibrated against.
		if (MEASURE_MODE) {
			// Windowed press analysis of the buffer so far — telemetry only; the
			// analyzer judges a completed step, so mid-step counts are provisional.
			const windowed =
				isPressStage() && pressAudioBuf.length > 60
					? analyzePressWindow(pressAudioBuf, pressDeviceBuf).pressCount
					: null;
			const breath =
				isExhaleStage() && respiration.buffer.length > 45
					? respiration.analyze()
					: null;
			setStatusDetecting(
				`📊 量測模式（不判定）｜已錄 ${window.__signalLog.records.length} 幀｜🔊 音訊按壓 ${actuation.count} 次${windowed !== null ? `｜🎯 視窗按壓 ${windowed}` : ""}${breath ? `｜🫁 呼吸 ${breath.detected ? `${breath.rateBpm.toFixed(0)}/分` : "未偵測"}` : ""}`,
			);
		} else if (stage.specialMode === "shake") {
			// Shake is evaluated in shakeMotionLoop() at a fixed high sample rate,
			// not here — its ratio threshold is only valid when motion is sampled
			// fast enough to see instantaneous velocity, and this inference loop
			// degrades to a few fps on slow hardware. This loop's job for the shake
			// stage is just to keep the hand ROI fresh (resolveHandROI, above).
		} else if (stage.id === 2) {
			evaluateExhaleStep(detectedDevice, results.face, stage, now);
		} else if (stage.id === 3) {
			evaluatePressStep(detectedDevice, results.face, stage, now);
		} else if (stage.id === 4) {
			evaluateRinseStep(results.face, stage, now);
		} else {
			evaluateGenericStep(poseFeatures, faceFeatures, handFeatures, stage, now);
		}
	} catch (e) {
		console.error("Detection error:", e);
	}

	// Inference runs in a worker and drops frames when it falls behind, so the
	// loop can just track the display refresh.
	requestAnimationFrame(predictionLoop);
}

/**
 * The shake step's motion sampling, on its own fixed ~28 fps clock instead of
 * the inference loop. Two reasons it has to be separate:
 *
 *  - The ratio threshold (step1-shake.js) is only valid at a high sample rate.
 *    The inference loop's rate is whatever the pose/hand models can manage —
 *    a few fps on weak hardware — and at that rate a plain translation is
 *    indistinguishable from a shake. This loop pins the rate the threshold was
 *    calibrated at, regardless of how slow inference is or how fast the monitor.
 *  - It samples the raw camera frame, not #webcam-canvas, which by this point has
 *    landmark overlays drawn on it — overlays that move with the hand and would
 *    contaminate the very signal we're measuring.
 *
 * The inference loop still runs, keeping the hand ROI (lastROI) fresh.
 */
const SHAKE_SAMPLE_MS = 35; // ~28 fps — the rate RATIO_SHAKE was calibrated at.
let lastShakeSampleAt = 0;

function shakeMotionLoop() {
	if (!state.isRunning || state.stagePassed) return;
	requestAnimationFrame(shakeMotionLoop);

	if (MEASURE_MODE) return;
	if (STAGES[state.currentStage].specialMode !== "shake") return;

	const nowPerf = performance.now();
	if (nowPerf - lastShakeSampleAt < SHAKE_SAMPLE_MS) return;
	lastShakeSampleAt = nowPerf;

	const video = state.webcamVideo;
	if (!video || video.readyState < 2) return;

	const roi = lastROI && nowPerf - lastROIAt < ROI_GRACE_MS ? lastROI : null;
	const motion = shakeMotion.sample(video, roi);
	evaluateShakeStep(roi, motion, Date.now(), nowPerf);
}

// Dev-only signal trace, read from the console while testing a stage.
// window.__signalLog.label tags the samples; .records holds the raw series.
window.__signalLog = { records: [], label: "unlabelled", enabled: true };

function recordSignalSample(
	now,
	poseFeatures,
	handFeatures,
	hands,
	motion,
	sound,
	device,
	detectedDevice,
) {
	const log = window.__signalLog;
	if (!log?.enabled) return;
	log.records.push({
		// Inhaler (red canister) track: where it is, and the press-candidate dip
		// (only meaningful while `steady` is high). Recorded raw — see device-tracker.js.
		dev: device?.present
			? [
					+device.center.x.toFixed(4),
					+device.center.y.toFixed(4),
					+device.area.toFixed(4),
					+device.height.toFixed(4),
				]
			: null,
		// Authoritative YOLO observation used by the coaching decision.
		det: detectedDevice?.present
			? [
					1,
					+detectedDevice.center.x.toFixed(4),
					+detectedDevice.center.y.toFixed(4),
					+detectedDevice.score.toFixed(3),
				]
			: null,
		detSteady: detectedDevice?.present
			? +detectedDevice.steadiness.toFixed(3)
			: null,
		dip: device ? +device.dip.toFixed(4) : null,
		steady: device ? +device.steadiness.toFixed(3) : null,
		// Audio. hiHz is the 2–8 kHz band where a spray lives; flat is spectral
		// flatness, which is what tells a broadband hiss apart from a voice or a
		// television playing in the room.
		hiHz: sound ? +sound.highBand.toExponential(2) : null,
		brHz: sound ? +sound.breathBand.toExponential(2) : null,
		flat: sound ? +sound.flatness.toFixed(4) : null,
		rms: sound ? +sound.rms.toExponential(2) : null,
		// Hand-model landmarks: wrist (0) and middle-finger MCP (9). Finer spatial
		// scale than the pose wrist, and the hand model returns null rather than
		// guessing when it can't see a hand.
		handY: hands?.[0] ? +hands[0].y.toFixed(4) : null,
		handX: hands?.[0] ? +hands[0].x.toFixed(4) : null,
		handMidY: hands?.[9] ? +hands[9].y.toFixed(4) : null,
		// Pixel change inside the hand ROI, and how far it stands above the same
		// frame's background (the sensor noise floor under these exact conditions).
		motion: +motion.hand.toFixed(2),
		bg: +motion.background.toFixed(2),
		ratio: +motion.ratio.toFixed(2),
		t: now,
		label: log.label,
		wristY: poseFeatures ? +poseFeatures.dominantWrist.y.toFixed(4) : null,
		wristX: poseFeatures ? +poseFeatures.dominantWrist.x.toFixed(4) : null,
		wristScore: poseFeatures?.dominantWrist.score ?? null,
		lY: poseFeatures ? +poseFeatures.leftWrist.y.toFixed(4) : null,
		lScore: poseFeatures?.leftWrist.score ?? null,
		rY: poseFeatures ? +poseFeatures.rightWrist.y.toFixed(4) : null,
		rScore: poseFeatures?.rightWrist.score ?? null,
		elbow: poseFeatures ? Math.round(poseFeatures.elbowAngle) : null,
		handSeen: !!handFeatures,
		grip: handFeatures?.gripPosture ?? null,
		pressing: handFeatures?.isPressing ?? null,
		conf: state.lastAIConfidence,
	});
	if (log.records.length > 3000) log.records.shift();
}

function updateFeatureDisplay(poseFeatures, faceFeatures, handFeatures) {
	const items = [];
	if (poseFeatures) {
		items.push(
			`手臉距離: ${poseFeatures.handFaceDistance.toFixed(2)}`,
			`手肘角度: ${poseFeatures.elbowAngle.toFixed(0)}°`,
		);
	}
	if (faceFeatures) {
		items.push(
			`MAR: ${faceFeatures.mar.toFixed(2)}`,
			`唇密封: ${faceFeatures.lipSealed ? "是" : "否"}`,
		);
	}
	if (handFeatures) {
		items.push(
			`握持: ${handFeatures.gripPosture}`,
			`按壓: ${handFeatures.isPressing ? "是" : "否"}`,
		);
	}
	if (items.length === 0) {
		items.push("偵測中...");
	}
	$("ai-results").innerHTML =
		`<div class="text-sm text-text-secondary font-mono leading-relaxed">${items.join("  ·  ")}</div>`;
}

function evaluateShakeStep(roi, motion, now, nowPerf) {
	if (!roi) {
		setOverlay("none");
		setStatusDetecting("🤖 請把拿著吸入器的手抬到鏡頭前...");
		shakeDetector.reset();
		return;
	}
	// Motion alone can be produced by an empty hand.  Require at least one recent
	// high-precision YOLO hit, but tolerate a longer gap during vigorous shaking
	// because motion blur is worst precisely when the action is correct.
	if (!inhalerObservation.seenRecently(nowPerf, 2500)) {
		setOverlay("none");
		setStatusDetecting("🤖 請讓鏡頭先看到手上的吸入器，再開始上下搖...");
		shakeDetector.reset();
		return;
	}

	shakeDetector.update(motion, now);
	const result = shakeDetector.detect(now);
	if (MEASURE_MODE) {
		console.log(
			`shake: ratio=${result.ratio.toFixed(1)} (≥40) shaking=${result.shaking} held=${result.secondsHeld.toFixed(1)}s`,
		);
	}
	state.lastAIConfidence = Math.round(
		Math.min(1, result.sustainedMs / (result.requiredSeconds * 1000)) * 100,
	);

	if (result.passed) {
		setOverlay("correct");
		setStatusDetecting(`✅ 搖勻完成（${result.requiredSeconds} 秒）！`);
		waitForPharmacist();
		return;
	}

	if (result.shaking) {
		const left = (result.requiredSeconds - result.secondsHeld).toFixed(1);
		setOverlay("correct");
		setStatusDetecting(`✅ 正在搖勻…還要 ${left} 秒`);
		return;
	}

	setOverlay("wrong");
	setStatusFail("❌ 請上下搖動吸入器，持續 5 秒");
}

/** Mouth centre from the face mesh (midpoint of the inner lips). */
function mouthCenter(faceLandmarks) {
	if (!faceLandmarks || faceLandmarks.length < 468) return null;
	const u = faceLandmarks[13];
	const l = faceLandmarks[14];
	if (!u || !l) return null;
	return { x: (u.x + l.x) / 2, y: (u.y + l.y) / 2 };
}

/**
 * Exhale, judged by the inhaler being lowered AWAY from the mouth (see
 * step2-exhale.js): the clinical instruction is to breathe out fully before
 * raising the inhaler, and on the pharmacist's own labels the canister's
 * distance from the mouth separated correct from incorrect where breath motion
 * could not. The chest-motion respiration sampler still runs (telemetry).
 */
function evaluateExhaleStep(device, faceLandmarks, stage, now) {
	const result = exhaleDetector.detect({
		device,
		mouthPoint: mouthCenter(faceLandmarks),
	});
	state.lastAIConfidence = Math.round(result.confidence * 100);

	if (!result.ready) {
		state.passTimestamp = 0;
		setOverlay("none");
		setStatusDetecting("🤖 請讓鏡頭同時看到臉部與吸入器...");
	} else if (result.exhaling) {
		if (state.passTimestamp === 0) state.passTimestamp = now;
		const elapsed = (now - state.passTimestamp) / 1000;
		const remaining = Math.max(0, stage.passSeconds - elapsed).toFixed(1);
		setOverlay("correct");
		setStatusDetecting(`✅ 吸入器移開，慢慢把氣吐乾淨…維持 ${remaining} 秒`);
		if (elapsed >= stage.passSeconds) waitForPharmacist();
	} else {
		state.passTimestamp = 0;
		setOverlay("wrong");
		setStatusFail("❌ 先把吸入器移開嘴巴，把氣吐出來後再壓");
	}
}

/**
 * Press + inhale, judged by the inhaler's posture (see step3-press-inhale.js):
 * canister present, at the mouth, and held steady — then hold for the clinical
 * breath-hold duration. Replaces the old no-op stub that never passed.
 */
function evaluatePressStep(device, faceLandmarks, stage, now) {
	const result = pressInhale.detect({
		device,
		mouthPoint: mouthCenter(faceLandmarks),
	});
	state.lastAIConfidence = Math.round(result.confidence * 100);

	if (result.pressing) {
		if (state.passTimestamp === 0) state.passTimestamp = now;
		const need = stage.holdSeconds ?? stage.passSeconds ?? 5;
		const elapsed = (now - state.passTimestamp) / 1000;
		const remaining = Math.max(0, need - elapsed).toFixed(1);
		setOverlay("correct");
		setStatusDetecting(`✅ 對準嘴巴、拿穩了！按壓吸氣後憋氣 ${remaining} 秒…`);
		if (elapsed >= need) waitForPharmacist();
	} else {
		state.passTimestamp = 0;
		setOverlay("wrong");
		const hint = !result.present
			? "請把吸入器拿到鏡頭前"
			: !result.atMouth
				? "請把吸入器對準嘴巴"
				: "請拿穩不要晃動";
		setStatusFail(`❌ ${hint}`);
	}
}

function evaluateRinseStep(faceLandmarks, stage, now) {
	const roi = mouthROI(faceLandmarks);
	if (!roi || !state.webcamVideo || state.webcamVideo.readyState < 2) {
		state.passTimestamp = 0;
		setOverlay("none");
		setStatusDetecting("🤖 請靠近鏡頭，讓系統看到嘴巴…");
		rinseDetector.reset();
		return;
	}

	// Mouth-region motion vs background, from the raw video (not the landmark-
	// drawn canvas, whose overlays sit right on the mouth we're measuring).
	const motion = rinseMotion.sample(state.webcamVideo, roi);
	rinseDetector.update(motion.ratio, now);
	const result = rinseDetector.detect();
	state.lastAIConfidence = Math.round(result.confidence * 100);

	if (result.rinsing) {
		if (state.passTimestamp === 0) state.passTimestamp = now;
		const elapsed = (now - state.passTimestamp) / 1000;
		const remaining = Math.max(0, stage.passSeconds - elapsed).toFixed(1);
		setOverlay("correct");
		setStatusDetecting(`✅ 漱口偵測中！維持 ${remaining} 秒...`);
		if (elapsed >= stage.passSeconds) waitForPharmacist();
	} else {
		state.passTimestamp = 0;
		setOverlay("wrong");
		setStatusFail("❌ 請含水漱口，讓臉頰動起來");
	}
}

function evaluateGenericStep(
	poseFeatures,
	faceFeatures,
	handFeatures,
	_stage,
	_now,
) {
	const hasAny = poseFeatures || faceFeatures || handFeatures;
	const confidence = hasAny ? 0.5 : 0;
	state.lastAIConfidence = Math.round(confidence * 100);

	setOverlay("none");
	setStatusDetecting("🤖 偵測中...");
}

/**
 * Breath-hold countdown.
 *
 * 「吸氣完畢後自口中移去吸入器，閉緊雙唇，接著盡可能地閉氣，越久越好
 *   （或閉氣 5-10 秒）」— 台灣胸腔暨重症加護醫學會, p.5.
 *
 * The original counted 3 seconds while its own on-screen copy told the patient
 * to hold for 5 — the system was releasing them below the clinical minimum.
 */
function _startHoldCountdown() {
	if (state.holdCountdown > 0) return;
	state.isRunning = false;
	state.holdCountdown = STAGES[state.currentStage].holdSeconds ?? 5;

	showCountdown(state.holdCountdown);
	setStatusDetecting("憋氣中...");

	state.holdInterval = setInterval(() => {
		state.holdCountdown--;
		if (state.holdCountdown <= 0) {
			clearInterval(state.holdInterval);
			state.holdInterval = null;
			hideCountdown();
			waitForPharmacist();
		} else {
			$("countdown-display").textContent = state.holdCountdown;
		}
	}, 1000);
}

/**
 * AI has judged the step passed; a pharmacist now confirms.
 *
 * The camera deliberately keeps running. It used to be torn down here, which
 * froze the last frame on screen — and a frozen video feed is indistinguishable
 * from a crashed page. Both the pharmacist and the patient need to see that the
 * system is still alive, and during development this ambiguity sent us hunting
 * for camera bugs that didn't exist. Only the detection loop stops.
 */
function waitForPharmacist() {
	state.isRunning = false;
	audio.stopSampling();
	setStatusDetecting("✅ AI判讀通過！請藥師確認");
	setOverlay("correct");
	showPharmacistBtn();
	showRetryBtn();
	keepPreviewAlive();
}

/** Keep painting the webcam to the canvas after the detection loop stops. */
function keepPreviewAlive() {
	const canvas = $("webcam-canvas");
	const ctx = canvas.getContext("2d", { willReadFrequently: true });

	const paint = () => {
		const video = state.webcamVideo;
		if (!video || state.isRunning) return; // torn down, or detection resumed
		if (video.readyState >= 2) {
			ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
		}
		requestAnimationFrame(paint);
	};
	requestAnimationFrame(paint);
}

function pharmacistConfirm() {
	const idx = state.currentStage;
	state.stagePharmacist[idx] = "pass";
	state.stageAIConfidence[idx] = state.lastAIConfidence;
	persistState();
	passStage();
}

function passStage() {
	state.stagePassed = true;
	stopWebcam();
	setOverlay("correct");
	hideCountdown();

	const isLast = state.currentStage >= STAGES.length - 1;
	setStatusSuccess(
		isLast ? "🎉 完美！即將播放劑量說明影片！" : "🎉 太棒了！進入下一關！",
	);

	$("btn-pharmacist").classList.add("hidden");
	hideRetryBtn();

	if (state.singleMode) {
		showNextBtn("🏠 返回首頁", () => {
			stopWebcam();
			hideSideProgress();
			showScreen("screen-intro");
		});
	} else {
		showNextBtn(
			isLast ? "▶ 觀看劑量說明影片" : "很棒！進入下一關 →",
			isLast ? showBonusVideo : nextStage,
		);
	}

	markDotDone(state.currentStage);
}

function retryStage() {
	resetStageTracking();
	setOverlay("none");
	setStatusDetecting("🤖 AI 偵測中，請開始操作...");
	hideNextBtn();

	stopWebcam();
	shakeDetector.reset();
	inhalerObservation.reset();
	rinseDetector.reset();
	rinseMotion.reset();
	resetDominantSide();

	setTimeout(async () => {
		try {
			await startWebcam();
			predictionLoop();
			shakeMotionLoop();
			startInhalerLoop();
		} catch (_e) {
			setStatusFail("❌ 無法啟動攝影機，請確認瀏覽器權限");
		}
	}, 300);
}

function nextStage() {
	state.currentStage++;
	if (state.currentStage >= STAGES.length) {
		showBonusVideo();
	} else {
		loadStage(state.currentStage);
	}
}

function showBonusVideo() {
	stopWebcam();
	setVideoSrc(
		"https://www.youtube.com/embed/vBqLgDQlkkQ?rel=0&modestbranding=1",
	);
	setVideoLabel("💊 藥品劑量說明影片");
	setTopbarText("💊 藥品劑量說明");
	showVideoSection();
	setStageHint("請觀看藥品劑量說明，了解正確用藥劑量");
	setStatusDetecting("📺 請觀看劑量說明影片...");

	onVideoEndCallback = () => {
		setBtnTryVisible();
		setBtnTryUnlocked("✅ 看完了，學習完成！", showSuccessScreen);
	};

	resetBtnTry();
}

function showSuccessScreen() {
	stopWebcam();
	sendSessionData();
	clearPersistedState();
	hideSideProgress();
	setTopbarVisible(false);
	showScreen("screen-success");
}
