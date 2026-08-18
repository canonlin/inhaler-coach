import type { RefObject } from "react";
import { IconArrowRight } from "../icons";
import { LoadingWave } from "../LoadingWave";
import { ActionButtons } from "./ActionButtons";
import { StatusBanner } from "./StatusBanner";

type VideoSectionProps = {
	videoContainerRef: RefObject<HTMLDivElement | null>;
	badge: string;
	badgeClass: string;
	title: string;
	titleClass: string;
	headerVisible: boolean;
	hint: string;
	videoLabel: string;
	tryBtnText: string;
	statusText: string;
	showPharmacist: boolean;
	showRetry: boolean;
	showNext: boolean;
	nextBtnText: string;
	onStartAI: () => void;
	onPharmacist: () => void;
	onRetry: () => void;
	onNext: () => void;
};

export function VideoSection({
	videoContainerRef,
	badge,
	badgeClass,
	title,
	titleClass,
	headerVisible,
	hint,
	videoLabel,
	tryBtnText,
	statusText,
	showPharmacist,
	showRetry,
	showNext,
	nextBtnText,
	onStartAI,
	onPharmacist,
	onRetry,
	onNext,
}: VideoSectionProps) {
	return (
		<div className="relative w-full h-full" ref={videoContainerRef}>
			<div className="absolute inset-0 flex items-center justify-center">
				<iframe
					title="衛教影片"
					aria-label="衛教影片"
					className="w-full h-full border-none"
					style={{
						maxWidth: "100vw",
						maxHeight: "100vh",
						aspectRatio: "16/9",
					}}
					src=""
					allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
					allowFullScreen
				/>

				<div
					id="video-loading"
					className="absolute inset-0 flex flex-col items-center justify-center bg-[#0a0a0a] z-[1] transition-opacity duration-500"
				>
					<div className="inline-block px-4 py-1 rounded text-sm font-bold text-text-secondary/60 mb-3">
						{badge || "開場介紹"}
					</div>
					<div className="text-[clamp(28px,5vw,44px)] font-black text-white/90 mb-6">
						{title || "衛教影片"}
					</div>
					<LoadingWave />
				</div>
			</div>

			{headerVisible && (
				<div className="absolute top-0 left-0 right-0 z-10 text-center pt-4 pb-5 bg-gradient-to-b from-black/60 to-transparent">
					<div
						className={`inline-block px-4 py-1 rounded text-sm font-bold text-text-secondary mb-1 ${badgeClass}`}
					>
						{badge}
					</div>
					<div
						className={`text-[clamp(24px,4vw,40px)] font-black text-text leading-tight ${titleClass}`}
					>
						{title}
					</div>
				</div>
			)}

			{hint && (
				<div className="absolute top-16 left-1/2 -translate-x-1/2 z-10 w-full max-w-[480px] px-4">
					<div className="bg-warning/20 border border-warning/40 rounded-lg px-4 py-2 text-center text-sm text-warning">
						{hint}
					</div>
				</div>
			)}

			{videoLabel && (
				<div className="absolute top-3 left-3 z-10 px-3 py-1 rounded bg-black/60 text-sm font-bold text-white/80 flex items-center gap-1.5">
					{videoLabel}
				</div>
			)}

			{tryBtnText && (
				<div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
					<button
						type="button"
						onClick={onStartAI}
						className="px-8 py-4 rounded-xl border-none text-lg font-bold cursor-pointer transition-all duration-300 bg-success text-black shadow-2xl shadow-success/40 hover:scale-105 pointer-events-auto flex items-center gap-2"
					>
						{tryBtnText}
						<IconArrowRight />
					</button>
				</div>
			)}

			<div className="absolute bottom-3 right-3 z-10">
				<ActionButtons
					showPharmacist={showPharmacist}
					showRetry={showRetry}
					showNext={showNext}
					nextBtnText={nextBtnText}
					onPharmacist={onPharmacist}
					onRetry={onRetry}
					onNext={onNext}
				/>
			</div>

			{statusText && (
				<div className="absolute bottom-14 left-1/2 -translate-x-1/2 z-10">
					<StatusBanner text={statusText} />
				</div>
			)}
		</div>
	);
}
