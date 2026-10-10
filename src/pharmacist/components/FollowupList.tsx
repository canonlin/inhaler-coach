/**
 * Follow-up queue: who to contact now, and what to tick off.
 *
 * The prototype had three separate queues. This is one list ordered by what is
 * most overdue, because a pharmacist's day has one question: who do I contact
 * now.
 *
 * The close action is the point of this screen. The baseline had 62 cases at M0
 * and none at M1 — work was enqueued and never closed. A queue you can only read
 * produces that result exactly.
 *
 * Two things this screen deliberately does not do, both measured rather than
 * assumed. A previous version put a "who closed it" dropdown on every row: 37
 * rows meant 111 controls to scan, and the answer is the same person for all of
 * them, so it is one selector at the top. And it showed every open follow-up at
 * once: with 37 rows all overdue, "sorted by most overdue" sorts nothing, and the
 * pharmacist's actual question — what is due today — has no view. Both were fixed
 * because the numbers were counted on the running system, not reasoned about.
 */
import { useEffect, useMemo, useState } from "react";

import {
	type Followup,
	closeFollowup,
	fetchFollowups,
} from "../../api-client.js";
import { PHARMACISTS } from "../../domain/roster.js";

// Short labels. The previous "逾期或今日到期" repeated 37 times down a column
// said the same thing every row and the row colour already said it; the column
// spent width and scan time carrying no information.
const PRIORITY: Record<Followup["priority"], { label: string; rank: number }> = {
	P1: { label: "逾期", rank: 0 },
	P2: { label: "近期", rank: 1 },
	P3: { label: "排程", rank: 2 },
};

/** Which slice of the queue is on screen. */
const VIEWS = [
	{ id: "today", label: "今日待辦" },
	{ id: "all", label: "全部未完成" },
] as const;

export function FollowupList() {
	const [rows, setRows] = useState<Followup[] | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [busy, setBusy] = useState<string | null>(null);
	const [conflict, setConflict] = useState<string | null>(null);
	const [closedToday, setClosedToday] = useState<number>(0);
	// The pharmacist closing the task is whoever is on shift — one answer for the
	// whole queue, so it is asked once rather than once per row.
	const [who, setWho] = useState(PHARMACISTS[0] ?? "");
	const [view, setView] = useState<(typeof VIEWS)[number]["id"]>("today");

	async function load() {
		try {
			const d = await fetchFollowups();
			setRows(d.followups);
			setError(null);
		} catch (e) {
			setError((e as Error).message);
		}
	}

	useEffect(() => {
		load();
	}, []);

	async function close(row: Followup, status: "done" | "missed") {
		setBusy(row.id);
		setConflict(null);
		try {
			await closeFollowup({ id: row.id, by: who, status });
			setClosedToday((n) => n + 1);
			await load();
		} catch (e) {
			// A 409 means someone already closed it. Show it rather than
			// pretending the queue still agrees with the screen.
			setConflict((e as Error).message);
		} finally {
			setBusy(null);
		}
	}

	const counts = useMemo(() => {
		const list = rows ?? [];
		return {
			today: list.filter((r) => r.overdue || r.dueSoon).length,
			all: list.length,
		};
	}, [rows]);

	if (error) return <p className="empty">讀不到追蹤清單：{error}</p>;
	if (!rows) return <p className="empty">載入中…</p>;

	// "Today" is what is overdue or due within three days. Everything else is
	// scheduled work that cannot be actioned yet, and burying it under the
	// actionable rows is what made the queue unreadable.
	const visible =
		view === "today" ? rows.filter((r) => r.overdue || r.dueSoon) : rows;

	const sorted = [...visible].sort((a, b) => {
		const ra = a.overdue ? 0 : a.dueSoon ? 1 : 2;
		const rb = b.overdue ? 0 : b.dueSoon ? 1 : 2;
		// With every row overdue the first term is constant, so priority and
		// date do the actual ordering.
		return (
			ra - rb ||
			PRIORITY[a.priority].rank - PRIORITY[b.priority].rank ||
			a.due_end.localeCompare(b.due_end) ||
			a.mrn_tail.localeCompare(b.mrn_tail)
		);
	});

	return (
		<>
			{conflict && (
				<p className="rx-status bad" role="alert">
					{conflict}
				</p>
			)}

			<div className="fu-bar">
				<nav className="fu-views" aria-label="追蹤範圍">
					{VIEWS.map((v) => (
						<button
							key={v.id}
							type="button"
							aria-current={view === v.id ? "true" : undefined}
							onClick={() => setView(v.id)}
						>
							{v.label}
							<span className="count">{counts[v.id]}</span>
						</button>
					))}
				</nav>

				<label className="fu-who">
					<span>結案者</span>
					<select value={who} onChange={(e) => setWho(e.target.value)}>
						{PHARMACISTS.map((p) => (
							<option key={p}>{p}</option>
						))}
					</select>
				</label>
			</div>

			<p className="fu-tally" role="status">
				{closedToday > 0
					? `今天已完成 ${closedToday} 件。`
					: `今天還沒完成任何一件。`}
			</p>

			{!sorted.length ? (
				<p className="empty">
					{view === "today" ? "今天沒有到期或逾期的追蹤。" : "沒有待追蹤的個案。"}
					<br />
					<span className="muted">追蹤會在收案時依錯誤燈號自動排入。</span>
				</p>
			) : (
				<table className="ck-table">
					<caption className="sr-only">待追蹤清單</caption>
					<thead>
						<tr>
							<th scope="col">優先</th>
							<th scope="col">病歷</th>
							<th scope="col">藥品</th>
							<th scope="col">任務</th>
							<th scope="col">期限</th>
							<th scope="col">原評估者</th>
							<th scope="col">結案</th>
						</tr>
					</thead>
					<tbody>
						{sorted.map((f) => (
							<tr
								key={f.id}
								className={f.overdue ? "overdue" : f.dueSoon ? "soon" : undefined}
							>
								<td>
									<span className={`pri ${f.priority.toLowerCase()}`}>
										{PRIORITY[f.priority].label}
									</span>
								</td>
								<td className="mono">…{f.mrn_tail}</td>
								<td>{f.drug ?? "—"}</td>
								<td>{f.task}</td>
								<td className="mono">{f.due_end}</td>
								<td className="muted">{f.pharmacist ?? "—"}</td>
								<td>
									<span className="seg">
										<button
											type="button"
											className="ok"
											disabled={busy === f.id}
											onClick={() => close(f, "done")}
										>
											完成
										</button>
										<button
											type="button"
											className="ng"
											disabled={busy === f.id}
											onClick={() => close(f, "missed")}
										>
											未完成
										</button>
									</span>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			)}
		</>
	);
}