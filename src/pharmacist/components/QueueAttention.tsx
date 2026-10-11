/**
 * What needs attention on this queue, before the list.
 *
 * The queue is thirty-seven rows that all look the same: the same 逾期 badge,
 * the same date column, the same two buttons. Nothing tells the eye where to
 * start, which made "attention first" impossible — there was no attention
 * anywhere to put first.
 *
 * Banding the rows by lateness does not fix it, because the data does not have
 * bands. Every open follow-up here is between 98 and 159 days late; measured,
 * not assumed (see the note in QueueAttention). Colouring a gradient across a
 * range where nothing is near the threshold would invent a distinction the data
 * does not support, and the ranking would be an artefact of a colour ramp
 * rather than a fact about the patient's care.
 *
 * So the attention goes to the thing that is actually true and actually
 * unusual: the whole queue is late, by a lot, and none of it has moved. That
 * is one fact, stated once, at the top — and the rows keep a single consistent
 * danger treatment because "everything is late" is the finding, not a
 * gradient within it.
 *
 * This states measured counts and stops there. Whether a five-month backlog is
 * worked call by call or closed off as missed is the pharmacist's call and is
 * not implied here; the panel reports, it does not recommend.
 */
import { useMemo } from "react";

import type { Followup } from "../../api-client";
import { cn } from "../../lib/utils";

const DAY = 86_400_000;

export function QueueAttention({
	rows,
	view,
	closedToday,
}: {
	rows: Followup[];
	view: "today" | "all";
	closedToday: number;
}) {
	const stats = useMemo(() => {
		const today = new Date().toISOString().slice(0, 10);
		const days = rows.map((f) =>
			Math.floor((Date.parse(today) - Date.parse(f.due_end)) / DAY),
		);
		const late = days.filter((d) => d > 0);
		if (late.length === 0) return null;
		const sorted = [...late].sort((a, b) => b - a);
		return {
			total: rows.length,
			lateCount: late.length,
			worst: sorted[0],
			// Median rather than mean: with a 98–159 day spread a single very
			// old row drags a mean into a figure that describes none of them.
			median: sorted[Math.floor(sorted.length / 2)],
			earliest: sorted[sorted.length - 1],
		};
	}, [rows]);

	/*
	 * Rendered even when nothing is outstanding, because an empty queue is not
	 * the same as a blank screen: the pharmacist still needs to see that the
	 * work they just did was recorded. Returning null here left the page with
	 * no statement at all the moment the last item closed, which is precisely
	 * when the confirmation is worth having.
	 */
	if (!stats) {
		if (rows.length > 0) return null;
		return (
			<div
				role="status"
				data-testid="queue-attention"
				className="rounded-lg border border-success/40 bg-success-soft px-5 py-4"
			>
				<p className="text-lg font-bold text-success">沒有待追蹤案件</p>
				<p className="mt-1 text-base text-text-secondary">
					{closedToday > 0
						? `今日已結案 ${closedToday} 件。`
						: "目前沒有需要處理的追蹤。"}
				</p>
			</div>
		);
	}

	/*
	 * A queue where every item is late is a different situation from one where
	 * some are, and it deserves different words. One late item is a task; the
	 * entire queue being three to five months late is a fact about the service,
	 * so the panel says so rather than repeating the row's own message.
	 */
	const wholeQueueLate = stats.lateCount === stats.total;

	return (
		<div
			role="status"
			data-testid="queue-attention"
			className={cn(
				"rounded-lg border px-5 py-4",
				wholeQueueLate
					? "border-danger/40 bg-danger-soft"
					: "border-warning/40 bg-warning-soft",
			)}
		>
			<p
				className={cn(
					"text-lg font-bold",
					wholeQueueLate ? "text-danger" : "text-warning",
				)}
			>
				{wholeQueueLate
					? `${stats.total} 件全部逾期`
					: `${stats.total} 件中 ${stats.lateCount} 件逾期`}
			</p>
			<p className="mt-1 text-base leading-relaxed text-text-secondary">
				最久 <strong className="text-text">{stats.worst}</strong> 天， 中位數{" "}
				<strong className="text-text">{stats.median}</strong> 天， 最短{" "}
				<strong className="text-text">{stats.earliest}</strong> 天。
				{closedToday > 0
					? `今日已結案 ${closedToday} 件。`
					: view === "today"
						? "今日尚未結案。"
						: ""}
			</p>
		</div>
	);
}
