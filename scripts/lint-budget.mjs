/**
 * The lint budget: the number of warnings may go down, never up.
 *
 * Biome's recommended rules report a few hundred complexity warnings in this
 * repository. They are warnings, so `biome check` exits 0 and the gate stays
 * green — which is exactly how a hundred warnings became a hundred and twenty
 * without anybody deciding to accept them.
 *
 * A budget makes the debt visible and stops it growing: the count is recorded
 * here, and the gate fails when a change adds to it. Lowering the number is
 * always allowed; the file is the receipt of that decision.
 */
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const BUDGET_FILE = resolve(ROOT, "config", "lint-budget.json");

const budget = JSON.parse(readFileSync(BUDGET_FILE, "utf8"));
const allowed = Number(budget.maxWarnings);

/**
 * biome exits non-zero when it finds anything to report, so the report has to
 * be read out of a failed run rather than a successful one.
 */
function readReport() {
	try {
		return JSON.parse(
			execFileSync("bunx", ["biome", "check", ".", "--reporter=json"], {
				cwd: ROOT,
				encoding: "utf8",
				maxBuffer: 64 * 1024 * 1024,
				stdio: ["ignore", "pipe", "ignore"],
			}),
		);
	} catch (error) {
		const stdout = error?.stdout;
		if (typeof stdout !== "string" || stdout.length === 0) throw error;
		return JSON.parse(stdout);
	}
}

const report = readReport();

const errors = Number(report.summary?.errors ?? 0);
const warnings = Number(report.summary?.warnings ?? 0);

if (errors > 0) {
	console.error(
		`\n  lint 有 ${errors} 個錯誤。錯誤是擋路的，先修掉再談預算。\n`,
	);
	process.exit(1);
}

if (warnings > allowed) {
	const byRule = new Map();
	for (const d of report.diagnostics ?? []) {
		const key = d.category ?? "unknown";
		byRule.set(key, (byRule.get(key) ?? 0) + 1);
	}
	console.error(
		[
			"",
			`  lint 警告 ${warnings} 個，超過預算 ${allowed} 個 ${warnings - allowed} 個。`,
			"  預算在 config/lint-budget.json：新的警告會被這道閘門擋下來。",
			"",
			"  這次多了什麼：",
			...[...byRule.entries()]
				.sort((a, b) => b[1] - a[1])
				.map(([rule, n]) => `    ${rule}  ${n}`),
			"",
			"  兩種辦法：把新寫的那段改簡單（比較好的那種），",
			"  或者把既有的債務改到不擋路——但那要先講清楚為什麼值得。",
			"",
		].join("\n"),
	);
	process.exit(1);
}

if (warnings < allowed) {
	console.log(
		`  lint 警告降到 ${warnings} 個（預算 ${allowed} 個）——把 config/lint-budget.json 的上限調成 ${warnings}。`,
	);
} else {
	console.log(`  lint 警告 ${warnings} 個，在預算 ${allowed} 個之內。`);
}
