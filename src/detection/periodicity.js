/**
 * Periodicity of a signal, by normalized autocorrelation.
 *
 * This exists because thresholding on motion *magnitude* does not generalise.
 * Measured on one person across two sessions, the same still hand read 7.3 and
 * 13–15, and the same shake read 10.4 and 25–35 — lighting and camera distance
 * move the scale by 3×. Any absolute threshold tuned on one recording is
 * over-fitted to that recording, that person, that room. A bigger hand, a closer
 * camera, or a gentler shake breaks it.
 *
 * What does not vary is that SHAKING IS PERIODIC. Whoever holds the inhaler,
 * however hard they shake it, the motion repeats. Sensor noise never repeats.
 * Slow deliberate movement never repeats. So measure repetition, not size.
 *
 * Normalized autocorrelation is dimensionless: r = 1 is perfectly periodic,
 * r ≈ 0 is noise. It is invariant to amplitude, and therefore to lighting, skin
 * tone, distance, and how vigorously the person shakes. This is the frequency-
 * estimation approach the hand-tremor literature validates against accelerometry
 * (arXiv 1809.03218; smartphone video tremor frequency MAE 0.229 Hz).
 */

/**
 * Motion energy peaks twice per shake cycle — once on each pass through maximum
 * velocity — so a 2–6 Hz shake shows up at 4–12 Hz in this signal. Search wider
 * than that on both sides rather than assume how fast someone shakes.
 */
const MIN_HZ = 2;
const MAX_HZ = 12;

/**
 * @param {number[]} signal - uniformly sampled, evenly spaced
 * @param {number} sampleRateHz
 * @returns {{periodicity: number, dominantHz: number|null}}
 *   periodicity 0..1 — how strongly the signal repeats.
 */
export function periodicity(signal, sampleRateHz) {
	if (signal.length < 16) return { periodicity: 0, dominantHz: null };

	// Remove the linear trend, not just the mean.
	//
	// Subtracting the mean alone leaves slow drift in — the hand wandering within
	// the region while it shakes — and drift dominates the autocorrelation at long
	// lags. Measured 2026-07-15: with only mean removal, a vigorous 3.8 Hz shake
	// reported 1.0 Hz, the very bottom of the search band, because the correlation
	// peak had been dragged to the edge by the trend rather than the shake.
	const x = detrend(signal);

	const energy = x.reduce((a, v) => a + v * v, 0);
	if (energy === 0) return { periodicity: 0, dominantHz: null };

	const minLag = Math.max(2, Math.floor(sampleRateHz / MAX_HZ));
	const maxLag = Math.min(
		Math.floor(x.length / 2),
		Math.ceil(sampleRateHz / MIN_HZ),
	);
	if (maxLag <= minLag) return { periodicity: 0, dominantHz: null };

	const r = [];
	for (let lag = 0; lag <= maxLag; lag++) {
		let sum = 0;
		for (let n = 0; n + lag < x.length; n++) {
			sum += x[n] * x[n + lag];
		}
		r.push(sum / energy);
	}

	// Skip past the first local minimum before looking for a peak.
	//
	// Without this, slow smooth movement scores as highly as shaking: a signal
	// that merely drifts still correlates with a slightly-delayed copy of itself,
	// so r stays high at short lags. What distinguishes repetition is that r
	// falls and then RISES again. A monotonic decay has no such peak, and is what
	// drift and noise both look like.
	let lag = minLag;
	while (lag < maxLag && r[lag + 1] < r[lag]) lag++;

	let bestLag = null;
	let best = 0;
	for (let l = lag; l <= maxLag; l++) {
		if (r[l] > best) {
			best = r[l];
			bestLag = l;
		}
	}

	if (bestLag === null || best <= 0) {
		return { periodicity: 0, dominantHz: null };
	}

	// A peak sitting on the edge of the search range isn't a peak — it's the
	// correlation still climbing where we stopped looking, which is what
	// unremoved drift looks like. Refuse to report it as a period.
	if (bestLag >= maxLag) {
		return { periodicity: 0, dominantHz: null };
	}

	return {
		periodicity: best,
		dominantHz: sampleRateHz / bestLag,
	};
}

/** Least-squares removal of mean and slope. */
function detrend(signal) {
	const n = signal.length;
	let sumX = 0;
	let sumY = 0;
	let sumXY = 0;
	let sumXX = 0;
	for (let i = 0; i < n; i++) {
		sumX += i;
		sumY += signal[i];
		sumXY += i * signal[i];
		sumXX += i * i;
	}
	const denom = n * sumXX - sumX * sumX;
	const slope = denom === 0 ? 0 : (n * sumXY - sumX * sumY) / denom;
	const intercept = (sumY - slope * sumX) / n;
	return signal.map((v, i) => v - (slope * i + intercept));
}
