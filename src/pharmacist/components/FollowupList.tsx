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
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { closeFollowup, type Followup } from "../../api-client.js";
import { PHARMACISTS } from "../../domain/roster.js";
import { DEVICES } from "../../domain/steps.js";
import { cn } from "../../lib/utils";
import { useFollowups } from "../useFollowups";
import { CaseDetail } from "./CaseDetail";
import { CaseList } from "./CaseList";
import { FollowupAssessment } from "./FollowupAssessment";
import { QueueAttention } from "./QueueAttention";
import {
	Badge,
	Button,
	Card,
	DataTable,
	Pending,
	Select,
	SelectItem,
	Skeleton,
	Td,
	Th,
} from "./ui";

/*
 * The value meaning 「不篩選」.
 *
 * Radix rejects an empty string as an item value — it reserves "" for the
 * placeholder — so "all" cannot be expressed as `value=""`. It also means the
 * All option has to be a real item: with only a placeholder, choosing a product
 * was a one-way door and the queue could only be restored through a separate
 * button, which is not how a filter is expected to behave.
 */
const ALL = "*";

const PRIORITY: Record<Followup["priority"], { label: string; rank: number }> =
	{
		P1: { label: "逾期", rank: 0 },
		P2: { label: "近期", rank: 1 },
		P3: { label: "排程", rank: 2 },
	};

/** Whole days past the deadline. Zero or less means not yet due. */
function daysLate(dueEnd: string): number {
	const today = new Date().toISOString().slice(0, 10);
	return Math.floor((Date.parse(today) - Date.parse(dueEnd)) / 86_400_000);
}

/*
 * Selection is drawn inside the status cell rather than beside the row.
 *
 * A dedicated column for it — an extra <td>, a leading accent cell, an extra
 * grid column — was tried and reverted twice: both change how many columns the
 * row contributes, so the table re-balances, every later column shifts, and the
 * last one wraps 「完成」 to one character per line. A row's shape must not depend
 * on whether it is selected. An absolutely positioned ::before cannot do that,
 * so it costs no width at all.
 */
const FOCUS_BAR =
	"relative before:absolute before:inset-y-0 before:left-0 before:w-1 before:bg-primary before:content-['']";

/*
 * The third view answers 「那其他人呢」.
 *
 * The first two are filtered from the same list of open follow-ups, so both
 * showed 37: everything open is overdue. Nothing on screen could reach the 42
 * cases that are recorded and closed, or the ones with no follow-up at all —
 * `/api/cases` existed and no screen called it. A third button is the whole of
 * it; a separate page for it would be a second place to look for a patient,
 * which is how people stop finding them.
 */
const VIEWS = [
	{ id: "today", label: "今日待辦" },
	{ id: "open", label: "全部未完成" },
	{ id: "cases", label: "全部個案" },
] as const;

export function FollowupList() {
	// Shared with the navigation badge, so this page renders the moment it is
	// mounted instead of blanking to 「載入中」 while a second copy of the same
	// request is already on its way.
	const { rows, refresh } = useFollowups();
	const [busy, setBusy] = useState<string | null>(null);
	const [conflict, setConflict] = useState<string | null>(null);
	const [notice, setNotice] = useState<string | null>(null);
	const [assessing, setAssessing] = useState<Followup | null>(null);
	const [closedToday, setClosedToday] = useState<number>(0);
	// Asked once for the whole queue rather than once per row.
	const [who, setWho] = useState(PHARMACISTS[0] ?? "");
	const [view, setView] = useState<(typeof VIEWS)[number]["id"]>("today");
	const [caseCount, setCaseCount] = useState<number | null>(null);
	// Grouping by device and by product, and the case opened from a row.
	const [device, setDevice] = useState("");
	const [drug, setDrug] = useState("");
	const [detail, setDetail] = useState<{
		id: string;
		patient: string;
		tail: string;
	} | null>(null);

	/*
	 * A follow-up chosen on another screen arrives here by id, because a link
	 * that lands on a list of thirty-seven rows without saying which one is the
	 * same dead end as a row that could not be clicked at all: the reader is
	 * dropped into the queue still hunting.
	 *
	 * It selects the row and scrolls to it; it does not open the assessment.
	 * Completing a follow-up writes an M1 assessment, so a form appearing
	 * unbidden on arrival would be a bigger claim than the click made.
	 */
	const [params, setParams] = useSearchParams();
	const focusId = params.get("case");

	/*
	 * Scroll via a callback ref rather than an effect. The row does not exist
	 * on the first render — the queue is still loading — so an effect keyed on
	 * the id would have run against a null element and never run again. A
	 * callback ref fires when the node is actually attached, which is the
	 * moment the thing to look at first appears.
	 */
	function attachFocus(el: HTMLTableRowElement | null) {
		el?.scrollIntoView({ block: "center" });
	}

	function chooseView(next: (typeof VIEWS)[number]["id"]) {
		setView(next);
		// Choosing a view is a statement that you are looking at the queue, not
		// arriving at one case. Leaving the id behind would keep a row lit that
		// the reader never chose.
		if (params.has("case")) {
			params.delete("case");
			setParams(params, { replace: true });
		}
	}

	async function close(row: Followup, status: "done" | "missed") {
		setBusy(row.id);
		setConflict(null);
		try {
			await closeFollowup({ id: row.id, by: who, status });
			setClosedToday((n) => n + 1);
			// One owner means one refresh: the list and the navigation badge are
			// the same data now, so they cannot drift apart.
			refresh();
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
			// Today, plus what was missed. A return visit that is three days out
			// is not today's work, and a filter that mixes the two makes the
			// pharmacist do tomorrow's patients today.
			today: list.filter((r) => r.overdue || r.dueToday).length,
			open: list.length,
			// Filled in once the case list has been opened; null until then,
			// because the queue knows only what is open. Guessing a number would
			// put a figure on a button nobody had looked up.
			cases: caseCount,
		};
	}, [rows, caseCount]);

	/*
	 * How many return visits are on today, and how many were missed.
	 *
	 * This is the question the schedule exists to answer (10/19 會議【五】：
	 * 後台清單會提示今天有哪些病患需要進行 Checklist 追蹤), so it is counted
	 * before the table rather than left for the reader to tally.
	 */
	const today = useMemo(() => {
		const list = rows ?? [];
		return {
			due: list.filter((r) => r.dueToday).length,
			late: list.filter((r) => r.overdue).length,
		};
	}, [rows]);

	/*
	 * Arriving at a named case forces the full list. 「今日待辦」 is a filter,
	 * and a case the reader deliberately went looking for must not be hidden by
	 * a filter they did not set.
	 */
	const effectiveView =
		focusId && rows?.some((r) => r.id === focusId) ? "all" : view;

	const sorted = useMemo(() => {
		const list = rows ?? [];
		/*
		 * Grouping is applied before the date view, not after it, so the counts
		 * on the view buttons still describe the whole queue. Filtering last
		 * would make 「今日待辦 37」 become 「今日待辦 3」 the moment a product
		 * was picked, and the reader would have no way to tell whether the
		 * backlog shrank or the filter did.
		 */
		const grouped = list.filter(
			(r) => (!device || r.device === device) && (!drug || r.drug === drug),
		);
		const visible =
			effectiveView === "today"
				? grouped.filter((r) => r.overdue || r.dueToday)
				: grouped;
		return [...visible].sort((a, b) => {
			const ra = a.overdue ? 0 : a.dueToday ? 1 : 2;
			const rb = b.overdue ? 0 : b.dueToday ? 1 : 2;
			// With every row overdue the first term is constant, so the rest of
			// the comparator is what actually orders the queue.
			return (
				ra - rb ||
				PRIORITY[a.priority].rank - PRIORITY[b.priority].rank ||
				a.due_end.localeCompare(b.due_end) ||
				a.mrn_tail.localeCompare(b.mrn_tail)
			);
		});
	}, [rows, effectiveView, device, drug]);

	/*
	 * Null means never fetched. Distinct from an empty list, which is a real
	 * answer and gets the empty state rather than a placeholder.
	 *
	 * The testid names this screen's own pending state. The previous check
	 * looked for the words 「載入中」 anywhere in the document and so caught the
	 * case-entry screen being left behind, which says nothing about whether this
	 * page blanks on arrival.
	 *
	 * The skeleton is the table's shape — header line plus body rows — because
	 * this is a screen the pharmacist comes back to all day, and a placeholder
	 * that reshapes itself on every load trains them to distrust it.
	 */
	/*
	 * The options are the values actually present in the queue, not the whole
	 * product list. A filter offering eleven products when two are in front of
	 * you turns a four-click answer into a hunt through a dropdown.
	 */
	const devices = useMemo(
		() =>
			[...new Set((rows ?? []).map((r) => r.device).filter(Boolean))].sort(),
		[rows],
	);
	const drugs = useMemo(
		() => [...new Set((rows ?? []).map((r) => r.drug).filter(Boolean))].sort(),
		[rows],
	);

	if (!rows) {
		return (
			<Pending label="正在讀取追蹤清單" testId="queue-loading">
				<Card className="overflow-hidden">
					<div className="border-b border-border-subtle px-5 py-4">
						<Skeleton className="h-5 w-32" />
					</div>
					{Array.from({ length: 6 }, (_, placeholderRow) => (
						<div
							// biome-ignore lint/suspicious/noArrayIndexKey: a fixed-length skeleton has positions, not identities
							key={placeholderRow}
							className="flex items-center gap-4 border-b border-border-subtle/60 px-5 py-3.5 last:border-b-0"
						>
							<Skeleton className="h-5 w-20 rounded-full" />
							<Skeleton className="h-5 w-14" />
							<Skeleton className="h-5 flex-1" />
							<Skeleton className="h-5 w-28" />
							<Skeleton className="h-5 w-16" />
							<Skeleton className="h-8 w-16" />
						</div>
					))}
				</Card>
			</Pending>
		);
	}

	const grouped = device !== "" || drug !== "";

	const focused = focusId ? (rows.find((r) => r.id === focusId) ?? null) : null;
	const focusedHidden = focusId !== null && focused === null && rows !== null;

	return (
		<div className="space-y-4">
			{notice && (
				<div
					role="status"
					data-testid="followup-done"
					className="rounded-md border border-success/30 bg-success-soft px-4 py-3 text-sm font-semibold text-success"
				>
					{notice}
				</div>
			)}

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
							aria-pressed={effectiveView === v.id}
							onClick={() => chooseView(v.id)}
							className={cn(
								"inline-flex items-center gap-2 rounded px-3 py-1.5 text-sm font-semibold transition-colors",
								effectiveView === v.id
									? "bg-primary text-primary-foreground"
									: "text-text-secondary hover:bg-surface-muted hover:text-text",
							)}
						>
							{v.label}
							<span className="tabular-nums opacity-80">
								{counts[v.id] ?? "—"}
							</span>
						</button>
					))}
				</fieldset>

				{/*
				 * Grouping by 劑型 and by 藥品.
				 *
				 * The 藥品 column was a label on every row and a control on none.
				 * Which product a patient is on decides what to re-teach — a
				 * dry-powder inhaler and a pMDI share no steps — and a pharmacist
				 * working through a backlog does that grouping in their head
				 * today, by reading down a column and holding it in memory.
				 *
				 * Both filters say what they hid. A filter that drops 34 of 37 rows
				 * without saying so is the same trap as the dead rows this
				 * replaced.
				 */}
				<div className="flex flex-wrap items-center gap-2">
					<div className="flex items-center gap-2 text-base text-text-secondary">
						<label htmlFor="f-device">劑型</label>
						<Select
							id="f-device"
							placeholder="全部劑型"
							value={device === "" ? ALL : device}
							onValueChange={(v) => setDevice(v === ALL ? "" : v)}
							className="w-36"
						>
							<SelectItem value={ALL}>全部劑型</SelectItem>
							{devices.map((d) => (
								<SelectItem key={d as string} value={d as string}>
									{DEVICES[d as keyof typeof DEVICES]?.label ?? d}
								</SelectItem>
							))}
						</Select>
					</div>
					<div className="flex items-center gap-2 text-base text-text-secondary">
						<label htmlFor="f-drug">藥品</label>
						<Select
							id="f-drug"
							placeholder="全部藥品"
							value={drug === "" ? ALL : drug}
							onValueChange={(v) => setDrug(v === ALL ? "" : v)}
							className="w-44"
						>
							<SelectItem value={ALL}>全部藥品</SelectItem>
							{drugs.map((d) => (
								<SelectItem key={d as string} value={d as string}>
									{d}
								</SelectItem>
							))}
						</Select>
					</div>
					{/*
					 * What the grouping removed. Each select now carries its own
					 * 全部 option, so this is not a second way to clear the filter —
					 * it is the only place that says how much is hidden. Without it
					 * a narrowed queue reads as a smaller backlog, and the
					 * pharmacist concludes the work shrank.
					 */}
					{grouped && (
						<p className="w-full text-caption text-text-muted">
							目前顯示 {sorted.length} 件，套用篩選前共 {rows.length} 件。
						</p>
					)}
				</div>

				<div className="flex items-center gap-2 text-base text-text-secondary">
					<label htmlFor="closer">結案者</label>
					<Select
						id="closer"
						value={who}
						onValueChange={(v) => setWho(v)}
						className="w-40"
					>
						{PHARMACISTS.map((p) => (
							<SelectItem key={p} value={p}>
								{p}
							</SelectItem>
						))}
					</Select>
				</div>
			</div>

			{/*
			 * Completing a follow-up is the M1 assessment, so it opens the form
			 * rather than dismissing the row. A one-click close could be done
			 * from anywhere and recorded nothing; this is the only path that
			 * produces the case the plan's before/after is built on.
			 */}
			{assessing && (
				<FollowupAssessment
					followup={assessing}
					pharmacist={who}
					onCancel={() => setAssessing(null)}
					onDone={(message) => {
						setAssessing(null);
						setClosedToday((n) => n + 1);
						refresh();
						setNotice(message);
					}}
				/>
			)}

			{detail && (
				<CaseDetail
					patientId={detail.patient}
					mrnTail={detail.tail}
					onClose={() => setDetail(null)}
				/>
			)}

			{/*
			 * Today's return visits, counted before the table.
			 *
			 * The queue is where the pharmacist comes to find out who is coming
			 * back today, so the answer goes at the top of the screen rather
			 * than in a column the reader has to scan. 「今天」 and 「逾期」 are
			 * different work — one is planned, one is behind — so they are
			 * counted apart instead of being folded into a single number that
			 * reads the same either way.
			 */}
			{effectiveView === "today" && (
				<div
					role="status"
					data-testid="today-checklist"
					className="rounded-lg border border-border-subtle bg-surface px-5 py-4"
				>
					<p className="text-lg font-bold text-text">
						{today.due > 0
							? `今天有 ${today.due} 件回診 Checklist`
							: "今天沒有排定的回診 Checklist"}
					</p>
					<p className="mt-1 text-base text-text-secondary">
						{today.late > 0
							? `另有 ${today.late} 件逾期未做，點進去補做一樣算。`
							: "沒有逾期的待辦。"}
					</p>
				</div>
			)}

			{effectiveView !== "cases" && (
				<QueueAttention
					rows={sorted}
					view={effectiveView}
					closedToday={closedToday}
				/>
			)}

			{effectiveView !== "cases" && focusedHidden && (
				<div
					role="status"
					data-testid="focus-gone"
					className="rounded-md border border-warning/30 bg-warning-soft px-4 py-3 text-sm font-semibold text-text-secondary"
				>
					這件追蹤已經不在未完成清單裡，可能剛才已被其他人結案。
				</div>
			)}

			{effectiveView === "cases" ? (
				<CaseList stage="" device={device} drug={drug} onCount={setCaseCount} />
			) : !sorted.length ? (
				<Card className="p-6 text-base text-text-secondary">
					{effectiveView === "today"
						? "今天沒有到期或逾期的追蹤。"
						: "沒有待追蹤的個案。"}
					<br />
					<span className="text-text-muted">
						收案之後系統會自動排入第 14、21、28 天的回診 Checklist。
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
								<Th className="w-32">期限</Th>
								<Th className="w-24">原評估者</Th>
								<Th className="w-44">結案</Th>
							</tr>
						</thead>
						<tbody>
							{sorted.map((f) => {
								const isFocus = f.id === focusId;
								return (
									<tr
										key={f.id}
										ref={isFocus ? attachFocus : undefined}
										data-testid={isFocus ? "followup-focus" : undefined}
										className={cn(
											f.overdue && "bg-danger-soft/40",
											!f.overdue && f.dueSoon && "bg-warning-soft/50",
											isFocus && "bg-surface-muted",
										)}
									>
										{/*
										 * The marker is drawn inside the first cell's ::before
										 * rather than as an extra <td>.
										 *
										 * A row with more cells than its header makes the table
										 * grow a column: every later column shifts right, the
										 * last one runs out of width, and 「完成」 wraps to one
										 * character per line. Selection is not worth a column.
										 */}
										{/*
										 * Read from overdue/dueSoon, which are the fields that
										 * actually say this, rather than from `priority`. That
										 * field is P1/P2/P3 and its labels were the words
										 * 逾期/近期/排程, so a column headed 優先 was displaying a
										 * time window under a promise about ranking. Priority
										 * still orders the queue, one line below.
										 */}
										<Td className={cn(isFocus && FOCUS_BAR)}>
											{f.overdue || f.dueToday ? (
												/*
												 * The number, not the word.
												 *
												 * Every open row here was stamped with the
												 * same 「逾期」, which is a fact that was true of
												 * all of them and therefore true of none in
												 * particular — the column carried no ranking at
												 * all, so the eye had nothing to follow. Days
												 * late varies from 98 to 159 in the seeded data,
												 * and a figure sorts and compares where a badge
												 * cannot.
												 */
												<Badge tone={f.overdue ? "danger" : "warning"}>
													{f.overdue
														? `逾期 ${daysLate(f.due_end)} 天`
														: "今天"}
												</Badge>
											) : f.dueSoon ? (
												/*
												 * Within three days. Not today's work, but soon
												 * enough to prepare for — and the badge says
												 * which it is, so the day is never a guess.
												 */
												<Badge tone="neutral">3 天內</Badge>
											) : (
												<span className="text-text-muted">—</span>
											)}
										</Td>
										{/*
										 * The record number opens the case.
										 *
										 * This row already says which patient, which product and
										 * how many steps need re-checking — none of which can be
										 * acted on, because completing the follow-up means
										 * reassessing someone whose record the pharmacist cannot
										 * see. Opening the history first is what makes the
										 * reassessment a re-check rather than a guess.
										 *
										 * A button rather than a link: it acts in place, and a new
										 * route would hide the queue the pharmacist is working
										 * through.
										 */}
										<Td>
											<button
												type="button"
												data-testid="open-case"
												onClick={() =>
													setDetail({
														id: f.id,
														patient: f.patient_id,
														tail: f.mrn_tail,
													})
												}
												className="font-mono tabular-nums text-primary underline decoration-dotted underline-offset-4 hover:decoration-solid"
												aria-label={`查看 …${f.mrn_tail} 的評估紀錄`}
											>
												…{f.mrn_tail}
											</button>
										</Td>
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
											{/*
											 * A count, not the list.
											 *
											 * Listing every wrong step here put seven red chips
											 * on every row — the seeded cases are mostly wrong
											 * on most steps — which is the same mistake as
											 * labelling all eight Pareto rows "80% key band":
											 * a marker on everything marks nothing, and the row
											 * grew tall enough to push the queue off screen.
											 *
											 * This row is for triaging. The step names are
											 * where the work happens, in the assessment form.
											 */}
											{f.wrongSteps.length > 0 && (
												<p className="mt-0.5 text-caption text-text-muted">
													待複評 {f.wrongSteps.length} 步
												</p>
											)}
										</Td>
										<Td className="whitespace-nowrap font-mono tabular-nums">
											{f.due_end}
										</Td>
										<Td className="text-text-secondary">
											{f.pharmacist ?? "—"}
										</Td>
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
													onClick={() => setAssessing(f)}
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
								);
							})}
						</tbody>
					</DataTable>
				</Card>
			)}
		</div>
	);
}
