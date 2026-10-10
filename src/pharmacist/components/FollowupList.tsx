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
 */
import { useEffect, useState } from "react";

import {
	type Followup,
	closeFollowup,
	fetchFollowups,
} from "../../api-client.js";
import { PHARMACISTS } from "../../domain/roster.js";

const PRIORITY: Record<Followup["priority"], { label: string; rank: number }> = {
	P1: { label: "逾期或今日到期", rank: 0 },
	P2: { label: "3 天內到期", rank: 1 },
	P3: { label: "排程中", rank: 2 },
};

export function FollowupList() {
	const [rows, setRows] = useState<Followup[] | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [busy, setBusy] = useState<string | null>(null);
	const [conflict, setConflict] = useState<string | null>(null);
	const [closedToday, setClosedToday] = useState<string[]>([]);
	// The pharmacist closing the task is whoever is signed in for the shift.
	const [who, setWho] = useState(PHARMACISTS[0] ?? "");

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
			setClosedToday((prev) => [...prev, row.mrn_tail]);
			await load();
		} catch (e) {
			// A 409 means someone already closed it. Show it rather than
			// pretending the queue still agrees with the screen.
			setConflict((e as Error).message);
		} finally {
			setBusy(null);
		}
	}

	if (error) return <p className="empty">讀不到追蹤清單：{error}</p>;
	if (!rows) return <p className="empty">載入中…</p>;

	const sorted = [...rows].sort((a, b) => {
		const ra = a.overdue ? 0 : a.dueSoon ? 1 : 2;
		const rb = b.overdue ? 0 : b.dueSoon ? 1 : 2;
		return (
			ra - rb ||
			PRIORITY[a.priority].rank - PRIORITY[b.priority].rank ||
			a.due_end.localeCompare(b.due_end)
		);
	});

	return (
		<>
			{conflict && (
				<p className="rx-status bad" role="alert">
					{conflict}
				</p>
			)}

			{closedToday.length > 0 && (
				<p className="rx-status good" role="status">
					今天已完成 {closedToday.length} 件：…{closedToday.join("、…")}
				</p>
			)}

			{!rows.length ? (
				<p className="empty">
					沒有待追蹤的個案。
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
								<td className="close-cell">
									<label className="sr-only" htmlFor={`who-${f.id}`}>
										結案者
									</label>
									<select
										id={`who-${f.id}`}
										className="who"
										value={who}
										disabled={busy === f.id}
										onChange={(e) => setWho(e.target.value)}
									>
										{PHARMACISTS.map((p) => (
											<option key={p}>{p}</option>
										))}
									</select>
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