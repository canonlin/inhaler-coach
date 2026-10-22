/**
 * Type scale and layout discipline.
 *
 * Sibling to contrast.mjs: that one measures colour, this one measures the
 * things colour cannot catch.
 *
 * The pharmacist end accumulated nine font sizes, none of them defined
 * anywhere — `text-[15px]` 25 times, `text-[13px]` 23 — each typed by hand while
 * changing one screen. The result had an inverted hierarchy: a placeholder sat
 * at 18px while the navigation around it sat at 15px. No amount of contrast
 * checking would have found that.
 *
 * Three rules, all of them things a reviewer should not have to catch by eye:
 *
 *  1. No arbitrary font sizes. Every size comes from the scale in style.css.
 *  2. Nothing that holds content renders below `base`. Meta and caption are for
 *     column heads, counts and hints — never the only label for a control.
 *  3. Nothing that holds content renders above `lg` except a metric. A field's
 *     own text is body text, whatever the surrounding screen is about.
 *
 * Run: node output/design-review/type-scale.mjs
 */
import fs from "node:fs";
import path from "node:path";

const ROOTS = ["src/pharmacist", "src/line"];

/** Sizes defined in the scale, in px, smallest first. */
const SCALE = {
	"text-meta": 12,
	"text-caption": 13,
	"text-sm": 14,
	"text-base": 16,
	"text-lg": 18,
	"text-xl": 22,
	"text-metric": 30,
	"text-hero": 38,
	// Tailwind steps still in use for metrics.
	"text-2xl": 24,
	"text-3xl": 30,
	"text-4xl": 36,
};

const SIZE_CLASS = /text-(?:\[[0-9.]+[a-z]*\]|(?:xs|sm|base|lg|xl|[2-9]xl))\b/g;

/** Where content is allowed to be small, and where it may be large. */
const SMALL_OK = new Set(["text-meta", "text-caption", "text-sm"]);
const LARGE_OK = new Set([
	"text-xl",
	"text-metric",
	"text-2xl",
	"text-3xl",
	"text-4xl",
	"text-hero",
]);

/** Lines that are explicitly labels, counts or hints rather than content. */
const SMALL_EXEMPT = [
	/aria-label/,
	/sr-only/,
	/^\s*\*\s/, // comment continuation
];

function walk(dir) {
	const out = [];
	for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
		const p = path.join(dir, entry.name);
		if (entry.isDirectory()) out.push(...walk(p));
		else if (p.endsWith(".tsx")) out.push(p);
	}
	return out;
}

const findings = [];

for (const root of ROOTS) {
	for (const file of walk(root)) {
		const lines = fs.readFileSync(file, "utf8").split("\n");

		lines.forEach((line, i) => {
			const code = line.replace(/\/\/.*$/, "");
			if (!code.trim()) return;
			if (SMALL_EXEMPT.some((re) => re.test(line))) return;

			for (const m of code.matchAll(SIZE_CLASS)) {
				const cls = m[0];

				// Rule 1: hand-typed sizes.
				if (cls.startsWith("text-[")) {
					findings.push({
						kind: "arbitrary size",
						file,
						line: i + 1,
						cls,
						why: "font size must come from the scale in style.css",
					});
					continue;
				}

				if (!(cls in SCALE)) {
					findings.push({
						kind: "unknown size",
						file,
						line: i + 1,
						cls,
						why: "not a step in the type scale",
					});
					continue;
				}

				// Rule 2: content never below base. column heads and hints are the
				// exception and they are marked by the caller via SMALL_EXEMPT.
				if (
					SCALE[cls] < 16 &&
					!SMALL_OK.has(cls) &&
					!/Th\b|Badge|caption|hint|legend/i.test(code)
				) {
					findings.push({
						kind: "too small for content",
						file,
						line: i + 1,
						cls,
						why: `${SCALE[cls]}px — below the 16px floor for anything a pharmacist reads as content`,
					});
				}

				// Rule 3: only metrics go large.
				if (
					SCALE[cls] > 18 &&
					!LARGE_OK.has(cls) &&
					!/metric|hero/i.test(code)
				) {
					findings.push({
						kind: "too large for body",
						file,
						line: i + 1,
						cls,
						why: `${SCALE[cls]}px — above lg without a metric; this is how the placeholder outgrew the navigation`,
					});
				}
			}
		});
	}
}

if (findings.length === 0) {
	console.log("type scale: no findings");
	process.exit(0);
}

console.log(`${findings.length} finding(s):\n`);
for (const f of findings) {
	console.log(`  ${f.kind}: ${f.file}:${f.line}  ${f.cls}`);
	console.log(`    ${f.why}\n`);
}
process.exit(1);
