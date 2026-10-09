# progress.md — v2 統一平台交接記錄

更新時間：2026-10-09　分支：`feature/multimodal-v2`
交接格式：任務／成品路徑／已完成／決定與理由／未解問題／下一步。
新 session 先讀本檔、`AGENTS.md`、`checks.md`。

## 任務

把三套既有投影（AI 病人端、qcc-inhaler-platform v1、智慧呼吸照護平台.html v2 雛型）
收成**一份 spine、一個前端、一個 API**。後端自持，資料不再進 Google Apps Script。
對外以深耕計畫／品管圈為主軸，研究為另一層。

## 成品路徑

| 產出 | 路徑 |
|---|---|
| 33 步 spine（唯一權威） | `src/domain/steps.js` |
| 17 品項目錄 | `src/domain/drugs.js` |
| 藥師名單／10 題知識題／因子 | `src/domain/roster.js` |
| 正規化 schema（10 表） | `db/schema.sql` |
| QCC 指標（可測純函式） | `api/metrics.mjs` |
| DB 連線層 | `api/db.mjs` |
| 61 例基線 fixture | `test/fixtures/baseline-61.mjs` |
| spine 測試（17） | `test/domain-spine.test.js` |
| 基線重現測試（23） | `test/baseline-reproduction.test.js` |
| 設計規格 | `docs/superpowers/specs/2026-10-09-v2-unified-platform-design.md` |
| API 路由（7 端點） | `api/routes.mjs`、`api/index.mjs` |
| 管理端成效頁 | `src/admin/Admin.tsx`、`src/admin/components/` |
| 管理端樣式 | `src/admin/admin.css` |
| 型別化 API client | `src/admin/api-client.ts` |
| API 整合測試（16） | `test/api-integration.test.js` |
| 遷移／種子／截圖腳本 | `scripts/migrate.mjs`、`scripts/seed-demo.mjs`、`scripts/render-admin.mjs` |
| render 實證截圖 | `output/design-review/admin-1280.png`、`admin-390.png` |
| 驗收表 | `checks.md` |
| 專案規則 | `AGENTS.md` |
| 全域防漂移工具 | `~/.agents/harness/toolchain_drift.py` |

## 已完成

- **Spine**：33 步 × 4 裝置，22 個★關鍵步驟，與 QCC 附件七一致。17 品項。
  條件步驟（`shake`／`ics`）正確適用。17/17 測試通過。
- **Schema**：10 表取代 107 欄長表；對本機 Docker Postgres 建置成功且可重跑。
- **指標**：對真實基線重現 457 評估／93 錯誤、每個 step 的 a/w、最差步驟排序、
  知識題弱項 [6,7,10]、柏拉圖累積 100%。23/23 測試通過。
- **API**：7 端點對真實 Postgres 驗證，16/16 過。case 與 step／知識／臨床量測同一交易
  寫入；回應不含 mrn_hash；未知 step／藥師／藥品一律拒絕。
- **管理端**：`/admin` 已可運作。單一職責「有沒有變好」，一個 verdict 區＋一張合併表。
  render 實證：20%→15%、23 列、無 console error、1280/390 無水平溢出。
- **閘門**：`npm test` exit 0（121 node）、`npm run typecheck` exit 0、`npm run build` exit 0。
- **工具鏈**：inhaler-coach 升到 Playwright 1.64.0。
- **全域規則**：`~/.agents/AGENTS.md` 補上 task lifecycle 六面向、evidence strength、
  shared-machine toolchain convergence 三節，已 `agent-sync` 投影。

## 決定與理由

| 決定 | 理由 |
|---|---|
| 後端選 Neon Postgres | Vercel Postgres 已退役至 Vercel Storage marketplace，底層即 Neon；直接選 Neon 為單一供應商、單一 driver。`pg` 在 Vercel Node runtime 與本機 Docker Postgres 行為一致，`DATABASE_URL` 是唯一開關 |
| 本機用 Docker Postgres 驗證 | 不依賴外部帳號即可對真實 DB 跑驗收；同一份 SQL 到 Neon 直接可用 |
| step 定義放 `src/domain/` | AI 教學端、藥師端、管理端共用一份；`src/config/stages.js` 的 MDI 教學關卡是**流程**不是步驟定義，維持分離 |
| 品項 `name` 用試算表 key | `Symbicort` 而非 `Symbicort Rapihaler`；基線聚合以 key join，用顯示名會靜默破壞基線 |
| 指標函式純函式、DB 由外部注入 | 可對 live Postgres 測試而不需起 server |
| Playwright 升 1.64.0 而非 1.63.0 | `bun install` 實測 `^1.63.0` 解析到 1.64.0；1.63.0 並非最新 |
| 不重建 rev 1243 | `runwayos` manifest 內 `playwright` 出現 0 次，1243 是 `bun.lock` 殘留幽靈 pin，無實際使用 |

## 未解問題

1. **藥師端尚未實作** — 管理端只完成「成效」一頁。原型還有收案評估、病人衛教、
   追蹤清單三個分頁，是藥師每日的工作入口，QCC 收案數要靠它。
2. **E2E 從未被任何閘門驗證** — `.github/workflows/ci.yml` 工作名稱含 "E2E Smoke
   Tests" 但最後一步是 `npm test`，不含 playwright。3 個失敗
   (`e2e/video-lifecycle.spec.ts`) 因此沒有回歸基準；該 spec 依賴真實 YouTube
   未 mock，headless 自動播放不穩。
3. **61 例逐筆資料不可得** — 只有聚合值；個案資料在 Google Sheet，repo 無權限。
4. **全機 Playwright 收斂被阻擋** — `fansee/the-mirror` 455 個未提交檔案，
   不可盲改 lockfile。

## 下一步

1. 取得管理端單一職責答案 → 依 `design-system-architect` + `distill` 產 2–3 個
   admin 版型（`sketch`）供選擇 → `industrial-design-critic` 獨立審查綁在實際 render 上。
2. 完成 `api/` 路由（cases 寫入／讀取、metrics 彙總、health），對 live Postgres 測。
3. 藥師端三個分頁：收案評估、病人衛教、追蹤清單。
4. `src/core/data-logger.js` 改接 `POST /api/sessions`，讓 AI 練習結果進同一份資料。
5. 決定 CI 是否真的跑 `test:e2e`，或改掉工作名稱。
6. 部署需 `DATABASE_URL`，未授權前不執行。

## 已修正的錯誤（自我審查）

| 錯誤 | 抓到的證據 |
|---|---|
| 品項 `name` 誤用顯示名當 key | 基線 join 對不上，`domain-spine` 測試失敗 |
| 品項分布誤寫 ELP 5／BRZ 2 | 測試實際為 ELP 4／BRZ 1 |
| 知識題反陷阱題預期 3 題 | 實際 4 題（3,6,7,10） |
| `baselineRows()` 產生 352 列而非 61 | 改為 `k < a` 建構 |
| errorRate 預期 2/3 | 正確為 3/4（步驟加權） |
| 最差步驟誤判為 ELP_吸 | 實測 MDI_搖 56.0%、MDI_吐 52.0% |
| **宣稱「38 例不可能」** | **實測推翻：逐步數字只是 underdetermined，非矛盾。已刪除該結論並改寫 fixture 與規格 §5** |
| 宣稱「我弄壞了 runwayos」 | manifest 內 playwright 出現 0 次，屬 `bun.lock` 殘留，未被弄壞 |
| drift 工具漏 `chromium_headless_shell-*` | 底線 vs 連字號不匹配，且列出未快取的 firefox/webkit |
| `RETURNING ... FROM` 非法 SQL | Postgres 不允許 |
| 資料修訂 CTE 回頭 join `patients` 讀不到自己剛插入的列 | 該查詢看到的是語句開始前的快照；改用 `RETURNING mrn_tail` |
| `factors` 欄傳 `JSON.stringify([])` | `text[]` 要傳陣列本身，`::jsonb` 才要字串 |
| `count(*)` 回 bigint 字串 | 加 `::int`，否則 `Number.isInteger` 判定失敗 |
| 未作答知識題被當 0 分拉低平均 | 改為 `CASE WHEN EXISTS ... END`，回 NULL 而非 0 |
| 種子藥品未對應裝置（183/52） | 依每列實際裝置挑藥品 |
| `baselineRows()` 讓一個案跨四種裝置 | 一個病人只用一種吸入劑，改為裝置內分組 |
| Pareto 依 rate 排序卻顯示累積 | 累積只在 count 排序下有意義，已改 |
| 兩張表重複同六列 | 合併為一張，補上步驟文字 |