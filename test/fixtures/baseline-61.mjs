/**
 * The 61-case QCC baseline, 2026-04-21 to 2026-05-27.
 *
 * IMPORTANT — what this is and is not.
 *
 * These are the real aggregate observations recorded during the baseline period,
 * transcribed from the v2 prototype's `BASE` constant. They are NOT 61 individual
 * patient records: the per-case rows live in the hospital's Google Sheet, which
 * this repository has no access to.
 *
 * What the fixture can therefore prove:
 *   - the metrics module reproduces the published step-level figures exactly
 *     (457 assessed, 93 wrong, and every per-step a/w pair);
 *   - the worst steps and their ranking match the field data;
 *   - the knowledge-question pass rates match;
 *   - the dashboard renders 改善前 step-level numbers identical to the field data.
 *
 * What it cannot prove, and no test here claims to:
 *   - the case-level rollups. `opw: 40` and `crit: 38` are case counts over
 *     n=61 in the source, but the step-level a/w pairs fix only *how many* wrong
 *     steps occurred per step, not *which cases* they belonged to. Several
 *     arrangements satisfy the same per-step counts while giving different
 *     case-level figures, so 40 and 38 are underdetermined by this data rather
 *     than contradicted by it. They stay as published values, never recomputed.
 *
 * See docs/superpowers/specs/2026-10-09-v2-unified-platform-design.md §5.
 */

export const BASELINE = {
	period: { from: "2026-04-21", to: "2026-05-27" },
	n: 61,

	/** Cases per device. Sums to n. */
	byDevice: { MDI: 25, SMI: 14, DPI: 22 },

	/** Case-level counts as published. See the caveat above before using them. */
	published: { techniqueOk: 40, criticalError: 38 },

	/** Real per-step observations: assessed and wrong counts. */
	steps: {
		MDI_搖: { a: 25, w: 14 },
		MDI_開: { a: 25, w: 0 },
		MDI_吐: { a: 25, w: 13 },
		MDI_含: { a: 25, w: 2 },
		MDI_壓: { a: 25, w: 13 },
		MDI_吸: { a: 25, w: 4 },
		MDI_閉: { a: 25, w: 5 },
		MDI_漱: { a: 22, w: 1 },
		RSP_轉: { a: 14, w: 0 },
		RSP_開: { a: 14, w: 0 },
		RSP_吐: { a: 14, w: 7 },
		RSP_含: { a: 14, w: 5 },
		RSP_壓吸: { a: 14, w: 2 },
		RSP_吸: { a: 14, w: 0 },
		RSP_閉: { a: 14, w: 3 },
		RSP_吐2: { a: 14, w: 0 },
		ELP_開: { a: 22, w: 0 },
		ELP_吐: { a: 22, w: 10 },
		ELP_含: { a: 22, w: 0 },
		ELP_吸: { a: 22, w: 11 },
		ELP_閉: { a: 22, w: 2 },
		ELP_關: { a: 22, w: 0 },
		ELP_漱: { a: 16, w: 1 },
		BRZ_開: { a: 0, w: 0 },
		BRZ_置: { a: 0, w: 0 },
		BRZ_蓋: { a: 0, w: 0 },
		BRZ_刺: { a: 0, w: 0 },
		BRZ_吐: { a: 0, w: 0 },
		BRZ_含: { a: 0, w: 0 },
		BRZ_吸: { a: 0, w: 0 },
		BRZ_閉: { a: 0, w: 0 },
		BRZ_查: { a: 0, w: 0 },
		BRZ_收: { a: 0, w: 0 },
	},

	/** Correct answers per knowledge question, out of n. */
	knowledgeCorrect: [51, 59, 51, 57, 60, 21, 28, 61, 61, 6],
	knowledgeMeanPublished: 7.98,

	/** Real pharmacist free-text notes, verbatim, keyed by step. */
	notes: {
		MDI_搖: ["忘記搖", "未搖", "未振搖"],
		MDI_吐: ["未吐氣", "會忘記", "未吐", "會忘記吐氣"],
		MDI_含: ["雙唇沒有緊閉包住,有白煙跑出", "雙唇未緊閉"],
		MDI_壓: [
			"壓吸不同步",
			"未同步",
			"有時會有時間落差",
			"壓吸未同步",
			"陳述先吸氣約大於2-3秒才按壓",
			"會落差大於2-3秒",
			"沒有下壓,沒有頂住底部沒有施力點",
			"沒有同步,吸太快急",
			"太慢吸",
		],
		MDI_吸: ["未含滿", "深吸 力道不足", "吸不到3-5秒", "吸太快急"],
		MDI_閉: ["未憋氣5-10秒", "未憋氣", "未閉氣"],
		MDI_漱: ["未漱口"],
		RSP_吐: ["未吐氣"],
		RSP_含: ["沒有嘴唇密合", "嘴唇未密合,有漏煙", "嘴唇未密合", "未緊密嘴唇密合"],
		RSP_壓吸: ["未同步", "未同步,先吸再壓"],
		RSP_閉: ["未閉氣 5-秒", "未閉氣"],
		ELP_吐: ["未吐氣", "對裝置吐氣", "未吐", "沒吐氣"],
		ELP_吸: [
			"吸太慢,力道不足",
			"吸太慢  力道不足",
			"未快速深吸",
			"沒有快速深吸",
			"快速深吸未做到",
			"吸要角度太低,氣管不順暢吸藥效率不佳",
			"沒吸飽氣",
			"沒有大力吸",
			"力道不足",
		],
		ELP_閉: ["沒閉氣3-5秒"],
		ELP_漱: ["沒漱口"],
	},
};

/** Total assessed steps across the baseline. */
export const BASELINE_ASSESSED = Object.values(BASELINE.steps).reduce((n, s) => n + s.a, 0);

/** Total wrong steps across the baseline. */
export const BASELINE_WRONG = Object.values(BASELINE.steps).reduce((n, s) => n + s.w, 0);

/**
 * Rows in the shape the metrics module consumes, synthesised from the observed
 * per-step counts. Deterministic: no RNG, so a failing test is reproducible.
 *
 * Each case uses exactly one device, because a patient takes one inhaler. Within
 * a device, case `k` is assessed on step `c` exactly when `k < c.a` and gets it
 * wrong when `k < c.w`. That reproduces every per-step count and the cohort size
 * by construction, without inventing a per-case history that was never published.
 *
 * @returns {{qccStage: string, device: string, drug: string, steps: Record<string,string>}[]}
 */
export function baselineRows() {
	// byDevice is keyed by the clinical family (MDI/SMI/DPI); step codes use the
	// device code (MDI/RSP/ELP). Map once, here.
	const CASES = { MDI: BASELINE.byDevice.MDI, RSP: BASELINE.byDevice.SMI, ELP: BASELINE.byDevice.DPI };
	const byDevice = {};
	const rows = [];
	for (const [device, n] of Object.entries(CASES)) {
		byDevice[device] = [];
		for (let k = 0; k < n; k += 1) {
			const row = { qccStage: "改善前", device, drug: device, steps: {} };
			rows.push(row);
			byDevice[device].push(row);
		}
	}

	for (const [stepCode, { a, w }] of Object.entries(BASELINE.steps)) {
		if (a === 0) continue;
		const bucket = byDevice[stepCode.split("_")[0]] ?? [];
		for (let k = 0; k < a; k += 1) {
			if (bucket[k]) bucket[k].steps[stepCode] = k < w ? "錯誤" : "正確";
		}
	}
	return rows;
}
