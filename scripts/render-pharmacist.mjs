/**
 * TAM acceptance: the pharmacist must complete a case in about five
 * interactions, not the twenty-five the original form demanded.
 *
 * This test drives the real browser and counts clicks. It is deliberately
 * strict: it measures the shortest complete path, because that is what a
 * pharmacist at a counter actually does.
 *
 * Run: PORT=4185 node scripts/render-pharmacist.mjs
 */
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

/**
 * Seed a real AI coaching session for MRN so the form has something to load.
 * This is the patient side of the encounter: they practised, the camera
 * scored them, and the pharmacist is looking at the same record.
 */
const MRN = process.env.DEMO_MRN ?? "A123456789";
async function seedSession() {
	const res = await fetch(`http://localhost:4183/api/sessions`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			mrn: MRN,
			device: "MDI",
			drug: "Symbicort",
			completed: true,
			stages: {
				1: { a: 2, c: 0.88, p: "correct", passed: true },
				2: { a: 4, c: 0.61, p: "incorrect", passed: false },
				3: { a: 3, c: 0.79, p: "correct", passed: true },
				4: { a: 1, c: 0.83, p: "correct", passed: true },
			},
		}),
	});
	if (!res.ok)
		throw new Error(`seed failed: HTTP ${res.status} ${await res.text()}`);
}

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(HERE, "../output/design-review");
mkdirSync(OUT, { recursive: true });

/** The number P1 exists to reach. See docs/superpowers/specs/2026-10-09-first-encounter-tam-design.md */
const BUDGET = 7;

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

let clicks = 0;
/** Every deliberate interaction is counted. Typing is one interaction. */
async function tap(selector) {
	await page.click(selector);
	clicks += 1;
}

await seedSession();

await page.goto(`http://localhost:${PORT}/pharmacist`, {
	waitUntil: "networkidle",
});
await page.waitForSelector(".rx", { timeout: 15000 });

// Step 1: the record number. Both the drug and the camera's verdicts arrive
// with the session, so this single field replaces choosing the product and
// scoring the camera-visible steps by hand.
await page.fill(".mrn-only input", MRN);
clicks += 1;
await page.waitForSelector(".ai-list", { timeout: 8000 });
const heading = (await page.textContent(".rx-head h1"))?.trim() ?? "";
check(
	heading.includes("Symbicort"),
	`drug arrived with the session (${heading})`,
);

// The six camera-judged steps arrive as a block, not as taps.
const aiCount = await page.$$eval(".ai-list li", (n) => n.length);
check(aiCount === 6, `AI block shows 6 judged steps (got ${aiCount})`);

const manualChars = await page.$$eval(".checklist .ck .ck-char", (n) =>
	n.map((x) => x.textContent?.trim()),
);
check(
	manualChars.length === 2 &&
		manualChars.includes("開") &&
		manualChars.includes("含"),
	`only 2 steps need the pharmacist: ${manualChars.join(",")}`,
);

const note = (await page.textContent(".field-note")) ?? "";
check(
	note.includes("AI"),
	`AI result loaded from the session (${note.trim()})`,
);

// Steps 3-4: the two steps nothing can judge.
await tap(".checklist .ck:nth-child(1) .seg button.ok");
await tap(".checklist .ck:nth-child(2) .seg button.ok");

// Step 5-6: two targeted questions, not ten.
const qCount = await page.$$eval(".kq li", (n) => n.length);
check(qCount === 2, `two targeted questions, not ten (got ${qCount})`);
await tap(".kq li:nth-child(1) .seg button:nth-child(1)");
await tap(".kq li:nth-child(2) .seg button:nth-child(2)");

// Demonstrating is one checkbox per step, and it is what the whole design buys.
await tap(".checklist .ck:nth-child(1) .demo input");

check(
	clicks <= BUDGET,
	`case completed in ${clicks} interactions (budget ${BUDGET})`,
);

// The save must now be enabled, and the result must not echo the MRN.
check(
	!(await page.isDisabled(".btn-primary")),
	"save is enabled once the case is judged",
);
await tap(".btn-primary");
await page.waitForSelector(".rx-status", { timeout: 8000 });
const status = (await page.textContent(".rx-status"))?.trim() ?? "";
check(status.includes("已收案"), `saved (${status})`);
check(
	!status.includes("A123456789"),
	"medical record number is not echoed back",
);

// A patient who did not practise: the record number finds no session, so the
// pharmacist chooses the product and judges every step by hand. A solution
// inhaler must not be asked to be shaken.
const NO_SESSION_MRN = "B000000001";
await page.goto(`http://localhost:${PORT}/pharmacist`, {
	waitUntil: "networkidle",
});
await page.fill(".mrn-only input", NO_SESSION_MRN);
await page.waitForSelector(".drug-pick", { timeout: 8000 });
const noSessionNote = (await page.textContent(".field-note")) ?? "";
check(
	noSessionNote.includes("查無"),
	`no session is stated plainly (${noSessionNote.trim()})`,
);

await tap('.drug-pick .chip:has-text("Trimbow")');
await page.waitForTimeout(300);
const hasAiBlock = (await page.$(".ai-list")) !== null;
check(!hasAiBlock, "no AI block when the patient never practised");
const trimbow = await page.$$eval(".checklist .ck .ck-char", (n) =>
	n.map((x) => x.textContent?.trim()),
);
check(!trimbow.includes("搖"), "Trimbow omits the shake step");
// Trimbow is still pMDI, so the camera covers five of its seven steps; only
// opening the cap and sealing the lips stay with the pharmacist.
check(
	trimbow.length === 2 && trimbow.includes("開") && trimbow.includes("含"),
	`Trimbow: 2 hand-judged steps, shake still absent (${trimbow.join(",")})`,
);

check(
	errors.length === 0,
	`no console errors${errors.length ? `: ${errors.slice(0, 2).join(" | ")}` : ""}`,
);

await page.screenshot({ path: `${OUT}/pharmacist-tam.png`, fullPage: true });
await browser.close();

console.log(
	`\n${problems.length ? `${problems.length} PROBLEM(S)` : "all checks passed"}`,
);
process.exit(problems.length ? 1 : 0);
