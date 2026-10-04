import assert from "node:assert/strict";
import test from "node:test";
import { CoachingStageEvaluator } from "../src/detection/coaching-stage-evaluator.js";
import { PressInhaleDetector } from "../src/steps/step3-press-inhale.js";
import { RINSE_RATIO, RinseDetector } from "../src/steps/step4-rinse.js";

function makePoseLandmarks(leftY, rightY, leftX = 0.35, rightX = 0.65, visibility = 0.95) {
	const landmarks = new Array(33).fill(null).map(() => ({ x: 0.5, y: 0.5, visibility: 0.9 }));
	landmarks[11] = { x: leftX, y: leftY, visibility };
	landmarks[12] = { x: rightX, y: rightY, visibility };
	return landmarks;
}

test("step3 bridges mouth landmark occlusion with memory grace", () => {
	const detector = new PressInhaleDetector();
	const device = { present: true, center: { x: 0.5, y: 0.5 }, steadiness: 0.8 };
	const mouthPoint = { x: 0.5, y: 0.5 };

	// 1. Initial lock at mouth
	const res1 = detector.detect({ device, mouthPoint, timestamp: 1000 });
	assert.equal(res1.atMouth, true);
	assert.equal(res1.pressing, true);

	// 2. Hand/inhaler occludes lips for 800ms (mouthPoint becomes null)
	const res2 = detector.detect({ device, mouthPoint: null, timestamp: 1800 });
	assert.equal(res2.atMouth, true, "atMouth should remain true within grace period");
	assert.equal(res2.pressing, true);

	// 3. Grace expires after 3000ms
	const res3 = detector.detect({ device, mouthPoint: null, timestamp: 4500 });
	assert.equal(res3.atMouth, false, "atMouth should expire after grace period");
});

test("step3 detects shoulder elevation during slow deep inhalation", () => {
	const detector = new PressInhaleDetector();
	const device = { present: true, center: { x: 0.5, y: 0.5 }, steadiness: 0.5 };
	const mouthPoint = { x: 0.5, y: 0.5 };

	// Warmup baseline shoulders at y = 0.60
	for (let t = 0; t < 500; t += 100) {
		detector.detect({ device, mouthPoint, poseLandmarks: makePoseLandmarks(0.60, 0.60), timestamp: t });
	}

	// Shoulders elevate during deep inhalation to y = 0.56
	let res = null;
	for (let t = 500; t <= 1500; t += 100) {
		res = detector.detect({
			device,
			mouthPoint,
			poseLandmarks: makePoseLandmarks(0.56, 0.56),
			timestamp: t,
		});
	}

	assert.equal(res.shoulder.isElevated, true);
	assert.equal(res.inhaling, true);
});

test("coaching stage evaluator guides user through inhale and breath hold with shoulder feedback", () => {
	const evaluator = new CoachingStageEvaluator({
		stageIdx: 3,
		inhaleSeconds: 3,
		holdSeconds: 5,
	});

	// Inhale phase: 3 seconds
	const correct = { ready: true, atMouth: true, steady: true, pressing: true, inhaling: true };
	for (let t = 0; t < 3000; t += 1000) {
		const evalRes = evaluator.evaluate(correct, t);
		assert.equal(evalRes.ok, false);
		assert.match(evalRes.msg, /深吸/);
	}

	// At 3000ms: Inhale completes, transitions to breath hold
	const holdStart = evaluator.evaluate(correct, 3000);
	assert.match(holdStart.msg, /憋氣 5 秒/);

	// At 5000ms (2s into hold): Normal breath hold
	const holding = evaluator.evaluate({ prematureExhale: false }, 5000);
	assert.match(holding.msg, /很好，請移開吸入器並憋氣 3 秒/);

	// At 6000ms (3s into hold): Premature exhale detected by shoulders dropping
	const dropping = evaluator.evaluate({ prematureExhale: true }, 6000);
	assert.match(dropping.msg, /注意請維持憋氣，不要提早吐氣/);

	// At 8000ms (5s hold complete): Stage passes!
	const completed = evaluator.evaluate({}, 8000);
	assert.equal(completed.ok, true);
	assert.match(completed.msg, /壓吸步驟完成/);
});

test("stage 4 rinse ratio matches clinical pharmacist measurements", () => {
	assert.equal(RINSE_RATIO, 2.2);

	const detector = new RinseDetector();
	// Ratio above 2.2 passes
	detector.update(2.5, 100);
	detector.update(2.8, 200);
	const res = detector.detect();
	assert.equal(res.rinsing, true);

	// Ratio below 2.2 (background motion) does not pass
	detector.reset();
	detector.update(1.2, 100);
	detector.update(1.4, 200);
	assert.equal(detector.detect().rinsing, false);
});

test("step3 passes with hand at mouth and shoulder kinematics when inhaler is not recognized", () => {
	const detector = new PressInhaleDetector();
	const mouthPoint = { x: 0.5, y: 0.35 };

	// Pose with right hand wrist (landmark 16) at mouth (0.5, 0.36) and shoulders at 0.60
	const makePoseWithHand = (shoulderY, wristY = 0.36) => {
		const lm = makePoseLandmarks(shoulderY, shoulderY);
		lm[16] = { x: 0.5, y: wristY, visibility: 0.95 }; // right wrist at mouth
		return lm;
	};

	// 1. Warmup baseline shoulders
	for (let t = 0; t < 500; t += 100) {
		detector.detect({
			device: null, // NO INHALER DETECTED
			mouthPoint,
			poseLandmarks: makePoseWithHand(0.60),
			timestamp: t,
		});
	}

	// 2. Shoulders elevate during deep inhalation
	let res = null;
	for (let t = 500; t <= 1500; t += 100) {
		res = detector.detect({
			device: null, // NO INHALER DETECTED
			mouthPoint,
			poseLandmarks: makePoseWithHand(0.55),
			timestamp: t,
		});
	}

	assert.equal(res.ready, true);
	assert.equal(res.atMouth, true);
	assert.equal(res.shoulder.isElevated, true);
	assert.equal(res.inhaling, true);
	assert.equal(res.pressing, true);
});
