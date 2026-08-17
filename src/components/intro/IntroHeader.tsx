export function IntroHeader() {
	return (
		<header className="grid gap-5 text-left relative">
			{/* Tag & Status Indicator */}
			<div className="flex items-center gap-2.5">
				<span className="relative flex h-2.5 w-2.5">
					<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75" />
					<span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-teal-500" />
				</span>
				<p className="font-mono text-xs font-semibold tracking-[0.3em] text-teal-400 uppercase">
					INHALER COACH
				</p>
			</div>

			{/* Main Title & Subtitle */}
			<div className="grid gap-3">
				<h1 className="text-4xl font-black leading-[1.1] tracking-tight sm:text-5xl md:text-6xl bg-gradient-to-r from-white via-slate-100 to-teal-200 bg-clip-text text-transparent drop-shadow-sm">
					吸必擴智慧教學平台
				</h1>
				<p className="max-w-[42ch] text-base leading-relaxed text-slate-400 md:text-lg font-normal">
					四步流程：看影片、調姿勢、AI 糾正、看結果。一次導覽，直接上手。
				</p>
			</div>
		</header>
	);
}
