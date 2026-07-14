/**
 * Priming — the test sprays before the first use.
 *
 * 「Prime SYMBICORT before using for the first time by releasing two test sprays
 *   into the air away from the face, shaking well for 5 seconds before each
 *   spray.」 — Symbicort prescribing information (DailyMed).
 * Also required after 7 days of non-use, or if the inhaler has been dropped.
 *
 * The sequence IS the criterion. It is not "two sprays" — it is:
 *
 *     shake 5s → spray → shake 5s → spray
 *
 * and that ordering is what makes the detection trustworthy. Audio alone hears
 * a broadband hiss and cannot tell a dose from the sound of the inhaler being
 * set down on a table — measured 2026-07-15, handling the device produced
 * spray-like transients. Requiring that a spray arrive in the window that
 * follows a verified shake rejects those: nobody shakes for five seconds and
 * then puts the inhaler down.
 *
 * This is the multi-modal fusion the whole system is premised on. Audio says
 * *that* it fired; vision says it fired *in the right context*.
 */

export const PrimingPhase = {
	SHAKE_1: "shake_1",
	SPRAY_1: "spray_1",
	SHAKE_2: "shake_2",
	SPRAY_2: "spray_2",
	DONE: "done",
};

/**
 * How long after a completed shake a spray still counts. Long enough not to
 * rush the patient, short enough that unrelated noise later on doesn't land
 * inside the window.
 */
const SPRAY_WINDOW_MS = 10000;

export class PrimingDetector {
	constructor() {
		this.reset();
	}

	/**
	 * @param {{passed: boolean, shaking: boolean}} shake - from ShakeDetector
	 * @param {boolean} actuated - true on the frame an actuation is confirmed
	 * @param {number} timestamp
	 */
	update(shake, actuated, timestamp) {
		switch (this.phase) {
			case PrimingPhase.SHAKE_1:
				if (shake.passed) {
					this.phase = PrimingPhase.SPRAY_1;
					this.shakeCompletedAt = timestamp;
				}
				break;

			case PrimingPhase.SPRAY_1:
				if (actuated) {
					this.sprays++;
					this.phase = PrimingPhase.SHAKE_2;
					this.shakeCompletedAt = null;
				} else if (this.windowExpired(timestamp)) {
					// Took too long — the shake no longer vouches for this spray.
					this.phase = PrimingPhase.SHAKE_1;
					this.shakeCompletedAt = null;
					this.expired = true;
				}
				break;

			case PrimingPhase.SHAKE_2:
				if (shake.passed) {
					this.phase = PrimingPhase.SPRAY_2;
					this.shakeCompletedAt = timestamp;
				}
				break;

			case PrimingPhase.SPRAY_2:
				if (actuated) {
					this.sprays++;
					this.phase = PrimingPhase.DONE;
				} else if (this.windowExpired(timestamp)) {
					this.phase = PrimingPhase.SHAKE_2;
					this.shakeCompletedAt = null;
					this.expired = true;
				}
				break;

			default:
				break;
		}

		return this.status(timestamp);
	}

	windowExpired(timestamp) {
		return (
			this.shakeCompletedAt !== null &&
			timestamp - this.shakeCompletedAt > SPRAY_WINDOW_MS
		);
	}

	status(timestamp) {
		const waitingForSpray =
			this.phase === PrimingPhase.SPRAY_1 ||
			this.phase === PrimingPhase.SPRAY_2;

		return {
			phase: this.phase,
			sprays: this.sprays,
			done: this.phase === PrimingPhase.DONE,
			waitingForSpray,
			secondsLeftToSpray:
				waitingForSpray && this.shakeCompletedAt !== null
					? Math.max(
							0,
							(SPRAY_WINDOW_MS - (timestamp - this.shakeCompletedAt)) / 1000,
						)
					: null,
			/** True once, after a spray window lapsed — the caller can nudge the user. */
			expired: this.takeExpired(),
		};
	}

	takeExpired() {
		const was = this.expired;
		this.expired = false;
		return was;
	}

	reset() {
		this.phase = PrimingPhase.SHAKE_1;
		this.sprays = 0;
		this.shakeCompletedAt = null;
		this.expired = false;
	}
}
