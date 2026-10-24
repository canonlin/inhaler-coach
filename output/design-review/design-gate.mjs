/**
 * Why the guards live in the gate and not in a checklist.
 *
 * `type-scale.mjs` and `a11y-guard.mjs` both exist because a rule I wrote was
 * broken by code I wrote later, twice, in the same session:
 *
 *   - the type scale's 16px content floor, broken by `text-caption` in the
 *     first component added after the scale was defined;
 *   - a11y, not checked at all, which left seven table headers without `scope`
 *     and was invisible until a machine looked.
 *
 * A rule that only exists in a document is a rule that will be broken quietly.
 * Both run here and fail the push.
 *
 * Requires the dev stack; the preflight below says exactly what to start rather
 * than failing three frames deep inside a connection error.
 */
import { execSync } from "node:child_process";

// File size needs no servers, so it runs before the preflight: a file that
// does two jobs fails here even on a machine with nothing started.
try {
	const out = execSync("node output/design-review/file-size.mjs", {
		encoding: "utf8",
	});
	console.log(`✓ file size\n${out.trim()}\n`);
} catch (e) {
	console.log(`✗ file size\n${(e.stdout ?? "").trim()}\n`);
	process.exit(1);
}

const TARGETS = [
	// /api/health rather than a data route: it is public, and it still proves
	// both that the server is up and that the database answers.
	[
		"API",
		"http://localhost:4183/api/health",
		"DATABASE_URL=… PORT=4183 node scripts/dev-api.mjs",
	],
	[
		"vite",
		"http://localhost:4185/admin",
		"VITE_API_PROXY=http://localhost:4183 bunx vite --port 4185",
	],
];

const missing = [];
for (const [name, url, start] of TARGETS) {
	try {
		const res = await fetch(url, { signal: AbortSignal.timeout(3000) });
		if (!res.ok) missing.push([name, url, start, `HTTP ${res.status}`]);
	} catch (e) {
		missing.push([name, url, start, e.name]);
	}
}

if (missing.length) {
	console.error("\ndesign gate 需要開發中的服務，現在沒有：\n");
	for (const [name, url, start, why] of missing) {
		console.error(`  ${name}  ${url}\n    ${why} — 啟動：${start}\n`);
	}
	console.error("這不是自動略過——設計規則沒有被檢查過，push 應該被擋下。\n");
	process.exit(1);
}

// The back office is behind a sign-in. A design check that opens /admin
// without a session measures the sign-in form instead of the app, so the
// gate signs in first and hands the session to the checks that need it.
//
// The account is temporary and its password is random; see session.mjs.
const { openReviewerSession } = await import("./session.mjs");
let session = null;
try {
	session = await openReviewerSession();
} catch (err) {
	console.error(
		`\n無法登入後台，設計檢查會看到登入畫面而不是應用：\n  ${err.message}\n`,
	);
	process.exit(1);
}

const steps = [
	["type scale", "node output/design-review/type-scale.mjs"],
	["note marker", "node output/design-review/note-marker.mjs"],
	["a11y guard", "node output/design-review/a11y-guard.mjs"],
];

let failed = 0;
for (const [label, cmd] of steps) {
	try {
		const out = execSync(cmd, {
			encoding: "utf8",
			env: {
				...process.env,
				// The checks sign in through the application's own form, so they
				// need the account rather than a token.
				DESIGN_SESSION_EMAIL: session.email,
				DESIGN_SESSION_PASSWORD: session.password,
			},
		});
		console.log(`✓ ${label}\n${out.trim()}\n`);
	} catch (e) {
		failed += 1;
		// Both streams: a check that fails with an exception puts the reason on
		// stderr, and a gate that swallows it reports a red light with no cause.
		const out = [(e.stdout ?? "").trim(), (e.stderr ?? "").trim()]
			.filter(Boolean)
			.join("\n");
		console.log(`✗ ${label}\n${out}\n`);
	}
}

/**
 * Were the servers still up when the checks finished?
 *
 * A server that dies while the checks run is a different failure from a rule
 * that broke, and the difference is the whole point: a rule that was never
 * measured is not a rule that passed. The browser checks take twenty seconds,
 * which is long enough for a background server to go away — on a CI runner
 * the previous step's processes are exactly the kind that do.
 */
const dead = [];
for (const [name, url] of TARGETS) {
	try {
		const res = await fetch(url, { signal: AbortSignal.timeout(3000) });
		if (!res.ok) dead.push(`${name} ${url} → HTTP ${res.status}`);
	} catch (e) {
		dead.push(`${name} ${url} → ${e.name}`);
	}
}
if (dead.length) {
	failed += 1;
	console.log("✗ 服務存活\n");
	for (const line of dead) console.log(`    ${line}`);
	console.log("    檢查跑完時服務已經不在了；這些規則等於沒有被量過。\n");
}

await session.cleanup();

process.exit(failed ? 1 : 0);
