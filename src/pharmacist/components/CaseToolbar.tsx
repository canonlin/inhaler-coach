/**
 * What can be done to the case list as a whole: take it out as a file, or put
 * the pharmacist's own sheet in.
 *
 * Both of these used to live behind a navigation item called 資料匯入, which
 * was the wrong shape for them. The navigation is the pharmacist's jobs —
 * record a case, follow it up, read the results, edit the teaching material —
 * and moving a spreadsheet in and out is not one of them; it is an action on
 * the very cases this list shows. So the actions are here, on the list, where
 * the cases they act on are.
 *
 * The export is a link rather than a fetch: a download is a navigation, and
 * the browser already knows how to handle one. The session is a cookie, so it
 * rides along with it.
 *
 * The import is a page rather than a panel here, because it is a sequence and
 * not an action: pick the file, rehearse it, read what it disagrees with, and
 * only then write. A button that starts a rehearsal has to have somewhere to
 * put the report, and a table of thirty rows is not somewhere.
 */
import { useState } from "react";
import { Link } from "react-router-dom";

import { exportCasesUrl } from "../../api-client";
import { STAGE_LABEL, STAGES } from "../../domain/enrollment-sheet.js";
import { Input, Select, SelectItem } from "./ui";

/*
 * The value meaning 「不篩選」.
 *
 * Radix reserves the empty string for the placeholder, so 「全部」 cannot be
 * `value=""` without making the control a one-way door: choose it and there is
 * no way back. A real value is used instead.
 */
const ALL = "*";

export function CaseToolbar() {
	const [month, setMonth] = useState("");
	const [stage, setStage] = useState("");

	return (
		<div className="flex flex-wrap items-center gap-3">
			<div className="flex items-center gap-2 text-base text-text-secondary">
				<label htmlFor="export-month">匯出月份</label>
				<Input
					id="export-month"
					value={month}
					onChange={(e) => setMonth(e.target.value)}
					placeholder="全部"
					className="w-32"
				/>
			</div>
			<div className="flex items-center gap-2 text-base text-text-secondary">
				<label htmlFor="export-stage">階段</label>
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
			</div>
			<a
				href={exportCasesUrl({ month: month.trim(), stage })}
				download="inhaler-coach-cases.xlsx"
				data-testid="export-link"
				className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-primary px-4 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary-dark"
			>
				匯出 Excel
			</a>
			<Link
				to="/admin/data"
				data-testid="import-link"
				className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-border bg-surface px-4 text-base font-semibold text-text transition-colors hover:bg-surface-muted"
			>
				匯入試算表
			</Link>
		</div>
	);
}
