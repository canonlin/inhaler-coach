import assert from "node:assert/strict";
import test from "node:test";

import { InhalerObservationTracker } from "../src/detection/inhaler-detector.js";
import { ExhaleDetector } from "../src/steps/step2-exhale.js";
import { PressInhaleDetector } from "../src/steps/step3-press-inhale.js";

const hit = (x, y, score = 0.7) => ({
	present: true,
	score,
	center: { x, y },
	box: { x: x - 0.05, y: y - 0.1, w: 0.1, h: 0.2 },
});

test("YOLO observation survives a short recall dropout, then expires", () => {
	const tracker = new InhalerObservationTracker({ persistenceMs: 1200 });
	tracker.observe(hit(0.4, 0.5), 1000);
	assert.equal(tracker.observe(null, 2100).present, true);
	assert.equal(tracker.seenRecently(3000, 2500), true);
	assert.equal(tracker.observe(null, 2201).present, false);
	assert.equal(tracker.seenRecently(3601, 2500), false);
});

test("steadiness uses both axes and rejects deliberate waving", () => {
	const steady = new InhalerObservationTracker();
	steady.observe(hit(0.4, 0.5), 0);
	steady.observe(hit(0.405, 0.498), 200);
	assert.ok(steady.observe(hit(0.398, 0.503), 400).steadiness > 0.9);

	const waving = new InhalerObservationTracker();
	waving.observe(hit(0.2, 0.5), 0);
	waving.observe(hit(0.5, 0.5), 200);
	assert.ok(waving.observe(hit(0.8, 0.5), 400).steadiness < 0.1);
});

test("exhale tracks relaxed shoulder posture without requiring inhaler", () => {
	const detector = new ExhaleDetector();
	const normalPose = [
		...Array(11).fill({ x: 0.5, y: 0.5, visibility: 0.9 }),
		{ x: 0.4, y: 0.6, visibility: 0.9 }, // 11 left shoulder
		{ x: 0.6, y: 0.6, visibility: 0.9 }, // 12 right shoulder
	];

	// Without any inhaler device, shoulder posture is acquired and exhalation starts
	const res = detector.detect({
		poseLandmarks: normalPose,
		mouthPoint: { x: 0.5, y: 0.3 },
		timestamp: 0,
	});
	assert.equal(res.ready, true);
	assert.equal(res.exhaling, true);
	assert.equal(res.shrugging, false);
	assert.equal(res.awayLocked, true);
	assert.equal(res.phase, "guided-exhale");
});

test("exhale detects shrugging/elevated shoulders and warns to relax", () => {
	const detector = new ExhaleDetector();
	const basePose = [
		...Array(11).fill({ x: 0.5, y: 0.5, visibility: 0.9 }),
		{ x: 0.4, y: 0.6, visibility: 0.9 },
		{ x: 0.6, y: 0.6, visibility: 0.9 },
	];
	for (let i = 0; i < 5; i++) {
		detector.detect({ poseLandmarks: basePose, timestamp: i * 100 });
	}

	// Shrug/inhale: shoulders lift upward in screen coords (y decreases from 0.6 to 0.52)
	const shruggedPose = [
		...Array(11).fill({ x: 0.5, y: 0.5, visibility: 0.9 }),
		{ x: 0.4, y: 0.52, visibility: 0.9 },
		{ x: 0.6, y: 0.52, visibility: 0.9 },
	];
	const shrugged = detector.detect({
		poseLandmarks: shruggedPose,
		timestamp: 600,
	});
	assert.equal(shrugged.shrugging, true);
	assert.equal(shrugged.exhaling, false);
	assert.equal(shrugged.phase, "relax-shoulders");
});

test("exhale warns if inhaler is accidentally held at mouth", () => {
	const detector = new ExhaleDetector();
	const normalPose = [
		...Array(11).fill({ x: 0.5, y: 0.5, visibility: 0.9 }),
		{ x: 0.4, y: 0.6, visibility: 0.9 },
		{ x: 0.6, y: 0.6, visibility: 0.9 },
	];
	const atMouth = detector.detect({
		poseLandmarks: normalPose,
		mouthPoint: { x: 0.5, y: 0.3 },
		device: hit(0.51, 0.31), // directly at mouth
		timestamp: 0,
	});
	assert.equal(atMouth.atMouth, true);
	assert.equal(atMouth.exhaling, false);
	assert.equal(atMouth.phase, "remove-inhaler");
});

test("press requires a visible, close, steady YOLO observation", () => {
	const detector = new PressInhaleDetector();
	const mouthPoint = { x: 0.5, y: 0.3 };
	assert.equal(detector.detect({ device: null, mouthPoint }).pressing, false);
	assert.equal(
		detector.detect({
			device: { ...hit(0.51, 0.31), steadiness: 0.9 },
			mouthPoint,
		}).pressing,
		true,
	);
	assert.equal(
		detector.detect({
			device: { ...hit(0.51, 0.31), steadiness: 0.1 },
			mouthPoint,
		}).pressing,
		false,
	);
});
