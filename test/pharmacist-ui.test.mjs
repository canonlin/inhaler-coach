/**
 * The pharmacist end is one app, not two roles.
 *
 * Outcomes used to live at /admin — a separate "management" end for a role that
 * does not exist. The pharmacist records the cases and reads the outcomes, so
 * those are two views of one job. This test drives the merged app so the split
 * cannot quietly come back.
 *
 * It starts its own servers: node's test runner auto-discovers this file, and a
 * test that needs a server someone forgot to start would fail for the wrong
 * reason — or worse, get skipped, which is the exact failure this project just
 * spent a day removing.
 */
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { createPool } from "../api/db.mjs";

let pool;
const getPool = async () => (pool ??= createPool(process.env.DATABASE_URL));
import { after, before, describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const API_PORT = 4193;
const WEB_PORT = 4195;
const BASE = `http://localhost:${WEB_PORT}`;
/** Select by accessible name, not by class name: a stylesheet rename must not
 *  break a test that is asserting the navigation still has an address. */
const NAV = 'nav[aria-label="藥師工作區"]';
const NAV_A = `${NAV} a`;
/** The open follow-up queue, addressed by its caption. */
/*
 * Addressed by test id rather than :text(). The :text() pseudo-class is
 * Playwright's own and does not exist inside page.evaluate, so a selector using
 * it resolves under $$eval and then silently never matches in the browser —
 * which is what made the close test time out at 30s with no error.
 */
const QUEUE_ROWS = "[data-testid=followup-queue] tbody tr";
/** Spawned as `node vite.js`, never through `bunx` — see the note in before(). */
const VITE_BIN = resolve(ROOT, "node_modules/vite/bin/vite.js");

const started = [];
const consoleErrors = [];
let page;
let browser;

/** Start a server and wait until it answers, rather than sleeping a fixed time. */
async function serve(name, cmd, args, url, env = {}) {
	const proc = spawn(cmd, args, {
		cwd: ROOT,
		env: { ...process.env, ...env },
		stdio: "ignore",
		// detached puts the child in its own process group, so one kill() reaches
		// vite's own subprocesses instead of leaving the port held.
		detached: true,
	});
	// unref is the part that actually matters: without it the child keeps the
	// event loop alive and `node --test` never exits, even though every
	// assertion passed. The tests looked green while the runner hung.
	proc.unref();
	started.push(proc);
	const deadline = Date.now() + 60_000;
	while (Date.now() < deadline) {
		try {
			const res = await fetch(url);
			if (res.ok || res.status === 404) return;
		} catch {
			// not up yet
		}
		await new Promise((r) => setTimeout(r, 250));
	}
	throw new Error(`${name} did not start: ${url}`);
}

// bunx is a wrapper: the pid it hands back is bun's, not vite's, so killing it
// leaves vite holding the port and the runner waiting on a child that never
// exits. vite is therefore spawned as node with its bin script directly.
before(async () => {
	if (!process.env.DATABASE_URL) {
		throw new Error("DATABASE_URL is required; the verdict is read from a real database");
	}
	// dev-api reads PORT itself, so it has to arrive through the environment.
	await serve("api", process.execPath, ["scripts/dev-api.mjs"], `http://localhost:${API_PORT}/api/health`, {
		PORT: String(API_PORT),
	});
	await serve("web", process.execPath, [VITE_BIN, "--port", String(WEB_PORT), "--strictPort"], `${BASE}/`, {
		VITE_API_PROXY: `http://localhost:${API_PORT}`,
	});

	const { chromium } = await import("playwright");
	browser = await chromium.launch();
	page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
	page.on("pageerror", (e) => consoleErrors.push(String(e)));
	page.on("console", (m) => m.type() === "error" && consoleErrors.push(m.text()));
	await page.goto(`${BASE}/admin`, { waitUntil: "networkidle" });

	// The outcomes view summarises every case in the database, so this test has
	// to own the database state to assert anything about it. Both other
	// database-backed files truncate on entry; without truncating here too, this
	// test passes alone over leftover rows and reports numbers that are not its
	// own. Three separate times this suite looked green because it was reading
	// ambient data.
	const p = await getPool();
	await p.query(
		"TRUNCATE followups, physician_queries, session_stages, sessions, case_knowledge, case_steps, clinical_measurements, med_reconciliation, cases, patients RESTART IDENTITY CASCADE",
	);

	await post("/api/cases", {
		mrn: "UI0000001",
		caseDate: "2026-05-04",
		pharmacist: "黃永成",
		drug: "Symbicort",
		qccStage: "改善前",
		timepoint: "M0",
		steps: { MDI_壓: "錯誤", MDI_吸: "錯誤" },
	});
	await post("/api/cases", {
		// Same record number as the baseline case, so this patient is measured
		// twice and the page has something it can actually test. With two
		// different patients there is no paired comparison, which is the state
		// the page refuses to headline — and a test that never reached that
		// state would not notice the headline disappearing.
		mrn: "UI0000001",
		caseDate: "2026-06-04",
		pharmacist: "黃永成",
		drug: "Symbicort",
		qccStage: "改善後",
		timepoint: "M1",
		steps: { MDI_壓: "正確", MDI_吸: "正確" },
	});
});

/** POST to the API this test started. */
async function post(path, body) {
	const res = await fetch(`http://localhost:${API_PORT}${path}`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(body),
	});
	if (!res.ok) throw new Error(`seed ${path}: HTTP ${res.status} ${await res.text()}`);
}

// `started` holds only the spawned servers. A Playwright browser has no pid and
// must be closed through its own API; pushing it into `started` and calling
// process.kill on it did nothing, which left an orphaned Chromium holding the
// port for the next run to collide with.
after(async () => {
	await browser?.close();
	for (const p of started) {
		if (p.pid) {
			try {
				process.kill(-p.pid, "SIGTERM");
			} catch {
				p.kill?.();
			}
		}
	}
});

describe("pharmacist tabs", () => {
	it("has one set of tabs, not two apps", async () => {
		const tabs = await page.$$eval(NAV_A, (n) => n.map((x) => x.textContent.trim()));
		assert.deepEqual(tabs, ["收案評估", "追蹤清單", "成效"]);
		assert.equal(await page.$$eval(NAV, (n) => n.length), 1, "one nav, not two");
	});

	it("shows the outcomes inside the pharmacist app", async () => {
		await page.click(`${NAV} a:has-text("成效")`);
		await page.waitForSelector("[data-testid=outcome-summary]", { timeout: 15_000 });
		assert.equal((await page.textContent("h1"))?.trim(), "成效");
		assert.equal(await page.$$eval(NAV, (n) => n.length), 1);
	});

	/*
	 * The headline only appears when the same people were measured twice.
	 * Testing the page only in the testable state would let the headline grow
	 * back over unpaired data without anything failing, so both states are
	 * asserted here: paired → the comparison, unpaired → an explicit refusal.
	 */
	it("renders a summary built from the cases this test created", async () => {
		// One patient measured before (2/2 steps wrong) and after (0/2 wrong).
		// The figures themselves are asserted in the metrics tests; here the
		// point is that they come from the database and reach the page.
		const headline = (
			await page.textContent("[data-testid=error-rate-headline]")
		)?.replace(/\s+/g, " ").trim();
		assert.match(headline ?? "", /100%\s*→\s*0%/, `got ${headline}`);

		// The paired test is the condition that earns the headline; if it is
		// missing, the number above is being displayed without support.
		const support = (await page.textContent("[data-testid=error-rate-support]")) ?? "";
		assert.match(support, /配對 1 人/, `got ${support}`);
		assert.match(support, /改善 1 · 退步 0/);
	});

	it("refuses to headline a rate it cannot test", async () => {
		// 改善前 only: there is no "after" cohort, so no comparison exists.
		await page.selectOption("#stage", "改善前");
		await page.waitForFunction(
			() => document.querySelector("#stage")?.value === "改善前",
			{ timeout: 5000 },
		);
		await page.waitForTimeout(400);

		// The band itself is always present; what must not appear is a rate.
		assert.ok(
			await page.$("[data-testid=outcome-summary]"),
			"the summary band stays; only the unsupported rate is withheld",
		);
		assert.equal(
			await page.$("[data-testid=error-rate-headline]"),
			null,
			"no headline rate when the two cohorts cannot be compared",
		);
		const blocked = (await page.textContent("[data-testid=error-rate-blocked]")) ?? "";
		assert.match(blocked, /還不能下結論/);

		const tile = (await page.textContent("[data-testid=outcome-summary]")) ?? "";
		assert.match(tile, /改善前 1 例、改善後 0 例/);

		// Leave the filter as found for the tests that follow.
		await page.selectOption("#stage", "");
		await page.waitForTimeout(300);
	});

	/*
	 * The overview must not make the reader confirm the same figure twice. The
	 * band carries enrolment, error rate, follow-up completion and weekly
	 * actives; the panels below carry the step distribution and usage chains.
	 * If a number drifts back into both places, this catches it.
	 */
	it("shows each headline number once", async () => {
		const band = (await page.textContent("[data-testid=outcome-summary]")) ?? "";
		const rest = (
			await page.textContent("main") // eslint-disable-line
		)?.replace(band, "") ?? "";

		// 追蹤完成率 and 近 7 天 belong to the band; the detail panels below
		// should not restate either.
		assert.doesNotMatch(rest, /追蹤完成率/);
		assert.doesNotMatch(rest, /近 7 天活躍/);
	});

	/*
	 * `body { overflow: hidden }` existed for the 3D coaching loop and made every
	 * page in this app unreachable below the fold. Nothing caught it because
	 * each assertion read text that was already on screen — a page that cannot
	 * scroll still renders everything above the fold, perfectly.
	 *
	 * Measured rather than asserted: scroll the window and compare. A test that
	 * only checks the body is taller than the viewport would pass here, since
	 * that was true; the missing half is whether scrolling actually moves.
	 */
	it("can scroll to content below the fold", async () => {
		const results = [];
		for (const path of ["/admin", "/admin/followups", "/admin/outcomes"]) {
			await page.goto(`${BASE}${path}`, { waitUntil: "networkidle" });
			// Settle the fetch and the async chart before measuring.
			await page.waitForTimeout(400);

			const m = await page.evaluate(async () => {
				const de = document.documentElement;
				const before = window.scrollY;
				window.scrollTo(0, 999999);
				await new Promise((r) =>
					requestAnimationFrame(() => requestAnimationFrame(r)),
				);
				const moved = window.scrollY - before;
				window.scrollTo(0, 0);
				return {
					overflow: getComputedStyle(document.body).overflowY,
					overflowing: de.scrollHeight - de.clientHeight,
					moved,
				};
			});

			results.push({ path, ...m });
			assert.notEqual(
				m.overflow,
				"hidden",
				`${path}: body must not clip the document, or content below the fold is unreachable`,
			);
			// Only assert movement where there is something below the fold.
			if (m.overflowing > 0) {
				assert.ok(
					m.moved > 0,
					`${path}: ${m.overflowing}px of content sits below the fold but the page did not scroll`,
				);
			}
		}
		// Guard the test itself: if every page ever fits the viewport, the check
		// above passes vacuously and stops testing anything.
		assert.ok(
			results.some((r) => r.overflowing > 0),
			"expected at least one pharmacist page to exceed the viewport",
		);
	});

	it("starts case entry at one field again", async () => {
		await page.click(`${NAV} a:has-text("收案評估")`);
		await page.waitForSelector("#mrn", { timeout: 10_000 });
		// The record number is the only control on arrival; choosing the product
		// and judging the camera-visible steps are what used to cost 25 taps.
		const controls = await page.$$eval(
			'main input, main select, main button',
			(n) => n.length,
		);
		assert.equal(controls, 1, `case entry should open with one control, got ${controls}`);
	});

	it("closes a follow-up and takes it off the queue", async () => {
		// Work out how many rows are open, then close one for real through the
		// button the pharmacist uses. A function that works while its button does
		// nothing is not a feature.
		await page.click(`${NAV} a:has-text("追蹤清單")`);
		await page.waitForSelector(QUEUE_ROWS, { timeout: 15_000 });
		const before = await page.$$eval(QUEUE_ROWS, (n) => n.length);
		assert.ok(before > 0, "the seeded data must produce an open follow-up to close");

		await page.evaluate((n) => {
			window.__before = n;
		}, before);
		// By exact accessible name: "完成" also matches "未完成".
		await page.getByRole("button", { name: /標記為完成$/ }).first().click();
		await page.waitForFunction(
			(sel) => document.querySelectorAll(sel).length === window.__before - 1,
			QUEUE_ROWS,
			{ timeout: 15_000 },
		);
		const after = await page.$$eval(QUEUE_ROWS, (n) => n.length);
		assert.equal(after, before - 1, "the row must leave the queue");

		const banner = (await page.textContent("[data-testid=followup-tally]")) ?? "";
		assert.match(banner, /今天已完成 1 件/);
	});

	it("records who closed it, in the database", async () => {
		const res = await fetch(`http://localhost:${API_PORT}/api/followups`);
		const { ok } = await res.json();
		assert.equal(ok, true);
		// The closed row is gone from the open list; confirm it is stored as
		// closed rather than deleted.
		const pool = await getPool();
		const { rows } = await pool.query(
			`SELECT count(*)::int AS n FROM followups
			 WHERE status <> 'open' AND completed_by IS NOT NULL AND completed_at IS NOT NULL`,
		);
		assert.ok(rows[0].n >= 1, "a close must be attributable and timed");
	});

	it("has no page errors", () => {
		assert.deepEqual(consoleErrors, []);
	});
});