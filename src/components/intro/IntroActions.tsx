type IntroActionsProps = {
	onStart: () => void;
};

export function IntroActions({ onStart }: IntroActionsProps) {
	return (
		<footer className="grid gap-1 pt-1 sm:gap-2">
			<button
				type="button"
				id="btn-start"
				onClick={onStart}
				aria-label="開始吸必擴四關衛教練習"
				className="group relative inline-flex h-13 w-full lg:w-fit items-center justify-center gap-3 px-8 text-lg font-black tracking-wide rounded-xl bg-rose-600 text-white shadow-lg shadow-rose-600/40 hover:bg-rose-700 hover:shadow-xl hover:shadow-rose-600/50 hover:-translate-y-0.5 focus-visible:outline-3 focus-visible:outline-blue-600 focus-visible:outline-offset-3 active:scale-95 cursor-pointer transition-all duration-200"
			>
				<span>開始四關練習</span>
				<svg
					aria-hidden="true"
					className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					strokeWidth="2.5"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
					/>
				</svg>
			</button>

			<p className="text-xs font-bold leading-tight text-slate-600 sm:text-sm">
				衛教練習工具 · 開始後需要使用攝影機
			</p>
		</footer>
	);
}
