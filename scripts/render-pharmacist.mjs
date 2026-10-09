/**
 * Render the pharmacist end and exercise the checklist against the API.
 * Fails on console errors, horizontal overflow, or a checklist that does not
 * match what the spine says a drug needs.
 *
 * Run: PORT=4185 node scripts/render-pharmacist.mjs
 */
import { mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { chromium } from "playwright";

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(HERE, "../output/design-review");
mkdirSync(OUT, { recursive: true });

const PORT = Number(process.env.PORT ?? 4185);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 1000 } });

const errors = [];
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
page.on("pageerror", (e) => errors.push(String(e)));

const problems = [];
const check = (ok, msg) => {
	console.log(`${ok ? "ok  " : "FAIL"} ${msg}`);
	if (!ok) problems.push(msg);
};

await page.goto(`http://localhost:${PORT}/pharmacist`, { waitUntil: "networkidle" });
await page.waitForSelector(".rx", { timeout: 15000 });

check((await page.textContent("h1"))?.includes("記錄這一筆"), "case entry renders");

// A patient id and a drug are required before the checklist appears.
await page.fill('.field input[inputmode="numeric"]', "A123456789");
await page.selectOption(".rx-side select >> nth=0", "Symbicort");
await page.waitForSelector(".ck-list .ck", { timeout: 5000 });

const steps = await page.$$eval(".ck-list .ck", (rows) =>
	rows.map((r) => ({
		char: r.querySelector(".ck-char")?.textContent?.trim(),
		critical: Boolean(r.querySelector(".crit")),
	})),
);
check(steps.length === 8, `Symbicort shows 8 steps (got ${steps.length})`);
check(
	steps.filter((s) => s.critical).map((s) => s.char).join("") === "搖吐含壓吸閉",
	"critical steps are 搖吐含壓吸閉",
);

// Trimbow is a solution: the shake step must not be offered.
await page.selectOption(".rx-side select >> nth=0", "Trimbow");
await page.waitForTimeout(300);
const trimbow = await page.$$eval(".ck-list .ck .ck-char", (n) => n.map((x) => x.textContent?.trim()));
check(!trimbow.includes("搖"), "Trimbow omits the shake step (solution type)");
check(trimbow.length === 7, `Trimbow shows 7 steps (got ${trimbow.length})`);

// A non-steroid product drops the rinse step.
await page.selectOption(".rx-side select >> nth=0", "Ventolin");
await page.waitForTimeout(300);
const ventolin = await page.$$eval(".ck-list .ck .ck-char", (n) => n.map((x) => x.textContent?.trim()));
check(!ventolin.includes("漱"), "Ventolin omits the rinse step (no ICS)");
check(ventolin.includes("搖"), "Ventolin keeps the shake step");

await page.selectOption(".rx-side select >> nth=0", "Symbicort");
await page.waitForTimeout(300);

// Save stays disabled until every step is judged.
const disabledBefore = await page.isDisabled(".btn-primary");
check(disabledBefore, "save is disabled before the checklist is complete");
for (const ok of await page.$$(".ck-list .ck .seg button.ok")) await ok.click();
const disabledAfter = await page.isDisabled(".btn-primary");
check(!disabledAfter, "save enables once every step is judged");

await page.click(".btn-primary");
await page.waitForSelector(".rx-status", { timeout: 8000 });
const status = (await page.textContent(".rx-status"))?.trim();
check(Boolean(status?.includes("已收案")), `save succeeded (${status})`);
check(!status?.includes("A123456789"), "the medical record number is not echoed back");

await page.screenshot({ path: `${OUT}/pharmacist-1280.png`, fullPage: true });
await page.setViewportSize({ width: 390, height: 844 });
await page.waitForTimeout(300);
const scroll = await page.evaluate(
	() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
);
check(!scroll, "no horizontal overflow at 390");
await page.screenshot({ path: `${OUT}/pharmacist-390.png`, fullPage: true });

// The follow-up tab must load without error even with an empty queue.
await page.setViewportSize({ width: 1280, height: 1000 });
await page.click('.rx-tabs button:has-text("追蹤清單")');
await page.waitForTimeout(800);
check(Boolean(await page.textContent(".rx-main")), "follow-up tab renders");

check(errors.length === 0, `no console errors${errors.length ? `: ${errors.slice(0, 3).join(" | ")}` : ""}`);

await browser.close();
console.log(`\n${problems.length ? `${problems.length} PROBLEM(S)` : "all checks passed"}`);
console.log(`wrote ${OUT}/pharmacist-1280.png and pharmacist-390.png`);
process.exit(problems.length ? 1 : 0);