import assert from "node:assert/strict";
import test from "node:test";

import { STAGES } from "../src/config/stages.js";

test("Symbicort coaching durations match the product instructions", () => {
	assert.match(STAGES[1].hint, /5 秒/);
	assert.match(STAGES[2].hint, /吐氣/);
	assert.equal(STAGES[2].passSeconds, 3);
	assert.equal(STAGES[3].inhaleSeconds, 4);
	assert.equal(STAGES[3].holdSeconds, 10);
	assert.match(STAGES[3].hint, /舒適為限/);
	assert.match(STAGES[3].stepSub, /舒適為限/);
	assert.match(STAGES[4].stepInstruction, /吐掉/);
});

test("all educational videos hide player controls to avoid obstructing clinical subtitles", () => {
	for (const stage of STAGES) {
		assert.ok(stage.videoURL, `Stage ${stage.id} must have a videoURL`);
		assert.ok(
			stage.videoURL.includes("controls=0"),
			`Stage ${stage.id} videoURL (${stage.videoURL}) must include controls=0 to avoid covering subtitles`,
		);
		const match = stage.videoURL.match(
			/(?:embed\/|v=|vi\/|youtu\.be\/|\/v\/|\/e\/|watch\?v=|\?v=)([^#&?]+)/,
		);
		assert.ok(match && match[1].length > 5, `Stage ${stage.id} video ID must extract cleanly`);
	}
});

