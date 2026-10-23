# 吸入劑衛教平台　系統技術說明（草案）

日期：2026-10-24　狀態：**草案，待 資訊室 審閱**
撰寫：專案方（林藥師委託）　對應需求：10/22 會議提出的「資安要求、軟硬體相容性、
系統整合需求及後續維護技術規格」

> 本文件是給 資訊室 看的一份說明，不是需求書。文中每一項都對應到程式或設定上的
> 事實；若 資訊室 對任何一項有不同理解，請在該節直接標註，我們照著修。

---

## 0. 一句話

一個**純瀏覽器**的吸入器衛教平台：病人用手機的瀏覽器做吸入器動作練習（AI 在
手機上算，不上傳影像），藥師在電腦上用後台收案、追蹤與看成效。資料存在院外
Neon Postgres，後台需要登入。

---

## 1. 系統組成與位置

| 元件 | 位置 | 用途 | 對外？ |
|---|---|---|---|
| 病人端（`/`） | Vercel 靜態頁 | 相機 + AI 分關練習、衛教影片、測驗 | 是 |
| 藥師後台（`/admin`） | Vercel 靜態頁 | 收案評估、追蹤清單、成效、衛教內容 | 是，但需登入 |
| API（`/api/*`） | Vercel serverless（Node） | 所有資料寫入與讀取 | 部分 |
| 資料庫 | Neon Postgres（單一供應商） | 唯一資料庫 | 否 |
| LINE Official Account | LINE Messaging API | 個案提醒與衛教訊息 | 否 |
| 研究資料收集器 | GitHub Pages（`/collector/`） | 研究用動作影像與音訊收集 | 是（但不上傳） |

部署位置：

- Vercel 專案 `gloomcheng-9021s-projects/inhaler-coach`
- 正式網域 `https://inhaler-coach-pink.vercel.app`
- 研究收集器 `https://canonlin.github.io/inhaler-coach/collector/`

**沒有醫院內主機，沒有自建伺服器，沒有固定 IP。** 全部走 Vercel 與 Neon 的
託管服務。

---

## 2. 資料流

### 2.1 病人端（不需要帳號、不需要裝 App）

1. 病人在自己的手機上開啟網頁，輸入病歷號碼。
2. **AI 偵測全部在手機上完成**：MediaPipe（手勢／臉部／姿勢）與 ONNX Runtime
   WebAssembly，於 Web Worker 中執行。攝影機畫面**不離開裝置**。
3. 練習結束，瀏覽器只把「判定結果」送回 API：每一關的嘗試次數、AI 信心值、
   是否通過、使用的藥品。**沒有影像、沒有影片、沒有音訊被上傳。**
4. API 在伺服器端把病歷號碼雜湊掉，只存雜湊值與末 2 碼。

### 2.2 藥師後台（需登入）

1. 藥師在電腦上登入後台（帳號由系統管理員建立，密碼不進版控）。
2. 收案評估：輸入病歷號碼 → 系統帶入病人先前的 AI 練習結果 → 藥師確認相機看不到
   的步驟與兩題衛教問答 → 存檔。
3. 存檔會同時寫入：個案、步驟判定、問答、臨床量測、以及該個案的三次回診排程
   （D14／D21／D28）。一次交易完成，寫一半不會發生。
4. 追蹤清單列出今天該回診的病人；藥師在現場勾完清單後結案，結案會同時產生
   M1（前測後一個月的後測）量測。
5. 成效頁把前後測配對後算出 QCC 附件七需要的數字。

### 2.3 LINE

- 官方帳號 `@806eizrs`。病人掃 QR 碼加入後，LINE 發送提醒（D3／D7／D14／D24／
  D28 五次）與衛教影片、測驗。
- 訊息內容由後台排程產生，發送前需 `CRON_SECRET`；`LINE_SEND_ENABLED` 關閉時
  只會「排演」不外送。
- 每人每次提醒只會收到一次，重複排程不會重複計算額度。

### 2.4 研究資料收集器

- 純前端頁面，執行於 GitHub Pages。錄完**自動下載檔案到本機**，由藥師自行放進
  研究資料夾。**沒有任何資料上傳到伺服器。**
- 原始音訊與影像留在受管制的研究用本機磁碟（不在 Git、不在正式庫）。

---

## 3. 個資與資料保護

### 3.1 病歷號碼

| 項目 | 做法 |
|---|---|
| 儲存 | `patients.mrn_hash` = SHA-256(`MRN_SALT` + 病歷號碼) |
| 顯示 | `mrn_tail` = 末 2 碼（畫面上只看得見末 2 碼） |
| 還原 | **無法還原**。salt 在伺服器端環境變數，資料庫被倒出也讀不回病歷號碼 |
| API | 任何端點都不回傳 `mrn_hash` |
| Git | 病歷號碼、原始音視訊**一律不入版控** |

醫師與藥劑師之間的病歷號碼傳遞，透過瀏覽器送出並在伺服器端雜湊；不放在網址
query string（會進瀏覽器歷史、proxy log 與轉貼的連結）。

### 3.2 匯出

- 匯出的是 QCC 試算表（`.xlsx`），由藥師在後台自行下載後上傳到 QCC 雲端試算表。
- 匯出檔含病歷號碼欄位，**因此匯出是受保護路由**：需要登入，且只有 `pharmacist`
  以上權限能按。

### 3.3 加密與憑證

| 憑證 | 存放 | 用途 |
|---|---|---|
| `DATABASE_URL` | Vercel 環境變數 | Neon 連線字串（含帳密） |
| `MRN_SALT` | Vercel 環境變數 | 病歷號碼雜湊 salt |
| `CRON_SECRET` | Vercel 環境變數 | 排程端點的授權 |
| `LINE_CHANNEL_SECRET` | Vercel 環境變數 | LINE webhook 簽章驗證 |
| `LINE_CHANNEL_ACCESS_TOKEN` | Vercel 環境變數 | 發送 LINE 訊息 |
| `LINE_SEND_ENABLED` | Vercel 環境變數 | `true`＝真發送，否則只排演 |

- 以上皆為 Vercel 專案的加密環境變數，**不在 Git、不在映像檔、不寫入前端**。
- 後台登入密碼：scrypt + 每帳號獨立 salt，只存雜湊；session 以 HttpOnly cookie
  發放，**絕對 12 小時到期**（不因操作而延長）。
- 傳輸：全站 HTTPS，含 HSTS、`X-Frame-Options: DENY`、`nosniff`、嚴格的
  referrer policy。

---

## 4. 存取控制

### 4.1 公開端點（只有這些六個）

| 端點 | 為什麼公開 |
|---|---|
| `GET /api/health` | 存活檢查，不回任何資料 |
| `POST /api/sessions` | 病人自己的練習結果（病歷號碼在伺服器端雜湊） |
| `POST /api/line/webhook` | LINE 自己的 webhook（HMAC 簽章驗證） |
| `POST /api/line/event` | LINE 自己的 webhook（HMAC 簽章驗證） |
| `POST /api/line/link` | 病人端綁定自己的 LINE |
| `POST /api/line/journeys` | 病人端 LIFF 流程 |

其餘所有路由（含後台、匯出、個案清單）都需要登入 session；未登入一律 401。

### 4.2 角色

| 角色 | 可做 |
|---|---|
| `viewer` | 唯讀，看儀表板 |
| `pharmacist` | 收案、結案、匯出試算表 |
| `admin` | 改衛教內容（影片、測驗、藥品卡） |

### 4.3 排程端點

`/api/line/dispatch` 只認 `CRON_SECRET`，**不認瀏覽器 session**：能對病人發訊息
的 GET 不能被任何網頁觸發（例如用 `<img>` 指向它）。

---

## 5. 硬體與瀏覽器相容性

### 5.1 病人端

| 項目 | 需求 |
|---|---|
| 瀏覽器 | 近兩年的 Chrome / Edge / Safari / Firefox（需支援 WebAssembly 與 Web Worker） |
| 裝置 | iPhone（iOS 16 以上）、Android 手機、一般平板 |
| 權限 | 相機（`getUserMedia`，僅在按下「開始」時才請求） |
| 網路 | 只在載入模型與送出結果時需要；練習過程可離線進行 |
| 安裝 | **不需要**。沒有 App，沒有 NFC，掃 QR 碼開網頁即可 |
| 登入 | **不需要**。病人端沒有帳號系統 |

### 5.2 藥師後台

- 以**電腦瀏覽器**為主（Chrome / Edge 為準），解析度以 1280 以上為佳；平板亦可。
- 登入 cookie 為 HttpOnly + Secure，同一時間只有一組 session（12 小時）。

### 5.3 已知限制（先講清楚）

1. **WebGL 在開發機上視為不可用**，因此偵測走的是 WASM 路徑；這條路徑是目前的
   正式路徑。WebGL 加速的路徑存在但**未啟用**，因為在這台機器上量不出它的效益，
   而重新啟用它需要重新量測。
2. 老年人常見的瀏覽器與相機權限問題（例如 iOS 的相機權限提示）需要現場教學；
   藥師端已把「先輸入病歷號碼」做成唯一的第一個動作以降低這個門檻。
3. 研究用音訊與影像的品質取決於受試者手機麥克風與環境噪音；已在
   `docs/audio-exhale-evaluation.md` 記錄評估方式。

---

## 6. 維護與變更

### 6.1 程式與部署

| 項目 | 做法 |
|---|---|
| 版控 | GitHub（`origin`）為主，GitLab 為鏡像；分支 `feature/multimodal-v2` |
| CI | `.github/workflows/ci.yml`：只在 `main` 與 `feature/multimodal-v2` 跑；安裝用 `bun install --frozen-lockfile` |
| 提交前閘門 | `.git/hooks/pre-push` 會跑 `bun run typecheck` 與 `bun run test` |
| 格式 | Biome；`bun run format` 寫入、`bun run lint` 檢查同一組目錄 |
| 部署 | `vercel --prod --yes`，由專案方執行；部署後以 `GET /api/health` 驗證 |
| 回滾 | Vercel 上一版 deployment 可一鍵還原（無 DB 變更時 1 分鐘內） |

### 6.2 資料庫變更

- schema 全部寫在 `db/schema.sql`，以 `CREATE TABLE IF NOT EXISTS` +
  `ALTER TABLE … ADD COLUMN IF NOT EXISTS` 撰寫，**同一支腳本可重複執行**。
- 套用方式：`node scripts/migrate.mjs`（冪等）。
- 變更流程：改 `db/schema.sql` → 本機跑一次 → 提交 → 部署前對正式庫跑一次。

### 6.3 備份

- Neon 為託管服務，備份與時間點還原由 Neon 側提供（每日快照與時間點還原）。
- **本專案沒有自行安排額外備份**，這是本文需要 資訊室 確認的第一件事（見第 8 節）。

### 6.4 日常維運

| 項目 | 頻率 | 誰 |
|---|---|---|
| `GET /api/health` 檢查（含資料庫連線、LINE 為真發送或排演） | 每日 | 專案方 |
| LINE 訊息額度（每月 200 則免費） | 每月 | 專案方 |
| 依賴套件更新與安全修補 | 每月 | 專案方 |
| 資料庫容量與效能 | 每季 | 專案方 |

### 6.5 目前的人力與聯絡窗口

- 系統開發與維護：專案方（雲林分院藥劑部 藥師 委託之開發團隊）
- 臨床內容（影片、測驗題、藥品卡）：藥劑部
- 帳號開立與停用：藥劑部（管理員角色）

---

## 7. 已知限制與風險

1. **測試套件會清空臨床資料表**。`bun run test` 需要 `DATABASE_URL`，且會
   truncate 個案、病人、追蹤等表。目前本機的測試資料庫與正式資料庫**是同一個
   Neon database**，因此在正式收案之後於本機跑測試會清掉正式資料。這已加上
   閘門：資料庫內有臨床資料時，測試腳本會拒絕執行並說明原因（見
   `scripts/test.mjs`）。長遠應分一個 Neon branch 當測試庫。
2. **LINE 免費額度 200 則／月**，約等於 40 個案／月的推播量。額度用完即無法
   推播；系統有排程端點的額度查詢可監控。
3. **單一供應商**：Neon（資料庫）與 Vercel（應用）都是外部託管。院方若要求
   資料落地院內，需另評估。
4. **GitLab 與 GitHub 目前不同步**（分歧中），後續需對齊後再開放 GitLab 的 CI。
5. **尚未做弱點掃描與滲透測試**（見第 8 節）。

---

## 8. 需要 資訊室 回覆的問題

以下每一項都是 10/22 會議上提出、但需要院方規定才能回答的：

1. **資料落地**：本系統的病人資料（病歷號碼雜湊、衛教紀錄、LINE 綁定）存放於
   院外 Neon（AWS 東京區）。院方是否接受？若必須落地院內，請提供可用的資料庫
   與既有資安規範。
2. **資料出境**：目前資料存放於 AWS 東京區（Neon 專區）。是否有「不得出境」的
   規定？
3. **第三方服務**：Vercel、Neon、LINE、GitHub Pages 四個供應商是否需逐一申報？
4. **弱點掃描**：是否要求於正式上線前完成 SAST／DAST／滲透測試？由院方執行或
   委託第三方？
5. **稽核**：後台操作（誰看了誰的資料、誰改了衛教內容）目前只有 session 層級
   的登入紀錄（IP、User-Agent、時間）。院方是否要求完整稽核軌跡（誰、何時、
   看了哪筆、做了什麼）？
6. **留存年限**：個案資料與 LINE 對話紀錄需保存多久？
7. **備份**：Neon 每日快照是否足夠，或院方另有備份要求？
8. **可及性與裝置**：院內公用電腦是否可開啟外部 SaaS 後台（`/admin`）？有無
   指定瀏覽器版本？
9. **LINE 官方帳號**：帳號目前由專案方持有。院方是否要求移交院方帳號主體，或
   指定由誰維護 LINE 回覆規則？
10. **正式上線前是否需要院方簽核流程**（例如資訊室簽核後才部署）？

---

## 附錄：對應的程式位置

| 主題 | 檔案 |
|---|---|
| 資料庫 schema | `db/schema.sql` |
| API 邏輯 | `api/routes.mjs`、`api/route-table.mjs` |
| 個資雜湊與連線 | `api/db.mjs` |
| 登入與 session | `api/auth.mjs` |
| 部署設定 | `vercel.json`、`api/index.mjs` |
| 病人端 AI 偵測 | `src/detection/`、`src/steps/`、`workers/` |
| 藥師後台 | `src/pharmacist/`、`src/api-client.ts` |
| 部署與維運手冊 | `docs/line-deployment-runbook.md`、`docs/admin-access-runbook.md` |
| 設計規格 | `docs/superpowers/specs/2026-10-09-v2-unified-platform-design.md` |
