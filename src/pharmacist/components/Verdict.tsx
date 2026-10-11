/**
 * The verdict: did the intervention work?
 *
 * This is the only question this view exists to answer, so it gets the top of
 * the page alone. One headline number, the comparison, and the paired test —
 * no decoration that does not change a decision.
 */
import type { PairedResult, TechniqueStats } from "../../api-client";
import { cn } from "../../lib/utils";
import { Card, CardHeader } from "./ui";

const pct = (n: number) => `${Math.round(n * 100)}%`;

export function Verdict({
	baseline,
	after,
	enrolment,
	paired,
}: {
	baseline: TechniqueStats;
	after: TechniqueStats;
	enrolment: { target: number; after: number };
	paired?: PairedResult;
}) {
	const hasBoth = baseline.cases > 0 && after.cases > 0;
	const delta = hasBoth ? baseline.errorRate - after.errorRate : null;
	const critDelta = hasBoth ? baseline.criticalRate - after.criticalRate : null;

	return (
		<Card data-testid="verdict">
			<CardHeader
				title="操作錯誤率（以人為單位）"
				description={
					hasBoth
						? `${baseline.peopleWithError}/${baseline.cases} 人至少錯一步，改善後 ${after.peopleWithError}/${after.cases} 人。`
						: undefined
				}
				action={
					<span className="text-sm font-semibold text-text-secondary">
						收案 {enrolment.after}/{enrolment.target}
					</span>
				}
			/>
			<div className="grid gap-6 px-5 py-5 lg:grid-cols-[minmax(0,1fr)_20rem]">
				{hasBoth ? (
					<div>
						<p
							data-testid="verdict-number"
							className="text-5xl font-bold tracking-tight text-text"
						>
							{pct(baseline.errorRate)}
							<span className="mx-3 text-text-muted">→</span>
							<span
								className={delta && delta > 0 ? "text-success" : "text-danger"}
							>
								{pct(after.errorRate)}
							</span>
						</p>
						<p className="mt-2 text-sm font-semibold text-text-secondary">
							{delta && delta > 0
								? `改善後降低 ${Math.round(delta * 100)} 個百分點`
								: "改善後尚未下降"}
						</p>
						<PairedNote paired={paired} />
					</div>
				) : (
					<p className="text-base text-text-secondary">
						需要同時有改善前與改善後資料才能比較。目前改善前 {baseline.cases}{" "}
						例、改善後 {after.cases} 例。
					</p>
				)}

				<dl className="grid grid-cols-2 gap-4 self-start lg:grid-cols-1">
					<Metric
						label="關鍵錯誤率"
						before={baseline.criticalRate}
						after={after.criticalRate}
						delta={critDelta}
					/>
					<Metric
						label="收案數"
						before={baseline.cases}
						after={after.cases}
						raw
					/>
					<Metric
						label="錯誤步驟"
						before={baseline.wrongSteps}
						after={after.wrongSteps}
						raw
						invert
					/>
				</dl>
			</div>
		</Card>
	);
}

/**
 * The plan's design is single-group pre-post, so the same people are counted
 * twice. Showing before-and-after rates without saying how many people were
 * measured both times invites reading a cohort change as an effect.
 */
function PairedNote({ paired }: { paired?: PairedResult }) {
	if (!paired || paired.paired === 0) {
		return (
			<p className="mt-3 rounded-md bg-surface-muted px-4 py-3 text-sm text-text-secondary">
				尚無同時完成前後測的病人，無法做配對比較。
			</p>
		);
	}
	const significant = paired.p !== null && paired.p < 0.05;
	return (
		<p className="mt-3 rounded-md bg-surface-muted px-4 py-3 text-sm text-text-secondary">
			前後測配對中，改變 {paired.b + paired.c} 人：改善 {paired.b} 人、退步{" "}
			{paired.c} 人。
			{paired.p !== null && (
				<>
					{" "}
					McNemar 精確檢定 p = {paired.p}
					{significant ? "（顯著）" : "（未達顯著）"}。
				</>
			)}
		</p>
	);
}

function Metric({
	label,
	before,
	after,
	delta,
	raw,
	invert,
}: {
	label: string;
	before: number;
	after: number;
	delta?: number | null;
	raw?: boolean;
	invert?: boolean;
}) {
	const better = invert ? after < before : after > before;
	const same = before === after;
	const show = (v: number) => (raw ? String(v) : pct(v));

	return (
		<div>
			<dt className="text-sm font-semibold text-text-secondary">{label}</dt>
			<dd className="mt-0.5 flex items-baseline gap-2 text-lg font-bold tabular-nums text-text">
				{show(before)}
				<span className="text-text-muted">→</span>
				<span
					className={cn(
						same ? "text-text" : better ? "text-success" : "text-danger",
					)}
				>
					{show(after)}
				</span>
				{delta != null && !same && (
					<span className="text-sm font-semibold text-text-muted">
						{delta > 0 ? "−" : "+"}
						{Math.abs(Math.round(delta * 100))} pt
					</span>
				)}
			</dd>
		</div>
	);
}
