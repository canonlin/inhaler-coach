/**
 * The recording protocol.
 *
 * Every task is labelled, so each frame of signal and every second of video
 * carries a ground truth tag. Negatives matter as much as positives — a detector
 * that only ever sees shaking will happily call everything a shake, which is
 * exactly what happened.
 *
 * The wording is deliberately clinical, not technical. An earlier draft asked
 * for "手腕小幅度搖", which is an engineer's category: no pharmacist describes a
 * movement that way, and nobody could tell how small counts as small. Each task
 * is now something they have actually seen a patient do, and each one animates a
 * demonstration rather than relying on the description alone.
 *
 * `demo` drives that animation (see demo.js):
 *   translate — vertical travel, as a fraction of the inhaler's height
 *   rotate    — degrees of wrist rotation
 *   periodMs  — one full back-and-forth
 *
 * `expect` is the ground truth for the SILENT background judge (silent-judge.js):
 * what the live detector should conclude for this task. The pharmacist never sees
 * it; it turns every recording into a labelled confusion matrix for the detector,
 * in the collector's own domain — the in-domain data the 0519 seed set lacks.
 * A metric left out of `expect` (e.g. audio-only spray counting) isn't judged.
 */

export const TASKS = [
	{
		id: "still",
		title: "拿著，完全不要動",
		detail: "像等著病人開口那樣，握著吸入器不動就好。",
		why: "讓系統學會「沒有在搖」長什麼樣子",
		seconds: 8,
		demo: { translate: 0, rotate: 0, periodMs: 0 },
	},
	{
		id: "move",
		title: "移動，但不要上下搖",
		detail: "慢慢把手移來移去、把吸入器轉一轉、翻過來看看，就是不要上下搖晃。",
		why: "手在動不代表在搖藥。系統必須分得出這兩件事",
		seconds: 8,
		demo: { translate: 0, rotate: 30, periodMs: 2600, drift: true },
	},
	{
		id: "shake_normal",
		title: "照你平常的方式搖",
		detail: "就像你平常示範給病人看的那樣搖，不用刻意改變。",
		why: "這是最重要的一項：正確操作的標準樣本",
		seconds: 8,
		demo: { translate: 0.55, rotate: 0, periodMs: 350 },
	},
	{
		id: "shake_hard",
		title: "用力地、大幅度地搖",
		detail: "比平常更用力、幅度更大、更快。",
		why: "有些病人會這樣搖，系統不能因為太用力就判定錯誤",
		seconds: 8,
		demo: { translate: 0.9, rotate: 0, periodMs: 220 },
	},
	{
		id: "shake_gentle",
		title: "很輕、很慢地搖",
		detail: "像怕把藥搖壞了那樣，輕輕地、慢慢地搖。幅度很小沒關係。",
		why: "怕弄壞藥的病人常常這樣搖。目前系統幾乎抓不到這種，這一項最關鍵",
		seconds: 8,
		demo: { translate: 0.22, rotate: 0, periodMs: 900 },
	},
	{
		id: "shake_limited",
		title: "像手不方便的長輩那樣搖",
		detail: "手臂盡量不要動，只用手腕小小地晃。想像一位關節不好的長輩。",
		why: "行動受限的病人搖不出大動作，系統一樣要認得",
		seconds: 8,
		demo: { translate: 0.12, rotate: 22, periodMs: 500 },
	},
	{
		id: "spray_x2",
		title: "對空噴 2 下",
		detail:
			"照 priming 的標準做法：搖 5 秒 → 對著空氣噴一下 → 再搖 5 秒 → 再噴一下。不要對著臉。",
		why: "系統要能聽出噴藥的聲音，而且要數對幾下",
		seconds: 22,
		demo: { translate: 0.45, rotate: 0, periodMs: 350, press: true },
	},
	{
		id: "press_air_steady",
		title: "拿穩不動，對空慢慢按 5 下",
		detail:
			"把吸入器拿在胸前、罐口朝上、離開臉，握穩「完全不要晃」。每隔約 2 秒，用力把紅色罐頂按下去一次，總共 5 下。關鍵：手要穩、按要確實，不要對鏡頭揮動。",
		why: "上一批大家對鏡頭揮吸入器，按壓的訊號被大動作蓋掉了。拿穩、按確實，系統才學得到「按壓」本身長什麼樣",
		seconds: 15,
		demo: {
			translate: 0,
			rotate: 0,
			periodMs: 0,
			steadyPress: true,
			presses: 5,
		},
	},
	{
		id: "press_mouth_steady",
		title: "含住吸嘴、拿穩，慢慢按 5 下",
		detail:
			"把吸嘴含到嘴邊（或輕靠嘴唇）、罐口朝上，握穩不要晃。每隔約 2 秒用力按一下紅色罐頂，總共 5 下。這是真正吸藥時的姿勢。",
		why: "真實吸藥是把裝置拿到嘴邊按。這一項讓系統學會「嘴邊按壓」的樣子，並和對空按壓區分不同情境",
		seconds: 15,
		demo: {
			translate: 0,
			rotate: 0,
			periodMs: 0,
			steadyPress: true,
			atMouth: true,
			presses: 5,
		},
	},
	{
		id: "handle",
		title: "放下吸入器，再拿起來（重複幾次）",
		detail: "放到桌上，發出「叩」的聲音也沒關係，然後再拿起來。重複三、四次。",
		why: "放下時的碰撞聲很像噴藥聲。系統絕對不能把它算成一次劑量",
		seconds: 12,
		demo: { translate: 0.7, rotate: 0, periodMs: 2000, putDown: true },
	},
	{
		id: "exhale",
		title: "深深吐一口氣（重複 2-3 次）",
		detail: "像病人吸藥前那樣，把氣慢慢吐乾淨。不要對著吸入器吐。",
		why: "吐氣的聲音是偵測「有沒有先吐氣」的依據",
		seconds: 12,
		demo: { translate: 0, rotate: 0, periodMs: 0, breathe: true },
	},
	{
		id: "speak",
		title: "隨便講幾句話",
		detail: "念個藥名、講一下今天天氣，什麼都好。",
		why: "診間本來就有人在講話。系統不能把說話誤判成噴藥或吐氣",
		seconds: 10,
		demo: { translate: 0, rotate: 0, periodMs: 0, speak: true },
	},
];

/** Counted down after the pharmacist says they're ready, so the recording never
 * starts while they're still reading. */
export const LEAD_IN_SECONDS = 3;
