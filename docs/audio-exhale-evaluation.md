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

## 正確的完整訓練流程

1. 找回所有藥師的成對 `.json + .webm`；不需要重錄既有資料。
2. 驗證 session 數、參與者數、裝置與任務標籤完整性。
3. 依人分組做 leave-one-person-out，不採隨機音窗切分。
4. 從原始波形建立 log-mel 時頻資料；負樣本必須包含說話、靜止、操作、移動與噴藥。
5. 比較校準後的線性模型與小型 TC-ResNet／DS-CNN；模型選擇以跨人結果為準。
6. 預先登記驗收門檻；至少同時報告 sensitivity、specificity、AUC、每人結果與失敗情境。
7. 音訊模型通過後，與可見姿勢融合：
   - 姿勢確認吸入器遠離嘴邊。
   - 音訊確認有持續吐氣聲。
   - 無麥克風或低信心時降級為「吐氣引導」，不得宣稱 AI 已驗證氣流。
8. 完成瀏覽器目標硬體 benchmark、模型 provenance、artifact digest 與產品負責人核准後，才可成為 production gate。

## 重跑方式

```bash
python3 training/evaluate_audio.py \
  --pair SESSION_A.json SESSION_A.webm \
  --pair SESSION_B.json SESSION_B.webm \
  --pair SESSION_C.json SESSION_C.webm
```

腳本只需要 NumPy 與 FFmpeg，預設不寫出模型，也不傳輸錄音。
