/**
 * Detects pMDI actuations (presses) by analysing a COMPLETED step's window —
 * not continuously, frame by frame.
 *
 * That distinction is the whole reason this works. A press is a canister JERK
 * coincident with a faint audio ONSET. Trying to spot that continuously, in real
 * time, floods: the pharmacists wave the inhaler so erratically that the
 * background canister motion is near-maximum entropy (permutation entropy
 * 0.80–0.99, measured over five people), so a rolling detector has no calm
 * baseline to be surprised against and fires constantly. Every causal variant —
 * rolling z-threshold, product-of-z, rank-based joint surprisal — flooded.
 *
 * But coaching is STEP-BASED. The patient does "spray twice", the step ends, and
 * only then do we judge it. Given the whole step's buffer at once, we normalise
 * each signal against the entire window (its own median and spread) and look for
 * the moments where BOTH the audio onset and the canister jerk are jointly
 * extreme. Against the full-window baseline the two real presses stand out;
 * handling the device does not. On five people's real (wavy, faint) recordings
 * this found press activity in 3 of 5, with ~0 false positives on the
 * device-handling task — where the audio-only detector found 0 of ~10.
 *
 * The 2 of 5 it misses are the silent-and-smooth presses (no hiss the webcam can
 * hear, no jerk the waving doesn't drown). For 衛教 that is the right failure:
 * "沒偵測到，請確實按壓" is the correct coaching for a too-gentle press. Precision
 * (never miscount handling as a dose) is what matters; the recall gap teaches.
 *
 * Not yet validated on people outside these five — the collector re-run is to
 * VALIDATE this, not to gather more training data.
 */

/**
 * Product of the two z-scores required to call a moment a press. Calibrated on
 * five people (spray ~13 events across the set, ~0 on handling). It is a joint
 * bar: e.g. audio 2σ and jerk 1.5σ together clear it, either alone does not.
 */
const PRESS_THRESHOLD = 3.0;

/** Two actuations can't physically land closer than this (canister repressurise
 * time, and priming demands a 5 s shake between sprays anyway). */
const MIN_GAP_MS = 300;

/** Below these counts the window is too short to normalise meaningfully. */
const MIN_AUDIO = 30;
const MIN_DEVICE = 5;

/**
 * @param {Array<[number, number]>} audio  - [[tMs, highBandEnergy], ...]
 * @param {Array<[number, number|null]>} device - [[tMs, canisterY|null], ...]
 *   canisterY is the red canister's normalized vertical position (0..1), null
 *   when the tracker didn't see it.
 * @returns {{pressCount:number, events:Array<{t:number, score:number}>}}
 */
export function analyzePressWindow(audio, device) {
	if (audio.length < MIN_AUDIO || device.length < MIN_DEVICE) {
		return { pressCount: 0, events: [] };
	}

	// Audio onset: the ATTACK, not the level — a press is a rise in high-band
	// energy, and a rise survives a mic that can't hear the absolute loudness.
	const aT = audio.map((s) => s[0]);
	const aHi = audio.map((s) => s[1]);
	const onset = aHi.map((v, i) => Math.max(0, v - (i ? aHi[i - 1] : v)));

	// Canister jerk: |2nd difference| of vertical position. A press is a quick
	// down-up; slow waving contributes little to the 2nd derivative.
	const dT = device.map((s) => s[0]);
	const dY = fillNulls(device.map((s) => s[1]));
	if (!dY) return { pressCount: 0, events: [] };
	const jerk = dY.map((v, i) => {
		const a = dY[Math.max(0, i - 1)];
		const c = dY[Math.min(dY.length - 1, i + 1)];
		return Math.abs(c - 2 * v + a);
	});

	// Normalise each against the WHOLE window — this is what a rolling detector
	// cannot do, and why it works here.
	const onZ = zscore(onset);
	const jZ = zscore(jerk);

	// A press = both jointly extreme at the same instant. Walk the (denser) audio
	// timeline; read the canister jerk-z there by interpolation.
	const events = [];
	let lastAt = -Infinity;
	for (let i = 0; i < aT.length; i++) {
		const jz = interp(aT[i], dT, jZ);
		const comp = Math.max(0, onZ[i]) * Math.max(0, jz);
		if (comp >= PRESS_THRESHOLD && aT[i] - lastAt >= MIN_GAP_MS) {
			events.push({ t: aT[i], score: +comp.toFixed(2) });
			lastAt = aT[i];
		}
	}
	return { pressCount: events.length, events };
}

function median(xs) {
	const v = [...xs].sort((a, b) => a - b);
	const m = Math.floor(v.length / 2);
	return v.length % 2 ? v[m] : (v[m - 1] + v[m]) / 2;
}

function zscore(xs) {
	const med = median(xs);
	const mean = xs.reduce((a, b) => a + b, 0) / xs.length;
	const variance =
		xs.reduce((a, b) => a + (b - mean) ** 2, 0) / xs.length;
	const std = Math.sqrt(variance) || 1e-9;
	// Median-centred, std-scaled: median resists the presses themselves dragging
	// the centre up, std sets the scale from the whole window.
	return xs.map((x) => (x - med) / std);
}

/** Linear-interpolate a value at time `t` from series (ts, ys), clamped at ends. */
function interp(t, ts, ys) {
	if (t <= ts[0]) return ys[0];
	if (t >= ts[ts.length - 1]) return ys[ys.length - 1];
	let lo = 0;
	let hi = ts.length - 1;
	while (hi - lo > 1) {
		const mid = (lo + hi) >> 1;
		if (ts[mid] <= t) lo = mid;
		else hi = mid;
	}
	const span = ts[hi] - ts[lo] || 1;
	const w = (t - ts[lo]) / span;
	return ys[lo] + (ys[hi] - ys[lo]) * w;
}

/** Fill null gaps by linear interpolation between known values. Returns null if
 * there aren't enough real samples to trust. */
function fillNulls(ys) {
	const known = ys.map((v, i) => [i, v]).filter(([, v]) => v != null);
	if (known.length < 10) return null;
	const out = ys.slice();
	for (let k = 0; k < known.length; k++) {
		const [i, v] = known[k];
		out[i] = v;
	}
	// before first / after last known: hold
	for (let i = 0; i < known[0][0]; i++) out[i] = known[0][1];
	for (let i = known[known.length - 1][0] + 1; i < out.length; i++)
		out[i] = known[known.length - 1][1];
	// between knowns: linear
	for (let k = 0; k < known.length - 1; k++) {
		const [i0, v0] = known[k];
		const [i1, v1] = known[k + 1];
		for (let i = i0 + 1; i < i1; i++) {
			out[i] = v0 + ((v1 - v0) * (i - i0)) / (i1 - i0);
		}
	}
	return out;
}
