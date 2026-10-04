import assert from "node:assert/strict";
import test from "node:test";

import { CoachingStageEvaluator } from "../src/detection/coaching-stage-evaluator.js";
import { ExhaleDetector } from "../src/steps/step2-exhale.js";

const makePose = (shoulderY, visibility = 0.9, span = 0.2) => [
	...Array(11).fill({ x: 0.5, y: 0.5, visibility }),
	{ x: 0.5 - span / 2, y: shoulderY, visibility }, // 11 left shoulder
	{ x: 0.5 + span / 2, y: shoulderY, visibility }, // 12 right shoulder
];

test("Stage 2 exhale: passes 3 seconds with relaxed shoulders and no inhaler required", () => {
	const detector = new ExhaleDetector();
	const evaluator = new CoachingStageEvaluator({
		stageIdx: 2,
		passSeconds: 3,
	});

	const pose = makePose(0.6); // relaxed shoulders at y=0.6

	// Frame 0: Baseline acquired, exhale starts
	let det = detector.detect({
		poseLandmarks: pose,
		mouthPoint: { x: 0.5, y: 0.3 },
		timestamp: 1000,
	});
	assert.equal(det.ready, true);
	assert.equal(det.exhaling, true);
	assert.equal(det.shrugging, false);

	let evalRes = evaluator.evaluate(det, 1000);
	assert.equal(evalRes.ok, false);
	assert.match(evalRes.msg, /放鬆雙肩慢慢吐氣 3 秒/);

	// Advance 2 seconds
	det = detector.detect({
		poseLandmarks: pose,
		mouthPoint: { x: 0.5, y: 0.3 },
		timestamp: 3000,
	});
	evalRes = evaluator.evaluate(det, 3000);
	assert.equal(evalRes.ok, false);
	assert.match(evalRes.msg, /放鬆雙肩慢慢吐氣 1 秒/);

	// Advance to 3+ seconds: Stage completes successfully
	det = detector.detect({
		poseLandmarks: pose,
		mouthPoint: { x: 0.5, y: 0.3 },
		timestamp: 4100,
	});
	evalRes = evaluator.evaluate(det, 4100);
	assert.equal(evalRes.ok, true);
	assert.match(evalRes.msg, /吐氣引導完成/);
});

test("Stage 2 exhale: shrugging suspends exhale countdown with corrective feedback", () => {
	const detector = new ExhaleDetector();
	const evaluator = new CoachingStageEvaluator({
		stageIdx: 2,
		passSeconds: 3,
	});

	const normalPose = makePose(0.6);
	// Warmup baseline
	for (let i = 0; i < 5; i++) {
		detector.detect({ poseLandmarks: normalPose, timestamp: 1000 + i * 100 });
	}

	// 1 second of normal exhale
	let det = detector.detect({
		poseLandmarks: normalPose,
		timestamp: 2000,
	});
	let evalRes = evaluator.evaluate(det, 2000);
	assert.equal(evalRes.ok, false);

	// User shrugs shoulders (shoulders lift upward: y goes from 0.6 to 0.52)
	const shruggedPose = makePose(0.52);
	det = detector.detect({
		poseLandmarks: shruggedPose,
		timestamp: 2500,
	});
	assert.equal(det.shrugging, true);
	assert.equal(det.exhaling, false);

	evalRes = evaluator.evaluate(det, 2500);
	assert.equal(evalRes.ok, false);
	assert.match(evalRes.msg, /不要聳肩/);
});

test("Stage 2 exhale: warns when inhaler is held directly in front of mouth", () => {
	const detector = new ExhaleDetector();
	const evaluator = new CoachingStageEvaluator({
		stageIdx: 2,
		passSeconds: 3,
	});

	const normalPose = makePose(0.6);
	const mouthPoint = { x: 0.5, y: 0.3 };
	const inhalerAtMouth = {
		present: true,
		center: { x: 0.51, y: 0.31 }, // right at mouth
	};

	const det = detector.detect({
		poseLandmarks: normalPose,
		mouthPoint,
		device: inhalerAtMouth,
		timestamp: 1000,
	});
	assert.equal(det.atMouth, true);
	assert.equal(det.exhaling, false);

	const evalRes = evaluator.evaluate(det, 1000);
	assert.equal(evalRes.ok, false);
	assert.match(evalRes.msg, /不要含著吸嘴吐氣/);
});
