/**
 * Outcomes: an overview, then the detail behind it.
 *
 * The screen opened with a heading, a paragraph explaining its own section
 * order, and a filter, so the space above the fold — the most valuable space on
 * an overview screen — was spent on chrome. It now leads with the summary band
 * (where the study stands, in one look) and keeps only what a glance cannot
 * carry below.
 *
 * Nothing is shown twice. The band carries enrolment, error rate, follow-up
 * completion and weekly actives; the panels below carry the step distribution
 * and the usage chains. That is why Verdict is gone rather than moved: its
 * numbers now live in the band, and keeping the card would make a reader
 * confirm the same figures a second time.
 */
import { useEffect, useState } from "react";

import { fetchSummary, type Summary } from "../api-client";
import { EngagementPanel } from "./components/EngagementPanel";
import { OutcomeSummary } from "./components/OutcomeSummary";
import { StepPareto } from "./components/StepPareto";
import { Card, CardHeader, Select } from "./components/ui";

export function Outcomes() {
	const [data, setData] = useState<Summary | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [stage, setStage] = useState("");

	useEffect(() => {
		let live = true;
		setError(null);
		fetchSummary({ qccStage: stage })
			.then((d) => {
				if (live) setData(d);
			})
			.catch((e: Error) => {
				if (live) setError(e.message);
			});
		return () => {
			live = false;
		};
	}, [stage]);

	if (error) {
		return (
			<Card className="p-6">
				<p className="text-base text-danger">讀不到資料：{error}</p>
				<p className="mt-1 text-base text-text-secondary">
					確認 API 已部署，並已設定 DATABASE_URL。
				</p>
			</Card>
		);
	}
	if (!data)
		return <Card className="p-6 text-base text-text-secondary">載入中…</Card>;

	return (
		<div className="space-y-6">
			<div className="flex flex-wrap items-center justify-between gap-3">
				<h1 className="text-2xl font-bold tracking-tight text-text">成效</h1>
				<div className="flex items-center gap-2 text-base text-text-secondary">
					<label htmlFor="stage">階段</label>
					<Select
						id="stage"
						value={stage}
						onChange={(e) => setStage(e.target.value)}
						className="w-36"
					>
						<option value="">全部</option>
						<option value="改善前">改善前</option>
						<option value="改善後">改善後</option>
					</Select>
				</div>
			</div>

			<OutcomeSummary
				baseline={data.baseline}
				after={data.after}
				enrolment={data.enrolment}
				paired={data.paired}
				engagement={data.engagement}
			/>

			<Card>
				<CardHeader
					title="錯在哪裡"
					description="每個步驟被評估時的錯誤次數，從最多錯的排起。★ 標記關鍵步驟——錯了通常代表藥到不了肺部。"
				/>
				<StepPareto rates={data.stepRates} pareto={data.pareto} />
			</Card>

			<Card>
				<CardHeader
					title="民眾有在用嗎"
					description="以「人」計數，不是次數。一個人練習四次仍算一位。回答系統有沒有被真的使用，不是操作有沒有變好。"
				/>
				<EngagementPanel e={data.engagement ?? null} />
			</Card>
		</div>
	);
}
