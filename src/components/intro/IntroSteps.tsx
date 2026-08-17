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
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.5"
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
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.5"
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
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.5"
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
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.5"
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
		<section aria-label="使用流程" className="grid gap-3 sm:gap-4">
			<div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
				{steps.map((step, i) => (
					<div
						key={step.label}
						className="flex items-start gap-4 rounded-2xl border border-border bg-surface p-4 transition-all hover:scale-[1.02] hover:border-primary/50"
					>
						<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface-light text-primary">
							{step.icon}
						</div>
						<div className="grid gap-0.5 text-left">
							<div className="flex items-baseline gap-2">
								<span className="font-mono text-xs tabular-nums text-text-secondary">
									0{i + 1}
								</span>
								<span className="text-base font-bold text-text">
									{step.label}
								</span>
							</div>
							<p className="text-sm text-text-secondary">{step.desc}</p>
						</div>
					</div>
				))}
			</div>
		</section>
	);
}
