# LINE 部署 runbook：公開給藥師測試

更新：2026-10-22 · 適用：Vercel + Neon + LINE 官方帳號 · 分支：`feature/multimodal-v2`

## 這份文件要達成什麼

一句話：**讓藥師用自己的手機，在 LINE 官方帳號裡看到機器人真的回話，而且管理端看得到收案與推播狀態。**

這不是「把網頁丟上線」就完成的事。這個系統的病人端是一個 LINE 官方帳號，
它有三段接線，缺一段病人端就不會動：

| 段 | 是什麼 | 缺了會怎樣 |
| --- | --- | --- |
| 應用 | Vercel 一支專案（`inhaler-coach`）：SPA + `/api` serverless | 頁面開不起來、API 503 |
| 資料 | Neon Postgres（`DATABASE_URL`） | 收不到案、推播排不出去 |
| 頻道 | LINE Messaging API channel（token + secret） | 機器人不回話、推播寄不出 |

## 0. 先決條件

- `bun`、`git`、`vercel` CLI 已安裝。
- `DATABASE_URL` 已在本地 `.env`（Neon，見 `docs/superpowers/specs/2026-10-09-v2-unified-platform-design.md` §2）。
- 藥師的 LINE 官方帳號管理權限：工程師已用 Email 邀請為 Administrator（10/19 會議現場完成）。

## 1. 推上 GitHub

部署跟著 GitHub 走：推上去，Vercel 自動建版。

```bash
git switch feature/multimodal-v2
git pull origin feature/multimodal-v2
bun install --frozen-lockfile
bun run typecheck && bun run test        # 兩關都過才推
git add -A && git commit -m "feat(line): ..."
git push origin feature/multimodal-v2
```

> `bun run test` 需要 `DATABASE_URL`，而且會 **truncate 資料表**。用 Neon 測試資料庫，
> 不要對著研究資料跑。

## 2. Vercel 專案與環境變數

專案已存在（`inhaler-coach`，Vite 框架）。環境變數在 Vercel 專案設定裡加：

| 變數 | 必要 | 用途 | 從哪來 |
| --- | --- | --- | --- |
| `DATABASE_URL` | 是 | Neon 連線字串 | Neon dashboard |
| `MRN_SALT` | 是 | 病歷號雜湊的鹽 | **自己決定，一經設定不可改**，改了等於換一批病人 |
| `LINE_CHANNEL_ACCESS_TOKEN` | 是 | 呼叫 LINE API | LINE Developers Console → 該 channel → Messaging API → 長期 token |
| `LINE_CHANNEL_SECRET` | 是 | 驗證 webhook 簽章 | 同上，Channel secret |
| `CRON_SECRET` | 是 | 保護派送端點 | 自己產生的隨機字串（`openssl rand -hex 32`） |
| `LINE_SEND_ENABLED` | 否 | 安全開關：`true` 才會真的寄出 | `false`（測試）或 `true`（上線） |
| `LINE_FREE_QUOTA` | 否 | 每月免費額度，預設 200 | LINE 方案 |
| `PUBLIC_BASE_URL` | 否 | 設定腳本算 webhook URL 用 | 你的網域 |

用 CLI 加：

```bash
vercel env add DATABASE_URL production      # 會提示貼上值
vercel env add LINE_CHANNEL_ACCESS_TOKEN production
```

加完要重新部署，環境變數才會生效：

```bash
vercel --prod
```

> **注意**：`MRN_SALT` 換了，舊的病歷號雜湊就對不上，系統會找不到人。首次上線後
> 就不要再動它。

## 3. 資料庫遷移

```bash
set -a && . ./.env && set +a
node scripts/migrate.mjs      # 輸出 applied schema · N tables present
```

schema 是 idempotent 的，可以重跑。

## 4. LINE 官方帳號設定

LINE Developers Console → 你的 provider → 對應的 Messaging API channel：

1. **Messaging API**：開啟後得到 **Channel secret** 與 **Channel access token（長期）**，貼到 Vercel 的環境變數。
2. **Webhook URL**：填 `https://<你的部署網域>/api/line/webhook`，並打開「使用 webhook」。
3. **關掉**「自動回應訊息」與「加入時的歡迎訊息」——機器人自己回應，LINE 自動回會變成兩份。
4. **訊息配額**：記下目前用量。每位病患一個月 5 則推播，免費額度 200 則 → 每月約 40 人。

驗收：執行下面這支，會檢查環境、資料庫、token，並印出要貼的 webhook URL。

```bash
node scripts/line-setup.mjs check --base-url=https://<你的網域>
```

## 5. 圖文選單（Rich Menu）

六格選單是病患的操作入口，定義在 `src/line/data/richmenu.json`（mockup 與腳本共用同一份）。

```bash
node scripts/line-setup.mjs preview      # 只產生圖片，自己先看
node scripts/line-setup.mjs richmenu     # 上傳並對所有加入者生效
```

上傳後 LINE 官方帳號的聊天室底部就會出現六格：我的吸入劑／操作示範影片／隨堂小測驗／
門診回診提醒／用藥疑難 Q&A／諮詢雲林藥師。每一格點下去都是機器人回話（reply token，不計費）。

## 6. 第一次測試（不寄出任何推播）

保持 `LINE_SEND_ENABLED` 未開或 `false`。此時：

- 病患自己點選、機器人回話 → **正常運作**（reply 不計費）。
- 排程推播 → **只排演**：寫進 `line_deliveries`（`channel='recording'`），不寄出、不佔額度。

請藥師照這條路徑測：

1. 用自己的手機 LINE 加藥劑部官方帳號（掃 QR 或搜尋 ID）。
2. 點開圖文選單六格，確認都有回應。
3. 走完「開始選擇我的吸入劑」：照片輪播 → 選藥 → 確認卡片 → 有無急救備用藥 → 用藥檔案。
4. 開管理端 `/admin`，確認這筆收案看得到。
5. 想看排播長什麼樣：打 `https://<網域>/api/line/dispatch?dry_run=true`。

## 7. 真的寄出

1. Vercel 設定 `LINE_SEND_ENABLED=true`（以及 `CRON_SECRET`）→ 重新部署。
2. 手動補發當天的觸點（排程要等到下一次）：

```bash
curl -X POST "https://<網域>/api/line/dispatch" \
  -H "Authorization: Bearer $CRON_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"date":"2026-10-22"}'
```

回應會告訴你 `due`（今天該發幾則）、`sent`（真的寄了幾則）、`skipped`（為什麼沒發）、
`failed`（送不出去的人與原因）、`stopped`（是否撞到每月額度上限）。

> 排演過的觸點不會擋住真正的訊息：`recording` 的那一列會被 `live` 取代。

### 7.1 現況（2026-10-22 起）

`LINE_SEND_ENABLED=true` 已在正式環境開啟。`node scripts/line-setup.mjs check
--base-url=<網域>` 會直接問部署本身「你是 live 還是 rehearsal」，不再拿筆電自己的
環境變數猜——那會對一個真的在寄的部署說「只會排演」。

### 7.2 推播只送得到「有加官方帳號好友」的病人

LINE 的規則：推播訊息只會送到**已把官方帳號加為好友**的使用者。這不是本專案的
限制，是 LINE 的。因此：

- 病人要先掃 QR code（或點 `https://line.me/R/ti/p/@806eizrs`）加好友。
- 加好友之後還要在系統裡完成「同意追蹤」，兩個條件都成立，`line_identities` 與
  `patients.consent_line` 才會對上。
- 任何一個不成立，LINE 會回 `400 {"message":"Failed to send messages"}`，
  這則會出現在推播回應的 `failed` 陣列裡。

### 7.3 一位病人失敗不會害到其他人

推播是批次作業。某一位病人送不出去（退好友、拒收、LINE 暫時故障）時，系統會

- 把失敗記在 `failed` 陣列（含原因與 HTTP 狀態），
- 刪掉那一列 `line_deliveries`（不佔名額、不擋重試），
- **繼續送下一位**。

這是 2026-10-22 實測後修的：修之前第一位失敗就整批中止，其他病人當天就收不到。

## 8. 每日排程

`vercel.json` 已設定 Vercel Cron：

```json
"crons": [{ "path": "/api/line/dispatch", "schedule": "0 1 * * *" }]
```

`0 1 UTC` = **台北時間 09:00**。Vercel 會自動帶上 `Authorization: Bearer $CRON_SECRET`，
所以排程端點不需要另外設定。`LINE_SEND_ENABLED=true` 時，端點會要求這把密鑰；
沒有密鑰的請求一律 401。

## 9. 驗收清單（給藥師）

- [ ] 官方帳號底部六格選單都點得動，每格都有回應
- [ ] 照片輪播能選到自己的藥，選完有確認卡片
- [ ] 急救備用藥有／沒有兩個分支都走過
- [ ] 管理端看得到收案與這筆的學習歷程
- [ ] 推播排程在演練模式下跑過一次，內容與時機正確
- [ ] 同意後才排播：沒有 `consent_line` 的病患不會被發訊息
- [ ] 每月額度守衛有效：額度用完會停，不是超發

## 10. 出事怎麼辦

| 狀況 | 立刻做的事 | 為什麼這樣有效 |
| --- | --- | --- |
| 訊息內容或時機不對 | Vercel 把 `LINE_SEND_ENABLED` 改回 `false` → 重新部署 | 推播停擋，機器人回話仍可用（reply 不計費） |
| 機器人完全不回話 | LINE Console 暫時停用 webhook；查 `signatureVerified` | 驗簽失敗會回 401，回應裡看得到 |
| 推播沒出來 | 查 `GET /api/line/quota?month=YYYY-MM` 與 dispatch 回應的 `skipped` | 多數是「今天已發過」或「沒有同意」 |
| 資料庫出狀況 | Neon 的時間點還原 | 部署本身不受影響 |
| 想全部收回 | 把 `LINE_SEND_ENABLED=false` + 停用 webhook | 公開頁面仍在，但不會再對病患說話 |

## 11. 常見問題

**Q：藥師說「機器人沒有回應」。**
先看部署的日誌有沒有 401（簽章不符）→ LINE Console 的 webhook URL 是否就是
`/api/line/webhook`（不是 `/api/line/event`，兩者都可，但 URL 要與設定的一致）→
token 是否被重發過（重發後舊 token 會 401）。

**Q：推播排程跑了，但 `sent` 是 0。**
看 `skipped` 的原因：最常見是「already messaged on this day」（今天已發過）、
「no consent」（沒同意）、以及 `stopped`（本月免費額度用完，200 則 / 5 則 = 40 人）。

**Q：可以讓病患自己按「都做對了」嗎？**
可以。第 14 天的檢核是一題封閉題，點一下就好；機器人會回應，點擊也會被記錄成
指標（`line_events`）。

**Q：研究計畫的對照組也會收到嗎？**
不會。`/api/line/dispatch` 只處理 `qcc_stage = '改善後'` 且已同意、已綁定 LINE 的個案。
研究計畫的實驗／對照分組分流是另一件事，尚未實作（見工作項目表）。
