/**
 * Pharmacist end. Three tabs, matching the daily job:
 * 收案評估 (record a case) → 病人衛教 (teach) → 追蹤清單 (who to call).
 * The education screen is not built yet; see progress.md.
 */
import { useState } from "react";

import { CaseEntry } from "./CaseEntry";
import { FollowupList } from "./components/FollowupList";
import "./pharmacist.css";

const TABS = [
	{ id: "case", label: "收案評估" },
	{ id: "edu", label: "病人衛教" },
	{ id: "follow", label: "追蹤清單" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function Pharmacist() {
	const [tab, setTab] = useState<TabId>("case");

	return (
		<div className="rx">
			<nav className="rx-tabs" role="tablist" aria-label="藥師工作區">
				{TABS.map((t) => (
					<button
						key={t.id}
						role="tab"
						type="button"
						aria-selected={tab === t.id}
						onClick={() => setTab(t.id)}
					>
						{t.label}
					</button>
				))}
			</nav>

			{tab === "case" && <CaseEntry />}
			{tab === "follow" && (
				<section className="rx-main">
					<h1>追蹤清單</h1>
					<p className="hint">依逾期程度排序。逾期紅燈最優先。</p>
					<FollowupList />
				</section>
			)}
			{tab === "edu" && (
				<section className="rx-main">
					<h1>病人衛教</h1>
					<p className="empty">
						衛教投影片尚未實作。
						<br />
						<span className="muted">
							需要多語言任務卡與呼吸練習曲線，屬下一階段。
						</span>
					</p>
				</section>
			)}
		</div>
	);
}
