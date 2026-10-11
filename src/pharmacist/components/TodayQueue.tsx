/**
 * What is waiting today, shown next to the case-entry field.
 *
 * This screen was a single card floating in an empty viewport, which is what
 * made it read as a landing page rather than a back office. The fix is not
 * decoration — it is that a counter tool opened with no statement of pending
 * work. Today there are thirty-seven open follow-ups and none completed; the
 * pharmacist was being asked to notice that by going and looking for it.
 *
 * Everything here is read from the same endpoint the queue page uses, so the
 * counts cannot disagree with the list behind the link. Nothing is invented:
 * these are the rows /api/followups actually returns, capped to a handful
 * because the full queue has its own page.
 *
 * Silence is not an option here. On an empty database this renders "沒有待辦"
 * rather than nothing, because a blank panel and "no work" are different
 * information and only one of them is true most of the time.
 */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { type Followup, fetchFollowups } from "../../api-client";
import { cn } from "../../lib/utils";

const PREVIEW = 5;

export function TodayQueue() {
	const [rows, setRows] = useState<Followup[] | null>(null);
	const [failed, setFailed] = useState(false);

	useEffect(() => {
		let live = true;
		fetchFollowups()
			.then((d) => {
				if (live) setRows(d.followups);
			})
			.catch(() => {
				if (live) setFailed(true);
			});
		return () => {
			live = false;
		};
	}, []);

	const overdue = rows?.filter((f) => f.overdue).length ?? 0;
	// Sorted the same way the queue page sorts, so the preview starts with the
	// row that page would show first rather than an arbitrary one.
	const preview = rows?.slice(0, PREVIEW) ?? [];

	return (
		<aside className="rounded-lg border border-border-subtle bg-surface">
			<div className="flex items-baseline justify-between gap-2 border-b border-border-subtle px-4 py-3">
				<h2 className="text-[15px] font-bold text-text">待追蹤</h2>
				{rows && rows.length > 0 && (
					<Link
						to="/admin/followups"
						className="text-[13px] font-semibold text-primary hover:underline"
					>
						全部 {rows.length} 件
					</Link>
				)}
			</div>

			{failed ? (
				<p className="px-4 py-3 text-[15px] text-text-secondary">
					讀不到待辦清單。
				</p>
			) : !rows ? (
				<p className="px-4 py-3 text-[15px] text-text-muted">載入中…</p>
			) : rows.length === 0 ? (
				<p className="px-4 py-3 text-[15px] text-text-secondary">
					沒有待追蹤案件。
				</p>
			) : (
				<>
					{/*
					 * The split is the number that decides where to start, so it
					 * leads. A single "37" would hide the fact that all of them
					 * are late, which is the opposite of the useful reading.
					 */}
					<div className="flex gap-4 border-b border-border-subtle px-4 py-3">
						<p>
							<span className="block text-2xl font-bold tabular-nums text-text">
								{rows.length}
							</span>
							<span className="text-[13px] text-text-secondary">未完成</span>
						</p>
						<p>
							<span
								className={cn(
									"block text-2xl font-bold tabular-nums",
									overdue > 0 ? "text-danger" : "text-text",
								)}
							>
								{overdue}
							</span>
							<span className="text-[13px] text-text-secondary">已逾期</span>
						</p>
					</div>

					<ul className="px-4 py-2">
						{preview.map((f) => (
							<li
								key={f.id}
								className="flex items-baseline justify-between gap-3 border-b border-border-subtle/60 py-2 last:border-b-0"
							>
								<span className="min-w-0">
									<span className="block truncate text-[15px] text-text">
										…{f.mrn_tail}
									</span>
									<span className="block truncate text-[13px] text-text-muted">
										{f.task}
									</span>
								</span>
								<span
									className={cn(
										"shrink-0 text-[13px] tabular-nums",
										f.overdue ? "text-danger" : "text-text-secondary",
									)}
								>
									{f.due_end.slice(5)}
								</span>
							</li>
						))}
					</ul>

					{rows.length > PREVIEW && (
						<p className="px-4 pb-3 text-[13px] text-text-muted">
							另有 {rows.length - PREVIEW} 件在追蹤清單。
						</p>
					)}
				</>
			)}
		</aside>
	);
}
