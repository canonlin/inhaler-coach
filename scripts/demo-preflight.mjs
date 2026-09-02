import { existsSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { STAGES } from "../src/config/stages.js";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const checks = [];

function check(name, condition, fix) {
	checks.push({ name, ok: Boolean(condition), fix });
}

function nonempty(relativePath) {
	const path = join(root, relativePath);
	return existsSync(path) && statSync(path).isFile() && statSync(path).size > 0;
}

const [nodeMajor, nodeMinor] = process.versions.node
	.split(".")
	.map((part) => Number.parseInt(part, 10));
const viteNodeSupported =
	(nodeMajor === 20 && nodeMinor >= 19) ||
	(nodeMajor === 22 && nodeMinor >= 12) ||
	nodeMajor > 22;
check(
	"Vite-compatible Node.js (^20.19 or >=22.12)",
	viteNodeSupported,
	"Install Node.js 20.19+ or 22.12+; Vite 8 rejects older runtimes.",
);

check(
	"Frontend dependencies",
	existsSync(join(root, "node_modules", ".bin", "vite")),
	"Run `bun install --frozen-lockfile` on a network-enabled machine.",
);
check(
	"ONNX Runtime source files",
	nonempty(
		"node_modules/onnxruntime-web/dist/ort-wasm-simd-threaded.jsep.mjs",
	) &&
		nonempty(
			"node_modules/onnxruntime-web/dist/ort-wasm-simd-threaded.jsep.wasm",
		),
	"Reinstall dependencies; the installed onnxruntime-web package is incomplete.",
);
check(
	"Prepared ONNX Runtime public files",
	nonempty("public/ort/ort-wasm-simd-threaded.jsep.mjs") &&
		nonempty("public/ort/ort-wasm-simd-threaded.jsep.wasm"),
	"Run `bun run postinstall` after dependencies are installed.",
);

for (const path of [
	"public/inhaler_bg.jpg",
	"public/fonts/jf-openhuninn-2.1.ttf",
	"public/models/inhaler.onnx",
]) {
	check(
		`Required asset: ${path}`,
		nonempty(path),
		`Restore ${path} from source control.`,
	);
}

const practiceStages = STAGES.slice(1);
check(
	"Exactly four practice stages",
	practiceStages.length === 4,
	"Review src/config/stages.js; the demo expects stages 1 through 4.",
);
check(
	"Every stage has a YouTube video ID",
	practiceStages.every((stage) =>
		/youtube\.com\/embed\/[\w-]{11}/.test(stage.videoURL),
	),
	"Add a valid 11-character YouTube embed ID to every practice stage.",
);
check(
	"Symbicort timing safeguards",
	practiceStages[0]?.hint?.includes("5 秒") &&
		practiceStages[2]?.inhaleSeconds === 4 &&
		practiceStages[2]?.holdSeconds === 10,
	"Keep shake at 5 seconds, visible inhale coaching at 4 seconds, and breath-hold guidance at 10 seconds.",
);

for (const item of checks) {
	const mark = item.ok ? "PASS" : "FAIL";
	process.stdout.write(`[${mark}] ${item.name}\n`);
	if (!item.ok) process.stdout.write(`       ${item.fix}\n`);
}

const failed = checks.filter((item) => !item.ok);
process.stdout.write(
	failed.length === 0
		? "\nLocal preflight passed. Continue with typecheck, build, browser, camera, and network rehearsal.\n"
		: `\nPreflight blocked by ${failed.length} local check${failed.length === 1 ? "" : "s"}.\n`,
);

process.exitCode = failed.length === 0 ? 0 : 1;
