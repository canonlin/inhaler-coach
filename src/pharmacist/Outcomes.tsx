/**
 * Outcomes: did it get better, and is anyone using it.
 *
 * Read order is evidence order, not topic order. The screen once led with the
 * before/after headline, which hands the largest type to a rate computed from
 * however many people have been measured — at 收案 1/30 the page's loudest
 * object was its least supported claim. The step distribution leads now,
 * because 61 cases is the one finding here with enough behind it to act on, and
 * the comparison follows in its own tier.
 *
 * Two questions, in that order. The verdict answers the first; the engagement
 * panel answers the second, because an error rate on its own cannot tell a
 * working system from one nobody followed up with.
 */
import { useEffect, useState } from "react";

import { fetchSummary, type Summary } from "../api-client";
import { EngagementPanel } from "./components/EngagementPanel";
import { StepPareto } from "./components/StepPareto";
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
					<h1 className="text-2xl font-bold tracking-tight text-text">成效</h1>
					<p className="mt-1.5 max-w-prose text-base text-text-secondary">
						這頁回答兩件事：錯在哪裡，以及介入有沒有效。順序不是隨便排的——先講證據夠的那件事。下方第二段回答「有人在用嗎」，因為追蹤完成率是零的時候，錯誤率照樣可以看起來穩定。
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

			<Card>
				<CardHeader
					title="錯在哪裡"
					description="每個步驟被評估時的錯誤次數，從最多錯的排起。★ 標記關鍵步驟——錯了通常代表藥到不了肺部。"
				/>
				<StepPareto rates={data.stepRates} pareto={data.pareto} />
			</Card>

			<Verdict
				baseline={data.baseline}
				after={data.after}
				enrolment={data.enrolment}
				paired={data.paired}
			/>

			<EngagementPanel e={data.engagement ?? null} />
		</div>
	);
}
