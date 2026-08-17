type IntroActionsProps = {
	onStart: () => void;
};

export function IntroActions({ onStart }: IntroActionsProps) {
	return (
		<footer className="grid gap-3 pt-2">
			<button
				type="button"
				id="btn-start"
				onClick={onStart}
				className="group relative inline-flex h-14 w-full sm:w-fit items-center justify-center gap-3 rounded-full bg-gradient-to-r from-teal-400 via-teal-500 to-emerald-500 px-10 text-lg font-black text-slate-950 shadow-[0_0_30px_rgba(20,184,166,0.35)] transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_50px_rgba(20,184,166,0.6)] active:scale-[0.98] cursor-pointer"
			>
				<span>開始導覽</span>
				<svg
					aria-hidden="true"
					className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2.5"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<line x1="5" y1="12" x2="19" y2="12" />
					<polyline points="12,5 19,12 12,19" />
				</svg>
			</button>

			<p className="font-mono text-xs text-slate-500 tracking-wide">
				支援桌機 · 手機 · 平板
			</p>
		</footer>
	);
}
