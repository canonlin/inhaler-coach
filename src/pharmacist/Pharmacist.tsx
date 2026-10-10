/**
 * The pharmacist end. Three tabs, one person.
 *
 * 收案評估 records a case · 追蹤清單 says who to call · 成效 answers 有沒有變好.
 *
 * There is no separate management end. The pharmacist records the cases, so the
 * pharmacist reads the outcomes; splitting them across two apps would invent a
 * role that does not exist, and put a wall between the person who enters a
 * number and the person who has to explain it.
 */
import { useState } from "react";

import { CaseEntry } from "./CaseEntry";
import { Outcomes } from "./Outcomes";
import { FollowupList } from "./components/FollowupList";
import "./pharmacist.css";

const TABS = [
	{ id: "case", label: "收案評估" },
	{ id: "follow", label: "追蹤清單" },
	{ id: "outcomes", label: "成效" },
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
			{tab === "outcomes" && <Outcomes />}
		</div>
	);
}
