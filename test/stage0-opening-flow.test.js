import assert from "node:assert/strict";
import test from "node:test";

import { STAGES, getInitialStageIdx } from "../src/config/stages.js";

test("Stage 0 opening educational video (開場介紹) configuration contract", () => {
	const stage0 = STAGES[0];
	assert.ok(stage0, "STAGES must have stage 0");
	assert.equal(stage0.id, 0);
	assert.equal(stage0.name, "衛教影片");
	assert.equal(stage0.badge, "開場介紹");
	assert.equal(stage0.isIntro, true);
	assert.equal(stage0.manualPass, true);
	assert.equal(stage0.modelURL, null);
	assert.match(stage0.videoURL, /2DYT6jev8a4/);
	assert.match(stage0.manualBtnText, /✅ 影片看完，開始挑戰！/);
});

test("Stage navigation starts at Stage 0 by default and supports stage override", () => {
	// Without search param, starts at Stage 0 (開場介紹)
	assert.equal(getInitialStageIdx(""), 0);

	// Overrides via ?stage=N
	assert.equal(getInitialStageIdx("?stage=1"), 1);
	assert.equal(getInitialStageIdx("?stage=2"), 2);
	assert.equal(getInitialStageIdx("?stage=3"), 3);
	assert.equal(getInitialStageIdx("?stage=4"), 4);

	// Invalid or clamped indices
	assert.equal(getInitialStageIdx("?stage=invalid"), 0);
	assert.equal(getInitialStageIdx("?stage=-1"), 0);
	assert.equal(getInitialStageIdx("?stage=999"), STAGES.length - 1);
});

test("Progression from Stage 0 sequentially moves to Stage 1", () => {
	const currentIdx = 0;
	const nextIdx = currentIdx + 1;
	assert.equal(nextIdx, 1);
	assert.equal(STAGES[nextIdx].name, "振搖");
	assert.equal(STAGES[nextIdx].badge, "第一關");
});
