import { periodicity } from "../detection/periodicity.js";

/**
 * Shake detection, by periodicity of motion in the hand region.
 *
 * Two earlier approaches failed, and the way each failed is what led here.
 *
 * 1. Track the wrist landmark, look for oscillation. BlazePose's wrist carries
 *    no trace of the shake at all — measured 2026-07-15, its spectrum while
 *    genuinely shaking was indistinguishable from its spectrum while holding
 *    still (peak power 0.0134 vs 0.0166). Shaking an inhaler is a small fast
 *    wrist motion and a temporally-smoothed landmark doesn't resolve it.
 *    Everything the landmark showed was tracking jitter.
 *
 * 2. Threshold the amount of pixel motion in the hand region. This works on the
 *    recording you tuned it against and nowhere else. Same person, same action,
 *    two sessions: still read 7.3 then 13–15; shaking read 10.4 then 25–35. The
 *    second session's STILL exceeds the first session's SHAKING. Lighting and
 *    camera distance move the scale by 3×, and a bigger hand, a closer camera or
 *    a gentler shake would move it again. Any constant tuned there is over-fitted
 *    to one person in one room.
 *
 * What survives all of that is that SHAKING IS PERIODIC — it repeats, whoever is
 * doing it and however hard. Sensor noise doesn't repeat. Deliberate slow
 * movement doesn't repeat. So this measures repetition (normalized
 * autocorrelation, dimensionless, 0..1) rather than size, which is the frequency-
 * estimation approach the hand-tremor literature actually uses (arXiv 1809.03218).
 *
 * There is no energy threshold anywhere in here, by design.
 *
 * The clinical target is a DURATION: 「shaking well for 5 seconds before each
 * spray」 (Symbicort prescribing information). Note this differs from the generic
 * pMDI teaching (「上下搖動 4-5 次」, a count) — the product label wins.
 */

/**
 * How strongly the motion must repeat. Dimensionless: 1 is a perfect sine, 0 is
 * noise. Not a magnitude, so it does not inherit the scale problems above.
 */
const MIN_PERIODICITY = 0.3;

/**
 * Analysis window. 2000 ms was too short: during an uninterrupted shake the
 * estimate itself flickered, dipping below threshold for 1.5–2 s at a time, so
 * the "sustained" clock kept resetting and the step could never pass. Measured
 * over a real shake, a 2 s window accumulated at most 2.2 s of detection; a 3 s
 * window reached 6.8 s.
 */
const WINDOW_MS = 3000;

/** Shaking must persist this long before the step passes (Symbicort label). */
const REQUIRED_SUSTAINED_MS = 5000;

/** Brief dropouts shouldn't reset the clock — the hand model loses a fast-moving
 * hand routinely, and that is precisely when the user is doing it right. */
const DROPOUT_GRACE_MS = 1500;

const SAMPLE_RATE_HZ = 30;

export class ShakeDetector {
	constructor() {
		this.samples = [];
		this.shakingSince = null;
		this.lastShakingAt = null;
	}

	/**
	 * @param {{hand:number}} motion - motion energy in the hand region
	 * @param {number} timestamp
	 */
	update(motion, timestamp) {
		this.samples.push({ e: motion.hand, t: timestamp });
		this.samples = this.samples.filter((s) => s.t > timestamp - WINDOW_MS);
	}

	detect(timestamp) {
		const analysis = this.analyse();

		if (analysis.shaking) {
			if (this.shakingSince === null) this.shakingSince = timestamp;
			this.lastShakingAt = timestamp;
		} else if (
			this.lastShakingAt !== null &&
			timestamp - this.lastShakingAt > DROPOUT_GRACE_MS
		) {
			this.shakingSince = null;
			this.lastShakingAt = null;
		}

		const sustainedMs =
			this.shakingSince === null ? 0 : timestamp - this.shakingSince;

		return {
			...analysis,
			sustainedMs,
			secondsHeld: sustainedMs / 1000,
			passed: sustainedMs >= REQUIRED_SUSTAINED_MS,
			requiredSeconds: REQUIRED_SUSTAINED_MS / 1000,
		};
	}

	analyse() {
		if (this.samples.length < 20) {
			return { shaking: false, periodicity: 0, shakeHz: null };
		}

		const { periodicity: strength, dominantHz } = periodicity(
			this.resample(),
			SAMPLE_RATE_HZ,
		);

		return {
			shaking: strength >= MIN_PERIODICITY,
			periodicity: strength,
			// The energy signal peaks twice per shake cycle, so the shake itself is
			// half the dominant frequency of the signal.
			shakeHz: dominantHz === null ? null : dominantHz / 2,
		};
	}

	/** Frames arrive unevenly (inference drops them), so interpolate onto a
	 * uniform grid before looking for repetition. */
	resample() {
		const first = this.samples[0].t;
		const last = this.samples.at(-1).t;
		const count = Math.floor(((last - first) / 1000) * SAMPLE_RATE_HZ);
		const out = [];

		let j = 0;
		for (let i = 0; i < count; i++) {
			const t = first + (i * 1000) / SAMPLE_RATE_HZ;
			while (j < this.samples.length - 2 && this.samples[j + 1].t < t) j++;
			const a = this.samples[j];
			const b = this.samples[j + 1] ?? a;
			const span = b.t - a.t;
			const w = span === 0 ? 0 : Math.max(0, Math.min(1, (t - a.t) / span));
			out.push(a.e + (b.e - a.e) * w);
		}
		return out;
	}

	reset() {
		this.samples = [];
		this.shakingSince = null;
		this.lastShakingAt = null;
	}
}
