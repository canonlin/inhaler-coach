/**
 * Detects pMDI actuations (the canister firing) from audio.
 *
 * Pressing the canister moves it a few millimetres, under the fingers doing the
 * pressing — close to the worst case for vision. But it fires a jet of
 * propellant, and that is loud, broadband, and lasts long enough to be
 * unmistakable. The published approach detects actuations from high-frequency
 * power with 99.7% accuracy (Sci Rep 2018, doi:10.1038/s41598-018-20523-w).
 *
 * Three conditions, all required:
 *
 *   1. High spectral flatness — the spray is noise-like. Voices and music are
 *      tonal and sit an order of magnitude lower. This is what survives a
 *      television playing in the room, which loudness alone cannot.
 *   2. High-frequency energy well above the room's own baseline. The threshold
 *      is a MULTIPLE of the running median, not a fixed number, so it adapts to
 *      the microphone, the room, and the background level.
 *   3. Sustained for at least MIN_DURATION_MS. A spray lasts ~50–300 ms; the
 *      clicks of handling the device are far shorter. Without this, setting the
 *      inhaler down registers as a dose.
 *
 * Measured 2026-07-15, one device, one room, with a video playing throughout:
 * 5 cued presses → 5 detected, 0 missed, 0 false positives. Single session,
 * single subject — the thresholds below are a starting point, not a validated
 * constant.
 */

/** Noise-like, not tonal. Background video peaked at 0.026, speech at 0.017. */
const MIN_FLATNESS = 0.05;

/** Multiples of the running baseline, so the room sets its own scale. */
const HIGH_BAND_MULTIPLE = 10;

/** A spray sustains; a click doesn't. Measured sprays ran 60–110 ms. */
const MIN_DURATION_MS = 50;

/** Gap tolerated inside one burst before it counts as over. */
const BURST_GAP_MS = 80;

/** Window the baseline is computed over. */
const BASELINE_MS = 3000;

/**
 * Ignore anything that follows a confirmed actuation this closely. A canister
 * needs time to repressurise, so two doses cannot physically land 500 ms apart —
 * and priming demands a 5-second shake between sprays anyway. Measured
 * 2026-07-15: a single physical event was counted twice within the same second
 * without this.
 */
const REFRACTORY_MS = 500;

export class ActuationDetector {
	constructor() {
		this.baseline = [];
		this.burst = null;
		this.events = [];
	}

	/**
	 * @param {{highBand:number, flatness:number}} sound - from AudioFeatures
	 * @param {number} timestamp
	 * @returns {boolean} true on the frame an actuation is confirmed
	 */
	update(sound, timestamp) {
		if (!sound) return false;

		const last = this.events.at(-1);
		if (last && timestamp - last.at < REFRACTORY_MS) {
			return false;
		}

		this.baseline.push({ v: sound.highBand, t: timestamp });
		this.baseline = this.baseline.filter((s) => s.t > timestamp - BASELINE_MS);

		const median = this.medianBaseline();
		if (median === null) return false;

		const loud = sound.highBand >= median * HIGH_BAND_MULTIPLE;
		const noiseLike = sound.flatness >= MIN_FLATNESS;

		if (loud && noiseLike) {
			if (!this.burst) {
				this.burst = { start: timestamp, end: timestamp };
			} else {
				this.burst.end = timestamp;
			}
			return false;
		}

		// Burst is over — was it long enough to be a spray?
		if (this.burst && timestamp - this.burst.end > BURST_GAP_MS) {
			const duration = this.burst.end - this.burst.start;
			this.burst = null;
			if (duration >= MIN_DURATION_MS) {
				this.events.push({ at: timestamp, duration });
				return true;
			}
		}

		return false;
	}

	/** The baseline must not be dragged up by the very bursts we're looking for,
	 * hence the median rather than the mean. */
	medianBaseline() {
		if (this.baseline.length < 20) return null;
		const sorted = this.baseline.map((s) => s.v).sort((a, b) => a - b);
		return sorted[Math.floor(sorted.length / 2)];
	}

	get count() {
		return this.events.length;
	}

	reset() {
		this.baseline = [];
		this.burst = null;
		this.events = [];
	}
}
