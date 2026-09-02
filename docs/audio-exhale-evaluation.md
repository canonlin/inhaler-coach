# 吐氣音訊資料鏈查核與模型門檻

日期：2026-09-03

## 結論

藥師確實提供了含錄音的收集資料；問題不是「沒有錄音」，而是音訊資料沒有進入現行訓練與 runtime。

- `training/dataset-0519.json` 由影像幀建立。
- `training/train.py` 的 exhale 特徵只有 `canisterY`、`canisterPresent`、`canisterArea`。
- 收集器另外以約 100 Hz 記錄 `breathBand`、`flatness`、`rms`、`highBand`，並在 WebM 保留 48 kHz Opus 原始音訊。
- runtime 的 `AudioFeatures` 目前只餵給按壓事件，沒有吐氣音訊分類器。

因此先前第二關實際上是吸入器位置分類，不是錄音吐氣模型。

## 本機可取得資料

找到兩組成對 session，每組都包含 JSON 與 WebM：

| Session | 吐氣音訊樣本 | 說話樣本 | 靜止樣本 | 原始音訊 |
|---|---:|---:|---:|---|
| `69001881` | 1,202 | 1,004 | 801 | 48 kHz mono Opus |
| `9bfc39b6` | 1,206 | 999 | 802 | 48 kHz mono Opus |

每筆音訊特徵約相隔 10 ms；每個 session 的吐氣原始區段約 12 秒。原始資料留在受控本機文件目錄，不加入 Git。

## 手工特徵觀察

`breathBand` 絕對值有明顯跨人／跨環境漂移：

- Session `69001881`：吐氣中位數 `8.008e-9`，說話 `6.606e-9`，靜止 `4.382e-9`。
- Session `9bfc39b6`：吐氣中位數 `4.727e-9`，說話 `4.715e-9`，靜止 `7.256e-9`。

單一能量門檻無法跨人使用；第二位的吐氣與說話幾乎相同，靜止反而更高。

## 原始音訊跨人初步評估

`training/evaluate_audio.py` 直接依 JSON 標籤切割 WebM 原始音訊：

- 16 kHz mono
- 1 秒視窗、250 ms stride
- 24-band log-mel 的 mean／std／P10／P50／P90，加上 RMS、過零率與 crest factor
- 正樣本：`exhale`
- 負樣本：`speak`、`still`、`handle`、`move`
- Logistic regression
- Leave-one-session-out；同一人的重疊音窗絕不跨 train／test

兩折結果：

| Held-out session | Accuracy | Sensitivity | Specificity | AUC |
|---|---:|---:|---:|---:|
| `69001881` | 0.563 | 0.814 | 0.486 | 0.614 |
| `9bfc39b6` | 0.638 | 0.178 | 0.786 | 0.558 |

兩份本機 session 不足以產生可部署模型。尤其兩折 sensitivity 差距極大，表示模型主要學到人／房間／麥克風差異，而不是穩定吐氣特徵。

## 1150806 五位藥師 A100 重訓結果

2026-09-03 已找回 `1150806` 的五組 JSON／WebM，並在 Tailscale A100 上完成正式
leave-one-session-out 訓練。原始 WebM 音軌以 FFmpeg 解碼為 16 kHz mono lossless
FLAC；五份音軌長度與 JSON 最後 timestamp 的差距均不超過 0.05 秒。原始 ZIP、衍生
音軌、Python 環境、window cache、checkpoint 與 run 全部留在 `/mnt`。

固定條件：

- 模型：40-band log-mel＋22,297 參數 depthwise-separable CNN。
- 資料：5 位藥師、3,160 個一秒視窗，其中吐氣 270、負樣本 2,890。
- 切分：5-fold leave-one-session-out，3 個固定 seeds，共 15 個 held-out folds。
- 訓練：每折 100 epochs、batch 128、固定 threshold 0.5。
- 預先門檻：每一折的 sensitivity、specificity、AUC 必須分別至少為
  0.80、0.80、0.85。

結果：15 折中 0 折通過，模型狀態為 `rejected-by-loso-gate`。

| 指標 | 15 折平均 | 最差 | 最好 |
|---|---:|---:|---:|
| Sensitivity | 0.078 | 0.000 | 0.278 |
| Specificity | 0.948 | 0.917 | 0.996 |
| AUC | 0.475 | 0.233 | 0.684 |
| Balanced accuracy | 0.513 | 0.468 | 0.600 |

表面的 accuracy 為 0.873，但這是負樣本占多數造成的假象。模型幾乎總是回答「不是
吐氣」，因此 specificity 很高、sensitivity 卻接近零；不能以 accuracy 宣稱成功。
三個 seeds 都重現相同方向，排除單一初始化失敗。

A100 run 正常結束，`exit_code=0`；455 個 GPU samples 中 451 個為非零負載，最高
utilization 12%、最高 719 MiB VRAM、最高 36°C。這表示拒絕原因是跨人訊號不足，
不是 OOM、環境或訓練程序中斷。

完整 evaluation 在
`training/a100-results/formal-c04fa2f/evaluation.json`。模型 checkpoint 僅保留於
`/mnt/shared/inhaler-coach/runs/formal-c04fa2f/`，SHA-256 為
`5ce8d5c0606309ad5c9cc8d476606e656174cee497814f8e1ab431fd9cff054b`；它是被驗收拒絕的
研究產物，不得接入 browser runtime。

此結果關閉「只要把同一批 webcam 音訊換成更強分類器即可」的路線。下一個合理實驗
應改變可觀測訊號：以軀幹／胸口 motion 為主，音訊只作輔助，並維持 guided-exhale
fallback；不能再以相同資料反覆換模型追逐單一分數。

## 後續模型研究門檻

1. 不晉升本次 DS-CNN；保留 evaluation 與 checkpoint 作為 rejected evidence。
2. 下一輪只改一個主變因：以軀幹／胸口 motion 為主要訊號，再比較是否加入音訊；
   session split、window、seeds 與驗收門檻維持不變。
3. 若根據這五折選擇新架構，必須另收新的參與者作 locked external test；不能再把同五人
   稱為未見測試集。
4. 新資料應跨麥克風、房間與噪音條件，負樣本保留說話、靜止、操作、移動與噴藥。
5. 至少同時報告 sensitivity、specificity、AUC、balanced accuracy、逐人結果與失敗情境。
6. 只有跨人 gate 通過後，才能進行 browser runtime、延遲、風扇與目標硬體 benchmark。
7. 無麥克風、低信心或 gate 未通過時，維持「吐氣引導」，不得宣稱 AI 已驗證氣流。
8. production promotion 仍需要 model provenance、artifact digest、產品負責人核准與獨立
   使用者驗收。

## 重跑方式

```bash
python3 training/evaluate_audio.py \
  --pair SESSION_A.json SESSION_A.webm \
  --pair SESSION_B.json SESSION_B.webm \
  --pair SESSION_C.json SESSION_C.webm
```

腳本只需要 NumPy 與 FFmpeg，預設不寫出模型，也不傳輸錄音。
