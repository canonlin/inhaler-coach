import { useMemo } from "react";
import { AISection } from "../components/stage/AISection";
import { StageTopBar } from "../components/stage/StageTopBar";
import { VideoSection } from "../components/stage/VideoSection";
import type { CoachingReturn } from "../hooks/useCoaching";
import { getStageConfig } from "../services/detection-singletons";

type StageScreenProps = CoachingReturn;

export function StageScreen(props: StageScreenProps) {
	const {
		stageIdx,
		overlay,
		showVideo,
		tryBtnText,
		stagePassed,
		showPharmacist,
		showRetry,
		showNext,
		nextBtnText,
		statusText,
		canvasRef,
		videoContainerRef,
		videoEmbedUrl,
		isVideoLoading,
		isVideoEnded,
		finishLoading,
		replayVideo,
		startAIPhase,
		retryStage,
		pharmacistConfirm,
		nextStage,
		backToVideo,
	} = props;

	const s = useMemo(() => {
		const cfg = getStageConfig(stageIdx);

		const topbarLeft = cfg.badge === "BONUS" ? "0" : "left-[120px]";
		const topbarText =
			cfg.badge === "BONUS"
				? "恭喜！您已完成吸入器正確操作的所有階段！"
				: stageIdx === 0
					? ""
					: `第 ${stageIdx} / 4 關：${cfg.name}`;

		const headerVisible = stageIdx === 0 || cfg.badge === "BONUS";
		const badgeClass =
			cfg.badge === "BONUS"
				? "bg-amber-400 text-black font-mono font-bold px-2 py-0.5 rounded text-sm inline-block"
				: "text-text-secondary/60 text-sm font-mono inline-block";

		const titleClass =
			cfg.badge === "BONUS"
				? "text-3xl font-black text-amber-300 sm:text-4xl"
				: "text-2xl font-black text-white/90 sm:text-3xl";

		return {
			topbarLeft,
			topbarText,
			headerVisible,
			badgeClass,
			titleClass,
			badge: cfg.badge,
			title: cfg.name,
			hint: cfg.hint ?? "",
			videoLabel: cfg.badge === "BONUS" ? "" : "衛教展示影片",
		};
	}, [stageIdx]);

	return (
		<div className="fixed inset-0 z-50">
			<StageTopBar text={s.topbarText} leftClass={s.topbarLeft} />

			<div className="relative w-full h-screen bg-black flex items-center justify-center overflow-hidden">
				{showVideo ? (
					<VideoSection
						videoContainerRef={videoContainerRef}
						videoEmbedUrl={videoEmbedUrl}
						isVideoLoading={isVideoLoading}
						isVideoEnded={isVideoEnded}
						onIframeLoad={finishLoading}
						badge={s.badge}
						badgeClass={s.badgeClass}
						title={s.title}
						titleClass={s.titleClass}
						headerVisible={s.headerVisible}
						hint={s.hint}
						videoLabel={s.videoLabel}
						tryBtnText={tryBtnText}
						statusText={statusText}
						stagePassed={stagePassed}
						showNext={showNext}
						nextBtnText={nextBtnText}
						onStartAI={startAIPhase}
						onReplayVideo={replayVideo}
						onNext={nextStage}
					/>
				) : (
					<AISection
						canvasRef={canvasRef}
						overlay={overlay}
						aiLabel={s.badge}
						statusText={statusText}
						stagePassed={stagePassed}
						showPharmacist={showPharmacist}
						showRetry={showRetry}
						showNext={showNext}
						nextBtnText={nextBtnText}
						onBackToVideo={backToVideo}
						onPharmacist={pharmacistConfirm}
						onRetry={retryStage}
						onNext={nextStage}
					/>
				)}
			</div>
		</div>
	);
}
