/**
 * LINE setup: check the deploy, and put the Rich Menu on the real channel.
 *
 * A deploy is not finished when the page loads. The patient half of this
 * system is a LINE Official Account, and it has three things to be right:
 * the webhook must point at the deployment, the signature must be verified,
 * and the Rich Menu must be the same six cells the pharmacist designed.
 *
 *   node scripts/line-setup.mjs check
 *       What is configured, what is missing, and the exact URL to paste into
 *       the LINE console. Sends nothing.
 *
 *   node scripts/line-setup.mjs richmenu [--dry-run]
 *       Renders the 2500x1686 menu image from src/line/data/richmenu.json,
 *       uploads it, and links it to every user of the channel.
 *
 *   node scripts/line-setup.mjs preview
 *       Writes the menu image to output/line/richmenu.png and stops, so it can
 *       be looked at before it is uploaded to a channel patients can see.
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const RICH_MENU = JSON.parse(
	await readFile(resolve(ROOT, "src/line/data/richmenu.json"), "utf8"),
);

/** LINE's Rich Menu canvas for a 3x2 grid. */
const IMAGE_WIDTH = 2500;
const IMAGE_HEIGHT = 1686;
const COLUMNS = 3;
const ROWS = 2;

const command = process.argv[2] ?? "check";
const dryRun = process.argv.includes("--dry-run");

/** Where the deployment lives. Needed to tell LINE where the webhook is. */
function baseUrl() {
	const arg = process.argv.find((a) => a.startsWith("--base-url="));
	if (arg) return arg.slice("--base-url=".length).replace(/\/$/, "");
	return (process.env.PUBLIC_BASE_URL ?? "").replace(/\/$/, "");
}

function token() {
	return process.env.LINE_CHANNEL_ACCESS_TOKEN ?? "";
}

function secret() {
	return process.env.LINE_CHANNEL_SECRET ?? "";
}

function lineHeaders() {
	return {
		Authorization: `Bearer ${token()}`,
		"Content-Type": "application/json",
	};
}

async function check() {
	const problems = [];
	const notes = [];

	// 1. The environment a deploy needs.
	if (!process.env.DATABASE_URL)
		problems.push("DATABASE_URL 未設定（API 會回 503）");
	if (!token())
		problems.push("LINE_CHANNEL_ACCESS_TOKEN 未設定（機器人收不到推播）");
	if (!secret())
		problems.push(
			"LINE_CHANNEL_SECRET 未設定（webhook 不驗簽，會被 LINE 與安全設定擋下）",
		);
	if (!baseUrl())
		notes.push(
			"PUBLIC_BASE_URL 未設定：無法算出 webhook URL，請用 --base-url=https://你的網域 指定",
		);

	// 2. The database.
	if (process.env.DATABASE_URL) {
		try {
			const { createPool } = await import("../api/db.mjs");
			const pool = createPool(process.env.DATABASE_URL);
			const { rows } = await pool.query(
				"SELECT count(*)::int AS n FROM information_schema.tables WHERE table_schema = 'public'",
			);
			const tables = rows[0].n;
			if (tables === 0) {
				problems.push("資料庫是空的：先跑 node scripts/migrate.mjs");
			} else {
				notes.push(`資料庫可連線，${tables} 張表`);
			}
			await pool.end();
		} catch (err) {
			problems.push(`資料庫連不上：${err.message}`);
		}
	}

	// 3. The channel.
	if (token()) {
		try {
			const res = await fetch("https://api.line.me/v2/bot/info", {
				headers: lineHeaders(),
			});
			if (res.ok) {
				const info = await res.json();
				notes.push(`LINE 頻道：${info.displayName}（${info.userId}）`);
			} else {
				problems.push(
					`LINE token 無效（HTTP ${res.status}）：到 LINE 後台「訊息 API」重新複製`,
				);
			}
		} catch (err) {
			problems.push(`連不到 LINE API：${err.message}`);
		}
	}

	// 4. Whether the deploy would actually message a patient.
	//
	// The deployed state is the one that matters. This script usually runs on
	// a laptop whose own environment variables say nothing about what the
	// deployment does, and a check that reports the laptop is worse than no
	// check: it says "推播只會排演" about a deployment that is really sending.
	// So the deployment is asked, and the local environment is only a fallback.
	let deployed = null;
	if (baseUrl()) {
		try {
			const res = await fetch(`${baseUrl()}/api/health`, {
				signal: AbortSignal.timeout(5000),
			});
			const json = await res.json();
			if (json?.lineSending) deployed = json.lineSending;
		} catch {
			// The deployment did not answer; fall back to what this machine knows.
		}
	}
	const sending =
		deployed ??
		(process.env.LINE_SEND_ENABLED === "true" ? "live" : "rehearsal");
	notes.push(
		deployed
			? `部署狀態：推播${sending === "live" ? "會真的寄出" : "只會排演（寫紀錄、不寄出）"}（由部署回報）`
			: sending === "live"
				? "LINE_SEND_ENABLED=true：推播會真的寄出，請確認你已經準備好"
				: "LINE_SEND_ENABLED 未開：推播只會排演（寫紀錄、不寄出），適合測試",
	);

	console.log(`\n部署檢查\n${"─".repeat(64)}`);
	for (const n of notes) console.log(`  · ${n}`);
	if (problems.length) {
		console.log("\n缺少的東西：");
		for (const p of problems) console.log(`  ✗ ${p}`);
	} else {
		console.log("\n  ✓ 環境設定齊全");
	}

	if (baseUrl()) {
		console.log("\n請在 LINE Developers Console 填這個 webhook URL：");
		console.log(`  ${baseUrl()}/api/line/webhook`);
		console.log(
			"（Messaging API channel → Webhook URL，並記得開啟「使用 webhook」）",
		);
	}
	console.log(
		`\n${"─".repeat(64)}\n接著：node scripts/line-setup.mjs richmenu\n`,
	);
	process.exit(problems.length ? 1 : 0);
}

/** The six cells, as LINE area definitions. */
function areas() {
	const cellWidth = Math.floor(IMAGE_WIDTH / COLUMNS);
	const cellHeight = Math.floor(IMAGE_HEIGHT / ROWS);
	return RICH_MENU.items.map((item, index) => ({
		bounds: {
			x: (index % COLUMNS) * cellWidth,
			y: Math.floor(index / COLUMNS) * cellHeight,
			width: cellWidth,
			height: cellHeight,
		},
		action: { type: "message", label: item.label, text: item.text },
	}));
}

/**
 * The menu image, drawn in a browser.
 *
 * A PNG is binary and the text on it has to be legible to an elderly patient,
 * so the image is rendered from HTML rather than assembled pixel by pixel.
 */
function menuHtml() {
	const cells = RICH_MENU.items
		.map((item) => {
			const badge = item.badge
				? `<div style="position:absolute;top:48px;right:56px;background:#F43F5E;color:#fff;font-size:34px;font-weight:700;padding:6px 26px;border-radius:999px;">${item.badge}</div>`
				: "";
			return `
			<div style="position:relative;background:${item.fill};border-right:4px solid #E2E8F0;border-bottom:4px solid #E2E8F0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:18px;">
				${badge}
				<div style="width:150px;height:150px;border-radius:40px;background:#fff;display:flex;align-items:center;justify-content:center;border:6px solid ${item.accent};">
					<div style="width:78px;height:78px;border-radius:50%;background:${item.accent};"></div>
				</div>
				<div style="font-size:64px;font-weight:700;color:${item.ink};letter-spacing:2px;">${item.label}</div>
				<div style="font-size:38px;color:#64748B;">${item.sublabel}</div>
			</div>`;
		})
		.join("");

	return `<!doctype html><html><head><meta charset="utf-8">
		<style>
			* { margin:0; padding:0; box-sizing:border-box; }
			body { width:${IMAGE_WIDTH}px; height:${IMAGE_HEIGHT}px; display:grid;
				grid-template-columns:repeat(${COLUMNS},1fr); grid-template-rows:repeat(${ROWS},1fr);
				font-family:"PingFang TC","Noto Sans TC","Microsoft JhengHei",sans-serif; }
		</style></head><body>${cells}</body></html>`;
}

async function renderImage() {
	const { chromium } = await import("playwright");
	const browser = await chromium.launch();
	try {
		const page = await browser.newPage({
			viewport: { width: IMAGE_WIDTH, height: IMAGE_HEIGHT },
			deviceScaleFactor: 1,
		});
		await page.setContent(menuHtml(), { waitUntil: "load" });
		const out = resolve(ROOT, "output/line/richmenu.png");
		await mkdir(dirname(out), { recursive: true });
		await page.screenshot({ path: out, type: "png" });
		return out;
	} finally {
		await browser.close();
	}
}

async function richmenu() {
	if (!token()) {
		console.error("LINE_CHANNEL_ACCESS_TOKEN 未設定，沒有辦法上傳。");
		process.exit(1);
	}

	const imagePath = await renderImage();
	const image = await readFile(imagePath);
	console.log(
		`選單圖已產生：${imagePath}（${Math.round(image.length / 1024)} KB）`,
	);

	// The Rich Menu is created and uploaded in two calls, and the second one
	// lives on a different host: api-data.line.me carries the image, api.line.me
	// carries everything else. The one-shot multipart upload to api.line.me is
	// rejected by the API (HTTP 415).
	const request = {
		size: { width: IMAGE_WIDTH, height: IMAGE_HEIGHT },
		// `selected` is required by the API. False means "not the default menu
		// until it is linked".
		selected: false,
		name: "InhaSync 吸入劑衛教選單",
		chatBarText: RICH_MENU.chatBarText,
		areas: areas(),
	};

	if (dryRun) {
		console.log("\n--dry-run：不上傳。以下是會送出的內容：\n");
		console.log(JSON.stringify(request, null, 2));
		return;
	}

	const created = await fetch("https://api.line.me/v2/bot/richmenu", {
		method: "POST",
		headers: {
			Authorization: `Bearer ${token()}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify(request),
	});
	if (!created.ok) {
		console.error(
			`建立選單失敗（HTTP ${created.status}）：${await created.text()}`,
		);
		process.exit(1);
	}
	const { richMenuId } = await created.json();
	console.log(`選單已建立：${richMenuId}`);

	const uploaded = await fetch(
		`https://api-data.line.me/v2/bot/richmenu/${richMenuId}/content`,
		{
			method: "POST",
			headers: {
				Authorization: `Bearer ${token()}`,
				"Content-Type": "image/png",
			},
			body: image,
		},
	);
	if (!uploaded.ok) {
		console.error(
			`上傳圖片失敗（HTTP ${uploaded.status}）：${await uploaded.text()}`,
		);
		process.exit(1);
	}
	console.log("圖片已上傳。");

	// The default rich menu is set per channel, not per user: this is what
	// makes the menu appear to everybody who opens the chat. The old
	// /richmenu/link/all endpoint is gone from the API.
	const link = await fetch(
		`https://api.line.me/v2/bot/user/all/richmenu/${richMenuId}`,
		{
			method: "POST",
			headers: lineHeaders(),
		},
	);
	if (!link.ok) {
		console.error(`綁定失敗（HTTP ${link.status}）：${await link.text()}`);
		process.exit(1);
	}
	console.log("已對所有加入的病患生效。");
	console.log(
		`\n檢查：打開 LINE 官方帳號 → 聊天室底部應該看得到六格選單。\n${"─".repeat(64)}\n`,
	);
}

/** The Rich Menu definition, as a file the pharmacist can archive. */
async function preview() {
	const imagePath = await renderImage();
	await writeFile(
		resolve(ROOT, "output/line/richmenu.json"),
		JSON.stringify(
			{
				size: { width: IMAGE_WIDTH, height: IMAGE_HEIGHT },
				name: "InhaSync 吸入劑衛教選單",
				chatBarText: RICH_MENU.chatBarText,
				areas: areas(),
			},
			null,
			2,
		),
	);
	console.log(`選單圖：${imagePath}`);
	console.log(`選單定義：${resolve(ROOT, "output/line/richmenu.json")}`);
}

if (command === "check") await check();
else if (command === "richmenu") await richmenu();
else if (command === "preview") await preview();
else {
	console.error(`不明的指令：${command}`);
	console.error("可用：check · richmenu · preview");
	process.exit(2);
}
