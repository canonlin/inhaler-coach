# 後台登入與權限 · 維運手冊

後台（`/admin`）讀寫病歷號碼、匯出 QCC 試算表、決定醫院教什麼。在這份手冊寫下來
之前，`/api/*` 底下幾乎每一條路徑都對公開網路上的任何人敞開——包含
`GET /api/export/cases.xlsx`。

這份手冊說明現在的樣子：誰能進去、怎麼開帳號、出事怎麼處理。

---

## 1. 兩種使用者

| 對象 | 怎麼進來 | 能做什麼 |
| --- | --- | --- |
| 病患端 | 不需要帳號 | 只用 `POST /api/sessions`、`POST /api/line/link`、`POST /api/line/journeys`、`/api/line/webhook` |
| 藥師端 | 帳號 + 密碼 | 後台全部畫面、讀寫案例、關閉追蹤、匯出試算表 |
| 管理員 | 帳號 + 密碼 | 藥師端全部 **＋** 改衛教內容（影片、題目、藥品卡） |

病患端「不需安裝、不需登入」是這個專案對病患唯一的承諾。**不要**為了方便把
`POST /api/sessions` 加進需要登入的清單——那會直接打斷目前在跑的病人端。

公開清單只有一處，在 `api/auth.mjs` 的 `PUBLIC_ENDPOINTS`。任何不在清單上的路由
預設都需要 session。新增路由時若要公開，必須明寫那個清單，並在
`test/admin-auth.test.js` 更新預期清單（測試會擋下沒被記錄的變更）。

---

## 2. 開帳號

帳號不能從網頁上自我註冊，只能從有資料庫權限的機器開：

```bash
cd /Users/gloomcheng/Workspace/weemed-ai/inhaler-coach
set -a && . ./.env.local && set +a

# 密碼從 stdin 進來，不會留在 shell history 或 process list
printf '%s' "$PASSWORD" | node scripts/admin-user.mjs \
  --email pharmacist@yunlin.org.tw \
  --name "王小明" \
  --role pharmacist
```

密碼規則：**至少 12 個字元**。密碼用 scrypt（N=16384, r=8, p=1）加 per-user salt
雜湊後存進 `admin_users.password_hash`，格式 `scrypt$N$r$p$salt$hash`。原始密碼
從不落盤、從不進 Git。

角色：

- `admin` — 可改 `admin_config`（衛教影片、題目、藥品卡）
- `pharmacist` — 可收案、關追蹤、匯出試算表
- `viewer` — 唯讀，看得到成效數字但動不了資料

### 列出帳號

```bash
node scripts/admin-user.mjs --list
```

### 重設密碼

同一支指令重跑即可（`ON CONFLICT` 會覆寫 hash 並解除鎖定）。

### 清除過期 session

```bash
node scripts/admin-user.mjs --purge-expired-sessions
```

---

## 3. Session 是什麼

- 登入成功後，server 產生 32 bytes 隨機 token，以 `HttpOnly; SameSite=Lax; Secure`
  的 cookie 送到瀏覽器（cookie 名稱 `inhaler_admin`）。
- 資料庫只存 token 的 SHA-256（`admin_sessions.token_hash`），所以資料庫被傾印
  也無法直接重播成登入。
- 有效期 **12 小時**，絕對時間、不自動延長——一個工作日就是一個工作日，平板機
  不會把 session 留在現場。
- 密碼連錯 5 次鎖 15 分鐘（`admin_users.locked_until`）；同一來源 15 分鐘內嘗試
  超過 20 次也會被擋（best-effort，serverless 實例之間不共享計數）。

---

## 4. 額外的防護

| 防護 | 位置 | 作用 |
| --- | --- | --- |
| 安全標頭 | `api/index.mjs`、`vercel.json` | `nosniff`、`X-Frame-Options: DENY`、`Referrer-Policy`、HSTS、`Permissions-Policy`（相機與麥克風只限同源） |
| CSP | `vercel.json`（僅 `/admin`） | 擋掉外來 script 與 framing |
| CORS 收斂 | `api/index.mjs` | 原本是 `Access-Control-Allow-Origin: *`，任何網站都能讀本 API 的回應；現在只回應自己的 origin |
| 跨站寫入拒絕 | `api/index.mjs` | 有 session 的 POST 若 `Sec-Fetch-Site` 或 `Origin` 指向別站，直接 403 |
| LINE webhook 驗簽 | `api/index.mjs` | LINE 自己的路徑用 HMAC 證明身分，未簽署一律 401 |
| 推播密鑰 | `api/index.mjs` | `/api/line/dispatch` 只認 `CRON_SECRET`，不認瀏覽器 session |

---

## 5. 出事怎麼處理

**有人可能拿到密碼**

1. `node scripts/admin-user.mjs --list` 看有哪些帳號。
2. 對可疑帳號重設密碼（同一支指令重跑）。
3. `node scripts/admin-user.mjs --purge-expired-sessions` 讓所有 session 失效。
4. 如果是 `admin` 帳號，順便檢查 `admin_config.updated_by` 的變更紀錄。

**忘記密碼**

管理員用 `scripts/admin-user.mjs` 直接重設，不要做「忘記密碼」流程——那是給外部
使用者用的，這裡的帳號都是同事。

**懷疑 session 被盜**

把該帳號的 session 清掉：

```sql
DELETE FROM admin_sessions WHERE admin_user_id = '<id>';
```

---

## 6. 驗收怎麼做

```bash
# 未登入 → 401
curl -s -o /dev/null -w '%{http_code}\n' https://inhaler-coach-pink.vercel.app/api/cases

# 登入 → 200，並拿到 HttpOnly cookie
curl -s -c /tmp/cookies.txt -X POST \
  -H 'Content-Type: application/json' \
  -d '{"email":"...","password":"..."}' \
  https://inhaler-coach-pink.vercel.app/api/auth/login

# 帶 cookie 讀資料 → 200
curl -s -b /tmp/cookies.txt https://inhaler-coach-pink.vercel.app/api/cases | head -c 200
```

注意：`/tmp/cookies.txt` 是憑證檔案，不要提交到 Git，也不要貼進聊天紀錄。

---

## 7. 還沒做的事

- 沒有二次驗證（OTP / 硬體金鑰）。院內帳號數量少，目前以「帳號 + 密碼 + 鎖定」
  為準；若擴大到多院區或多人共用帳號，需要補上。
- 沒有登入稽核表（誰在何時看過哪筆病歷）。`admin_sessions` 記得登入者與時段，
  但沒有逐筆讀取紀錄。
- `ALLOWED_ORIGINS` 預設空。病患端、後台、LINE webhook 都是同源或 server-to-server，
  不需要跨源。若未來有第三個站台要呼叫 API，必須在 Vercel 環境變數明確列出。
