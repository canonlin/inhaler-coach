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
| 驗收表 | `checks.md` |
| 專案規則 | `AGENTS.md` |
| 全域防漂移工具 | `~/.agents/harness/toolchain_drift.py` |

## 已完成

- **Spine**：33 步 × 4 裝置，22 個★關鍵步驟，與 QCC 附件七一致。17 品項。
  條件步驟（`shake`／`ics`）正確適用。17/17 測試通過。
- **Schema**：10 表取代 107 欄長表；對本機 Docker Postgres 建置成功且可重跑。
- **指標**：對真實基線重現 457 評估／93 錯誤、每個 step 的 a/w、最差步驟排序、
  知識題弱項 [6,7,10]、柏拉圖累積 100%。23/23 測試通過。
- **閘門**：`npm test` exit 0（120 node + 6 python）、`npm run typecheck` exit 0。
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

1. **管理端單一職責未定** — 這是前端重寫的前置決策。原型 `renderDash()` 有 11 個
   panel（依劑型長條、步驟熱圖、品項×步驟熱圖、知識答錯率、藥師×劑型、乾粉 PIF、
   順從性計數器、CAT/ACT M0→M1、醫師溝通閉環、出院用藥整合、柏拉圖），使用者明確
   認為過多。**未回答前不動工**，因為選錯職責會整個重做。
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
3. 決定 CI 是否真的跑 `test:e2e`，或改掉工作名稱。
4. 前端重寫（藥師端／管理端），React 19 + Vite 8 + Tailwind 4 沿用 repo 既有。
5. 部署需 `DATABASE_URL`，未授權前不執行。

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