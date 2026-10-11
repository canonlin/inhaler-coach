/**
 * Where the errors actually are.
 *
 * This is the page's anchor, not the verdict. The 61-case baseline is the only
 * finding on this screen with substantial evidence behind it, and it is also the
 * one that changes what somebody does tomorrow: fix the steps that carry most of
 * the failures. The before/after comparison is genuinely important but sits at
 * 收案 1/30 today, so it is sized by its own evidence (see Verdict) rather than
 * given the largest type on the page.
 *
 * One pass, not two. The prototype shipped a rate table and a separate Pareto
 * over the same steps, which made the reader cross the same rows twice; the
 * merged earlier fix kept them merged, and this keeps the bar and its numbers on
 * the same row instead of reintroducing a second pass.
 *
 * Three encoding decisions, each with one meaning:
 *
 * - Bar colour is the 80% band, not criticality. Criticality was the obvious
 *   choice and it failed on the real data: nearly every step on the QCC
 *   checklist is marked ★, so colouring by it painted fifteen bars the same red
 *   and the channel carried nothing. Criticality is already said once, by the
 *   ★ badge, which is a shape cue and survives being printed in greyscale.
 * - The band is marked once, at its boundary. The first version labelled every
 *   row inside it, which put 「80% 關鍵區」 on eight of fifteen rows — a
 *   repetition that reads as decoration and marks everything, i.e. nothing. One
 *   rule after the last step of the band states the same fact at the only place
 *   the reader needs it.
 * - The running total is the number that decides where to stop, so it is set
 *   at reading size in its own aligned column, not as a footnote hanging off the
 *   end of a bar.
 */
import { useState } from "react";
import type { StepRate } from "../../api-client";
import { STEP_BY_CODE } from "../../domain/steps.js";
import { cn } from "../../lib/utils";
import { Badge, Button } from "./ui";

export function StepPareto({
	rates,
	pareto,
}: {
	rates: StepRate[];
	pareto: StepRate[];
}) {
	// Before the early return: a hook after one makes the hook count depend on
	// whether data has loaded, which React treats as a violation.
	const [showClean, setShowClean] = useState(false);

	if (!rates.length)
		return <p className="p-6 text-base text-text-secondary">尚無資料。</p>;

	const order = new Map(pareto.map((r, i) => [r.stepCode, i]));

	// Ordered by COUNT, matching the running total. Sorting by rate while
	// showing cumulative makes the running total non-monotonic and unreadable.
	const ranked = [...rates].sort(
		(a, b) => (order.get(a.stepCode) ?? 999) - (order.get(b.stepCode) ?? 999),
	);

	const failing = ranked.filter((r) => r.wrong > 0);
	const clean = ranked.filter((r) => r.wrong === 0);
	const rows = showClean ? ranked : failing;
	const worstWrong = Math.max(1, ...failing.map((r) => r.wrong));

	// The band boundary and the summary sentence come from one computation. The
	// first version marked rows by the API's own `share` field while counting
	// the band from a local running total, so the sentence could name eight
	// steps while the labels fell on a different eight.
	const totalWrong = failing.reduce((a, r) => a + r.wrong, 0);
	/*
	 * Below this many errors the Pareto cannot say anything useful: the top step
	 * always carries all of them, so the band is always 100% and the ranking
	 * carries no information. "2 個步驟佔了全部 2 次錯誤的 100%" is arithmetically
	 * true, reads as a finding, and distinguishes nothing — the same failure as
	 * the error rate headlining a single patient's result.
	 */
	const MIN_ERRORS_FOR_A_CLAIM = 8;
	const tooFewToConclude = totalWrong < MIN_ERRORS_FOR_A_CLAIM;
	let running = 0;
	let bandEnd = -1;
	for (let i = 0; i < failing.length; i += 1) {
		if (bandEnd !== -1) break;
		running += failing[i].wrong;
		if (totalWrong > 0 && running / totalWrong >= 0.8) bandEnd = i;
	}
	const bandCount = bandEnd + 1;
	const bandWrong = failing
		.slice(0, bandCount)
		.reduce((a, r) => a + r.wrong, 0);
	// Membership by code, so each row is a lookup rather than a search.
	const bandCodes = new Set(failing.slice(0, bandCount).map((r) => r.stepCode));

	return (
		<div>
			<div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 px-5 pt-5">
				<p className="max-w-prose text-base leading-relaxed text-text-secondary">
					{totalWrong === 0 ? (
						"目前沒有任何步驟被記為錯誤。"
					) : tooFewToConclude ? (
						<>
							目前只有 {totalWrong} 次錯誤，還看不出哪幾步是主要問題。
							等收案累積之後，這裡才會告訴你先修哪幾步。
						</>
					) : bandCount > 0 ? (
						<>
							最錯的{" "}
							<strong className="text-base text-text">
								{bandCount} 個步驟
							</strong>
							就佔了全部 {totalWrong} 次錯誤的{" "}
							<strong className="text-base text-text">
								{Math.round((bandWrong / totalWrong) * 100)}%
							</strong>
							。先把這幾步練好，其餘的不用重做。
						</>
					) : null}
				</p>
				{clean.length > 0 && (
					<Button
						variant="ghost"
						size="sm"
						onClick={() => setShowClean((v) => !v)}
					>
						{showClean
							? `只看還在錯的 ${failing.length} 步`
							: `顯示沒有錯的 ${clean.length} 步`}
					</Button>
				)}
			</div>

			<div className="mt-4 grid grid-cols-[2.25rem_minmax(0,1fr)_6.5rem] items-end gap-x-3 border-y border-border-subtle px-5 pb-2 text-caption font-bold tracking-wide text-text-secondary">
				<span className="sr-only">步驟</span>
				<span>操作</span>
				<span className="text-right">累積 · 錯/評估</span>
			</div>

			<ol className="px-5 pb-2">
				{rows.map((r) => {
					// showClean puts zero-error steps into the list; they have no
					// place in the running order, so they never carry the band.
					const inBand = showClean ? false : bandCodes.has(r.stepCode);
					const cumulative = cumulativeUpTo(r, ranked);
					const isBoundary =
						!showClean &&
						!tooFewToConclude &&
						failing[bandEnd]?.stepCode === r.stepCode;

					return (
						<li key={r.stepCode}>
							<div className="grid grid-cols-[2.25rem_minmax(0,1fr)_6.5rem] items-center gap-x-3 border-b border-border-subtle/60 py-2.5">
								<span className="inline-flex size-7 items-center justify-center rounded-md bg-surface-muted text-base font-bold tabular-nums text-text">
									{r.stepCode.split("_")[1] ?? r.stepCode}
								</span>

								<div className="min-w-0">
									<div className="flex flex-wrap items-baseline gap-x-2">
										<span className="truncate text-base text-text">
											{STEP_BY_CODE[r.stepCode]?.text ?? ""}
										</span>
										{r.critical && (
											<Badge tone="warning" className="shrink-0">
												★ 關鍵
											</Badge>
										)}
									</div>

									{r.wrong > 0 && (
										<span className="mt-1.5 block h-2.5 overflow-hidden rounded-full bg-surface-muted">
											<span
												className={cn(
													"block h-full rounded-full",
													inBand ? "bg-primary" : "bg-primary/35",
												)}
												style={{
													inlineSize: `${(r.wrong / worstWrong) * 100}%`,
												}}
											/>
										</span>
									)}
								</div>

								{/* The running total decides where to stop, so it is the
								    one number given its own column at reading size rather
								    than hanging off the end of a bar in grey. */}
								<div className="text-right tabular-nums">
									{r.wrong > 0 ? (
										<p
											className={cn(
												"text-base font-bold",
												inBand ? "text-primary" : "text-text-secondary",
											)}
										>
											{Math.round(cumulative * 100)}%
										</p>
									) : (
										<p className="text-base text-text-muted">—</p>
									)}
									<p className="text-caption text-text-secondary">
										<span className="text-text">{r.wrong}</span>
										<span className="text-text-muted">／{r.assessed}</span>
									</p>
								</div>
							</div>

							{/* The band boundary, stated once. */}
							{isBoundary && (
								<p className="flex items-center gap-3 border-b-2 border-primary/40 py-2 text-caption font-semibold text-primary">
									<span className="h-2 w-2 shrink-0 rounded-full bg-primary" />
									以上 {bandCount} 個步驟佔全部錯誤的{" "}
									{Math.round((bandWrong / totalWrong) * 100)}%，先修這些
								</p>
							)}
						</li>
					);
				})}
			</ol>
		</div>
	);
}

/**
 * Running share of all errors up to and including this step, computed in the
 * ranked order so the column is monotonic. The API's own `share` is not used
 * here because it disagreed with the band count in the first version.
 */
function cumulativeUpTo(r: StepRate, ranked: StepRate[]): number {
	const total = ranked.reduce((a, x) => a + x.wrong, 0);
	if (total <= 0) return 0;
	let running = 0;
	for (const x of ranked) {
		running += x.wrong;
		if (x.stepCode === r.stepCode) return running / total;
	}
	return 0;
}
