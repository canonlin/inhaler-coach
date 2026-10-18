import { chromium } from "playwright";

const BASE = process.env.BASE ?? "http://localhost:5173";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1300, height: 1100 } });

await page.goto(`${BASE}/line-mockup`, { waitUntil: "networkidle" });
await page.waitForTimeout(600);

// 1. Click on "2. 處方登記與選藥" to see the drug carousel
await page.click("button:has-text('2. 處方登記與選藥')");
await page.waitForTimeout(500);
await page.screenshot({ path: "output/design-review/shot-step-2-carousel.png" });

// Click on "👉 我是用這瓶" to see the rescue inhaler prompt with real photo
await page.click("button:has-text('👉 我是用這瓶')");
await page.waitForTimeout(500);
await page.screenshot({ path: "output/design-review/shot-step-2-rescue-prompt.png" });

// 2. Click on "3. D0 個人化用藥卡" to see Dual-tag profile + Video Card
await page.click("button:has-text('3. D0 個人化用藥卡')");
await page.waitForTimeout(500);
await page.screenshot({ path: "output/design-review/shot-step-3-profile-video.png" });

// 2. Click on "4. D0 操作示範短片" to see Video Card
await page.click("button:has-text('4. D0 操作示範短片')");
await page.waitForTimeout(500);
await page.screenshot({ path: "output/design-review/shot-step-4-video.png" });

// 3. Click on "全流程連續滾動" and scroll to show middle / end
await page.click("button:has-text('全流程連續滾動')");
await page.waitForTimeout(600);

// Scroll the chat area down to show dividers and interactions
const chatArea = page.locator(".line-chat-area");
await chatArea.evaluate((el) => { el.scrollTop = 1200; });
await page.waitForTimeout(400);
await page.screenshot({ path: "output/design-review/shot-full-stream-mid.png" });

await chatArea.evaluate((el) => { el.scrollTop = el.scrollHeight; });
await page.waitForTimeout(400);
await page.screenshot({ path: "output/design-review/shot-full-stream-end.png" });

await browser.close();
console.log("Screenshots captured successfully");
