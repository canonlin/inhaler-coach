function deviceLabel(device: string): string {
	return DEVICES[device as keyof typeof DEVICES]?.label ?? device;
}

/**
 * Every case recorded, on the queue screen.
 *
 * The queue endpoint answers 「誰還沒做」 and that is all it answers: it returns
 * open follow-ups, so a case that was assessed and closed — or one recorded
 * before the follow-up rules existed — is not in it at all. With 37 open out of
 * 79 recorded, the other 42 were reachable nowhere in the app. `/api/cases`
 * already existed and nothing on screen called it.
 *
 * It lives here rather than on its own page because it is the same question
 * asked at a different breadth. The pharmacist arrives on 追蹤清單 to find
 * somebody; whether they want the twenty that need work or the seventy-nine that
 * exist is a switch on the same list, not a separate destination.
 *
 * Read-only. Recording and closing stay where they are, so this cannot become a
 * second place to edit a case from.
 */
import { useEffect, useMemo, useState } from "react";

import { type CaseRow, fetchCases } from "../../api-client";
import { DEVICES } from "../../domain/steps.js";
import { Badge, Card, DataTable, Pending, Skeleton, Td, Th } from "./ui";

export function CaseList({
	stage,
	device,
	drug,
	onCount,
}: {
	stage: string;
	device: string;
	drug: string;
	/**
	 * Reports how many cases exist, so the switch that opened this list can show
	 * it. Before the list has been opened the queue genuinely does not know —
	 * /api/followups only ever returns what is open — and a button that
	 * guessed a number there would be stating a fact nobody had looked up.
	 */
	onCount?: (n: number) => void;
}) {
	const [rows, setRows] = useState<CaseRow[] | null>(null);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let live = true;
		// Null on every filter change, so the table cannot show the previous
		// selection's rows under the new heading — which reads as "these are the
		// Breztri patients" when they are not.
		setRows(null);
		setError(null);
		fetchCases({ qccStage: stage, device, drug })
			.then((c) => {
				if (live) setRows(c);
			})
			.catch((e: Error) => {
				if (live) setError(e.message);
			});
		return () => {
			live = false;
		};
	}, [stage, device, drug]);

	const summary = useMemo(() => {
		const list = rows ?? [];
		return {
			cases: list.length,
			after: list.filter((r) => r.qcc_stage === "改善後").length,
		};
	}, [rows]);

	useEffect(() => {
		if (rows) onCount?.(rows.length);
	}, [rows, onCount]);

	if (error) {
		return (
			<Card className="p-6 text-base text-text-secondary">
				讀不到個案清單：{error}
			</Card>
		);
	}

	if (!rows) {
		return (
			<Pending label="正在讀取個案清單">
				<Card className="overflow-hidden">
					<div className="border-b border-border-subtle px-5 py-4">
						<Skeleton className="h-5 w-32" />
					</div>
					{Array.from({ length: 6 }, (_, placeholderRow) => (
						<div
							// biome-ignore lint/suspicious/noArrayIndexKey: fixed-length skeleton positions
							key={placeholderRow}
							className="flex items-center gap-4 border-b border-border-subtle/60 px-5 py-3.5 last:border-b-0"
						>
							<Skeleton className="h-5 w-24" />
							<Skeleton className="h-5 w-20" />
							<Skeleton className="h-5 flex-1" />
							<Skeleton className="h-5 w-20" />
						</div>
					))}
				</Card>
			</Pending>
		);
	}

	return (
		<Card className="overflow-hidden">
			<div className="border-b border-border-subtle px-5 py-4">
				<p className="text-base text-text-secondary">
					共{" "}
					<span className="font-bold tabular-nums text-text">
						{summary.cases}
					</span>{" "}
					筆個案，其中改善後 {summary.after} 筆。
					<span className="ml-2 text-text-muted">
						這一頁是唯讀的；要新增或結案請用收案評估與追蹤清單。
					</span>
				</p>
			</div>
			{rows.length === 0 ? (
				<p className="px-5 py-6 text-base text-text-secondary">
					沒有符合條件的個案。把篩選改回「全部」可以看到所有已記錄的個案。
				</p>
			) : (
				<DataTable dense data-testid="case-list">
					<caption className="sr-only">所有已記錄的個案</caption>
					<thead>
						<tr>
							<Th className="w-32">日期</Th>
							<Th className="w-20">期別</Th>
							<Th className="w-24">階段</Th>
							<Th>藥品</Th>
							<Th className="w-40">步驟</Th>
							<Th className="w-24">評估者</Th>
						</tr>
					</thead>
					<tbody>
						{rows.map((r) => {
							const steps = Object.entries(r.steps ?? {}).filter(
								([, v]) => v !== "na",
							);
							const wrong = steps.filter(([, v]) => v === "錯誤");
							return (
								<tr
									key={r.id}
									className="border-b border-border-subtle/60 last:border-b-0"
								>
									<Td className="whitespace-nowrap tabular-nums">
										{r.case_date}
									</Td>
									<Td>
										<Badge tone="neutral">{r.timepoint}</Badge>
									</Td>
									<Td>
										<Badge
											tone={r.qcc_stage === "改善後" ? "success" : "neutral"}
										>
											{r.qcc_stage}
										</Badge>
									</Td>
									<Td>
										{r.drug ?? "—"}
										{r.device ? (
											<span className="ml-1.5 text-caption text-text-muted">
												{deviceLabel(r.device)}
											</span>
										) : null}
									</Td>
									<Td>
										{steps.length === 0 ? (
											<span className="text-text-muted">—</span>
										) : wrong.length === 0 ? (
											<span className="text-success">
												{steps.length} 步全對
											</span>
										) : (
											<span>
												<span className="font-semibold text-danger">
													錯 {wrong.length}
												</span>
												<span className="ml-1 text-caption text-text-muted">
													／共 {steps.length} 步
												</span>
											</span>
										)}
									</Td>
									<Td className="text-text-secondary">{r.pharmacist ?? "—"}</Td>
								</tr>
							);
						})}
					</tbody>
				</DataTable>
			)}
		</Card>
	);
}
