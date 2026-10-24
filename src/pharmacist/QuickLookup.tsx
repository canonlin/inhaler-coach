/**
 * Quick lookup: one patient, one screen.
 *
 * The back office was promised four blocks on 2026-10-19 — 收案評估、完整追蹤
 * 清單、快速查詢、成效分析 — and this is the third one, which never got built.
 * Everything the platform holds about a patient is here: the visits with their
 * checklist results, the planned return visits and the camera practice.
 *
 * It is a separate screen from 收案評估 on purpose. Entering a record number
 * there starts an enrollment; here it only reads. A pharmacist who wants to
 * know what a patient's record says should not have to open a form that could
 * save a new case by accident.
 *
 * The record number is hashed server-side and never travels in a query string,
 * and the page shows only the tail: enough to recognise the row, not enough to
 * be a list of patients.
 */
import { useState } from "react";

import {
	type CaseRow,
	type FollowupRow,
	lookupPatient,
	type PatientLookup,
	type PracticeSession,
} from "../api-client";
import { Badge, Button, Card, CardHeader, Field, Input } from "./components/ui";

const date = (value: string | null | undefined) => (value ?? "").slice(0, 10);

export function QuickLookup() {
	const [mrn, setMrn] = useState("");
	const [result, setResult] = useState<PatientLookup | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [busy, setBusy] = useState(false);

	async function search() {
		if (!mrn.trim()) return;
		setBusy(true);
		setError(null);
		try {
			setResult(await lookupPatient(mrn));
		} catch (e) {
			setError(e instanceof Error ? e.message : String(e));
			setResult(null);
		} finally {
			setBusy(false);
		}
	}

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-bold tracking-tight text-text">
					快速查詢
				</h1>
				<p className="mt-1 text-base leading-relaxed text-text-secondary">
					輸入病歷號碼，看這位病人在平台裡的全部紀錄：就診、追蹤與 AI 練習。
				</p>
			</div>

			<Card>
				<div className="flex flex-wrap items-end gap-3 px-5 py-4">
					<div className="min-w-64 grow">
						<Field label="病歷號碼" htmlFor="lookup-mrn">
							<Input
								id="lookup-mrn"
								value={mrn}
								onChange={(e) => setMrn(e.target.value)}
								onKeyDown={(e) => {
									if (e.key === "Enter") search();
								}}
								autoComplete="off"
								inputMode="numeric"
								placeholder="例：A123456789"
							/>
						</Field>
					</div>
					<Button onClick={search} disabled={busy || !mrn.trim()}>
						{busy ? "查詢中…" : "查詢"}
					</Button>
				</div>
			</Card>

			{error && (
				<Card className="p-5">
					<p className="text-base text-danger">查不到：{error}</p>
				</Card>
			)}

			{result && !result.found && (
				<Card className="p-5">
					<p className="text-base text-text-secondary">
						平台裡沒有這位病人的紀錄。可能是還沒收案，也可能病歷號碼打錯了。
					</p>
				</Card>
			)}

			{result?.found && (
				<div className="space-y-4">
					<div className="flex flex-wrap items-center gap-3">
						<Badge tone="neutral">病歷號碼尾碼 {result.mrnTail}</Badge>
						<span className="text-base text-text-secondary">
							{result.cases?.length ?? 0} 筆就診 ·{" "}
							{result.followups?.length ?? 0} 筆追蹤 ·{" "}
							{result.sessions?.length ?? 0} 次 AI 練習
						</span>
					</div>

					<Cases cases={result.cases ?? []} />
					<Followups followups={result.followups ?? []} />
					<Sessions sessions={result.sessions ?? []} />
				</div>
			)}
		</div>
	);
}

function Cases({ cases }: { cases: CaseRow[] }) {
	return (
		<Card>
			<CardHeader
				title="就診紀錄"
				description="最新的一次在最上面。步驟是那一次收案時勾的結果。"
			/>
			{cases.length === 0 ? (
				<p className="px-5 py-4 text-base text-text-secondary">
					沒有就診紀錄。
				</p>
			) : (
				<ul className="divide-y divide-border-subtle">
					{cases.map((c) => (
						<li key={c.id} className="px-5 py-3.5">
							<p className="text-base font-semibold text-text">
								{date(c.case_date)} · {c.timepoint} {c.qcc_stage} ·{" "}
								{c.drug ?? "—"}
							</p>
							<p className="mt-0.5 text-caption leading-snug text-text-secondary">
								{c.device ?? "—"} · 藥師 {c.pharmacist ?? "—"} · 院區{" "}
								{c.campus ?? "—"} · {stepsSummary(c.steps)}
								{c.knowledgeScore != null && ` · 知識題 ${c.knowledgeScore}/10`}
							</p>
						</li>
					))}
				</ul>
			)}
		</Card>
	);
}

function Followups({ followups }: { followups: FollowupRow[] }) {
	return (
		<Card>
			<CardHeader
				title="追蹤"
				description="排定的回診與它的結果。被下一位取代的任務不算未完成。"
			/>
			{followups.length === 0 ? (
				<p className="px-5 py-4 text-base text-text-secondary">
					沒有追蹤紀錄。
				</p>
			) : (
				<ul className="divide-y divide-border-subtle">
					{followups.map((f) => (
						<li key={f.id} className="px-5 py-3.5">
							<p className="text-base font-semibold text-text">
								{f.slot ? `${f.slot} ` : ""}
								{date(f.due_start)} → {date(f.due_end)} ·{" "}
								{statusLabel(f.status)}
							</p>
							<p className="mt-0.5 text-caption leading-snug text-text-secondary">
								{f.task}
								{f.completed_by && ` · 由 ${f.completed_by} 完成`}
								{f.completed_at && ` · ${date(f.completed_at)}`}
								{f.completed_note && ` · ${f.completed_note}`}
							</p>
						</li>
					))}
				</ul>
			)}
		</Card>
	);
}

function Sessions({ sessions }: { sessions: PracticeSession[] }) {
	return (
		<Card>
			<CardHeader
				title="AI 練習"
				description="病人端用相機練習的紀錄。沒有完成就沒有後面的判定。"
			/>
			{sessions.length === 0 ? (
				<p className="px-5 py-4 text-base text-text-secondary">
					沒有 AI 練習紀錄。
				</p>
			) : (
				<ul className="divide-y divide-border-subtle">
					{sessions.map((s) => (
						<li key={s.id} className="px-5 py-3.5">
							<p className="text-base font-semibold text-text">
								{date(s.started_at)} · {s.drug ?? s.device} ·{" "}
								{s.completed_at ? "已完成" : "未完成"}
							</p>
							<p className="mt-0.5 text-caption leading-snug text-text-secondary">
								{s.device}
								{s.completed_at && ` · 完成於 ${date(s.completed_at)}`}
							</p>
						</li>
					))}
				</ul>
			)}
		</Card>
	);
}

/** "正確 12 步、錯誤 2 步" — the checklist as it was saved. */
function stepsSummary(steps: Record<string, string>) {
	const values = Object.values(steps ?? {});
	const wrong = values.filter((v) => v === "錯誤").length;
	const right = values.filter((v) => v === "正確").length;
	if (!right && !wrong) return "沒有評估步驟";
	return `正確 ${right} 步、錯誤 ${wrong} 步`;
}

function statusLabel(status: FollowupRow["status"]) {
	if (status === "done") return "已完成";
	if (status === "missed") return "未到";
	if (status === "superseded") return "已被下一位取代";
	return "待回診";
}
