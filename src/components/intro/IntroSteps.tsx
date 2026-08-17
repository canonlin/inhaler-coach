import type { ReactNode } from "react";

type StepItem = {
	label: string;
	desc: string;
	icon: ReactNode;
};

const steps: StepItem[] = [
	{
		label: "看影片",
		desc: "藥師示範正確操作",
		icon: (
			<svg
				aria-hidden="true"
				width="22"
				height="22"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			>
				<rect x="2" y="4" width="20" height="16" rx="3" />
				<polygon
					points="10,8.5 16,12 10,15.5"
					fill="currentColor"
					stroke="none"
				/>
			</svg>
		),
	},
	{
		label: "調姿勢",
		desc: "調整含嘴角度與站姿",
		icon: (
			<svg
				aria-hidden="true"
				width="22"
				height="22"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
			>
				<circle cx="12" cy="12" r="9" />
				<line x1="12" y1="3" x2="12" y2="7" />
				<line x1="12" y1="17" x2="12" y2="21" />
				<line x1="3" y1="12" x2="7" y2="12" />
				<line x1="17" y1="12" x2="21" y2="12" />
				<circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" />
			</svg>
		),
	},
	{
		label: "AI 糾正",
		desc: "即時辨識並修正動作",
		icon: (
			<svg
				aria-hidden="true"
				width="22"
				height="22"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			>
				<path d="M12 2C8 2 5 5 5 9c0 3 2 5 4 7l3 4 3-4c2-2 4-4 4-7 0-4-3-7-7-7z" />
				<line x1="9" y1="10" x2="15" y2="10" />
				<line x1="9.5" y1="13" x2="14.5" y2="13" />
			</svg>
		),
	},
	{
		label: "看結果",
		desc: "查看評分與改進建議",
		icon: (
			<svg
				aria-hidden="true"
				width="22"
				height="22"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			>
				<circle cx="12" cy="12" r="9" />
				<polyline points="8,12 11,15 16,9" />
			</svg>
		),
	},
];

export function IntroSteps() {
	return (
		<section aria-label="使用流程" className="grid gap-4">
			<div className="grid gap-3.5 sm:grid-cols-2 sm:gap-4">
				{steps.map((step, i) => (
					<div
						key={step.label}
						className="group relative flex items-start gap-4 rounded-2xl border border-teal-500/20 bg-slate-900/60 p-4 sm:p-5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-teal-400/60 hover:bg-slate-900/80 hover:shadow-2xl hover:shadow-teal-500/10"
					>
						{/* Icon Box */}
						<div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-teal-500/30 bg-teal-950/40 text-teal-400 shadow-inner transition-colors duration-300 group-hover:border-teal-400 group-hover:bg-teal-500 group-hover:text-slate-950">
							{step.icon}
						</div>

						{/* Text & Step Num */}
						<div className="grid gap-1 text-left">
							<div className="flex items-baseline gap-2">
								<span className="font-mono text-xs font-semibold tabular-nums text-teal-400/80">
									0{i + 1}
								</span>
								<span className="text-base font-bold text-slate-100 transition-colors group-hover:text-white">
									{step.label}
								</span>
							</div>
							<p className="text-sm leading-relaxed text-slate-400">
								{step.desc}
							</p>
						</div>
					</div>
				))}
			</div>
		</section>
	);
}
