import assert from "node:assert/strict";
import test from "node:test";

import { ShakeDetector } from "../src/steps/step1-shake.js";

function feed(
	detector,
	{
		durationMs,
		intervalMs,
		ratio,
		flow = () => ({ flowX: 0, flowY: 0 }),
		observed = true,
		inhalerPresent = true,
		position = null,
		positionSource = "hand",
		startMs = 0,
	},
) {
	let result;
	for (
		let timestamp = startMs;
		timestamp <= startMs + durationMs;
		timestamp += intervalMs
	) {
		if (inhalerPresent) detector.observeInhaler(timestamp);
		if (position) {
			detector.updatePosition(position(timestamp), timestamp, positionSource);
		}
		detector.update(
			{ hand: ratio, background: 1, ratio, observed, ...flow(timestamp) },
			timestamp,
		);
		result = detector.detect(timestamp);
	}
	return result ?? detector.detect(startMs);
}

test("inhaler presence without motion never passes shake", () => {
	const detector = new ShakeDetector();
	const result = feed(detector, {
		durationMs: 10_000,
		intervalMs: 33,
		ratio: 0,
	});
	assert.equal(result.shaking, false);
	assert.equal(result.passed, false);
});

test("high-rate static motion ratio never passes shake", () => {
	const detector = new ShakeDetector();
	const result = feed(detector, {
		durationMs: 10_000,
		intervalMs: 33,
		ratio: 2,
	});
	assert.equal(result.shaking, false);
	assert.equal(result.passed, false);
});

test("high motion ratio without coherent translation never passes shake", () => {
	const detector = new ShakeDetector();
	const result = feed(detector, {
		durationMs: 10_000,
		intervalMs: 33,
		ratio: 100,
	});
	assert.equal(result.verticalFlow, 0);
	assert.equal(result.shaking, false);
	assert.equal(result.passed, false);
});

test("low-rate samples fail closed even when their ratio is high", () => {
	const detector = new ShakeDetector();
	const result = feed(detector, {
		durationMs: 10_000,
		intervalMs: 333,
		ratio: 100,
		flow: (timestamp) => ({
			flowX: 0.02,
			flowY: Math.sin((timestamp / 1000) * Math.PI * 6) * 0.3,
		}),
	});
	assert.equal(result.shaking, false);
	assert.equal(result.passed, false);
});

test("sustained high-rate shake passes after five seconds", () => {
	const detector = new ShakeDetector();
	const result = feed(detector, {
		durationMs: 6_000,
		intervalMs: 33,
		ratio: 50,
		flow: (timestamp) => ({
			flowX: 0.03,
			flowY: Math.sin((timestamp / 1000) * Math.PI * 6) * 0.3,
		}),
	});
	assert.equal(result.shaking, true);
	assert.equal(result.passed, true);
	assert.ok(result.sampleRateHz >= 25);
	assert.ok(result.verticalShare >= 0.55);
	assert.ok(result.verticalReversals >= 2);
});

test("horizontal shaking does not pass the vertical shake step", () => {
	const detector = new ShakeDetector();
	const result = feed(detector, {
		durationMs: 10_000,
		intervalMs: 33,
		ratio: 50,
		flow: (timestamp) => ({
			flowX: Math.sin((timestamp / 1000) * Math.PI * 6) * 0.3,
			flowY: 0.02,
		}),
	});
	assert.equal(result.shaking, false);
	assert.equal(result.passed, false);
});

test("one-way vertical movement is not mistaken for repeated shaking", () => {
	const detector = new ShakeDetector();
	const result = feed(detector, {
		durationMs: 10_000,
		intervalMs: 33,
		ratio: 50,
		flow: () => ({ flowX: 0.02, flowY: 0.3 }),
	});
	assert.equal(result.verticalReversals, 0);
	assert.equal(result.shaking, false);
	assert.equal(result.passed, false);
});

test("tracking loss freezes shake progress instead of erasing it", () => {
	const detector = new ShakeDetector();
	const verticalFlow = (timestamp) => ({
		flowX: 0.02,
		flowY: Math.sin((timestamp / 1000) * Math.PI * 6) * 0.3,
	});
	let result = feed(detector, {
		durationMs: 3_000,
		intervalMs: 33,
		ratio: 50,
		flow: verticalFlow,
	});
	const progressBeforeDropout = result.sustainedMs;
	assert.ok(progressBeforeDropout > 1_500);

	result = feed(detector, {
		startMs: 3_033,
		durationMs: 3_000,
		intervalMs: 33,
		ratio: 0,
		observed: false,
		inhalerPresent: false,
	});
	assert.equal(result.sustainedMs, progressBeforeDropout);

	result = feed(detector, {
		startMs: 6_066,
		durationMs: 4_000,
		intervalMs: 33,
		ratio: 50,
		flow: verticalFlow,
	});
	assert.equal(result.passed, true);
});

test("a visible sustained stop resets accumulated shake progress", () => {
	const detector = new ShakeDetector();
	const verticalFlow = (timestamp) => ({
		flowX: 0.02,
		flowY: Math.sin((timestamp / 1000) * Math.PI * 6) * 0.3,
	});
	feed(detector, {
		durationMs: 3_000,
		intervalMs: 33,
		ratio: 50,
		flow: verticalFlow,
	});
	const stopped = feed(detector, {
		startMs: 3_033,
		durationMs: 3_000,
		intervalMs: 33,
		ratio: 2,
	});
	assert.equal(stopped.sustainedMs, 0);
});

test("slow deliberate up-and-down tracking passes without high motion energy", () => {
	const detector = new ShakeDetector();
	const result = feed(detector, {
		durationMs: 8_000,
		intervalMs: 100,
		ratio: 4,
		flow: () => ({ flowX: 0.005, flowY: 0.01 }),
		position: (timestamp) => ({
			x: 0.5,
			y: 0.5 + Math.sin((timestamp / 1000) * Math.PI * 1.4) * 0.06,
		}),
	});
	assert.equal(result.trajectoryShaking, true, JSON.stringify(result));
	assert.equal(result.passed, true);
});

test("slow horizontal tracking does not pass the up-and-down step", () => {
	const detector = new ShakeDetector();
	const result = feed(detector, {
		durationMs: 8_000,
		intervalMs: 100,
		ratio: 4,
		position: (timestamp) => ({
			x: 0.5 + Math.sin((timestamp / 1000) * Math.PI * 1.4) * 0.06,
			y: 0.5,
		}),
	});
	assert.equal(result.trajectoryShaking, false);
	assert.equal(result.passed, false);
});

test("tracked hand motion passes even when inhaler is not recognized (secondary signal)", () => {
	const detector = new ShakeDetector();
	const result = feed(detector, {
		durationMs: 8_000,
		intervalMs: 100,
		ratio: 50,
		inhalerPresent: false,
		position: (timestamp) => ({
			x: 0.5,
			y: 0.5 + Math.sin((timestamp / 1000) * Math.PI * 1.4) * 0.06,
		}),
	});
	assert.equal(result.inhalerPresent, false);
	assert.equal(result.passed, true);
});

test("one inhaler acquisition stays locked through the mixing attempt", () => {
	const detector = new ShakeDetector();
	detector.observeInhaler(0);
	const result = feed(detector, {
		durationMs: 8_000,
		intervalMs: 100,
		ratio: 4,
		inhalerPresent: false,
		position: (timestamp) => ({
			x: 0.5,
			y: 0.5 + Math.sin((timestamp / 1000) * Math.PI * 1.4) * 0.06,
		}),
	});
	assert.equal(result.targetAcquired, true);
	assert.equal(result.trajectoryShaking, true);
	assert.equal(result.passed, true);

	detector.reset();
	assert.equal(detector.detect(9_000).targetAcquired, false);
});
