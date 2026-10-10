/**
 * Whether anyone is actually using this, and whether the follow-up is closing.
 *
 * This exists because the pharmacist asked the only question that matters about
 * direction: is the system going the right way, and how are patients using it.
 * The error rate answers neither. A platform with zero follow-up completion can
 * hold a stable error rate simply because nobody came back to be measured.
 *
 * Every count is people, not events, so one patient practising four times is
 * one person. That matches the plan's per-person analysis unit.
 *
 * On a fresh database all of these are zero. That is the intended reading, not a
 * failure to load: "nobody has used this yet" must be visible rather than an
 * empty screen.
 */
export interface Engagement {
	enrolled: number;
	practised: number;
	completed_practice: number;
	line_linked: number;
	line_responded: number;
	fu_open: number;
	fu_done: number;
	fu_missed: number;
	active_7d: number;
	followupDue: number;
	followupDone: number;
	followupCompletionRate: number | null;
}

/**
 * Steps of the funnel, in the order a patient actually meets them.
 *
 * `of` names the previous step *in that same chain*, not merely a denominator.
 * LINE is a separate chain from practice: a patient can be asked to add LINE
 * without ever having practised, so the funnel is two chains sharing an
 * enrolled base. Getting this wrong prints a percentage against a number the
 * percentage has nothing to do with, which is worse than printing nothing.
 */
const CHAINS = [
	{
		label: "AI 練習",
		steps: [
			{ key: "practised", label: "有做 AI 練習" },
			{ key: "completed_practice", label: "練習完成" },
		],
	},
	{
		label: "LINE",
		steps: [
			{ key: "line_linked", label: "已加 LINE" },
			{ key: "line_responded", label: "LINE 有回覆" },
		],
	},
] as const;

/** Formats 0 as a zero rather than a dash: absence is the finding. */
const pct = (n: number, d: number) => (d > 0 ? `${Math.round((n / d) * 100)}%` : "—");

export function EngagementPanel({ e }: { e: Engagement | null }) {
	if (!e) return null;
	const rate = e.followupCompletionRate;

	return (
		<section className="block">
			<h2>民眾有在用嗎</h2>
			<p className="hint">
				以「人」計數，不是次數。一個人練習四次仍算一位。
				這裡回答的是系統有沒有被真的使用，不是操作有沒有變好。
			</p>

			{/* Two chains from the same enrolled base: practising and LINE are
			    independent, so neither is a step of the other. */}
			<div className="funnel-base">
				<span className="funnel-label">已收案</span>
				<span className="funnel-bar">
					<span className="funnel-fill" style={{ inlineSize: "100%" }} />
				</span>
				<span className="funnel-num">{e.enrolled}</span>
				<span className="funnel-pct muted">分母</span>
			</div>

			{CHAINS.map((chain) => (
				<fieldset key={chain.label} className="funnel-chain">
					<legend>{chain.label}</legend>
					{chain.steps.map((step, i) => {
						const value = e[step.key];
						const denom = i === 0 ? e.enrolled : e[chain.steps[i - 1].key];
						return (
							<div key={step.key} className="funnel-row">
								<span className="funnel-label">{step.label}</span>
								<span className="funnel-bar">
									<span
										className="funnel-fill"
										style={{
											inlineSize: `${e.enrolled > 0 ? (value / e.enrolled) * 100 : 0}%`,
										}}
									/>
								</span>
								<span className="funnel-num">{value}</span>
								<span className="funnel-pct muted">
									{denom > 0 ? `${pct(value, denom)} 佔上一步` : "無上一步可比"}
								</span>
							</div>
						);
					})}
				</fieldset>
			))}

			{/*
			 * Follow-up completion is the indicator the whole project rests on —
			 * the baseline had 62 cases at M0 and none at M1. It is shown as its
			 * own number rather than folded into the funnel because it is the one
			 * number that can be zero while every other number looks fine.
			 */}
			<div className="fu-kpi">
				<div>
					<span className="kpi-label">追蹤完成率</span>
					<span className="kpi-value">
						{rate == null ? "—" : `${Math.round(rate * 100)}%`}
					</span>
				</div>
				<p className="hint">
					已到期 {e.followupDue} 件，完成 {e.followupDone} 件。
					{e.fu_open > 0 && ` 尚未到期或未結案 ${e.fu_open} 件。`}
					{e.fu_missed > 0 && ` 標記未完成 ${e.fu_missed} 件。`}
				</p>
			</div>

			<p className="hint">
				近 7 天有動作的病人：{e.active_7d} 人。
				{e.active_7d === 0 && " 目前沒有任何病人使用紀錄。"}
			</p>
		</section>
	);
}