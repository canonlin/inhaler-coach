/**
 * 資料匯入／匯出 — where the pharmacist's own sheet goes in, and comes back out.
 *
 * The endpoints existed; this page is what makes them reachable. A pharmacist
 * asking 「前測資料要在哪上傳」 was not asking for a new feature — she was
 * looking for a door that the platform did not have. The import was a
 * command-line script, which is an answer for the engineer who wrote it and
 * not for the person holding the spreadsheet.
 *
 * The page is deliberately thin: it says what the section is, and the three
 * panels below do the work. Each of them has one job, and a file that did
 * four jobs in one screen would be the thing this repository's own file-size
 * rule warns about.
 */
import { ExportPanel } from "./components/ExportPanel";
import { ImportPanel } from "./components/ImportPanel";
import { SheetFormat } from "./components/SheetFormat";

export function DataTransfer() {
	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-bold tracking-tight text-text">
					資料匯入／匯出
				</h1>
				<p className="mt-1 max-w-prose text-base leading-relaxed text-text-secondary">
					把藥師收案試算表匯入平台，或把平台裡的收案紀錄匯出成 Excel。
					匯入前一定會先試算，讓你先看到會寫入什麼。
				</p>
			</div>

			<ImportPanel />

			<ExportPanel />

			<SheetFormat />
		</div>
	);
}
