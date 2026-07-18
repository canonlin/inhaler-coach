/**
 * Shake detection, by how far hand-region motion stands above the background.
 *
 * The history matters, because the obvious answers were each tried and each
 * failed for a specific, measured reason:
 *
 * 1. Track the wrist landmark, look for oscillation. BlazePose's wrist carries
 *    no trace of the shake — measured 2026-07-15, its spectrum while genuinely
 *    shaking was indistinguishable from its spectrum while holding still. A
 *    temporally-smoothed landmark can't resolve a small fast wrist motion.
 *
 * 2. Threshold raw pixel motion in the hand region. Not comparable across
 *    sessions — lighting and camera distance move the absolute scale by 3×, so a
 *    still hand in one room reads higher than a shaking hand in another.
 *
 * 3. Measure periodicity (autocorrelation), on the theory that shaking repeats
 *    and noise doesn't. This is what used to live here — and it was calibrated
 *    against data that, we later found, was sampled at only ~3 fps because
 *    MediaPipe inference bottlenecked the capture loop. A 3–5 Hz shake sampled at
 *    3 fps is below Nyquist: it aliases to noise. On five pharmacists' recordings
 *    (2026-07-18) the periodicity estimate for a motionless hand actually beat
 *    the estimate for a real shake. The signal it depended on was never there.
 *
 * What does survive, on those same five people, is fix #2's scale problem solved
 * the way motion-energy.js already solves it: a SPATIAL baseline. The ratio of
 * hand-region motion to the same frame's background is dimensionless and stable
 * across lighting and distance, because sensor noise lands on both equally.
 * Pooled over five people, the sustained-median ratio was:
 *
 *              still    shaking (normal / hard)
 *   ratio      ~5–13         ~50–130
 *
 * with one catch that only surfaced when the ratio was recomputed frame-by-frame
 * from the 30 fps video instead of the 3 fps signal log: THE THRESHOLD DEPENDS ON
 * THE SAMPLING RATE. At 3 fps, 300 ms passes between frames, so even a slow
 * translation ("move the inhaler without shaking it") displaces the hand far
 * enough to read ratio ~100 — indistinguishable from a shake. At ~28 fps the same
 * translation reads ~10 while a real shake still reads ~50–70, because now the
 * per-frame change reflects instantaneous velocity and a shake is simply faster.
 * Recomputed at 28 fps over five people (motion-energy.js exactly, from video):
 *
 *              still   move   handle/exhale/speak   shake normal/hard
 *   ratio        2    ~10          ~2–8                 ~50–70
 *
 * So this detector is only valid when motion is sampled at a high, fixed rate —
 * see the fixed-interval loop in app.js that feeds it, decoupled from inference
 * for exactly this reason.
 *
 * On the threshold there is a real clinical choice, made deliberately. A high
 * threshold (~32) sits above every negative INCLUDING the collector's "move"
 * stress-test and passes only vigorous shaking — but it misses gentle and
 * wrist-only shakes, and the protocol flags exactly those as most important: a
 * frail or arthritic patient CANNOT shake vigorously, and their genuine weak
 * shake must still count. Failing them and saying "shake harder" is wrong when
 * they physically can't. Measured over five people, still sits at ratio 2
 * (person-invariant) and weak shakes at 6–26, so a threshold of 8 recovers the
 * weak shakes (gentle 4/5, limited 4/5) while keeping a 4× margin over a still
 * hand. The cost: a SUSTAINED non-shaking movement would also pass — but that is
 * the unrealistic "move" case (nobody translates an inhaler for five continuous
 * seconds during a "please shake" prompt), while the real negative here, holding
 * still, is rejected with margin. The 5-second sustained requirement below is the
 * guard against incidental motion.
 *
 * The remaining criterion is a DURATION: 「shaking well for 5 seconds before each
 * spray」 (Symbicort prescribing information). Note this differs from the generic
 * pMDI teaching (「上下搖動 4-5 次」, a count) — the product label wins.
 */

/**
 * How far the hand region must stand above the background to count as shaking.
 * Dimensionless (hand motion ÷ background motion), so it does not inherit the
 * cross-session scale problem. Set to 8 to include the weak (gentle / wrist-only /
 * limited-mobility) shakes the protocol cares most about: a still hand sits at
 * ratio 2 across all five people, weak shakes at 6–26, so 8 keeps a 4× margin
 * over still while catching them. See the header for the clinical trade-off (this
 * also passes a sustained non-shaking "move", which does not occur in a real
 * shake step). Only valid at a high sampling rate — see the fixed-rate loop.
 */
const RATIO_SHAKE = 8;

/**
 * The instantaneous ratio is noisy frame to frame, so the "shaking right now"
 * decision is the MEDIAN ratio over a short trailing window rather than any
 * single sample. 1000 ms is the smallest window that still holds enough samples
 * to take a median when the capture loop is degraded to ~3 fps (which it is when
 * inference bottlenecks the main thread — the whole reason the collected data
 * came out at 3 fps); at a healthy 30 fps it holds thirty, and either way it
 * responds well within the 5 s the sustained clock needs.
 */
const SMOOTH_MS = 1000;

/** Need at least this many samples in the window before trusting the median.
 * Two is the floor a ~3 fps rig can guarantee inside SMOOTH_MS. */
const MIN_SAMPLES = 2;

/** Shaking must persist this long before the step passes (Symbicort label). */
const REQUIRED_SUSTAINED_MS = 5000;

/** Brief dropouts shouldn't reset the clock — the hand model loses a fast-moving
 * hand routinely, and that is precisely when the user is doing it right. */
const DROPOUT_GRACE_MS = 1500;

export class ShakeDetector {
	constructor() {
		this.samples = [];
		this.shakingSince = null;
		this.lastShakingAt = null;
	}

	/**
	 * @param {{hand:number, background:number, ratio:number}} motion - from MotionEnergy
	 * @param {number} timestamp
	 */
	update(motion, timestamp) {
		this.samples.push({ r: motion.ratio, t: timestamp });
		this.samples = this.samples.filter((s) => s.t > timestamp - SMOOTH_MS);
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
		if (this.samples.length < MIN_SAMPLES) {
			return { shaking: false, ratio: 0 };
		}
		const ratio = median(this.samples.map((s) => s.r));
		return { shaking: ratio >= RATIO_SHAKE, ratio };
	}

	reset() {
		this.samples = [];
		this.shakingSince = null;
		this.lastShakingAt = null;
	}
}

function median(values) {
	const v = [...values].sort((a, b) => a - b);
	const mid = Math.floor(v.length / 2);
	return v.length % 2 ? v[mid] : (v[mid - 1] + v[mid]) / 2;
}
