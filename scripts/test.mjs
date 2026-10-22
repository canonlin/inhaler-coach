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

function run(cmd, args) {
	const res = spawnSync(cmd, args, {
		cwd: ROOT,
		stdio: "inherit",
		env: process.env,
	});
	if (res.status !== 0) process.exit(res.status ?? 1);
}

run(process.execPath, ["--test", "--test-concurrency=1"]);

if (existsSync(resolve(ROOT, "test"))) {
	const py = spawnSync(
		"python3",
		["-m", "unittest", "discover", "-s", "test", "-p", "*_test.py"],
		{
			cwd: ROOT,
			stdio: "inherit",
			env: process.env,
		},
	);
	if (py.status !== 0) process.exit(py.status ?? 1);
}
