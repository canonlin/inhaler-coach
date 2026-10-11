/**
 * What is waiting, and where to go about it.
 *
 * This panel listed five follow-ups as plain rows. None of them could be
 * opened, worked, or even selected — the only way to reach one was the
 * 「全部 37 件」 link in the header. Read-only rows are decoration: information
 * a reader can neither act on nor needs in order to decide whether to act is
 * noise, and it made the screen look busy while leaving the work a click away.
 *
 * So the rule applied here is the one this end should follow throughout: a
 * thing on screen is either something you can do, or it is the figure that
 * tells you whether you need to do something. The counts are the second kind —
 * 37 open against 30 planned is what tells you whether to go. The rows are the
 * first kind: each is a link that lands on the queue with that follow-up ready
 * to complete, so seeing it and doing it are the same gesture.
 *
 * Every figure here comes from /api/followups, the same endpoint the queue
 * page reads, so the two cannot disagree. On an empty database this renders
 * 「沒有待追蹤案件」 rather than nothing, because a blank panel and "no work"
 * are different facts and only one of them is true most days.
 */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { type Followup, fetchFollowups } from "../../api-client";
import { cn } from "../../lib/utils";
import { Pending, Skeleton } from "./ui";

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
				<h2 className="text-base font-bold text-text">待追蹤</h2>
				{rows && rows.length > 0 && (
					<span className="text-caption font-semibold text-primary">
						全部 {rows.length} 件
					</span>
				)}
			</div>

			{failed ? (
				<p className="px-4 py-3 text-base text-text-secondary">
					讀不到待辦清單。
				</p>
			) : !rows ? (
				<Pending label="正在讀取待追蹤清單" rows={4} className="px-4 py-3">
					{/*
					 * Panel-shaped, not a word. 「載入中」 in this box is read as 「沒有
					 * 待追蹤案件」 by anyone skimming, and those two are the difference
					 * between working a backlog and believing it is clear. The skeleton
					 * occupies the header, the counts and the first rows, so the panel
					 * does not resize when the numbers land.
					 */}
					<Skeleton className="mb-3 h-5 w-16" />
					<Skeleton className="mb-4 h-8 w-32" />
					{[0, 1, 2].map((i) => (
						<Skeleton key={i} className="mb-2 h-4 w-full last:mb-0" />
					))}
				</Pending>
			) : rows.length === 0 ? (
				<p className="px-4 py-3 text-base text-text-secondary">
					沒有待追蹤案件。
				</p>
			) : (
				<>
					{/*
					 * The split is the number that decides where to start, so it
					 * leads. A single "37" would hide the fact that all of them
					 * are late, which is the opposite of the useful reading.
					 *
					 * The whole strip is the link: these counts exist to answer
					 * 「該不該去清佇列」, and going is the only thing you can do
					 * with the answer.
					 */}
					<Link
						to="/admin/followups"
						className="flex gap-4 border-b border-border-subtle px-4 py-3 hover:bg-surface-muted"
					>
						<p>
							<span className="block text-metric font-bold tabular-nums text-text">
								{rows.length}
							</span>
							<span className="text-caption text-text-secondary">未完成</span>
						</p>
						<p>
							<span
								className={cn(
									"block text-metric font-bold tabular-nums",
									overdue > 0 ? "text-danger" : "text-text",
								)}
							>
								{overdue}
							</span>
							<span className="text-caption text-text-secondary">已逾期</span>
						</p>
					</Link>

					<ul>
						{preview.map((f) => (
							<li
								key={f.id}
								className="border-b border-border-subtle/60 last:border-b-0"
							>
								<Link
									to={`/admin/followups?case=${f.id}`}
									className="flex items-baseline justify-between gap-3 px-4 py-2 hover:bg-surface-muted"
								>
									<span className="min-w-0">
										<span className="block truncate text-base text-text">
											…{f.mrn_tail}
										</span>
										<span className="block truncate text-caption text-text-muted">
											{f.task}
										</span>
									</span>
									<span
										className={cn(
											"shrink-0 text-caption tabular-nums",
											f.overdue ? "text-danger" : "text-text-secondary",
										)}
									>
										{f.due_end.slice(5)}
									</span>
								</Link>
							</li>
						))}
					</ul>

					{rows.length > PREVIEW && (
						<p className="px-4 pb-3 text-caption text-text-muted">
							另有 {rows.length - PREVIEW} 件在追蹤清單。
						</p>
					)}
				</>
			)}
		</aside>
	);
}
