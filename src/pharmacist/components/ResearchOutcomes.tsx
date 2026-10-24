/**
 * The research plan's measurement, on screen.
 *
 * Two groups — AI 練習 and 一般衛教 — compared on their own. This is a
 * different question from the QCC's: the QCC asks whether teaching moved the
 * technique, the study asks whether the AI moved it further than usual
 * education would have.
 *
 * What the screen refuses to do:
 *
 * - Show a comparison that two or three people cannot support. The numbers are
 *   still there; the gap between the groups is withheld until both sides carry
 *   enough people to be about the intervention.
 * - Count a case with no group as a control. NULL is not 對照組 — it is a case
 *   that was never in the study.
 * - Print a rate without the number of people it is counted over.
 */
import type { GroupOutcome, ResearchOutcome } from "../../api-client";
import { cn } from "../../lib/utils";
import { Card, CardHeader } from "./ui";

const pct = (n: number) => `${Math.round(n * 100)}%`;
const points = (n: number) => `${Math.round(Math.abs(n) * 100)} 個百分點`;

export function ResearchOutcomes({ data }: { data: ResearchOutcome }) {
	const [experimental, control] = data.groups;
	return (
		<div className="space-y-6">
			<div className="grid gap-3 sm:grid-cols-2" data-testid="research-summary">
				<Tile label="研究收案進度">
					<p className="flex items-baseline gap-1.5">
						<span className="text-4xl font-bold tabular-nums text-text">
							{data.people}
						</span>
						<span className="text-lg font-semibold text-text-muted">
							/ {data.target} 人
						</span>
					</p>
					<p className="mt-1.5 text-caption tabular-nums text-text-secondary">
						實驗組 {experimental.people} 人 · 對照組 {control.people} 人 ·
						以「人」計數
					</p>
				</Tile>

				<Tile label="兩組比較" emphasis>
					{data.comparison ? (
						<>
							<p
								data-testid="research-gap"
								className={cn(
									"text-3xl font-bold leading-tight tabular-nums",
									data.comparison.gap > 0 ? "text-success" : "text-text",
								)}
							>
								{data.comparison.gap > 0
									? `AI 練習組低 ${points(data.comparison.gap)}`
									: `兩組相差 ${points(data.comparison.gap)}`}
							</p>
							<p className="mt-1.5 text-caption leading-snug text-text-secondary">
								AI 練習組 {pct(data.comparison.experimentalAfter)}（
								{data.comparison.experimentalPeople} 人）· 一般衛教組{" "}
								{pct(data.comparison.controlAfter)}（
								{data.comparison.controlPeople} 人）
							</p>
						</>
					) : (
						<>
							<p
								data-testid="research-not-yet"
								className="text-2xl font-bold leading-tight text-text-muted"
							>
								資料尚未收齊
							</p>
							<p className="mt-1.5 text-caption leading-snug text-text-secondary">
								兩組的前後測配對：AI 練習組 {experimental.paired.measured}{" "}
								人、一般衛教組 {control.paired.measured}{" "}
								人。兩組都有人、而且都量過前後，才比得出來。
							</p>
						</>
					)}
				</Tile>
			</div>

			<div className="grid gap-4 lg:grid-cols-2">
				{data.groups.map((g) => (
					<GroupCard key={g.arm} group={g} />
				))}
			</div>
		</div>
	);
}

function GroupCard({ group }: { group: GroupOutcome }) {
	const hasBoth = group.before.cases > 0 && group.after.cases > 0;
	return (
		<Card>
			<CardHeader
				title={group.label}
				description="以「人」計數，同一位病人的前後測算一個人。"
			/>
			<div className="space-y-3">
				<div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
					<p className="text-3xl font-bold tabular-nums text-text">
						{hasBoth ? pct(group.before.errorRate) : "—"}
						<span className="mx-1.5 text-xl text-text-muted">→</span>
						<span className={hasBoth ? "text-text" : "text-text-muted"}>
							{hasBoth ? pct(group.after.errorRate) : "—"}
						</span>
					</p>
					<p className="text-caption tabular-nums text-text-secondary">
						改善前 {group.before.cases} 人 · 改善後 {group.after.cases} 人
					</p>
				</div>
				<p className="text-caption leading-snug text-text-secondary">
					{group.paired.measured > 0 ? (
						<>
							配對 {group.paired.measured} 人 · 改善 {group.paired.b} · 退步{" "}
							{group.paired.c}
							{group.paired.p != null && (
								<>
									{" · "}
									<b
										className={cn(
											group.paired.p < 0.05
												? "text-success"
												: "text-text-secondary",
										)}
									>
										p={group.paired.p}
										{group.paired.p < 0.05 && " 顯著"}
									</b>
								</>
							)}
						</>
					) : (
						"還沒有同一批病人量過前後，暫時看不出變化。"
					)}
				</p>
			</div>
		</Card>
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
			<h2 className="text-caption font-bold tracking-wide text-text-secondary">
				{label}
			</h2>
			<div className="mt-1.5 grow">{children}</div>
		</section>
	);
}
