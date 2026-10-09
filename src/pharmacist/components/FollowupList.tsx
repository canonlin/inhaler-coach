/**
 * Follow-up queue. The prototype's 追蹤清單 had three separate queues; this is
 * one list ordered by what is most overdue, because a pharmacist's day has one
 * question: who do I contact now.
 */
import { useEffect, useState } from "react";

import { type Followup, fetchFollowups } from "../../admin/api-client.js";

const PRIORITY: Record<Followup["priority"], { label: string; rank: number }> =
	{
		P1: { label: "逾期或今日到期", rank: 0 },
		P2: { label: "3 天內到期", rank: 1 },
		P3: { label: "排程中", rank: 2 },
	};

export function FollowupList() {
	const [rows, setRows] = useState<Followup[] | null>(null);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		fetchFollowups()
			.then((d) => setRows(d.followups))
			.catch((e: Error) => setError(e.message));
	}, []);

	if (error) return <p className="empty">讀不到追蹤清單：{error}</p>;
	if (!rows) return <p className="empty">載入中…</p>;
	if (!rows.length) {
		return (
			<p className="empty">
				沒有待追蹤的個案。
				<br />
				<span className="muted">追蹤會在收案時依錯誤燈號自動排入。</span>
			</p>
		);
	}

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
		<table className="ck-table">
			<thead>
				<tr>
					<th scope="col">優先</th>
					<th scope="col">病歷</th>
					<th scope="col">藥品</th>
					<th scope="col">任務</th>
					<th scope="col">期限</th>
					<th scope="col">藥師</th>
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
					</tr>
				))}
			</tbody>
		</table>
	);
}
