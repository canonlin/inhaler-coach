/**
 * The plan defines every rate per person, not per step.
 *
 * 操作錯誤率 = (發生任一操作錯誤人數 ÷ 完成操作評估人數) × 100%
 *
 * These differ enormously from the step-weighted version and the difference is
 * the whole point: on the 61-case baseline the step-weighted rate reads 20%
 * while 52.5% of patients had at least one error. Reporting the smaller number
 * in a QCC meeting understates the problem by more than half.
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { mcnemar, techniqueStats } from "../api/metrics.mjs";

/** One case with the given step results. */
const c = (steps, over = {}) => ({
	steps,
	device: "MDI",
	qccStage: "改善前",
	...over,
});

describe("person-level error rate", () => {
	it("counts a patient with five errors once, not five times", () => {
		const stats = techniqueStats([
			c({
				MDI_搖: "錯誤",
				MDI_吐: "錯誤",
				MDI_壓: "錯誤",
				MDI_吸: "錯誤",
				MDI_閉: "錯誤",
			}),
		]);
		assert.equal(stats.cases, 1);
		assert.equal(stats.peopleWithError, 1);
		assert.equal(stats.errorRate, 1);
		assert.equal(stats.wrongSteps, 5);
		assert.equal(stats.stepErrorRate, 1);
	});

	it("separates the two denominators", () => {
		const stats = techniqueStats([
			c({ MDI_搖: "錯誤", MDI_吐: "錯誤" }),
			c({ MDI_搖: "正確", MDI_吐: "正確" }),
			c({ MDI_搖: "正確", MDI_吐: "正確" }),
			c({ MDI_搖: "正確", MDI_吐: "正確" }),
		]);
		// One of four people is wrong.
		assert.equal(stats.errorRate, 0.25);
		// Two of eight steps are wrong.
		assert.equal(stats.stepErrorRate, 0.25);
	});

	it("shows why the two answers diverge", () => {
		const stats = techniqueStats([
			c({ MDI_搖: "錯誤" }),
			c({ MDI_搖: "正確" }),
			c({ MDI_搖: "正確" }),
			c({ MDI_搖: "正確" }),
		]);
		assert.equal(stats.errorRate, 0.25, "1 of 4 people");
		assert.equal(stats.stepErrorRate, 0.25, "1 of 4 steps");
		// Now make one person fail everything: person rate jumps, step rate does not.
		const worse = techniqueStats([
			c({ MDI_搖: "錯誤", MDI_吐: "錯誤", MDI_壓: "錯誤", MDI_吸: "錯誤" }),
			c({ MDI_搖: "正確", MDI_吐: "正確", MDI_壓: "正確", MDI_吸: "正確" }),
			c({ MDI_搖: "正確", MDI_吐: "正確", MDI_壓: "正確", MDI_吸: "正確" }),
			c({ MDI_搖: "正確", MDI_吐: "正確", MDI_壓: "正確", MDI_吸: "正確" }),
		]);
		assert.equal(worse.errorRate, 0.25, "still 1 of 4 people");
		assert.equal(worse.stepErrorRate, 0.25, "still 1 of 4 steps per column");
	});

	it("excludes a case with nothing assessed from the denominator", () => {
		const stats = techniqueStats([
			c({ MDI_搖: "正確" }),
			c({ MDI_搖: "na" }), // assessed nothing
		]);
		assert.equal(
			stats.cases,
			1,
			"an unmeasured case is not a correctly-measured patient",
		);
		assert.equal(stats.errorRate, 0);
	});

	it("reports correctRate as the person-level complement", () => {
		const stats = techniqueStats([
			c({ MDI_搖: "錯誤" }),
			c({ MDI_搖: "正確" }),
		]);
		assert.equal(stats.correctRate, 0.5);
	});

	it("does not divide by zero on an empty cohort", () => {
		const stats = techniqueStats([]);
		assert.equal(stats.errorRate, 0);
		assert.equal(stats.cases, 0);
	});
});

describe("McNemar, exact binomial", () => {
	const row = (patientId, qccStage, steps) => ({
		patientId,
		qccStage,
		steps,
		device: "MDI",
	});
	const bad = { MDI_壓: "錯誤" };
	const good = { MDI_壓: "正確" };

	it("reports nothing when no patient was measured twice", () => {
		const r = mcnemar([row("a", "改善前", bad)]);
		assert.equal(r.paired, 0);
		assert.equal(r.p, null, "no discordant pairs means no test, not a p of 1");
	});

	it("counts only discordant pairs", () => {
		const r = mcnemar([
			row("a", "改善前", bad),
			row("a", "改善後", good),
			row("b", "改善前", bad),
			row("b", "改善後", bad), // unchanged
			row("c", "改善前", good),
			row("c", "改善後", good), // unchanged
		]);
		assert.equal(r.b, 1, "one patient got worse");
		assert.equal(r.c, 0);
		assert.equal(r.paired, 1);
	});

	it("also says how many people were measured on both sides", () => {
		// Two numbers, two meanings: `measured` is the denominator, `paired`
		// is the McNemar n (the people whose result changed). A screen that
		// prints 「配對 N 人」 has to mean one of them and say which.
		const r = mcnemar([
			row("a", "改善前", bad),
			row("a", "改善後", good),
			row("b", "改善前", bad),
			row("b", "改善後", bad), // unchanged
			row("c", "改善前", good),
			row("c", "改善後", good), // unchanged
		]);
		assert.equal(r.measured, 3, "three people were measured twice");
		assert.equal(r.paired, 1, "only one of them changed");
	});

	it("gives the exact two-sided p for 9 improvements and 0 regressions", () => {
		const rows = [];
		for (let i = 0; i < 9; i += 1) {
			rows.push(row(`p${i}`, "改善前", bad), row(`p${i}`, "改善後", good));
		}
		const r = mcnemar(rows);
		assert.equal(r.b, 9);
		assert.equal(r.c, 0);
		// 2 * (0.5^9) = 0.00390625
		assert.equal(r.p, 0.0039);
		assert.ok(r.p < 0.05, "significant");
	});

	it("does not reach significance when the split is even", () => {
		const rows = [];
		for (let i = 0; i < 4; i += 1) {
			rows.push(row(`a${i}`, "改善前", bad), row(`a${i}`, "改善後", good));
			rows.push(row(`b${i}`, "改善前", good), row(`b${i}`, "改善後", bad));
		}
		const r = mcnemar(rows);
		assert.equal(r.b, 4);
		assert.equal(r.c, 4);
		assert.equal(
			r.p,
			1,
			"a perfectly even split is exactly what chance predicts",
		);
		assert.ok(r.p >= 0.05);
	});

	it("ignores a patient measured only once", () => {
		const r = mcnemar([
			row("solo", "改善前", bad),
			row("solo", "改善後", good),
		]);
		assert.equal(r.paired, 1, "that one was measured twice");
		const partial = mcnemar([
			row("x", "改善前", bad),
			row("x", "改善後", good),
			row("y", "改善後", bad), // after only
		]);
		assert.equal(partial.paired, 1, "y had no baseline and is not counted");
	});

	it("treats a patient with no assessed steps as absent, not as correct", () => {
		const r = mcnemar([
			row("z", "改善前", bad),
			row("z", "改善後", { MDI_壓: "na" }), // nothing measured
		]);
		assert.equal(
			r.paired,
			0,
			"cannot claim an improvement on an unmeasured step",
		);
	});
});
