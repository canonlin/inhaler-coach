/**
 * What the file has to look like.
 *
 * The importer refuses a workbook whose headers do not match, and the screen
 * says which headers it wants. Both read the same list
 * (`src/domain/enrollment-sheet.js`), because a format that is described in one
 * place and checked in another is a format that will disagree with itself the
 * first time it changes.
 */
import {
	ENROLLMENT_SHEET,
	KNOWLEDGE_QUESTIONS,
	OPTIONAL_COLUMNS,
	REQUIRED_COLUMNS,
} from "../../domain/enrollment-sheet.js";
import { Card, CardHeader } from "./ui";

export function SheetFormat() {
	return (
		<Card>
			<CardHeader
				title="檔案要長什麼樣"
				description="匯入器只認這份格式。標頭列少一欄，整份檔案會被退件並告訴你缺哪一欄。"
			/>
			<div className="space-y-4 px-5 py-4 text-base leading-relaxed text-text-secondary">
				<p>
					<span className="font-semibold text-text">工作表名稱：</span>
					{ENROLLMENT_SHEET}
				</p>
				<div>
					<p className="font-semibold text-text">必要欄位（少一欄就不匯入）</p>
					<p className="mt-1">{REQUIRED_COLUMNS.join("、")}</p>
				</div>
				<div>
					<p className="font-semibold text-text">選填欄位（有就會讀）</p>
					<p className="mt-1">{OPTIONAL_COLUMNS.join("、")}</p>
				</div>
				<div>
					<p className="font-semibold text-text">步驟與知識欄位</p>
					<p className="mt-1">
						步驟寫成「步驟_代碼」、備註寫成「備註_代碼」，代碼是
						MDI／ELP／BRZ／RSP 開頭再接步驟名（例如
						步驟_MDI_搖、備註_MDI_搖）；值填「正確」「錯誤」或「na」。
						知識題寫成「知識Q1」到「知識Q{KNOWLEDGE_QUESTIONS}
						」，值填「對」或「不對」。
					</p>
				</div>
				<p>
					<span className="font-semibold text-text">重跑會怎樣：</span>
					以病歷號碼為KEY，同一個案再匯一次是更新該筆資料，不會多一筆。
				</p>
			</div>
		</Card>
	);
}
