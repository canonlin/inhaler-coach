/**
 * 每支藥都要有一張乾淨的產品照，而且那張照要在。
 *
 * 病人端首頁的吸必擴（`public/inhaler_bg.jpg`）是乾淨棚拍風格，病人照著
 * 練的時候看的就是那種照片。沒有照片的藥，畫面只能畫一個框；照片不在
 * 資料夾裡的藥，畫面會開天窗。所以這裡守的是兩件事：每支藥都有照片，
 * 而且照片真的在版控裡。
 */
import assert from "node:assert/strict";
import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";

import { ALL_DRUGS } from "../src/domain/drugs.js";

const SHOT_DIR = join(process.cwd(), "public", "drugs", "shot");

describe("the product photographs", () => {
	it("gives every product in the catalogue a shot", () => {
		for (const drug of ALL_DRUGS) {
			assert.ok(drug.shot, `${drug.name} must have a product photograph`);
			assert.match(drug.shot, /^\/drugs\/shot\/[\w.-]+\.jpg$/);
		}
	});

	it("has the file on disk for every product", () => {
		for (const drug of ALL_DRUGS) {
			const file = join(SHOT_DIR, drug.shot.split("/").pop());
			assert.ok(existsSync(file), `missing product photograph: ${file}`);
		}
	});

	it("keeps no picture that no product claims", () => {
		// An orphan is a picture the catalogue forgot, or one left over from a
		// product that was renamed. Either way it is a lie about the range.
		const claimed = new Set(ALL_DRUGS.map((d) => d.shot.split("/").pop()));
		for (const file of readdirSync(SHOT_DIR)) {
			assert.ok(claimed.has(file), `no product claims ${file}`);
		}
	});
});
