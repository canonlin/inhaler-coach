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

test("exhale never passes from a missing face or missed inhaler", () => {
	const detector = new ExhaleDetector();
	assert.equal(
		detector.detect({ device: null, mouthPoint: { x: 0.5, y: 0.3 } }).exhaling,
		false,
	);
	assert.equal(
		detector.detect({ device: hit(0.5, 0.7), mouthPoint: null }).exhaling,
		false,
	);
	assert.equal(
		detector.detect({
			device: hit(0.5, 0.7),
			mouthPoint: { x: 0.5, y: 0.3 },
		}).exhaling,
		true,
	);
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
