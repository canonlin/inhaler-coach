import {
	IconArrowRight,
	IconBrain,
	IconCheck,
	IconPause,
	IconPlay,
	IconRotateCcw,
	IconVideo,
	IconVolume,
	IconVolumeX,
} from "../icons";
import { LoadingWave } from "../LoadingWave";
import { StatusBanner } from "./StatusBanner";

type VideoSectionProps = {
	setContainerRef: (node: HTMLDivElement | null) => void;
	isVideoLoading?: boolean;
	isVideoEnded?: boolean;
	videoError?: string | null;
	isPlaying?: boolean;
	isMuted?: boolean;
	badge: string;
	badgeClass: string;
	title: string;
	titleClass: string;
	headerVisible: boolean;
	hint: string;
	videoLabel: string;
	tryBtnText: string;
	statusText: string;
	stagePassed: boolean;
	showNext: boolean;
	nextBtnText: string;
	onStartAI: () => void;
	onReplayVideo?: () => void;
	onTogglePlay?: () => void;
	onToggleMute?: () => void;
	onNext: () => void;
};

export function VideoSection({
	setContainerRef,
	isVideoLoading = false,
	isVideoEnded = false,
	videoError = null,
	isPlaying = true,
	isMuted = true,
	badge,
	badgeClass,
	title,
	titleClass,
	headerVisible,
	hint,
	videoLabel,
	tryBtnText,
	statusText,
	stagePassed,
	showNext,
	nextBtnText,
	onStartAI,
	onReplayVideo,
	onTogglePlay,
	onToggleMute,
	onNext,
}: VideoSectionProps) {
	const isEnded = stagePassed || isVideoEnded;

	return (
		<div className="relative w-full h-full">
			{/* YT.Player mounts here — fills the container */}
			<div
				ref={setContainerRef}
				id="yt-player"
				className="absolute inset-0 z-0"
			/>

			{/* Loading Wave Overlay: ONLY appears during loading state with smooth fadeout! */}
			<div
				id="video-loading"
				role="status"
				aria-live="polite"
				aria-hidden={!(isVideoLoading && !isEnded)}
				className={`pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-950 transition-opacity duration-500 ${
					isVideoLoading && !isEnded ? "opacity-100" : "opacity-0"
				}`}
			>
				<div className="mb-1 inline-block rounded-full border border-rose-400/25 bg-rose-400/10 px-4 py-1 font-mono text-xs font-bold tracking-wider text-rose-200">
					{badge}
				</div>
				<div className="mb-2 text-[clamp(28px,5vw,44px)] font-black tracking-tight text-white">
					{title}
				</div>
				<LoadingWave />
			</div>

			{videoError && !isEnded && (
				<div
					className="absolute inset-0 z-40 flex items-center justify-center bg-slate-950/95 px-6 text-center backdrop-blur-md"
					role="alert"
				>
					<div className="w-full max-w-lg rounded-3xl border border-amber-300/25 bg-slate-900 p-7 shadow-2xl">
						<div
							className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-300/10 text-2xl font-black text-amber-300"
							aria-hidden="true"
						>
							!
						</div>
						<h2 className="text-2xl font-black text-white">
							教學影片暫時無法播放
						</h2>
						<p className="mt-2 text-sm leading-6 text-slate-300">
							{videoError}
						</p>
						<div className="mt-6 flex flex-wrap justify-center gap-3">
							{onReplayVideo && (
								<button
									type="button"
									onClick={onReplayVideo}
									className="inline-flex items-center gap-2 rounded-xl bg-rose-500 px-5 py-3 font-black text-white transition-colors hover:bg-rose-400"
								>
									<IconRotateCcw className="h-4 w-4" />
									重新載入影片
								</button>
							)}
							<button
								type="button"
								onClick={onStartAI}
								className="inline-flex items-center gap-2 rounded-xl border border-slate-600 px-5 py-3 font-bold text-slate-100 transition-colors hover:bg-slate-800"
							>
								<IconBrain className="h-4 w-4 text-cyan-300" />
								先進入 AI 練習
							</button>
						</div>
					</div>
				</div>
			)}

			{headerVisible && (
				<div className="absolute top-12 left-0 right-0 z-20 text-center pt-3 pb-4 bg-gradient-to-b from-black/90 to-transparent pointer-events-none">
					<div
						className={`inline-block px-4 py-1 rounded text-sm font-bold mb-1 ${badgeClass}`}
					>
						{badge}
					</div>
					<div
						className={`text-[clamp(24px,4vw,40px)] font-black text-white leading-tight drop-shadow-md ${titleClass}`}
					>
						{title}
					</div>
				</div>
			)}

			{/* High-Contrast Crystal-Clear Stage Hint Banner ("請上下搖動吸入器...") */}
			{hint && (
				<div className="pointer-events-none absolute left-1/2 top-18 z-30 w-auto max-w-[94vw] -translate-x-1/2 px-4">
					<div className="flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-slate-950/80 px-5 py-2.5 text-center text-sm font-black leading-5 text-white shadow-2xl backdrop-blur-md sm:text-base">
						<span className="h-2 w-2 shrink-0 rounded-full bg-rose-400" />
						<span>{hint}</span>
					</div>
				</div>
			)}

			{videoLabel && (
				<div className="pointer-events-none absolute left-4 top-20 z-20 hidden items-center gap-2 rounded-lg border border-white/10 bg-slate-950/80 px-3 py-1.5 text-xs font-bold text-white shadow-md backdrop-blur-md sm:flex">
					<IconVideo className="w-4 h-4 text-rose-300" />
					<span>{videoLabel}</span>
				</div>
			)}

			{/* Non-intrusive floating video controls (Top-Right, far away from bottom subtitles) */}
			{!isEnded && !isVideoLoading && !videoError && (
				<div className="absolute right-4 top-18 sm:top-20 z-30 flex items-center gap-2">
					{onTogglePlay && (
						<button
							type="button"
							onClick={onTogglePlay}
							aria-label={isPlaying ? "暫停影片" : "播放影片"}
							title={isPlaying ? "暫停影片" : "播放影片"}
							className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/15 bg-slate-950/80 text-white shadow-xl backdrop-blur-md transition-all hover:bg-white/15 active:scale-95 cursor-pointer"
						>
							{isPlaying ? (
								<IconPause className="h-4 w-4 text-white" />
							) : (
								<IconPlay className="h-4 w-4 text-white" />
							)}
						</button>
					)}
					{onToggleMute && (
						<button
							type="button"
							onClick={onToggleMute}
							aria-label={isMuted ? "開啟聲音" : "靜音"}
							title={isMuted ? "開啟聲音" : "靜音"}
							className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/15 bg-slate-950/80 text-white shadow-xl backdrop-blur-md transition-all hover:bg-white/15 active:scale-95 cursor-pointer"
						>
							{isMuted ? (
								<IconVolumeX className="h-4 w-4 text-slate-400" />
							) : (
								<IconVolume className="h-4 w-4 text-emerald-400" />
							)}
						</button>
					)}
					<button
						type="button"
						onClick={showNext && onNext ? onNext : onStartAI}
						title="跳過衛教影片直接開始練習"
						className="inline-flex items-center gap-1.5 rounded-xl border border-rose-400/30 bg-rose-500/15 px-3 py-2 text-xs font-black text-rose-200 shadow-xl backdrop-blur-md transition-all hover:bg-rose-500/25 active:scale-95 cursor-pointer"
					>
						<span>略過影片</span>
						<IconArrowRight className="h-3.5 w-3.5" />
					</button>
				</div>
			)}

			{isEnded && (
				<div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-black/85 backdrop-blur-md transition-all duration-300 animate-fadeIn p-6 text-center">
					<div className="text-2xl sm:text-3xl font-black text-white mb-8 flex items-center gap-3">
						<span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
							<IconCheck className="w-6 h-6" />
						</span>
						<span>衛教影片播放完畢</span>
					</div>

					<div className="flex items-center gap-5 flex-wrap justify-center">
						{onReplayVideo && (
							<button
								type="button"
								onClick={onReplayVideo}
								className="px-7 py-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-lg border border-slate-600 shadow-2xl flex items-center gap-3 cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95"
							>
								<IconRotateCcw className="w-6 h-6 text-rose-300" />
								<span>重播影片</span>
							</button>
						)}

						{showNext && onNext ? (
							<button
								type="button"
								onClick={onNext}
								className="px-9 py-4 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-black text-lg shadow-2xl shadow-rose-600/50 flex items-center gap-3 cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95"
							>
								<span>{nextBtnText || "開始闖關"}</span>
								<IconArrowRight className="w-6 h-6" />
							</button>
						) : (
							<button
								type="button"
								onClick={onStartAI}
								className="flex min-h-14 items-center gap-3 rounded-2xl bg-rose-600 px-9 py-4 text-lg font-black text-white shadow-2xl shadow-rose-600/35 transition-colors duration-200 hover:bg-rose-500"
							>
								<IconBrain className="w-6 h-6 text-white" />
								<span>{tryBtnText || "開始 AI 動作練習"}</span>
								<IconArrowRight className="w-6 h-6 text-white" />
							</button>
						)}
					</div>
				</div>
			)}

			{statusText && (
				<div className="absolute bottom-18 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
					<StatusBanner text={statusText} />
				</div>
			)}
		</div>
	);
}
