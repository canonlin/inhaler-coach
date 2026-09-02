import assert from "node:assert/strict";
import test from "node:test";
import { handROI, padROI } from "../src/detection/motion-energy.js";
import { SustainedGate } from "../src/detection/sustained-gate.js";
import { mouthROI, RinseDetector } from "../src/steps/step4-rinse.js";

test("sustained gate passes only after the full active duration", () => {
	const gate = new SustainedGate({ requiredMs: 3000 });
	assert.equal(gate.update(true, 1000).passed, false);
	assert.equal(gate.update(true, 3999).passed, false);
	assert.equal(gate.update(true, 4000).passed, true);
});

test("sustained gate bridges a brief detector dropout", () => {
	const gate = new SustainedGate({ requiredMs: 1000, dropoutGraceMs: 300 });
	gate.update(true, 0);
	assert.equal(gate.update(false, 200).active, true);
	assert.equal(gate.update(true, 1000).passed, true);
});

test("sustained gate resets after a real interruption", () => {
	const gate = new SustainedGate({ requiredMs: 1000, dropoutGraceMs: 300 });
	gate.update(true, 0);
	gate.update(false, 301);
	const restarted = gate.update(true, 1000);
	assert.equal(restarted.elapsedMs, 0);
	assert.equal(restarted.passed, false);
});

test("rinse detector needs multiple recent mouth-motion samples", () => {
	const detector = new RinseDetector();
	detector.update(12, 0);
	assert.equal(detector.detect().rinsing, false);
	detector.update(10, 100);
	assert.equal(detector.detect().rinsing, true);
	detector.reset();
	assert.equal(detector.detect().rinsing, false);
});

test("mouth ROI requires a complete face mesh", () => {
	assert.equal(mouthROI(null), null);
	assert.equal(
		mouthROI(Array.from({ length: 100 }, () => ({ x: 0, y: 0 }))),
		null,
	);
});

test("mouth ROI remains inside normalized frame bounds", () => {
	const face = Array.from({ length: 468 }, () => ({ x: 0.5, y: 0.5 }));
	face[13] = { x: 0.98, y: 0.97 };
	face[14] = { x: 0.99, y: 0.99 };
	face[61] = { x: 0.97, y: 0.98 };
	face[291] = { x: 0.99, y: 0.98 };

	const roi = mouthROI(face);
	assert.ok(roi);
	assert.ok(roi.x >= 0 && roi.y >= 0);
	assert.ok(roi.w > 0 && roi.h > 0);
	assert.ok(roi.x + roi.w <= 1);
	assert.ok(roi.y + roi.h <= 1);
});

test("hand ROI remains inside normalized frame bounds", () => {
	const roi = handROI([
		{ x: 0.97, y: 0.97 },
		{ x: 0.999, y: 0.999 },
	]);
	assert.ok(roi);
	assert.ok(roi.x >= 0 && roi.y >= 0);
	assert.ok(roi.w > 0 && roi.h > 0);
	assert.ok(roi.x + roi.w <= 1);
	assert.ok(roi.y + roi.h <= 1);
});

test("padded ROI contains the source box and remains in frame", () => {
	const source = { x: 0.88, y: 0.02, w: 0.1, h: 0.2 };
	const padded = padROI(source, 0.4);
	assert.ok(padded.x <= source.x);
	assert.ok(padded.y <= source.y);
	assert.ok(padded.x + padded.w >= source.x + source.w);
	assert.ok(padded.y + padded.h >= source.y + source.h);
	assert.ok(padded.x >= 0 && padded.y >= 0);
	assert.ok(padded.x + padded.w <= 1);
	assert.ok(padded.y + padded.h <= 1);
});
