/**
 * The case behind a follow-up, opened from the row.
 *
 * The queue named a patient and a drug and a number of steps to re-check, and
 * then stopped. Nothing on that row could be opened: the pharmacist could close
 * the follow-up but could not see what they were about to close, which means the
 * reassessment started from memory rather than from the record.
 *
 * It reads the patient's whole history rather than just the one case, because
 * the question behind clicking is 「這位上次是怎樣」 and the answer is usually a
 * pair of assessments — M0 and M1 — that only make sense together. Opening one
 * case alone would answer the question the pharmacist already knew the answer
 * to, because the row already told them the case exists and what it found.
 *
 * Read-only and dismissed, not a second editor. Recording a new assessment stays
 * the only way to change anything, so this cannot become a competing source.
 */
import { useEffect, useState } from "react";

import { type CaseRow, casesForPatient } from "../../api-client";
import { DEVICES, STEP_BY_CODE } from "../../domain/steps.js";
import { Badge, Card, CardHeader, Pending } from "./ui";

export function CaseDetail({
	patientId,
	mrnTail,
	onClose,
}: {
	patientId: string;
	mrnTail: string;
	onClose: () => void;
}) {
	const [cases, setCases] = useState<CaseRow[] | null>(null);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let live = true;
		casesForPatient(patientId)
			.then((c) => {
				if (live) setCases(c);
			})
			.catch((e: Error) => {
				if (live) setError(e.message);
			});
		return () => {
			live = false;
		};
	}, [patientId]);

	return (
		<Card className="overflow-hidden" data-testid="case-detail">
			<CardHeader
				title={`…${mrnTail} 的評估紀錄`}
				description="依日期由新到舊。這位病人目前沒有其他紀錄時，下面會直接說明。"
				action={
					<button
						type="button"
						onClick={onClose}
						className="rounded px-2 py-1 text-caption font-semibold text-text-secondary hover:bg-surface-muted"
					>
						關閉
					</button>
				}
			/>
			{error ? (
				<p className="px-5 py-4 text-base text-text-secondary">
					讀不到這位病人的紀錄，但你可以照常結案。
				</p>
			) : !cases ? (
				<Pending
					label="正在讀取這位病人的評估紀錄"
					rows={3}
					className="px-5 py-4"
				/>
			) : cases.length === 0 ? (
				<p className="px-5 py-4 text-base text-text-secondary">
					這位病人沒有其他評估紀錄，可以直接複評。
				</p>
			) : (
				<ul className="divide-y divide-border-subtle">
					{cases.map((c) => (
						<CaseRowItem key={c.id} row={c} />
					))}
				</ul>
			)}
		</Card>
	);
}

function CaseRowItem({ row }: { row: CaseRow }) {
	const steps = Object.entries(row.steps ?? {});
	const wrong = steps.filter(([, v]) => v === "錯誤");
	return (
		<li className="px-5 py-4">
			<div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
				<span className="font-semibold tabular-nums text-text">
					{row.case_date}
				</span>
				<Badge tone="neutral">{row.timepoint}</Badge>
				<Badge tone={row.qcc_stage === "改善後" ? "success" : "neutral"}>
					{row.qcc_stage}
				</Badge>
				<span className="text-base text-text-secondary">
					{row.drug ?? "—"}
					{row.device ? ` · ${deviceLabel(row.device)}` : ""}
				</span>
				<span className="text-caption text-text-muted">
					評估者 {row.pharmacist ?? "—"}
				</span>
			</div>

			{wrong.length === 0 ? (
				<p className="mt-2 text-base text-success">
					評估 {steps.length} 步，全數正確。
				</p>
			) : (
				<div className="mt-2">
					<p className="text-base font-semibold text-danger">
						{wrong.length} / {steps.length} 步錯誤：
					</p>
					<ul className="mt-1 flex flex-wrap gap-1.5">
						{wrong.map(([code]) => (
							<li key={code}>
								<span className="rounded bg-danger-soft px-1.5 py-0.5 text-caption text-danger">
									{stepText(code)}
								</span>
							</li>
						))}
					</ul>
				</div>
			)}
		</li>
	);
}

function stepText(code: string): string {
	return STEP_BY_CODE[code]?.text ?? code;
}

/**
 * The route's device code is a string; DEVICES is keyed by a union. A case
 * recorded before a device was added would miss the map entirely, so an
 * unknown code falls back to printing itself rather than rendering blank.
 */
function deviceLabel(device: string): string {
	return DEVICES[device as keyof typeof DEVICES]?.label ?? device;
}
