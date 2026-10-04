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

	const restingPose = makePose(0.58);
	const exhalePose = makePose(0.62);

	// Baseline resting pose
	detector.detect({
		poseLandmarks: restingPose,
		mouthPoint: { x: 0.5, y: 0.3 },
		timestamp: 500,
	});
	detector.detect({
		poseLandmarks: restingPose,
		mouthPoint: { x: 0.5, y: 0.3 },
		timestamp: 1000,
	});

	// Frame 1: Active exhalation relaxation drop begins
	let det = detector.detect({
		poseLandmarks: exhalePose,
		mouthPoint: { x: 0.5, y: 0.3 },
		timestamp: 1500,
	});
	assert.equal(det.ready, true);
	assert.equal(det.exhaling, true);
	assert.equal(det.shrugging, false);

	let evalRes = evaluator.evaluate(det, 1500);
	assert.equal(evalRes.ok, false);
	assert.match(evalRes.msg, /放鬆雙肩慢慢吐氣 3 秒/);

	// Advance 2 seconds of sustained exhalation
	det = detector.detect({
		poseLandmarks: exhalePose,
		mouthPoint: { x: 0.5, y: 0.3 },
		timestamp: 3500,
	});
	evalRes = evaluator.evaluate(det, 3500);
	assert.equal(evalRes.ok, false);
	assert.match(evalRes.msg, /放鬆雙肩慢慢吐氣 1 秒/);

	// Advance to 3+ seconds: Stage completes successfully
	det = detector.detect({
		poseLandmarks: exhalePose,
		mouthPoint: { x: 0.5, y: 0.3 },
		timestamp: 4600,
	});
	evalRes = evaluator.evaluate(det, 4600);
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

test("Stage 2 exhale: rejects close-up cropped shoulders and prompts to step back", () => {
	const detector = new ExhaleDetector();
	const evaluator = new CoachingStageEvaluator({
		stageIdx: 2,
		passSeconds: 3,
	});

	// Shoulders cut off at bottom edge (y = 0.90 > 0.85)
	const closeCropPose = makePose(0.90);
	for (let t = 0; t <= 10000; t += 100) {
		const det = detector.detect({
			poseLandmarks: closeCropPose,
			timestamp: t,
		});
		assert.equal(det.ready, false);
		assert.equal(det.shoulder.framed, false);
		assert.match(det.framingMsg, /距離鏡頭太近/);

		const evalRes = evaluator.evaluate(det, t);
		assert.equal(evalRes.ok, false);
		assert.match(evalRes.msg, /距離鏡頭太近/);
	}
});

test("Stage 2 exhale: motionless sitting never accumulates exhalation progress", () => {
	const detector = new ExhaleDetector();
	const evaluator = new CoachingStageEvaluator({
		stageIdx: 2,
		passSeconds: 3,
	});

	const stillPose = makePose(0.60);
	// User sits still for 10 seconds (100 frames at 10 FPS)
	for (let t = 0; t <= 10000; t += 100) {
		const det = detector.detect({
			poseLandmarks: stillPose,
			timestamp: t,
		});
		const evalRes = evaluator.evaluate(det, t);
		assert.equal(
			evalRes.ok,
			false,
			`Must not pass Stage 2 exhalation while sitting motionless at t=${t}ms`,
		);
		assert.equal(det.exhaling, false);
	}
});

test("Stage 2 exhale: shoulder kinematics is strong signal, hand/inhaler is weak secondary signal", () => {
	const detector = new ExhaleDetector();
	const evaluator = new CoachingStageEvaluator({
		stageIdx: 2,
		passSeconds: 3,
	});

	const normalPose = makePose(0.6);
	const exhalePose = makePose(0.66);

	// Warmup baseline with NO inhaler in hand
	for (let i = 0; i < 5; i++) {
		detector.detect({
			poseLandmarks: normalPose,
			timestamp: 1000 + i * 100,
			device: null,
		});
	}

	// 1. Weak signal absent (no device in hand): strong shoulder signal still drives exhalation
	let det = detector.detect({
		poseLandmarks: exhalePose,
		timestamp: 2000,
		device: null,
	});
	assert.equal(det.deviceInHand, false);
	assert.equal(det.exhaling, true);
	assert.equal(det.atMouth, false);
	let evalRes = evaluator.evaluate(det, 2000);
	assert.equal(evalRes.ok, false); // still counting down

	// 2. Weak signal present away from mouth: exhalation continues without interruption
	det = detector.detect({
		poseLandmarks: exhalePose,
		timestamp: 3500,
		device: { present: true, center: { x: 0.2, y: 0.7 } },
	});
	assert.equal(det.deviceInHand, true);
	assert.equal(det.exhaling, true);
	assert.equal(det.atMouth, false);
	evalRes = evaluator.evaluate(det, 3500);
	assert.equal(evalRes.ok, false);

	// 3. Weak signal disappears again: exhalation is NOT disrupted and completes
	det = detector.detect({
		poseLandmarks: exhalePose,
		timestamp: 5100,
		device: null,
	});
	assert.equal(det.deviceInHand, false);
	assert.equal(det.exhaling, true);
	evalRes = evaluator.evaluate(det, 5100);
	assert.equal(evalRes.ok, true, "Exhale completes based on strong shoulder signal");
});
