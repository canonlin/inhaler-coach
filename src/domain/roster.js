/**
 * Who collects the cases, and what the pharmacist asks the patient.
 */

/** Pharmacists who record cases at NTUH Yunlin. Display name only, no staff id. */
export const PHARMACISTS = ["黃永成", "林家薐", "黃詩婷", "林亭君", "曾彥哲", "劉士宏"];

/** Campuses the QCC covers. */
export const CAMPUSES = ["虎尾", "斗六"];

/**
 * Patient factors that change the intervention. The `code` is what the
 * database stores; `label` is what the pharmacist picks. Order is the
 * display order.
 */
export const FACTORS = [
	{ code: "hand", label: "手部無力／關節問題" },
	{ code: "cog", label: "記憶或認知退化" },
	{ code: "vis", label: "視力不佳" },
	{ code: "care", label: "由照顧者協助用藥" },
	{ code: "breath", label: "吸氣力量不足" },
];

export const FACTOR_CODES = FACTORS.map((f) => f.code);

/**
 * The ten knowledge questions. `reversed` marks a trap question: the
 * statement is phrased to sound right and the correct answer is 不對.
 *
 * @typedef {object} KnowledgeQuestion
 * @property {number} index 1–10, matching the 知識Q1..Q10 spreadsheet columns
 * @property {string} text
 * @property {'對'|'不對'} answer
 * @property {boolean} reversed
 */

/** @type {KnowledgeQuestion[]} */
export const KNOWLEDGE = [
	{
		index: 1,
		text: "使用吸入劑（不論噴霧式或乾粉式）之前，都要先把氣「慢慢吐乾淨」。",
		answer: "對",
		reversed: false,
	},
	{
		index: 2,
		text: "使用噴霧式吸入劑（MDI）時，要一邊「慢慢深吸氣」一邊按壓藥罐。",
		answer: "對",
		reversed: false,
	},
	{
		index: 3,
		text: "使用乾粉式吸入劑（DPI）時，吸氣方式和噴霧式一樣「慢慢吸」就好。",
		answer: "不對",
		reversed: true,
	},
	{
		index: 4,
		text: "吸完藥之後，需要閉氣大約數到5（約5–10秒），再慢慢吐氣。",
		answer: "對",
		reversed: false,
	},
	{
		index: 5,
		text: "使用含有「類固醇」成分的吸入劑之後，要記得漱口並將水吐掉。",
		answer: "對",
		reversed: false,
	},
	{
		index: 6,
		text: "如果醫師交代要連續吸兩口藥，可以連續按兩下後再一口氣吸進去。",
		answer: "不對",
		reversed: true,
	},
	{
		index: 7,
		text: "看不到「白煙」或聽不到「噴的聲音」，就一定代表沒有吸到藥。",
		answer: "不對",
		reversed: true,
	},
	{
		index: 8,
		text: "當吸入劑的劑量計數器顯示為0或出現紅色標示時，表示藥物已經用完。",
		answer: "對",
		reversed: false,
	},
	{
		index: 9,
		text: "「急救用的吸入劑」和「每天固定使用的控制型吸入劑」功能不同，不能互相替代。",
		answer: "對",
		reversed: false,
	},
	{
		index: 10,
		text: "如果最近幾天都不會喘，就可以自己先把每天固定用的吸入劑停掉。",
		answer: "不對",
		reversed: true,
	},
];

/**
 * Languages the education task card offers. 繁體中文 and 台語 have written
 * guidance; the other three point at the society's video library.
 */
export const LANGUAGES = [
	{ code: "zh", label: "國語" },
	{ code: "tw", label: "台語" },
	{ code: "id", label: "Bahasa Indonesia" },
	{ code: "vi", label: "Tiếng Việt" },
	{ code: "en", label: "English" },
];

/** A patient aged 65 or over is defaulted to 台語 unless told otherwise. */
export const ELDERLY_AGE_BAND = "65歲以上";