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
		<div className="flex items-center gap-2.5 bg-slate-950/90 backdrop-blur-md border border-slate-800 p-2 rounded-2xl shadow-2xl flex-wrap justify-end">
			{showReplay && onReplay && (
				<button
					type="button"
					onClick={onReplay}
					className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm border border-slate-700 shadow-md flex items-center gap-1.5 cursor-pointer transition-all hover:scale-105 active:scale-95"
				>
					<IconRotateCcw className="w-4 h-4 text-cyan-400" />
					<span>重播</span>
				</button>
			)}

			{showPharmacist && onPharmacist && (
				<button
					type="button"
					onClick={onPharmacist}
					className="px-3.5 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-emerald-400 font-bold text-xs sm:text-sm border border-emerald-500/30 shadow-md flex items-center gap-1.5 cursor-pointer transition-all hover:scale-105 active:scale-95"
				>
					<IconCheck className="w-4 h-4 text-emerald-400" />
					<span>藥師確認通過</span>
				</button>
			)}

			{showRetry && onRetry && (
				<button
					type="button"
					onClick={onRetry}
					className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs sm:text-sm border border-slate-700 shadow-md flex items-center gap-1.5 cursor-pointer transition-all hover:scale-105 active:scale-95"
				>
					<IconRefresh className="w-4 h-4 text-amber-400" />
					<span>再測一次</span>
				</button>
			)}

			{showStartAI && onStartAI && (
				<button
					type="button"
					onClick={onStartAI}
					className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-emerald-500/30 flex items-center gap-2 cursor-pointer transition-all hover:scale-105 active:scale-95"
				>
					<IconBrain className="w-4 h-4 text-slate-950" />
					<span>{startAIText}</span>
					<IconArrowRight className="w-4 h-4 text-slate-950" />
				</button>
			)}

			{showNext && onNext && (
				<button
					type="button"
					onClick={onNext}
					className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs sm:text-sm shadow-lg shadow-rose-600/30 flex items-center gap-2 cursor-pointer transition-all hover:scale-105 active:scale-95"
				>
					<span>{nextBtnText}</span>
					<IconArrowRight className="w-4 h-4" />
				</button>
			)}
		</div>
	);
}
