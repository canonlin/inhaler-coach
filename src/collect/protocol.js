/**
 * The recording protocol.
 *
 * Every task is labelled, so each frame of signal and every second of video
 * carries a ground-truth tag. This is the thing we have been missing all along:
 * thresholds were being tuned against a single person's single recording, and
 * they did not survive a change of lighting, distance, or how hard that person
 * happened to shake. Negatives matter as much as positives — a detector that
 * only ever sees shaking will happily call everything a shake.
 */

export const TASKS = [
	{
		id: "still",
		title: "拿著，完全不要動",
		detail: "拿好吸入器，手抬到鏡頭前，靜止不動",
		seconds: 8,
		kind: "negative",
	},
	{
		id: "move",
		title: "移動，但不要搖",
		detail: "慢慢移動手、轉動吸入器，就是不要上下搖",
		seconds: 8,
		kind: "negative",
	},
	{
		id: "shake_normal",
		title: "照你平常的方式搖",
		detail: "就像你平常教病人那樣搖",
		seconds: 8,
		kind: "positive",
	},
	{
		id: "shake_hard",
		title: "用力快搖",
		detail: "幅度大、速度快",
		seconds: 8,
		kind: "positive",
	},
	{
		id: "shake_gentle",
		title: "輕輕慢搖",
		detail: "幅度小、速度慢",
		seconds: 8,
		kind: "positive",
	},
	{
		id: "shake_wrist",
		title: "只動手腕，小幅度搖",
		detail: "手臂不動，只用手腕",
		seconds: 8,
		kind: "positive",
	},
	{
		id: "spray_x2",
		title: "對空噴 2 下",
		detail: "每次噴之前先搖 5 秒（priming 的標準做法）",
		seconds: 20,
		kind: "positive",
	},
	{
		id: "handle",
		title: "放下、再拿起吸入器",
		detail: "重複幾次。這是為了確認系統不會把「放下吸入器」誤判成噴藥",
		seconds: 10,
		kind: "negative",
	},
	{
		id: "exhale",
		title: "深深吐一口氣",
		detail: "不要對著吸入器吐，重複 2-3 次",
		seconds: 12,
		kind: "positive",
	},
	{
		id: "speak",
		title: "隨便講幾句話",
		detail: "確認說話不會被誤判成噴藥或吐氣",
		seconds: 10,
		kind: "negative",
	},
];

export const REST_SECONDS = 3;
