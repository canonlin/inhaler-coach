import assert from "node:assert/strict";
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import test from "node:test";
import { chromium } from "playwright";

test("E2E Smoke: App loads homepage and Stage 0 without runtime errors", async () => {
	const distDir = path.resolve("dist");
	assert.ok(fs.existsSync(distDir), "dist directory must exist for smoke test");

	const server = http.createServer((req, res) => {
		let reqPath = req.url.split("?")[0];
		if (reqPath === "/") reqPath = "/index.html";
		const filePath = path.join(distDir, reqPath);
		if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
			const ext = path.extname(filePath);
			const contentType =
				ext === ".html"
					? "text/html"
					: ext === ".js"
						? "application/javascript"
						: ext === ".css"
							? "text/css"
							: ext === ".wasm"
								? "application/wasm"
								: "application/octet-stream";
			res.writeHead(200, { "Content-Type": contentType });
			res.end(fs.readFileSync(filePath));
		} else {
			res.writeHead(404);
			res.end();
		}
	});

	await new Promise((resolve) => server.listen(0, resolve));
	const port = server.address().port;

	const browser = await chromium.launch();
	try {
		const page = await browser.newPage();
		const pageErrors = [];
		page.on("pageerror", (err) => pageErrors.push(err.message));

		// 1. Visit homepage
		await page.goto(`http://localhost:${port}`);
		await page.waitForTimeout(500);

		assert.equal(pageErrors.length, 0, `Homepage threw errors: ${pageErrors.join(", ")}`);
		const homeText = await page.textContent("#app");
		assert.match(homeText, /吸必擴/);
		assert.match(homeText, /智慧教學平台/);

		// 2. Start practice -> opens Stage 0 (開場介紹)
		await page.click("#btn-start");
		await page.waitForTimeout(500);

		assert.equal(pageErrors.length, 0, `Stage 0 threw errors: ${pageErrors.join(", ")}`);
		const stage0Text = await page.textContent("#app");
		assert.match(stage0Text, /開場介紹/);
		assert.match(stage0Text, /衛教影片/);

		// 3. Directly load stage 1 via URL
		await page.goto(`http://localhost:${port}/?stage=1`);
		await page.waitForTimeout(500);

		assert.equal(pageErrors.length, 0, `Stage 1 threw errors: ${pageErrors.join(", ")}`);
		const stage1Text = await page.textContent("#app");
		assert.match(stage1Text, /振搖/);
	} finally {
		await browser.close();
		server.close();
	}
});
