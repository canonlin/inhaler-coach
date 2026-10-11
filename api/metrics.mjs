/**
 * QCC metrics. These functions define what the admin dashboard shows, so they
 * are the contract: the same numbers must come out whether computed from a
 * live query or from the baseline fixture.
 *
 * Every function takes rows shaped like:
 *   { timepoint, qccStage, device, drug, steps: { 'MDI_搖': '正確' | '錯誤' | 'na' } }
 */
import { isCritical } from "../src/domain/steps.js";

/** A step counts as wrong only when it was assessed and marked 錯誤. 'na' is not an error. */
function assessedSteps(row) {
	return Object.entries(row.steps ?? {}).filter(([, v]) => v !== "na");
}

/**
 * Per-case technique score.
 * @returns {{total: number, correct: number, errorRate: number, critErrors: string[]}}
 */
export function scoreCase(row) {
	const assessed = assessedSteps(row);
	const correct = assessed.filter(([, v]) => v === "正確").length;
	const critErrors = assessed
		.filter(([code, v]) => v === "錯誤" && isCritical(code))
		.map(([code]) => code);
	return {
		total: assessed.length,
		correct,
		errorRate: assessed.length
			? (assessed.length - correct) / assessed.length
			: 0,
		critErrors,
	};
}

/** Does this row have at least one ★ critical error? */
export function hasCriticalError(row) {
	return scoreCase(row).critErrors.length > 0;
}

/**
 * Technique rates for one group of rows.
 *
 * The plan defines the error rate per person:
 *   操作錯誤率 = 發生任一操作錯誤人數 ÷ 完成操作評估人數
 * A patient who fails five steps is one patient with a problem, not five
 * problems. The step-weighted figure is kept as `stepErrorRate` because it
 * answers a different question — which steps to fix — and because showing only
 * one of them hides the difference: on the 61-case baseline the step-weighted
 * rate reads 20% while 52.5% of patients had at least one error. The smaller
 * number is the one that would go into a QCC report, and it is the wrong one.
 *
 * A row with no assessed steps is not a person who was assessed correctly; it
 * is an absence of measurement, so it stays out of the denominator.
 */
export function techniqueStats(rows) {
	const measured = rows.filter((r) => scoreCase(r).total > 0);
	const totalSteps = rows.reduce((n, r) => n + scoreCase(r).total, 0);
	const wrongSteps = rows.reduce(
		(n, r) => n + (scoreCase(r).total - scoreCase(r).correct),
		0,
	);

	const withAnyError = measured.filter(
		(r) => scoreCase(r).total - scoreCase(r).correct > 0,
	);
	const withCrit = measured.filter(hasCriticalError);
	const n = measured.length;

	return {
		cases: n,
		// People, per the plan's unit of analysis.
		peopleWithError: withAnyError.length,
		errorRate: n ? withAnyError.length / n : 0,
		peopleWithCritical: withCrit.length,
		criticalRate: n ? withCrit.length / n : 0,
		correctRate: n ? 1 - withAnyError.length / n : 0,
		// Step-level, kept for diagnosing which steps to fix and for the Pareto.
		totalSteps,
		wrongSteps,
		stepErrorRate: totalSteps ? wrongSteps / totalSteps : 0,
	};
}

/**
 * McNemar, exact binomial, on patients measured both before and after.
 *
 * The plan calls for McNemar because the design is single-group pre/post: the
 * same people are counted twice, so an unpaired comparison would double-count
 * them and ignore the pairing. With a cohort this small the chi-square
 * approximation is not safe, so the exact test is used instead.
 *
 * Only discordant pairs carry information. If everybody improved, or nobody
 * changed, the test cannot distinguish that from no evidence.
 *
 * @param {Array<object>} pairedRows rows carrying a patientId
 * @returns {{paired: number, b: number, c: number, p: number|null}}
 */
export function mcnemar(pairedRows) {
	/** patientId -> qccStage -> wrong? */
	const byPatient = new Map();
	for (const r of pairedRows) {
		if (!r.patientId) continue;
		const s = scoreCase(r);
		if (s.total === 0) continue;
		const wrong = s.total - s.correct > 0;
		// Keyed before/after rather than by the display string. The stage label is
		// 「改善前」/「改善後」, and using it as a key meant every access below
		// was a bracket lookup with a literal — which the linter correctly reads
		// as "this could be a dot key". Naming the two states makes the pairing
		// test read as the thing it tests: did this patient have an error before
		// and not after.
		const stage = r.qccStage === "改善後" ? "after" : "before";
		const entry = byPatient.get(r.patientId) ?? {};
		entry[stage] = wrong;
		byPatient.set(r.patientId, entry);
	}

	let b = 0;
	let c = 0;
	for (const entry of byPatient.values()) {
		if (entry.before === undefined || entry.after === undefined) continue;
		if (entry.before && !entry.after) b += 1;
		else if (!entry.before && entry.after) c += 1;
	}
	const paired = b + c;
	if (paired === 0) return { paired: 0, b, c, p: null };
	// Two-sided exact binomial under H0: discordant pairs split 50/50.
	const k = Math.min(b, c);
	const p = Math.min(1, 2 * binomialCdf(k, paired, 0.5));
	return { paired, b, c, p: Math.round(p * 10000) / 10000 };
}

/** P(X <= k) for X ~ Binomial(n, p). */
function binomialCdf(k, n, p) {
	let sum = 0;
	for (let i = 0; i <= k; i += 1) {
		sum += binom(n, i) * p ** i * (1 - p) ** (n - i);
	}
	return sum;
}

/** Exact binomial coefficient; n here is a cohort, so the loop is safe. */
function binom(n, k) {
	let r = 1;
	for (let i = 0; i < k; i += 1) r = (r * (n - i)) / (i + 1);
	return Math.round(r);
}

/**
 * Error rate per step code, sorted worst first.
 * @returns {{stepCode: string, assessed: number, wrong: number, errorRate: number, critical: boolean}[]}
 */
export function stepErrorRates(rows) {
	const acc = new Map();
	for (const row of rows) {
		for (const [code, value] of assessedSteps(row)) {
			const e = acc.get(code) ?? { assessed: 0, wrong: 0 };
			e.assessed += 1;
			if (value === "錯誤") e.wrong += 1;
			acc.set(code, e);
		}
	}
	return [...acc.entries()]
		.map(([stepCode, { assessed, wrong }]) => ({
			stepCode,
			assessed,
			wrong,
			errorRate: assessed ? wrong / assessed : 0,
			critical: isCritical(stepCode),
		}))
		.filter((r) => r.assessed > 0)
		.sort((a, b) => b.errorRate - a.errorRate);
}

/**
 * Pareto over step-level errors: the few steps that cause most of the wrong
 * steps. `share` is the cumulative fraction, so the 80% line is readable.
 *
 * Sorted by COUNT, not by rate. A cumulative curve over rows ordered by
 * something else is not a Pareto, and the 80% reading becomes meaningless.
 */
export function pareto(rows) {
	const rates = stepErrorRates(rows)
		.filter((r) => r.wrong > 0)
		.sort((a, b) => b.wrong - a.wrong || a.stepCode.localeCompare(b.stepCode));
	const total = rates.reduce((n, r) => n + r.wrong, 0);
	let cumulative = 0;
	return rates.map((r) => {
		cumulative += r.wrong;
		return { ...r, share: total ? cumulative / total : 0 };
	});
}

/** Technique stats split by device, for the 改善前 vs 改善後 comparison. */
export function statsByDevice(rows) {
	const out = new Map();
	for (const row of rows) {
		const bucket = out.get(row.device) ?? [];
		bucket.push(row);
		out.set(row.device, bucket);
	}
	return Object.fromEntries(
		[...out.entries()].map(([k, v]) => [k, techniqueStats(v)]),
	);
}

/** Knowledge score, 0–10. Missing answers are not counted as wrong. */
export function knowledgeStats(rows) {
	const scored = rows.filter((r) => Number.isInteger(r.knowledgeScore));
	if (!scored.length) return { cases: 0, mean: 0 };
	const mean = scored.reduce((n, r) => n + r.knowledgeScore, 0) / scored.length;
	return { cases: scored.length, mean: Math.round(mean * 100) / 100 };
}

/** Which of the top steps remain worst after the intervention. */
export function stubbornSteps(baselineRows, afterRows, threshold = 0.25) {
	const before = new Map(
		stepErrorRates(baselineRows).map((r) => [r.stepCode, r]),
	);
	return stepErrorRates(afterRows)
		.filter(
			(r) =>
				r.errorRate >= threshold &&
				(before.get(r.stepCode)?.errorRate ?? 0) >= threshold,
		)
		.map((r) => ({ ...r, before: before.get(r.stepCode)?.errorRate ?? 0 }));
}

/**
 * The smallest post-intervention denominator that can carry a ▲ 頑固 mark.
 *
 * ▲ says 「這一項沒有被處理好」, and a mark that appears on a step that in fact
 * improved sends the pharmacist to re-teach something already fixed — worse
 * than saying nothing. So the threshold is the false-alarm rate, not a taste.
 *
 * Measured exactly (output/design-review/stubborn-threshold.mjs), for the rate
 * of a step that genuinely improved to 15% still being seen at >= 25%:
 *
 *   n =  8 → 34% of improved steps would be marked   (fire on noise)
 *   n = 18 → 12%
 *   n = 25 →  7%
 *
 * 25 is the first denominator where a false mark is rarer than one in ten, and
 * every mark below it is withheld rather than softened. The post-intervention
 * cohort is the constraint: 144 assessments over 8 steps is about 18 per step,
 * so on the current data no step qualifies, and every cell says 資料不足
 * instead of carrying a symbol. That is the correct reading, not a gap.
 *
 * The rate is also non-monotone in n — 20 lands at 17% while 25 lands at 7% —
 * because the mark is a fixed 25% and the required count k jumps discretely.
 * Rounding this up to the next round number would therefore look tidy and be
 * wrong, which is why 25 is not 30 or 40.
 */
export const MIN_ASSESSED_FOR_STUBBORN = 25;

/**
 * Each step's rate in both cohorts, for the before → after heatmap.
 *
 * One row per step code, so the reader compares a step with itself instead of
 * scanning two differently-ordered lists. `assessed` travels with each rate
 * because a rate without its denominator is the thing this project has already
 * got wrong once: 1 of 1 is 100%, and it means nothing.
 *
 * Sorted by the baseline rate, worst first — the pre-intervention error is what
 * says which steps were worth fixing, and sorting by the post rate would let a
 * step that improved sharply outrank one that never moved.
 */
export function stepComparison(baselineRows, afterRows, threshold = 0.25) {
	const before = new Map(
		stepErrorRates(baselineRows).map((r) => [r.stepCode, r]),
	);
	const after = new Map(stepErrorRates(afterRows).map((r) => [r.stepCode, r]));
	const codes = new Set([...before.keys(), ...after.keys()]);
	return [...codes]
		.map((stepCode) => {
			const b = before.get(stepCode);
			const a = after.get(stepCode);
			const postAssessed = a?.assessed ?? 0;
			return {
				stepCode,
				critical: isCritical(stepCode),
				before: b ? { rate: b.errorRate, assessed: b.assessed } : null,
				after: a ? { rate: a.errorRate, assessed: a.assessed } : null,
				/**
				 * null means the denominator is too small to support the claim,
				 * which is not the same as false. Callers must render those two
				 * differently; collapsing them would invent either a mark or a
				 * clearance that the data does not give.
				 */
				stubborn:
					postAssessed >= MIN_ASSESSED_FOR_STUBBORN &&
					(a?.errorRate ?? 0) >= threshold &&
					(b?.errorRate ?? 0) >= threshold,
				// Whether it is on the list at all, so the caller can print
				// 「改善後沒有這一項的資料」 rather than 0%.
				noAfterData: !a,
			};
		})
		.sort(
			(x, y) =>
				(y.before?.rate ?? 0) - (x.before?.rate ?? 0) ||
				(y.after?.rate ?? 0) - (x.after?.rate ?? 0) ||
				x.stepCode.localeCompare(y.stepCode),
		);
}

/** Group the pharmacist actually opens the outcomes tab for. */
export function summarise(rows) {
	const baseline = rows.filter((r) => r.qccStage === "改善前");
	const after = rows.filter((r) => r.qccStage === "改善後");
	return {
		total: rows.length,
		baseline: techniqueStats(baseline),
		after: techniqueStats(after),
		// Paired pre-post on the people measured twice, which is the plan's design.
		paired: mcnemar(rows),
		byDevice: { before: statsByDevice(baseline), after: statsByDevice(after) },
		knowledge: knowledgeStats(rows),
		topSteps: stepErrorRates(rows).slice(0, 5),
	};
}
