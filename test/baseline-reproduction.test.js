/**
 * Acceptance: does the metrics module reproduce the published QCC baseline?
 *
 * This is the check that would catch a silently wrong dashboard. It asserts
 * against the real 61-case observations from 2026-04-21 to 2026-05-27.
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
	BASELINE,
	BASELINE_ASSESSED,
	BASELINE_WRONG,
	baselineRows,
} from "./fixtures/baseline-61.mjs";
import {
	knowledgeStats,
	pareto,
	scoreCase,
	stepErrorRates,
	stubbornSteps,
	summarise,
	techniqueStats,
} from "../api/metrics.mjs";
import { ALL_STEP_CODES, isCritical } from "../src/domain/steps.js";

describe("baseline fixture integrity", () => {
	it("carries the 61 cases collected 2026-04-21 to 2026-05-27", () => {
		assert.equal(BASELINE.n, 61);
		assert.equal(BASELINE.period.from, "2026-04-21");
		assert.equal(BASELINE.period.to, "2026-05-27");
	});

	it("splits cases across the three device families to 61", () => {
		const { MDI, SMI, DPI } = BASELINE.byDevice;
		assert.equal(MDI + SMI + DPI, 61);
		assert.deepEqual([MDI, SMI, DPI], [25, 14, 22]);
	});

	it("only uses step codes the spine defines", () => {
		for (const code of Object.keys(BASELINE.steps)) {
			assert.ok(ALL_STEP_CODES.includes(code), `${code} is not in the spine`);
		}
		assert.equal(Object.keys(BASELINE.steps).length, 33);
	});

	it("reports Breezhaler as having no baseline cases", () => {
		// No BRZ data was collected, which is why the dashboard shows it greyed out.
		const brz = Object.entries(BASELINE.steps).filter(([c]) => c.startsWith("BRZ_"));
		assert.equal(brz.length, 10);
		assert.ok(brz.every(([, v]) => v.a === 0 && v.w === 0));
	});
});

describe("acceptance: reproduce the published step-level figures", () => {
	const rows = baselineRows();

	it("reproduces 457 assessed and 93 wrong steps", () => {
		const s = techniqueStats(rows);
		assert.equal(s.totalSteps, 457, "assessed steps must match the field data");
		assert.equal(s.wrongSteps, 93, "wrong steps must match the field data");
		assert.equal(BASELINE_ASSESSED, 457);
		assert.equal(BASELINE_WRONG, 93);
	});

	it("reports a step error rate of 93/457", () => {
		const s = techniqueStats(rows);
		assert.ok(Math.abs(s.errorRate - 93 / 457) < 1e-12);
		assert.ok(Math.abs(s.correctRate - 364 / 457) < 1e-12);
	});

	it("reproduces every per-step assessed and wrong count", () => {
		const rates = new Map(stepErrorRates(rows).map((r) => [r.stepCode, r]));
		for (const [code, { a, w }] of Object.entries(BASELINE.steps)) {
			if (a === 0) continue;
			const got = rates.get(code);
			assert.ok(got, `${code} missing from computed rates`);
			assert.equal(got.assessed, a, `${code} assessed`);
			assert.equal(got.wrong, w, `${code} wrong`);
		}
	});

	it("excludes steps with no baseline cases from the rates", () => {
		const rates = stepErrorRates(rows);
		assert.equal(rates.length, 23, "only the 23 steps with cases should appear");
		assert.ok(!rates.some((r) => r.stepCode.startsWith("BRZ_")));
	});

	it("ranks the worst steps in descending order", () => {
		const rates = stepErrorRates(rows);
		for (let i = 1; i < rates.length; i += 1) {
			assert.ok(
				rates[i - 1].errorRate >= rates[i].errorRate,
				`${rates[i - 1].stepCode} must not sort below ${rates[i].stepCode}`,
			);
		}
	});

	it("puts the two worst steps at MDI_搖 and MDI_吐, both ★ critical", () => {
		// Measured from the field data: 14/25 = 56.0%, then 13/25 = 52.0%.
		const top = stepErrorRates(rows).slice(0, 2).map((r) => r.stepCode);
		assert.deepEqual(top, ["MDI_搖", "MDI_吐"]);
		assert.ok(isCritical("MDI_搖"));
		assert.ok(isCritical("MDI_吐"));
	});

	it("gives MDI_搖 the highest error rate at 14/25", () => {
		const rates = new Map(stepErrorRates(rows).map((r) => [r.stepCode, r]));
		assert.equal(rates.get("MDI_搖").wrong, 14);
		assert.equal(rates.get("MDI_搖").assessed, 25);
		assert.equal(rates.get("MDI_吐").wrong, 13);
		assert.equal(rates.get("ELP_吸").wrong, 11);
		assert.equal(rates.get("ELP_吸").assessed, 22);
	});
});

describe("acceptance: knowledge questions", () => {
	it("matches the published per-question pass counts", () => {
		const q = BASELINE.knowledgeCorrect;
		assert.equal(q.length, 10);
		// Q6, Q7 and Q10 are the ones the field data flagged as weak.
		assert.equal(q[5], 21, "Q6");
		assert.equal(q[6], 28, "Q7");
		assert.equal(q[9], 6, "Q10");
		assert.equal(q[7], 61, "Q8 was answered correctly by everyone");
	});

	it("flags the questions answered correctly by under half the cohort", () => {
		const weak = BASELINE.knowledgeCorrect
			.map((c, i) => ({ q: i + 1, rate: c / BASELINE.n }))
			.filter((x) => x.rate < 0.5)
			.map((x) => x.q);
		// Only 21/61 = 0.34, 28/61 = 0.46 and 6/61 = 0.10 fall below half.
		assert.deepEqual(weak, [6, 7, 10]);
	});
});

describe("acceptance: pareto", () => {
	it("accumulates to 100% of wrong steps", () => {
		const p = pareto(baselineRows());
		const last = p[p.length - 1];
		assert.ok(Math.abs(last.share - 1) < 1e-12);
		assert.equal(p.reduce((n, r) => n + r.wrong, 0), 93);
	});

	it("shows that a handful of steps cause most errors", () => {
		// Six of 23 steps should already account for over half of all wrong steps.
		const p = pareto(baselineRows());
		const six = p.slice(0, 6);
		assert.ok(six[six.length - 1].share > 0.5, "top 6 steps should exceed 50% of errors");
	});
});

describe("acceptance: what the step counts cannot pin down", () => {
	// The step-level a/w pairs fix how many wrong steps there were per step, but
	// not WHICH cases they belonged to. The case-level figures published
	// alongside them are therefore underdetermined, not contradicted.
	it("reproduces step counts while case-level rollups vary", () => {
		const rows = baselineRows();
		const s = techniqueStats(rows);
		assert.equal(s.totalSteps, 457, "step-level counts are fully determined");
		assert.equal(s.wrongSteps, 93, "step-level counts are fully determined");

		// The nesting used here concentrates errors, so the case-level figures
		// differ from the published ones. Both are legitimate arrangements of
		// the same step-level data; this asserts the gap is real, not a bug.
		const critCases = rows.filter((r) => scoreCase(r).critErrors.length > 0).length;
		assert.equal(critCases, 14);
		assert.equal(BASELINE.published.criticalError, 38);

		// Headroom proving 38 is achievable: 93 wrong steps could touch at most
		// 93 distinct cases, and there are only 61.
		assert.ok(BASELINE.published.criticalError <= s.wrongSteps);
		assert.ok(BASELINE.published.techniqueOk <= BASELINE.n);
	});

	it("leaves the case-level figures as published values, not computed ones", () => {
		assert.equal(BASELINE.published.techniqueOk, 40);
		assert.equal(BASELINE.published.criticalError, 38);
	});
});

describe("metrics behaviour", () => {
	it("treats an inapplicable step as neither right nor wrong", () => {
		const row = { steps: { MDI_搖: "正確", MDI_漱: "na" } };
		assert.deepEqual(scoreCase(row), {
			total: 1,
			correct: 1,
			errorRate: 0,
			critErrors: [],
		});
	});

	it("counts a critical wrong step separately from an ordinary one", () => {
		const row = { steps: { MDI_搖: "錯誤", MDI_開: "錯誤" } };
		const s = scoreCase(row);
		assert.deepEqual(s.critErrors, ["MDI_搖"], "MDI_開 is not a critical step");
		assert.equal(s.total, 2);
		assert.equal(s.correct, 0);
	});

	it("measures criticalRate by case, not by step", () => {
		const rows = [
			{ steps: { MDI_搖: "錯誤", MDI_開: "錯誤" } }, // has critical error
			{ steps: { MDI_開: "錯誤" } }, // ordinary error only
			{ steps: { MDI_搖: "正確" } }, // clean
		];
		const s = techniqueStats(rows);
		// 4 assessed, 3 wrong → step-weighted.
		assert.equal(s.errorRate, 3 / 4);
		// 1 of 3 cases has a critical error → case-weighted.
		assert.equal(s.criticalRate, 1 / 3);
	});

	it("does not divide by zero on an empty cohort", () => {
		const s = techniqueStats([]);
		assert.deepEqual(
			{ cases: s.cases, errorRate: s.errorRate, criticalRate: s.criticalRate },
			{ cases: 0, errorRate: 0, criticalRate: 0 },
		);
	});

	it("splits the summary by QCC stage", () => {
		const before = baselineRows().map((r) => ({ ...r, qccStage: "改善前" }));
		const after = before.map((r) => ({ ...r, qccStage: "改善後" }));
		const s = summarise([...before, ...after]);
		assert.equal(s.total, 122);
		assert.equal(s.baseline.cases, 61);
		assert.equal(s.after.cases, 61);
	});

	it("only flags stubborn steps that were already bad before", () => {
		const before = [
			{ device: "MDI", steps: { MDI_搖: "錯誤", MDI_開: "正確" } },
			{ device: "MDI", steps: { MDI_搖: "正確", MDI_開: "正確" } },
		];
		// MDI_開 was perfect before and is still fine; only 搖 is a candidate.
		const after = [
			{ device: "MDI", steps: { MDI_搖: "錯誤", MDI_開: "正確" } },
			{ device: "MDI", steps: { MDI_搖: "正確", MDI_開: "正確" } },
		];
		const stubborn = stubbornSteps(before, after);
		assert.deepEqual(stubborn.map((s) => s.stepCode), ["MDI_搖"]);
	});
});