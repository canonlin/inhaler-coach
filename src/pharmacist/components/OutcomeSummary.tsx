/**
 * The first screen: the state of the study at a glance.
 *
 * This screen used to open with a heading, a paragraph explaining the page's own
 * section order, and a filter — so the most valuable real estate above the fold
 * spent itself on chrome, and the first numbers a reader met were three rows
 * into a step table. An overview is supposed to answer "where does this stand"
 * in one look; that is what this band is for, and the detail sections below
 * carry what does not fit in a glance.
 *
 * Each tile answers one question the screen exists to answer, and none of them
 * repeats a number shown further down:
 *
 *   收案進度   how far along the study is (the plan's own target)
 *   操作錯誤率  whether the intervention changed anything
 *   追蹤完成率  whether follow-up is actually happening
 *   近 7 日     whether anyone is using the platform at all
 *
 * The error tile keeps the confidence gate: the headline rate only appears when
 * the same people were measured twice. At 收案 1/30 that tile says so instead of
 * presenting a rate that cannot be tested, which is the whole point of having
 * an overview — the state, not the most flattering number.
 */
import type { PairedResult, Summary, TechniqueStats } from "../../api-client";
import { cn } from "../../lib/utils";

const pct = (n: number) => `${Math.round(n * 100)}%`;

export function OutcomeSummary({
	baseline,
	after,
	enrolment,
	paired,
	engagement,
}: {
	baseline: TechniqueStats;
	after: TechniqueStats;
	enrolment: { target: number; after: number };
	paired?: PairedResult;
	engagement: Summary["engagement"];
}) {
	const hasBoth = baseline.cases > 0 && after.cases > 0;
	const testable = Boolean(paired && paired.paired > 0);
	const delta = hasBoth ? baseline.errorRate - after.errorRate : null;

	return (
		<div
			className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"
			data-testid="outcome-summary"
		>
			{/* 1. How far along the study is. */}
			<Tile label="收案進度">
				<p className="flex items-baseline gap-1.5">
					<span className="text-4xl font-bold tabular-nums text-text">
						{enrolment.after}
					</span>
					<span className="text-lg font-semibold text-text-muted">
						/ {enrolment.target}
					</span>
				</p>
				<Progress
					value={enrolment.target > 0 ? enrolment.after / enrolment.target : 0}
					note={`還差 ${Math.max(0, enrolment.target - enrolment.after)} 人`}
				/>
			</Tile>

			{/*
			 * 2. Whether the intervention changed anything. The gate is not a
			 * threshold anyone chose: a before/after rate can only be tested once
			 * the same people have been measured both times.
			 */}
			<Tile label="操作錯誤率" emphasis>
				{testable && hasBoth ? (
					<>
						<p
							data-testid="error-rate-headline"
							className="text-4xl font-bold tracking-tight tabular-nums text-text"
						>
							{pct(baseline.errorRate)}
							<span className="mx-1.5 text-2xl text-text-muted">→</span>
							<span
								className={delta && delta > 0 ? "text-success" : "text-danger"}
							>
								{pct(after.errorRate)}
							</span>
						</p>
						<p
							data-testid="error-rate-support"
							className="mt-1.5 text-[13px] leading-snug text-text-secondary"
						>
							配對 {paired?.paired} 人 · 改善 {paired?.b} · 退步 {paired?.c}
							{paired?.p != null && (
								<>
									{" · "}
									<b
										className={cn(
											paired.p < 0.05 ? "text-success" : "text-text-secondary",
										)}
									>
										p={paired.p}
										{paired.p < 0.05 && " 顯著"}
									</b>
								</>
							)}
						</p>
					</>
				) : (
					<>
						<p
							data-testid="error-rate-blocked"
							className="text-2xl font-bold leading-tight text-text-muted"
						>
							還不能下結論
						</p>
						<p className="mt-1.5 text-[13px] leading-snug text-text-secondary">
							改善前 {baseline.cases} 例、改善後 {after.cases} 例，
							{paired?.paired === 0 ? "但重疊 0 人" : "無法定義前後測"}
							—— 沒有同一批病人就看不出變化。
						</p>
					</>
				)}
			</Tile>

			{/* 3 and 4: whether it is being used, which error rate cannot say. */}
			<Tile label="追蹤完成率">
				<p className="text-4xl font-bold tabular-nums text-text">
					{engagement
						? engagement.followupCompletionRate == null
							? "—"
							: pct(engagement.followupCompletionRate)
						: "—"}
				</p>
				<p className="mt-1.5 text-[13px] leading-snug text-text-secondary">
					{engagement ? (
						<>
							已到期 {engagement.followupDue} 件 · 完成{" "}
							{engagement.followupDone} 件
							{engagement.followupCompletionRate === 0 && (
								<span className="ml-1 font-semibold text-danger">
									全部未完成
								</span>
							)}
						</>
					) : (
						"—"
					)}
				</p>
			</Tile>

			<Tile label="近 7 天活躍">
				<p className="flex items-baseline gap-1.5">
					<span
						className={cn(
							"text-4xl font-bold tabular-nums",
							engagement && engagement.active_7d === 0
								? "text-text-muted"
								: "text-text",
						)}
					>
						{engagement?.active_7d ?? 0}
					</span>
					<span className="text-lg font-semibold text-text-muted">人</span>
				</p>
				<p className="mt-1.5 text-[13px] leading-snug text-text-secondary">
					{engagement && engagement.active_7d === 0
						? "目前沒有病人使用紀錄"
						: "有動作的病人（以人計數）"}
				</p>
			</Tile>
		</div>
	);
}

function Tile({
	label,
	children,
	emphasis,
}: {
	label: string;
	children: React.ReactNode;
	emphasis?: boolean;
}) {
	return (
		<section
			className={cn(
				"flex flex-col rounded-lg border bg-surface px-4 py-3.5",
				emphasis ? "border-primary/30" : "border-border-subtle",
			)}
		>
			<h2 className="text-[13px] font-bold tracking-wide text-text-secondary">
				{label}
			</h2>
			<div className="mt-1.5 grow">{children}</div>
		</section>
	);
}

function Progress({ value, note }: { value: number; note: string }) {
	const clamped = Math.max(0, Math.min(1, value));
	return (
		<div className="mt-2.5">
			<span className="block h-2 overflow-hidden rounded-full bg-surface-muted">
				<span
					className="block h-full rounded-full bg-primary"
					style={{ inlineSize: `${clamped * 100}%` }}
				/>
			</span>
			<p className="mt-1.5 text-[13px] tabular-nums text-text-secondary">
				{note}
			</p>
		</div>
	);
}
