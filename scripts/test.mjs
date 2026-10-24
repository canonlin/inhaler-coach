/**
 * The test gate.
 *
 * Three failure modes are closed here rather than in each test file:
 *
 *   - A missing DATABASE_URL used to skip the API, metrics and LINE files, so
 *     the gate reported green on a machine that had never executed a single
 *     query. A gate that quietly does nothing is worse than no gate, so a
 *     missing URL is now a hard failure with instructions.
 *   - Those files truncate the same tables. Node runs test files in parallel by
 *     default, which had them deleting each other's rows mid-test. Concurrency
 *     is pinned to 1 so the suite is order-independent by construction.
 *   - The suite truncates the clinical tables, and it used to do so against
 *     whatever DATABASE_URL pointed at — which is the deployment's database,
 *     because that is what .env.local holds. A test run on a laptop deleted the
 *     pharmacist's patients and reported green.
 *
 * The third one is closed by the URL, not by a check. The suite does not read
 * DATABASE_URL: it reads `scratchDatabaseUrl()`, which resolves to a database
 * named `inhaler_test` and refuses anything else. The deployment's database is
 * not reachable from here by configuration, and the schema's TRUNCATE guard
 * refuses it at the database itself (see db/schema.sql and
 * scripts/scratch-db.mjs).
 */
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { scratchDatabaseUrl } from "./scratch-db.mjs";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

if (!process.env.DATABASE_URL && !process.env.DATABASE_URL_SCRATCH) {
	console.error(
		[
			"",
			"  DATABASE_URL is not set, so the gate cannot run.",
			"",
			"  The API, metrics and LINE tests query a real Postgres. Running without one",
			"  used to skip them and report success for code that was never queried.",
			"",
			"  Local:  DATABASE_URL=postgres://postgres:devpw@localhost:5432/inhaler bun run test",
			"          （庫名會自動換成 inhaler_test，正式庫碰不到）",
			"",
		].join("\n"),
	);
	process.exit(1);
}

/**
 * The database the suite is allowed to empty.
 *
 * It is the scratch database by construction — the URL comes from
 * scratchDatabaseUrl(), which swaps the database name and refuses anything
 * that is not a scratch name. There is no flag that turns this off, because
 * the deployment's database is not empty but dangerous, and a flag that
 * empties real patients is not a flag.
 */
const TEST_DATABASE_URL = scratchDatabaseUrl();

/**
 * Leave the database the way it was found.
 *
 * The suite empties the clinical tables and fills them with its own rows. The
 * rows it leaves behind are indistinguishable from real cases to the next
 * person — and to the gate above, which would then refuse to run — so the
 * cleanup is not optional politeness: without it, the second run of the day
 * fails for a reason that has nothing to do with the code.
 *
 * The tables emptied here are the clinical ones only. Accounts, sessions and
 * the administrator's configuration are not ours to clear.
 */
async function cleanUpAfterTheRun() {
	const { createPool } = await import("../api/db.mjs");
	const pool = createPool(TEST_DATABASE_URL);
	try {
		await pool.query(
			`TRUNCATE line_events, line_deliveries, line_identities, line_medications,
			        followups, physician_queries, session_stages, sessions,
			        case_knowledge, case_steps, clinical_measurements, med_reconciliation,
			        cases, patients RESTART IDENTITY CASCADE`,
		);
	} finally {
		await pool.end();
	}
}

function run(cmd, args) {
	const res = spawnSync(cmd, args, {
		cwd: ROOT,
		stdio: "inherit",
		// The tests get the scratch URL, never the app's: the test files open
		// their own pools from DATABASE_URL, and that variable has to be the
		// disposable one for the whole run.
		env: { ...process.env, DATABASE_URL: TEST_DATABASE_URL },
	});
	return res;
}

const tests = run(process.execPath, ["--test", "--test-concurrency=1"]);

const py = existsSync(resolve(ROOT, "test"))
	? run("python3", [
			"-m",
			"unittest",
			"discover",
			"-s",
			"test",
			"-p",
			"*_test.py",
		])
	: null;

// The cleanup runs even when the tests failed: a failed run is exactly the
// one that leaves the most rows behind.
await cleanUpAfterTheRun();

if (tests.status !== 0) process.exit(tests.status ?? 1);
if (py && py.status !== 0) process.exit(py.status ?? 1);
