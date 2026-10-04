import assert from "node:assert/strict";
import test from "node:test";
import { ShoulderKinematicsTracker } from "../src/detection/shoulder-kinematics.js";

function makePoseLandmarks(leftY, rightY, leftX = 0.35, rightX = 0.65, visibility = 0.95) {
	const landmarks = new Array(33).fill(null).map(() => ({ x: 0.5, y: 0.5, visibility: 0.9 }));
	landmarks[11] = { x: leftX, y: leftY, visibility };
	landmarks[12] = { x: rightX, y: rightY, visibility };
	return landmarks;
}

test("returns invalid when pose landmarks are missing or confidence is low", () => {
	const tracker = new ShoulderKinematicsTracker();
	assert.equal(tracker.update(null).valid, false);
	assert.equal(tracker.update([]).valid, false);

	const lowConf = makePoseLandmarks(0.6, 0.6, 0.35, 0.65, 0.2);
	assert.equal(tracker.update(lowConf).valid, false);
});

test("locks baseline and detects shoulder elevation on deep inhalation", () => {
	const tracker = new ShoulderKinematicsTracker();

	// Warmup / baseline at y = 0.60
	for (let i = 0; i < 5; i++) {
		tracker.update(makePoseLandmarks(0.6, 0.6), i * 100);
	}
	tracker.lockBaseline();

	// Deep inhale: shoulders rise to y = 0.57 (span is 0.30, delta is 0.03 / 0.30 = 0.10 spans)
	let res = null;
	for (let i = 5; i < 15; i++) {
		res = tracker.update(makePoseLandmarks(0.57, 0.57), i * 100);
	}

	assert.equal(res.valid, true);
	assert.equal(res.isElevated, true);
	assert.ok(res.elevation >= 0.04, `expected elevation >= 0.04, got ${res.elevation}`);
});

test("detects stability during breath hold plateau", () => {
	const tracker = new ShoulderKinematicsTracker();

	for (let i = 0; i < 5; i++) {
		tracker.update(makePoseLandmarks(0.6, 0.6), i * 100);
	}
	tracker.lockBaseline();

	// Shoulders stay stationary at y = 0.58
	let res = null;
	for (let i = 5; i < 15; i++) {
		res = tracker.update(makePoseLandmarks(0.58, 0.58), i * 100);
	}

	assert.equal(res.isStable, true);
	assert.equal(res.isDropping, false);
});

test("detects premature exhalation drop when shoulders slump", () => {
	const tracker = new ShoulderKinematicsTracker();

	for (let i = 0; i < 5; i++) {
		tracker.update(makePoseLandmarks(0.6, 0.6), i * 100);
	}
	tracker.lockBaseline();

	// Inhale up to 0.55
	for (let i = 5; i < 15; i++) {
		tracker.update(makePoseLandmarks(0.55, 0.55), i * 100);
	}

	// Exhale slump down to 0.63 (drop > 0.06 spans)
	let res = null;
	for (let i = 15; i < 25; i++) {
		res = tracker.update(makePoseLandmarks(0.63, 0.63), i * 100);
	}

	assert.equal(res.isDropping, true);
});
