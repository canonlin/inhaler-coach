import { STAGES } from "../config/stages.js";
import { DetectionManager } from "../detection/detection-manager.js";
import { extractFaceFeatures } from "../detection/face-features.js";
import { extractHandFeatures } from "../detection/hand-features.js";
import { extractPoseFeatures } from "../detection/pose-features.js";
import { ShakeDetector } from "../steps/step1-shake.js";
import { RinseDetector } from "../steps/step4-rinse.js";
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
	getPatientIdFromURL,
	resetSessionData,
	resetStageTracking,
	state,
} from "./state.js";
import { startWebcam, stopWebcam } from "./webcam.js";

const $ = (id) => document.getElementById(id);

const detection = new DetectionManager();
const shakeDetector = new ShakeDetector();
const rinseDetector = new RinseDetector();

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

	showScreen("screen-intro");
	initDetection();
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
	if (detection.isInitialized) return;
	setModelLabel("⏳ 載入偵測模型...");
	try {
		await detection.initialize();
		const name = detection.getBackendName();
		setModelLabel(`✅ ${name === "mediapipe" ? "MediaPipe" : "TF.js"} 就緒`);
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

	showPharmacistBtn();
	showRetryBtn();

	if (!detection.isInitialized) {
		await initDetection();
	}

	shakeDetector.reset();
	rinseDetector.reset();

	try {
		await startWebcam();
		predictionLoop();
	} catch (_e) {
		setStatusFail("❌ 無法啟動攝影機，請確認瀏覽器權限");
	}
}

function predictionLoop() {
	if (!state.isRunning || state.stagePassed) return;

	const canvas = $("webcam-canvas");
	const ctx = canvas.getContext("2d");
	const video = state.webcamVideo;

	if (video && video.readyState >= 2) {
		ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
	}

	const timestamp = performance.now();

	try {
		const results = detection.processFrame(canvas, timestamp);

		drawPoseLandmarks(ctx, results.pose);
		drawFaceLandmarks(ctx, results.face);
		drawHandLandmarks(ctx, results.hands);

		const poseFeatures = extractPoseFeatures(results.pose);
		const faceFeatures = extractFaceFeatures(results.face);
		const handFeatures = extractHandFeatures(results.hands, poseFeatures?.nose);

		updateFeatureDisplay(poseFeatures, faceFeatures, handFeatures);

		const stage = STAGES[state.currentStage];
		const now = Date.now();

		if (stage.specialMode === "shake") {
			evaluateShakeStep(poseFeatures, stage, now);
		} else if (stage.id === 4) {
			evaluateRinseStep(poseFeatures, stage, now);
		} else {
			evaluateGenericStep(poseFeatures, faceFeatures, handFeatures, stage, now);
		}
	} catch (e) {
		console.error("Detection error:", e);
	}

	requestAnimationFrame(predictionLoop);
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

function evaluateShakeStep(poseFeatures, stage, now) {
	if (!poseFeatures?.dominantWrist) {
		setOverlay("none");
		setStatusDetecting("🤖 請搖動手臂...");
		return;
	}

	shakeDetector.update(poseFeatures.dominantWrist.y, now);
	const result = shakeDetector.detect();
	state.lastAIConfidence = Math.round(result.confidence * 100);

	if (result.shaking) {
		if (state.passTimestamp === 0) state.passTimestamp = now;
		const elapsed = (now - state.passTimestamp) / 1000;
		const remaining = Math.max(0, stage.passSeconds - elapsed).toFixed(1);
		setOverlay("correct");
		setStatusDetecting(`✅ 振搖正確！維持 ${remaining} 秒...`);
		if (elapsed >= stage.passSeconds) waitForPharmacist();
	} else {
		state.passTimestamp = 0;
		setOverlay("wrong");
		setStatusFail(
			`❌ 請持續搖勻吸入器（信心 ${Math.round(result.confidence * 100)}%）`,
		);
	}
}

function evaluateRinseStep(poseFeatures, stage, now) {
	const result = rinseDetector.detect({ poseFeatures });
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
		setStatusFail(
			`❌ 請靠近水杯漱口（信心 ${Math.round(result.confidence * 100)}%）`,
		);
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

function _startHoldCountdown() {
	if (state.holdCountdown > 0) return;
	state.isRunning = false;
	state.holdCountdown = 3;

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

function waitForPharmacist() {
	state.isRunning = false;
	stopWebcam();
	setStatusDetecting("✅ AI判讀通過！請藥師確認");
	setOverlay("correct");
	showPharmacistBtn();
	showRetryBtn();
}

function pharmacistConfirm() {
	const idx = state.currentStage;
	state.stagePharmacist[idx] = "pass";
	state.stageAIConfidence[idx] = state.lastAIConfidence;
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
	rinseDetector.reset();

	setTimeout(async () => {
		try {
			await startWebcam();
			predictionLoop();
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
	hideSideProgress();
	setTopbarVisible(false);
	showScreen("screen-success");
}
