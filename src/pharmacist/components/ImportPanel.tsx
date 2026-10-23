/**
 * Uploading the pharmacist's sheet.
 *
 * Two rules shape this panel:
 *
 *   1. Nothing is written before the pharmacist has seen what would be
 *      written. The sheet has 987 rows of which 62 carry content, and nobody
 *      reads that by eye — so the file is parsed and reported first (「先試算」),
 *      and the report says what was read, what was skipped and why, and where
 *      the sheet disagrees with itself. Only then can the same file be
 *      committed.
 *   2. The rehearsal belongs to one file and one stage. Changing either
 *      invalidates it, because the report is a promise about *this* file as
 *      *that* stage, and a promise about a previous file is not a promise.
 */
import { useState } from "react";

import { type ImportReport, importCases } from "../../api-client";
import {
	ENROLLMENT_SHEET,
	STAGE_LABEL,
	STAGES,
} from "../../domain/enrollment-sheet.js";
import { ImportReportPanel } from "./ImportReport";
import { Button, Card, CardHeader, Field, Select, SelectItem } from "./ui";

export function ImportPanel() {
	const [file, setFile] = useState<File | null>(null);
	const [stage, setStage] = useState("改善前");
	const [report, setReport] = useState<ImportReport | null>(null);
	const [rehearsedFor, setRehearsedFor] = useState<string | null>(null);
	const [busy, setBusy] = useState<"dry" | "commit" | null>(null);
	const [error, setError] = useState<string | null>(null);

	const currentKey = file ? `${file.name}:${file.size}:${stage}` : null;
	const rehearsed = rehearsedFor !== null && rehearsedFor === currentKey;

	async function run(dryRun: boolean) {
		if (!file) {
			setError("先選一個 .xlsx 檔案。");
			return;
		}
		setBusy(dryRun ? "dry" : "commit");
		setError(null);
		try {
			const r = await importCases(file, { stage, dryRun });
			setReport(r);
			if (dryRun) {
				setRehearsedFor(currentKey);
			} else {
				// The file has been written; the rehearsal no longer describes
				// anything that is still to happen.
				setRehearsedFor(null);
				setFile(null);
			}
		} catch (e) {
			setError(e instanceof Error ? e.message : "匯入失敗");
		} finally {
			setBusy(null);
		}
	}

	return (
		<Card>
			<CardHeader
				title="匯入收案試算表"
				description="只接受 .xlsx。Google 試算表請先從下載選單存成 Excel。同一份檔案重跑一次是更新，不會變成兩筆。"
			/>
			<div className="space-y-5 px-5 py-4">
				<Field
					label="這份資料屬於哪一階段"
					htmlFor="stage"
					hint="前測（改善前）是對策前的收案；後測（改善後）是介入後的收案。試算表裡不會寫這一欄，必須在這裡選。"
				>
					<Select
						id="stage"
						value={stage}
						onValueChange={(v) => {
							setStage(v);
							// The stage is part of the rehearsal's identity, so
							// changing it retires the report rather than leaving a
							// promise about the previous stage on screen.
							setReport(null);
							setRehearsedFor(null);
						}}
						className="w-64"
					>
						{STAGES.map((s) => (
							<SelectItem key={s} value={s}>
								{STAGE_LABEL[s]}
							</SelectItem>
						))}
					</Select>
				</Field>

				<Field
					label="檔案"
					htmlFor="file"
					hint={`工作表名稱要叫「${ENROLLMENT_SHEET}」。必要欄位與步驟欄位格式寫在下面這張卡。`}
				>
					<input
						id="file"
						type="file"
						accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
						onChange={(e) => {
							setFile(e.target.files?.[0] ?? null);
							// A new file invalidates the rehearsal.
							setReport(null);
							setRehearsedFor(null);
							setError(null);
						}}
						className="block w-full text-base text-text file:mr-3 file:rounded-md file:border file:border-border file:bg-surface file:px-4 file:py-2 file:text-base file:font-semibold file:text-text hover:file:bg-surface-muted"
					/>
				</Field>

				{file && (
					<p className="text-base text-text-secondary">
						已選：<span className="font-semibold text-text">{file.name}</span>
					</p>
				)}

				<div className="flex flex-wrap items-center gap-3">
					<Button onClick={() => run(true)} disabled={!file || busy !== null}>
						{busy === "dry" ? "試算中…" : "先試算（不寫入）"}
					</Button>
					<Button
						variant="secondary"
						onClick={() => run(false)}
						disabled={!file || !rehearsed || busy !== null}
					>
						{busy === "commit" ? "匯入中…" : "確認匯入"}
					</Button>
					{!rehearsed && file && (
						<p className="text-base text-text-secondary">
							先試算，看過報告才能匯入。
						</p>
					)}
				</div>

				{error && (
					<p
						role="alert"
						data-testid="import-error"
						className="rounded-md border border-danger/30 bg-danger-soft px-4 py-3 text-base font-semibold text-danger"
					>
						{error}
					</p>
				)}

				{report && <ImportReportPanel report={report} />}
			</div>
		</Card>
	);
}
