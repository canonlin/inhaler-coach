/**
 * Open the LINE Developers Console on the machine, so the pharmacist can find
 * the channel secret and the long-lived access token without hunting.
 *
 * The browser is persistent (its profile lives in a fixed directory), so the
 * login survives between runs: sign in once, and the next run goes straight
 * to the channel.
 *
 *   node scripts/line-console.mjs [--wait 120] [--url <console url>]
 *
 * The script reports where the two credentials are on the page. It does not
 * print their values: a credential belongs in the deploy's environment, not
 * in a terminal scrollback.
 */
import { mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { chromium } from "playwright";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const PROFILE = resolve(process.env.HOME ?? "~", ".cache/inhaler-line-console");
const DEFAULT_URL = "https://developers.line.biz/console/provider/2005414319";

const args = process.argv.slice(2);
const waitSeconds = Number(
	args[args.indexOf("--wait") + 1]?.match(/^\d+$/)
		? args[args.indexOf("--wait") + 1]
		: 90,
);
const url = args.includes("--url")
	? args[args.indexOf("--url") + 1]
	: DEFAULT_URL;

const OUT = resolve(ROOT, "output/playwright");
await mkdir(OUT, { recursive: true });

const context = await chromium.launchPersistentContext(PROFILE, {
	headless: false,
	viewport: { width: 1440, height: 960 },
	args: ["--start-maximized"],
});

const page = context.pages()[0] ?? (await context.newPage());
await page.goto(url, { waitUntil: "domcontentloaded" });

/** Signed in: the console's own chrome is on the page, not a login form. */
async function signedIn() {
	try {
		return await page.evaluate(() => {
			const text = document.body?.innerText ?? "";
			const looksLikeLogin =
				/登入|Sign in|Log in|請輸入.*Email|email.*password/i.test(text) &&
				!/Messaging API|Providers|Channel ID/.test(text);
			if (looksLikeLogin) return false;
			return /Messaging API|Providers|Provider ID|Channel ID|頻道/.test(text);
		});
	} catch {
		// The page navigated out from under the evaluation. That is normal
		// here: the console redirects to the login screen on first load.
		return false;
	}
}

console.log(`開啟中：${url}`);
console.log(`profile：${PROFILE}`);

const deadline = Date.now() + waitSeconds * 1000;
let ready = false;
while (Date.now() < deadline) {
	ready = await signedIn();
	if (ready) break;
	await page.waitForTimeout(2000);
}

const shot = resolve(OUT, "line-console.png");
await page.screenshot({ path: shot, fullPage: false });
console.log(`畫面：${shot}`);
console.log(`URL：${page.url()}`);

if (!ready) {
	console.log(
		[
			"",
			"還沒看到已登入的 LINE Developers Console。",
			"請在剛剛開��的視窗中完成登入（email + 密碼，或 Magic Link），",
			"然後再跑一次這支腳本；session 會保留，不用重登。",
			"",
		].join("\n"),
	);
	await context.close();
	process.exit(2);
}

/**
 * Where the credentials are, without reading them.
 *
 * The page prints the two values; we report the labels and the buttons next
 * to them so the pharmacist knows what to press.
 */
const layout = await page.evaluate(() => {
	const text = document.body?.innerText ?? "";
	const lines = text
		.split("\n")
		.map((l) => l.trim())
		.filter(Boolean);
	const wanted = lines
		.map((line, i) => ({ line, i }))
		.filter(({ line }) =>
			/Channel secret|Channel access token|channel secret|access token/i.test(
				line,
			),
		)
		.slice(0, 12);
	return wanted.map(({ line, i }) => ({
		label: line,
		nearby: lines.slice(Math.max(0, i - 1), i + 4).filter((l) => l !== line),
	}));
});

console.log("\n頁面上與憑證相關的項目：");
for (const item of layout) {
	console.log(`  · ${item.label}`);
	for (const n of item.nearby) console.log(`      ${n}`);
}

console.log(
	[
		"",
		"下一步（照這裡按）：",
		"  1. 左側選該頻道 → 上方切到「Messaging API」分頁",
		"  2. Channel secret：就是那一欄的值",
		"  3. Channel access token (long-lived)：按「Display」或「Regenerate」產生",
		"  4. 兩��值都放進 Vercel 的環境變數（不要貼到聊天或 Git）：",
		"       LINE_CHANNEL_SECRET / LINE_CHANNEL_ACCESS_TOKEN",
		"",
	].join("\n"),
);

await context.close();
