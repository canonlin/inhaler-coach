/**
 * Require a condition to remain true for a clinically meaningful duration.
 *
 * Vision detectors occasionally miss a frame even while the action is still
 * correct, so a short dropout is bridged. A longer dropout resets the attempt.
 * Keeping this clock separate from the React render loop makes the behaviour
 * deterministic and unit-testable.
 */
export class SustainedGate {
	constructor({ requiredMs, dropoutGraceMs = 500 }) {
		if (!Number.isFinite(requiredMs) || requiredMs < 0) {
			throw new TypeError("requiredMs must be a non-negative number");
		}
		this.requiredMs = requiredMs;
		this.dropoutGraceMs = dropoutGraceMs;
		this.reset();
	}

	update(active, timestamp) {
		if (active) {
			if (this.startedAt === null) this.startedAt = timestamp;
			this.lastActiveAt = timestamp;
		} else if (
			this.lastActiveAt === null ||
			timestamp - this.lastActiveAt > this.dropoutGraceMs
		) {
			this.startedAt = null;
			this.lastActiveAt = null;
		}

		const elapsedMs =
			this.startedAt === null ? 0 : Math.max(0, timestamp - this.startedAt);
		return {
			active:
				active ||
				(this.lastActiveAt !== null &&
					timestamp - this.lastActiveAt <= this.dropoutGraceMs),
			elapsedMs,
			remainingMs: Math.max(0, this.requiredMs - elapsedMs),
			passed: elapsedMs >= this.requiredMs,
		};
	}

	reset() {
		this.startedAt = null;
		this.lastActiveAt = null;
	}
}
