/**
 * The spine must stay the only definition. These tests fail when a step drifts
 * from the QCC 附件七 check table, when a count changes, or when the database
 * CHECK constraints stop agreeing with the code.
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
	ALL_DRUGS,
	DRUG_BY_NAME,
	drugDoses,
	drugOf,
} from "../src/domain/drugs.js";
import {
	STAGE_AFTER,
	STAGE_BEFORE,
	STAGE_LABEL,
	stageForTimepoint,
} from "../src/domain/enrollment-sheet.js";
import { KNOWLEDGE, PHARMACISTS } from "../src/domain/roster.js";
import {
	ALL_STEP_CODES,
	applicableSteps,
	CRITICAL_STEP_CODES,
	DEVICE_KINDS,
	DEVICES,
	isCritical,
	STEP_BY_CODE,
} from "../src/domain/steps.js";

describe("spine: step definitions", () => {
	it("defines exactly 33 steps across 4 devices", () => {
		assert.equal(DEVICE_KINDS.length, 4);
		assert.equal(ALL_STEP_CODES.length, 33);
		assert.equal(new Set(ALL_STEP_CODES).size, 33, "step codes must be unique");
	});

	it("uses the per-device step counts from the check table", () => {
		// MDI 8, Respimat 8, Ellipta 7, Breezhaler 10
		assert.equal(DEVICES.MDI.steps.length, 8);
		assert.equal(DEVICES.RSP.steps.length, 8);
		assert.equal(DEVICES.ELP.steps.length, 7);
		assert.equal(DEVICES.BRZ.steps.length, 10);
	});

	it("marks the check-table critical steps", () => {
		// MDI: 搖 吐 含 壓 吸 閉 = 6.  Respimat: 轉 含 壓吸 吸 閉 = 5.
		// Ellipta: 吐 含 吸 閉 = 4.  Breezhaler: 置 刺 吐 含 吸 閉 查 = 7.
		assert.equal(CRITICAL_STEP_CODES.length, 22);
		assert.deepEqual(
			DEVICES.MDI.steps.filter((st) => st.critical).map((st) => st.char),
			["搖", "吐", "含", "壓", "吸", "閉"],
		);
		assert.deepEqual(
			DEVICES.BRZ.steps.filter((st) => st.critical).map((st) => st.char),
			["置", "刺", "吐", "含", "吸", "閉", "查"],
		);
	});

	it("prefixes every code with its device", () => {
		for (const code of ALL_STEP_CODES) {
			const [kind] = code.split("_");
			assert.ok(DEVICE_KINDS.includes(kind), `${code} has no device`);
			assert.equal(STEP_BY_CODE[code].code, code);
		}
	});

	it("agrees with isCritical", () => {
		for (const code of ALL_STEP_CODES) {
			assert.equal(isCritical(code), CRITICAL_STEP_CODES.includes(code));
		}
		assert.equal(isCritical("NOPE_搖"), false);
	});

	it("keeps every step text non-empty", () => {
		for (const [kind, device] of Object.entries(DEVICES)) {
			for (const step of device.steps) {
				assert.ok(step.text.length > 0, `${step.code} in ${kind} has no text`);
			}
		}
	});
});

describe("spine: applicability", () => {
	it("drops the ICS rinse step for non-steroid drugs", () => {
		const withSteroid = applicableSteps("MDI", {
			hasIcs: true,
			needsShake: true,
		});
		const without = applicableSteps("MDI", { hasIcs: false, needsShake: true });
		assert.ok(withSteroid.some((st) => st.code === "MDI_漱"));
		assert.ok(!without.some((st) => st.code === "MDI_漱"));
		assert.equal(withSteroid.length - without.length, 1);
	});

	it("drops the shake step for solution-type inhalers", () => {
		const shaken = applicableSteps("MDI", { hasIcs: true, needsShake: true });
		const not = applicableSteps("MDI", { hasIcs: true, needsShake: false });
		assert.ok(shaken.some((st) => st.code === "MDI_搖"));
		assert.ok(!not.some((st) => st.code === "MDI_搖"));
	});

	it("drops the shake step for Ellipta entirely, which has none", () => {
		assert.ok(!DEVICES.ELP.steps.some((st) => st.condition === "shake"));
		const applied = applicableSteps("ELP", { hasIcs: true, needsShake: false });
		assert.equal(applied.length, 7);
	});
});

describe("spine: drug catalog", () => {
	it("lists 17 products", () => {
		assert.equal(ALL_DRUGS.length, 17);
		assert.equal(new Set(ALL_DRUGS.map((d) => d.name)).size, 17);
	});

	it("assigns every drug a known device", () => {
		for (const drug of ALL_DRUGS) {
			assert.ok(
				DEVICE_KINDS.includes(drug.device),
				`${drug.name} → ${drug.device}`,
			);
		}
	});

	it("has 9 MDI, 3 Respimat, 4 Ellipta, 1 Breezhaler products", () => {
		const count = (k) => ALL_DRUGS.filter((d) => d.device === k).length;
		assert.deepEqual(
			DEVICE_KINDS.map((k) => [k, count(k)]),
			[
				["MDI", 9],
				["RSP", 3],
				["ELP", 4],
				["BRZ", 1],
			],
		);
	});

	it("resolves a drug by its spreadsheet key", () => {
		assert.equal(drugOf("Symbicort").device, "MDI");
		assert.equal(drugOf("Symbicort").label, "Symbicort Rapihaler");
		assert.equal(
			DRUG_BY_NAME.Trimbow.needsShake,
			false,
			"solution type must not be shaken",
		);
	});

	it("falls back to the device default dose count", () => {
		assert.equal(drugDoses("Symbicort"), 120);
		assert.equal(drugDoses("Ventolin"), 200, "Ventolin is 200 actuations");
	});
});

describe("spine: roster and knowledge questions", () => {
	it("keeps the knowledge bank at 10 questions", () => {
		assert.equal(KNOWLEDGE.length, 10);
		for (const [i, q] of KNOWLEDGE.entries()) {
			assert.equal(q.index, i + 1);
			assert.ok(
				["對", "不對"].includes(q.answer),
				`Q${i + 1} answer must be 對 or 不對`,
			);
			assert.ok(q.text.length > 0);
		}
	});

	it("keeps the four reversed (trap) questions", () => {
		const reversed = KNOWLEDGE.filter((q) => q.reversed).map((q) => q.index);
		assert.deepEqual(reversed, [3, 6, 7, 10]);
	});

	it("keeps the pharmacist roster non-empty and unique", () => {
		assert.ok(PHARMACISTS.length >= 1);
		assert.equal(new Set(PHARMACISTS).size, PHARMACISTS.length);
	});
});

/*
 * 前測／後測 is one fact in two vocabularies.
 *
 * The pharmacist says 前測 and 改善後 the QCC sheet says 改善前 and 改善後, and
 * the platform stores one of them and shows the other beside it. The rule that
 * decides which measurement a row is follows from the timepoint: the enrollment
 * is the before-measurement and the follow-up is the after-measurement (10/19
 * 會議【八】：「因為我現在是對策前」).
 */
describe("spine: 前測／後測", () => {
	it("calls the enrollment the before-measurement", () => {
		assert.equal(stageForTimepoint("M0"), STAGE_BEFORE);
	});

	it("calls every follow-up the after-measurement", () => {
		assert.equal(stageForTimepoint("M1"), STAGE_AFTER);
		assert.equal(stageForTimepoint("M3"), STAGE_AFTER);
		assert.equal(stageForTimepoint("M6"), STAGE_AFTER);
	});

	it("writes both stages in both vocabularies", () => {
		assert.equal(STAGE_LABEL[STAGE_BEFORE], "改善前（前測）");
		assert.equal(STAGE_LABEL[STAGE_AFTER], "改善後（後測）");
	});
});
