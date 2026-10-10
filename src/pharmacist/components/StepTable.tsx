/**
 * The steps still failing, and how much of the whole problem each one carries.
 *
 * This is ONE table, not two. The prototype shipped a rate-ranked table and a
 * separate Pareto over the same steps, which meant reading the same six rows
 * twice. Here the rate and the cumulative share sit on the same row, so the
 * QCC reviewer can go from "this step is bad" to "fixing these six covers 80%"
 * without scrolling to a second block.
 */

import { STEP_BY_CODE } from "../../domain/steps.js";
import type { StepRate } from "../../api-client";

export function StepTable({
	rates,
	pareto,
}: {
	rates: StepRate[];
	pareto: StepRate[];
}) {
	if (!rates.length) return <p className="empty">尚無資料。</p>;

	// Ordered by COUNT, matching the cumulative column. Sorting by rate while
	// showing cumulative makes the column non-monotonic and unreadable.
	const share = new Map(pareto.map((r) => [r.stepCode, r.share ?? 0]));
	const order = new Map(pareto.map((r, i) => [r.stepCode, i]));
	const ordered = [...rates].sort(
		(a, b) => (order.get(a.stepCode) ?? 999) - (order.get(b.stepCode) ?? 999),
	);
	// Bars scale to the worst step so the top row fills the track; the label
	// carries the cumulative share, which is the number a reviewer acts on.
	const worstWrong = Math.max(1, ...pareto.map((r) => r.wrong));

	return (
		<table className="steps">
			<caption className="sr-only">依錯誤率排序的步驟清單</caption>
			<thead>
				<tr>
					<th scope="col">步驟</th>
					<th scope="col" className="num">
						錯誤率
					</th>
					<th scope="col" className="num">
						錯／評估
					</th>
					<th scope="col">佔全部錯誤</th>
				</tr>
			</thead>
			<tbody>
				{ordered.map((r) => {
					const cumulative = share.get(r.stepCode);
					const in80 = cumulative != null && cumulative <= 0.8;
					return (
						<tr key={r.stepCode} className={in80 ? "in80" : undefined}>
							<th scope="row">
								{r.critical && (
									<span className="crit" title="關鍵步驟">
										★
									</span>
								)}
								<span className="step-char">
									{r.stepCode.split("_")[1] ?? r.stepCode}
								</span>
								<span className="step-text">
									{STEP_BY_CODE[r.stepCode]?.text ?? ""}
								</span>
							</th>
							<td className="num">{Math.round(r.errorRate * 100)}%</td>
							<td className="num muted">
								{r.wrong}／{r.assessed}
							</td>
							<td>
								{r.wrong > 0 ? (
									<span className="share-cell">
										<span className="share">
											<span
												className="share-fill"
												style={{
													inlineSize: `${worstWrong ? (r.wrong / worstWrong) * 100 : 0}%`,
												}}
											/>
										</span>
										<span className="num muted">
											累積 {Math.round((cumulative ?? 0) * 100)}%
										</span>
									</span>
								) : (
									<span className="muted">—</span>
								)}
							</td>
						</tr>
					);
				})}
			</tbody>
		</table>
	);
}
