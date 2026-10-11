/**
 * Outcomes: did it get better, and is anyone using it.
 *
 * Two questions, in that order. The verdict answers the first; the engagement
 * panel answers the second, because an error rate on its own cannot tell a
 * working system from one nobody followed up with.
 */
import { useEffect, useState } from "react";

import { fetchSummary, type Summary } from "../api-client";
import { EngagementPanel } from "./components/EngagementPanel";
import { StepTable } from "./components/StepTable";
import { Card, CardHeader, Select } from "./components/ui";
import { Verdict } from "./components/Verdict";

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
			<div className="flex flex-wrap items-end justify-between gap-4">
				<div>
					<h1 className="text-2xl font-bold tracking-tight text-text">
						有沒有變好
					</h1>
					<p className="mt-1.5 max-w-prose text-base text-text-secondary">
						錯誤率回答「有沒有變好」，下面這一段回答「有人在用嗎」。兩個問題分開看，因為追蹤完成率是零的時候，錯誤率照樣可以看起來穩定。
					</p>
				</div>
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

			<Verdict
				baseline={data.baseline}
				after={data.after}
				enrolment={data.enrolment}
				paired={data.paired}
			/>

			<Card>
				<CardHeader
					title="還是錯在這裡"
					description="依錯誤次數排序（佔最多錯誤的排最前）。★ 關鍵步驟，錯了這一次藥大多到不了肺部。最右欄為累積佔比：前幾個步驟修好，就能涵蓋 80% 的錯誤。"
				/>
				<StepTable rates={data.stepRates} pareto={data.pareto} />
			</Card>

			<EngagementPanel e={data.engagement ?? null} />
		</div>
	);
}
