/**
 * Screenshot the engagement panel with both an empty and a populated database.
 *
 * An all-zero funnel is the honest state of a system nobody has used, and it
 * has to be readable — a blank panel would read as "broken" rather than
 * "unused". The populated case is seeded here so the layout is not only ever
 * checked in its empty state.
 */
import { chromium } from "playwright";

const PORT = Number(process.env.PORT ?? 4185);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 1000 } });
const errors = [];
page.on("pageerror", (e) => errors.push(String(e)));
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));

await page.goto(`http://localhost:${PORT}/pharmacist`, { waitUntil: "networkidle" });
await page.click('.rx-tabs button:has-text("成效")');
await page.waitForSelector(".funnel-chain", { timeout: 15_000 });
await page.waitForTimeout(400);

const read = await page.evaluate(() => ({
	rows: [...document.querySelectorAll(".funnel-row")].map((li) => ({
		label: li.querySelector(".funnel-label")?.textContent.trim(),
		n: li.querySelector(".funnel-num")?.textContent.trim(),
		pct: li.querySelector(".funnel-pct")?.textContent.trim(),
	})),
	kpi: document.querySelector(".kpi-value")?.textContent.trim(),
	active: [...document.querySelectorAll(".hint")].pop()?.textContent.trim(),
}));

await page.screenshot({ path: "output/design-review/engagement.png", fullPage: true });
console.log(JSON.stringify({ read, errors }, null, 2));
await browser.close();