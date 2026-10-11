/**
 * Contrast audit for the two palettes.
 *
 * Reads the tokens out of src/style.css rather than restating them, so it fails
 * when a colour is changed without re-measuring — which is the only way this
 * check is worth keeping. The bug it exists to prevent: a focus ring that had
 * been sitting at 1.96:1 against the surface it is drawn on, while the token
 * next to it said nothing about it, and the `:focus-visible` rule hard-coded the
 * same light blue so fixing the token would not have fixed the ring.
 *
 * Thresholds are WCAG 2.2: 1.4.3 text at 4.5:1, and 1.4.11 non-text
 * (focus indicators and control boundaries) at 3:1.
 *
 * Run: node output/design-review/contrast.mjs
 */
import fs from "node:fs";

const css = fs.readFileSync("src/style.css", "utf8");

function lum(hex) {
	const h = hex.replace("#", "");
	const c = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
	const lin = c.map((x) =>
		x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4,
	);
	return 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2];
}

function ratio(a, b) {
	const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
	return (hi + 0.05) / (lo + 0.05);
}

/**
 * Resolve a token as the cascade would.
 *
 * A scoped block only redefines the tokens it names; everything else inherits
 * from :root. Looking only inside the scope makes `--color-danger` look
 * undefined when it is in fact unchanged — the first version of this script
 * failed that way rather than reporting the real state.
 */
function token(name, scope) {
	const pattern = new RegExp(`--color-${name}:\\s*(#[0-9a-fA-F]{6})`);
	if (scope) {
		const scoped = (css.match(new RegExp(`\\.${scope} \\{([^}]*)\\}`)) ??
			[])[1];
		if (!scoped) throw new Error(`scope .${scope} not found in style.css`);
		const m = scoped.match(pattern);
		if (m) return m[1];
	}
	const m = css.match(pattern);
	if (!m)
		throw new Error(`token --color-${name} not found in ${scope ?? ":root"}`);
	return m[1];
}

const WHITE = "#ffffff";
const MUTED = "#f1f5f9";
const TEXT = 4.5;
const NONTEXT = 3.0;

/** [description, foreground, background, threshold] */
function palette(name, scope) {
	const p = (t) => token(t, scope);
	return [
		["主色當文字", p("primary"), WHITE, TEXT],
		["主色在 muted 底", p("primary"), MUTED, TEXT],
		["主色在自身 soft 底", p("primary"), p("primary-soft"), TEXT],
		["危險紅在 danger-soft", p("danger"), p("danger-soft"), TEXT],
		["危險紅在白底", p("danger"), WHITE, TEXT],
		["警告在 warning-soft", p("warning"), p("warning-soft"), TEXT],
		["成功在 success-soft", p("success"), p("success-soft"), TEXT],
		["次要文字在白底", p("text-secondary"), WHITE, TEXT],
		["muted 文字在白底", p("text-muted"), WHITE, TEXT],
		["白字在主色上", p("primary-foreground"), p("primary"), TEXT],
		["focus ring 在白底", p("ring"), WHITE, NONTEXT],
		["focus ring 在 muted 底", p("ring"), MUTED, NONTEXT],
		["focus ring 在 soft 底", p("ring"), p("primary-soft"), NONTEXT],
		["control 邊框在白底", p("border"), WHITE, NONTEXT],
		["control 邊框在 muted 底", p("border"), MUTED, NONTEXT],
	];
}

const failures = [];
for (const [title, scope] of [
	["病人端 / 全站", null],
	["後台 (.surface-admin)", "surface-admin"],
]) {
	const rows = palette(title, scope);
	console.log(`\n${title}`);
	for (const [desc, fg, bg, need] of rows) {
		const v = ratio(fg, bg);
		const ok = v >= need;
		if (!ok) failures.push(`${title} — ${desc}: ${v.toFixed(2)} < ${need}`);
		console.log(
			`  ${ok ? "PASS" : "FAIL"}  ${desc.padEnd(22)} ${fg} on ${bg}  ${v.toFixed(2).padStart(5)}  (需 ${need})`,
		);
	}
}

// The global :focus-visible rule must not hard-code a colour, or correcting the
// token leaves the ring unchanged on screen.
const focusRule = css.match(/:focus-visible\s*\{[^}]*\}/)?.[0] ?? "";
const hardCoded = /outline:\s*3px solid #[0-9a-fA-F]{6}/.test(focusRule);
if (hardCoded) {
	failures.push(
		":focus-visible hard-codes a colour instead of reading var(--color-ring)",
	);
}
console.log(
	`\n  ${hardCoded ? "FAIL" : "PASS"}  :focus-visible reads var(--color-ring)  ${
		hardCoded ? focusRule.replace(/\s+/g, " ") : ""
	}`,
);

console.log(
	failures.length
		? `\n未通過 ${failures.length} 項：\n` +
				failures.map((f) => `  - ${f}`).join("\n")
		: "\n全部通過",
);
process.exit(failures.length ? 1 : 0);
