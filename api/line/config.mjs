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
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

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
		drugs: drugs ?? loadDefaultJson("../src/line/data/drugs.json") ?? [],
		videos: videos ?? loadDefaultJson("../src/line/data/videos.json") ?? [],
		quizzes: quizzes ?? loadDefaultJson("../src/line/data/quizzes.json") ?? {},
	};
}

/** Read a JSON file next to the api/ directory, or null when it is absent. */
export function loadDefaultJson(relPath) {
	try {
		return JSON.parse(readFileSync(resolve(__dirname, relPath), "utf8"));
	} catch {
		return null;
	}
}

/**
 * The video for a device, falling back to any enabled video.
 *
 * @param {object[]|null} videos
 * @param {string} deviceType MDI | DPI | SMI
 */
export function findActiveVideo(videos, deviceType) {
	if (!videos) return null;
	const activeVideos = Array.isArray(videos)
		? videos.filter((v) => v.enabled !== false && v.status !== "inactive")
		: [];
	return (
		activeVideos.find(
			(v) =>
				v.type === deviceType ||
				v.device === deviceType ||
				v.deviceType === deviceType,
		) || activeVideos[0]
	);
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
