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

/**
 * The 基本表格: what every enrollment records about the person.
 *
 * These are the columns the pharmacist's QCC sheet has in its 「藥師收案」
 * worksheet, and they are the fields the old app's 收案表單 asked for. The
 * back office asks for exactly the same ones, the importer reads exactly the
 * same ones, and the export writes exactly the same ones — so a case recorded
 * in the platform and a row in the sheet are the same thing.
 *
 * A platform that asks for less than the sheet does is a platform the
 * pharmacist fills in twice: once on paper and once in the app, and the
 * before/after comparison ends up comparing a full row with a half row.
 *
 * The field's `column` is the sheet's column name; the field's `key` is what
 * the API and the database call it.
 *
 * @typedef {object} EnrollmentField
 * @property {string} key
 * @property {string} column
 * @property {string} label
 * @property {string[]} [options] the choices, when the field is a choice
 * @property {boolean} [multiple] when more than one choice is allowed
 * @property {"number"} [type] when the field is a number
 */

/** @type {EnrollmentField[]} */
export const ENROLLMENT_BASIC_FIELDS = [
	{
		key: "caseType",
		column: "病患類別",
		label: "病患類別",
		options: ["初診衛教", "複診回測", "家屬/看護代領"],
	},
	{
		key: "ageBand",
		column: "年齡層",
		label: "年齡層",
		options: ["未滿18歲", "18-64歲", "65歲以上"],
	},
	{
		key: "sex",
		column: "性別",
		label: "性別",
		options: ["男", "女"],
	},
	{
		key: "diagnosis",
		column: "診斷",
		label: "診斷（可複選）",
		options: ["氣喘", "COPD", "兩者皆有", "其他"],
		multiple: true,
	},
	{
		key: "usageDuration",
		column: "使用多久",
		label: "使用多久",
		options: ["初次使用", "<1個月", "1-6個月", ">6個月"],
	},
	{
		key: "priorEducation",
		column: "曾接受衛教",
		label: "曾接受衛教",
		options: ["無", "有(院內)", "有(院外)"],
	},
	{
		key: "educationMinutes",
		column: "衛教時間_分鐘",
		label: "衛教時間（分鐘）",
		type: "number",
	},
];

/**
 * The timepoints the study follows.
 *
 * The old app offered M0 through M6 and the sheet has an M6 column, so an M6
 * row that was filed as an M0 would be a silent lie about the study's
 * timeline. The platform models the same points.
 */
export const TIMEPOINTS = [
	{ value: "M0", label: "M0（初評）" },
	{ value: "M1", label: "M1（1個月）" },
	{ value: "M3", label: "M3（3個月）" },
	{ value: "M6", label: "M6（6個月）" },
];

/*
 * 前測 and 改善前 are the same measurement under two names, and so are 後測 and
 * 改善後: the pharmacist says 前測／後測, the QCC sheet and the dashboard say
 * 改善前／改善後. The platform stores one of them and shows the other beside
 * it, so the two vocabularies cannot drift apart — a screen that says
 * 「改善前（前測）」 and a database that means the same thing by it.
 */
export const STAGE_BEFORE = "改善前";
export const STAGE_AFTER = "改善後";

/** Both stages, in the order the dashboard counts them. */
export const STAGES = [STAGE_BEFORE, STAGE_AFTER];

/**
 * How each stage is written when both names are shown.
 *
 * @type {Record<string, string>}
 */
export const STAGE_LABEL = {
	[STAGE_BEFORE]: "改善前（前測）",
	[STAGE_AFTER]: "改善後（後測）",
};

/**
 * Which measurement a row at this timepoint is.
 *
 * 10/19 會議【八】，林藥師：「因為我現在是對策前，後面沒有追蹤分析，未來我是
 * 想做一個月後（M1）追蹤成效有沒有改善。」 Her words: the enrollment is the
 * before-measurement, and the M1 follow-up is where the improvement is read.
 * QCC 附件七 compares them the same way — 改善前後對比 is M0 vs M1.
 *
 * So M0 is 改善前: the patient's baseline, the thing a later M1 is compared
 * against. A case filed as 改善後 with no 改善前 to pair with is a patient who
 * does not appear in the before/after comparison at all — which is what
 * happens to every newly enrolled patient if the enrollment is filed as the
 * after-measurement.
 *
 * The sheet's own rows are the exception and are staged by hand at import
 * time (「這份資料屬於哪一階段」): the May sheet holds M1 and M3 rows too, and
 * all of them were collected while the study was still 對策前.
 */
export function stageForTimepoint(timepoint) {
	return timepoint === "M0" ? STAGE_BEFORE : STAGE_AFTER;
}
