/**
 * Whether anyone is actually using this, and whether the follow-up is closing.
 *
 * This exists because the pharmacist asked the only question that matters about
 * direction: is the system going the right way, and how are patients using it.
 * The error rate answers neither. A platform with zero follow-up completion can
 * hold a stable error rate simply because nobody came back to be measured.
 *
 * Every count is people, not events, so one patient practising four times is
 * one person — matching the plan's per-person analysis unit.
 *
 * On a fresh database all of these are zero. That is the intended reading: "nobody
 * has used this yet" must be visible rather than an empty screen.
 */
import { Badge, Card, CardHeader } from "./ui";

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
	const rate = e.followupCompletionRate;

	return (
		<Card>
			<CardHeader
				title="民眾有在用嗎"
				description="以「人」計數，不是次數。一個人練習四次仍算一位。這裡回答系統有沒有被真的使用，不是操作有沒有變好。"
			/>

			<div className="px-5 py-5">
				<div className="grid gap-4 sm:grid-cols-[8rem_minmax(0,1fr)_3rem_8rem] sm:items-center">
					<span className="text-sm font-bold text-text">已收案</span>
					<span className="h-2 overflow-hidden rounded-full bg-surface-muted">
						<span className="block h-full w-full rounded-full bg-primary" />
					</span>
					<span className="text-right text-sm font-bold tabular-nums text-text">
						{e.enrolled}
					</span>
					<span className="text-xs text-text-muted">分母</span>
				</div>

				{CHAINS.map((chain) => (
					<fieldset
						key={chain.label}
						className="mt-4 border-s-2 border-border-subtle ps-4"
					>
						<legend className="px-1 text-xs font-bold text-text-secondary">
							{chain.label}
						</legend>
						<div className="space-y-2">
							{chain.steps.map((step, i) => {
								const value = e[step.key];
								const denom = i === 0 ? e.enrolled : e[chain.steps[i - 1].key];
								return (
									<div
										key={step.key}
										className="grid gap-1 sm:grid-cols-[8rem_minmax(0,1fr)_3rem_8rem] sm:items-center"
									>
										<span className="text-base text-text-secondary">
											{step.label}
										</span>
										<span className="h-2 overflow-hidden rounded-full bg-surface-muted">
											<span
												className="block h-full rounded-full bg-primary"
												style={{
													inlineSize: `${e.enrolled > 0 ? (value / e.enrolled) * 100 : 0}%`,
												}}
											/>
										</span>
										<span className="text-right text-sm font-semibold tabular-nums text-text">
											{value}
										</span>
										<span className="text-xs tabular-nums text-text-muted">
											{denom > 0
												? `${pct(value, denom)} 佔上一步`
												: "無上一步可比"}
										</span>
									</div>
								);
							})}
						</div>
					</fieldset>
				))}

				<div className="mt-6 rounded-md border border-border-subtle bg-surface-muted px-4 py-3">
					<div className="flex items-baseline gap-3">
						<span className="text-sm font-semibold text-text-secondary">
							追蹤完成率
						</span>
						<span className="text-3xl font-bold tabular-nums text-text">
							{rate == null ? "—" : `${Math.round(rate * 100)}%`}
						</span>
						{rate === 0 && <Badge tone="danger">全部未完成</Badge>}
					</div>
					<p className="mt-1 text-base text-text-secondary">
						已到期 {e.followupDue} 件，完成 {e.followupDone} 件。
						{e.fu_open > 0 && ` 尚未到期或未結案 ${e.fu_open} 件。`}
						{e.fu_missed > 0 && ` 標記未完成 ${e.fu_missed} 件。`}
					</p>
				</div>

				<p className="mt-4 text-base text-text-secondary">
					近 7 天有動作的病人：{e.active_7d} 人。
					{e.active_7d === 0 && " 目前沒有任何病人使用紀錄。"}
				</p>
			</div>
		</Card>
	);
}
