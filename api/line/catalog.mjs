/**
 * The pharmacist's drug catalog, read from the same JSON the LIFF pages use.
 *
 * src/line/data/drugs.json is the single copy. This loader is the backend's
 * way in (Node has no business importing the frontend's TS), and the wording
 * of every refusal below is transcribed from app.py → start_journey so the
 * API and the LIFF form refuse for the same reasons, in the same words.
 */

import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const drugs = JSON.parse(
	readFileSync(
		resolve(
			dirname(fileURLToPath(import.meta.url)),
			"../../src/line/data/drugs.json",
		),
		"utf8",
	),
);

export const RESCUE_ONLY_ID = "Ventolin_Evohaler";

export function findDrug(id) {
	return drugs.find((d) => d.id === id);
}

/**
 * The first problem with a registration, in the order app.py checks.
 * Returns the refusal text, or null when valid.
 */
export function validateRegistration({ name, identifier, medications }) {
	if (!String(name ?? "").trim()) return "請填寫病人姓名。";
	if (!String(identifier ?? "").trim()) return "請填寫病人識別 ID。";
	if (!Array.isArray(medications) || medications.length === 0)
		return "請先選擇保養用吸入劑。";
	if (medications.length > 2) return "目前最多只能選擇兩種吸入劑。";

	const roles = new Set();
	const ids = new Set();
	for (const [i, m] of medications.entries()) {
		const problem = checkMedication(m, i, roles, ids);
		if (problem) return problem;
	}
	if (!roles.has("maintenance")) return "必須選擇保養用吸入劑。";
	return null;
}

function checkMedication(m, i, roles, ids) {
	if (m?.role !== "maintenance" && m?.role !== "rescue")
		return `第 ${i + 1} 種藥物的用途必須是 maintenance 或 rescue。`;
	if (roles.has(m.role)) return "同一用途不可重複選擇藥品。";
	if (ids.has(m.drugId)) return "不可重複選擇相同藥品。";
	roles.add(m.role);
	ids.add(m.drugId);

	const drug = findDrug(m.drugId);
	if (!drug) return `找不到藥品：${m.drugId}`;
	if (m.role === "rescue" && m.drugId !== RESCUE_ONLY_ID)
		return "目前緊急用吸入劑只允許 Ventolin Evohaler。";
	if (!drug.roles.includes(m.role))
		return `藥品 ${drug.displayName} 不允許設定為 ${m.role}。`;
	return null;
}

const DEVICE_LABELS = {
	MDI: "定量吸入劑（MDI）",
	DPI: "乾粉吸入劑（DPI）",
	SMI: "軟霧吸入劑（SMI）",
};
const ROLE_LABELS = { maintenance: "保養用藥", rescue: "緊急用藥" };

/** app.js resultPanel lines: tag1 (device) + tag2 (role). */
export function buildDualTags(medications) {
	const label = (m) => {
		const drug = findDrug(m.drugId);
		const device = drug ? DEVICE_LABELS[drug.type] : m.drugId;
		return `${ROLE_LABELS[m.role]}：${device}`;
	};
	return {
		tag1: `裝置分類：${medications.map(label).join("｜")}`,
		tag2: `用途分類：${medications.map((m) => ROLE_LABELS[m.role]).join("｜")}`,
	};
}
