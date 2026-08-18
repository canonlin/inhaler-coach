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
		"absolute inset-0 border-4 border-emerald-500 bg-emerald-500/10 rounded-lg pointer-events-none transition-all duration-300",
	wrong:
		"absolute inset-0 border-4 border-rose-500 bg-rose-500/10 rounded-lg pointer-events-none transition-all duration-300",
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
		<div className="absolute inset-0 bg-slate-950 flex items-center justify-center z-20 p-4">
			<div className="w-full max-w-[840px] bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
				<div className="px-5 py-3 text-sm font-bold text-slate-300 border-b border-slate-800 flex items-center gap-2">
					<span className="flex items-center gap-2 text-white">
						<IconBrain className="w-5 h-5 text-cyan-400" />
						<span>AI 即時辨識練習</span>
					</span>
					<span className="ml-auto text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/30 text-cyan-400">
						{aiLabel}
					</span>
				</div>

				<div className="p-5 flex gap-5 items-start flex-wrap max-md:flex-col">
					<div className="relative w-[clamp(280px,40vw,480px)] min-w-[260px] flex-shrink-0 mx-auto">
						<canvas
							ref={canvasRef}
							className="w-full h-auto rounded-xl bg-black block border border-slate-700 min-h-[220px]"
							width="480"
							height="360"
						/>
						<div className={OVERLAY_CLASSES[overlay] ?? "hidden"} />
					</div>

					<div
						className="flex-1 min-w-[220px] flex flex-col gap-3 justify-center self-center w-full"
						id="ai-results"
					>
						<div className="text-sm text-slate-300 text-center p-4">
							{statusText ? (
								<StatusBanner text={statusText} />
							) : (
								<div className="text-slate-400">
									AI 模型運算中，請依照提示操作...
								</div>
							)}
						</div>
					</div>
				</div>

				<div className="px-5 py-3 border-t border-slate-800 flex items-center justify-between gap-3 flex-wrap bg-slate-950/50">
					<button
						type="button"
						onClick={onBackToVideo}
						className="bg-transparent border-none text-slate-400 text-sm cursor-pointer font-sans hover:text-white flex items-center gap-1.5 transition-colors"
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
