export function IntroHeader() {
	return (
		<header className="grid gap-2.5 text-left">
			{/* Tag Badge */}
			<div className="flex items-center gap-2.5">
				<span className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-black uppercase tracking-wider text-rose-900 shadow-xs sm:px-3.5 sm:text-sm">
					<span
						className="h-2 w-2 rounded-full bg-rose-600 animate-pulse"
						aria-hidden="true"
					/>
					INHALER COACH
				</span>
				<span className="font-mono text-sm text-slate-400 font-bold">/</span>
				<span className="font-mono text-[11px] font-bold tracking-wider text-slate-500 sm:text-sm">
					RESPIRATORY CARE
				</span>
			</div>

			{/* Main Title */}
			<div className="grid gap-2">
				<h1 className="text-3xl font-black leading-tight tracking-tight text-slate-900 lg:text-5xl">
					吸必擴{" "}
					<span className="inline-block bg-rose-600 text-white px-3.5 py-0.5 rounded-xl shadow-md">
						智慧教學平台
					</span>
				</h1>
				<p className="max-w-[34rem] text-sm font-black leading-relaxed text-slate-800 sm:text-base lg:text-lg">
					<span className="block sm:inline">四個關卡：振搖、吐氣、</span>
					<span className="block sm:inline">壓吸憋氣、漱口。</span>
					<span className="block">先看示範，再由 AI 陪你練習。</span>
				</p>
			</div>
		</header>
	);
}
