import assert from "node:assert/strict";
import test from "node:test";

import { MotionEnergy } from "../src/detection/motion-energy.js";
import { ShakeDetector } from "../src/steps/step1-shake.js";

const GRID = 96;

function frame(pixelValue) {
	const data = new Uint8ClampedArray(GRID * GRID * 4);
	for (let row = 0; row < GRID; row++) {
		for (let col = 0; col < GRID; col++) {
			const value =
				typeof pixelValue === "function" ? pixelValue(row, col) : pixelValue;
			const offset = (row * GRID + col) * 4;
			data[offset] = value;
			data[offset + 1] = value;
			data[offset + 2] = value;
			data[offset + 3] = 255;
		}
	}
	return data;
}

function rectangleFrame(x, y, width = 20, height = 32) {
	return frame((row, col) =>
		col >= x && col < x + width && row >= y && row < y + height ? 210 : 20,
	);
}

function withFakeCanvas(frames, run) {
	const originalDocument = globalThis.document;
	const queue = [...frames];
	const context = {
		drawImage() {},
		getImageData() {
			const data = queue.shift();
			if (!data) throw new Error("fake canvas frame queue exhausted");
			return { data };
		},
	};
	globalThis.document = {
		createElement() {
			return {
				width: 0,
				height: 0,
				getContext() {
					return context;
				},
			};
		},
	};
	try {
		return run();
	} finally {
		if (originalDocument === undefined) delete globalThis.document;
		else globalThis.document = originalDocument;
	}
}

test("motion energy compares action ROI against the same-frame background", () => {
	const roi = { x: 0.4, y: 0.4, w: 0.2, h: 0.2 };
	const changed = frame((row, col) => {
		const x = col / GRID;
		const y = row / GRID;
		return x >= roi.x && x <= roi.x + roi.w && y >= roi.y && y <= roi.y + roi.h
			? 200
			: 0;
	});

	withFakeCanvas([frame(0), changed], () => {
		const energy = new MotionEnergy();
		assert.deepEqual(energy.sample({}, roi), {
			hand: 0,
			background: 0,
			ratio: 0,
			flowX: 0,
			flowY: 0,
			observed: true,
		});
		const result = energy.sample({}, roi);
		assert.ok(result.hand > 190);
		assert.equal(result.background, 0);
		assert.ok(result.ratio > 300);
	});
});

test("motion energy reports vertical translation as vertical flow", () => {
	const roi = { x: 0.2, y: 0.2, w: 0.6, h: 0.7 };
	withFakeCanvas([rectangleFrame(38, 28), rectangleFrame(38, 33)], () => {
		const energy = new MotionEnergy();
		energy.sample({}, roi);
		const result = energy.sample({}, roi);
		assert.ok(Math.abs(result.flowY) > Math.abs(result.flowX) * 2);
		assert.ok(Math.abs(result.flowY) > 0.05);
	});
});

test("motion energy reports horizontal translation as horizontal flow", () => {
	const roi = { x: 0.2, y: 0.2, w: 0.6, h: 0.7 };
	withFakeCanvas([rectangleFrame(34, 30), rectangleFrame(39, 30)], () => {
		const energy = new MotionEnergy();
		energy.sample({}, roi);
		const result = energy.sample({}, roi);
		assert.ok(Math.abs(result.flowX) > Math.abs(result.flowY) * 2);
		assert.ok(Math.abs(result.flowX) > 0.05);
	});
});

test("missing ROI still advances the reference frame", () => {
	const roi = { x: 0.4, y: 0.4, w: 0.2, h: 0.2 };
	const afterTrackingReturns = frame((row, col) => {
		const x = col / GRID;
		const y = row / GRID;
		return x >= roi.x && x <= roi.x + roi.w && y >= roi.y && y <= roi.y + roi.h
			? 150
			: 100;
	});

	withFakeCanvas([frame(0), frame(100), afterTrackingReturns], () => {
		const energy = new MotionEnergy();
		energy.sample({}, roi);
		assert.equal(energy.sample({}, null).ratio, 0);
		const result = energy.sample({}, roi);
		assert.equal(result.background, 0);
		assert.ok(result.ratio > 90);
	});
});

test("motion energy reset discards the previous frame", () => {
	const roi = { x: 0.4, y: 0.4, w: 0.2, h: 0.2 };
	withFakeCanvas([frame(0), frame(200)], () => {
		const energy = new MotionEnergy();
		energy.sample({}, roi);
		energy.reset();
		assert.equal(energy.sample({}, roi).ratio, 0);
	});
});

function runShakePipeline(axis) {
	const intervalMs = 33;
	const frameCount = 200;
	const frames = Array.from({ length: frameCount }, (_, index) => {
		const timestamp = index * intervalMs;
		const offset = Math.round(Math.sin((timestamp / 1000) * Math.PI * 6) * 5);
		return rectangleFrame(
			34 + (axis === "horizontal" ? offset : 0),
			28 + (axis === "vertical" ? offset : 0),
		);
	});
	const roi = { x: 0.25, y: 0.15, w: 0.5, h: 0.75 };

	return withFakeCanvas(frames, () => {
		const energy = new MotionEnergy();
		const detector = new ShakeDetector();
		let result = detector.detect(0);
		for (let index = 0; index < frameCount; index++) {
			const timestamp = index * intervalMs;
			const motion = energy.sample({}, roi, 0.98);
			detector.observeInhaler(timestamp);
			detector.update(motion, timestamp);
			result = detector.detect(timestamp);
		}
		return result;
	});
}

test("motion pipeline passes sustained vertical shaking", () => {
	const result = runShakePipeline("vertical");
	assert.equal(result.shaking, true, JSON.stringify(result));
	assert.equal(result.passed, true);
});

test("motion pipeline rejects horizontal shaking", () => {
	const result = runShakePipeline("horizontal");
	assert.equal(result.shaking, false);
	assert.equal(result.passed, false);
});

test("motion pipeline rejects a stationary inhaler", () => {
	const result = runShakePipeline("static");
	assert.equal(result.shaking, false);
	assert.equal(result.passed, false);
});
