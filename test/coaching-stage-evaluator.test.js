import assert from "node:assert/strict";
import test from "node:test";

import { CoachingStageEvaluator } from "../src/detection/coaching-stage-evaluator.js";

test("shake guidance reports progress and completion", () => {
	const evaluator = new CoachingStageEvaluator({ stageIdx: 1 });
	assert.match(evaluator.evaluate({}, 0).msg, /持續上下搖動/);
	assert.match(
		evaluator.evaluate({ ratio: 10, secondsHeld: 2, requiredSeconds: 5 }, 0)
			.msg,
		/2\.0 \/ 5 秒/,
	);
	assert.match(
		evaluator.evaluate(
			{
				observable: false,
				secondsHeld: 2,
				requiredSeconds: 5,
			},
			0,
		).msg,
		/已保留進度（2\.0 \/ 5 秒）/,
	);
	assert.equal(
		evaluator.evaluate({ passed: true, secondsHeld: 5 }, 0).ok,
		true,
	);
});

test("exhale requires visible inputs and the full configured duration", () => {
	const evaluator = new CoachingStageEvaluator({
		stageIdx: 2,
		passSeconds: 3,
	});
	assert.match(evaluator.evaluate({ ready: false }, 0).msg, /臉部完整/);
	assert.match(
		evaluator.evaluate({ ready: true, atMouth: true }, 100).msg,
		/移離嘴邊/,
	);
	assert.equal(
		evaluator.evaluate({ ready: true, exhaling: true }, 1000).ok,
		false,
	);
	assert.equal(
		evaluator.evaluate({ ready: true, exhaling: true }, 3999).ok,
		false,
	);
	assert.equal(
		evaluator.evaluate({ ready: true, exhaling: true }, 4000).ok,
		true,
	);
	assert.match(
		evaluator.evaluate({ ready: true, exhaling: true }, 4000).msg,
		/吐氣引導完成/,
	);
});

test("exhale posture lock keeps the timed guidance alive through model dropout", () => {
	const evaluator = new CoachingStageEvaluator({
		stageIdx: 2,
		passSeconds: 3,
	});
	evaluator.evaluate(
		{ faceAcquired: true, targetAcquired: true, awayLocked: true },
		0,
	);
	evaluator.evaluate(
		{ faceAcquired: true, targetAcquired: true, awayLocked: true },
		1500,
	);
	assert.equal(
		evaluator.evaluate(
			{ faceAcquired: true, targetAcquired: true, awayLocked: true },
			3000,
		).ok,
		true,
	);
});

test("press stage enforces inhale before starting breath hold", () => {
	const evaluator = new CoachingStageEvaluator({
		stageIdx: 3,
		inhaleSeconds: 4,
		holdSeconds: 5,
	});
	const correct = { ready: true, atMouth: true, steady: true, pressing: true };
	assert.equal(evaluator.evaluate(correct, 0).ok, false);
	assert.match(evaluator.evaluate(correct, 3999).msg, /深吸 1 秒/);
	assert.match(evaluator.evaluate(correct, 4000).msg, /憋氣 5 秒/);
	assert.equal(evaluator.evaluate({}, 8999).ok, false);
	assert.equal(evaluator.evaluate({}, 9000).ok, true);
});

test("press guidance distinguishes framing, position and steadiness", () => {
	const evaluator = new CoachingStageEvaluator({
		stageIdx: 3,
		inhaleSeconds: 4,
	});
	assert.match(evaluator.evaluate({ ready: false }, 0).msg, /保持在畫面中/);
	assert.match(
		evaluator.evaluate({ ready: true, atMouth: false }, 1).msg,
		/放入口中/,
	);
	assert.match(
		evaluator.evaluate({ ready: true, atMouth: true, steady: false }, 2).msg,
		/保持吸入器穩定/,
	);
});

test("rinse requires face visibility and sustained detected motion", () => {
	const evaluator = new CoachingStageEvaluator({
		stageIdx: 4,
		passSeconds: 3,
	});
	assert.match(evaluator.evaluate({ facePresent: false }, 0).msg, /臉部完整/);
	assert.equal(
		evaluator.evaluate({ facePresent: true, rinsing: true }, 1000).ok,
		false,
	);
	assert.equal(
		evaluator.evaluate({ facePresent: true, rinsing: true }, 4000).ok,
		true,
	);
});
