/**
 * QCC metrics. These functions define what the admin dashboard shows, so they
 * are the contract: the same numbers must come out whether computed from a
 * live query or from the baseline fixture.
 *
 * Every function takes rows shaped like:
 *   { timepoint, qccStage, device, drug, steps: { 'MDI_搖': '正確' | '錯誤' | 'na' } }
 */
import { STEP_BY_CODE, isCritical } from "../src/domain/steps.js";

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
		errorRate: assessed.length ? (assessed.length - correct) / assessed.length : 0,
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
	const wrongSteps = rows.reduce((n, r) => n + (scoreCase(r).total - scoreCase(r).correct), 0);

	const withAnyError = measured.filter((r) => scoreCase(r).total - scoreCase(r).correct > 0);
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
		const stage = r.qccStage;
		const entry = byPatient.get(r.patientId) ?? {};
		entry[stage] = wrong;
		byPatient.set(r.patientId, entry);
	}

	let b = 0;
	let c = 0;
	for (const entry of byPatient.values()) {
		if (entry["改善前"] === undefined || entry["改善後"] === undefined) continue;
		if (entry["改善前"] && !entry["改善後"]) b += 1;
		else if (!entry["改善前"] && entry["改善後"]) c += 1;
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
	return Object.fromEntries([...out.entries()].map(([k, v]) => [k, techniqueStats(v)]));
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
	const before = new Map(stepErrorRates(baselineRows).map((r) => [r.stepCode, r]));
	return stepErrorRates(afterRows)
		.filter((r) => r.errorRate >= threshold && (before.get(r.stepCode)?.errorRate ?? 0) >= threshold)
		.map((r) => ({ ...r, before: before.get(r.stepCode)?.errorRate ?? 0 }));
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