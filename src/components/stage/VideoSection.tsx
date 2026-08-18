import {
	IconArrowRight,
	IconBrain,
	IconCheck,
	IconRotateCcw,
	IconVideo,
} from "../icons";
import { LoadingWave } from "../LoadingWave";
import { StatusBanner } from "./StatusBanner";

type VideoSectionProps = {
	setContainerRef: (node: HTMLDivElement | null) => void;
	isVideoLoading?: boolean;
	isVideoEnded?: boolean;
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
	onNext: () => void;
};

export function VideoSection({
	setContainerRef,
	isVideoLoading = false,
	isVideoEnded = false,
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
				className={`absolute inset-0 flex flex-col items-center justify-center bg-[#060a10] z-20 transition-opacity duration-500 pointer-events-none ${
					isVideoLoading && !isEnded ? "opacity-100" : "opacity-0"
				}`}
			>
				<div className="inline-block px-4 py-1 rounded text-sm font-bold text-cyan-400 mb-1 border border-cyan-500/30 bg-cyan-950/40">
					{badge}
				</div>
				<div className="text-[clamp(28px,5vw,44px)] font-black text-white mb-2 tracking-tight">
					{title}
				</div>
				<LoadingWave />
			</div>

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
				<div className="absolute top-14 left-1/2 -translate-x-1/2 z-30 w-auto max-w-[90vw] px-4 pointer-events-none">
					<div className="bg-amber-400 text-slate-950 font-black text-sm sm:text-base px-6 py-2.5 rounded-full shadow-2xl shadow-amber-500/30 border-2 border-amber-300 text-center tracking-wide flex items-center justify-center gap-2">
						<span className="h-2 w-2 rounded-full bg-slate-950 animate-ping" />
						<span>{hint}</span>
					</div>
				</div>
			)}

			{videoLabel && (
				<div className="absolute top-14 left-4 z-20 px-3 py-1.5 rounded-lg bg-slate-900/90 backdrop-blur-md text-xs font-bold text-white flex items-center gap-2 pointer-events-none border border-slate-700 shadow-md">
					<IconVideo className="w-4 h-4 text-cyan-400" />
					<span>{videoLabel}</span>
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
								<IconRotateCcw className="w-6 h-6 text-cyan-400" />
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
								className="px-9 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-lg shadow-2xl shadow-emerald-500/50 flex items-center gap-3 cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95"
							>
								<IconBrain className="w-6 h-6 text-slate-950" />
								<span>{tryBtnText || "開始 AI 辨識練習"}</span>
								<IconArrowRight className="w-6 h-6 text-slate-950" />
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
