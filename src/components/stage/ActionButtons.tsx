import {
	IconArrowRight,
	IconBrain,
	IconCheck,
	IconRefresh,
	IconRotateCcw,
} from "../icons";

type ActionButtonsProps = {
	showReplay?: boolean;
	onReplay?: () => void;
	showStartAI?: boolean;
	startAIText?: string;
	onStartAI?: () => void;
	showPharmacist?: boolean;
	onPharmacist?: () => void;
	showRetry?: boolean;
	onRetry?: () => void;
	showNext?: boolean;
	nextBtnText?: string;
	onNext?: () => void;
};

export function ActionButtons({
	showReplay,
	onReplay,
	showStartAI,
	startAIText = "AI 辨識",
	onStartAI,
	showPharmacist,
	onPharmacist,
	showRetry,
	onRetry,
	showNext,
	nextBtnText = "進入下一關",
	onNext,
}: ActionButtonsProps) {
	return (
		<div className="flex flex-wrap items-center justify-end gap-2 rounded-2xl border border-white/10 bg-slate-950/85 p-2 shadow-2xl backdrop-blur-md">
			{showReplay && onReplay && (
				<button
					type="button"
					onClick={onReplay}
					className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-600 bg-slate-800 px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-slate-700 sm:text-sm"
				>
					<IconRotateCcw className="w-4 h-4 text-cyan-400" />
					<span>重播</span>
				</button>
			)}

			{showPharmacist && onPharmacist && (
				<button
					type="button"
					onClick={onPharmacist}
					className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-emerald-300/30 bg-emerald-400/10 px-4 py-2 text-xs font-bold text-emerald-200 transition-colors hover:bg-emerald-400/20 sm:text-sm"
				>
					<IconCheck className="w-4 h-4 text-emerald-400" />
					<span>由衛教師確認</span>
				</button>
			)}

			{showRetry && onRetry && (
				<button
					type="button"
					onClick={onRetry}
					className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-600 bg-slate-800 px-4 py-2 text-xs font-bold text-slate-100 transition-colors hover:bg-slate-700 sm:text-sm"
				>
					<IconRefresh className="w-4 h-4 text-amber-400" />
					<span>再測一次</span>
				</button>
			)}

			{showStartAI && onStartAI && (
				<button
					type="button"
					onClick={onStartAI}
					className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-rose-600 px-4 py-2 text-xs font-black text-white shadow-lg shadow-rose-600/25 transition-colors hover:bg-rose-500 sm:text-sm"
				>
					<IconBrain className="w-4 h-4 text-white" />
					<span>{startAIText}</span>
					<IconArrowRight className="w-4 h-4 text-white" />
				</button>
			)}

			{showNext && onNext && (
				<button
					type="button"
					onClick={onNext}
					className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-rose-600 px-4 py-2 text-xs font-black text-white shadow-lg shadow-rose-600/25 transition-colors hover:bg-rose-500 sm:text-sm"
				>
					<span>{nextBtnText}</span>
					<IconArrowRight className="w-4 h-4" />
				</button>
			)}
		</div>
	);
}
