import { useCallback, useEffect, useRef, useState } from "react";
import { getStageConfig, singletons } from "../services/detection-singletons";
import { useDetectionLoop } from "./useDetectionLoop";
import { useStageNavigation } from "./useStageNavigation";
import { useWebcamStream } from "./useWebcamStream";
import { useYouTubePlayer } from "./useYouTubePlayer";

export type ModelState = "idle" | "loading" | "ready" | "error";
 
const MODEL_LOAD_TIMEOUT_MS = 60_000;
const CAMERA_START_TIMEOUT_MS = 15_000;

function withTimeout<T>(
	promise: Promise<T>,
	milliseconds: number,
	message: string,
): Promise<T> {
	return new Promise((resolve, reject) => {
		const timer = window.setTimeout(
			() => reject(new Error(message)),
			milliseconds,
		);
		promise.then(
			(value) => {
				window.clearTimeout(timer);
				resolve(value);
			},
			(error) => {
				window.clearTimeout(timer);
				reject(error);
			},
		);
	});
}

function loadDetectionModels() {
	return withTimeout(
		Promise.all([
			singletons.detection.initialize(),
			singletons.inhalerDetector.load(),
		]),
		MODEL_LOAD_TIMEOUT_MS,
		"model loading timed out",
	);
}

export function useCoaching() {
	const nav = useStageNavigation();
	const webcam = useWebcamStream();

	const [statusText, setStatusText] = useState("");
	const [overlay, setOverlay] = useState<"none" | "correct" | "wrong">("none");
	const [modelState, setModelState] = useState<ModelState>("idle");

	const stageConfig = getStageConfig(nav.stageIdx);
	const showVideo = nav.phase === "video";

	const handleStatusChange = useCallback(
		(newStatusText: string, newOverlay: "none" | "correct" | "wrong") => {
			setStatusText(newStatusText);
			setOverlay(newOverlay);
		},
		[],
	);

	const detLoop = useDetectionLoop({
		canvasRef: webcam.canvasRef,
		onStatusChange: handleStatusChange,
	});

	const handleVideoEnd = useCallback(() => {
		nav.setStagePassed(true);
	}, [nav]);

	const yt = useYouTubePlayer({
		videoURL: stageConfig.videoURL,
		showVideo,
		onVideoEnd: handleVideoEnd,
	});

	// Preload detection models while video is playing
	const preloaded = useRef(false);
	useEffect(() => {
		if (nav.phase === "video" && !preloaded.current) {
			preloaded.current = true;
			console.log("[preload] Starting model preload during video...");
			loadDetectionModels()
				.then(() => {
					console.log("[preload] Models ready");
				})
				.catch((err) => {
					console.warn("[preload] Preload failed:", err);
					preloaded.current = false;
				});
		}
	}, [nav.phase]);

	const handleReplayVideo = useCallback(() => {
		nav.setStagePassed(false);
		yt.replayVideo();
	}, [nav, yt]);

	const startAIPhase = useCallback(async () => {
		// Starting again while an async frame is still resolving would otherwise
		// leave two detection loops and two camera streams alive.
		detLoop.stopLoop();
		webcam.stopTracks();
		nav.startAIPhase();
		setModelState("loading");
		setStatusText("");
		setOverlay("none");

		let ok = false;
		try {
			ok = await withTimeout(
				webcam.startStream(),
				CAMERA_START_TIMEOUT_MS,
				"camera permission timed out",
			);
		} catch (error) {
			console.error("Camera start timed out:", error);
			webcam.stopTracks();
			setModelState("error");
			setStatusText("等待攝影機權限逾時，請確認瀏覽器權限後再試一次。");
			return;
		}
		if (ok) {
			try {
				await loadDetectionModels();
			} catch (err) {
				console.error("Detection init failed:", err);
				webcam.stopTracks();
				setModelState("error");
				setStatusText("AI 模型載入失敗，請確認網路後再試一次。");
				return;
			}
			setModelState("ready");
			setStatusText("即時 AI 辨識中...");
			detLoop.startLoop(nav.stageIdx, () => nav.setStagePassed(true));
		} else {
			setModelState("error");
			setStatusText("無法啟動攝影機，請確認鏡頭權限與硬體連線。");
		}
	}, [nav, webcam, detLoop]);

	const backToVideo = useCallback(() => {
		detLoop.stopLoop();
		webcam.stopTracks();
		nav.backToVideo();
		setModelState("idle");
		setStatusText("");
		setOverlay("none");
	}, [detLoop, webcam, nav]);

	const pharmacistConfirm = useCallback(() => {
		detLoop.stopLoop();
		webcam.stopTracks();
		nav.nextStage();
		setModelState("idle");
		setStatusText("");
		setOverlay("none");
	}, [detLoop, webcam, nav]);

	const nextStage = useCallback(() => {
		detLoop.stopLoop();
		webcam.stopTracks();
		nav.nextStage();
		setModelState("idle");
		setStatusText("");
		setOverlay("none");
	}, [detLoop, webcam, nav]);

	const tryBtnText =
		nav.phase === "video" && nav.stageIdx > 0 ? "開始 AI 動作練習" : "";

	const showPharmacist = nav.stageIdx > 0;
	const showRetry = nav.stagePassed && nav.phase === "ai";
	const showNext = nav.stagePassed && nav.stageIdx === 0;
	const nextBtnText = nav.stageIdx === 0 ? "開始闖關" : "進入下一關";

	useEffect(() => {
		if (nav.screen !== "stage") {
			detLoop.stopLoop();
			webcam.stopTracks();
		}
	}, [nav.screen, detLoop, webcam]);

	return {
		screen: nav.screen,
		stageIdx: nav.stageIdx,
		phase: nav.phase,
		stagePassed: nav.stagePassed,
		stage: stageConfig,
		statusText,
		overlay,
		showVideo,
		modelState,
		modelReady: modelState === "ready",
		tryBtnText,
		showPharmacist,
		showRetry,
		showNext,
		nextBtnText,
		canvasRef: webcam.canvasRef,
		setContainerRef: yt.setContainerRef,
		isVideoLoading: yt.isVideoLoading,
		isVideoEnded: yt.isVideoEnded,
		videoError: yt.videoError,
		replayVideo: handleReplayVideo,
		finishIntro: nav.finishIntro,
		loadStage: nav.loadStage,
		restartGame: nav.restartGame,
		nextStage,
		backToVideo,
		startAIPhase,
		retryStage: startAIPhase,
		pharmacistConfirm,
	};
}

export type CoachingReturn = ReturnType<typeof useCoaching>;
