/**
 * TAM audit of the pharmacist end. Drives the real screens and reports what a
 * pharmacist actually has to look at and click, so the audit is measured rather
 * than remembered.
 *
 * Run: PORT=4185 node output/design-review/tam-audit.mjs
 */
import { chromium } from "playwright";

const PORT = Number(process.env.PORT ?? 4185);
const BASE = `http://localhost:${PORT}`;
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 1000 } });

const out = {};
await page.goto(`${BASE}/pharmacist`, { waitUntil: "networkidle" });

// ── 收案評估 ──────────────────────────────────────────────────────────────
out.caseEntry_first_screen = await page.evaluate(() => ({
	inputs: document.querySelectorAll(".rx input, .rx select").length,
	buttons: document.querySelectorAll(".rx button").length,
	hint: document.querySelector(".rx-head .hint")?.textContent.trim(),
}));

await page.fill(".mrn-only input", "NOTEST001");
await page.waitForSelector(".drug-pick");
out.caseEntry_no_session = await page.evaluate(() => ({
	note: document.querySelector(".field-note")?.textContent.trim(),
	drugChoices: document.querySelectorAll(".drug-pick .chip").length,
}));

await page.click('.drug-pick .chip:has-text("Symbicort")');
await page.waitForSelector(".checklist");
out.caseEntry_after_drug = await page.evaluate(() => ({
	manualSteps: [...document.querySelectorAll(".checklist .ck .ck-char")].map(
		(n) => n.textContent.trim(),
	),
	questions: document.querySelectorAll(".kq li").length,
	knowledgeCorrect: document.querySelectorAll(".kq button").length / 2,
	stepControls: document.querySelectorAll(".checklist button, .checklist input")
		.length,
	aiBlock: Boolean(document.querySelector(".ai-list")),
	saveDisabled: document.querySelector(".btn-primary")?.disabled,
	saveLabel: document.querySelector(".btn-primary")?.textContent.trim(),
	progress: document.querySelector(".rx-progress")?.textContent.trim(),
}));
await page.screenshot({
	path: "output/design-review/tam-entry-nodata.png",
	fullPage: true,
});

// ── 追蹤清單 ──────────────────────────────────────────────────────────────
await page.click('.rx-tabs button:has-text("追蹤清單")');
await page.waitForSelector(".ck-table tbody tr");
out.followups = await page.evaluate(() => {
	const rows = [...document.querySelectorAll(".ck-table tbody tr")];
	return {
		rows: rows.length,
		controlsPerRow: rows[0].querySelectorAll("select,button").length,
		totalControls: document.querySelectorAll(
			".ck-table select,.ck-table button",
		).length,
		overdue: rows.filter((r) => r.className === "overdue").length,
		dueSoon: rows.filter((r) => r.className === "soon").length,
		distinctTasks: [
			...new Set(rows.map((r) => r.children[3].textContent.trim())),
		],
		filters: document.querySelectorAll(
			".rx-tabs ~ * select, .rx-tabs ~ * button",
		).length,
		grouping:
			document.querySelectorAll(".ck-table tbody tr").length ===
			document.querySelectorAll("tbody").length
				? "none"
				: "multiple",
	};
});

// ── 成效 ──────────────────────────────────────────────────────────────────
await page.click('.rx-tabs button:has-text("成效")');
await page.waitForSelector(".verdict");
out.outcomes = await page.evaluate(() => ({
	verdict: document
		.querySelector(".verdict-number")
		?.textContent.replace(/\s+/g, " ")
		.trim(),
	stepRows: document.querySelectorAll(".steps tbody tr").length,
	stepRowsAtZero: [...document.querySelectorAll(".steps tbody tr")].filter(
		(r) => r.textContent.includes("0 /"),
	).length,
}));

console.log(JSON.stringify(out, null, 2));
await browser.close();
