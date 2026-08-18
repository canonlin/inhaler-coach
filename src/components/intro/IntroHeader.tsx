export function IntroHeader() {
	return (
		<header className="grid gap-2.5 text-left">
			{/* Tag Badge */}
			<div className="flex items-center gap-2.5">
				<span className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-3.5 py-1 text-sm lg:text-sm font-black tracking-wider text-rose-900 uppercase shadow-xs">
					<span
						className="h-2 w-2 rounded-full bg-rose-600 animate-pulse"
						aria-hidden="true"
					/>
					INHALER COACH
				</span>
				<span className="font-mono text-sm text-slate-400 font-bold">/</span>
				<span className="font-mono text-sm lg:text-sm text-slate-500 font-bold tracking-wider">
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
				<p className="text-base font-black leading-relaxed text-slate-800 lg:text-lg max-w-[42ch]">
					四步流程：看影片、調姿勢、AI 糾正、看結果。一次導覽，直接上手。
				</p>
			</div>
		</header>
	);
}
