/**
 * What the importer read, and what it disagreed with.
 *
 * The skipped rows are listed with their sheet line numbers, because 「有一列
 * 被跳過」 is not actionable and 「第 44 列沒有病歷號碼」 is. The list is
 * capped: a sheet where every row fails is a format problem, and printing 900
 * lines of it helps nobody — the first twenty say it.
 */
import type { ImportReport } from "../../api-client";
import { Badge } from "./ui";

const SHOWN = 20;

export function ImportReportPanel({ report }: { report: ImportReport }) {
	const shown = report.skipped.slice(0, SHOWN);
	const rest = report.skipped.length - shown.length;

	return (
		<div
			data-testid="import-report"
			className="rounded-lg border border-border-subtle bg-surface-muted px-5 py-4"
		>
			<p className="text-lg font-bold text-text">
				{report.dryRun ? "試算結果（尚未寫入）" : "匯入完成"}
			</p>
			<ul className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-base text-text-secondary">
				<li>讀到 {report.rowsRead} 列</li>
				<li>
					{report.dryRun
						? `可匯入 ${report.imported} 筆`
						: `匯入 ${report.imported} 筆、更新 ${report.updated} 筆`}
				</li>
				<li>略過 {report.skipped.length} 筆</li>
				<li>警告 {report.warnings.length} 則</li>
			</ul>

			{report.skipped.length > 0 && (
				<div className="mt-3">
					<p className="text-base font-semibold text-text">略過的資料</p>
					<ul className="mt-1 space-y-1 text-base text-text-secondary">
						{shown.map((s) => (
							<li key={`${s.line}-${s.reason}`}>
								<span className="font-mono tabular-nums">第 {s.line} 列</span>：
								{s.reason}
							</li>
						))}
						{rest > 0 && <li>…另有 {rest} 筆</li>}
					</ul>
				</div>
			)}

			{report.warnings.length > 0 && (
				<div className="mt-3">
					<p className="font-semibold text-text">和試算表不一致的地方</p>
					<ul className="mt-1 space-y-1 text-base text-text-secondary">
						{report.warnings.slice(0, SHOWN).map((w) => (
							<li key={`${w.line}-${w.message}`}>
								<span className="font-mono tabular-nums">第 {w.line} 列</span>：
								{w.message}
							</li>
						))}
						{report.warnings.length > SHOWN && (
							<li>…另有 {report.warnings.length - SHOWN} 則</li>
						)}
					</ul>
				</div>
			)}

			{report.skipped.length === 0 && report.warnings.length === 0 && (
				<p className="mt-3">
					<Badge tone="success">沒有略過的資料，也沒有不一致</Badge>
				</p>
			)}
		</div>
	);
}
