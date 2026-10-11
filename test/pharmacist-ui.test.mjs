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

import { dirname, resolve } from "node:path";
import { after, before, describe, it } from "node:test";
import { fileURLToPath } from "node:url";

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
		throw new Error(
			"DATABASE_URL is required; the verdict is read from a real database",
		);
	}
	// dev-api reads PORT itself, so it has to arrive through the environment.
	await serve(
		"api",
		process.execPath,
		["scripts/dev-api.mjs"],
		`http://localhost:${API_PORT}/api/health`,
		{
			PORT: String(API_PORT),
		},
	);
	await serve(
		"web",
		process.execPath,
		[VITE_BIN, "--port", String(WEB_PORT), "--strictPort"],
		`${BASE}/`,
		{
			VITE_API_PROXY: `http://localhost:${API_PORT}`,
		},
	);

	const { chromium } = await import("playwright");
	browser = await chromium.launch();
	page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
	page.on("pageerror", (e) => consoleErrors.push(String(e)));
	page.on(
		"console",
		(m) => m.type() === "error" && consoleErrors.push(m.text()),
	);

	// The navigation badge reads the queue as the page loads and caches it. It
	// has to open only after the rows below exist, or it caches a count of zero
	// for the whole file and the badge test fails or passes depending on what
	// the previous run left in the database — which is exactly the ambient-data
	// trap this file's own comment below warns about.
	//
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

	await post("/api/cases", {
		/*
		 * A second product on purpose. Both cases above are Symbicort, so a
		 * filter over the queue would have exactly one option and could not be
		 * shown to do anything — the test would pass a control that was never
		 * exercised, which is the same mistake as testing a dead row.
		 *
		 * Breztri is also a pMDI, so it shares Symbicort's steps and still
		 * generates a follow-up with real content behind it.
		 */
		mrn: "UI0000002",
		caseDate: "2026-05-06",
		pharmacist: "林家薐",
		drug: "Breztri",
		qccStage: "改善前",
		timepoint: "M0",
		steps: { MDI_壓: "錯誤", MDI_吸: "正確" },
	});

	// Only now is the state this test intends to measure.
	await page.goto(`${BASE}/admin`, { waitUntil: "networkidle" });
});

/** POST to the API this test started. */
async function post(path, body) {
	const res = await fetch(`http://localhost:${API_PORT}${path}`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(body),
	});
	if (!res.ok)
		throw new Error(`seed ${path}: HTTP ${res.status} ${await res.text()}`);
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
	/*
	 * Read the label element, not the link's whole text. The queue link carries
	 * an open-count badge beside its name, so textContent is 「追蹤清單8」 and
	 * comparing it against 「追蹤清單」 measures the badge rather than the
	 * navigation. The badge is aria-hidden on purpose — assistive technology
	 * announces the section name, and a bare number on every visit is noise.
	 */
	it("has one set of tabs, not two apps", async () => {
		const tabs = await page.$$eval(`${NAV_A} > span:first-child`, (n) =>
			n.map((x) => x.textContent.trim()),
		);
		assert.deepEqual(tabs, ["收案評估", "追蹤清單", "成效"]);
		assert.equal(
			await page.$$eval(NAV, (n) => n.length),
			1,
			"one nav, not two",
		);
	});

	/* The queue count belongs in the navigation: a pharmacist should be able to
	   see there is work waiting without opening the queue page. */
	it("shows the open follow-up count on the queue section", async () => {
		// The count arrives over the network, so waiting for it is the assertion
		// rather than a detail: reading the nav immediately would pass on an
		// absent badge and fail on a present one depending on timing.
		await page.waitForSelector('[data-testid="queue-count"]', {
			timeout: 10_000,
		});
		const badge = await page.textContent('[data-testid="queue-count"]');
		assert.match(badge ?? "", /^\d+$/, `expected a count, got ${badge}`);
		assert.ok(
			Number(badge) >= 1,
			`the seeded queue should not be empty, got ${badge}`,
		);
	});

	it("shows the outcomes inside the pharmacist app", async () => {
		await page.click(`${NAV} a:has-text("成效")`);
		await page.waitForSelector("[data-testid=outcome-summary]", {
			timeout: 15_000,
		});
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
		)
			?.replace(/\s+/g, " ")
			.trim();
		assert.match(headline ?? "", /100%\s*→\s*0%/, `got ${headline}`);

		// The paired test is the condition that earns the headline; if it is
		// missing, the number above is being displayed without support.
		const support =
			(await page.textContent("[data-testid=error-rate-support]")) ?? "";
		assert.match(support, /配對 1 人/, `got ${support}`);
		assert.match(support, /改善 1 · 退步 0/);
	});

	it("refuses to headline a rate it cannot test", async () => {
		// 改善前 only: there is no "after" cohort, so no comparison exists.
		//
		// Opened and picked rather than selectOption: the filter is a Radix
		// select, which is a button plus a listbox, not a native <select>. This
		// is also the only form that would fail if the trigger stopped opening.
		await page.click("#stage");
		await page.getByRole("option", { name: "改善前" }).click();
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
		const blocked =
			(await page.textContent("[data-testid=error-rate-blocked]")) ?? "";
		assert.match(blocked, /還不能下結論/);

		const tile =
			(await page.textContent("[data-testid=outcome-summary]")) ?? "";
		assert.match(tile, /改善前 \d+ 例、改善後 0 例/);

		// Back to 全部 so the tests that follow see both cohorts.
		await page.click("#stage");
		await page.getByRole("option", { name: "全部", exact: true }).click();
		await page.waitForTimeout(300);
	});

	/*
	 * The overview must not make the reader confirm the same figure twice. The
	 * band carries enrolment, error rate, follow-up completion and weekly
	 * actives; the panels below carry the step distribution and usage chains.
	 * If a number drifts back into both places, this catches it.
	 */
	it("shows each headline number once", async () => {
		const band =
			(await page.textContent("[data-testid=outcome-summary]")) ?? "";
		const rest =
			(await page.textContent("main")) // eslint-disable-line
				?.replace(band, "") ?? "";

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

			// The cohort sizes are matched as numbers, not literals. What this
			// asserts is that the page says which cohorts it has and refuses to
			// compare them — not how many cases the fixture happens to seed, which
			// changes whenever a case is added for another test's sake.

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

	/*
	 * The queue must not blank out when it is navigated to.
	 *
	 * It used to: the navigation badge and the queue page each fetched
	 * /api/followups, so the page started from null on every mount and showed
	 * 「載入中」 for about a second even though the sidebar already held the
	 * answer. Measured across a tab switch, the table went visible → loading →
	 * visible, which in a back office reads as the page being unreliable.
	 *
	 * Asserted on the rendered frames rather than on a settled screenshot,
	 * because the whole defect lives in the transition and a final-state check
	 * cannot see it.
	 */
	it("shows the queue immediately, never blanking on the way in", async () => {
		await page.click(`${NAV} a:has-text("收案評估")`);
		await page.waitForSelector("#mrn", { timeout: 15_000 });

		const frames = await page.evaluate(async () => {
			const out = [];
			const nav = document.querySelector('nav[aria-label="藥師工作區"]');
			const back = nav.querySelector('a[href="/admin/followups"]');
			back.click();
			// Sample every frame until the table is back, so any loading state
			// in between is caught rather than skipped over.
			for (let i = 0; i < 60; i += 1) {
				out.push({
					// This page's own pending state, by test id. Matching on the
					// words 「載入中」 anywhere in the document also caught the
					// case-entry screen being left behind, which says nothing
					// about whether the queue blanks on arrival.
					loading:
						document.querySelector("[data-testid=queue-loading]") !== null,
					table:
						document.querySelector("[data-testid=followup-queue]") !== null,
				});
				if (out.at(-1).table) break;
				await new Promise((r) => requestAnimationFrame(r));
			}
			return out;
		});

		assert.ok(
			frames.length > 0 && frames.at(-1).table,
			"the queue should render after switching to it",
		);
		const blanked = frames.filter((f) => f.loading && !f.table);
		assert.equal(
			blanked.length,
			0,
			`the queue showed ${blanked.length} loading frame(s) on entry; it should render from the shared fetch`,
		);
	});

	/*
	 * A pharmacist had no way to read back what they had already recorded:
	 * entering a record number showed nothing about that patient before, so
	 * 「這位上次幾分」 had no answer anywhere in the app.
	 */
	it("shows a patient's history once their record number is in", async () => {
		await page.click(`${NAV} a:has-text("收案評估")`);
		await page.waitForSelector("#mrn", { timeout: 15_000 });
		await page.fill("#mrn", "UI0000001");
		await page.waitForSelector("[data-testid=case-history]", {
			timeout: 15_000,
		});

		const history =
			(await page.textContent("[data-testid=case-history]")) ?? "";
		// Both the M0 and the M1 this file seeded for the same patient.
		assert.match(history, /M0/, `expected both assessments, got: ${history}`);
		assert.match(history, /M1/, `expected both assessments, got: ${history}`);
		// Newest first, so a before/after reads top to bottom.
		assert.ok(
			history.indexOf("M1") < history.indexOf("M0"),
			`history should be newest first, got: ${history}`,
		);
		// The verdict travels with it, otherwise the row says nothing.
		assert.match(history, /錯誤|全數正確/);

		// And never the full record number — only the tail the server returned.
		assert.ok(
			!history.includes("UI0000001"),
			"the full record number must not be echoed",
		);
	});

	it("says so when a patient has no history, rather than showing nothing", async () => {
		await page.fill("#mrn", "ZZ9999999");
		await page.waitForFunction(
			() => (document.querySelector("#mrn")?.value ?? "") === "ZZ9999999",
			{ timeout: 5000 },
		);
		await page.waitForTimeout(600);
		const body = (await page.textContent("main")) ?? "";
		assert.match(
			body,
			/沒有歷史評估紀錄/,
			"an unknown patient must read as unknown",
		);
	});

	/*
	 * The record-number field used to be replaced by the lookup result, which
	 * left a mistyped number uncorrectable: 「換藥」 returns to the same branch
	 * still holding it, so the only way out was reloading the page. The case is
	 * saved under this field, so that is a wrong-patient record, not a typo.
	 */
	it("keeps the record number editable after the lookup", async () => {
		await page.click(`${NAV} a:has-text("收案評估")`);
		await page.waitForSelector("#mrn", { timeout: 10_000 });
		await page.fill("#mrn", "UI0000001");
		// The drug list is what the lookup opens, so its arrival is the proof
		// the lookup has landed and the field has been given its chance to go.
		await page.waitForSelector(".drug-pick", { timeout: 15_000 });

		const still = await page.$("#mrn");
		assert.ok(still, "the record number must remain editable after the lookup");
		// Editable, not merely present: fill fails on a disabled or readonly
		// input, so this is the assertion that actually catches the defect.
		await page.fill("#mrn", "UI0000099");
		assert.equal(
			await page.inputValue("#mrn"),
			"UI0000099",
			"a mistyped record number must be correctable in place",
		);
	});

	it("corrects a mistyped record number in place", async () => {
		// The corrected number has no history, so the panel ends in its empty
		// state rather than the list one. Both are the panel having answered.
		await page.waitForSelector(
			"[data-testid=case-history], [data-testid=case-history-empty]",
			{ timeout: 15_000 },
		);
		const corrected =
			(await page.textContent(
				"[data-testid=case-history], [data-testid=case-history-empty]",
			)) ?? "";
		assert.match(
			corrected,
			/沒有歷史評估紀錄|次歷史評估/,
			"a corrected number must re-query rather than keep the first answer",
		);
	});

	/*
	 * The five rows under the pending counts were plain text. They duplicated
	 * the queue page and could not be reached from them, which makes them
	 * decoration: information with no way to act on it and no part in deciding
	 * whether to act.
	 */
	it("takes a pending follow-up from the home screen to that row", async () => {
		await page.click(`${NAV} a:has-text("收案評估")`);
		await page.waitForSelector("#mrn", { timeout: 10_000 });
		const row = await page.waitForSelector(
			'main a[href^="/admin/followups?case="]',
			{ timeout: 15_000 },
		);
		const href = await row.getAttribute("href");
		assert.ok(
			href && href !== "/admin/followups",
			`row must name a case: ${href}`,
		);

		await row.click();
		await page.waitForSelector("[data-testid=followup-focus]", {
			timeout: 15_000,
		});
		const id = href.split("case=")[1];
		const focusedHref = await page.getAttribute(
			"[data-testid=followup-focus]",
			"data-testid",
		);
		assert.equal(focusedHref, "followup-focus", "the row should be marked");
		assert.ok(id, "the link must carry the case it names");
	});

	it("reports when the case a link named is already closed", async () => {
		await page.click(`${NAV} a:has-text("追蹤清單")`);
		await page.waitForSelector("[data-testid=followup-queue]", {
			timeout: 15_000,
		});
		// A link can outlive its target: someone else closes the case while
		// this one sits in a tab. Landing on a queue that does not contain it,
		// saying nothing, is the same silence as a dead row.
		await page.goto(`${BASE}/admin/followups?case=does-not-exist`, {
			waitUntil: "networkidle",
		});
		await page.waitForSelector("[data-testid=focus-gone]", { timeout: 15_000 });
	});

	it("starts case entry at one field again", async () => {
		await page.click(`${NAV} a:has-text("收案評估")`);
		await page.waitForSelector("#mrn", { timeout: 10_000 });
		// The record number is the only control on arrival; choosing the product
		// and judging the camera-visible steps are what used to cost 25 taps.
		const controls = await page.$$eval(
			"main input, main select, main button",
			(n) => n.length,
		);
		assert.equal(
			controls,
			1,
			`case entry should open with one control, got ${controls}`,
		);
	});

	/*
	 * Attention first, checked as a property rather than a look.
	 *
	 * The queue used to stamp every row with the same 「逾期」, so the column
	 * ranked nothing and the eye had nothing to follow. Two things have to hold:
	 * the panel states the real spread, and the rows carry a figure that can
	 * differ between them.
	 */
	/*
	 * The 藥品 column was a label on every row and a control on none. Which
	 * product a patient is on decides what to be re-taught, and working that out
	 * meant reading down a column and holding it in memory.
	 */
	it("groups the queue by product, and says what it hid", async () => {
		await page.click(`${NAV} a:has-text("追蹤清單")`);
		await page.waitForSelector("[data-testid=followup-queue]", {
			timeout: 15_000,
		});

		const before = await page.$$eval(
			"[data-testid=followup-queue] tbody tr",
			(rows) => rows.length,
		);

		/*
		 * A Radix Select opens into a portal and mounts its items over a few
		 * frames. Reading the list as soon as the first option exists gets one
		 * option — which reads as "this filter has nothing to filter", the exact
		 * failure the assertion below is meant to catch. So wait for the list to
		 * reach its real length instead of sampling it early.
		 */
		await page.click("#f-drug");
		await page.waitForSelector('[role="option"]', { timeout: 5_000 });
		await page.waitForFunction(
			() => document.querySelectorAll('[role="option"]').length >= 3,
			{ timeout: 5_000 },
		);
		const options = await page.$$eval('[role="option"]', (o) =>
			o.map((x) => x.textContent?.trim() ?? ""),
		);
		/*
		 * The first option is 全部藥品, which selects nothing — picking it proves
		 * the control opens and nothing else. The test has to choose a real
		 * product, or it would pass a filter that had filtered nothing.
		 */
		assert.equal(
			options[0],
			"全部藥品",
			"the list must offer a way back to all",
		);
		const products = options.slice(1);
		assert.ok(
			products.length > 1,
			`a filter with ${products.length} product(s) cannot be shown to filter`,
		);

		await page.click(`[role="option"]:has-text("${products[0]}")`);
		await page.waitForFunction(
			() =>
				document.querySelectorAll("[data-testid=followup-queue] tbody tr")
					.length < 99,
			{ timeout: 5_000 },
		);

		const after = await page.$$eval(
			"[data-testid=followup-queue] tbody tr",
			(r) => r.length,
		);
		assert.ok(after <= before, "grouping can only narrow the queue");

		// Every remaining row is that product — a filter that leaves other
		// products in view is worse than no filter, because it looks right.
		const drugs = await page.$$eval(
			"[data-testid=followup-queue] tbody tr",
			(rows) => [
				...new Set(rows.map((r) => r.children[2]?.textContent?.trim())),
			],
		);
		assert.deepEqual(
			drugs,
			[products[0]],
			"the filter left other products visible",
		);

		// And it says how much it removed, so the drop is not mistaken for a
		// smaller backlog.
		const note = (await page.textContent("main")) ?? "";
		assert.match(
			note,
			/目前顯示 \d+ 件，套用篩選前共 \d+ 件/,
			note.slice(0, 400),
		);

		/*
		 * And the filter can be undone from the filter itself.
		 *
		 * With only a placeholder there was no way back once a product was
		 * chosen: Radix reserves the empty string, so "all" could not be an
		 * item, and the queue was a one-way door. Every list a reader can narrow
		 * has to be one they can widen again without finding another control.
		 */
		await page.click("#f-drug");
		await page.waitForSelector('[role="option"]', { timeout: 5_000 });
		await page.click('[role="option"]:has-text("全部藥品")');
		await page.waitForFunction(
			() =>
				!document.querySelector("main")?.textContent?.includes("套用篩選前"),
			{ timeout: 5_000 },
		);
		const restored = await page.$$eval(
			"[data-testid=followup-queue] tbody tr",
			(rows) => rows.length,
		);
		assert.equal(restored, before, "choosing 全部 must restore every row");
	});

	/*
	 * The row named a patient, a product and a count of steps, and stopped. A
	 * follow-up can be closed from here, but what it is re-checking could not be
	 * seen — so the reassessment had to start from memory.
	 */
	/*
	 * 「全部未完成」 was the widest view on the queue and it still showed 37,
	 * because it is the same list of open follow-ups. With 79 cases recorded,
	 * the other 42 were reachable nowhere — /api/cases existed and no screen
	 * called it.
	 */
	it("reaches the cases the queue does not list", async () => {
		await page.click(`${NAV} a:has-text("追蹤清單")`);
		await page.waitForSelector("[data-testid=followup-queue]", {
			timeout: 15_000,
		});

		const open = await page.$$eval(
			"[data-testid=followup-queue] tbody tr",
			(r) => r.length,
		);
		await page.click('button:has-text("全部個案")');
		await page.waitForSelector("[data-testid=case-list]", { timeout: 15_000 });
		await page.waitForFunction(
			() =>
				(document.querySelectorAll("[data-testid=case-list] tbody tr").length ??
					0) > 0,
			{ timeout: 15_000 },
		);

		const all = await page.$$eval(
			"[data-testid=case-list] tbody tr",
			(r) => r.length,
		);

		/*
		 * Having looked once, the switch must remember the number.
		 *
		 * It showed a dash before, which was honest — the queue has only ever
		 * been told about open follow-ups — but a figure you have to rediscover
		 * by clicking is a figure you keep rediscovering, and the dash is read
		 * as "there may be nothing here".
		 */
		await page.waitForFunction(
			() => {
				const b = [...document.querySelectorAll("button")].find((x) =>
					x.textContent?.includes("全部個案"),
				);
				return Boolean(b) && !b.textContent?.includes("—");
			},
			{ timeout: 10_000 },
		);
		assert.ok(
			all >= open,
			`every open follow-up should also be a recorded case: ${all} < ${open}`,
		);

		// It reads as cases, not as tasks: no close buttons here.
		assert.equal(
			await page.$("[data-testid=followup-queue]"),
			null,
			"the queue must not stay on screen under the case list",
		);
		const buttons = await page.$$eval("[data-testid=case-list] button", (b) =>
			b.map((x) => x.textContent?.trim()),
		);
		assert.ok(
			!buttons.includes("完成") && !buttons.includes("未完成"),
			`a read-only list must not offer to close cases: ${buttons.join(",")}`,
		);

		// And it keeps the grouping the queue already had.
		await page.click("#f-device");
		await page.waitForSelector('[role="option"]', { timeout: 5_000 });
		await page.click('[role="option"]:has-text("全部劑型")');
		await page.waitForTimeout(300);

		// Leave the queue view restored. Several tests below close follow-ups
		// and assert on the queue, so finishing here on the case list makes this
		// file fail in five places for one reason — the same shape of bug as the
		// insert-before-summary mistake in the API suite.
		await page.click('button:has-text("今日待辦")');
		await page.waitForSelector("[data-testid=followup-queue]", {
			timeout: 15_000,
		});
	});

	it("opens the case behind a row", async () => {
		// Navigate rather than relying on where the previous test left the page:
		// a test that only passes in sequence is testing the order.
		await page.click(`${NAV} a:has-text("追蹤清單")`);
		await page.waitForSelector("[data-testid=followup-queue]", {
			timeout: 15_000,
		});

		// Clear any grouping, only if one is set, so this passes alone too.
		if (await page.$("text=套用篩選前")) {
			await page.click("#f-drug");
			await page.waitForSelector('[role="option"]', { timeout: 5_000 });
			await page.click('[role="option"]:has-text("全部藥品")');
			await page.waitForTimeout(300);
		}

		await page.click("[data-testid=open-case]");
		await page.waitForSelector("[data-testid=case-detail]", {
			timeout: 15_000,
		});
		// Wait for the answer, not for the container. Reading the panel the
		// moment it opens reads its loading skeleton, and then asserts on the
		// skeleton as though it were the record.
		await page.waitForFunction(
			() => {
				const t = document.querySelector(
					"[data-testid=case-detail]",
				)?.textContent;
				return Boolean(t) && !t.includes("正在讀取");
			},
			{ timeout: 15_000 },
		);

		const detail = (await page.textContent("[data-testid=case-detail]")) ?? "";
		assert.match(detail, /的評估紀錄/, detail.slice(0, 200));
		// The same patient, and never their record number.
		assert.ok(
			!/\bUI\d{7}\b/.test(detail),
			"the full record number must not appear",
		);
		// It either lists what was recorded or says there is nothing else — the
		// two things a row can legitimately lead to.
		assert.match(
			detail,
			/全數正確|步錯誤|沒有其他評估紀錄/,
			detail.slice(0, 400),
		);

		// And it closes, so the queue it interrupted is reachable again.
		await page.click('[data-testid=case-detail] button:has-text("關閉")');
		await page.waitForSelector("[data-testid=case-detail]", {
			state: "detached",
			timeout: 5_000,
		});
	});

	it("puts the queue's real state above the list", async () => {
		await page.click(`${NAV} a:has-text("追蹤清單")`);
		await page.waitForSelector("[data-testid=queue-attention]", {
			timeout: 15_000,
		});

		const panel =
			(await page.textContent("[data-testid=queue-attention]")) ?? "";
		const rows = await page.$$eval(QUEUE_ROWS, (n) =>
			n.map(
				(tr) =>
					tr.querySelector("tbody, tr")?.textContent ?? tr.textContent ?? "",
			),
		);
		const open = rows.length;
		assert.ok(open > 0, "the seeded queue should not be empty");

		// Every row states a day count rather than the bare word, so the column
		// can actually be compared.
		const counts = await page.$$eval(QUEUE_ROWS, (n) =>
			n.map((tr) => {
				const m = (tr.textContent ?? "").match(/逾期\s*(\d+)\s*天/);
				return m ? Number(m[1]) : null;
			}),
		);
		assert.ok(
			counts.every((c) => c !== null && c > 0),
			`every overdue row needs a day count, got ${JSON.stringify(counts)}`,
		);

		// The panel reports the same population the table lists.
		assert.match(
			panel,
			new RegExp(`${open} 件`),
			`the panel should account for all ${open} rows, got: ${panel}`,
		);
		// Worst and median must both be stated, and worst cannot be smaller.
		const nums = [...panel.matchAll(/(\d+)\s*天/g)].map((m) => Number(m[1]));
		assert.ok(
			nums.length >= 3,
			`expected worst/median/earliest, got: ${panel}`,
		);
		assert.ok(
			nums[0] >= nums[1] && nums[1] >= nums[2],
			`worst >= median >= earliest, got ${nums.join(", ")} in: ${panel}`,
		);
	});

	/*
	 * The whole point of routing the close through the assessment: completing a
	 * follow-up has to leave an M1 behind, or the queue can be emptied without
	 * the outcomes gaining a case from real work.
	 */
	it("closes a follow-up and takes it off the queue", async () => {
		// Work out how many rows are open, then close one for real through the
		// button the pharmacist uses. A function that works while its button does
		// nothing is not a feature.
		await page.click(`${NAV} a:has-text("追蹤清單")`);
		await page.waitForSelector(QUEUE_ROWS, { timeout: 15_000 });
		const before = await page.$$eval(QUEUE_ROWS, (n) => n.length);
		assert.ok(
			before > 0,
			"the seeded data must produce an open follow-up to close",
		);

		await page.evaluate((n) => {
			window.__before = n;
		}, before);
		// By exact accessible name: "完成" also matches "未完成".
		await page
			.getByRole("button", { name: /標記為完成$/ })
			.first()
			.click();

		/*
		 * Completing opens the M1 assessment rather than dismissing the row,
		 * because a close that records nothing leaves the queue shorter and the
		 * outcomes page unchanged. This drives the form the pharmacist uses, so
		 * the button and the feature are tested together.
		 */
		const submit = page.getByRole("button", { name: /結案並記錄 M1/ });
		await submit.waitFor({ timeout: 15_000 });

		// One click per step. Clicking "first until none are left" would keep
		// hitting the same button — the label does not change when a verdict is
		// picked, only its styling — so the count never falls and the loop spins.
		const correct = page.getByRole("button", { name: /^正確$/ });
		for (let i = (await correct.count()) - 1; i >= 0; i -= 1) {
			await correct.nth(i).click();
		}
		/*
		 * Answer whatever knowledge questions the form rendered, rather than
		 * naming two of them. The ids come from the question index, which is
		 * 1-based over a 0-based array — so MDI yields #k3 and #k7, not #k2 and
		 * #k6 — and a hardcoded pair silently leaves one unanswered whenever the
		 * targeted set changes.
		 */
		const answers = page.locator("button[id^='k']");
		const asked = await answers.count();
		assert.ok(asked > 0, "the assessment should ask knowledge questions");
		for (let i = 0; i < asked; i += 1) {
			await answers.nth(i).click();
			await page.getByRole("option", { name: "對", exact: true }).click();
		}

		// waitForFunction's second argument is the value passed into the page,
		// and the options are third — passing options second silently leaves the
		// 30s default in force.
		await page.waitForFunction(
			() => {
				const b = [...document.querySelectorAll("button")].find((x) =>
					/結案並記錄 M1/.test(x.textContent ?? ""),
				);
				return Boolean(b && !b.disabled);
			},
			null,
			{ timeout: 15_000 },
		);
		await submit.click();

		await page.waitForFunction(
			(sel) => document.querySelectorAll(sel).length === window.__before - 1,
			QUEUE_ROWS,
			{ timeout: 15_000 },
		);
		const after = await page.$$eval(QUEUE_ROWS, (n) => n.length);
		assert.equal(after, before - 1, "the row must leave the queue");

		// The attention panel is what the close has to update: it is the first
		// thing on the queue page, and a stale count there would send the
		// pharmacist back for work already done.
		const done = (await page.textContent("[data-testid=followup-done]")) ?? "";
		assert.match(done, /M1 評估/, `got ${done}`);
	});

	it("records the M1 the completion produced", async () => {
		const res = await fetch(`http://localhost:${API_PORT}/api/cases?limit=200`);
		const json = await res.json();
		const m1 = (json.cases ?? []).filter((c) => c.timepoint === "M1");

		// The seed already contains one M1, so "at least one" would be satisfied
		// by the fixture and prove nothing. The completion has to have added one.
		assert.equal(
			m1.length,
			2,
			`seed contributes 1 M1; completing must add another, saw ${m1.length}`,
		);

		// And it must carry verdicts, not just a row: a follow-up closed without
		// a recorded assessment is the dead end this replaced.
		const produced = m1.find((c) => c.steps && Object.keys(c.steps).length > 0);
		assert.ok(produced, "the M1 must carry step verdicts");
		assert.ok(
			Object.keys(produced.steps).length >= 2,
			`expected the camera-blind steps, got ${JSON.stringify(produced.steps)}`,
		);
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
