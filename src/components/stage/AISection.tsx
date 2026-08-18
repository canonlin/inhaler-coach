import type { RefObject } from "react";
import { IconArrowLeft, IconBrain } from "../icons";
import { ActionButtons } from "./ActionButtons";
import { StatusBanner } from "./StatusBanner";

type AISectionProps = {
	canvasRef: RefObject<HTMLCanvasElement | null>;
	overlay: "none" | "correct" | "wrong";
	aiLabel: string;
	statusText: string;
	stagePassed?: boolean;
	showPharmacist?: boolean;
	showRetry?: boolean;
	showNext?: boolean;
	nextBtnText?: string;
	onBackToVideo: () => void;
	onPharmacist?: () => void;
	onRetry?: () => void;
	onNext?: () => void;
};

const OVERLAY_CLASSES: Record<string, string> = {
	none: "hidden",
	correct:
		"absolute inset-0 border-4 border-emerald-500 bg-emerald-500/10 pointer-events-none transition-all duration-300",
	wrong:
		"absolute inset-0 border-4 border-rose-500 bg-rose-500/10 pointer-events-none transition-all duration-300",
};

export function AISection({
	canvasRef,
	overlay,
	aiLabel,
	statusText,
	stagePassed,
	showPharmacist = true,
	showRetry,
	showNext,
	nextBtnText = "進入下一關",
	onBackToVideo,
	onPharmacist,
	onRetry,
	onNext,
}: AISectionProps) {
	return (
		<div className="relative w-full h-full bg-black">
			{/* Camera feed — fills entire area */}
			<canvas
				id="webcam-canvas"
				ref={canvasRef}
				className="absolute inset-0 w-full h-full object-cover block"
				width="480"
				height="360"
			/>
			<div className={OVERLAY_CLASSES[overlay] ?? "hidden"} />

			{/* Top bar — label */}
			<div className="absolute top-0 left-0 right-0 z-10 px-4 pt-3 pb-2 bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
				<div className="flex items-center gap-2 text-white">
					<IconBrain className="w-5 h-5 text-cyan-400" />
					<span className="text-sm font-bold">AI 即時辨識練習</span>
					<span className="ml-auto text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/30 text-cyan-400">
						{aiLabel}
					</span>
				</div>
			</div>

			{/* Center status */}
			<div className="absolute inset-x-0 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center pointer-events-none px-4">
				{statusText ? (
					<StatusBanner text={statusText} />
				) : (
					<div className="text-slate-400 text-sm bg-black/50 px-4 py-2 rounded-lg backdrop-blur-sm">
						AI 模型運算中，請依照提示操作...
					</div>
				)}
			</div>

			{/* Bottom bar — buttons */}
			<div className="absolute bottom-0 left-0 right-0 z-10 px-4 py-3 bg-gradient-to-t from-black/80 to-transparent">
				<div className="flex items-center justify-between gap-3 flex-wrap">
					<button
						type="button"
						onClick={onBackToVideo}
						className="bg-transparent border-none text-slate-300 text-sm cursor-pointer font-sans hover:text-white flex items-center gap-1.5 transition-colors"
					>
						<IconArrowLeft className="w-4 h-4" />
						<span>重新觀看影片</span>
					</button>

					<ActionButtons
						showPharmacist={showPharmacist}
						onPharmacist={onPharmacist}
						showRetry={showRetry || stagePassed}
						onRetry={onRetry}
						showNext={showNext || stagePassed}
						nextBtnText={nextBtnText}
						onNext={onNext}
					/>
				</div>
			</div>
		</div>
	);
}
