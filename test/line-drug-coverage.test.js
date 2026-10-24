/**
 * Every inhaler the pharmacist can enroll must be one the patient can pick.
 *
 * The platform's catalogue (`src/domain/drugs.js`) and the LINE education list
 * (`src/line/data/drugs.json`) are two lists: the first is the pharmacist's
 * working formulary, the second is what the patient chooses on their phone. A
 * drug in the first and not in the second is a hole — the patient is enrolled
 * and then cannot say which inhaler they use, so the journey stops before it
 * starts.
 *
 * 備勞喘 (Berotec N) was exactly that hole: it is in the catalogue, the
 * pharmacist can enroll it, and the LINE list had never heard of it. Duasma
 * HFA is in both even though its 仿單 is missing too, so the absence was an
 * accident rather than a decision.
 *
 * The two lists name the same drugs differently (the catalogue says 「Ventolin
 * Inhaler」, LINE says 「Ventolin Evohaler」), so the join is a table rather
 * than a rule. The table is the point: a new drug in the catalogue has no
 * line here, this test fails, and somebody has to decide whether a patient
 * may pick it.
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

import { ALL_DRUGS } from "../src/domain/drugs.js";

const LINE_DRUGS = JSON.parse(
	readFileSync(new URL("../src/line/data/drugs.json", import.meta.url), "utf8"),
);

// The patient end maps a LINE id back to the platform's device class. It is
// TypeScript, so it is read rather than imported.
const DEVICE_MAP_SOURCE = readFileSync(
	new URL("../src/line/devices.ts", import.meta.url),
	"utf8",
);

/** The catalogue's drug name → the LINE list's id. */
const LINE_ID_BY_DRUG = {
	Symbicort: "Symbicort_Rapihaler",
	"Seretide Evohaler": "Seretide_Evohaler",
	"Flixotide Evohaler": "Flixotide_Evohaler",
	"Duasma HFA": "Duasma_MDI",
	Breztri: "Breztri_Aerosphere",
	Trimbow: "Trimbow_Inhalation",
	Bevespi: "Bevespi_Aerosphere",
	"Berotec N": "Berotec_N",
	Ventolin: "Ventolin_Evohaler",
	"Relvar (Ellipta)": "Relvar_Ellipta",
	"Trelegy 92/55/22 (Ellipta)": "Trelegy_92",
	"Trelegy 184/55/22 (Ellipta)": "Trelegy_184",
	"Anoro (Ellipta)": "Anoro_Ellipta",
	"Ultibro Breezhaler": "Ultibro_Breezhaler",
	"Spiolto Respimat": "Spiolto_Respimat",
	"Striverdi Respimat": "Striverdi_Respimat",
	"Spiriva Respimat": "Spiriva_Respimat",
};

/** The catalogue's device class → the LINE list's. */
const LINE_DEVICE = { MDI: "MDI", ELP: "DPI", BRZ: "DPI", RSP: "SMI" };

describe("the two drug lists", () => {
	it("cover each other", () => {
		for (const drug of ALL_DRUGS) {
			assert.ok(
				LINE_ID_BY_DRUG[drug.name],
				`${drug.name} 沒有對應的 LINE 藥品 id；病人選不到自己那支藥`,
			);
		}
		for (const name of Object.keys(LINE_ID_BY_DRUG)) {
			assert.ok(
				ALL_DRUGS.some((d) => d.name === name),
				`${name} 不在平台的收案目錄裡`,
			);
		}
	});

	it("have no drug the platform has never heard of", () => {
		const known = new Set(Object.values(LINE_ID_BY_DRUG));
		for (const line of LINE_DRUGS) {
			assert.ok(known.has(line.id), `${line.id} 不在平台的收案目錄裡`);
		}
	});

	it("agree about what kind of device each one is", () => {
		for (const drug of ALL_DRUGS) {
			const id = LINE_ID_BY_DRUG[drug.name];
			const line = LINE_DRUGS.find((d) => d.id === id);
			assert.ok(line, id);
			assert.equal(
				line.type,
				LINE_DEVICE[drug.device],
				`${drug.name} 的裝置分類對不上`,
			);
		}
	});

	it("are all in the device map the patient end uses", () => {
		// A drug in the LINE list that the device map has never heard of has no
		// device on the patient's screen, so the journey cannot place it.
		for (const line of LINE_DRUGS) {
			assert.match(
				DEVICE_MAP_SOURCE,
				new RegExp(`\\b${line.id}:`),
				`${line.id} 不在 src/line/devices.ts 的裝置對照裡`,
			);
		}
	});

	it("tell a patient with a rescue inhaler from one without", () => {
		// 緊急用藥 is the patient's own safety net; the rule about which drug
		// may fill it is the API's, and it is checked there.
		for (const line of LINE_DRUGS) {
			assert.ok(line.roles.length > 0, `${line.id} 沒有用途`);
			for (const role of line.roles) {
				assert.ok(
					["maintenance", "rescue"].includes(role),
					`${line.id} 的用途 ${role} 不認得`,
				);
			}
		}
	});
});
