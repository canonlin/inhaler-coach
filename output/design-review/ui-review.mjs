/**
 * Screenshot the pharmacist routes after the Tailwind/shadcn rebuild, so the
 * review is of what renders rather than of the diff. Reports console errors,
 * horizontal overflow and tab wiring per route.
 */
import { mkdirSync } from "node:fs";
import { chromium } from "playwright";

const PORT = Number(process.env.PORT ?? 4185);
const OUT = "output/design-review";
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const report = {};

for (const [route, name] of [
	["/admin", "case"],
	["/admin/followups", "followups"],
	["/admin/outcomes", "outcomes"],
]) {
	const page = await browser.newPage({ viewport: { width: 1280, height: 1000 } });
	const errors = [];
	page.on("pageerror", (e) => errors.push(String(e)));
	page.on("console", (m) => m.type() === "error" && errors.push(m.text()));

	await page.goto(`http://localhost:${PORT}${route}`, { waitUntil: "networkidle" });
	await page.waitForTimeout(900);

	const info = await page.evaluate(() => ({
		heading: document.querySelector("h1")?.textContent?.trim() ?? null,
		tabs: [...document.querySelectorAll(".rx-tabs a, nav[aria-label] a")].map((a) => ({
			label: a.textContent?.trim(),
			href: a.getAttribute("href"),
			current: a.getAttribute("aria-current"),
		})),
		hScroll: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
		// An element overflowing its container is the usual way a "finished"
		// layout still looks broken on a tablet.
		overflowing: [...document.querySelectorAll("*")]
			.filter((el) => el.scrollWidth > el.clientWidth + 2 && el.clientWidth > 0)
			.slice(0, 5)
			.map((el) => `${el.tagName.toLowerCase()}.${el.className?.toString().slice(0, 40)}`),
	}));

	await page.screenshot({ path: `${OUT}/ui-${name}.png`, fullPage: true });
	report[name] = { ...info, errors };
	await page.close();
}

// The tab strip must be links with real addresses; that is the whole point of
// the router change.
console.log(JSON.stringify(report, null, 2));
await browser.close();