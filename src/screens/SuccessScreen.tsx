import { IconArrowRight, IconCheck } from "../components/icons";

type SuccessScreenProps = {
	onRestart: () => void;
};

const completedSteps = [
	{ number: "01", title: "振搖", detail: "使用前持續上下搖勻 5 秒" },
	{ number: "02", title: "吐氣", detail: "吸入前慢慢吐氣，遠離吸嘴" },
	{
		number: "03",
		title: "壓吸＋憋氣",
		detail: "同步按壓與深慢吸氣，再憋氣約 10 秒（以舒適為限）",
	},
	{ number: "04", title: "漱口", detail: "吸藥後以清水漱口並吐掉" },
];

export function SuccessScreen({ onRestart }: SuccessScreenProps) {
	return (
		<main className="fixed inset-0 z-50 overflow-x-hidden overflow-y-auto bg-slate-50 text-slate-900">
			<div className="pointer-events-none absolute inset-x-0 top-0 h-1.5 bg-rose-600" />
			<div className="pointer-events-none absolute -top-20 right-0 h-72 w-72 rounded-full bg-rose-100/70 blur-3xl" />

			<div className="relative mx-auto flex min-h-[100dvh] w-full max-w-5xl items-center px-5 py-10 sm:px-8 sm:py-14">
				<section className="w-full rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-900/10 sm:p-10 lg:p-12">
					<div className="flex flex-col gap-8 lg:grid lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-12">
						<header>
							<div className="mb-5 inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-3 py-1.5 font-mono text-xs font-bold tracking-[0.14em] text-rose-800">
								<span className="h-2 w-2 rounded-full bg-rose-600" />
								INHALER COACH
							</div>

							<div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200">
								<IconCheck className="h-8 w-8" />
							</div>

							<p className="font-mono text-xs font-bold tracking-[0.16em] text-rose-700">
								PRACTICE COMPLETE
							</p>
							<h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
								四關練習完成
							</h1>
							<p className="mt-3 max-w-md text-base font-bold leading-7 text-slate-600">
								你已依序完成吸入器的四個操作重點。需要時，可以回到開場重新練習。
							</p>

							<button
								type="button"
								onClick={onRestart}
								className="mt-7 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-rose-600 px-6 py-3 font-black text-white shadow-lg shadow-rose-600/25 transition-colors hover:bg-rose-700 sm:w-auto"
							>
								再練一次
								<IconArrowRight className="h-5 w-5" />
							</button>
						</header>

						<div>
							<h2 className="text-sm font-black tracking-wide text-slate-700">
								本次完成項目
							</h2>
							<div className="mt-3 grid gap-3 sm:grid-cols-2">
								{completedSteps.map((step) => (
									<div
										key={step.number}
										className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
									>
										<div className="flex items-start gap-3">
											<span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-950 font-mono text-xs font-bold text-white">
												{step.number}
											</span>
											<div>
												<h3 className="font-black text-slate-900">
													{step.title}
												</h3>
												<p className="mt-1 text-sm leading-5 text-slate-600">
													{step.detail}
												</p>
											</div>
										</div>
									</div>
								))}
							</div>
							<p className="mt-4 text-xs leading-5 text-slate-500">
								本工具供衛教練習使用，不能取代醫師或藥師的專業判斷。
							</p>
						</div>
					</div>
				</section>
			</div>
		</main>
	);
}
