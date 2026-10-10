/**
 * The verdict: did the intervention work?
 *
 * This is the only question this view exists to answer, so it gets the top of
 * the page alone. Two numbers, one comparison, no decoration.
 */
import type { PairedResult, TechniqueStats } from "../../api-client";

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
		<div className="verdict">
			<div className="verdict-main">
				<span className="eyebrow">操作錯誤率（以人為單位）</span>
				{hasBoth ? (
					<>
						<p className="verdict-number">
							{pct(baseline.errorRate)}
							<span className="arrow">→</span>
							<span className={delta && delta > 0 ? "good" : "flat"}>
								{pct(after.errorRate)}
							</span>
						</p>
						<p className="verdict-note">
							{delta && delta > 0
								? `改善後降低 ${Math.round(delta * 100)} 個百分點`
								: "改善後尚未下降"}
							{enrolment.after < enrolment.target
								? ` · 收案 ${enrolment.after}/${enrolment.target}`
								: " · 已達收案目標"}
						</p>
						<p className="verdict-note muted">
							{baseline.peopleWithError}/{baseline.cases} 人至少錯一步
							{after.cases > 0 && `，改善後 ${after.peopleWithError}/${after.cases} 人`}
						</p>
						<PairedNote paired={paired} />
					</>
				) : (
					<p className="verdict-note">
						需要同時有改善前與改善後資料才能比較。目前改善前 {baseline.cases}{" "}
						例、改善後 {after.cases} 例。
					</p>
				)}
			</div>

			<div className="verdict-side">
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
			</div>
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
			<p className="verdict-note muted">
				尚無同時完成前後測的病人，無法做配對比較。
			</p>
		);
	}
	const significant = paired.p !== null && paired.p < 0.05;
	return (
		<p className="verdict-note muted">
			前後測配對中，改變 {paired.b + paired.c} 人：改善 {paired.b} 人、退步 {paired.c} 人。
			{paired.p !== null && (
				<>
					{" "}McNemar 精確檢定 p = {paired.p}
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
		<div className="metric">
			<span className="metric-label">{label}</span>
			<span className="metric-value">
				{show(before)}
				<span className="arrow">→</span>
				<span className={same ? "flat" : better ? "good" : "bad"}>
					{show(after)}
				</span>
			</span>
			{delta != null && !same && (
				<span className="metric-delta">
					{delta > 0 ? "−" : "+"}
					{Math.abs(Math.round(delta * 100))} pt
				</span>
			)}
		</div>
	);
}
