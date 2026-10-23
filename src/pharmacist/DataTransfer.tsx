/**
 * 匯入試算表 — where the pharmacist's own sheet goes in.
 *
 * The endpoints existed; this page is what makes them reachable. A pharmacist
 * asking 「前測資料要在哪上傳」 was not asking for a new feature — she was
 * looking for a door that the platform did not have. The import was a
 * command-line script, which is an answer for the engineer who wrote it and
 * not for the person holding the spreadsheet.
 *
 * The page is deliberately thin: it says what the section is, and the two
 * panels below do the work. Each of them has one job, and a file that did
 * four jobs in one screen would be the thing this repository's own file-size
 * rule warns about.
 *
 * The export is not here. It is on the case list, next to the cases it
 * exports, because that is what it acts on; the button that opens this page
 * sits beside the button that downloads.
 */
import { ImportPanel } from "./components/ImportPanel";
import { SheetFormat } from "./components/SheetFormat";

export function DataTransfer() {
	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-bold tracking-tight text-text">
					匯入試算表
				</h1>
				<p className="mt-1 max-w-prose text-base leading-relaxed text-text-secondary">
					把藥師收案試算表匯入平台。匯入前一定會先試算，讓你先看到會寫入什麼；
					要匯出平台裡的紀錄，請回到「追蹤清單 → 全部個案」右上角的「匯出
					Excel」。
				</p>
			</div>

			<ImportPanel />

			<SheetFormat />
		</div>
	);
}
