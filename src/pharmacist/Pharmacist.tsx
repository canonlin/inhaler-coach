/**
 * Pharmacist end. Two tabs, matching the daily job:
 * 收案評估 (record a case) → 追蹤清單 (who to call).
 *
 * There is deliberately no education tab. Education happens on the patient's
 * phone, and the follow-up happens over LINE — a tab here would be a dead end
 * that suggests the pharmacist has a step they do not actually have.
 */
import { useState } from "react";

import { CaseEntry } from "./CaseEntry";
import { FollowupList } from "./components/FollowupList";
import "./pharmacist.css";

const TABS = [
	{ id: "case", label: "收案評估" },
	{ id: "follow", label: "追蹤清單" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function Pharmacist() {
	const [tab, setTab] = useState<TabId>("case");

	return (
		<div className="rx">
			<nav className="rx-tabs" aria-label="藥師工作區">
				{TABS.map((t) => (
					<button
						key={t.id}
						type="button"
						aria-current={tab === t.id ? "page" : undefined}
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
		</div>
	);
}
