/**
 * The QCC's own measurement, unchanged.
 *
 * Every inhaler on the formulary, enrolled and compared before/after. These
 * are the numbers the dashboard has always shown, and moving them behind a tab
 * must not change a single figure — the tab says which programme a number
 * belongs to, it does not become a reason to recompute it.
 *
 * The stage filter stays on the QCC tab: 改善前／改善後 is the QCC's axis. The
 * research plan does not have it, and it would be wrong to offer it there.
 */
import type { Summary } from "../../api-client";
import { DeviceBeforeAfter } from "./DeviceBeforeAfter";
import { EngagementPanel } from "./EngagementPanel";
import { OutcomeSummary } from "./OutcomeSummary";
import { StepHeatmap } from "./StepHeatmap";
import { StepPareto } from "./StepPareto";
import { Card, CardHeader } from "./ui";

export function QccOutcomes({ data }: { data: Summary }) {
	return (
		<>
			<OutcomeSummary
				baseline={data.baseline}
				after={data.after}
				enrolment={data.enrolment}
				paired={data.paired}
				engagement={data.engagement}
			/>

			<Card>
				<CardHeader
					title="各劑型的錯誤率"
					description="衛教方式依裝置而不同，所以分開看。右欄空白代表介入還沒排到那種裝置，不是零。"
				/>
				<DeviceBeforeAfter
					before={data.byDevice?.before ?? {}}
					after={data.byDevice?.after ?? {}}
				/>
			</Card>

			<Card>
				<CardHeader
					title="每個步驟：改善前 → 改善後"
					description="依改善前的錯誤率排序。數字是「做錯／評估這一步」。▲ 代表改善後仍偏高，而且樣本夠大到能這樣說。"
				/>
				<StepHeatmap steps={data.stepsBeforeAfter ?? []} />
			</Card>

			<Card>
				<CardHeader
					title="錯在哪裡"
					description="每個步驟被評估時的錯誤次數，從最多錯的排起。★ 標記關鍵步驟——錯了通常代表藥到不了肺部。"
				/>
				<StepPareto rates={data.stepRates} pareto={data.pareto} />
			</Card>

			<Card>
				<CardHeader
					title="民眾有在用嗎"
					description="以「人」計數。同一個人練習四次仍算一位。這裡看的是有沒有人在用，不是操作有沒有進步。"
				/>
				<EngagementPanel e={data.engagement ?? null} />
			</Card>
		</>
	);
}
