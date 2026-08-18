import { test, expect } from "@playwright/test";

const VIDEO_END_TIMEOUT = 20_000;

test.describe("Video lifecycle — buttons only after video ends", () => {
	test("stage 1: no buttons during playback, buttons appear after end", async ({
		page,
	}) => {
		await page.goto("/");
		await page.locator("#btn-start").click();
		await page.waitForSelector("#yt-player", { timeout: 10_000 });

		// Video just started — overlay + buttons must be hidden
		await expect(page.locator("text=衛教影片播放完畢")).not.toBeVisible();
		await expect(page.locator("button:has-text('重播影片')")).not.toBeVisible();
		await expect(
			page.locator("button:has-text('開始 AI 辨識練習')"),
		).not.toBeVisible();

		// Still playing at 4s — still hidden
		await page.waitForTimeout(4000);
		await expect(page.locator("text=衛教影片播放完畢")).not.toBeVisible();
		await expect(page.locator("button:has-text('重播影片')")).not.toBeVisible();

		// Wait for video to finish
		await expect(page.locator("text=衛教影片播放完畢")).toBeVisible({
			timeout: VIDEO_END_TIMEOUT,
		});
		await expect(page.locator("button:has-text('重播影片')")).toBeVisible();
		await expect(
			page.locator("button:has-text('開始 AI 辨識練習')"),
		).toBeVisible();
	});

	test("stage 1: replay hides overlay, reappears after replay ends", async ({
		page,
	}) => {
		await page.goto("/");
		await page.locator("#btn-start").click();
		await page.waitForSelector("#yt-player", { timeout: 10_000 });

		// Wait for video to end
		await expect(page.locator("text=衛教影片播放完畢")).toBeVisible({
			timeout: VIDEO_END_TIMEOUT,
		});

		// Click replay — overlay must disappear
		await page.locator("button:has-text('重播影片')").click();
		await page.waitForTimeout(1500);
		await expect(page.locator("text=衛教影片播放完畢")).not.toBeVisible();
		await expect(page.locator("button:has-text('重播影片')")).not.toBeVisible();

		// After replay finishes — overlay + buttons return
		await expect(page.locator("text=衛教影片播放完畢")).toBeVisible({
			timeout: VIDEO_END_TIMEOUT,
		});
		await expect(page.locator("button:has-text('重播影片')")).toBeVisible();
	});

	test("stage 1: '開始闖關' button does NOT appear (only AI button)", async ({
		page,
	}) => {
		await page.goto("/");
		await page.locator("#btn-start").click();
		await page.waitForSelector("#yt-player", { timeout: 10_000 });

		// Wait for video to end
		await expect(page.locator("text=衛教影片播放完畢")).toBeVisible({
			timeout: VIDEO_END_TIMEOUT,
		});

		// stage 1 shows AI button, NOT 開始闖關
		await expect(
			page.locator("button:has-text('開始 AI 辨識練習')"),
		).toBeVisible();
		await expect(
			page.locator("button:has-text('開始闖關')"),
		).not.toBeVisible();
	});
});
