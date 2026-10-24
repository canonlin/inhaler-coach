/**
 * More than one programme, one back office.
 *
 * The platform measures the QCC／深耕計畫 over every inhaler and the research
 * plan over 吸必擴 patients in two groups. They share the cases and they do not
 * share a measurement, so the rules that keep them apart are checked here
 * rather than left in a comment:
 *
 * - a case with no group was never in the study, and NULL is not 對照組;
 * - the counts are people, not rows;
 * - a comparison between two groups is withheld until both sides carry enough
 *   people for the difference to be about the intervention.
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { MIN_PAIRED_PER_GROUP, researchOutcome } from "../api/outcomes.mjs";
import { PROGRAMMES, programmeById } from "../src/domain/programmes.js";
import { ARM_CONTROL, ARM_EXPERIMENTAL } from "../src/domain/study-arm.js";

/** A measured row: two steps, one of them wrong when `wrong` is true. */
function row(patientId, qccStage, studyArm, wrong = false) {
	return {
		patientId,
		qccStage,
		studyArm,
		steps: { MDI_搖: wrong ? "錯誤" : "正確", MDI_吸: "正確" },
	};
}

/** One patient measured before and after, with an error before and none after. */
function improved(patientId, studyArm) {
	return [
		row(patientId, "改善前", studyArm, true),
		row(patientId, "改善後", studyArm, false),
	];
}

describe("the programmes", () => {
	it("each say who they count, how they measure, and over what", () => {
		assert.ok(PROGRAMMES.length >= 2);
		const ids = new Set();
		for (const p of PROGRAMMES) {
			assert.ok(p.id && !ids.has(p.id), "每個計畫的 id 要唯一");
			ids.add(p.id);
			assert.ok(p.label, `${p.id} 沒有名字`);
			assert.ok(p.scope, `${p.id} 沒有說明對象`);
			assert.ok(p.measurement, `${p.id} 沒有說明量法`);
			// The denominator is the one that gets forgotten, so it is required.
			assert.ok(p.denominator, `${p.id} 沒有說明分母`);
		}
	});

	it("keep the two apart: the QCC counts enrolments, the study counts arms", () => {
		assert.equal(programmeById("qcc")?.scope, "enrolment");
		assert.equal(programmeById("research")?.scope, "study-arm");
	});
});

describe("the research measurement", () => {
	it("does not count a case with no group as a control", () => {
		// NULL is not 對照組. A case that was never in the study is not a
		// control; it is not counted at all.
		const out = researchOutcome([
			...improved("p1", ARM_EXPERIMENTAL),
			row("p2", "改善前", null, true),
		]);
		const [, control] = out.groups;
		assert.equal(control.people, 0);
		assert.equal(control.before.cases, 0);
		assert.equal(out.people, 1);
	});

	it("counts people, not rows", () => {
		// The same patient measured before and after is one person.
		const out = researchOutcome(improved("p1", ARM_EXPERIMENTAL));
		assert.equal(out.groups[0].people, 1);
		assert.equal(out.people, 1);
	});

	it("keeps each group's before and after apart", () => {
		const out = researchOutcome(improved("p1", ARM_EXPERIMENTAL));
		const [experimental] = out.groups;
		assert.equal(experimental.before.errorRate, 1);
		assert.equal(experimental.after.errorRate, 0);
		assert.equal(experimental.paired.paired, 1);
		assert.equal(experimental.paired.b, 1);
	});

	it("withholds the comparison until both sides carry enough people", () => {
		// One person on each side is a story, not a comparison.
		const out = researchOutcome([
			...improved("e1", ARM_EXPERIMENTAL),
			...improved("c1", ARM_CONTROL),
		]);
		assert.equal(out.enough, false);
		assert.equal(out.comparison, null);
	});

	it("compares the two groups once both sides are big enough", () => {
		const rows = [];
		for (let i = 0; i < MIN_PAIRED_PER_GROUP; i += 1) {
			// The AI group improves; the usual-education group does not.
			rows.push(...improved(`e${i}`, ARM_EXPERIMENTAL));
			rows.push(row(`c${i}`, "改善前", ARM_CONTROL, true));
			rows.push(row(`c${i}`, "改善後", ARM_CONTROL, true));
		}
		const out = researchOutcome(rows);
		assert.equal(out.enough, true);
		assert.ok(out.comparison);
		assert.equal(out.comparison.experimentalAfter, 0);
		assert.equal(out.comparison.controlAfter, 1);
		// Positive means the AI group is doing better.
		assert.equal(out.comparison.gap, 1);
		assert.equal(out.comparison.experimentalPeople, MIN_PAIRED_PER_GROUP);
		assert.equal(out.comparison.controlPeople, MIN_PAIRED_PER_GROUP);
	});

	it("carries the plan's own number", () => {
		const out = researchOutcome([]);
		assert.equal(out.target, 100);
	});
});
