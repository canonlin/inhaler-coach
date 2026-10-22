/**
 * The pharmacist's QCC sheet: what it is called and what it has to contain.
 *
 * These are the two things a file has to get right before anything can be
 * imported, and they are stated in one place because they are checked in one
 * place: the importer refuses a workbook whose headers do not match, and the
 * back office tells the pharmacist what to prepare. Two copies of this list
 * would be a file that imports cleanly and a screen that promises a format
 * the importer does not accept.
 *
 * The step and knowledge columns are not listed here one by one: they are
 * generated from the domain's step codes (步驟_<code>, 備註_<code>) and from
 * the ten knowledge questions (知識Q1…Q10), so they follow the spine rather
 * than repeating it.
 */

/** The worksheet the importer looks for. */
export const ENROLLMENT_SHEET = "藥師收案";

/**
 * The columns a row cannot be read without.
 *
 * A row without these cannot become a case at all, so the file is refused as a
 * whole rather than row by row: 987 skipped rows with 「沒有病歷號碼」 is a
 * worse message than one line saying which header is missing.
 */
export const REQUIRED_COLUMNS = [
	"病歷號碼",
	"藥師",
	"院區",
	"藥品名稱",
	"收案日期",
];

/**
 * The columns that make a row more useful, and are read when present.
 *
 * The importer does not refuse a sheet for missing any of these: a sheet with
 * only the required columns still produces cases, just less fully described
 * ones.
 */
export const OPTIONAL_COLUMNS = [
	"追蹤時間點",
	"病患類別",
	"年齡層",
	"性別",
	"診斷",
	"吸入劑型",
	"含ICS",
	"衛教時間_分鐘",
	"使用多久",
	"曾接受衛教",
];

/**
 * The step columns, named the way the sheet names them.
 *
 * @param {string[]} stepCodes the domain's step codes, e.g. 'MDI_搖'
 * @returns {{code: string, value: string, note: string}[]}
 */
export function stepColumns(stepCodes) {
	return stepCodes.map((code) => ({
		code,
		value: `步驟_${code}`,
		note: `備註_${code}`,
	}));
}

/** The knowledge columns: 知識Q1 … 知識Q10. */
export const KNOWLEDGE_COLUMN_PREFIX = "知識Q";
export const KNOWLEDGE_QUESTIONS = 10;
