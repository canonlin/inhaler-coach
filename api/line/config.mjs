/**
 * Dynamic content, read once and shared.
 *
 * The pharmacist publishes videos, drug photos and quiz items through the
 * admin console; they land in admin_config. Both the bot (answering a tap)
 * and the dispatcher (sending a scheduled touch) need that same content, and
 * two readers would be two definitions of "the current video" — the one that
 * answers a patient and the one the scheduler thinks it sent would drift.
 *
 * So the reading lives here and both callers use it.
 */

import { readFileSync } from "node:fs";

/**
 * The seed content, read with a literal path.
 *
 * Vercel traces a literal read and bundles the file into the serverless
 * function. A path computed from a variable is not traceable, so the file
 * does not ship and the bot silently serves nothing — which is how the
 * production deployment ended up with no films at all while the repository
 * held nineteen. The URL is written out in full, on purpose.
 */
const DEFAULT_DRUGS = (() => {
	try {
		return JSON.parse(
			readFileSync(
				new URL("../../src/line/data/drugs.json", import.meta.url),
				"utf8",
			),
		);
	} catch {
		return null;
	}
})();

const DEFAULT_VIDEOS = (() => {
	try {
		return JSON.parse(
			readFileSync(
				new URL("../../src/line/data/videos.json", import.meta.url),
				"utf8",
			),
		);
	} catch {
		return null;
	}
})();

const DEFAULT_QUIZZES = (() => {
	try {
		return JSON.parse(
			readFileSync(
				new URL("../../src/line/data/quizzes.json", import.meta.url),
				"utf8",
			),
		);
	} catch {
		return null;
	}
})();

export { DEFAULT_DRUGS, DEFAULT_QUIZZES, DEFAULT_VIDEOS };

/**
 * Read one key from admin_config, falling back when it is absent or broken.
 *
 * The fallback is not a crash: a bot that cannot read its content should
 * still answer the patient with what it has, and say what it cannot do.
 *
 * @param {Function} query
 * @param {string} key
 * @param {*} fallback
 */
export async function getDynamicConfig(query, key, fallback) {
	if (!query) return fallback;
	try {
		const { rows } = await query(
			`SELECT config_value FROM admin_config WHERE config_key = $1`,
			[key],
		);
		if (rows.length && rows[0].config_value) {
			const val = rows[0].config_value;
			return typeof val === "string" ? JSON.parse(val) : val;
		}
	} catch {
		// fallback gracefully
	}
	return fallback;
}

/**
 * The videos, quiz items and drug list in one read.
 *
 * The seed files are the starting state; the admin console overwrites them.
 *
 * @param {Function} query
 */
export async function loadLineContent(query) {
	const [drugs, videos, quizzes] = await Promise.all([
		getDynamicConfig(query, "drugs", null),
		getDynamicConfig(query, "videos", null),
		getDynamicConfig(query, "quizzes", null),
	]);
	return {
		drugs: drugs ?? DEFAULT_DRUGS ?? [],
		videos: videos ?? DEFAULT_VIDEOS ?? [],
		quizzes: quizzes ?? DEFAULT_QUIZZES ?? {},
	};
}

/** The languages the society publishes its instruction films in. */
const LANG_DEFAULT = "zh-TW";
const LANG_ALT = "nan-TW";

/** A video entry that may be shown to a patient. */
function usableVideos(videos) {
	if (!Array.isArray(videos)) return [];
	return videos.filter(
		(v) =>
			v &&
			v.enabled !== false &&
			v.status !== "inactive" &&
			v.status !== "preparing",
	);
}

/** The device family an entry belongs to, tolerating older field names. */
function entryType(v) {
	return v.type || v.device || v.deviceType || null;
}

/** The language an entry is spoken in; entries without one are 國語. */
function entryLang(v) {
	return v.lang || LANG_DEFAULT;
}

/**
 * The video for a patient: their own medicine first, then the device family.
 *
 * A drug-specific film beats the generic one because "吸必擴 Rapihaler" and
 * "Trimbow" are both pMDIs and still need different instructions — the
 * priming rule and the shaking rule are not the same. When no drug film
 * exists, the device family film is still correct advice, just less specific.
 *
 * @param {object[]|null} videos
 * @param {string} deviceType MDI | DPI | SMI
 * @param {string|null} drugId
 */
export function findActiveVideo(videos, deviceType, drugId = null) {
	const active = usableVideos(videos);
	if (!active.length) return null;

	const byDrug = drugId ? active.filter((v) => v.drugId === drugId) : [];
	const byDevice = active.filter((v) => !v.drugId);

	const pick = (pool) =>
		pool.find(
			(v) => entryType(v) === deviceType && entryLang(v) === LANG_DEFAULT,
		) ||
		pool.find(
			(v) => entryType(v) === deviceType && entryLang(v) === LANG_ALT,
		) ||
		pool.find((v) => entryType(v) === deviceType);

	return (
		pick(byDrug) ||
		pick(byDevice) ||
		active.find((v) => entryType(v) === deviceType) ||
		active[0]
	);
}

/**
 * The same film's other language, or null when there is none.
 *
 * The society publishes 台語 versions for several devices, and a patient who
 * cannot follow 國語 will not follow the film either. The language is never
 * guessed: the button appears only when a real 台語 version exists.
 *
 * @param {object[]|null} videos
 * @param {string} deviceType MDI | DPI | SMI
 * @param {string|null} drugId
 */
export function findAlternateVideo(videos, deviceType, drugId = null) {
	const primary = findActiveVideo(videos, deviceType, drugId);
	if (!primary) return null;
	const wantLang = entryLang(primary) === LANG_ALT ? LANG_DEFAULT : LANG_ALT;

	const active = usableVideos(videos);
	const byDrug = drugId ? active.filter((v) => v.drugId === drugId) : [];
	const byDevice = active.filter((v) => !v.drugId);

	const find = (pool) =>
		pool.find(
			(v) =>
				entryType(v) === deviceType &&
				entryLang(v) === wantLang &&
				v.id !== primary.id,
		);

	// The drug's own 台語 film first; then the device family's 台語 film,
	// which is still correct advice for a patient who cannot follow 國語.
	return find(byDrug) || find(byDevice) || null;
}

/**
 * The quiz for a device, or null when the pharmacist has not prepared one.
 *
 * @param {object|null} quizData keyed by device type
 * @param {string} deviceType
 */
export function findActiveQuiz(quizData, deviceType) {
	if (!quizData) return null;
	const list = quizData[deviceType];
	if (Array.isArray(list)) {
		return list.find((q) => q.enabled !== false && q.status !== "inactive");
	}
	if (list && list.enabled !== false && list.status !== "inactive") {
		return list;
	}
	return null;
}
