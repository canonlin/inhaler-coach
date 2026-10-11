/**
 * How patients are actually using the platform.
 *
 * This exists because the pharmacist asked the only question that matters about
 * direction: is the system going the right way, and how are patients using it.
 * The error rate answers neither. A platform with zero follow-up completion can
 * hold a stable error rate simply because nobody came back to be measured.
 *
 * Every count is people, not events, so one patient practising four times is one
 * person — matching the plan's per-person analysis unit.
 *
 * Scope note: enrolment progress, follow-up completion rate and weekly actives
 * live in the summary band at the top of the screen. Repeating them here would
 * make the reader confirm the same three numbers twice, so this panel holds only
 * what the band does not: the two chains that show *how* people get from
 * enrolled to practising.
 *
 * On a fresh database both chains are empty. That is the intended reading:
 * "nobody has used this yet" must be visible rather than an empty screen.
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
 * Two chains from one enrolled base. Practising and adding LINE are not steps
 * of each other, so neither is a denominator for the other.
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

const pct = (n: number, d: number) =>
	d > 0 ? `${Math.round((n / d) * 100)}%` : "—";

export function EngagementPanel({ e }: { e: Engagement | null }) {
	if (!e) return null;

	return (
		/*
		 * The padding is this component's job, and it has to match CardHeader's
		 * exactly. Card is a bare bordered box: a header supplies its own
		 * padding, so a body that does not supplies none — which is how the
		 * 「全部個案」 row and both chains ended up straddling the card's border
		 * with their last column hanging outside it.
		 */
		<div className="px-5 py-4">
			<div className="grid gap-4 sm:grid-cols-[10rem_minmax(0,1fr)_2.75rem_9rem] sm:items-center">
				{/*
				 * Labelled 全部個案, not 已收案, because the summary band above
				 * says 「收案進度 18/30」 and this row is 61 — every distinct
				 * patient in the database, baseline cohort included. Both numbers
				 * are right, but two scopes sharing the word 收案 on one screen
				 * read as a contradiction. Which cohort the chains below should
				 * be measured against is a separate question and is not decided
				 * here: this row only names what the query counts.
				 */}
				<span className="text-base font-bold text-text">全部個案</span>
				<span className="h-2.5 overflow-hidden rounded-full bg-surface-muted">
					<span className="block h-full w-full rounded-full bg-primary" />
				</span>
				<span className="text-right text-base font-bold tabular-nums text-text">
					{e.enrolled}
				</span>
				<span className="text-caption text-text-muted">以下比例的分母</span>
			</div>

			{CHAINS.map((chain) => (
				<fieldset
					key={chain.label}
					className="mt-4 border-s-2 border-border-subtle ps-4"
				>
					<legend className="px-1 text-caption font-bold text-text-secondary">
						{chain.label}
					</legend>
					<div className="space-y-2">
						{chain.steps.map((step, i) => {
							const value = e[step.key];
							const denom = i === 0 ? e.enrolled : e[chain.steps[i - 1].key];
							return (
								<div
									key={step.key}
									className="grid gap-1 sm:grid-cols-[10rem_minmax(0,1fr)_2.75rem_9rem] sm:items-center"
								>
									<span className="text-base text-text-secondary">
										{step.label}
									</span>
									<span className="h-2.5 overflow-hidden rounded-full bg-surface-muted">
										<span
											className="block h-full rounded-full bg-primary"
											style={{
												inlineSize: `${e.enrolled > 0 ? (value / e.enrolled) * 100 : 0}%`,
											}}
										/>
									</span>
									<span className="text-right text-base font-semibold tabular-nums text-text">
										{value}
									</span>
									<span className="text-caption tabular-nums text-text-muted">
										{denom > 0 ? pct(value, denom) : "尚無上一步"}
									</span>
								</div>
							);
						})}
					</div>
				</fieldset>
			))}

			{e.fu_open > 0 && (
				<p className="mt-4 text-base text-text-secondary">
					尚未到期或未結案 {e.fu_open} 件
					{e.fu_missed > 0 && `，其中標記未完成 ${e.fu_missed} 件`}。
				</p>
			)}
		</div>
	);
}
