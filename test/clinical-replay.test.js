import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { CoachingStageEvaluator } from "../src/detection/coaching-stage-evaluator.js";
import { ExhaleDetector } from "../src/steps/step2-exhale.js";
import { PressInhaleDetector } from "../src/steps/step3-press-inhale.js";

const datasetPath = path.resolve("training/shoulder_kinematics_1150806.json");

test("clinical replay: 5/5 real pharmacists pass stage 2 with 0 false positives on normal breathing", () => {
	if (!fs.existsSync(datasetPath)) {
		return;
	}

	const data = JSON.parse(fs.readFileSync(datasetPath, "utf8"));
	const sessions = [...new Set(data.map((d) => d.session))];

	assert.equal(sessions.length, 5, "Expected 5 pharmacists in 1150806 dataset");

	// 1. Positive cohort: exhale
	let passedExhale = 0;
	for (const sess of sessions) {
		const detector = new ExhaleDetector();
		const evaluator = new CoachingStageEvaluator({
			stageIdx: 2,
			passSeconds: 2,
			dropoutGraceMs: 800,
		});
		const frames = data
			.filter((d) => d.session === sess && d.task === "exhale")
			.sort((a, b) => a.timestamp_ms - b.timestamp_ms);

		const t0 = frames[0].timestamp_ms;
		let passed = false;

		for (const f of frames) {
			const relT = f.timestamp_ms - t0;
			const span = f.shoulder_span || 0.3;
			const lm = new Array(33).fill(null);
			lm[0] = { x: f.nose_x, y: f.nose_y, visibility: 0.99 };
			lm[11] = {
				x: f.shoulder_x - span / 2,
				y: f.shoulder_y,
				visibility: f.ls_conf,
			};
			lm[12] = {
				x: f.shoulder_x + span / 2,
				y: f.shoulder_y,
				visibility: f.rs_conf,
			};

			const detRes = detector.detect({
				poseLandmarks: lm,
				timestamp: relT,
			});
			const evalRes = evaluator.evaluate(detRes, relT);
			if (evalRes.ok) {
				passed = true;
				break;
			}
		}

		if (passed) passedExhale++;
	}

	assert.equal(
		passedExhale,
		5,
		"All 5 clinical pharmacists must pass Stage 2 exhalation",
	);

	// 2. Negative controls: quiet sitting / normal breathing (still)
	let falsePositivesStill = 0;
	for (const sess of sessions) {
		const detector = new ExhaleDetector();
		const evaluator = new CoachingStageEvaluator({
			stageIdx: 2,
			passSeconds: 2,
			dropoutGraceMs: 800,
		});
		const frames = data
			.filter((d) => d.session === sess && d.task === "still")
			.sort((a, b) => a.timestamp_ms - b.timestamp_ms);

		const t0 = frames[0].timestamp_ms;
		let passed = false;

		for (const f of frames) {
			const relT = f.timestamp_ms - t0;
			const span = f.shoulder_span || 0.3;
			const lm = new Array(33).fill(null);
			lm[0] = { x: f.nose_x, y: f.nose_y, visibility: 0.99 };
			lm[11] = {
				x: f.shoulder_x - span / 2,
				y: f.shoulder_y,
				visibility: f.ls_conf,
			};
			lm[12] = {
				x: f.shoulder_x + span / 2,
				y: f.shoulder_y,
				visibility: f.rs_conf,
			};

			const detRes = detector.detect({
				poseLandmarks: lm,
				timestamp: relT,
			});
			const evalRes = evaluator.evaluate(detRes, relT);
			if (evalRes.ok) {
				passed = true;
				break;
			}
		}

		if (passed) falsePositivesStill++;
	}

	assert.equal(
		falsePositivesStill,
		0,
		"Quiet normal breathing / still posture must NOT pass Stage 2 exhalation",
	);

	// 3. Negative controls: inhaler at mouth during press_mouth_steady
	let falsePositivesMouth = 0;
	for (const sess of sessions) {
		const detector = new ExhaleDetector();
		const evaluator = new CoachingStageEvaluator({
			stageIdx: 2,
			passSeconds: 2,
			dropoutGraceMs: 800,
		});
		const frames = data
			.filter((d) => d.session === sess && d.task === "press_mouth_steady")
			.sort((a, b) => a.timestamp_ms - b.timestamp_ms);

		const t0 = frames[0].timestamp_ms;
		let passed = false;

		for (const f of frames) {
			const relT = f.timestamp_ms - t0;
			const span = f.shoulder_span || 0.3;
			const lm = new Array(33).fill(null);
			lm[0] = { x: f.nose_x, y: f.nose_y, visibility: 0.99 };
			lm[11] = {
				x: f.shoulder_x - span / 2,
				y: f.shoulder_y,
				visibility: f.ls_conf,
			};
			lm[12] = {
				x: f.shoulder_x + span / 2,
				y: f.shoulder_y,
				visibility: f.rs_conf,
			};

			const device = {
				present: true,
				center: { x: f.nose_x, y: f.nose_y + 0.08 },
			};
			const mouthPoint = { x: f.nose_x, y: f.nose_y + 0.08 };

			const detRes = detector.detect({
				device,
				mouthPoint,
				poseLandmarks: lm,
				timestamp: relT,
			});
			const evalRes = evaluator.evaluate(detRes, relT);
			if (evalRes.ok) {
				passed = true;
				break;
			}
		}

		if (passed) falsePositivesMouth++;
	}

	assert.equal(
		falsePositivesMouth,
		0,
		"Inhaler held at mouth must NOT pass Stage 2 exhalation",
	);
});

test("clinical replay: 5/5 real pharmacists pass stage 3 with 0 false positives", () => {
	if (!fs.existsSync(datasetPath)) {
		return;
	}

	const data = JSON.parse(fs.readFileSync(datasetPath, "utf8"));
	const sessions = [...new Set(data.map((d) => d.session))];

	assert.equal(sessions.length, 5, "Expected 5 pharmacists in 1150806 dataset");

	// 1. Positive cohort: press_mouth_steady
	let passedCount = 0;
	for (const sess of sessions) {
		const detector = new PressInhaleDetector();
		const evaluator = new CoachingStageEvaluator({
			stageIdx: 3,
			inhaleSeconds: 3,
			holdSeconds: 5,
		});
		const frames = data
			.filter((d) => d.session === sess && d.task === "press_mouth_steady")
			.sort((a, b) => a.timestamp_ms - b.timestamp_ms);

		const t0 = frames[0].timestamp_ms;
		let passed = false;

		for (const f of frames) {
			const relT = f.timestamp_ms - t0;
			const span = f.shoulder_span || 0.3;
			const lm = new Array(33).fill(null);
			lm[11] = {
				x: f.shoulder_x - span / 2,
				y: f.shoulder_y,
				visibility: f.ls_conf,
			};
			lm[12] = {
				x: f.shoulder_x + span / 2,
				y: f.shoulder_y,
				visibility: f.rs_conf,
			};

			const device = {
				present: true,
				center: { x: f.nose_x, y: f.nose_y + 0.08 },
				steadiness: 0.85,
			};
			const mouthPoint = { x: f.nose_x, y: f.nose_y + 0.08 };

			const detRes = detector.detect({
				device,
				mouthPoint,
				poseLandmarks: lm,
				timestamp: relT,
			});
			const evalRes = evaluator.evaluate(detRes, relT);
			if (evalRes.ok) {
				passed = true;
				break;
			}
		}

		if (passed) passedCount++;
	}

	assert.equal(passedCount, 5, "All 5 clinical pharmacists should pass Stage 3");

	// 2. Negative controls: shake_normal, speak, move, still
	const nonPressTasks = ["shake_normal", "speak", "move", "still"];
	for (const task of nonPressTasks) {
		let falsePositives = 0;
		const frames = data.filter((d) => d.task === task);
		const detector = new PressInhaleDetector();
		const evaluator = new CoachingStageEvaluator({
			stageIdx: 3,
			inhaleSeconds: 3,
			holdSeconds: 5,
		});

		for (const f of frames) {
			const device = { present: false, center: null, steadiness: 0.1 };
			const mouthPoint = { x: f.nose_x, y: f.nose_y + 0.08 };
			const span = f.shoulder_span || 0.3;
			const lm = new Array(33).fill(null);
			lm[11] = {
				x: f.shoulder_x - span / 2,
				y: f.shoulder_y,
				visibility: f.ls_conf,
			};
			lm[12] = {
				x: f.shoulder_x + span / 2,
				y: f.shoulder_y,
				visibility: f.rs_conf,
			};

			const detRes = detector.detect({
				device,
				mouthPoint,
				poseLandmarks: lm,
				timestamp: f.timestamp_ms,
			});
			const evalRes = evaluator.evaluate(detRes, f.timestamp_ms);
			if (evalRes.ok) falsePositives++;
		}

		assert.equal(falsePositives, 0, `Expected 0 false positives for task ${task}`);
	}
});
