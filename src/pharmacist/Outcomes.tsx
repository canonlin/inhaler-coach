/**
 * Outcomes: one screen, one tab per programme.
 *
 * The platform measures more than one programme — the QCC／深耕計畫 over every
 * inhaler, the research plan over 吸必擴 patients in two groups — and they
 * share the cases without sharing a measurement. So the screen has a tab per
 * programme and one navigation item for all of them: the navigation is the
 * pharmacist's jobs, and reading a programme's numbers is one of them.
 *
 * The QCC's figures are exactly what they were before the tab existed. Moving
 * them behind a tab says which programme a number belongs to; it is not a
 * reason to recompute it.
 */
import { useEffect, useState } from "react";

import { fetchOutcomes, type OutcomesResponse } from "../api-client";
import { ProgrammeTabs } from "./components/ProgrammeTabs";
import { QccOutcomes } from "./components/QccOutcomes";
import { ResearchOutcomes } from "./components/ResearchOutcomes";
import {
	Card,
	Pending,
	Select,
	SelectItem,
	Skeleton,
	SkeletonRows,
} from "./components/ui";

export function Outcomes() {
	const [data, setData] = useState<OutcomesResponse | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [stage, setStage] = useState("");
	const [active, setActive] = useState("qcc");

	useEffect(() => {
		let live = true;
		setError(null);
		fetchOutcomes({ qccStage: stage })
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
	 * would re-read everything. The skeleton reserves the KPI band and the
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

	const entry = data.programmes.find((p) => p.id === active);
	const isQcc = entry?.id === "qcc";

	return (
		<div className="space-y-6">
			<div className="flex flex-wrap items-center justify-between gap-3">
				<h1 className="text-2xl font-bold tracking-tight text-text">成效</h1>
				<div className="flex flex-wrap items-center gap-3">
					<ProgrammeTabs
						programmes={data.programmes}
						active={active}
						onChange={setActive}
					/>
					{/*
					 * The stage filter belongs to the QCC: 改善前／改善後 is the
					 * axis that programme measures on. The research plan has its
					 * own axis — two groups — and offering it there would be
					 * offering a control that does nothing.
					 */}
					{isQcc && (
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
					)}
				</div>
			</div>

			{entry?.note && (
				<p className="text-base leading-relaxed text-text-secondary">
					{entry.note}
				</p>
			)}

			{entry?.id === "qcc" && <QccOutcomes data={entry.data} />}
			{entry?.id === "research" && <ResearchOutcomes data={entry.data} />}
		</div>
	);
}
