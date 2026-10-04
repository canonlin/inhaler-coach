/**
 * Stage 1 is a two-state coaching detector, not a continuous object detector.
 *
 * 1. ACQUIRE: ONNX must see the inhaler once. That locks the target for this
 *    attempt; motion blur is expected during mixing, so later ONNX misses never
 *    revoke the lock. Retry/reset starts a fresh acquisition.
 * 2. MIX: the primary signal is the hand/device POSITION PATH over three seconds.
 *    Meaningful vertical range, total travel and complete reversals accept the
 *    pharmacist's normal deliberate speed without any velocity floor. A 30 fps
 *    spatially-normalized motion/flow detector remains only as a faster fallback.
 *
 * Evidence must accumulate for five seconds. Tracking outages freeze progress;
 * a visible sustained non-shake resets it. This verifies only the visible proxy
 * of sustained up-and-down mixing—it cannot prove the formulation is chemically
 * homogeneous.
 */

/**
 * Fast-path fallback: how far the hand region stands above the background.
 * Dimensionless (hand motion ÷ background motion), so it does not inherit the
 * cross-session scale problem. Set to 8 to include the weak (gentle / wrist-only /
 * limited-mobility) shakes the protocol cares most about: a still hand sits at
 * ratio 2 across all five people, weak shakes at 6–26, so 8 keeps a 4× margin
 * over still while catching them. Slow deliberate movement does not use this
 * threshold; it is evaluated from the tracked position path below.
 */
const RATIO_SHAKE = 8;

/**
 * The instantaneous ratio is noisy frame to frame, so the "shaking right now"
 * decision is the MEDIAN ratio over a short trailing window rather than any
 * single sample. This threshold was calibrated near 28–30 fps and is invalid at
 * the old inference-bound ~3 fps. Low-rate input therefore fails closed instead
 * of pretending the same ratio has the same meaning.
 */
const SMOOTH_MS = 1000;

/** A one-second window must contain enough samples to prove the high-rate
 * motion sampler is actually running. */
const MIN_SAMPLES = 20;
const MIN_SAMPLE_RATE_HZ = 20;
const MIN_OBSERVED_SAMPLES = 8;

/** Vertical shake must dominate horizontal motion and reverse direction. The
 * flow grid is fixed at 96×96, so these values are in grid cells per sample. */
const MIN_DIRECTIONAL_FLOW = 0.05;
const VERTICAL_DOMINANCE_RATIO = 1.1;
const MIN_VERTICAL_SHARE = 0.55;
const MIN_VERTICAL_REVERSALS = 2;

/** Slow, deliberate shaking is better represented by the tracked device/hand
 * path than by per-frame energy. This path deliberately has no speed floor: it
 * asks for a meaningful vertical range, total travel and complete reversals. */
const POSITION_WINDOW_MS = 3000;
const MIN_POSITION_SAMPLES = 5;
const MIN_POSITION_DURATION_MS = 1000;
const POSITION_JITTER = 0.004;
const MIN_HALF_STROKE = 0.025;
const MIN_VERTICAL_RANGE = 0.055;
const MIN_VERTICAL_TRAVEL = 0.16;
const POSITION_VERTICAL_DOMINANCE = 1.1;
const MIN_POSITION_REVERSALS = 2;

/** Shaking must persist this long before the step passes (Symbicort label). */
const REQUIRED_SUSTAINED_MS = 5000;

/** A visible non-shake is contrary evidence and resets progress after this
 * grace. A tracking outage is not contrary evidence: progress freezes instead
 * and is retained for a bounded period so model flicker cannot erase real work. */
const OBSERVED_FAILURE_RESET_MS = 1500;
const UNOBSERVED_RESET_MS = 10_000;

export class ShakeDetector {
	constructor() {
		this.samples = [];
		this.positionSamples = { hand: [], inhaler: [] };
		this.targetAcquired = false;
		this.targetAcquiredAt = null;
		this.progressMs = 0;
		this.lastDetectAt = null;
		this.lastShakingAt = null;
		this.observedFailureSince = null;
		this.unobservedSince = null;
	}

	/**
	 * @param {{hand:number, background:number, ratio:number, flowX?:number, flowY?:number, observed?:boolean}} motion - from MotionEnergy
	 * @param {number} timestamp
	 */
	update(motion, timestamp) {
		this.samples.push({
			r: motion.ratio,
			x: motion.flowX ?? 0,
			y: motion.flowY ?? 0,
			observed: motion.observed ?? true,
			t: timestamp,
		});
		this.samples = this.samples.filter((s) => s.t > timestamp - SMOOTH_MS);
	}

	observeInhaler(timestamp) {
		if (!Number.isFinite(timestamp)) return;
		this.targetAcquired = true;
		if (this.targetAcquiredAt === null) this.targetAcquiredAt = timestamp;
	}

	updatePosition(position, timestamp, source = "hand") {
		if (
			!position ||
			!Number.isFinite(position.x) ||
			!Number.isFinite(position.y) ||
			!Number.isFinite(timestamp)
		) {
			return;
		}
		const key = source === "inhaler" ? "inhaler" : "hand";
		const samples = this.positionSamples[key];
		const previous = samples.at(-1);
		if (previous?.t === timestamp) {
			previous.x = position.x;
			previous.y = position.y;
		} else if (!previous || timestamp > previous.t) {
			samples.push({ x: position.x, y: position.y, t: timestamp });
		}
		this.positionSamples[key] = samples.filter(
			(sample) => sample.t > timestamp - POSITION_WINDOW_MS,
		);
	}

	detect(timestamp) {
		const analysis = this.analyse(timestamp);
		const elapsedSinceDetect =
			this.lastDetectAt === null
				? 0
				: Math.max(0, Math.min(500, timestamp - this.lastDetectAt));
		this.lastDetectAt = timestamp;

		if (analysis.shaking) {
			this.progressMs += elapsedSinceDetect;
			this.lastShakingAt = timestamp;
			this.observedFailureSince = null;
			this.unobservedSince = null;
		} else if (analysis.observable) {
			this.unobservedSince = null;
			if (this.observedFailureSince === null) {
				this.observedFailureSince = timestamp;
			}
			if (timestamp - this.observedFailureSince > OBSERVED_FAILURE_RESET_MS) {
				this.progressMs = 0;
				this.lastShakingAt = null;
			}
		} else {
			if (this.unobservedSince === null) this.unobservedSince = timestamp;
			if (timestamp - this.unobservedSince > UNOBSERVED_RESET_MS) {
				this.progressMs = 0;
				this.lastShakingAt = null;
				this.observedFailureSince = null;
			}
		}

		const passed = analysis.shaking && this.progressMs >= REQUIRED_SUSTAINED_MS;
		return {
			...analysis,
			sustainedMs: this.progressMs,
			secondsHeld: this.progressMs / 1000,
			passed,
			phase: passed
				? "complete"
				: analysis.shaking
					? "mixing"
					: !analysis.targetAcquired
						? "acquiring"
						: "ready",
			requiredSeconds: REQUIRED_SUSTAINED_MS / 1000,
		};
	}

	analyse(timestamp = this.samples.at(-1)?.t ?? 0) {
		const first = this.samples[0];
		const last = this.samples.at(-1);
		const elapsedMs = first && last ? last.t - first.t : 0;
		const sampleRateHz =
			elapsedMs > 0 ? ((this.samples.length - 1) * 1000) / elapsedMs : 0;

		const sampleRateValid =
			this.samples.length >= MIN_SAMPLES && sampleRateHz >= MIN_SAMPLE_RATE_HZ;
		const observed = sampleRateValid
			? this.samples.filter((sample) => sample.observed)
			: [];
		const motionObservable =
			sampleRateValid &&
			!!last?.observed &&
			observed.length >= MIN_OBSERVED_SAMPLES;
		const ratio = motionObservable ? median(observed.map((s) => s.r)) : 0;
		const directional = motionObservable
			? observed.filter(
					(sample) => Math.hypot(sample.x, sample.y) >= MIN_DIRECTIONAL_FLOW,
				)
			: [];
		const vertical = directional.filter(
			(sample) =>
				Math.abs(sample.y) >= MIN_DIRECTIONAL_FLOW &&
				Math.abs(sample.y) >= Math.abs(sample.x) * VERTICAL_DOMINANCE_RATIO,
		);
		const verticalShare = directional.length
			? vertical.length / directional.length
			: 0;
		const verticalFlow = vertical.length
			? median(vertical.map((sample) => Math.abs(sample.y)))
			: 0;

		let verticalReversals = 0;
		let previousSign = 0;
		for (const sample of vertical) {
			const sign = Math.sign(sample.y);
			if (previousSign !== 0 && sign !== previousSign) verticalReversals++;
			previousSign = sign;
		}

		const motionShaking =
			motionObservable &&
			ratio >= RATIO_SHAKE &&
			verticalFlow >= MIN_DIRECTIONAL_FLOW &&
			verticalShare >= MIN_VERTICAL_SHARE &&
			verticalReversals >= MIN_VERTICAL_REVERSALS;
		const trajectory = this.analyseTrajectory(timestamp);

		// Signal hierarchy: Hand/device vertical shaking is the primary signal.
		// Inhaler recognition (targetAcquired) is a secondary weak signal.
		// Shaking with hands or practice device must NOT be permanently failed.
		const isShaking = motionShaking || trajectory.shaking;
		const isObservable = motionObservable || trajectory.observable;

		return {
			shaking: isShaking,
			observable: isObservable,
			targetAcquired: this.targetAcquired,
			// Kept as a compatibility field for the evaluator and existing logs. It
			// means "acquired for this attempt", not "redetected this frame".
			inhalerPresent: this.targetAcquired,
			ratio,
			sampleRateHz,
			verticalFlow,
			verticalShare,
			verticalReversals,
			trajectoryShaking: trajectory.shaking,
			trajectorySource: trajectory.source,
			positionVerticalRange: trajectory.verticalRange,
			positionVerticalTravel: trajectory.verticalTravel,
			positionVerticalReversals: trajectory.reversals,
		};
	}

	analyseTrajectory(timestamp) {
		let best = {
			shaking: false,
			observable: false,
			source: null,
			verticalRange: 0,
			verticalTravel: 0,
			reversals: 0,
			score: 0,
		};

		for (const source of ["inhaler", "hand"]) {
			const raw = this.positionSamples[source].filter(
				(sample) => sample.t > timestamp - POSITION_WINDOW_MS,
			);
			if (raw.length < MIN_POSITION_SAMPLES) continue;
			const durationMs = raw.at(-1).t - raw[0].t;
			if (durationMs < MIN_POSITION_DURATION_MS) continue;

			// Three-point smoothing rejects landmark shimmer without erasing the
			// slower path we are deliberately trying to admit.
			const samples = raw.map((sample, index) => {
				const group = raw.slice(Math.max(0, index - 1), index + 2);
				return {
					x: median(group.map((item) => item.x)),
					y: median(group.map((item) => item.y)),
					t: sample.t,
				};
			});
			const ys = samples.map((sample) => sample.y);
			const verticalRange = Math.max(...ys) - Math.min(...ys);
			let verticalTravel = 0;
			let horizontalTravel = 0;
			let reversals = 0;
			let direction = 0;
			let halfStroke = 0;

			for (let index = 1; index < samples.length; index++) {
				const dx = samples[index].x - samples[index - 1].x;
				const dy = samples[index].y - samples[index - 1].y;
				if (Math.abs(dx) >= POSITION_JITTER) {
					horizontalTravel += Math.abs(dx);
				}
				if (Math.abs(dy) < POSITION_JITTER) continue;
				verticalTravel += Math.abs(dy);
				const sign = Math.sign(dy);
				if (direction === 0 || sign === direction) {
					direction = sign;
					halfStroke += Math.abs(dy);
				} else {
					if (halfStroke >= MIN_HALF_STROKE) reversals++;
					direction = sign;
					halfStroke = Math.abs(dy);
				}
			}

			const verticalDominance =
				verticalTravel / Math.max(horizontalTravel, POSITION_JITTER);
			const shaking =
				verticalRange >= MIN_VERTICAL_RANGE &&
				verticalTravel >= MIN_VERTICAL_TRAVEL &&
				verticalDominance >= POSITION_VERTICAL_DOMINANCE &&
				reversals >= MIN_POSITION_REVERSALS;
			const score =
				verticalRange + verticalTravel + reversals * MIN_HALF_STROKE;
			if (score > best.score) {
				best = {
					shaking,
					observable: true,
					source,
					verticalRange,
					verticalTravel,
					reversals,
					score,
				};
			}
		}

		return best;
	}

	reset() {
		this.samples = [];
		this.positionSamples = { hand: [], inhaler: [] };
		this.targetAcquired = false;
		this.targetAcquiredAt = null;
		this.progressMs = 0;
		this.lastDetectAt = null;
		this.lastShakingAt = null;
		this.observedFailureSince = null;
		this.unobservedSince = null;
	}
}

function median(values) {
	const v = [...values].sort((a, b) => a - b);
	const mid = Math.floor(v.length / 2);
	return v.length % 2 ? v[mid] : (v[mid - 1] + v[mid]) / 2;
}
