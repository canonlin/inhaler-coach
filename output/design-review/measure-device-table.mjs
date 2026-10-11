/**
 * Measure the device table instead of judging it from a screenshot.
 *
 * The previous version counted lines by dividing an element's height by its
 * line-height, which counts padding as extra lines and reported every cell as
 * wrapping. Line boxes are counted properly here with a Range, which returns one
 * rect per rendered line.
 *
 * Reports: anything below the type scale's content floor, anything that renders
 * on more than one line, and how close the last line sits to the cell's bottom
 * edge — the gap is what "text sitting on the border" actually means.
 */
import { chromium } from "playwright";

const BASE = process.env.BASE ?? "http://localhost:4185";
const FLOOR = 16;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 960 } });
await page.goto(`${BASE}/admin/outcomes`, { waitUntil: "networkidle" });
await page.waitForSelector("[data-testid=device-compare]", { timeout: 20_000 });
await page.waitForTimeout(600);

const report = await page.evaluate((floor) => {
	const table = document.querySelector("[data-testid=device-compare]");
	const out = { small: [], wrapping: [], tight: [] };

	for (const el of table.querySelectorAll("th,td,p,span")) {
		const text = el.textContent?.trim();
		// Only leaf-ish elements, so a cell and its child are not both counted.
		if (!text || el.querySelector("th,td")) continue;

		const cs = getComputedStyle(el);
		const size = parseFloat(cs.fontSize);
		if (size < floor) {
			out.small.push({ text: text.slice(0, 30), size, cls: String(el.className).slice(0, 60) });
		}

		// One client rect per rendered line box.
		const range = document.createRange();
		range.selectNodeContents(el);
		const rects = [...range.getClientRects()].filter((r) => r.height > 1);
		const lines = new Set(rects.map((r) => Math.round(r.top))).size;
		if (lines > 1) {
			out.wrapping.push({ text: text.slice(0, 30), lines, size });
		}

		// Distance from the last line box to the bottom of the row.
		const row = el.closest("tr");
		if (row && rects.length) {
			const lastBottom = Math.max(...rects.map((r) => r.bottom));
			const rowBox = row.getBoundingClientRect();
			const gap = Math.round(rowBox.bottom - lastBottom);
			if (gap < 6) {
				out.tight.push({ text: text.slice(0, 30), gapPx: gap });
			}
		}
	}
	return out;
}, FLOOR);

console.log(`\n內容字級下限 ${FLOOR}px\n`);
for (const [label, rows] of [
	["小於下限", report.small],
	["斷行", report.wrapping],
	["離列底 < 6px（「黏在 border」）", report.tight],
]) {
	console.log(`── ${label} ──`);
	console.log(rows.length ? rows : "（無）");
	console.log();
}

await browser.close();