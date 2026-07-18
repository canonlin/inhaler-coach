/**
 * Detects breathing (the exhale step, and in principle the inhale) from a
 * completed step's video — by watching the CHEST, and the blood in the face.
 *
 * The first attempt concluded exhale was unsensable on a webcam. That was wrong,
 * and instructively so: it measured the head and the hand. Respiration barely
 * moves the head; it moves the TORSO. The contactless-respiration literature has
 * measured chest motion for years (production systems hit <3 breaths/min error),
 * and rPPG reads the breathing modulation straight out of the skin's blood volume.
 * Switching to those turned 0/5 exhales detected into 4/5.
 *
 * The real channel is CHEST MOTION — vertical motion in a torso ROI, band-passed
 * to the breathing band (0.1–0.6 Hz ≈ 6–36 breaths/min). On five people it detects
 * the exhale in 4/5 (amplitude 2–9× the still baseline), missing only a genuinely
 * shallow breather — for whom "breathe out more fully" is the correct coaching.
 *
 * The forehead rPPG (microvascular blood volume) channel was investigated and is
 * NOT trustworthy here, so it is reported for telemetry but does not drive the
 * decision. Checked directly: the forehead PULSE — which must be present if the
 * blood-volume signal is real — comes out at SNR ~2 even at full 640×360 / 27 fps
 * with a CHROM/POS estimator, i.e. essentially noise. Three reasons, all
 * structural: the surgical mask hides the cheeks (the best rPPG skin), leaving
 * only the small forehead; the pharmacists move while holding the inhaler; and
 * the VP9 recording compresses away the sub-1% colour changes rPPG depends on.
 * A breathing-band forehead signal here is therefore mostly motion/lighting, not
 * blood — so it stays out of `detected`. (Micro-expression is not applicable:
 * breathing is not a facial expression; its facial signature IS rPPG, which is
 * dead here.)
 *
 * Like the press analyzer, this judges a COMPLETED step, not a live stream — the
 * exhale step is a bounded window, and normalising against the whole window is
 * what makes a weak periodic signal legible.
 *
 * Validated on the five-pharmacist recordings; the collector re-run validates on
 * new people. The chest ROI is anchored on the blue surgical mask (a rock-solid
 * colour anchor here); a different setting needs its own head anchor.
 */

/** Breathing band: 6–36 breaths/min. */
const BAND_LO_HZ = 0.1;
const BAND_HI_HZ = 0.6;

/** A channel counts as breathing if its band amplitude clears this multiple of
 * the still baseline. Calibrated on five people (chest exhale/still 2–9×). */
const OVER_BASELINE = 2.0;

/** With no baseline, fall back to shape: a plausible rate AND enough repetition. */
const MIN_PERIODICITY = 0.4;

/**
 * @param {number[]} chest - torso vertical-motion signal over the step
 * @param {number[]} green - forehead mean-green (rPPG) over the step
 * @param {number} fps - sampling rate of both series
 * @param {{chest:number, green:number}|null} baseline - band amplitudes measured
 *   during a quiet moment; enables the robust relative test.
 * @returns {{detected:boolean, rateBpm:number,
 *            chest:{amplitude:number,rateBpm:number,periodicity:number},
 *            rppg:{amplitude:number,rateBpm:number,periodicity:number}}}
 */
export function analyzeRespiration(chest, green, fps, baseline = null) {
	const c = respirationMetrics(chest, fps);
	const g = respirationMetrics(green, fps);

	// Decision is CHEST-only — the forehead rPPG here is motion/lighting, not
	// blood volume (see header), so it informs but does not decide.
	let detected;
	if (baseline) {
		detected = c.amplitude > OVER_BASELINE * Math.max(baseline.chest, 0.05);
	} else {
		detected =
			c.rateBpm >= 6 && c.rateBpm <= 40 && c.periodicity >= MIN_PERIODICITY;
	}

	return { detected, rateBpm: c.rateBpm, chest: c, rppg: g };
}

export function respirationMetrics(x, fps) {
	if (!x || x.length < fps * 3) {
		return { amplitude: 0, rateBpm: 0, periodicity: 0 };
	}
	const banded = bandpass(x, fps);
	const amplitude = std(banded);
	const { periodicity, lag } = autocorrPeak(banded, fps);
	const rateBpm = lag ? (fps / lag) * 60 : 0;
	return { amplitude, rateBpm, periodicity };
}

/** Band-pass to the breathing band with two moving averages: subtract a long one
 * (high-pass, kills slow drift below BAND_LO) then smooth with a short one
 * (low-pass, kills pulse/jitter above BAND_HI). No FFT — the windows are short. */
function bandpass(x, fps) {
	const hpWin = Math.round(fps / (2 * BAND_LO_HZ)); // ~5 s
	const lpWin = Math.max(1, Math.round(fps / (2 * BAND_HI_HZ))); // ~0.8 s
	const hp = x.map((v, i) => v - movAvg(x, i, hpWin));
	return hp.map((_, i) => movAvg(hp, i, lpWin));
}

/** Centred moving average at index i over a window of `w` samples. */
function movAvg(x, i, w) {
	const half = w >> 1;
	let lo = i - half;
	let hi = i + half;
	if (lo < 0) lo = 0;
	if (hi > x.length - 1) hi = x.length - 1;
	let s = 0;
	for (let k = lo; k <= hi; k++) s += x[k];
	return s / (hi - lo + 1);
}

/** Strongest autocorrelation peak within the breathing lag range, 0..1. */
function autocorrPeak(x, fps) {
	const n = x.length;
	const mean = x.reduce((a, b) => a + b, 0) / n;
	const c = x.map((v) => v - mean);
	const den = c.reduce((a, b) => a + b * b, 0) || 1e-9;
	const loLag = Math.floor(fps / BAND_HI_HZ);
	const hiLag = Math.min(n - 4, Math.floor(fps / BAND_LO_HZ));
	let best = { periodicity: 0, lag: 0 };
	for (let lag = loLag; lag <= hiLag; lag++) {
		let num = 0;
		for (let i = 0; i < n - lag; i++) num += c[i] * c[i + lag];
		const r = num / den;
		if (r > best.periodicity) best = { periodicity: r, lag };
	}
	return best;
}

function std(x) {
	const mean = x.reduce((a, b) => a + b, 0) / x.length;
	const v = x.reduce((a, b) => a + (b - mean) ** 2, 0) / x.length;
	return Math.sqrt(v);
}
