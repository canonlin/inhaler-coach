/**
 * 收案表寫的藥名，一定要讀得到目錄裡的那一支。
 *
 * 試算表是藥師自己填的，藥名怎麼寫他決定；目錄的名稱是凍結的（那是
 * 成效儀表板分組用的 key）。中間那層對應如果指錯一支藥，那一列的藥就
 * 變成空白——病人還在，只是沒有藥了，而沒有人會發現。
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { DRUG_ALIASES, resolveDrug } from "../api/import-export.mjs";
import { ALL_DRUGS } from "../src/domain/drugs.js";

describe("the sheet's drug spellings", () => {
	it("maps every alias onto a product the catalogue has", () => {
		for (const [spelling, target] of DRUG_ALIASES) {
			assert.ok(
				ALL_DRUGS.some((d) => d.name === target),
				`the alias "${spelling}" points at "${target}", which is not in the catalogue`,
			);
		}
	});

	it("reads every alias back to the product it names", () => {
		for (const [spelling, target] of DRUG_ALIASES) {
			assert.equal(
				resolveDrug(spelling),
				target,
				`the sheet's "${spelling}" must resolve to ${target}`,
			);
		}
	});

	it("reads the catalogue's own names and labels", () => {
		for (const drug of ALL_DRUGS) {
			assert.equal(resolveDrug(drug.name), drug.name);
			assert.equal(resolveDrug(drug.label), drug.name);
		}
	});

	it("keeps the parenthetical spelling Ultibro is sometimes written with", () => {
		// 試算表裡有人寫 "Ultibro (Breezhaler)"，也有人寫 "Ultibro Breezhaler"。
		// 兩種都得讀得到同一支藥。
		assert.equal(resolveDrug("Ultibro Breezhaler"), "Ultibro Breezhaler");
		assert.equal(resolveDrug("Ultibro (Breezhaler)"), "Ultibro Breezhaler");
	});
});
