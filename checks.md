# checks.md — v2 統一平台

驗收條件逐條對照。證據為檔案路徑、指令實際輸出或外部來源。
無證據者維持「未過」，不因已完成而改標。

分支：`feature/multimodal-v2`

## A. Spine（單一權威定義）

| # | 要求 | 結果 | 證據 | 修正 |
|---|---|---|---|---|
| A1 | 33 步定義只存在一份 | 過 | `rtk grep -rl 'MDI_搖' src/ api/ scripts/` → 定義只有 `src/domain/steps.js`；`api/metrics.mjs` 僅在 JSDoc 範例中提到該 code（消費端，非定義）；`test/` 3 個檔案為斷言 | — |
| A2 | 4 裝置步驟數 MDI 8／RSP 8／ELP 7／BRZ 10 | 過 | `node --test test/domain-spine.test.js` → `per-device step counts` 過 | — |
| A3 | 22 個★關鍵步驟與附件七一致 | 過 | 同上 `marks the check-table critical steps` 過 | — |
| A4 | 17 個品項，MDI 9／RSP 3／ELP 4／BRZ 1 | 過 | `has 9 MDI, 3 Respimat, 4 Ellipta, 1 Breezhaler products` 過 | 初次誤寫 5/2，測試抓到後改正 |
| A5 | `name` 為試算表 key（`Symbicort`），非顯示名 | 過 | `drugOf("Symbicort").label === "Symbicort Rapihaler"` | 初次誤用顯示名當 key，會破壞基線 join，已改正 |
| A6 | Trimbow 溶液型不需搖 | 過 | `DRUG_BY_NAME.Trimbow.needsShake === false` | — |
| A7 | 10 題知識題、4 題反向陷阱（3,6,7,10） | 過 | `keeps the four reversed (trap) questions` 過 | 初次預期 3 題，測試抓到實為 4 題 |
| A8 | ICS／shake 條件步驟正確適用 | 過 | `drops the ICS rinse step…` 過 | — |

## B. 資料庫

| # | 要求 | 結果 | 證據 | 修正 |
|---|---|---|---|---|
| B1 | 10 張表可建置 | 過 | `docker exec -i inhaler-pg psql … < db/schema.sql` → 10 rows in `\dt` | — |
| B2 | schema 可重跑（idempotent） | 過 | 同指令第二次執行無 ERROR | — |
| B3 | 病歷號碼不出 server | 過 | `db/schema.sql` 僅 `mrn_hash` + `mrn_tail`，`mrn_hash` 為 `UNIQUE` 索引 | — |
| B4 | CHECK 約束與 domain 一致 | 過 | `device IN ('MDI','RSP','ELP','BRZ')`、`timepoint`、`qcc_stage`、`priority` 皆與 spine 同值 | — |

## C. 指標正確性（對真實基線）

| # | 要求 | 結果 | 證據 | 修正 |
|---|---|---|---|---|
| C1 | 重現 457 評估／93 錯誤 | 過 | `node --test test/baseline-reproduction.test.js` → `reproduces 457 assessed and 93 wrong steps` 過 | — |
| C2 | 每個 step 的 a/w 逐一相符（23 個有資料） | 過 | `reproduces every per-step assessed and wrong count` 過 | — |
| C3 | 最差步驟 MDI_搖 56.0%、MDI_吐 52.0% | 過 | `puts the two worst steps…` 過 | 初次誤判為 ELP_吸，實測後改正 |
| C4 | `na` 不算錯 | 過 | `treats an inapplicable step as neither right nor wrong` 過 | — |
| C5 | errorRate 步驟加權／criticalRate 個案加權 | 過 | `measures criticalRate by case, not by step` → 3/4 與 1/3 | 初次預期 2/3，實測改正 |
| C6 | 個案層級 40／38 **不可**由逐步數字重算 | 過（已驗證為 underdetermined，非矛盾） | `reproduces step counts while case-level rollups vary`；fixture 14 vs published 38 | 原稿稱「38 不可能」為錯誤結論，已刪除並改為 underdetermined |
| C7 | 知識題弱項 Q6/Q7/Q10 | 過 | `flags the questions answered correctly by under half` → [6,7,10] | — |
| C8 | 柏拉圖累積至 100% | 過 | `accumulates to 100% of wrong steps` 過 | — |

## D. API（對真實 Postgres）

| # | 要求 | 結果 | 證據 | 修正 |
|---|---|---|---|---|
| D1 | schema 可用 script 套用 | 過 | `npm run test:db` → `applied schema · 10 tables present` | — |
| D2 | case 與 step/知識/臨床量測同一交易寫入 | 過 | `writes a case with steps, knowledge and measures in one transaction` 過 | — |
| D3 | 回應不含 mrn_hash | 過 | `never returns the hashed medical record number` 過 | — |
| D4 | 拒絕 spine 未定義的 step code | 過 | `rejects a step code the spine does not define` 過 | — |
| D5 | 拒���不存在的藥師／藥品 | 過 | 兩個 `rejects an unknown…` 過 | — |
| D6 | 同 MRN 不重複建 patient | 過 | `reuses the patient row when the same MRN returns` 過 | — |
| D7 | metrics 由實際 step 結果算出 | 過 | `computes the error rate from stored step results` → 1/5 | — |
| D8 | 未記錄的步驟不進分母 | 過 | `excludes an unrecorded step from the denominator` | — |
| D9 | 知識分數排除未作答個案 | 過 | `counts knowledge answers as integers, not bigint strings` | — |
| D10 | session 記錄 attempts/信心/藥師判定 | 過 | `records AI coaching attempts…` 過 | — |
| D11 | followups 標記逾期／即將到期 | 過 | `api/routes.mjs` `followups()`；尚無種子資料 | — |
| D12 | API 測試共 16 項全過 | 過 | `DATABASE_URL=… npm run test:api` → 16/16 | — |

## E. 管理端（render 實證）

| # | 要求 | 結果 | 證據 | 修正 |
|---|---|---|---|---|
| E1 | 頁面載入真實 API 資料 | 過 | `npm run render:admin` → heading `有沒有變好`、verdict `20%→15%`、23 列 | — |
| E2 | 無 console error | 過 | `console errs : none` | — |
| E3 | 1280 與 390 皆無水平溢出 | 過 | `h-scroll : none` / `h-scroll@390 : none` | — |
| E4 | 截圖產出 | 過 | `output/design-review/admin-1280.png`、`admin-390.png` | — |
| E5 | 種子資料重現已公布基線 | 過 | seed 輸出 `改善前: 61 cases, 457 assessed, 93 wrong` | 初版藥品未對應裝置，得到 183/52，已修 |
| E6 | Pareto 依錯誤**次數**排序 | 過 | API 回 `MDI_搖 19, MDI_吐 18, MDI_壓 18, ELP_吸 11` | 初版依 rate 排序，累積欄非單調，已修 |
| E7 | 兩張重複表格合併為一張 | 過 | `StepTable` 同時顯示錯誤率與累積佔比 | — |
| E8 | 累積佔比隨列單調遞增 | 過 | render 實測 17→32→48→58→67→73% | — |

## F. 工具鏈

| # | 要求 | 結果 | 證據 | 修正 |
|---|---|---|---|---|
| F1 | inhaler-coach 升到最新 Playwright | 過 | `package.json` `^1.63.0` → resolved `playwright-core 1.64.0` | — |
| F2 | 單元／型別／建置閘門仍綠 | 過 | `npm test` exit 0（121 node）；`npm run typecheck` exit 0；`npm run build` exit 0 | — |
| F3 | E2E 可跑 | **未過** | `npx playwright test` → 3 failed，全在 `e2e/video-lifecycle.spec.ts:6/35/60`，等 `衛教影片播放完畢` | 未修，見 E3 |
| F4 | 全域防漂移工具 | 過 | `~/.agents/harness/toolchain_drift.py`；`--json` 可用；exit 1 on drift | 初版漏 `chromium_headless_shell-*`（底線 vs 連字號）且列出未快取的 firefox/webkit，已修 |
| F5 | 全域規則 | 過 | `~/.agents/AGENTS.md` § Shared-machine toolchain convergence；`agent-sync` 已投影 | — |

## G. 已知缺口（未修，需決策）

| # | 缺口 | 證據 | 影響 |
|---|---|---|---|
| G1 | CI 工作名稱為 `Typecheck, Build, & E2E Smoke Tests`，但最後一步是 `npm test`＝`node --test && python -m unittest`，**不含 E2E** | `.github/workflows/ci.yml:48-49`；`package.json:15` `test` 不含 playwright | E2E 從未被任何閘門驗證；D3 的失敗因此無回歸基準 |
| G2 | 管理端僅完成成效頁 | repo 內無 admin 前端；`src/domain/`+`api/metrics.mjs` 為目前產出 | 圖上 6 項成果的第 1、4 項仍無畫面可驗收 |
| G3 | E2E 依賴真實 YouTube，未 mock | `e2e/video-lifecycle.spec.ts` 無 `route`/`fulfill`；embed HTTP 200 可達 | headless 自動播放不穩，測試不具決定性 |
| G4 | 61 例逐筆資料不可得 | 基線僅有聚合值；個案層級資料在 Google Sheet，repo 無權限 | 只能驗證步驟層級 |
| G5 | `fansee/the-mirror` 455 個未提交檔案 | `git status --porcelain \| wc -l` = 455 | 全機 Playwright 收斂被阻擋 |
| G6 | `zhelang/runwayos` 的 `bun.lock:54` 殘留 `playwright` 宣告，manifest 無此依賴 | `grep -c playwright package.json` = 0；`bun.lock:54` 有 | 該 repo 已無 playwright 使用，1243 為幽靈 pin，已隨快取 GC 消失 |

## H. 尚未執行

| # | 項目 | 原因 |
|---|---|---|
| H1 | 藥師端（收案表單、追蹤清單）尚未實作 | 管理端已完成；藥師端仍待建 |
| H2 | AI 病人端接上新版 API | `src/core/data-logger.js` 仍打舊 Apps Script |
| H3 | 部署到 Vercel + Neon | 需 `DATABASE_URL`，屬付費／外部資源，未取得授權前不執行 |