/**
 * 「先噴幾次」是一支藥一個規則，不是一個規則。
 *
 * 這些測試存在的理由很簡單：以前這件事寫死在 Symbicort 那一支上，於是
 * Aerosphere 的 4 下、Trimbow 的 1 下、以及 Ellipta 與 Breezhaler 根本不排氣
 * 這三件事都會被講錯。講錯就是病人的吸入器被教錯用法。
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { ALL_DRUGS } from "../src/domain/drugs.js";
import {
	needsPriming,
	PRIMING_RULES,
	primingFor,
	unconfirmedProducts,
} from "../src/domain/priming.js";

describe("the priming rules", () => {
	it("covers every product in the catalogue", () => {
		// A product with no rule is a product whose 「先噴幾次」 is a guess.
		for (const drug of ALL_DRUGS) {
			const rule = primingFor(drug.name);
			assert.equal(rule.key, drug.name);
			assert.ok(
				rule.source.length > 0,
				`${drug.name} must say where its rule comes from`,
			);
			assert.ok(
				rule.how.length > 0,
				`${drug.name} must have something to say to the patient`,
			);
		}
	});

	it("does not invent a number for a product whose insert has not been read", () => {
		// Duasma HFA and Berotec N: the catalogue already says 懸浮／溶液待確認.
		// A guessed number here is worse than no number.
		const pending = unconfirmedProducts();
		assert.ok(pending.includes("Duasma HFA"));
		assert.ok(pending.includes("Berotec N"));
		for (const key of pending) {
			const rule = primingFor(key);
			assert.equal(rule.confirmed, false);
			assert.equal(rule.sprays, null);
			assert.equal(needsPriming(key), false);
			assert.match(rule.how, /還沒有確認/);
		}
	});

	it("gives every product a rule of its own, not a device default", () => {
		// Two sprays is the Symbicort answer. If every product answered two,
		// this file would not exist.
		assert.equal(primingFor("Symbicort").sprays, 2);
		assert.equal(primingFor("Breztri").sprays, 4);
		assert.equal(primingFor("Bevespi").sprays, 4);
		assert.equal(primingFor("Trimbow").sprays, 1);
		assert.equal(primingFor("Ventolin").sprays, 2);
	});

	it("knows that Ellipta and Breezhaler do not prime at all", () => {
		// Opening the Ellipta cover loads the dose; the Breezhaler capsule is
		// pierced once. Neither has a priming spray to ask a patient for.
		for (const key of [
			"Relvar (Ellipta)",
			"Trelegy 92/55/22 (Ellipta)",
			"Trelegy 184/55/22 (Ellipta)",
			"Anoro (Ellipta)",
			"Ultibro Breezhaler",
		]) {
			assert.equal(primingFor(key).sprays, null, key);
			assert.equal(needsPriming(key), false, key);
			assert.equal(primingFor(key).shake, false, key);
		}
	});

	it("knows that a solution-type inhaler is not shaken", () => {
		// Trimbow's insert says so, and the checklist already drops the 搖
		// step for it. The priming rule has to agree with the checklist.
		assert.equal(primingFor("Trimbow").shake, false);
		assert.equal(primingFor("Symbicort").shake, true);
	});

	it("knows when a device has to be primed again", () => {
		assert.equal(primingFor("Symbicort").rePrimeAfterDays, 7);
		assert.equal(primingFor("Ventolin").rePrimeAfterDays, 5);
		assert.equal(primingFor("Breztri").rePrimeAfterDays, 7);
		// Respimat: one puff after three days, re-primed as new after 21.
		assert.equal(primingFor("Spiriva Respimat").rePrimeAfterDays, 3);
		assert.equal(primingFor("Spiriva Respimat").rePrimeSprays, 1);
		assert.equal(primingFor("Spiolto Respimat").sprays, 4);
	});

	it("keeps every rule reachable from the catalogue's own keys", () => {
		// The keys are the spreadsheet keys. A rule filed under a different
		// spelling is a rule nobody will ever read.
		for (const drug of ALL_DRUGS) {
			assert.ok(
				PRIMING_RULES[drug.name],
				`${drug.name} must be reachable by its catalogue key`,
			);
		}
	});
});
