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
	await page.goto(`${BASE}/pharmacist`, { waitUntil: "networkidle" });

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
		mrn: "UI0000002",
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
		const tabs = await page.$$eval(".rx-tabs button", (n) => n.map((x) => x.textContent.trim()));
		assert.deepEqual(tabs, ["收案評估", "追蹤清單", "成效"]);
		assert.equal(await page.$$eval(".rx-tabs", (n) => n.length), 1, "one nav, not two");
	});

	it("shows the outcomes inside the pharmacist app", async () => {
		await page.click('.rx-tabs button:has-text("成效")');
		await page.waitForSelector(".verdict", { timeout: 15_000 });
		assert.equal((await page.textContent("h1"))?.trim(), "有沒有變好");
		assert.equal(await page.$$eval(".rx-tabs", (n) => n.length), 1);
	});

	it("renders a verdict built from the cases this test created", async () => {
		// The two cases are counted separately: the baseline case has 2 steps and
		// both are wrong (100%), the follow-up case has 2 steps and neither is
		// (0%). The figures are asserted in the metrics tests; here the point is
		// that the number comes from the database and the page renders it at all.
		const verdict = (await page.textContent(".verdict-number"))?.replace(/\s+/g, " ").trim();
		assert.match(verdict ?? "", /100%\s*→\s*0%/, `got ${verdict}`);
	});

	it("starts case entry at one field again", async () => {
		await page.click('.rx-tabs button:has-text("收案評估")');
		await page.waitForSelector(".rx", { timeout: 10_000 });
		assert.equal(
			await page.$$eval(".rx input, .rx select", (n) => n.length),
			1,
			"case entry still begins with the record number alone",
		);
	});

	it("closes a follow-up and takes it off the queue", async () => {
		// Work out how many rows are open, then close one for real through the
		// button the pharmacist uses. A function that works while its button does
		// nothing is not a feature.
		await page.click('.rx-tabs button:has-text("追蹤清單")');
		await page.waitForSelector(".ck-table tbody tr", { timeout: 15_000 });
		const before = await page.$$eval(".ck-table tbody tr", (n) => n.length);
		assert.ok(before > 0, "the seeded data must produce an open follow-up to close");

		await page.click('.ck-table tbody tr:first-child .seg button.ok');
		await page.waitForFunction(
			(n) => document.querySelectorAll(".ck-table tbody tr").length === n - 1,
			before,
			{ timeout: 15_000 },
		);
		const after = await page.$$eval(".ck-table tbody tr", (n) => n.length);
		assert.equal(after, before - 1, "the row must leave the queue");

		const banner = (await page.textContent(".fu-tally")) ?? "";
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