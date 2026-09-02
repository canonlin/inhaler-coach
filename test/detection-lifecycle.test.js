import assert from "node:assert/strict";
import test from "node:test";

import { DetectionManager } from "../src/detection/detection-manager.js";
import { InhalerDetector } from "../src/detection/inhaler-detector.js";

test("detection manager shares one in-flight initialization", async () => {
	const manager = new DetectionManager();
	let calls = 0;
	let finish;
	manager.initializeBackends = () => {
		calls++;
		return new Promise((resolve) => {
			finish = () => {
				manager.isInitialized = true;
				resolve();
			};
		});
	};

	const first = manager.initialize();
	const second = manager.initialize();
	assert.equal(calls, 1);
	finish();
	await Promise.all([first, second]);
	assert.equal(manager.isInitialized, true);
});

test("detection manager permits retry after initialization failure", async () => {
	const manager = new DetectionManager();
	let calls = 0;
	manager.initializeBackends = async () => {
		calls++;
		if (calls === 1) throw new Error("network unavailable");
		manager.isInitialized = true;
	};

	await assert.rejects(manager.initialize(), /network unavailable/);
	await manager.initialize();
	assert.equal(calls, 2);
	assert.equal(manager.isInitialized, true);
});

test("inhaler model can retry after worker warmup failure", async () => {
	const originalWorker = globalThis.Worker;
	let shouldFail = true;

	class FakeWorker {
		postMessage(message) {
			if (!message.warmup) return;
			queueMicrotask(() => {
				this.onmessage?.({
					data: shouldFail
						? { warmupError: "model unavailable" }
						: { ready: true },
				});
			});
		}

		terminate() {}
	}

	globalThis.Worker = FakeWorker;
	try {
		const detector = new InhalerDetector();
		await assert.rejects(detector.load(), /model unavailable/);
		assert.equal(detector.worker, null);

		shouldFail = false;
		await detector.load();
		assert.equal(detector.ready, true);
	} finally {
		if (originalWorker === undefined) delete globalThis.Worker;
		else globalThis.Worker = originalWorker;
	}
});

test("inhaler detector returns tracked steadiness from worker observations", async () => {
	const originalWorker = globalThis.Worker;
	const originalCreateImageBitmap = globalThis.createImageBitmap;

	class ObservationWorker {
		postMessage(message) {
			queueMicrotask(() => {
				if (message.warmup) {
					this.onmessage?.({ data: { ready: true } });
					return;
				}
				this.onmessage?.({
					data: {
						id: message.id,
						result: {
							present: true,
							score: 0.9,
							center: { x: 0.5, y: 0.5 },
							box: { x: 0.45, y: 0.4, w: 0.1, h: 0.2 },
						},
					},
				});
			});
		}

		terminate() {}
	}

	globalThis.Worker = ObservationWorker;
	globalThis.createImageBitmap = async () => ({ close() {} });
	try {
		const detector = new InhalerDetector();
		await detector.load();
		await detector.detect({}, 480, 360, 0.35, 0);
		await detector.detect({}, 480, 360, 0.35, 200);
		const observation = await detector.detect({}, 480, 360, 0.35, 400);
		assert.equal(observation.present, true);
		assert.ok(observation.steadiness > 0.9);
	} finally {
		if (originalWorker === undefined) delete globalThis.Worker;
		else globalThis.Worker = originalWorker;
		if (originalCreateImageBitmap === undefined)
			delete globalThis.createImageBitmap;
		else globalThis.createImageBitmap = originalCreateImageBitmap;
	}
});

test("inhaler worker crash releases an in-flight detection", async () => {
	const originalWorker = globalThis.Worker;
	const originalCreateImageBitmap = globalThis.createImageBitmap;

	class CrashingWorker {
		postMessage(message) {
			if (message.warmup) {
				queueMicrotask(() => this.onmessage?.({ data: { ready: true } }));
				return;
			}
			queueMicrotask(() => this.onerror?.({ message: "worker crashed" }));
		}

		terminate() {}
	}

	globalThis.Worker = CrashingWorker;
	globalThis.createImageBitmap = async () => ({ close() {} });
	try {
		const detector = new InhalerDetector();
		await detector.load();
		const observation = await detector.detect({}, 480, 360, 0.35, 1000);
		assert.equal(observation.present, false);
		assert.equal(detector.worker, null);
	} finally {
		if (originalWorker === undefined) delete globalThis.Worker;
		else globalThis.Worker = originalWorker;
		if (originalCreateImageBitmap === undefined)
			delete globalThis.createImageBitmap;
		else globalThis.createImageBitmap = originalCreateImageBitmap;
	}
});
