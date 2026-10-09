/**
 * Render the incumbent prototype so the redesign is based on the seen result,
 * not on the source code. Writes to output/design-review/.
 *
 * Usage: node scripts/render-incumbent.mjs
 */
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(HERE, "../output/design-review");
const SRC = process.env.PROTOTYPE_HTML;

if (!SRC) {
	console.error("set PROTOTYPE_HTML to the extracted prototype path");
	process.exit(2);
}

mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
await page.goto(`file://${SRC}`);
await page.waitForTimeout(600);

// The prototype persists the active tab in localStorage; force each one.
for (const tab of ["form", "edu", "dash", "follow", "set"]) {
	await page.evaluate((t) => window.show(t), tab);
	await page.waitForTimeout(700);
	await page.screenshot({ path: `${OUT}/incumbent-${tab}.png`, fullPage: true });
	const headings = await page.$$eval("section.panel:not([hidden]) h2, section.panel:not([hidden]) h3", (ns) =>
		ns.map((n) => n.textContent.trim()),
	);
	console.log(`${tab}: ${headings.length} headings -> ${headings.join(" | ")}`);
}

await browser.close();
console.log(`\nwrote ${OUT}`);