import { useCallback, useEffect, useRef, useState } from "react";
import { getStageConfig, singletons } from "../services/detection-singletons";
import { useDetectionLoop } from "./useDetectionLoop";
import { useStageNavigation } from "./useStageNavigation";
import { useWebcamStream } from "./useWebcamStream";
import { useYouTubePlayer } from "./useYouTubePlayer";

export function useCoaching() {
	const nav = useStageNavigation();
	const webcam = useWebcamStream();

	const [statusText, setStatusText] = useState("");
	const [overlay, setOverlay] = useState<"none" | "correct" | "wrong">("none");
	const [modelReady, setModelReady] = useState(false);

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
			Promise.all([
				singletons.detection.initialize(),
				singletons.inhalerDetector.load(),
			]).then(() => {
				console.log("[preload] Models ready");
			}).catch((err) => {
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
		nav.startAIPhase();
		setOverlay("none");

		const ok = await webcam.startStream();
		if (ok) {
			// Only show loading message if models aren't already loaded
			if (!singletons.detection.isInitialized || !singletons.inhalerDetector.ready) {
				setModelReady(false);
				setStatusText("AI 模型載入中...");
			}

			try {
				await Promise.all([
					singletons.detection.initialize(),
					singletons.inhalerDetector.load(),
				]);
			} catch (err) {
				console.error("Detection init failed:", err);
				setStatusText("AI 模型載入失敗，請重新整理頁面");
				return;
			}
			setModelReady(true);
			setStatusText("即時 AI 辨識中...");
			detLoop.startLoop(nav.stageIdx, () => nav.setStagePassed(true));
		} else {
			setStatusText("無法存取攝影機，請檢查硬體與授權！");
		}
	}, [nav, webcam, detLoop]);

	const backToVideo = useCallback(() => {
		detLoop.stopLoop();
		webcam.stopTracks();
		nav.backToVideo();
		setModelReady(false);
		setStatusText("");
		setOverlay("none");
	}, [detLoop, webcam, nav]);

	const pharmacistConfirm = useCallback(() => {
		detLoop.stopLoop();
		webcam.stopTracks();
		nav.nextStage();
		setModelReady(false);
		setStatusText("");
		setOverlay("none");
	}, [detLoop, webcam, nav]);

	const nextStage = useCallback(() => {
		detLoop.stopLoop();
		webcam.stopTracks();
		nav.nextStage();
		setModelReady(false);
		setStatusText("");
		setOverlay("none");
	}, [detLoop, webcam, nav]);

	const tryBtnText =
		nav.phase === "video" && nav.stageIdx > 0 ? "開始 AI 辨識練習" : "";

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
		modelReady,
		tryBtnText,
		showPharmacist,
		showRetry,
		showNext,
		nextBtnText,
		canvasRef: webcam.canvasRef,
		setContainerRef: yt.setContainerRef,
		isVideoLoading: yt.isVideoLoading,
		isVideoEnded: yt.isVideoEnded,
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
