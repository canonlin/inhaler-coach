/**
 * The steps still failing, and how much of the whole problem each one carries.
 *
 * ONE table, not two. The prototype shipped a rate-ranked table and a separate
 * Pareto over the same steps, which meant reading the same six rows twice. Here
 * the rate and the cumulative share sit on the same row.
 *
 * A table headed 「還是錯在這裡」 that then lists steps nobody got wrong is
 * arguing with itself, so zero-error steps are behind a toggle. On the 61-case
 * baseline they were more than half the rows.
 */
import { useState } from "react";
import type { StepRate } from "../../api-client";
import { STEP_BY_CODE } from "../../domain/steps.js";
import { Badge, Button, DataTable, Td, Th } from "./ui";

export function StepTable({
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
		return <p className="p-6 text-[15px] text-text-secondary">尚無資料。</p>;

	// Ordered by COUNT, matching the cumulative column. Sorting by rate while
	// showing cumulative makes the column non-monotonic and unreadable.
	const share = new Map(pareto.map((r) => [r.stepCode, r.share ?? 0]));
	const order = new Map(pareto.map((r, i) => [r.stepCode, i]));
	const ranked = [...rates].sort(
		(a, b) => (order.get(a.stepCode) ?? 999) - (order.get(b.stepCode) ?? 999),
	);

	const failing = ranked.filter((r) => r.wrong > 0);
	const clean = ranked.filter((r) => r.wrong === 0);
	const rows = showClean ? ranked : failing;
	const worstWrong = Math.max(1, ...pareto.map((r) => r.wrong));

	return (
		<div>
			{clean.length > 0 && (
				<div className="px-5 pt-4">
					<Button
						variant="ghost"
						size="sm"
						onClick={() => setShowClean((v) => !v)}
					>
						{showClean
							? `只看還在錯的 ${failing.length} 步`
							: `顯示沒有錯的 ${clean.length} 步`}
					</Button>
				</div>
			)}
			<DataTable>
				<caption className="sr-only">依錯誤率排序的步驟清單</caption>
				<thead>
					<tr>
						<Th className="w-16">步</Th>
						<Th>操作</Th>
						<Th className="w-24 text-right">錯誤率</Th>
						<Th className="w-28 text-right">錯／評估</Th>
						<Th className="w-48">佔全部錯誤</Th>
					</tr>
				</thead>
				<tbody>
					{rows.map((r) => {
						const cumulative = share.get(r.stepCode);
						const in80 = cumulative != null && cumulative <= 0.8;
						return (
							<tr
								key={r.stepCode}
								className={in80 ? "bg-danger-soft/30" : undefined}
							>
								<Td>
									<span className="inline-flex size-7 items-center justify-center rounded-md bg-surface-muted text-[15px] font-bold text-text">
										{r.stepCode.split("_")[1] ?? r.stepCode}
									</span>
								</Td>
								<Td>
									<span className="text-text">
										{STEP_BY_CODE[r.stepCode]?.text ?? ""}
									</span>
									{r.critical && (
										<Badge tone="warning" className="ml-2">
											★ 關鍵
										</Badge>
									)}
								</Td>
								<Td className="text-right font-semibold tabular-nums">
									{Math.round(r.errorRate * 100)}%
								</Td>
								<Td className="text-right tabular-nums text-text-secondary">
									{r.wrong}／{r.assessed}
								</Td>
								<Td>
									{r.wrong > 0 ? (
										<span className="flex items-center gap-2">
											<span className="h-2 flex-1 overflow-hidden rounded-full bg-surface-muted">
												<span
													className="block h-full rounded-full bg-primary"
													style={{
														inlineSize: `${(r.wrong / worstWrong) * 100}%`,
													}}
												/>
											</span>
											<span className="w-20 shrink-0 text-right text-xs tabular-nums text-text-secondary">
												累積 {Math.round((cumulative ?? 0) * 100)}%
											</span>
										</span>
									) : (
										<span className="text-text-muted">—</span>
									)}
								</Td>
							</tr>
						);
					})}
				</tbody>
			</DataTable>
		</div>
	);
}
