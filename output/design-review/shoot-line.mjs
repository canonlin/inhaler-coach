/** Screenshot the LINE mockup and the LIFF pages for review as pictures. */
import { chromium } from "playwright";

const BASE = process.env.BASE ?? "http://localhost:4185";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 1000 } });

await page.goto(`${BASE}/line-mockup`, { waitUntil: "networkidle" });
await page.waitForTimeout(700);
await page.screenshot({
	path: "output/design-review/shot-line-1-register.png",
});

// Journey quiz scenario links out to the real page; shoot the page itself.
await page.goto(`${BASE}/line/quiz`, { waitUntil: "networkidle" });
await page.waitForTimeout(500);
await page.click("button:has-text('深、快、用力吸氣')");
await page.waitForTimeout(400);
await page.screenshot({ path: "output/design-review/shot-line-2-quiz.png" });

// The D28 push, the only message carrying the ICS reminder.
await page.goto(`${BASE}/line-mockup`, { waitUntil: "networkidle" });
await page.waitForTimeout(500);
await page.click("button:has-text('⑥ D28')");
await page.waitForTimeout(400);
await page.screenshot({ path: "output/design-review/shot-line-3-d28.png" });

console.log("wrote 3 screenshots");
await browser.close();
