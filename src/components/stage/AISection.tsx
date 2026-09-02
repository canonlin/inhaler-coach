import type { RefObject } from "react";
import type { ModelState } from "../../hooks/useCoaching";
import { IconArrowLeft, IconBrain, IconRefresh } from "../icons";
import { ActionButtons } from "./ActionButtons";
import { StatusBanner } from "./StatusBanner";

type AISectionProps = {
	canvasRef: RefObject<HTMLCanvasElement | null>;
	overlay: "none" | "correct" | "wrong";
	aiLabel: string;
	statusText: string;
	modelState: ModelState;
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
	modelState,
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
	const modelReady = modelState === "ready";

	return (
		<div className="relative w-full h-full bg-black">
			{/* Loading state — no camera, just loading indicator */}
			{modelState === "loading" && (
				<div
					className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 bg-slate-950"
					role="status"
					aria-live="polite"
				>
					<div className="h-10 w-10 animate-spin rounded-full border-3 border-rose-500 border-t-transparent" />
					<div className="text-white font-bold">正在準備 AI 動作觀察</div>
					<div className="text-slate-400 text-sm">
						載入模型與攝影機，通常只需要幾秒鐘
					</div>
				</div>
			)}

			{modelState === "error" && (
				<div
					className="absolute inset-0 z-30 flex items-center justify-center bg-slate-950 px-6"
					role="alert"
				>
					<div className="w-full max-w-md rounded-3xl border border-rose-400/30 bg-slate-900 p-7 text-center shadow-2xl">
						<div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-400/10 text-rose-300">
							<span className="text-2xl font-black" aria-hidden="true">
								!
							</span>
						</div>
						<h2 className="text-xl font-black text-white">AI 暫時無法啟動</h2>
						<p className="mt-2 text-sm leading-6 text-slate-300">
							{statusText}
						</p>
						<div className="mt-6 flex flex-wrap justify-center gap-3">
							<button
								type="button"
								onClick={onRetry}
								className="inline-flex items-center gap-2 rounded-xl bg-rose-500 px-5 py-3 font-black text-white transition-colors hover:bg-rose-400"
							>
								<IconRefresh className="h-4 w-4" />
								重新嘗試
							</button>
							<button
								type="button"
								onClick={onBackToVideo}
								className="rounded-xl border border-slate-600 px-5 py-3 font-bold text-slate-200 transition-colors hover:bg-slate-800"
							>
								回到教學影片
							</button>
						</div>
						{onPharmacist && (
							<button
								type="button"
								onClick={onPharmacist}
								className="mt-4 min-h-11 rounded-lg px-3 text-sm font-bold text-emerald-200 underline decoration-emerald-300/40 underline-offset-4 hover:text-emerald-100"
							>
								由衛教師協助確認這一關
							</button>
						)}
					</div>
				</div>
			)}

			{/* Camera feed — fills entire area */}
			<canvas
				id="webcam-canvas"
				ref={canvasRef}
				role="img"
				aria-label="攝影機即時畫面與動作辨識回饋"
				aria-hidden={!modelReady}
				className={`absolute inset-0 block h-full w-full scale-x-[-1] object-cover ${modelReady ? "opacity-100" : "opacity-0"}`}
				width="480"
				height="360"
			>
				你的瀏覽器不支援即時攝影機畫面。
			</canvas>
			<div className={OVERLAY_CLASSES[overlay] ?? "hidden"} />

			{/* Top bar — label */}
			<div className="pointer-events-none absolute left-0 right-0 top-14 z-10 bg-gradient-to-b from-black/80 to-transparent px-4 pb-5 pt-3">
				<div className="flex items-center gap-2 text-white">
					<IconBrain className="w-5 h-5 text-rose-300" />
					<span className="text-sm font-bold">AI 可見動作觀察</span>
					<span className="ml-auto rounded border border-rose-300/25 bg-rose-400/10 px-2 py-0.5 font-mono text-xs font-bold text-rose-200">
						{aiLabel}
					</span>
				</div>
			</div>

			{/* Center status */}
			<div
				className={`absolute inset-x-0 top-1/2 -translate-y-1/2 z-10 items-center justify-center pointer-events-none px-4 ${modelReady ? "flex" : "hidden"}`}
			>
				{statusText ? (
					<StatusBanner text={statusText} />
				) : (
					<div className="text-slate-400 text-sm bg-black/50 px-4 py-2 rounded-lg backdrop-blur-sm">
						AI 模型運算中，請依照提示操作...
					</div>
				)}
			</div>

			{/* Bottom bar — buttons */}
			<div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/90 to-transparent px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-8">
				<div className="flex items-center justify-between gap-3 flex-wrap">
					<button
						type="button"
						onClick={onBackToVideo}
						className="flex min-h-11 items-center gap-1.5 rounded-lg px-2 font-sans text-sm font-bold text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
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
