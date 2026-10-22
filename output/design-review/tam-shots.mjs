/**
 * Screenshot the pharmacist tabs after the TAM fixes, so the review is of what
 * the pharmacist actually sees rather than of the diff.
 *
 * Run: PORT=4185 node output/design-review/tam-shots.mjs
 */
import { chromium } from "playwright";

const PORT = Number(process.env.PORT ?? 4185);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
const errors = [];
page.on("pageerror", (e) => errors.push(String(e)));
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));

await page.goto(`http://localhost:${PORT}/pharmacist`, {
	waitUntil: "networkidle",
});

await page.click('.rx-tabs button:has-text("追蹤清單")');
await page.waitForSelector(".fu-bar");
await page.waitForTimeout(400);
await page.screenshot({ path: "output/design-review/after-followups.png" });

// The "all" view should show more rows than the actionable default.
const today = await page.$$eval(".ck-table tbody tr", (n) => n.length);
await page.click('.fu-views button:has-text("全部未完成")');
await page.waitForTimeout(300);
const all = await page.$$eval(".ck-table tbody tr", (n) => n.length);
await page.screenshot({ path: "output/design-review/after-followups-all.png" });

await page.click('.rx-tabs button:has-text("成效")');
await page.waitForSelector(".steps");
await page.waitForTimeout(400);
const failing = await page.$$eval(".steps tbody tr", (n) => n.length);
await page.screenshot({ path: "output/design-review/after-outcomes.png" });
await page.click('button:has-text("顯示沒有錯的")');
await page.waitForTimeout(300);
const withClean = await page.$$eval(".steps tbody tr", (n) => n.length);
await page.screenshot({ path: "output/design-review/after-outcomes-all.png" });

// Controls on the queue, recounted after the change.
await page.click('.rx-tabs button:has-text("追蹤清單")');
await page.click('.fu-views button:has-text("全部未完成")');
await page.waitForTimeout(300);
const queue = await page.evaluate(() => ({
	rows: document.querySelectorAll(".ck-table tbody tr").length,
	selectsInTable: document.querySelectorAll(".ck-table select").length,
	selectsOnPage: document.querySelectorAll("select").length,
	controls:
		document.querySelectorAll(".ck-table button").length +
		document.querySelectorAll("select").length,
}));

console.log(
	JSON.stringify(
		{
			followupsToday: today,
			followupsAll: all,
			failingSteps: failing,
			allSteps: withClean,
			queue,
			errors,
		},
		null,
		2,
	),
);
await browser.close();
