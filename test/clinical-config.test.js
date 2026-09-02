import assert from "node:assert/strict";
import test from "node:test";

import { STAGES } from "../src/config/stages.js";

test("Symbicort coaching durations match the product instructions", () => {
	assert.match(STAGES[1].hint, /5 秒/);
	assert.match(STAGES[2].hint, /吐氣/);
	assert.equal(STAGES[3].inhaleSeconds, 4);
	assert.equal(STAGES[3].holdSeconds, 10);
	assert.match(STAGES[3].hint, /舒適為限/);
	assert.match(STAGES[3].stepSub, /舒適為限/);
	assert.match(STAGES[4].stepInstruction, /吐掉/);
});
