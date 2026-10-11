/**
 * Steps before → after, one row per step, both rates side by side.
 *
 * This panel existed in the original dashboard and was dropped. What replaced it
 * was a single cohort's error counts in a bar chart, which cannot answer the
 * only question that matters once an intervention has run: did this step move,
 * and if it did not, is that because it was not worked on?
 *
 * Three rules come from the original and are kept, because each one is a way a
 * chart can lie:
 *
 *   1. The denominator is the people assessed on THAT step, not the cohort.
 *      A step skipped by most cases has a tiny denominator, and 2 of 2 is 100%.
 *   2. Rows are ordered by the baseline rate, because the pre-intervention
 *      error is what says which steps were worth fixing. Ordering by the
 *      after rate would let a step that improved sharply outrank one that never
 *      moved.
 *   3. ▲ 頑固 marks a step still at or above 25% in both cohorts — and only
 *      when the post cohort is large enough to support the claim. See
 *      MIN_ASSESSED_FOR_STUBBORN.
 *
 * The colour is the rate and the ▲ is the finding. They are separate jobs, and
 * a cell that is red because 2 of 18 people were wrong is not the same signal as
 * one that is red because 20 of 40 were — the number next to it is what tells
 * them apart, which is why it is always shown.
 */
import { STEP_BY_CODE } from "../../domain/steps.js";
import { cn } from "../../lib/utils";

export interface StepPair {
	stepCode: string;
	critical: boolean;
	before: { rate: number; assessed: number } | null;
	after: { rate: number; assessed: number } | null;
	stubborn: boolean;
	noAfterData: boolean;
}

/** Denominators under this are printed with the figure rather than trusted to it. */
const THIN_DENOMINATOR = 5;

function pct(rate: number): string {
	return `${Math.round(rate * 100)}%`;
}

/**
 * Colour by rate, in three bands rather than a gradient.
 *
 * A continuous scale would spend its full range on the difference between 41%
 * and 42%, which is one person, while making 30% and 70% look the same hue. The
 * bands are where the decision changes: under a quarter, over a quarter, over
 * half.
 */
function rateTone(rate: number): string {
	if (rate >= 0.5) return "bg-danger-soft text-danger";
	if (rate >= 0.25) return "bg-warning-soft text-warning";
	return "bg-surface-muted text-text-secondary";
}

export function StepHeatmap({ steps }: { steps: StepPair[] }) {
	if (!steps.length) {
		return <p className="text-base text-text-secondary">沒有步驟評估資料。</p>;
	}

	return (
		<div className="overflow-x-auto">
			<table
				className="w-full border-collapse text-base"
				data-testid="step-heatmap"
			>
				<caption className="sr-only">每個步驟在改善前與改善後的錯誤率</caption>
				<thead>
					<tr>
						<th
							scope="col"
							className="px-3 py-2 text-left font-semibold text-text-secondary"
						>
							步驟
						</th>
						<th
							scope="col"
							className="w-28 px-3 py-2 text-right font-semibold text-text-secondary"
						>
							改善前
						</th>
						<th
							scope="col"
							className="w-28 px-3 py-2 text-right font-semibold text-text-secondary"
						>
							改善後
						</th>
						<th
							scope="col"
							className="px-3 py-2 text-left font-semibold text-text-secondary"
						>
							變化
						</th>
					</tr>
				</thead>
				<tbody>
					{steps.map((s) => {
						const label = STEP_BY_CODE[s.stepCode]?.text ?? s.stepCode;
						const before = s.before;
						const after = s.after;
						/*
						 * Improvement is stated as the difference, because both
						 * rates carry a denominator that differs between cohorts
						 * and "60% → 30%" reads as a halving even when the second
						 * figure rests on three people. The denominators are on
						 * screen either way; this says which direction it went.
						 */
						const delta = before && after ? after.rate - before.rate : null;
						const afterN = after?.assessed ?? 0;
						const thin = afterN > 0 && afterN < THIN_DENOMINATOR;

						return (
							<tr
								key={s.stepCode}
								className="border-b border-border-subtle/60 last:border-b-0"
							>
								<th
									scope="row"
									className="px-3 py-2 text-left font-normal text-text"
								>
									<span className="inline-flex items-baseline gap-2">
										<span className="truncate">{label}</span>
										{s.critical && (
											<span
												title="關鍵步驟"
												className="shrink-0 text-caption font-bold text-danger"
											>
												★
											</span>
										)}
									</span>
								</th>
								<td className="px-3 py-2 text-right">
									{before ? (
										<span
											className={cn(
												"inline-block rounded px-2 py-0.5 tabular-nums",
												rateTone(before.rate),
											)}
										>
											{pct(before.rate)}
											<span className="ml-1 opacity-70">
												／{before.assessed}
											</span>
										</span>
									) : (
										<span className="text-text-muted">—</span>
									)}
								</td>
								<td className="px-3 py-2 text-right">
									{after ? (
										<span
											className={cn(
												"inline-block rounded px-2 py-0.5 tabular-nums",
												rateTone(after.rate),
											)}
										>
											{pct(after.rate)}
											<span className="ml-1 opacity-70">
												／{after.assessed}
											</span>
										</span>
									) : (
										<span className="text-text-muted">沒有資料</span>
									)}
								</td>
								<td className="px-3 py-2">
									{delta === null ? (
										<span className="text-text-muted">—</span>
									) : !after ? (
										<span className="text-text-muted">—</span>
									) : thin ? (
										<span className="text-caption text-text-muted">
											改善後只有 {after?.assessed} 人，這個變化看不出來
										</span>
									) : (
										<span
											className={cn(
												"font-semibold tabular-nums",
												delta < 0
													? "text-success"
													: delta > 0
														? "text-danger"
														: "text-text-muted",
											)}
										>
											{delta === 0
												? "沒變"
												: `${delta < 0 ? "↓" : "↑"} ${pct(Math.abs(delta))}`}
										</span>
									)}
									{s.stubborn && (
										<span
											title="改善後仍 ≥25%，且樣本足夠：這一項沒有被處理好"
											className="ml-2 font-bold text-danger"
										>
											▲ 頑固
										</span>
									)}
								</td>
							</tr>
						);
					})}
				</tbody>
			</table>
			<p className="border-t border-border px-3 pt-3 pb-4 text-base text-text-secondary">
				<span className="font-semibold text-text">註：</span>數字為
				{/*
				 * Marked 註：, not left to look different.
				 *
				 * Raising this from 13px to the 16px floor to satisfy the type scale
				 * left it identical to the body text above. A hairline rule above it
				 * was the second attempt and is invisible against this surface — so
				 * both attempts carried a distinction that had to be plain on
				 * subtlety. A label says what it is, reaches a screen reader, and
				 * cannot be lost against a background.
				 */}
				「做錯的人數／評估這一步的人數」。▲ 只在改善後樣本足夠時才出現；
				不足時寧可留白，因為把一個其實改善了的步驟標成頑固，會讓藥師去重新教一個
				已經改好的步驟。
			</p>
		</div>
	);
}
