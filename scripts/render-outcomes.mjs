/**
 * Render the outcomes view against the local API and save a screenshot.
 * Verifies the page loads real data and lays out without overflow.
 *
 * This was written when outcomes lived at /admin. There is no separate
 * management end — it is a tab inside the pharmacist app, so this drives that.
 *
 * Run: PORT=4185 node scripts/render-outcomes.mjs
 */
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(HERE, "../output/design-review");
mkdirSync(OUT, { recursive: true });

const PORT = Number(process.env.PORT ?? 4185);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

const errors = [];
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
page.on("pageerror", (e) => errors.push(String(e)));

await page.goto(`http://localhost:${PORT}/pharmacist`, {
	waitUntil: "networkidle",
});
await page.click('.rx-tabs button:has-text("成效")');
await page.waitForSelector(".verdict", { timeout: 15000 });

const verdict = await page.textContent(".verdict-number");
const heading = await page.textContent("h1");
const steps = await page.$$eval(".steps tbody tr", (rows) => rows.length);
const hasHorizontalScroll = await page.evaluate(
	() =>
		document.documentElement.scrollWidth >
		document.documentElement.clientWidth + 1,
);

console.log("heading      :", heading?.trim());
console.log("verdict      :", verdict?.replace(/\s+/g, " ").trim());
console.log("step rows    :", steps);
console.log(
	"h-scroll     :",
	hasHorizontalScroll ? "YES (layout bug)" : "none",
);
console.log("console errs :", errors.length ? errors.slice(0, 5) : "none");

await page.screenshot({ path: `${OUT}/outcomes-1280.png`, fullPage: true });

await page.setViewportSize({ width: 390, height: 844 });
await page.waitForTimeout(300);
const mobileScroll = await page.evaluate(
	() =>
		document.documentElement.scrollWidth >
		document.documentElement.clientWidth + 1,
);
console.log("h-scroll@390 :", mobileScroll ? "YES (layout bug)" : "none");
await page.screenshot({ path: `${OUT}/outcomes-390.png`, fullPage: true });

await browser.close();
console.log(`\nwrote ${OUT}/outcomes-1280.png and outcomes-390.png`);
process.exit(errors.length || hasHorizontalScroll || mobileScroll ? 1 : 0);
