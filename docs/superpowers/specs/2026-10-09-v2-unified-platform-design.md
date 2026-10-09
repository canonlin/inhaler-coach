# v2 統一平台設計規格

日期：2026-10-09　分支：`feature/multimodal-v2`　狀態：待實作

## 摘要

三套既有系統（AI 病人端、v1 收案平台、v2 雛型）是同一份資料的三個投影，
但沒有共同的 spine：資料識別欄位不同、schema 不同、寫入路徑不同、彼此無關聯。
本規格把它們收成**一份 spine、一個前端、一個 API**。後端自持，資料不再進 Google
Apps Script。

## 1. 現況（2026-10-09 實測）

| 系統 | 識別欄 | 寫入 | 步驟定義 | 後端 |
|---|---|---|---|---|
| inhaler-coach 病人端 | `pid`+`ts` | GAS GET `ai_coach_record`，`s{1..4}a/s1c/s1p` | 5 關（僅 MDI） | Apps Script A |
| qcc-inhaler-platform v1 | 99+8 欄長表 | GAS POST `{sheetType,values}` | 33 步 | Apps Script B |
| 智慧呼吸照護平台.html | `病歷號碼`+`紀錄ID` | GAS POST `{key,row}` | 33 步 | Apps Script C（每台電腦各貼一組 URL+TEAM_KEY） |

三份 step 定義（`MDI_搖`、`RSP_壓吸`…）逐字相同。這是唯一既存的收攝點。

**基線資料可得性**：zip 內 `BASE` 常數是 61 例（2026-04-21～2026-05-27）的
**聚合結果**（`n=61, opw=40, crit=38`、逐步 a/w 計數、知識題答對率、藥師原始
錯誤註解），不是 61 筆逐列資料。逐列資料在 Google Sheet，本專案無存取權。
→ 基線只能作為**聚合 fixture** 進 repo，用於驗證儀表板算式；不可宣稱為逐筆還原。

## 2. 架構決定

**後端**：Neon Postgres（選項 1）。理由：Vercel Postgres 已退役至 Vercel Storage
marketplace，底層即 Neon；直接選 Neon 為單一供應商、單一 driver。Vercel 既有部署
目標不變，`pg` 在 Vercel Node runtime 與本機 Docker Postgres 上行為一致。

**資料模型**：正規化為 8 張表，取代 107 欄長表。

| 表 | 取代 |
|---|---|
| `patients` | 病歷號碼（只存 SHA-256 + 末 2 碼顯示） |
| `cases` | 收案子欄 23 個 |
| `case_steps` | 步驟_×33 + 備註_×33 → 66 欄 |
| `case_knowledge` | 知識Q×10 |
| `clinical_measurements` | PIF／CAT／ACT／順從性／混用警示 |
| `med_reconciliation` | 出院前用藥整合 |
| `physician_queries` | 需醫師回應／回覆率／採納率 |
| `sessions` + `session_stages` | `ai_coach_record` 的 s*a/s*c/s*p |

`followups` 為第 9 張，支撐追蹤清單的 P1/P2/P3 燈號與期限。

**前端**：沿用 repo 既有 React 19 + Vite 8 + Tailwind 4。角色路由：
`/` AI 病人端（`src/screens/`，不動）／`pharmacist` 藥師端／`admin` 管理端。

**spine 位置**：`src/domain/`。`steps.ts` 是 33 步的唯一權威定義，
`critical` flag 與 QCC 附件七一致。藥師端與管理端都 import 它，不各存一份。

## 3. 不動的部分

- `src/detection/`、`workers/`、`training/`：AI 偵測與訓練管線，本次不改。
- 已部署的 `inhaler-coach.vercel.app` 與 GitHub Pages collector：不動。
- v1 `qcc-inhaler-platform` repo：不動，僅作為行為參考。

## 4. PHI

`病歷號碼` 不進 Git。`patients.mrn_hash` = SHA-256(病歷號碼 + salt)，
`mrn_tail` = 末 2 碼供畫面顯示。salt 與 `DATABASE_URL` 同為 server-side 環境變數。
API 一律不回傳 `mrn_hash`。

## 5. 驗收

1. `npm run typecheck` 通過
2. `npm test` 通過，且新增 spine 測試（33 步 × 4 裝置、critical flag 總數）
3. 33 步定義在 repo 內只存在一份（以 grep 驗證）
4. 管理端用基線 fixture 重現逐步數字（457 評估／93 錯誤、每個 step 的 a/w、
   最差步驟排序）。**步驟層級可驗證；個案層級的 40／38 不可驗證**，因為 a/w
   只固定「每個步驟錯幾次」，不固定「錯在哪些個案」，多種排法都符合同一組
   逐步數字。40／38 保留為已公布值，不由程式重算。
5. `/api/health` 回 200 且回報 DB 連線
6. `checks.md` 每一列都有證據

## 6. 上限

- 時間：本輪至驗收全過或撞到下列任一條
- 次數：同一失敗方法 2 次無新理由即停
- 預算：不新增付費資源；Neon 免費層，未設定 `DATABASE_URL` 前不部署