/**
 * The 1:1 rotation, in one place.
 *
 * Three things have to agree on it: the form that shows the suggestion, the
 * API that allocates the arm, and the count that stays on screen. These tests
 * are the agreement, written down.
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
	ARM_CONTROL,
	ARM_EXPERIMENTAL,
	ARM_LABEL,
	ARM_MEANING,
	ARM_SOURCE_ALTERNATING,
	ARM_SOURCE_MANUAL,
	ARMS,
	armBalance,
	armSourceFor,
	inStudyCohort,
	isArm,
	nextArm,
	STUDY_COHORT,
	STUDY_COHORT_DRUGS,
	STUDY_TARGET,
} from "../src/domain/study-arm.js";

describe("the arms", () => {
	it("has exactly two, and they are the ones the study uses", () => {
		assert.deepEqual(ARMS, ["experimental", "control"]);
		assert.equal(ARM_LABEL[ARM_EXPERIMENTAL], "實驗組");
		assert.equal(ARM_LABEL[ARM_CONTROL], "對照組");
	});

	it("says what each arm means", () => {
		// The label is what she reads; the meaning is what she teaches. An
		// arm without a meaning is a letter.
		assert.equal(ARM_MEANING[ARM_EXPERIMENTAL], "AI 練習");
		assert.equal(ARM_MEANING[ARM_CONTROL], "一般衛教");
	});

	it("recognises an arm and refuses anything else", () => {
		assert.equal(isArm("experimental"), true);
		assert.equal(isArm("control"), true);
		assert.equal(isArm("對照組"), false);
		assert.equal(isArm(""), false);
		assert.equal(isArm(null), false);
		assert.equal(isArm(undefined), false);
	});
});

describe("the rotation", () => {
	it("starts with the experimental group", () => {
		// With nobody allocated yet there is no previous arm to be opposite
		// to, and the first patient has to land somewhere.
		assert.equal(nextArm(null), ARM_EXPERIMENTAL);
		assert.equal(nextArm(undefined), ARM_EXPERIMENTAL);
	});

	it("alternates one to one", () => {
		assert.equal(nextArm(ARM_EXPERIMENTAL), ARM_CONTROL);
		assert.equal(nextArm(ARM_CONTROL), ARM_EXPERIMENTAL);
	});

	it("keeps alternating for a whole run", () => {
		// Thirty allocations, one to one, with no drift: the sequence is what
		// the balance on screen is built on.
		let previous = null;
		const seen = [];
		for (let i = 0; i < 30; i++) {
			const arm = nextArm(previous);
			seen.push(arm);
			previous = arm;
		}
		assert.equal(
			seen.filter((a) => a === ARM_EXPERIMENTAL).length,
			15,
			"half the patients are in the experimental group",
		);
		assert.equal(
			seen.filter((a) => a === ARM_CONTROL).length,
			15,
			"half are in the control group",
		);
	});
});

describe("how an arm was decided", () => {
	it("calls the rotation's own choice the rotation's choice", () => {
		assert.equal(
			armSourceFor(ARM_EXPERIMENTAL, ARM_EXPERIMENTAL),
			ARM_SOURCE_ALTERNATING,
		);
	});

	it("calls an override the pharmacist's own", () => {
		// An override is a fact about the study, not a typo to be tidied away:
		// the analysis has to be able to tell the two apart.
		assert.equal(
			armSourceFor(ARM_CONTROL, ARM_EXPERIMENTAL),
			ARM_SOURCE_MANUAL,
		);
		assert.equal(
			armSourceFor(ARM_EXPERIMENTAL, ARM_CONTROL),
			ARM_SOURCE_MANUAL,
		);
	});
});

describe("the research cohort", () => {
	it("is the product the research plan enrolled", () => {
		// 100 Symbicort patients, 50 AI and 50 usual education. The QCC covers
		// every inhaler and is a different programme with a different
		// measurement.
		assert.deepEqual(STUDY_COHORT_DRUGS, ["Symbicort"]);
		assert.equal(inStudyCohort("Symbicort"), true);
	});

	it("is not every inhaler in the catalogue", () => {
		// A Ventolin case is a QCC case. Putting an arm on it would count a
		// person who is not in the study, and would spend the study's 50/50
		// on a product the study never enrolled.
		for (const key of [
			"Ventolin",
			"Seretide Evohaler",
			"Flixotide Evohaler",
			"Breztri",
			"Bevespi",
			"Trimbow",
			"Relvar (Ellipta)",
			"Ultibro Breezhaler",
			"Spiriva Respimat",
		]) {
			assert.equal(inStudyCohort(key), false, key);
		}
	});

	it("names the cohort the way the pharmacist says it", () => {
		// The catalogue carries the English label; she says 吸必擴.
		assert.match(STUDY_COHORT[0].label, /吸必擴/);
		assert.match(STUDY_COHORT[0].label, /Symbicort/);
	});
});

describe("the balance on screen", () => {
	it("counts people and says the ratio the way a person would", () => {
		const b = armBalance({ experimental: 12, control: 10 });
		assert.equal(b.experimental, 12);
		assert.equal(b.control, 10);
		assert.equal(b.total, 22);
		assert.equal(b.ratio, "12:10");
	});

	it("points at the next arm", () => {
		assert.equal(armBalance({ previous: ARM_CONTROL }).next, ARM_EXPERIMENTAL);
		assert.equal(armBalance({ previous: ARM_EXPERIMENTAL }).next, ARM_CONTROL);
		assert.equal(armBalance({}).next, ARM_EXPERIMENTAL);
	});

	it("shows zero rather than nothing when nobody is enrolled yet", () => {
		const b = armBalance();
		assert.equal(b.experimental, 0);
		assert.equal(b.control, 0);
		assert.equal(b.total, 0);
		assert.equal(b.ratio, "0:0");
	});

	it("knows the plan's number and the room left in it", () => {
		const b = armBalance({ experimental: 40, control: 40 });
		assert.equal(b.target, STUDY_TARGET);
		assert.equal(b.enrolled, 80);
		assert.equal(b.remaining, STUDY_TARGET - 80);
		assert.equal(b.full, false);
	});

	it("knows when the plan has taken everyone it was going to take", () => {
		// The hundredth patient fills it; the hundred and first is not in the
		// study. The balance on screen has to be able to say so, because the
		// alternative is a study that quietly ran to a hundred and one.
		const b = armBalance({ experimental: 50, control: 50 });
		assert.equal(b.full, true);
		assert.equal(b.remaining, 0);
	});
});
