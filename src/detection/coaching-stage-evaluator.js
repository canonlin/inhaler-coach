import { SustainedGate } from "./sustained-gate.js";

function secondsLeft(milliseconds) {
	return Math.max(1, Math.ceil(milliseconds / 1000));
}

/**
 * Pure coaching state machine for the four live-practice stages.
 *
 * Landmark extraction and model inference stay in the browser loop. This class
 * only decides what the latest observation means over time, which lets the
 * clinical sequence and learner-facing wording be tested without React, a
 * camera, or model files.
 */
export class CoachingStageEvaluator {
	constructor({
		stageIdx,
		passSeconds = 0,
		inhaleSeconds = 0,
		holdSeconds = 0,
		dropoutGraceMs = 600,
	}) {
		this.stageIdx = stageIdx;
		this.passMs = Math.max(0, Number(passSeconds) * 1000);
		this.inhaleMs = Math.max(0, Number(inhaleSeconds) * 1000);
		this.holdMs = Math.max(0, Number(holdSeconds) * 1000);
		this.dropoutGraceMs = dropoutGraceMs;
		this.reset();
	}

	evaluate(observation = {}, timestamp) {
		switch (this.stageIdx) {
			case 1:
				return this.evaluateShake(observation);
			case 2:
				return this.evaluateExhale(observation, timestamp);
			case 3:
				return this.evaluatePressAndHold(observation, timestamp);
			case 4:
				return this.evaluateRinse(observation, timestamp);
			default:
				return { ok: true, msg: "檢測完成" };
		}
	}

	evaluateShake(observation) {
		const ratio = observation.ratio ?? 0;
		const held = observation.secondsHeld ?? 0;
		const required = observation.requiredSeconds ?? 5;
		return {
			ok: observation.passed ?? false,
			msg: observation.passed
				? `動作正確！已搖動 ${held.toFixed(1)} 秒`
				: observation.observable === false && held > 0
					? `動作暫停，已保留進度（${held.toFixed(1)} / ${required} 秒）`
					: observation.targetAcquired === false ||
							observation.inhalerPresent === false
						? "請讓吸入器完整出現在畫面中，再持續上下搖動"
						: observation.targetAcquired === true &&
								observation.observable === false
							? "已鎖定吸入器，請持續完成上下往返"
							: ratio > 0
								? `搖動偵測中（${held.toFixed(1)} / ${required} 秒）`
								: "請拿起吸入器，持續上下搖動",
		};
	}

	evaluateExhale(observation, timestamp) {
		const ready =
			observation.ready ??
			observation.targetAcquired ??
			observation.faceAcquired ??
			false;
		const shrugging = observation.shrugging ?? false;
		const atMouth = observation.atMouth ?? false;
		const exhaling =
			ready &&
			!shrugging &&
			!atMouth &&
			(observation.exhaling ?? observation.awayLocked ?? false);

		if (!ready) {
			this.actionGate.reset();
			return {
				ok: false,
				msg: observation.framingMsg || "請讓臉部與雙肩完整出現在畫面中",
			};
		}

		if (atMouth) {
			this.actionGate.reset();
			return {
				ok: false,
				msg: "請將吸入器移離嘴邊，不要含著吸嘴吐氣",
			};
		}

		if (shrugging) {
			return {
				ok: false,
				msg: "請放鬆雙肩慢慢吐氣，不要聳肩",
			};
		}

		const progress = this.actionGate.update(exhaling, timestamp);
		return {
			ok: progress.passed,
			msg: progress.passed
				? "吐氣引導完成！接著再將吸嘴放入口中"
				: exhaling
					? `姿勢正確，請放鬆雙肩慢慢吐氣 ${secondsLeft(progress.remainingMs)} 秒`
					: "請緩慢深吐氣，放鬆雙肩將肺部排空",
		};
	}

	evaluatePressAndHold(observation, timestamp) {
		if (this.holdStartedAt !== null) {
			const remainingMs = Math.max(
				0,
				this.holdMs - (timestamp - this.holdStartedAt),
			);
			const holdGuidance = observation.prematureExhale
				? `注意請維持憋氣，不要提早吐氣（剩餘 ${secondsLeft(remainingMs)} 秒）`
				: `很好，請移開吸入器並憋氣 ${secondsLeft(remainingMs)} 秒（以舒適為限）`;

			return {
				ok: remainingMs === 0,
				msg:
					remainingMs === 0
						? "壓吸步驟完成，憋氣倒數也完成了！"
						: holdGuidance,
			};
		}

		const isActuating = (observation.pressing ?? false) || (observation.inhaling ?? false);
		const progress = this.inhaleGate.update(
			isActuating,
			timestamp,
		);
		if (progress.passed) this.holdStartedAt = timestamp;

		return {
			ok: this.holdMs === 0 && progress.passed,
			msg: progress.passed
				? `壓吸完成，請移開吸入器並憋氣 ${secondsLeft(this.holdMs)} 秒（以舒適為限）`
				: !observation.ready
					? "請讓臉部和吸入器都保持在畫面中"
					: !observation.atMouth
						? "請將吸嘴放入口中"
						: !observation.steady
							? "位置正確，請保持吸入器穩定"
							: `請同步按壓並緩慢深吸 ${secondsLeft(progress.remainingMs)} 秒`,
		};
	}

	evaluateRinse(observation, timestamp) {
		const progress = this.actionGate.update(
			observation.rinsing ?? false,
			timestamp,
		);
		return {
			ok: progress.passed,
			msg: progress.passed
				? "漱口完成！記得把水吐掉"
				: !observation.facePresent
					? "請讓臉部完整出現在畫面中"
					: progress.active
						? `偵測到漱口動作，請繼續 ${secondsLeft(progress.remainingMs)} 秒`
						: "請含水漱口，讓臉頰與嘴部持續動作",
		};
	}

	reset() {
		this.actionGate = new SustainedGate({
			requiredMs: this.passMs,
			dropoutGraceMs: this.dropoutGraceMs,
		});
		this.inhaleGate = new SustainedGate({
			requiredMs: this.inhaleMs,
			dropoutGraceMs: this.dropoutGraceMs,
		});
		this.holdStartedAt = null;
	}
}
