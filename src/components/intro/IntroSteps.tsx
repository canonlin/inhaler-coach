import type { ReactNode } from "react";

type StepItem = {
	label: string;
	desc: string;
	icon: ReactNode;
	badgeBg: string;
};

const steps: StepItem[] = [
	{
		label: "看示範",
		desc: "藥師示範正確操作",
		badgeBg: "bg-rose-600 text-white",
		icon: (
			<svg
				aria-hidden="true"
				width="22"
				height="22"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2.5"
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
		label: "對準畫面",
		desc: "讓臉部與吸入器清楚入鏡",
		badgeBg: "bg-slate-900 text-white",
		icon: (
			<svg
				aria-hidden="true"
				width="22"
				height="22"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2.5"
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
		label: "跟著練習",
		desc: "依照即時提示完成動作",
		badgeBg: "bg-teal-700 text-white",
		icon: (
			<svg
				aria-hidden="true"
				width="22"
				height="22"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2.5"
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
		label: "完成四關",
		desc: "逐步確認每個操作重點",
		badgeBg: "bg-sky-700 text-white",
		icon: (
			<svg
				aria-hidden="true"
				width="22"
				height="22"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2.5"
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
		<section aria-label="吸必擴智慧教學四步流程" className="w-full">
			{/* Mobile (< 640px): ONLY Mobile has 4 Flush Rows using Tailwind 'block sm:hidden' */}
			<div className="block sm:hidden bg-white/95 backdrop-blur-md border-2 border-slate-200 rounded-2xl shadow-lg overflow-hidden divide-y divide-slate-100">
				{steps.map((step, i) => (
					<div
						key={step.label}
						className="flex items-center justify-between gap-3 px-3.5 py-2 hover:bg-slate-50 transition-colors"
					>
						<div className="flex items-center gap-3 min-w-0">
							<span
								className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md font-mono text-sm font-black ${step.badgeBg}`}
							>
								0{i + 1}
							</span>
							<div className="grid leading-tight text-left">
								<h2 className="text-base font-black tracking-tight text-slate-900">
									{step.label}
								</h2>
								<p className="text-sm font-bold text-slate-600">{step.desc}</p>
							</div>
						</div>
						<div className="flex h-7 w-7 shrink-0 items-center justify-center text-slate-700">
							{step.icon}
						</div>
					</div>
				))}
			</div>

			{/* Tablet & Desktop (>= 640px): 2x2 Grid using Tailwind 'hidden sm:grid grid-cols-2 gap-4' */}
			<div className="hidden sm:grid grid-cols-2 gap-4 w-full">
				{steps.map((step, i) => (
					<div
						key={step.label}
						className="relative flex cursor-default flex-col justify-between overflow-hidden rounded-2xl border-[1.5px] border-slate-200/90 bg-white/90 p-5 text-slate-900 shadow-lg shadow-slate-900/5 backdrop-blur-md"
					>
						{/* Top Row: Numeric Badge + Icon */}
						<div className="flex items-center justify-between z-10">
							<span
								className={`inline-flex h-9 w-9 items-center justify-center rounded-xl font-mono text-sm font-black shadow-xs ${step.badgeBg}`}
							>
								0{i + 1}
							</span>
							<div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
								{step.icon}
							</div>
						</div>

						{/* Content */}
						<div className="grid gap-1 text-left pt-3 z-10">
							<h2 className="text-xl font-black tracking-tight text-slate-900 flex items-center gap-1.5">
								<span className="font-mono text-sm font-bold text-rose-600">
									/
								</span>
								{step.label}
							</h2>
							<p className="text-base font-medium leading-relaxed text-slate-600">
								{step.desc}
							</p>
						</div>
					</div>
				))}
			</div>
		</section>
	);
}
