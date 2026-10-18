/**
 * Single responsibility, measured in lines.
 *
 * A file that does one thing fits in the head; a file that does three grows
 * past it, and the growth is gradual enough that no reviewer catches the day
 * it happens. So the limit is mechanical: every file under src/line/ must fit
 * in MAX_LINES lines, or the gate fails.
 *
 * Why total lines and not scc code lines: total is the conservative bound — a
 * file that passes total ≤ 200 passes code ≤ 200 trivially — and it needs no
 * comment parser to stay honest. If a file outgrows the budget, split it by
 * responsibility; never raise the budget to fit the file.
 *
 * Scope is src/line/ only. Older surfaces predate the rule and are not
 * grandfathered in prose — they are simply not scanned until they are touched.
 *
 * Run: node output/design-review/file-size.mjs
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const ROOT = "src/line";
const MAX_LINES = 200;
const EXTENSIONS = new Set([".ts", ".tsx", ".mjs", ".js"]);

function walk(dir) {
	const out = [];
	for (const entry of readdirSync(dir, { withFileTypes: true })) {
		if (entry.name.startsWith(".")) continue;
		const full = join(dir, entry.name);
		if (entry.isDirectory()) out.push(...walk(full));
		else if ([...EXTENSIONS].some((e) => full.endsWith(e))) out.push(full);
	}
	return out;
}

const over = [];
for (const file of walk(ROOT)) {
	if (file.endsWith(".json")) continue;
	const lines = readFileSync(file, "utf8").split("\n").length;
	if (lines > MAX_LINES) over.push({ file, lines });
}

if (over.length === 0) {
	console.log(`file size: all ${walk(ROOT).length} files fit in ${MAX_LINES} lines`);
	process.exit(0);
}

console.log(`${over.length} file(s) over the ${MAX_LINES}-line budget:\n`);
for (const f of over) console.log(`  ${f.file}: ${f.lines} lines — split by responsibility`);
process.exit(1);
