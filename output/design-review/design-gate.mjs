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
	["API", "http://localhost:4183/api/followups", "DATABASE_URL=… PORT=4183 node scripts/dev-api.mjs"],
	["vite", "http://localhost:4185/admin", "VITE_API_PROXY=http://localhost:4183 bunx vite --port 4185"],
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

const steps = [
	["type scale", "node output/design-review/type-scale.mjs"],
	["note marker", "node output/design-review/note-marker.mjs"],
	["a11y guard", "node output/design-review/a11y-guard.mjs"],
];

let failed = 0;
for (const [label, cmd] of steps) {
	try {
		const out = execSync(cmd, { encoding: "utf8" });
		console.log(`✓ ${label}\n${out.trim()}\n`);
	} catch (e) {
		failed += 1;
		console.log(`✗ ${label}\n${(e.stdout ?? "").trim()}\n`);
	}
}

process.exit(failed ? 1 : 0);