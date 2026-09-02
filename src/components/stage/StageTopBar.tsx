type StageTopBarProps = {
	text: string;
	currentStep: number;
	totalSteps?: number;
};

export function StageTopBar({
	text,
	currentStep,
	totalSteps = 4,
}: StageTopBarProps) {
	if (!text) return null;
	const progress = `${Math.min(100, Math.max(0, (currentStep / totalSteps) * 100))}%`;

	return (
		<header className="pointer-events-none fixed inset-x-0 top-0 z-40 flex h-14 items-center border-b border-white/10 bg-slate-950/90 px-4 shadow-xl backdrop-blur-md sm:px-6">
			<div className="flex min-w-0 flex-1 items-center gap-3">
				<div className="flex shrink-0 items-center gap-2 rounded-full border border-rose-400/25 bg-rose-400/10 px-2.5 py-1 font-mono text-[10px] font-bold tracking-[0.16em] text-rose-200 sm:text-xs">
					<span className="h-2 w-2 rounded-full bg-rose-400" />
					<span className="hidden sm:inline">INHALER COACH</span>
				</div>
				<span className="truncate text-sm font-black tracking-wide text-white sm:text-base">
					{text}
				</span>
			</div>
			<div className="ml-4 shrink-0 font-mono text-xs font-bold tracking-wider text-slate-300 sm:text-sm">
				{String(currentStep).padStart(2, "0")} /{" "}
				{String(totalSteps).padStart(2, "0")}
			</div>
			<div
				className="absolute inset-x-0 bottom-0 h-0.5 bg-white/10"
				role="progressbar"
				aria-label="闖關進度"
				aria-valuemin={1}
				aria-valuemax={totalSteps}
				aria-valuenow={currentStep}
			>
				<div
					className="h-full bg-rose-500 transition-[width] duration-500"
					style={{ width: progress }}
				/>
			</div>
		</header>
	);
}
