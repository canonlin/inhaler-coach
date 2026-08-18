type StageTopBarProps = {
	text: string;
	leftClass?: string;
};

export function StageTopBar({ text }: StageTopBarProps) {
	if (!text) return null;

	return (
		<header className="fixed top-0 left-0 right-0 z-40 h-12 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between shadow-lg pointer-events-none">
			<div className="flex items-center gap-2.5 min-w-0">
				<span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
				<span className="text-white font-black text-sm sm:text-base tracking-wide truncate">
					{text}
				</span>
			</div>
			<div className="font-mono text-xs font-bold text-slate-400 shrink-0">
				INHALER COACH
			</div>
		</header>
	);
}
