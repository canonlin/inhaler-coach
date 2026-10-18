/**
 * Accessibility guard: the checks that can be made mechanically, run against
 * the rendered page rather than asserted in prose.
 *
 * Scope is deliberately narrow — these four fail loudly and mean something:
 *
 *   1. Text contrast against its actual painted background (WCAG 1.4.3).
 *   2. Every control and link has an accessible name (WCAG 4.1.2).
 *   3. Every form control has a programmatic label (WCAG 3.3.2 / 1.3.1).
 *   4. Table headers carry a scope (WCAG 1.3.1).
 *
 * Not covered, and I am not claiming they are: colour-blind legibility of the
 * chart bands, screen-reader order, keyboard trap detection, zoom to 400%.
 * Those need a person, and saying "guard passed" must not imply otherwise.
 *
 * Run: node output/design-review/a11y-guard.mjs
 */
import { chromium } from "playwright";

const BASE = process.env.BASE ?? "http://localhost:4185";
const PAGES = [
	["admin", "/admin"],
	["queue", "/admin/followups"],
	["outcomes", "/admin/outcomes"],
	["line", "/line"],
	["line-register", "/line/register"],
	["line-videos", "/line/videos"],
	["line-quiz", "/line/quiz"],
];

// A11Y_ONLY=/line,/line/quiz runs a subset (vite only — the LIFF pages are
// static and need no API, so they can be checked without a database).
const ONLY = process.env.A11Y_ONLY?.split(",").map((s) => s.trim());
const TARGETS = ONLY ? PAGES.filter(([, p]) => ONLY.includes(p)) : PAGES;
if (ONLY && TARGETS.length === 0) {
	console.error(`A11Y_ONLY matched no pages: ${ONLY.join(",")}`);
	process.exit(1);
}

/** WCAG AA: 4.5:1 for body text, 3:1 for text at 18.66px+ bold or 24px+. */
function luminance(rgb) {
	const [r, g, b] = rgb.map((v) => {
		const s = v / 255;
		return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
	});
	return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function contrast(fg, bg) {
	const l1 = luminance(fg);
	const l2 = luminance(bg);
	const [hi, lo] = l1 > l2 ? [l1, l2] : [l2, l1];
	return (hi + 0.05) / (lo + 0.05);
}

const browser = await chromium.launch();
const findings = [];

for (const [name, path] of TARGETS) {
	const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
	await page.goto(`${BASE}${path}`, { waitUntil: "networkidle" });
	await page.waitForTimeout(1200);

	const page_findings = await page.evaluate(() => {
		const out = { contrast: [], unnamed: [], unlabelled: [], unscoped: [] };

		const parse = (c) => {
			const m = c.match(/rgba?\(([^)]+)\)/);
			if (!m) return null;
			const p = m[1].split(",").map((x) => parseFloat(x));
			return { rgb: [p[0], p[1], p[2]], a: p.length > 3 ? p[3] : 1 };
		};

		/** Walk up until something actually paints a background. */
		const bgOf = (el) => {
			let n = el;
			while (n && n !== document.documentElement) {
				const c = parse(getComputedStyle(n).backgroundColor);
				if (c && c.a > 0.05) return c.rgb;
				n = n.parentElement;
			}
			return [255, 255, 255];
		};

		const text = (el) => (el.textContent ?? "").trim().slice(0, 40);

		for (const el of document.querySelectorAll("body *")) {
			const cs = getComputedStyle(el);
			if (cs.visibility === "hidden" || cs.display === "none") continue;
			if (el.closest(".sr-only")) continue;

			// 1. Contrast, on elements that directly hold text.
			if (el.children.length === 0 && text(el)) {
				const fg = parse(cs.color);
				const bg = bgOf(el);
				if (fg) {
					const size = parseFloat(cs.fontSize);
					const bold = parseInt(cs.fontWeight, 10) >= 700;
					const large = size >= 24 || (size >= 18.66 && bold);
					out.contrast.push({
						text: text(el),
						size,
						fg: fg.rgb,
						bg,
						large,
						cls: String(el.className).slice(0, 50),
					});
				}
			}

			// 2. Accessible name on every control.
			const interactive = el.matches(
				"button, a[href], [role=button], [role=checkbox], [role=combobox], [role=option]",
			);
			if (interactive) {
				const name =
					el.getAttribute("aria-label") ||
					el.getAttribute("title") ||
					text(el);
				const labelled = el.id
					? document.querySelector(`label[for="${CSS.escape(el.id)}"]`)
					: null;
				if (!name && !labelled) {
					out.unnamed.push({ tag: el.tagName, cls: String(el.className).slice(0, 50) });
				}
			}

			// 3. Every form control labelled.
			if (el.matches("input, select, textarea")) {
				const hasLabel =
					el.getAttribute("aria-label") ||
					el.getAttribute("aria-labelledby") ||
					(el.id && document.querySelector(`label[for="${CSS.escape(el.id)}"]`));
				if (!hasLabel) {
					out.unlabelled.push({
						tag: el.tagName,
						id: el.id,
						type: el.getAttribute("type"),
					});
				}
			}
		}

		// 4. Table headers scoped.
		for (const th of document.querySelectorAll("table th")) {
			if (!th.getAttribute("scope")) {
				out.unscoped.push({ text: text(th), table: th.closest("table")?.dataset?.testid ?? "?" });
			}
		}
		return out;
	});

	const seen = new Set();
	for (const c of page_findings.contrast) {
		const ratio = contrast(c.fg, c.bg);
		const need = c.large ? 3 : 4.5;
		if (ratio < need) {
			const key = `${name}:${c.text}:${ratio.toFixed(2)}`;
			if (!seen.has(key)) {
				seen.add(key);
				findings.push({
					page: name,
					rule: "1.4.3 對比",
					detail: `${ratio.toFixed(2)}:1 < ${need}:1 — 「${c.text}」 ${c.size}px`,
				});
			}
		}
	}
	for (const u of page_findings.unnamed) {
		findings.push({ page: name, rule: "4.1.2 無障礙名稱", detail: `${u.tag} .${u.cls}` });
	}
	for (const u of page_findings.unlabelled) {
		findings.push({ page: name, rule: "1.3.1 表單標籤", detail: `${u.tag}#${u.id} type=${u.type}` });
	}
	for (const u of page_findings.unscoped) {
		findings.push({ page: name, rule: "1.3.1 表頭 scope", detail: `${u.table} 「${u.text}」` });
	}
	await page.close();
}

await browser.close();

console.log(`\na11y guard — ${BASE}`);
console.log(`檢查：對比（1.4.3）、無障礙名稱（4.1.2）、表單標籤與表頭（1.3.1）`);
console.log(`未涵蓋：色盲辨識、螢幕閱讀器順序、鍵盤陷阱、400% 縮放。這些要人。\n`);

if (!findings.length) {
	console.log("✓ 通過（僅限上述可機械檢查的項目）");
} else {
	const byRule = new Map();
	for (const f of findings) {
		if (!byRule.has(f.rule)) byRule.set(f.rule, []);
		byRule.get(f.rule).push(f);
	}
	for (const [rule, rows] of byRule) {
		console.log(`✗ ${rule} — ${rows.length}`);
		for (const r of rows.slice(0, 8)) console.log(`    [${r.page}] ${r.detail}`);
		if (rows.length > 8) console.log(`    …另有 ${rows.length - 8} 項`);
	}
}
process.exit(findings.length ? 1 : 0);

// The evaluate body needs to return its object; kept separate so the rule
// checks above stay readable.
function out_findings_placeholder(o) {
	return o;
}