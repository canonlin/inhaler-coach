# 論文 Methods 修改建議

> 狀態：提案，尚未定案。針對 `research_paper_draft.md` 的 §3.2.3 / §3.2.4 / §2.5 / §3.1。
> 日期：2026-07-15

---

## 摘要

現行草稿把 **perinasal ROI 光流偵測呼吸事件** 列為 "primary technical novelty"（§3.2.3）。文獻檢視顯示這個模組的**物理基礎與使用情境都站不住**。本文件提出三項修改：

1. **降級** perinasal 光流：從「主要偵測器」改為「受評估的候選模態之一」。
2. **新增音訊模態**作為呼吸事件的主要偵測訊號。
3. **引入熱像儀作為 ground truth 儀器**（僅實驗室驗證用，不進入部署系統）。

修改後 research gap 主張仍然成立，且驗證強度顯著提升。

---

## 1. 為什麼 perinasal 光流的物理基礎有問題

### 1.1 Perinasal 是熱像技術的 ROI，不是 RGB 的

鼻周之所以是呼吸偵測的經典 ROI，是因為**吐出的氣接近體溫、吸入的氣是室溫**，鼻孔周圍產生可量測的溫度振盪。這是 thermal imaging 的成熟做法（LWIR 相機的呼吸速率 MAE 可低至 0.6 breaths/min）。

**RGB 相機看不到溫度。** 現行草稿假設吐氣造成「perinasal 皮膚/毛髮的氣流偏移」而被光流捕捉——這是一個遠比溫度訊號微弱的二階效應，文獻並未支持它在消費級 webcam 上可靠可測。

### 1.2 臉部光流是所有 ROI 中對動作最敏感的

文獻比較（見 §Sources）：

| ROI | 呼吸訊號可靠度 |
|---|---|
| 胸腔 | 高（RMSE 0.63） |
| 臉部特徵點 | 僅在**頭部幾乎不動**時可靠；對頭/身體移動造成的雜訊極度脆弱 |

而 pMDI 使用情境正是 motion artifact 的極大值：使用者**把手舉到臉前、把吸嘴放入口中、頭部後仰**。我們選了最脆弱的 ROI，去測最會動的時刻。

### 1.3 為什麼也不改用胸腔 ROI

胸腔光流雖然訊號最好，但**取景不可控**。使用者與 webcam 的距離、鏡頭俯仰角、坐姿都無法要求，胸腔隨時可能不在畫面內。臉部至少必然在畫面中（否則整個系統都無法運作）。

因此胸腔 ROI 不是可行的替代方案。

---

## 2. 提案：音訊作為呼吸事件的主要模態

### 2.1 理由

- **物理基礎直接**：吐氣與吸氣本質上就是**聲音事件**，不是需要間接推導的二階視覺效應。
- **對取景免疫**：麥克風不依賴使用者是否入鏡、距離、角度。這正好補上視覺模態最大的弱點。
- **已有文獻先例**：以吸入器音訊分類 actuation / inhalation / exhalation 已達 **88.2% 準確率**（Sci Rep 2018）。
- **零額外硬體**：webcam 本來就有麥克風，`getUserMedia({audio: true})` 即可取得，不破壞「純瀏覽器、零安裝」的部署前提。

### 2.2 需要新增的 Module

**Module C′：音訊呼吸事件偵測（取代原 Module C 的主要地位）**

- 訊號取得：`getUserMedia({audio:true})` → `AudioContext` → `AnalyserNode`
- 特徵：短時能量（RMS）、頻譜質心、過零率、梅爾頻譜（可選）
- 吐氣事件：氣流噪音為**寬頻無調性**訊號，與語音（有基頻）、環境噪音（穩態）可區分
- 事件層級偵測：3 秒滾動基線，能量超過 baseline + 2σ 且持續 > 0.5s 判為吐氣事件
- **Gating**：以 Face Mesh 的 MAR 與 hand-face distance 做交叉驗證（沿用現行草稿的 gating 設計）
- 隱私：音訊僅在瀏覽器端做特徵抽取，不上傳、不儲存原始波形——與現行的 privacy-preserving 主張一致

### 2.3 Perinasal 光流的新定位

**不刪除，改為受評估的對照模態。** 這反而讓論文更強：

> 我們以熱像儀為 ground truth，直接比較「臉部 perinasal 光流」與「音訊」在 pMDI 使用情境下偵測吐氣事件的效能。

無論結果偏向哪一方，都是可發表的實證結果。若光流確實不可靠，這本身就是對「RGB 臉部光流可用於呼吸偵測」這個假設的一次負面驗證，對社群有價值。

---

## 3. 提案：熱像儀作為 ground truth（僅實驗室）

### 3.1 動機

現行草稿以**藥師目視判斷**為 gold standard。但藥師對「有沒有吐氣、何時開始吐、吐了多久」的判斷本身就不可靠——吐氣在視覺上幾乎沒有特徵。這是現行驗證設計的弱點。

### 3.2 做法

- 器材：消費級 LWIR 熱像儀（如 Topdon TC001，256×192，約 USD 200–250）
- 用途：資料收集時**同步錄製熱像**，從鼻周溫度振盪取得每次吐氣的精確起訖時間
- 角色：**reference standard / ground truth 標註工具**

### 3.3 關鍵界線

> **熱像儀不進入部署系統。**

部署系統仍為「消費級 webcam + 瀏覽器」，維持 §1.2 對 sensor-based smart inhaler「需要專用硬體、無法規模化」的批評立場不自相矛盾。熱像儀只出現在 Methods 的驗證段落，等同於研究中常見的 reference instrument（如以 spirometer 驗證非接觸式呼吸偵測）。

### 3.4 附帶好處：熱像不能做姿態

必須說明，熱像儀**無法取代** RGB：MediaPipe 在熱像資料上效能下降達 100%，且熱像的空間解析度不可能提供 468 點 face mesh 或 21 點 hand landmark。這強化了「RGB 為主、熱像僅為驗證」的架構合理性。

---

## 4. 修改後的系統架構（§3.1 需重繪）

```
┌──────────────────────────────────────────────────────────┐
│   Webcam (video + audio)     │  [Lab only] LWIR Thermal  │
└───────┬──────────────┬───────┘         │ ground truth    │
        │              │                 └─────────────────┘
   ┌────▼────┐   ┌─────▼──────┐   ┌──────────────┐
   │ Pose 33 │   │ Face Mesh  │   │  Audio       │  ← 新增
   │         │   │ 468 / Hand │   │  Analyser    │
   └────┬────┘   └─────┬──────┘   └──────┬───────┘
        │              │                  │
   ┌────▼────┐   ┌─────▼──────┐   ┌──────▼───────┐
   │ 骨架動力學│   │ 口部幾何    │   │ 呼吸事件      │  ← 主要呼吸訊號
   │ 振搖/漱口 │   │ MAR/唇密封  │   │ (寬頻氣流噪音) │
   └────┬────┘   └─────┬──────┘   └──────┬───────┘
        │              │                  │
        │        ┌─────▼──────┐           │
        │        │ ROI 光流    │  ← 降級為對照組
        │        │ + rPPG      │     (confidence modifier)
        │        └─────┬──────┘           │
        │              │                  │
   ┌────▼──────────────▼──────────────────▼────┐
   │          Multi-Modal Signal Fusion         │
   └────────────────────┬───────────────────────┘
                        │
              Step 1 / 2 / 3 / 4 決策
```

---

## 5. Research gap 主張是否受影響（§2.5）

**不受影響，且更強。** 修改後的 gap 敘述：

> 現有研究中，音訊式吸入器評估（Sci Rep 2018）僅處理聲音事件、不涉及動作正確性；視覺式方法僅處理動作、無法偵測呼吸事件。**尚無研究將骨架動力學、臉部幾何與音訊呼吸事件整合為單一瀏覽器端多模態框架，並以熱像儀為 ground truth 驗證其呼吸事件偵測效能。**

原本的 gap（「無人整合 pose + face + 光流/rPPG」）其實是一個**未經驗證的技術組合**；新的 gap 則是一個**已驗證的技術組合 + 一次對既有假設的實證檢驗**。

---

## 6. 對實作的連帶影響

- 音訊模態**不需要 GPU**，不受本專案目前 WebGL 不可用的問題影響。
- 若 perinasal 光流降級為對照組，OpenCV.js（~8MB WASM）不再是關鍵路徑，可延後載入或僅在對照實驗中啟用。
- Face Mesh 468 點仍然需要（MAR、唇密封、rPPG 前額 ROI、以及光流對照組的 ROI 定義）。

詳見 `docs/implementation-plan-v3.md`。

---

## Sources

- Thermal Imaging for Contactless Cardiorespiratory Monitoring — https://arxiv.org/html/2602.12361
- Breathing-Associated Facial Region Segmentation for Thermal Camera-Based Breathing Monitoring — https://pmc.ncbi.nlm.nih.gov/articles/PMC10561734/
- Collaborative use of RGB and thermal imaging for remote breathing rate measurement — https://www.sciencedirect.com/science/article/abs/pii/S1350449520305521
- Seconds Matter: Rapid Non-Contact Monitoring of Heart and Respiratory Rate from Face Videos — https://pmc.ncbi.nlm.nih.gov/articles/PMC12987125/
- A hybrid CNN-spectral architecture for non-contact respiratory rate estimation using multi-region optical-flow analysis — https://pmc.ncbi.nlm.nih.gov/articles/PMC12923011/
- Estimation of Respiratory Signals from rPPG of RGB Facial Videos — https://doi.org/10.3390/electronics14112152
- Objective Assessment of Patient Inhaler User Technique Using an Audio-Based Classification Approach (Sci Rep 2018, 88.2%) — https://www.nature.com/articles/s41598-018-20523-w
- Efficient Thermal Pose Estimation (MediaPipe on thermal: 效能下降達 100%) — https://pmc.ncbi.nlm.nih.gov/articles/PMC13030541/
- LWIRPOSE: LWIR Thermal Image Dataset and Benchmark — https://arxiv.org/html/2404.10212v1
- Topdon TC001 規格與定價 — https://www.topdon.us/products/tc001
