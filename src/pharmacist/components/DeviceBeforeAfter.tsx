/**
 * Error rate by device class, before and after.
 *
 * This was panel 1 of the original dashboard and was dropped. It is back for the
 * reason the QCC needs it: the education differs by device — 定量噴霧 has to be
 * shaken and inhaled slowly, 乾粉 has to be inhaled fast and hard — so a device
 * that is not improving is a different problem with a different answer, and a
 * pooled figure hides it by averaging the two together.
 *
 * Brand would not do this job. Symbicort and Breztri are both MDI and are
 * taught identically; splitting by brand separates patients the pharmacist
 * cannot change and produces groups far too small to conclude anything about.
 * So the cut is the device class, which is also the prefix the 33 step codes
 * are built on.
 *
 * The honest part: where a device has baseline cases but no post-intervention
 * cases, the row says so and shows nothing on the right. Currently ELP has 22
 * baseline and 0 after, RSP has 14 and 0. Drawing an empty bar would read as a
 * rate of zero; writing 介入後尚無資料 reads as what it is — the intervention
 * has not reached those patients yet. A dashboard that cannot show its own gaps
 * will have them reported in a meeting instead.
 */
import { DEVICES } from "../../domain/steps.js";
import { cn } from "../../lib/utils";

interface DeviceStat {
	cases: number;
	errorRate: number;
	criticalRate: number;
}

function pct(rate: number): string {
	return `${Math.round(rate * 100)}%`;
}

export function DeviceBeforeAfter({
	before,
	after,
}: {
	before: Record<string, DeviceStat>;
	after: Record<string, DeviceStat>;
}) {
	/*
	 * Every device known to the domain, not only the ones present in the data.
	 * A device with no cases at all is a different statement from one that has
	 * baseline and no follow-up, and a table built from the data alone cannot
	 * tell those apart.
	 */
	const devices = Object.keys(DEVICES) as (keyof typeof DEVICES)[];

	return (
		<div className="overflow-x-auto">
			<table
				className="w-full border-collapse text-base"
				data-testid="device-compare"
			>
				<caption className="sr-only">依劑型的錯誤率：改善前與改善後</caption>
				<thead>
					<tr>
						<th
							scope="col"
							className="px-4 py-2 text-left font-semibold text-text-secondary"
						>
							劑型
						</th>
						<th
							scope="col"
							className="px-4 py-2 text-left font-semibold text-text-secondary"
						>
							衛教重點
						</th>
						<th
							scope="col"
							className="w-44 px-4 py-2 text-right font-semibold text-text-secondary"
						>
							改善前
						</th>
						<th
							scope="col"
							className="w-44 px-4 py-2 text-right font-semibold text-text-secondary"
						>
							改善後
						</th>
					</tr>
				</thead>
				<tbody>
					{devices.map((d) => {
						const b = before[d];
						const a = after[d];
						const none = !b && !a;
						const missingAfter = Boolean(b) && !a;

						return (
							<tr
								key={d}
								className={cn(
									"border-b border-border-subtle/60 last:border-b-0",
									none && "text-text-muted",
								)}
							>
								<th
									scope="row"
									className="px-4 py-2.5 text-left font-semibold text-text"
								>
									{DEVICES[d].label}
								</th>
								<td className="px-4 py-2.5 text-text-secondary">
									{DEVICES[d].speed}
								</td>
								{b ? (
									<RateCell stat={b} />
								) : (
									<td className="px-4 py-2.5 text-right text-text-muted">
										無個案
									</td>
								)}
								{missingAfter ? (
									<td className="whitespace-nowrap px-4 py-2.5 text-right">
										<span className="font-semibold text-warning">尚未介入</span>
									</td>
								) : a ? (
									<RateCell stat={a} />
								) : (
									<td className="px-4 py-2.5 text-right text-text-muted">—</td>
								)}
							</tr>
						);
					})}
				</tbody>
			</table>
			<p className="border-t border-border px-4 pt-3 pb-4 text-base text-text-secondary">
				<span className="font-semibold text-text">註：</span>以「人」計
				{/*
				 * Marked 註：, not left to look different.
				 *
				 * Raising this from 13px to the 16px floor to satisfy the type scale
				 * left it identical to the body text above. A hairline rule above it
				 * was the second attempt and is invisible against this surface — so
				 * both attempts carried a distinction that had to be plain on
				 * subtlety. A label says what it is, reaches a screen reader, and
				 * cannot be lost against a background.
				 */}
				：至少錯一步就算錯。依劑型切不依品牌切，因為衛教方式由裝置決定。
			</p>
		</div>
	);
}

/**
 * The rate plus the count behind it.
 *
 * The count is not decoration: with four people in a cohort, 25% is one person
 * and 75% is three, and printing the percentage alone makes those look like
 * findings.
 */
function RateCell({ stat }: { stat: DeviceStat }) {
	return (
		<td className="px-4 py-2.5 text-right">
			<span
				className={cn(
					"text-lg font-bold tabular-nums",
					stat.errorRate >= 0.5
						? "text-danger"
						: stat.errorRate >= 0.25
							? "text-warning"
							: "text-text",
				)}
			>
				{pct(stat.errorRate)}
			</span>
			<span className="ml-2 text-base tabular-nums text-text-secondary">
				{stat.cases} 人
			</span>
		</td>
	);
}
