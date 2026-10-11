/**
 * What this patient has been assessed before.
 *
 * There was no way to answer it: the outcomes page summarises cohorts, the
 * queue lists work outstanding, and nothing read back what had already been
 * recorded. A pharmacist could enter a record number, save a new case, and
 * never see the previous one — so the question 「這位上次幾分、錯哪幾步」 had no
 * answer anywhere in the app.
 *
 * It appears here rather than as a fourth section because the pharmacist is
 * already holding the record number at this point, and because the answer
 * changes what they do next: a patient previously wrong on 搖 and 吸 needs a
 * different thirty seconds of attention than one assessed clean.
 *
 * Read-only. Recording a new assessment stays the only way to add one, so this
 * cannot become a second, conflicting source of truth.
 */
import { useEffect, useState } from "react";

import { type CaseRow, lookupCases } from "../../api-client";
import { STEP_BY_CODE } from "../../domain/steps.js";
import { Badge, Pending } from "./ui";

export function CaseHistory({ mrn }: { mrn: string }) {
	const [rows, setRows] = useState<CaseRow[] | null>(null);
	const [failed, setFailed] = useState(false);

	useEffect(() => {
		let live = true;
		setRows(null);
		setFailed(false);
		lookupCases(mrn)
			.then((r) => {
				if (live) setRows(r);
			})
			.catch(() => {
				// A history that fails to load must not block recording a case.
				// Saying so and carrying on beats an error the pharmacist has to
				// dismiss before doing their actual job.
				if (live) setFailed(true);
			});
		return () => {
			live = false;
		};
	}, [mrn]);

	/*
	 * A placeholder, not nothing.
	 *
	 * This returned null while the lookup ran, which is indistinguishable from
	 * 「這位病人沒有歷史評估紀錄」 — the very sentence shown two branches below.
	 * A pharmacist who typed a record number, saw no box appear, and read that
	 * as "new patient" would skip a check that exists to catch exactly that.
	 * The three grey lines hold the space the history will occupy so the answer
	 * lands without moving anything.
	 */
	if (!rows && !failed) {
		return (
			<div className="mt-5 rounded-md border border-border-subtle bg-surface-muted px-4 py-3">
				<Pending label="正在讀取這位病人的歷史紀錄" rows={2} />
			</div>
		);
	}

	if (failed) {
		return (
			<p
				data-testid="case-history-failed"
				className="mt-4 text-base text-text-secondary"
			>
				讀不到這位病人的歷史紀錄。仍然可以照常收案。
			</p>
		);
	}

	if (rows && rows.length === 0) {
		return (
			<p
				data-testid="case-history-empty"
				className="mt-4 text-base text-text-secondary"
			>
				這位病人沒有歷史評估紀錄。
			</p>
		);
	}

	return (
		<section
			data-testid="case-history"
			className="mt-5 rounded-md border border-border-subtle bg-surface-muted px-4 py-3"
		>
			<h3 className="text-base font-bold text-text">
				這位病人有 {rows?.length} 次歷史評估
			</h3>
			<ul className="mt-2 space-y-2">
				{rows?.map((r) => {
					const wrong = Object.entries(r.steps).filter(([, v]) => v === "錯誤");
					return (
						<li
							key={r.id}
							className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-base"
						>
							<span className="font-semibold tabular-nums text-text">
								{r.case_date}
							</span>
							<Badge tone="neutral">{r.timepoint}</Badge>
							<Badge tone={r.qcc_stage === "改善後" ? "success" : "neutral"}>
								{r.qcc_stage}
							</Badge>
							<span className="text-text-secondary">{r.drug ?? "—"}</span>
							{wrong.length === 0 ? (
								<span className="text-success">全數正確</span>
							) : (
								<span className="flex flex-wrap gap-1">
									{wrong.map(([code]) => (
										<span
											key={code}
											className="rounded bg-danger-soft px-1.5 py-0.5 text-caption text-danger"
										>
											{STEP_BY_CODE[code]?.text ?? code}
										</span>
									))}
								</span>
							)}
						</li>
					);
				})}
			</ul>
		</section>
	);
}
