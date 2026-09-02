# Implementation Plan v3

> 取代 antigravity brain 內的 `implementation_plan.md`（v2）。
> 日期：2026-07-15。分支：`feature/multimodal-v2`。
> 配套文件：`docs/paper-methods-revision.md`

---

## 這份計畫和 v2 差在哪

v2 假設 **MediaPipe Holistic 跑得起來**，且 **perinasal 光流是核心亮點**。兩個假設今天都被推翻：

| v2 的假設 | 實際狀況 |
| --- | --- |
| MediaPipe (WebGL) 可用 | 開發機 Chrome 的 `webgl` / `webgl2` **皆為 false**，MediaPipe 完全無法初始化 |
| TF.js 是無痛 fallback | TF.js WASM 推論**同步阻塞主執行緒**，全速跑會把整個分頁鎖死 |
| perinasal 光流是主要呼吸偵測器 | 物理基礎與使用情境皆不成立（見 methods-revision） |
| 藥師目視為 gold standard | 藥師無法可靠判斷「何時吐氣」，缺乏真正的 ground truth |

---

## Phase 0（已完成）— 底層修復

- [x] **偵測搬進 Web Worker**（`workers/detection.worker.js` + `src/detection/backends/tfjs-worker-backend.js`）
      WASM 推論同步阻塞主執行緒，這是頁面卡死的**根因**，節流只是治標。
      實測：主執行緒延遲中位數 0ms、最大停頓 61ms（先前為完全鎖死）。
- [x] **丟幀而非排隊**：worker 忙碌時直接跳過該幀，回傳上一次結果。排隊會無限增長。
- [x] **只跑該關需要的模型**：第一關僅需 pose，先前每幀白跑 FaceMesh 468 點 + Hands。
- [x] **保留 landmark 的 `score`**：`normalize.js` 原本把可信度丟棄，導致手不在畫面時仍以雜訊座標判定。
- [x] **`?stage=N` 直接跳關**、`?reset=1` 清除、`?measure=1` 純量測模式（不判定、不通過、不關相機）。
- [x] **修正 `ShakeDetector` 單位錯誤**：`minAmplitude = 10` 但手腕 y 是正規化 [0,1]，門檻永遠達不到，第一關**本來永遠不可能通過**。

### 已知技術債

- `vite.config.js` 將 `@mediapipe/face_mesh` / `hands` / `pose` alias 成空模組。
  原因：`@tensorflow-models/*` 在 module scope **無條件 import** 這些舊版 solution 套件，而它們會存取 `document`，在 Web Worker 中直接拋錯。我們只用 `runtime: 'tfjs'`，這些是死碼。
  **注意：這與我們的 MediaPipe backend 無關**，後者用的是 `@mediapipe/tasks-vision`（不同套件，未被 alias）。
- `ShakeDetector` 的 zero-crossing 迴圈從 `i=1` 開始卻讀 `ys[i-2]`，首輪比較 `undefined`。待修。

---

## Phase 1（已完成）— Backend 決策：TF.js worker 即是 MediaPipe 的完整平替

**不啟用 WebGL。** 開發機一旦開啟硬體加速會導致整台當機，因此視 WebGL 為不可用。

關鍵認知：`@tensorflow-models/*` 提供的**就是同一批 MediaPipe 模型的 TF.js 移植**，不是近似替代品。

| 論文所需 | MediaPipe (tasks-vision) | TF.js worker backend（現行） |
|---|---|---|
| Pose 33 | PoseLandmarker | **BlazePose** 33 |
| Face Mesh 468 | FaceLandmarker | **MediaPipeFaceMesh** 468 |
| Hands 21 | HandLandmarker | **MediaPipeHands** 21 |

同架構、同 landmark 索引、同輸出語義，差別僅在執行後端（WebGL vs. WASM）。
**論文 Methods 無需修改。**

### 實測（2026-07-15，開發機，WebGL 不可用）

| 項目 | 結果 |
|---|---|
| 模型初始化 | 5.4 s（一次性） |
| 單幀推論（pose + face + hands **全開**） | 熱身後 **53–61 ms ≈ 17 fps** |
| Pose / Face | 33 點 / 468 點 ✅ |
| 主執行緒延遲 | 中位數 **0 ms**、最大 61 ms |

**達成 v2 計畫 Phase 4.4 的 ≥15fps 目標**，且主執行緒零負擔。單關只需 pose 時會更快。

> **不做**：不自行以 `tfjs-converter` 手寫 BlazePose / FaceMesh / Hands 的 decode pipeline。
> 評估後放棄——為了消除數行 alias 而重寫數百行 anchor / NMS / ROI 仿射的數值程式碼；且 MoveNet 這類 17 點模型無法提供論文所需的 face mesh 與 hand landmark。
>
> **不做**：不引入 ONNX Runtime Web / WebNN。現行方案已達效能目標，無誘因增加第三套推論堆疊。

### MediaPipe backend 的去留

`src/detection/backends/mediapipe-backend.js` 保留，`DetectionManager` 仍優先嘗試它。
在有 WebGL 的受試者機器上它會被選用（更快）；在沒有的機器上自動退到 TF.js worker。
兩條路徑輸出格式相同，對上層完全透明。

---

## 醫學標準對齊（2026-07-15；2026-09-02 校訂）

### 依據的優先順序

1. **產品仿單（吸必擴 / Symbicort）— 最優先**
   [DailyMed 官方處方資訊](https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=fafa4cf1-99c2-43d5-73ad-51f256de3be0)
   - **每次使用前**：充分搖勻 **5 秒**
   - **Priming**：首次使用前對空噴**兩次**，每次噴之前都要重新搖勻
   - **重新 priming**：超過 **7 天**未使用，或吸入器摔落過
   - **壓吸**：先完全吐氣，再以嘴深而慢地吸氣，同時將藥罐按到底
   - **憋氣**：約 **10 秒**，或以使用者感到舒適的時間為限
   - **漱口**：`rinse his/her mouth with water **without swallowing**`（不可吞下）

2. **通用 pMDI 教材（台灣胸腔暨重症加護醫學會）— 仿單未涵蓋時使用**
   產品仿單沒有說明的操作細節，才以通用 pMDI 教材補充。

> ⚠️ **更正（2026-07-15）**：先前依通用教材將振搖判準改為「計數 4-5 次」。
> **吸必擴仿單規定的是「搖 5 秒」——是秒數，不是次數。** 產品仿單優先。
> 現行實作以動作能量確認使用者**持續搖動至少 5 秒**；不再宣稱有計算來回次數。

> ⚠️ **校訂（2026-09-02）**：舊版文件寫成「仿單未規定憋氣秒數」，與
> DailyMed Instructions for Use 不符。現行產品指示為約 **10 秒**或以舒適為限，
> 因此 `holdSeconds` 已由 5 改為 10，畫面同時保留「不要勉強」的界線。

### 通用教材原文

依據：**台灣胸腔暨重症加護醫學會《肺阻塞的吸入性裝置衛教》**（COPD 醫療給付改善方案教育訓練核心教材），p.5「壓力定量吸入器操作步驟」。

> 1. 將吸入器上下搖動 **4-5 次**，使藥物充分混合。
> 5. 先向外**慢慢深呼**一口氣。
> 6. …按壓吸入器容器的底部，並同時緩慢地吸飽一口氣（**吸氣時間兒童約 3 秒，成人 4-5 秒**），**吸氣過程不可中斷**。
> 7. 吸氣完畢後…盡可能地閉氣，越久越好（**或閉氣 5-10 秒**）。
> 11. 如吸入藥物含類固醇則吸藥後須漱口。

### main branch 與標準的四處落差

| # | 落差 | 嚴重性 | 狀態 |
|---|---|---|---|
| 1 | **憋氣只倒數 3 秒**，且舊 UI 寫「憋氣 5 秒」 | 低於產品 Instructions for Use 的約 10 秒指示 | ✅ 已修（`holdSeconds: 10`，並標示以舒適為限） |
| 2 | **振搖判準與產品指示錯位**：舊分類器只要求信心值維持 3 秒；後續動作能量版又把速度當成必要條件，且在模糊時持續要求重辨識吸入器 | 未達產品要求的使用前上下搖勻 5 秒，也會排除藥師示範的正常速度 | ✅ 已改為兩階段：吸入器只需取得一次並鎖定本次練習；主要判準為三秒視窗內的上下位置範圍、總行程與完整反轉，動作能量／flow 僅作快速備援；有效動作累積 5 秒 |
| 3 | **吸氣時長未檢查**：舊程式只要求分類器信心維持 3 秒 | 未涵蓋深而慢地吸氣 | ⚠️ 現行以吸入器在嘴邊且穩定的可見姿勢維持 4 秒作為教學代理；攝影機不能直接證明氣流或藥物釋放 |
| 4 | **憋氣無法由一般 webcam 直接驗證** | 倒數完成不等於生理事件已被感測 | ⚠️ 現行提供 10 秒教學倒數；UI 稱為「倒數完成」，不宣稱 AI 驗證肺內憋氣 |

### 振搖改為「一次取得、持續混合」狀態機

現行判準直接對應產品仿單的 **5 秒持續時間**，但不把「搖得快」當成充分混合的必要條件。ONNX 先看見吸入器一次並鎖定本次嘗試；之後以手部或吸入器中心的三秒位置軌跡檢查垂直範圍、總行程、相對水平移動的垂直優勢，以及至少兩次有幅度的方向反轉。快速動作仍可由獨立約 30fps 的動作能量與兩軸 Lucas–Kanade flow 補足。追蹤暫時掉失只凍結進度，不會解除目標；重測才重新取得。這仍是可見動作代理，不能證明藥劑已在罐內達到化學均勻。

### 實測支持的 presence gate（2026-07-15）

| 狀況 | wristScore | 原始振幅 |
|---|---|---|
| 手在畫面內（真的在搖） | 0.81–0.90 | ~0.30 |
| 手在畫面外 | 0.22–0.54 | **0.85–1.10** |

**手不在畫面時的振幅比真正搖動時還大 3 倍。** 未經 score gate 的振幅特徵方向是反的——使用者靜止不動時反而更容易誤判通過（稍早實際發生：誤判通過 → `waitForPharmacist()` → `stopWebcam()` → 畫面凍結）。

因此振搖偵測改為：本地 ONNX 只負責本次嘗試的一次性吸入器取得；取得後停止反覆物件推論，主要由 Hands 中心軌跡判斷慢速上下往返。像素動作能量保留為快速備援，並以同一畫面的背景動作作為空間基線。

---

## Phase 2 — 訊號量測與門檻校準（**先量測，後訂門檻**）

> **原則：在看到真實訊號分佈之前，不寫任何過關條件。**
> 今天已經犯過一次這個錯：憑空猜的門檻讓系統在使用者靜止時就誤判通過，並隨即 `stopWebcam()`，反而讓資料收集不可能進行。

| # | 任務 |
|---|---|
| 2.1 | `?measure=1` 模式下錄製各關的原始訊號序列（已具備：`window.__signalLog`） |
| 2.2 | 錄製對照條件：**手不在畫面**、**手在畫面但靜止**、**確實振搖**，比較 `wristScore` 與振幅分佈 |
| 2.3 | 依實測分佈訂定 Step 1 的 `minAmplitude` / `minZeroCrossings` / 最低 `wristScore` |
| 2.4 | 同法處理 Step 4（漱口） |
| 2.5 | 訊號視覺化面板（開發 / demo 用） |

---

## Phase 3 — 音訊呼吸模態（**新增，取代原 Phase 2 的光流核心地位**）

| # | 任務 |
|---|---|
| 3.1 | `getUserMedia({audio:true})` + `AudioContext` / `AnalyserNode` 取得音訊 |
| 3.2 | 特徵：短時能量 (RMS)、頻譜質心、過零率 |
| 3.3 | 吐氣事件偵測：氣流為**寬頻無調性**噪音，與語音（有基頻）、穩態環境噪音可區分；3 秒滾動基線 + 2σ 峰值 + 持續時間門檻 |
| 3.4 | 以 Face Mesh 的 MAR + hand-face distance 做 gating（沿用原設計） |
| 3.5 | Step 2（吐氣）改以音訊為主要訊號 |
| 3.6 | 隱私：僅在瀏覽器端抽特徵，不上傳、不儲存原始波形 |

**優點**：不依賴取景（麥克風不管使用者坐多遠、鏡頭角度如何）、不需要 GPU、不受 WebGL 問題影響。

---

## Phase 4 — 熱像 ground truth（實驗室驗證用）

| # | 任務 |
|---|---|
| 4.1 | 採購消費級 LWIR 熱像儀（Topdon TC001，256×192，約 USD 200–250） |
| 4.2 | 資料收集時同步錄製熱像；以鼻周溫度振盪標註每次吐氣的起訖時間 |
| 4.3 | 以熱像為 ground truth，比較**臉部 perinasal 光流** vs **音訊** 偵測吐氣事件的效能 |

> **熱像儀不進入部署系統。** 部署仍為「消費級 webcam + 瀏覽器」，以維持論文對 sensor-based 方案「需專用硬體」批評的一致性。

---

## Phase 5 — 光流 / rPPG（降級為對照組）

原 v2 的 Phase 2 內容保留，但**改為對照實驗**而非主要偵測路徑：

- OpenCV.js 延後載入（僅在對照實驗啟用），不再是關鍵路徑
- perinasal / perioral ROI 光流 → 作為與音訊比較的候選模態
- rPPG → 維持 confidence modifier 角色

---

## Phase 6 — Step 3（壓吸）與整合

- Step 3 需要 **Hands 21 點**（按壓姿態 MLP）與 **Face Mesh**（唇密封）→ 依賴 Phase 1 的 backend 決策
- 憋氣倒數、藥師確認、Google Sheets 送出：沿用現有實作
- A/B 模式切換（Teachable Machine v1 vs. Multi-Modal v2）

---

## 目前仍未驗證的事

- ~~Worker backend 尚未實際跑通~~ → **已驗證**（2026-07-15）：pose 33 + face 468，17fps，主執行緒零阻塞
- **沒有任何一關的過關門檻是根據實測資料訂的**（`ShakeDetector.minAmplitude = 0.04` 是暫定值，未經校準）
- `ShakeDetector` 的 zero-crossing 迴圈索引 bug 未修（`i=1` 時讀 `ys[-1]`）
- 音訊模態完全未實作
- 熱像儀尚未採購
