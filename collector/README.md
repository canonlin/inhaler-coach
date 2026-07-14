# collector/ — 建置產物，請勿手動編輯

這個資料夾是自動產生的（`VITE_BASE=/inhaler-coach/collector/ bun run build`），
原始碼在 `feature/multimodal-v2` 分支的 `src/collect/`。

發布網址：https://canonlin.github.io/inhaler-coach/collector/collect.html

**根目錄的 index.html（現行 v1 系統）完全不受影響。**

## 唯一需要手動改的檔案：config.json

```json
{ "driveFolderUrl": "把共用資料夾的連結貼在這裡" }
```

在 Drive 建一個資料夾 → 右鍵「共用」→「知道連結的任何人」→ 權限改成「編輯者」→
複製連結 → 貼進 `collector/config.json`（可以直接在 GitHub 網頁上編輯）。

**不用重新 build。** 這個檔案是在網頁執行時才讀取的。
如果沒設定，藥師錄完會看到「尚未設定共用資料夾」的提示，而不是一個壞掉的按鈕。
