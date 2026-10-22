/**
 * Taking the cases back out as a spreadsheet.
 *
 * The export is a link rather than a fetch: a download is a navigation, and
 * the browser already knows how to handle one. The session is a cookie, so it
 * rides along with it.
 */
import { useState } from "react";

import { exportCasesUrl } from "../../api-client";
import {
	Button,
	Card,
	CardHeader,
	Field,
	Input,
	Select,
	SelectItem,
} from "./ui";

/** The stage the rows belong to. */
const STAGES = ["改善前", "改善後"];

const STAGE_LABEL: Record<string, string> = {
	改善前: "改善前（前測）",
	改善後: "改善後（後測）",
};

/*
 * The value meaning 「不篩選」.
 *
 * Radix reserves the empty string for the placeholder, so 「全部」 cannot be
 * expressed as `value=""` without making the control a one-way door: choose it
 * and there is no way back. A real value is used instead.
 */
const ALL = "*";

export function ExportPanel() {
	const [month, setMonth] = useState("");
	const [stage, setStage] = useState("");

	return (
		<Card>
			<CardHeader
				title="匯出 Excel"
				description="匯出的是收案紀錄與步驟結果，欄位與你的試算表同形，可以直接對照。病歷號碼只會帶出末四碼。"
			/>
			<div className="flex flex-wrap items-end gap-4 px-5 py-4">
				<Field label="月份" htmlFor="month" hint="留空＝全部。例：2026-05">
					<Input
						id="month"
						value={month}
						onChange={(e) => setMonth(e.target.value)}
						placeholder="2026-05"
						className="w-40"
					/>
				</Field>
				<Field label="階段" htmlFor="export-stage">
					<Select
						id="export-stage"
						placeholder="全部"
						value={stage === "" ? ALL : stage}
						onValueChange={(v) => setStage(v === ALL ? "" : v)}
						className="w-40"
					>
						<SelectItem value={ALL}>全部</SelectItem>
						{STAGES.map((s) => (
							<SelectItem key={s} value={s}>
								{STAGE_LABEL[s]}
							</SelectItem>
						))}
					</Select>
				</Field>
				<a
					href={exportCasesUrl({ month: month.trim(), stage })}
					download="inhaler-coach-cases.xlsx"
					data-testid="export-link"
					className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-primary px-4 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary-dark"
				>
					下載 Excel
				</a>
			</div>
		</Card>
	);
}
