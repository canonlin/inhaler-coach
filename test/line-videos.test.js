/**
 * The instruction films the bot hands to patients.
 *
 * Two things are checked here because a wrong answer reaches an elderly
 * patient as "wrong advice":
 *
 *   1. Every film is a real, published film from an official institution —
 *      the society's own instruction manual or a hospital pharmacist's. A
 *      broken link or a made-up title is a dead end for the patient.
 *   2. Every medicine in the catalogue resolves to a film, and the drug's own
 *      film wins over the generic one for its device.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
	DEFAULT_VIDEOS,
	findActiveVideo,
	findAlternateVideo,
} from "../api/line/config.mjs";
import { buildVideoCardFlex, buildWelcomeFlex } from "../api/line/flex.mjs";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const readJson = (rel) => JSON.parse(readFileSync(resolve(ROOT, rel), "utf8"));

const VIDEOS = readJson("src/line/data/videos.json");
const DRUGS = readJson("src/line/data/drugs.json");

/** Institutions allowed to publish a film's patient-facing content. */
const OFFICIAL_SOURCES = [
	"台灣胸腔暨重症加護醫學會",
	"衛生福利部胸腔病院",
	"國立陽明交通大學附設醫院",
	"新北市立聯合醫院藥劑科│藥師開講",
];

describe("instruction films", () => {
	it("the catalogue the server loads is the file, not an empty list", () => {
		// The seed is read through a path Vercel can trace. A path it cannot
		// trace ships no file, and the bot then serves nothing while the
		// repository still looks complete — this assertion is what catches it.
		assert.ok(DEFAULT_VIDEOS.length > 0, "the server found no films at all");
		assert.equal(DEFAULT_VIDEOS.length, VIDEOS.length);
		assert.equal(DEFAULT_VIDEOS[0].id, VIDEOS[0].id);
	});

	it("every film is live, complete and from an official source", () => {
		for (const video of VIDEOS) {
			assert.equal(video.status, "active", `${video.id} must be active`);
			assert.match(
				video.videoUrl,
				/^https:\/\/www\.youtube\.com\/watch\?v=[A-Za-z0-9_-]{11}$/,
				`${video.id} must point at one specific film`,
			);
			assert.match(
				video.thumbnailUrl,
				/^https:\/\/i\.ytimg\.com\/vi\/[A-Za-z0-9_-]{11}\/hqdefault\.jpg$/,
				`${video.id} must have a thumbnail`,
			);
			assert.ok(
				video.durationSeconds > 0,
				`${video.id} must know how long it runs`,
			);
			assert.ok(
				OFFICIAL_SOURCES.includes(video.source),
				`${video.id} comes from ${video.source}, which is not an official source`,
			);
			assert.match(video.sourceUrl, /^https:\/\/www\.youtube\.com\//);
		}
	});

	it("covers every device class with a Mandarin film", () => {
		for (const type of ["MDI", "DPI", "SMI"]) {
			const film = findActiveVideo(VIDEOS, type);
			assert.ok(film, `${type} has no instruction film`);
			assert.equal(film.type, type);
			assert.equal(film.lang, "zh-TW");
		}
	});

	it("every medicine in the catalogue resolves to a film of its own class", () => {
		for (const drug of DRUGS) {
			const film = findActiveVideo(VIDEOS, drug.type, drug.id);
			assert.ok(film, `${drug.id} has no instruction film`);
			assert.equal(film.type, drug.type, `${drug.id} film is the wrong device`);
		}
	});

	it("the patient's own medicine wins over the generic device film", () => {
		const film = findActiveVideo(VIDEOS, "MDI", "Symbicort_Rapihaler");
		assert.equal(film.id, "DRUG_RAPI_ZH");
		assert.equal(film.drugId, "Symbicort_Rapihaler");
	});

	it("offers the Taiwanese version only when one exists", () => {
		const alt = findAlternateVideo(VIDEOS, "MDI", "Symbicort_Rapihaler");
		assert.ok(alt, "Rapihaler has a 台語 film and it must be offered");
		assert.equal(alt.lang, "nan-TW");
		assert.notEqual(alt.id, "DRUG_RAPI_ZH");

		// A drug without its own 台語 film falls back to the device family's
		// 台語 film — never to the Mandarin one under a 台語 label.
		const fallback = findAlternateVideo(VIDEOS, "MDI", "Trimbow_Inhalation");
		if (fallback) {
			assert.equal(fallback.lang, "nan-TW");
			assert.equal(fallback.type, "MDI");
			assert.notEqual(fallback.id, "DRUG_TRIMBOW_ZH");
		}
	});

	it("the film card shows the thumbnail, the source and the length", () => {
		const film = findActiveVideo(VIDEOS, "DPI", "Relvar_Ellipta");
		const alt = findAlternateVideo(VIDEOS, "DPI", "Relvar_Ellipta");
		const card = buildVideoCardFlex({
			deviceType: "DPI",
			videoInfo: film,
			altVideo: alt,
		});
		const body = card.contents.body.contents;
		const image = body.find((c) => c.type === "image");
		assert.ok(image, "the card must show a thumbnail");
		assert.equal(image.url, film.thumbnailUrl);
		assert.equal(image.action.uri, film.videoUrl);

		const source = body.find((c) => c.text?.startsWith("影片來源："));
		assert.ok(source, "the card must say where the film comes from");
		assert.match(source.text, /台灣胸腔暨重症加護醫學會/);
		assert.match(source.text, /3 分 24 秒/);

		const buttons = body.filter((c) => c.type === "button");
		assert.ok(
			buttons.some((b) => b.action.label.includes("觀看示範短片")),
			"the card must link to the film",
		);
		assert.ok(
			buttons.some((b) => b.action.label === "看台語版"),
			"the card must offer the 台語 version",
		);
	});

	it("falls back to the society's manual when no film matches", () => {
		const card = buildVideoCardFlex({ deviceType: "MDI", videoInfo: null });
		const button = card.contents.body.contents.find((c) => c.type === "button");
		assert.match(
			button.action.uri,
			/playlist\?list=PLyt_MTzYVDTjdj1f0x4poXWei6SJqEYK-/,
		);
	});

	it("the welcome card states who it is and where to call", () => {
		const card = buildWelcomeFlex();
		const text = JSON.stringify(card);
		assert.match(text, /臺大醫院雲林分院 藥劑部/);
		assert.match(text, /119/);
		assert.match(text, /532-3911/);
		assert.match(text, /action=start_register/);
		// The first thing to do is pick the inhaler; the film comes after.
		assert.match(text, /開始選擇我的吸入劑/);
	});
});
