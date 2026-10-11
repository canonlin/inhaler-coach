/**
 * Follow-up queue: who to contact now, and what to tick off.
 *
 * Two things this screen deliberately does not do, both measured rather than
 * assumed. A previous version put a "who closed it" dropdown on every row: 37
 * rows meant 111 controls to scan, and the answer is the same person for all of
 * them, so it is one selector above the table. And it showed every open
 * follow-up at once: with 37 rows all overdue, "sorted by most overdue" sorts
 * nothing, and the pharmacist's actual question — what is due today — had no
 * view.
 */
import { useCallback, useEffect, useMemo, useState } from "react";

import {
	closeFollowup,
	type Followup,
	fetchFollowups,
} from "../../api-client.js";
import { PHARMACISTS } from "../../domain/roster.js";
import { STEP_BY_CODE } from "../../domain/steps.js";
import { cn } from "../../lib/utils";
import { invalidateFollowupCount } from "../useFollowupCounts";
import { Badge, Button, Card, DataTable, Select, Td, Th } from "./ui";

const PRIORITY: Record<Followup["priority"], { label: string; rank: number }> =
	{
		P1: { label: "逾期", rank: 0 },
		P2: { label: "近期", rank: 1 },
		P3: { label: "排程", rank: 2 },
	};

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
	// Asked once for the whole queue rather than once per row.
	const [who, setWho] = useState(PHARMACISTS[0] ?? "");
	const [view, setView] = useState<(typeof VIEWS)[number]["id"]>("today");

	const load = useCallback(async () => {
		try {
			const d = await fetchFollowups();
			setRows(d.followups);
			setError(null);
		} catch (e) {
			setError((e as Error).message);
		}
	}, []);

	useEffect(() => {
		void load();
	}, [load]);

	async function close(row: Followup, status: "done" | "missed") {
		setBusy(row.id);
		setConflict(null);
		try {
			await closeFollowup({ id: row.id, by: who, status });
			setClosedToday((n) => n + 1);
			// The sidebar's count is on screen right now; leaving it to expire
			// would leave it one higher than the queue the pharmacist is looking
			// at, on the screen where they are about to work.
			invalidateFollowupCount();
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

	if (error)
		return (
			<Card className="p-6 text-sm text-danger">讀不到追蹤清單：{error}</Card>
		);
	if (!rows)
		return <Card className="p-6 text-base text-text-secondary">載入中…</Card>;

	const visible =
		view === "today" ? rows.filter((r) => r.overdue || r.dueSoon) : rows;

	const sorted = [...visible].sort((a, b) => {
		const ra = a.overdue ? 0 : a.dueSoon ? 1 : 2;
		const rb = b.overdue ? 0 : b.dueSoon ? 1 : 2;
		// With every row overdue the first term is constant, so the rest of the
		// comparator is what actually orders the queue.
		return (
			ra - rb ||
			PRIORITY[a.priority].rank - PRIORITY[b.priority].rank ||
			a.due_end.localeCompare(b.due_end) ||
			a.mrn_tail.localeCompare(b.mrn_tail)
		);
	});

	return (
		<div className="space-y-4">
			{conflict && (
				<div
					role="alert"
					className="rounded-md border border-danger/30 bg-danger-soft px-4 py-3 text-sm font-semibold text-danger"
				>
					{conflict}
				</div>
			)}

			<div className="flex flex-wrap items-center justify-between gap-3">
				<fieldset className="inline-flex rounded-md border border-border-subtle bg-surface p-1">
					<legend className="sr-only">追蹤範圍</legend>
					{VIEWS.map((v) => (
						<button
							key={v.id}
							type="button"
							aria-pressed={view === v.id}
							onClick={() => setView(v.id)}
							className={cn(
								"inline-flex items-center gap-2 rounded px-3 py-1.5 text-sm font-semibold transition-colors",
								view === v.id
									? "bg-primary text-primary-foreground"
									: "text-text-secondary hover:bg-surface-muted hover:text-text",
							)}
						>
							{v.label}
							<span className="tabular-nums opacity-80">{counts[v.id]}</span>
						</button>
					))}
				</fieldset>

				<div className="flex items-center gap-2 text-base text-text-secondary">
					<label htmlFor="closer">結案者</label>
					<Select
						id="closer"
						value={who}
						onChange={(e) => setWho(e.target.value)}
						className="w-40"
					>
						{PHARMACISTS.map((p) => (
							<option key={p}>{p}</option>
						))}
					</Select>
				</div>
			</div>

			<p
				data-testid="followup-tally"
				className="text-base text-text-secondary"
				role="status"
			>
				{closedToday > 0
					? `今天已完成 ${closedToday} 件。`
					: "今天還沒完成任何一件。"}
			</p>

			{!sorted.length ? (
				<Card className="p-6 text-base text-text-secondary">
					{view === "today"
						? "今天沒有到期或逾期的追蹤。"
						: "沒有待追蹤的個案。"}
					<br />
					<span className="text-text-muted">
						追蹤會在收案時依錯誤燈號自動排入。
					</span>
				</Card>
			) : (
				<Card className="overflow-hidden">
					<DataTable dense data-testid="followup-queue">
						<caption className="sr-only">待追蹤清單</caption>
						<thead>
							<tr>
								<Th className="w-16">狀態</Th>
								<Th className="w-20">病歷</Th>
								<Th>藥品</Th>
								<Th>任務</Th>
								<Th className="w-28">期限</Th>
								<Th className="w-24">原評估者</Th>
								<Th className="w-44">結案</Th>
							</tr>
						</thead>
						<tbody>
							{sorted.map((f) => (
								<tr
									key={f.id}
									className={cn(
										f.overdue && "bg-danger-soft/40",
										!f.overdue && f.dueSoon && "bg-warning-soft/50",
									)}
								>
									{/*
									 * Read from overdue/dueSoon, which are the fields that
									 * actually say this, rather than from `priority`. That
									 * field is P1/P2/P3 and its labels were the words
									 * 逾期/近期/排程, so a column headed 優先 was displaying a
									 * time window under a promise about ranking. Priority
									 * still orders the queue, one line below.
									 */}
									<Td>
										{f.overdue || f.dueSoon ? (
											<Badge tone={f.overdue ? "danger" : "warning"}>
												{f.overdue ? "逾期" : "近期"}
											</Badge>
										) : (
											<span className="text-text-muted">—</span>
										)}
									</Td>
									<Td className="font-mono tabular-nums">…{f.mrn_tail}</Td>
									<Td>{f.drug ?? "—"}</Td>
									{/*
									 * What to re-check, in the pharmacist's words rather
									 * than codes. The task text says a critical error
									 * happened; this says which step it was, which is the
									 * difference between a row that can be worked and one
									 * that can only be acknowledged.
									 */}
									<Td>
										<p className="whitespace-nowrap text-text">{f.task}</p>
										{f.wrongSteps.length > 0 && (
											<p className="mt-0.5 flex flex-wrap gap-1">
												{f.wrongSteps.map((code) => (
													<span
														key={code}
														className="rounded bg-danger-soft px-1.5 py-0.5 text-[13px] text-danger"
													>
														{STEP_BY_CODE[code]?.text ?? code}
													</span>
												))}
											</p>
										)}
									</Td>
									<Td className="font-mono tabular-nums">{f.due_end}</Td>
									<Td className="text-text-secondary">{f.pharmacist ?? "—"}</Td>
									<Td>
										{/*
											Named after the patient, not just the action. In a queue
											of thirty-seven rows a button that reads only 「完成」
											does not say which case it belongs to, and 「未完成」
											contains 「完成」 as a substring, so assistive technology
											and tests cannot tell the two apart.
										 */}
										<div className="flex gap-2">
											<Button
												size="sm"
												variant="secondary"
												disabled={busy === f.id}
												aria-label={`將 …${f.mrn_tail} 的追蹤標記為完成`}
												onClick={() => close(f, "done")}
											>
												完成
											</Button>
											<Button
												size="sm"
												variant="ghost"
												disabled={busy === f.id}
												aria-label={`將 …${f.mrn_tail} 的追蹤標記為未完成`}
												onClick={() => close(f, "missed")}
											>
												未完成
											</Button>
										</div>
									</Td>
								</tr>
							))}
						</tbody>
					</DataTable>
				</Card>
			)}
		</div>
	);
}
