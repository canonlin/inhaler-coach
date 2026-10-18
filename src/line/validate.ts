/**
 * Registration rules, owned once and used twice.
 *
 * The browser runs these for instant feedback; the API reruns them
 * authoritatively (api/line/service.mjs → register). Validation wording is
 * transcribed from the pharmacist's backend (app.py → start_journey) so both
 * ends refuse for the same reasons, in the same words.
 */

import { findDrug, RESCUE_ONLY_ID } from "./catalog";
import { LINE_DEVICE_LABELS, LINE_ROLE_LABELS } from "./devices";

export interface RegistrationMed {
	role: "maintenance" | "rescue";
	drugId: string;
}

export interface RegistrationInput {
	name: string;
	identifier: string;
	medications: RegistrationMed[];
}

export interface ValidRegistration {
	name: string;
	identifier: string;
	medications: { role: "maintenance" | "rescue"; drugId: string }[];
}

/** The first problem found, in the order app.py checks. Null means valid. */
export function validateRegistration(input: RegistrationInput): string | null {
	if (!input.name.trim()) return "請填寫病人姓名。";
	if (!input.identifier.trim()) return "請填寫病人識別 ID。";
	if (input.medications.length === 0) return "請先選擇保養用吸入劑。";
	if (input.medications.length > 2) return "目前最多只能選擇兩種吸入劑。";

	const roles = new Set<string>();
	const ids = new Set<string>();
	for (const [i, m] of input.medications.entries()) {
		const problem = checkMedication(m, i, roles, ids);
		if (problem) return problem;
	}
	if (!roles.has("maintenance")) return "必須選擇保養用吸入劑。";
	return null;
}

function checkMedication(
	m: RegistrationMed,
	i: number,
	roles: Set<string>,
	ids: Set<string>,
): string | null {
	if (m.role !== "maintenance" && m.role !== "rescue")
		return `第 ${i + 1} 種藥物的用途必須是 maintenance 或 rescue。`;
	if (roles.has(m.role)) return "同一用途不可重複選擇藥品。";
	if (ids.has(m.drugId)) return "不可重複選擇相同藥品。";
	roles.add(m.role);
	ids.add(m.drugId);

	const drug = findDrug(m.drugId);
	if (!drug) return `找不到藥品：${m.drugId}`;
	if (!drug.roles.includes(m.role))
		return `藥品 ${drug.displayName} 不允許設定為 ${m.role}。`;
	if (m.role === "rescue" && m.drugId !== RESCUE_ONLY_ID)
		return "目前緊急用吸入劑只允許 Ventolin Evohaler。";
	return null;
}

/** app.js resultPanel lines: tag1 (device) + tag2 (role). */
export function buildDualTags(meds: ValidRegistration["medications"]): {
	tag1: string;
	tag2: string;
} {
	const label = (m: (typeof meds)[number]) => {
		const drug = findDrug(m.drugId);
		const device = drug ? LINE_DEVICE_LABELS[drug.type] : m.drugId;
		return `${LINE_ROLE_LABELS[m.role]}：${device}`;
	};
	return {
		tag1: `裝置分類：${meds.map(label).join("｜")}`,
		tag2: `用途分類：${meds.map((m) => LINE_ROLE_LABELS[m.role]).join("｜")}`,
	};
}
