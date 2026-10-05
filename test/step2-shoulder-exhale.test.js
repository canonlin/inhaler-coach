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

test("Stage 2 exhale: detects 頭偏 (Head Turned/Tilted) exhalation with lateral head rotation", () => {
	const detector = new ExhaleDetector();
	const evaluator = new CoachingStageEvaluator({
		stageIdx: 2,
		passSeconds: 3,
	});

	const span = 0.25;
	const makeHeadPose = (shoulderY, headX, headY) => {
		const lm = Array(33).fill(null);
		lm[0] = { x: headX, y: headY, visibility: 0.95 }; // Nose
		lm[11] = { x: 0.5 - span / 2, y: shoulderY, visibility: 0.9 }; // Left shoulder
		lm[12] = { x: 0.5 + span / 2, y: shoulderY, visibility: 0.9 }; // Right shoulder
		return lm;
	};

	// 1. User sits straight before exhaling (nose x=0.5, y=0.3, shoulders y=0.54)
	for (let t = 0; t < 1000; t += 100) {
		detector.detect({
			poseLandmarks: makeHeadPose(0.54, 0.50, 0.30),
			timestamp: t,
		});
	}

	// 2. User turns head sideways to exhale away from inhaler (頭偏: nose x moves to 0.54, delta x / span = 0.04 / 0.25 = 0.16)
	// and relaxes shoulders down (y = 0.548, yDrop = 0.008 / 0.25 = 0.032 >= 0.020)
	let passed = false;
	for (let t = 1000; t <= 5000; t += 100) {
		const det = detector.detect({
			poseLandmarks: makeHeadPose(0.548, 0.54, 0.30),
			timestamp: t,
		});
		assert.equal(det.ready, true);
		if (t >= 1300) {
			assert.equal(det.exhaling, true, `Should detect exhaleActive during head turn at t=${t}`);
		}

		const evalRes = evaluator.evaluate(det, t);
		if (evalRes.ok) {
			passed = true;
			break;
		}
	}
	assert.equal(passed, true, "頭偏 exhalation must successfully pass Stage 2");
});

test("Stage 2 exhale: detects 頭正 (Head Straight) exhalation facing camera forward", () => {
	const detector = new ExhaleDetector();
	const evaluator = new CoachingStageEvaluator({
		stageIdx: 2,
		passSeconds: 3,
	});

	const span = 0.25;
	const makeHeadPose = (shoulderY, headX, headY) => {
		const lm = Array(33).fill(null);
		lm[0] = { x: headX, y: headY, visibility: 0.95 }; // Nose
		lm[11] = { x: 0.5 - span / 2, y: shoulderY, visibility: 0.9 }; // Left shoulder
		lm[12] = { x: 0.5 + span / 2, y: shoulderY, visibility: 0.9 }; // Right shoulder
		return lm;
	};

	// 1. User sits straight before exhaling (nose x=0.5, y=0.3, shoulders y=0.54)
	for (let t = 0; t < 1000; t += 100) {
		detector.detect({
			poseLandmarks: makeHeadPose(0.54, 0.50, 0.30),
			timestamp: t,
		});
	}

	// 2. User exhales facing camera (頭正: nose stays centered x=0.50, shoulders drop y=0.553, yDrop = 0.013 / 0.25 = 0.052 spans >= 0.040)
	let passed = false;
	for (let t = 1000; t <= 5000; t += 100) {
		const det = detector.detect({
			poseLandmarks: makeHeadPose(0.553, 0.50, 0.30),
			timestamp: t,
		});
		assert.equal(det.ready, true);
		if (t >= 1300) {
			assert.equal(det.exhaling, true, `Should detect exhaleActive during head straight at t=${t}`);
		}

		const evalRes = evaluator.evaluate(det, t);
		if (evalRes.ok) {
			passed = true;
			break;
		}
	}
	assert.equal(passed, true, "頭正 exhalation must successfully pass Stage 2");
});

function makeFaceMesh({ pursed = false } = {}) {
	const face = Array(468).fill(null).map(() => ({ x: 0.5, y: 0.5, z: 0 }));
	// Outer eye corners: 33 (left), 263 (right) -> eyeSpan = 0.30
	face[33] = { x: 0.35, y: 0.30, z: 0 };
	face[263] = { x: 0.65, y: 0.30, z: 0 };

	if (pursed) {
		// Pursed lips (縮唇吐氣): narrowed mouth corners, rounded opening
		face[61] = { x: 0.46, y: 0.45, z: 0 };
		face[291] = { x: 0.54, y: 0.45, z: 0 };
		face[13] = { x: 0.50, y: 0.43, z: 0 };
		face[14] = { x: 0.50, y: 0.47, z: 0 };
	} else {
		// Normal resting mouth: wide mouth corners, closed lips
		face[61] = { x: 0.40, y: 0.45, z: 0 };
		face[291] = { x: 0.60, y: 0.45, z: 0 };
		face[13] = { x: 0.50, y: 0.45, z: 0 };
		face[14] = { x: 0.50, y: 0.452, z: 0 };
	}
	return face;
}

test("Stage 2 exhale: quiet sitting motionless does NOT pass without exhalation action", () => {
	const detector = new ExhaleDetector();
	const evaluator = new CoachingStageEvaluator({
		stageIdx: 2,
		passSeconds: 3,
	});

	const steadyPose = makePose(0.55);

	let passed = false;
	for (let t = 0; t <= 10000; t += 100) {
		const det = detector.detect({
			poseLandmarks: steadyPose,
			mouthPoint: { x: 0.5, y: 0.45 },
			timestamp: t,
		});

		assert.equal(det.ready, true);
		assert.equal(det.exhaling, false);

		const evalRes = evaluator.evaluate(det, t);
		if (evalRes.ok) {
			passed = true;
			break;
		}
	}
	assert.equal(passed, false, "Quiet sitting motionless must never pass Stage 2");
});

test("Stage 2 exhale: detects 頭偏 (Head Turned/Tilted) exhalation without requiring shoulder drop", () => {
	const detector = new ExhaleDetector();
	const evaluator = new CoachingStageEvaluator({
		stageIdx: 2,
		passSeconds: 2,
	});

	const span = 0.25;
	const makeHeadPose = (shoulderY, headX, headY) => {
		const lm = Array(33).fill(null);
		lm[0] = { x: headX, y: headY, visibility: 0.95 }; // Nose
		lm[11] = { x: 0.5 - span / 2, y: shoulderY, visibility: 0.9 }; // Left shoulder
		lm[12] = { x: 0.5 + span / 2, y: shoulderY, visibility: 0.9 }; // Right shoulder
		return lm;
	};

	// Baseline centered posture at steady shoulder level y=0.55
	for (let t = 0; t < 1000; t += 100) {
		detector.detect({
			poseLandmarks: makeHeadPose(0.55, 0.50, 0.25),
			timestamp: t,
		});
	}

	// User turns head to the side (nose moves from x=0.50 to x=0.58, headTurnRange = 0.08 / 0.25 = 0.32 >= 0.045)
	// Shoulders stay level (y=0.55, yDrop = 0)
	let passed = false;
	for (let t = 1000; t <= 4000; t += 100) {
		const det = detector.detect({
			poseLandmarks: makeHeadPose(0.55, 0.58, 0.25),
			timestamp: t,
		});
		assert.equal(det.ready, true);
		if (t >= 1300) {
			assert.equal(det.exhaling, true, `Should detect exhalation during head turn at t=${t}`);
		}

		const evalRes = evaluator.evaluate(det, t);
		if (evalRes.ok) {
			passed = true;
			break;
		}
	}
	assert.equal(passed, true, "Head turned exhalation without shoulder drop must pass Stage 2");
});

test("Stage 2 exhale: real-time exhalation progression pauses when exhalation stops and completes when resumed", () => {
	const detector = new ExhaleDetector();
	const evaluator = new CoachingStageEvaluator({
		stageIdx: 2,
		passSeconds: 2,
		dropoutGraceMs: 800,
	});

	const normalPose = makePose(0.60);
	const exhalePose = makePose(0.66);

	// Baseline warmup
	for (let t = 0; t <= 500; t += 100) {
		detector.detect({
			poseLandmarks: normalPose,
			timestamp: t,
		});
	}

	// Phase 1: Exhale via shoulder relaxation drop for 1.0 second (t=600 to 1600)
	for (let t = 600; t <= 1600; t += 100) {
		const det = detector.detect({
			poseLandmarks: exhalePose,
			timestamp: t,
		});
		const evalRes = evaluator.evaluate(det, t);
		assert.equal(evalRes.ok, false);
		assert.match(evalRes.msg, /放鬆雙肩/);
	}

	// Phase 2: User pauses exhalation (shoulders back up at t=1700 to t=2100, within dropout grace)
	for (let t = 1700; t <= 2100; t += 100) {
		const det = detector.detect({
			poseLandmarks: normalPose,
			timestamp: t,
		});
		const evalRes = evaluator.evaluate(det, t);
		assert.equal(evalRes.ok, false);
	}

	// Phase 3: User resumes shoulder drop exhalation from t=2200 to t=4000 -> completes!
	let passed = false;
	for (let t = 2200; t <= 4000; t += 100) {
		const det = detector.detect({
			poseLandmarks: exhalePose,
			timestamp: t,
		});
		const evalRes = evaluator.evaluate(det, t);
		if (evalRes.ok) {
			passed = true;
			assert.match(evalRes.msg, /吐氣引導完成/);
			break;
		}
	}
	assert.equal(passed, true, "Exhalation accumulation must resume and complete");
});

test("Stage 2 exhale: realistic resting human posture with subtle head sway NEVER passes", () => {
	const detector = new ExhaleDetector();
	const evaluator = new CoachingStageEvaluator({
		stageIdx: 2,
		passSeconds: 3,
	});

	let passed = false;
	for (let t = 0; t <= 6000; t += 100) {
		// Simulate natural subtle human head sway (jitter ±0.008)
		const swayX = 0.50 + 0.008 * Math.sin(t / 500);
		const swayPose = [
			{ x: swayX, y: 0.25, visibility: 0.99 }, // nose
			...Array(10).fill({ x: 0.5, y: 0.5, visibility: 0.5 }),
			{ x: 0.35, y: 0.55, visibility: 0.99 }, // left shoulder
			{ x: 0.65, y: 0.55, visibility: 0.99 }, // right shoulder
		];

		const det = detector.detect({
			poseLandmarks: swayPose,
			mouthPoint: { x: 0.5, y: 0.45 },
			timestamp: t,
		});

		assert.equal(det.exhaling, false);

		const evalRes = evaluator.evaluate(det, t);
		if (evalRes.ok) {
			passed = true;
			break;
		}
	}
	assert.equal(passed, false, "Realistic resting posture with natural head sway must NEVER pass Stage 2");
});



