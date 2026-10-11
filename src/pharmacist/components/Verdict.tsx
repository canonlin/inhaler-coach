/**
 * The verdict: did the intervention work?
 *
 * It used to always lead with a 48px headline rate, which handed the most
 * prominent position on the page to a number computed from however many people
 * happen to have been measured so far. At 收案 1/30 that made a single person's
 * result look like the study's conclusion — visual weight running opposite to
 * evidence.
 *
 * So the headline is now conditional, and the condition is not a threshold
 * someone chose: a before/after rate can only be tested once the same people
 * have been measured both times. Until then the rates are shown at ordinary
 * size with the reason they cannot be compared, and the actionable finding —
 * where the errors are — carries the page. When a paired test exists, the
 * comparison earns the large type.
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

	// A comparison is testable only when the same people were measured twice.
	// Nothing here is a chosen cutoff; it is whether the test can be run at all.
	const testable = Boolean(paired && paired.paired > 0);

	return (
		<Card data-testid="verdict">
			<CardHeader
				title="介入有沒有效"
				description={
					hasBoth
						? `錯誤率（以人為單位）：改善前 ${pct(baseline.errorRate)}，改善後 ${pct(after.errorRate)}。`
						: undefined
				}
				action={
					<span className="text-sm font-semibold text-text-secondary">
						收案 {enrolment.after}/{enrolment.target}
					</span>
				}
			/>

			{testable && hasBoth ? (
				<div className="grid gap-6 px-5 py-5 lg:grid-cols-[minmax(0,1fr)_20rem]">
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
						<p className="mt-2 text-base font-semibold text-text-secondary">
							{delta && delta > 0
								? `改善後降低 ${Math.round(delta * 100)} 個百分點`
								: "改善後尚未下降"}
						</p>
						<PairedNote paired={paired} />
					</div>

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
			) : (
				/* Cannot conclude yet. The numbers are still shown — they are real —
				   but at reading size, with the reason stated, so nothing on this
				   page can be mistaken for a result. */
				<NotYetConclusive
					baseline={baseline}
					after={after}
					paired={paired}
					enrolment={enrolment}
				/>
			)}
		</Card>
	);
}

function NotYetConclusive({
	baseline,
	after,
	paired,
	enrolment,
}: {
	baseline: TechniqueStats;
	after: TechniqueStats;
	paired?: PairedResult;
	enrolment: { target: number; after: number };
}) {
	const remaining = Math.max(0, enrolment.target - enrolment.after);
	return (
		<div className="px-5 py-5">
			<p className="text-xl font-bold text-text">還不能下結論</p>
			<p className="mt-2 max-w-prose text-base leading-relaxed text-text-secondary">
				{paired && paired.paired === 0
					? `目前沒有人同時完成前後測（改善前 ${baseline.cases} 例、改善後 ${after.cases} 例，但重疊 0 人）。計畫書是單組前後測，沒有重疊就沒有可比較的對象，兩條率看起來再漂亮也不是同一批人的變化。`
					: `需要同時有改善前與改善後資料才能比較。目前改善前 ${baseline.cases} 例、改善後 ${after.cases} 例。`}
			</p>

			<dl className="mt-5 grid gap-5 sm:grid-cols-3">
				<Stat
					label="改善前 錯誤率"
					value={pct(baseline.errorRate)}
					sub={`${baseline.peopleWithError}/${baseline.cases} 人`}
				/>
				<Stat
					label="改善後 錯誤率"
					value={pct(after.errorRate)}
					sub={`${after.peopleWithError}/${after.cases} 人`}
				/>
				<Stat
					label="還差"
					value={`${remaining} 人`}
					sub={`收案 ${enrolment.after}/${enrolment.target}`}
				/>
			</dl>
		</div>
	);
}

function Stat({
	label,
	value,
	sub,
}: {
	label: string;
	value: string;
	sub: string;
}) {
	return (
		<div className="border-s-2 border-border-subtle ps-4">
			<dt className="text-[15px] font-semibold text-text-secondary">{label}</dt>
			<dd className="mt-0.5 text-2xl font-bold tabular-nums text-text">
				{value}
			</dd>
			<p className="mt-0.5 text-[13px] tabular-nums text-text-muted">{sub}</p>
		</div>
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
			<p className="mt-3 rounded-md bg-surface-muted px-4 py-3 text-[15px] text-text-secondary">
				尚無同時完成前後測的病人，無法做配對比較。
			</p>
		);
	}
	const significant = paired.p !== null && paired.p < 0.05;
	return (
		<p className="mt-3 rounded-md bg-surface-muted px-4 py-3 text-[15px] text-text-secondary">
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
			<dt className="text-[15px] font-semibold text-text-secondary">{label}</dt>
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
					<span className="text-[15px] font-semibold text-text-muted">
						{delta > 0 ? "−" : "+"}
						{Math.abs(Math.round(delta * 100))} pt
					</span>
				)}
			</dd>
		</div>
	);
}
