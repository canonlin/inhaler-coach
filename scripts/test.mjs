/**
 * The test gate.
 *
 * Two failure modes are closed here rather than in each test file:
 *
 *   - A missing DATABASE_URL used to skip the API, metrics and LINE files, so
 *     the gate reported green on a machine that had never executed a single
 *     query. A gate that quietly does nothing is worse than no gate, so a
 *     missing URL is now a hard failure with instructions.
 *   - Those files truncate the same tables. Node runs test files in parallel by
 *     default, which had them deleting each other's rows mid-test. Concurrency
 *     is pinned to 1 so the suite is order-independent by construction.
 *
 * And one more, closed by the two functions below: the project's Neon database
 * is both the test database and the deployment's database, so a test run on a
 * laptop would delete real patients' records and still report green. The gate
 * asks the database whether there is anything to lose, and cleans up after
 * itself so the question has an honest answer next time.
 */
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

if (!process.env.DATABASE_URL) {
	console.error(
		[
			"",
			"  DATABASE_URL is not set, so the gate cannot run.",
			"",
			"  The API, metrics and LINE tests query a real Postgres. Running without one",
			"  used to skip them and report success for code that was never queried.",
			"",
			"  Local:  docker start inhaler-pg",
			"          DATABASE_URL=postgres://postgres:devpw@localhost:55432/inhaler bun run test",
			"",
		].join("\n"),
	);
	process.exit(1);
}

/**
 * Is this a database that may be emptied?
 *
 * The suite truncates the clinical tables. The project's Neon database is both
 * the test database and the deployment's database, so once the pharmacist
 * starts enrolling real patients, a test run on a laptop would delete their
 * records — and it would report green, because the suite passes on an empty
 * database just as happily as on a full one.
 *
 * The gate therefore asks the database whether there is anything to lose and
 * refuses if there is. A local database is disposable by definition and is
 * never asked.
 */
async function assertDatabaseIsDisposable() {
	const url = process.env.DATABASE_URL;
	if (/localhost|127\.0\.0\.1|::1/.test(url)) return;

	const { createPool } = await import("../api/db.mjs");
	const pool = createPool(url);
	try {
		const { rows } = await pool.query(
			`SELECT (SELECT count(*) FROM cases)::int AS cases,
			        (SELECT count(*) FROM patients)::int AS patients,
			        (SELECT count(*) FROM followups)::int AS followups`,
		);
		const n = rows[0];
		if (!n.cases && !n.patients && !n.followups) return;
		if (process.env.ALLOW_TRUNCATE === "1") {
			console.warn("ALLOW_TRUNCATE=1 — 這次測試會清掉資料庫裡的臨床資料。");
			return;
		}
		console.error(
			[
				"",
				"  這套測試會清空臨床資料表，而這個資料庫裡還有資料：",
				`    cases ${n.cases} · patients ${n.patients} · followups ${n.followups}`,
				"",
				"  本專案的 Neon 資料庫同時是測試庫與正式部署的資料庫。在正式收案之後",
				"  跑測試會把病人資料刪掉，而且測試仍會顯示綠色。",
				"",
				"  如果這是上一次測試留下的資料（單獨跑過某個測試檔時會這樣），",
				"  確認過了就明確覆寫：",
				"    ALLOW_TRUNCATE=1 bun run test",
				"",
				"  套件跑完會自己把臨床表清乾淨，所以下一次不需要覆寫。",
				"",
			].join("\n"),
		);
		process.exit(1);
	} finally {
		await pool.end();
	}
}

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
	const pool = createPool(process.env.DATABASE_URL);
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
		env: process.env,
	});
	return res;
}

await assertDatabaseIsDisposable();

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
