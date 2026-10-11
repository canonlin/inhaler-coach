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
import { DeviceBeforeAfter } from "./components/DeviceBeforeAfter";
import { EngagementPanel } from "./components/EngagementPanel";
import { OutcomeSummary } from "./components/OutcomeSummary";
import { StepHeatmap } from "./components/StepHeatmap";
import { StepPareto } from "./components/StepPareto";
import {
	Card,
	CardHeader,
	Pending,
	Select,
	SelectItem,
	Skeleton,
	SkeletonRows,
} from "./components/ui";

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
	/*
	 * The page's own shape, not a spinner.
	 *
	 * This screen returns one figure after another, so a placeholder that is a
	 * single grey box would be replaced by a page twice its height and the eye
	 * would re-read everything. The skeleton reserves the KPI band and the three
	 * panels, and their row counts are the ones the seeded data actually
	 * produces — a placeholder sized differently from its content is just a
	 * spinner drawn grey.
	 */
	if (!data) {
		return (
			<Pending label="正在讀取成效資料" className="space-y-6">
				<div className="flex items-center justify-between gap-3">
					<Skeleton className="h-8 w-24" />
					<Skeleton className="h-9 w-36" />
				</div>
				<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
					{[0, 1, 2, 3].map((kpi) => (
						<div
							key={kpi}
							className="rounded-lg border border-border-subtle bg-surface px-5 py-4"
						>
							<Skeleton className="h-4 w-20" />
							<Skeleton className="mt-3 h-9 w-24" />
							<Skeleton className="mt-2 h-3 w-28" />
						</div>
					))}
				</div>
				{/*
				 * Row counts per panel, named rather than positional. Three bare
				 * numbers in an array would read as "first, second, third" and
				 * silently change meaning if one were inserted.
				 */}
				{[
					{ id: "heatmap", rows: 8 },
					{ id: "device", rows: 4 },
					{ id: "pareto", rows: 5 },
				].map((panel) => (
					<div
						key={panel.id}
						className="rounded-lg border border-border-subtle bg-surface"
					>
						<div className="border-b border-border-subtle px-5 py-4">
							<Skeleton className="h-5 w-48" />
							<Skeleton className="mt-2 h-3 w-96 max-w-full" />
						</div>
						<div className="space-y-2.5 px-5 py-4">
							<SkeletonRows count={panel.rows} className="h-5 w-full" />
						</div>
					</div>
				))}
			</Pending>
		);
	}

	return (
		<div className="space-y-6">
			<div className="flex flex-wrap items-center justify-between gap-3">
				<h1 className="text-2xl font-bold tracking-tight text-text">成效</h1>
				<div className="flex items-center gap-2 text-base text-text-secondary">
					<label htmlFor="stage">階段</label>
					<Select
						id="stage"
						placeholder="選擇階段"
						value={stage}
						onValueChange={(v) => setStage(v)}
						className="w-36"
					>
						<SelectItem value="">全部</SelectItem>
						<SelectItem value={"改善前"}>改善前</SelectItem>
						<SelectItem value={"改善後"}>改善後</SelectItem>
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
					title="各劑型的錯誤率"
					description="衛教方式依裝置而不同，所以分開看。右欄空白代表介入還沒排到那種裝置，不是零。"
				/>
				<DeviceBeforeAfter
					before={data.byDevice?.before ?? {}}
					after={data.byDevice?.after ?? {}}
				/>
			</Card>

			<Card>
				<CardHeader
					title="每個步驟：改善前 → 改善後"
					description="依改善前的錯誤率排序。數字是「做錯／評估這一步」。▲ 代表改善後仍偏高，而且樣本夠大到能這樣說。"
				/>
				<StepHeatmap steps={data.stepsBeforeAfter ?? []} />
			</Card>

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
					description="以「人」計數。同一個人練習四次仍算一位。這裡看的是有沒有人在用，不是操作有沒有進步。"
				/>
				<EngagementPanel e={data.engagement ?? null} />
			</Card>
		</div>
	);
}
