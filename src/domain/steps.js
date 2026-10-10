/**
 * The spine: one authoritative definition of the 33 inhaler technique steps.
 *
 * Sourced from 《115年藥劑部品質改善活動 期中報告書》附件七「吸入劑操作正確性查檢表」
 * (★ 關鍵步驟 = 第三欄 1), cross-checked against the 胸腔暨重症加護醫學會
 * 《第一次使用吸入器就上手》2021 修訂版, 第 4 章.
 *
 * This file is the ONLY place a step is defined. The pharmacist app
 * dashboard and the API all read it. Do not copy a step list into a component.
 */

/** @typedef {'MDI'|'RSP'|'ELP'|'BRZ'} DeviceKind */
/** @typedef {'shake'|'ics'} StepCondition */

/**
 * @typedef {object} Step
 * @property {DeviceKind} device
 * @property {string} code   full step code, e.g. `MDI_搖`
 * @property {string} char   short display glyph, e.g. `搖`
 * @property {string} text   the check-table wording shown to the pharmacist
 * @property {boolean} critical ★ 關鍵步驟：錯了這一次藥大多到不了肺部
 * @property {StepCondition} [condition] restricts the step to a drug class
 */

/**
 * @typedef {object} Device
 * @property {DeviceKind} kind
 * @property {string} label
 * @property {string} form
 * @property {string} speed  the one-line breath instruction
 * @property {Step[]} steps
 */

/** @type {Device[]} */
const DEVICE_LIST = [
	{
		kind: "MDI",
		label: "定量噴霧 pMDI",
		form: "MDI",
		speed: "緩慢深長吸",
		steps: [
			s("MDI", "搖", "瓶底向上搖勻（≥5 秒或 4–5 次）", true, "shake"),
			s("MDI", "開", "打開吸嘴蓋，檢查無異物", false),
			s("MDI", "吐", "先吐氣至肺空", true),
			s("MDI", "含", "吸嘴含入，雙唇緊閉包住", true),
			s("MDI", "壓", "開始慢深吸同時按壓（誤差 ≤1 秒）", true),
			s("MDI", "吸", "持續慢深吸 ≥3 秒", true),
			s("MDI", "閉", "移開吸嘴閉氣 ≥3 秒，緩吐氣", true),
			s("MDI", "漱", "漱口後吐掉（含 ICS）", false, "ics"),
		],
	},
	{
		kind: "RSP",
		label: "軟霧 Respimat",
		form: "SMI",
		speed: "配合軟霧慢深吸",
		steps: [
			s("RSP", "轉", "轉動裝置 180° 聽到「卡」", true),
			s("RSP", "開", "打開防塵蓋，直立持握", false),
			s("RSP", "吐", "緩慢完全吐氣，勿對吸嘴", false),
			s("RSP", "含", "含住吸嘴，嘴唇密合", true),
			s("RSP", "壓吸", "開始吸氣後 1 秒內按下釋放鈕", true),
			s("RSP", "吸", "持續緩慢深吸 ≥3 秒", true),
			s("RSP", "閉", "移開後閉氣 ≥3 秒", true),
			s("RSP", "吐2", "緩慢吐氣", false),
		],
	},
	{
		kind: "ELP",
		label: "乾粉 Ellipta",
		form: "DPI",
		speed: "深快用力吸",
		steps: [
			s("ELP", "開", "推蓋至「喀」聲，檢查劑量窗", false),
			s("ELP", "吐", "先吐氣至肺空，勿對裝置", true),
			s("ELP", "含", "吸嘴含入，雙唇緊閉", true),
			s("ELP", "吸", "快速深吸（1–2 秒肺滿），不分段", true),
			s("ELP", "閉", "閉氣 ≥3 秒，緩吐氣", true),
			s("ELP", "關", "關蓋重置（勿重吸）", false),
			s("ELP", "漱", "漱口後吐掉（含 ICS）", false, "ics"),
		],
	},
	{
		kind: "BRZ",
		label: "乾粉 Breezhaler",
		form: "DPI",
		speed: "深快用力吸",
		steps: [
			s("BRZ", "開", "拔帽並打開口含器", false),
			s("BRZ", "置", "乾燥手取出膠囊置入槽內（勿吞服）", true),
			s("BRZ", "蓋", "蓋上聽到「喀」聲", false),
			s("BRZ", "刺", "直立持握，按兩側按鈕一次刺破", true),
			s("BRZ", "吐", "先吐氣至肺空，勿對吸嘴", true),
			s("BRZ", "含", "吸嘴含入，雙唇緊閉", true),
			s("BRZ", "吸", "快速深吸一次，聽見膠囊震動聲", true),
			s("BRZ", "閉", "閉氣 ≥3 秒，緩吐氣", true),
			s("BRZ", "查", "檢查膠囊殘粉，有粉再吸一次", true),
			s("BRZ", "收", "倒空膠囊殼並關閉裝置", false),
		],
	},
];

/**
 * @param {DeviceKind} device
 * @param {string} char
 * @param {string} text
 * @param {boolean} critical
 * @param {StepCondition} [condition]
 * @returns {Step}
 */
function s(device, char, text, critical, condition) {
	return {
		device,
		code: `${device}_${char}`,
		char,
		text,
		critical,
		...(condition ? { condition } : {}),
	};
}

/** @type {Record<DeviceKind, Device>} */
export const DEVICES = Object.fromEntries(DEVICE_LIST.map((d) => [d.kind, d]));

/** @type {DeviceKind[]} */
export const DEVICE_KINDS = DEVICE_LIST.map((d) => d.kind);

/** @type {Record<DeviceKind, Step[]>} */
export const STEPS_BY_DEVICE = Object.fromEntries(
	DEVICE_LIST.map((d) => [d.kind, d.steps]),
);

/** @type {string[]} */
export const ALL_STEP_CODES = DEVICE_LIST.flatMap((d) =>
	d.steps.map((st) => st.code),
);

/** @type {string[]} */
export const CRITICAL_STEP_CODES = DEVICE_LIST.flatMap((d) =>
	d.steps.filter((st) => st.critical).map((st) => st.code),
);

/** @type {Record<string, Step>} */
export const STEP_BY_CODE = Object.fromEntries(
	DEVICE_LIST.flatMap((d) => d.steps.map((st) => [st.code, st])),
);

/**
 * The steps that apply to a specific drug. `shake` steps drop out for
 * solution-type inhalers that must not be shaken; `ics` steps drop out for
 * non-steroid drugs.
 *
 * @param {DeviceKind} kind
 * @param {{hasIcs: boolean, needsShake: boolean}} drug
 * @returns {Step[]}
 */
export function applicableSteps(kind, drug) {
	return STEPS_BY_DEVICE[kind].filter((step) => {
		if (step.condition === "ics") return drug.hasIcs;
		if (step.condition === "shake") return drug.needsShake;
		return true;
	});
}

/**
 * @param {string} code
 * @returns {boolean}
 */
export function isCritical(code) {
	return STEP_BY_CODE[code]?.critical ?? false;
}
/**
 * Which steps the camera can judge on its own.
 *
 * The AI coaching flow (src/config/stages.js) has four scored stages:
 *   振搖 → MDI_搖
 *   吐氣 → MDI_吐
 *   壓吸＋憋氣 → MDI_壓, MDI_吸, MDI_閉
 *   漱口 → MDI_漱
 *
 * Opening the mouthpiece cap and sealing the lips are not judged by anything
 * today, so they stay with the pharmacist. This mapping is why the pharmacist
 * only assesses two of the eight pMDI steps rather than eight.
 *
 * Only pMDI has AI coverage. DPI and SMI have no coaching flow yet, so their
 * steps are pharmacist-judged in full.
 *
 * @type {Record<DeviceKind, string[]>}
 */
export const AI_JUDGED_STEPS = {
	MDI: ["MDI_搖", "MDI_吐", "MDI_壓", "MDI_吸", "MDI_閉", "MDI_漱"],
	RSP: [],
	ELP: [],
	BRZ: [],
};

/**
 * Who has to look at this step: the camera or the pharmacist.
 * @param {string} code
 * @returns {'ai' | 'pharmacist'}
 */
export function stepReviewSource(code) {
	return Object.values(AI_JUDGED_STEPS).some((list) => list.includes(code))
		? "ai"
		: "pharmacist";
}

/**
 * The steps a pharmacist must judge by hand for this drug.
 * @param {DeviceKind} kind
 * @param {{hasIcs: boolean, needsShake: boolean}} drug
 * @returns {Step[]}
 */
export function pharmacistSteps(kind, drug) {
	return applicableSteps(kind, drug).filter(
		(s) => stepReviewSource(s.code) === "pharmacist",
	);
}
