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
 * errorRate is step-weighted: total wrong steps / total assessed steps.
 * criticalRate is case-weighted: cases with a ★ error / cases.
 * The two differ on purpose — one says "how often is a step wrong",
 * the other says "how many people are at risk of the drug not reaching the lung".
 */
export function techniqueStats(rows) {
	const totalSteps = rows.reduce((n, r) => n + scoreCase(r).total, 0);
	const wrongSteps = rows.reduce((n, r) => n + (scoreCase(r).total - scoreCase(r).correct), 0);
	const withCrit = rows.filter(hasCriticalError).length;
	return {
		cases: rows.length,
		totalSteps,
		wrongSteps,
		errorRate: totalSteps ? wrongSteps / totalSteps : 0,
		criticalRate: rows.length ? withCrit / rows.length : 0,
		correctRate: totalSteps ? 1 - wrongSteps / totalSteps : 0,
	};
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
 */
export function pareto(rows) {
	const rates = stepErrorRates(rows);
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

/** Group the admin actually opens the dashboard for. */
export function summarise(rows) {
	const baseline = rows.filter((r) => r.qccStage === "改善前");
	const after = rows.filter((r) => r.qccStage === "改善後");
	return {
		total: rows.length,
		baseline: techniqueStats(baseline),
		after: techniqueStats(after),
		byDevice: { before: statsByDevice(baseline), after: statsByDevice(after) },
		knowledge: knowledgeStats(rows),
		topSteps: stepErrorRates(rows).slice(0, 5),
	};
}