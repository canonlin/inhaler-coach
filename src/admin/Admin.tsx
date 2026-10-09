/**
 * Admin: ONE job — 有沒有變好.
 *
 * This replaces the prototype's renderDash(), which put 11 panels on one page
 * (per-device bars, step heatmap, drug × step heatmap, knowledge errors,
 * pharmacist × device, inspiratory flow, dose-counter adherence, CAT/ACT pairs,
 * physician loop, discharge reconciliation, Pareto). Everything that does not
 * change the verdict was cut: clinical extras belong to the pharmacist's case
 * view, and the drill-down tables belong behind the numbers they explain.
 */
import { useEffect, useState } from "react";

import { fetchReference, fetchSummary, type Reference, type Summary } from "./api-client";
import { StepTable } from "./components/StepTable";
import { Verdict } from "./components/Verdict";
import "./admin.css";

export function Admin() {
	const [data, setData] = useState<Summary | null>(null);
	const [reference, setReference] = useState<Reference | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [stage, setStage] = useState("");

	useEffect(() => {
		fetchReference().then(setReference).catch(() => setReference(null));
	}, []);

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
			<div className="admin">
				<p className="empty">讀不到資料：{error}</p>
				<p className="hint">確認 API 已部署，並已設定 DATABASE_URL。</p>
			</div>
		);
	}
	if (!data) {
		return (
			<div className="admin">
				<p className="empty">載入中…</p>
			</div>
		);
	}

	return (
		<div className="admin">
			<header className="admin-head">
				<div>
					<span className="eyebrow">QCC 吸入劑 · 改善成效</span>
					<h1>有沒有變好</h1>
				</div>
				<label className="stage-pick">
					<span>階段</span>
					<select value={stage} onChange={(e) => setStage(e.target.value)}>
						<option value="">全部</option>
						<option value="改善前">改善前</option>
						<option value="改善後">改善後</option>
					</select>
				</label>
			</header>

			<Verdict baseline={data.baseline} after={data.after} enrolment={data.enrolment} />

			<section className="block">
				<h2>還是錯在這裡</h2>
				<p className="hint">
					依錯誤次數排序（佔最多錯誤的排最前）。★ 關鍵步驟，錯了這一次藥大多到不了肺部。
					最右欄為累積佔比：前幾個步驟修好，就能涵蓋 80% 的錯誤。
				</p>
				<StepTable rates={data.stepRates} pareto={data.pareto} />
			</section>
		</div>
	);
}