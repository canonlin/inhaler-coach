# inhaler-coach — project rules

Project facts live here. Shared method and governance come from the global
`AGENTS.md` (source: `~/.agents/AGENTS.md`, projected by `agent-sync`); this file
is the project's own entry point, not a second copy of those rules.

## Branch rule (hard)

**Work only on `feature/multimodal-v2`.** Do not switch to `main` and do not
create new branches. The remote branch `origin/feature/multimodal-v2` and
`gitlab/feature/multimodal-v2` both track this work.

Enforcement, not prose: `.github/workflows/ci.yml` runs only on `main` and
`feature/multimodal-v2`, and `.git/hooks/pre-push` runs `bun run typecheck` and
`bun run test`. Both must be extended rather than trusted if the branch set changes.

This is a **bun** project: `bun.lock` is the only lockfile and CI installs with
`bun install --frozen-lockfile`. Use `bun run` / `bunx`, not `npm` / `npx` — a
`package-lock.json` would diverge from CI.

`bun run test` requires `DATABASE_URL`. The API, metrics and LINE tests query a
real Postgres, and the gate exits non-zero without one rather than skipping. CI
provides a `postgres:16-alpine` service. Locally, point `DATABASE_URL` at the
project's Neon database — the backend decision is recorded in
`docs/superpowers/specs/2026-10-09-v2-unified-platform-design.md` §2. There is
no local Postgres and none should be started. The connection string lives in
`.env`, which is git-ignored; it is a credential, not a config value.

**The suite truncates tables.** Use a database you are willing to lose. The suite
runs with `--test-concurrency=1` because those files truncate shared tables.
`bun run seed:demo` truncates too, and what it writes is demo data, not study
data — read "Durable facts" below before quoting any number it produces.

## Commit rule

**Commit the work when it is finished.** A change that has passed
`bun run check:all` belongs in a commit on `feature/multimodal-v2`; a finished
task left in the working tree is a finished task that can be lost or drift.
Commit only what the task produced, never a credential and never PHI. Pushing
is still the user's call.

## Formatting

**Biome is the format, and the gate enforces it.** `bun run format` writes it
(`src/ api/ test/ scripts/ output/`); `bun run lint` checks the same set. Do
not hand-format a file and do not hand-edit whitespace: an edited-by-hand file
is a file that drifts, and the formatter is the only thing that keeps the
repository consistent. The bundled third-party assets under `collector/assets/`
are not ours to format.

## What this repository is

`inhaler-coach` is the v2 work: a browser-only asthma/COPD inhaler-technique
coaching platform for 臺大醫院雲林分院藥劑部, built as one plan with two layers —
a hospital QCC／深耕計畫 quality-improvement layer and a research layer.

- Patient end: camera + AI step coaching (`src/steps/`, `src/detection/`).
- Pharmacist end: standardized checklist, education, follow-up tracking.
- Management end: QCC metrics, baseline vs. post-intervention analytics.
- Data backend: consolidated behind one API (see the plan in `docs/`).

Package name is `inhaler-coach-v2`, version `2.0.0`. The production host is
`https://inhaler-coach-pink.vercel.app` (the Vercel project is
`gloomcheng-9021s-projects/inhaler-coach`); `inhaler-coach.vercel.app` is not
the live domain. `https://canonlin.github.io/inhaler-coach/collector/` hosts the
research data collector.

## Operating constraints that change results

- **Pure browser, zero install.** No backend dependency in the patient coaching
  loop. Do not add one that requires login or an app.
- **No PHI in Git.** Medical record numbers (`病歷號碼`) live only in the
  cloud sheet. Screens may mask them (the pharmacist app shows head/tail only).
  Raw study audio and video stay on the controlled local disk, not in Git
  (see `docs/audio-exhale-evaluation.md`).
- **WebGL is treated as unavailable** on the development machine; the WASM
  detection backend is canonical. Do not re-enable a WebGL path without
  measuring.
- **Detection runs in Web Workers.** The main thread must stay responsive; drop
  frames rather than queue them.
- **Source of truth for the step checklist** is the QCC 附件七 lookup table
  (`步驟_*` codes, `critical` flags) and the 胸腔暨重症加護醫學會《第一次使用
  吸入器就上手》2021 revision. Both the old qcc-inhaler-platform app and the
  pharmacist app must read one definition, never two copies.
- **The spreadsheet import is a bridge, not a store.** The QCC sheet is the
  pharmacist's working file; the database is the record. The importer reads the
  sheet, hashes the record number, and writes cases keyed `IMP-` so a re-run
  updates rather than duplicates. It reports what it read and what disagrees
  with the sheet; it does not "fix" the sheet.
- **The sheet's `errorRate` column is a correct-rate.** Thirteen rows read
  0.625 where the step detail gives an error rate of 0.375 (3 of 8). The import
  derives from the step detail and reports the mismatch; the sheet's derived
  columns are never the source.

## Durable facts

- Baseline study data: 61 cases, collected 2026-04-21 to 2026-05-27, with real
  error notes. It is the reference the QCC dashboard validates against.
- The 2026 QCC sheet has 987 rows, of which **62 carry content** (April 12 +
  May 49 = the 61 baseline cases, plus one from 2026-10-05). **38 have a record
  number** and can be imported; 24 rows (2–5, 8, 44–63) are blank in the
  number column and are skipped rather than invented.
- The AI detection ground-truth problem is open: `docs/paper-methods-revision.md`
  downgrades perinasal optical flow, promotes audio, and proposes thermal imaging
  as laboratory ground truth. Treat optical flow as an evaluated candidate, not
  the primary detector.
- The second stage detects the exhale with a **colour windmill**, not the
  chest: the camera cannot see chest movement reliably, and a paper tissue
  drifts in any draught. The 3-second threshold stays because elderly
  patients cannot exhale for 5 seconds.
- The QCC first-month LINE journey is **D3 / D7 / D14 / D24 / D28** — a caring
  check, the clinical points with the video, the two-week reminder, the quiz
  that becomes the measurement, and the return-visit reminder. Five pushes per
  case, and LINE gives 200 free messages a month, so the free allowance carries
  **about 40 cases a month**. That arithmetic is a hard stop, not a budget.
- **NFC is not used.** iOS will not open a third-party page or audio file from
  an NFC tag without an app download, and asking a patient to install an app
  defeats the purpose. QR code plus LINE is the delivery path.
- Cohorts: the research plan takes 100 Symbicort patients (50 AI, 50 usual
  education); the QCC covers every inhaler. A LINE push reaches only consented
  patients with a linked account, and only the cases enrolled in the platform —
  the pushes are the countermeasure that follows an enrollment, so an imported
  對策前 row and a follow-up assessment are both off the journey.
- Two switches decide whether the system can talk to a patient: `LINE_SEND_ENABLED`
  (off means rehearse, never send) and `CRON_SECRET` (the public dispatch
  endpoint refuses to send without it). A rehearsal row is not a delivery: it
  does not consume the allowance and it does not block the real message.
  **Since 2026-10-22 `LINE_SEND_ENABLED=true` on production** — pushes are real.
  `GET /api/health` reports `lineSending: live|rehearsal` so a check run from a
  laptop reports the deployment, not the laptop.
- **A push only reaches a patient who added the official account as a friend.**
  That is LINE's rule, not ours: the QR code and the consent step are both
  required. A refused push is recorded in the dispatch response's `failed`
  array, deletes its `line_deliveries` row (no allowance spent, retry allowed),
  and **does not stop the rest of the batch**.
- **Yomi's `add_friend` cannot add a LINE Official Account.** It answers
  `added: true` and nothing happens: no contact, no chat, no `follow` webhook.
  Adding an OA has to be done in the LINE app by scanning the QR code
  (`https://qr-official.line.me/sid/L/806eizrs.png`, the official one) or opening
  `https://line.me/R/ti/p/@806eizrs`. Don't spend time on the tool. The
  Messaging API quota is 200 a month — `GET /v2/bot/message/quota` says so.
- **The back office is behind a login; the patient end is not.** `/admin` and
  every PHI route need a session (`admin_users` / `admin_sessions`, scrypt
  password, HttpOnly cookie, 12-hour absolute expiry). The public list is
  exactly six routes and lives in `PUBLIC_ENDPOINTS` (`api/auth.mjs`); anything
  not on it needs a session. `POST /api/sessions` is on it and must stay there —
  a login on the patient end would break the zero-install promise.
- The patient's browser is never a session. `POST /api/sessions` writes a
  coaching session anonymously and the record number is hashed server-side; the
  pharmacist's read of it (`GET /api/sessions/pending`) is a protected route.
- **A check that opens the back office has to sign in.** The design gate
  creates a temporary account with a random password, signs in, and hands the
  session to the checks that need it (`output/design-review/session.mjs`). A
  check that opens `/admin` without one measures the sign-in form, and reports
  green on the wrong screen. No fixed password may live in the repository —
  it is public.
- `GET /api/reference` carries the education quiz's answer key, so it is a
  protected route. The quiz is the QCC measurement; its answers are not public.
- `/api/line/dispatch` answers to `CRON_SECRET` only, never to a browser
  session: a GET that can message a patient must not be triggerable by a page.
- The back-office account is `znlin188@gmail.com` (林家薐 藥師, role `admin`).
  It is created by `node scripts/admin-user.mjs`, never from a web form. The
  password never enters Git and never enters an agent conversation: it is
  written to a file and handed to the pharmacist over LINE, at the user's
  instruction on 2026-10-22. Treat it as a shared test credential and change
  it if the account is ever anything more than a test.
- **The instruction films are official, and they live in
  `src/line/data/videos.json`.** The primary source is the Taiwan Society of
  Pulmonary and Critical Care Medicine's own 「吸入劑手冊」 playlist
  (`PLyt_MTzYVDTjdj1f0x4poXWei6SJqEYK-`), 41 films uploaded on the society's
  own channel in 國語／台語／客語／英語／越南語／印尼語. The society publishes
  **no Respimat (SMI) film**, so SMI comes from 衛生福利部胸腔病院 (台語) and
  國立陽明交通大學附設醫院／新北市立聯合醫院藥劑科. The 19 entries are
  device-level plus drug-level: **the patient's own medicine wins over the
  generic device film**, because two pMDIs still need different instructions. A
  台語 film is offered as a second button only when one really exists, never as
  a Mandarin film under a 台語 label.
- **Vercel only ships files it can trace.** `src/line/data/*.json` must be read
  through a literal path (`new URL("../../src/line/data/videos.json",
  import.meta.url)`); a path built from a variable is not traceable, the file
  does not reach the function, and the bot then serves no films at all while the
  repository still looks complete. `vercel.json` also declares
  `functions.api/**.includeFiles`, and `test/line-videos.test.js` fails if the
  server's list is empty.
- **The official account's own greeting and auto-reply are off** (2026-10-22):
  the webhook is the only responder, so a patient never gets two answers. The
  welcome card the webhook sends says who it is (雲林分院藥劑部), asks for one
  thing first (選您的吸入劑), and carries the escalation rules — 呼吸困難撥 119，
  非緊急撥門診藥局 (05) 532-3911 轉藥劑部.
- **The pharmacist's Checklist is scheduled, not remembered** (10/19 會議【五】):
  every enrollment enqueues three planned return visits — **D14 / D21 / D28** —
  and the back office says which patients are due *today*. The days live in
  `src/domain/followup-schedule.js`; the API enqueues them and the app labels
  them. A visit is **one day, not a window**, because the queue has to be able
  to say 「今天」. Closing a visit **supersedes** the same case's other planned
  visits (`followups.status = 'superseded'`): the patient came back once, so
  the rest are neither outstanding work nor missed visits, and they are
  excluded from the follow-up completion rate. A visit closed as *missed*
  supersedes nothing — the patient may still come on the next one.
- **The enrollment form is the 基本表格, and it is the sheet's row.** The
  pharmacist's own form is the old app's 收案表單
  (`qcc-inhaler-platform.vercel.app` → 首頁 →「👨‍⚕️ 藥師收案」), which asked for
  追蹤時間點、病患類別、年齡層、性別、診斷、吸入劑型、藥品名稱、使用多久、
  曾接受衛教、衛教時間 — and wrote exactly those columns into the sheet's
  「藥師收案」 worksheet. The back office asks for the same ones, so a case in
  the platform and a row in the sheet are the same thing. The field list lives
  in `src/domain/enrollment-sheet.js`; the form, the importer and the export
  all read it. **A platform that asks for less than the sheet does is a
  platform the case is filled in twice.** The old form's required set is
  required here too, and the optional ones stay optional.
- **前測 is 改善前, and the enrollment is the 前測.** 10/19 會議【八】, verbatim:
  林藥師「因為我現在是對策前，後面沒有追蹤分析，未來我是想做一個月後（M1）
  追蹤成效有沒有改善。」 The enrollment is the before-measurement and the M1
  follow-up is the after-measurement; QCC 附件七 compares them the same way
  (改善前後對比 is M0 vs M1). The stage therefore follows the timepoint — M0 is
  改善前, M1/M3/M6 are 改善後 — and the rule lives in
  `src/domain/enrollment-sheet.js` (`stageForTimepoint`), which the API, the
  form and the tests all read. 前測／後測 and 改善前／改善後 are two names for
  one thing; the screens show both. **A case filed as 改善後 with no 改善前 to
  pair against never appears in the before/after comparison at all** — which is
  what happened to every newly enrolled patient while the enrollment was filed
  as 改善後. The sheet's own rows stay staged by hand at import time, because
  the May sheet holds M1 and M3 rows too and all of them were collected while
  the study was still 對策前.
- **The LINE journey belongs to the enrollment, not to a stage.** It used to be
  keyed on `qcc_stage = '改善後'`, which only worked while the enrollment was
  filed as 改善後; with the enrollment correctly filed as 前測, a stage filter
  would have taken every new patient off the journey. The anchor now is the
  enrollment that scheduled the return visits (`followups.case_id`), which
  excludes the imported 對策前 cohort — their before-measurement must not be
  contaminated by the countermeasure — and stops an M1 assessment from starting
  a second journey from its own date.
- **The sheet's timepoints are M0/M1/M3/M6.** The old form offered M6 and the
  sheet has an M6 column, so the platform models M6 too; an M6 row filed as an
  M0 was a silent lie about the study's timeline.
- **The before/after pairing takes the patient's later measurement on each
  side** (`api/metrics.mjs`). A patient can have more than one row on a side,
  and which one counts must not depend on the order the database returned.
- **「收案進度」 counts the enrollments, not the 改善後 rows.** An enrollment is
  the case that scheduled the return visits (`followups.case_id`): only an
  enrollment does that, and a row imported from the pharmacist's sheet never
  does — which is what separates this study's 收案 from the 對策前 cohort she
  collected in April and May. It used to count the 改善後 cases, which worked
  only while the enrollment was filed as 改善後; with the enrollment correctly
  filed as 前測 the same count would have measured the return visits, and the
  tile would have read 收案 0/30 on a platform where thirty patients had been
  enrolled. The API field is `enrolment.enrolled`, not `enrolment.after`.
- **The QCC sheet is imported from the case list, not from the navigation** (the
  pharmacist asked where to upload the pre-intervention data on 2026-10-22; the
  endpoint existed but there was no page). 追蹤清單 → 全部個案 carries the two
  file actions on the cases it lists — 「匯出 Excel」 and 「匯入試算表」 —
  because importing and exporting are actions on those cases, not one of the
  pharmacist's jobs. The import page is still a real URL (`/admin/data`) but it
  has no navigation item: the navigation is 收案評估／追蹤清單／成效／衛教內容.
  The file must be `.xlsx` with a worksheet named 「藥師收案」 and these
  columns: 病歷號碼、藥師、院區、藥品名稱、收案日期 — the list lives in
  `src/domain/enrollment-sheet.js` and is the same one the importer checks and
  the screen shows. **The importer refuses a workbook with the wrong headers**
  and names the missing column, instead of skipping every row. **Nothing is
  written before a rehearsal**: 「先試算」 parses and reports what would be
  written (rows read, rows skipped with the sheet's line number, and where the
  sheet disagrees with itself); 「確認匯入」 only unlocks after that rehearsal,
  for that file and that stage. Re-running the same file updates the same cases
  rather than duplicating them.
- **The study is 1:1, and the rotation lives in one file**
  (`src/domain/study-arm.js`). 實驗組 (AI 練習) and 對照組 (一般衛教) alternate
  one against one; the rule, the labels and the ratio arithmetic are in that
  one file, because the form that shows the suggestion, the API that allocates
  the arm and the count that stays on screen all have to agree on it. The
  suggestion follows the arm the last patient was actually given, whatever its
  source, so a manual override moves the next suggestion with it and the 1:1
  holds. The allocation is written in the same statement as the case: the arm
  and the row land together, or neither lands. `arm_source` says which
  happened — `alternating` for the rotation, `manual` for the pharmacist's own
  choice — because an override is a fact about the study that has to be
  auditable.
- **The arm belongs to the patient, not to the row.** A patient who already has
  an arm keeps it: the M1 assessment and a re-enrollment are the same person,
  and a second arm would put one patient in two groups and turn the balance on
  screen into a count of rows. The counts are therefore people
  (`count(DISTINCT patient_id)`), not cases. `cases.study_arm` is NULL on a
  case that was never allocated one — the imported 對策前 cohort — and NULL is
  not the same as 對照組.
- **The control group does not get the camera's verdict.** The pre-fill from an
  AI session is the intervention, so a 對照組 patient is judged by hand and the
  screen says why. Putting the countermeasure into the group that is supposed
  to receive usual education would make the before/after comparison compare
  the two groups on something other than what was given to them.
- **The tally is on the enrollment screen from the start; the two buttons
  arrive with the checklist.** The screen opens with the record number as its
  only control, and that is deliberate — twenty-five controls on arrival is
  what made the form cost twenty-five taps. The count and the ratio are on
  screen from the start; 實驗組／對照組 are chosen in the form, where the
  decision is actually made.
- **The suite refuses to empty a database that has patients in it**
  (`scripts/test.mjs`). The project's Neon database is both the test database
  and the deployment's database, so a test run on a laptop would delete real
  records and still report green. The gate asks the database whether there is
  anything to lose and stops with an explanation; `ALLOW_TRUNCATE=1` overrides
  it. The suite also cleans up after itself, so the next run starts from an
  empty database and the question stays honest.
- **「先噴幾次」是一支藥一個規則** (`src/domain/priming.js`)。 Symbicort
  Rapihaler 新用對空噴 2 下（40/2.25 規格 3 下）、超過 7 天或摔落再 2 下；
  Seretide／Flixotide Evohaler 是「試噴到計數器顯示 120」、超過一週再 2 下；
  Breztri 與 Bevespi（Aerosphere）首次 4 下、超過 7 天等情況再 2 下；Trimbow
  首次 1 下且溶液型不需搖；Ventolin 首次 2 下、超過 5 天再 2 下；Ellipta 與
  Breezhaler **不排氣**；Respimat 首次噴到看見霧氣再多 3 下、超過 3 天先噴 1
  下、超過 21 天重新初始化。**Duasma HFA 與 Berotec N 的仿單尚未取得，它們的
  規則是「未確認」——未確認就不給次數，寧可叫病人照仿單或問藥師，也不要給一
  個不知道對不對的數字。** 每條規則都帶出處（仿單或本院用藥指導單張）；「照
  一般 MDI 的做法」不是理由。藥師端在選藥時就看到這條規則（收案畫面的藥名旁）。
  病人端尚未接上：那一頁的「振搖」關卡對所有藥都一樣，而 Trimbow 根本不該搖。
- **The technical description for 資訊室 is ours to write and theirs to
  review** (`docs/it-specification-draft.md`, 2026-10-24). It states what the
  system does, where the data is, how the record number is protected and what
  the hospital still has to decide — ten open questions are listed at the end.
  It is a draft until 資訊室 has read it, and nothing in it may be quoted as an
  approved position.

## Writing to 林藥師 (LINE)

The user asked on 2026-10-22: 「回覆訊息的文體請依我的平時習慣撰寫，發出前先給我確認」.
That is a rule about the user's own voice, so it is written down here with the
shape of the message they approved and sent on 10/22.

- Open with 「林藥師午安，」 (the time of day of the hour it is sent) and one
  line saying what is being reported or explained — 「後台登入的方式跟您說明一下。」
  「LINE 這部分目前的狀況跟您回報一下。」 The greeting follows the hour, and the
  user's own two messages on 10/22 were both sent at 15:15, both opening with
  「林藥師午安，」. At 21:27 on 10/23 a draft that still said 午安 was sent back
  with 「現在已經是晚上 9:27 耶」 — so at that hour it is 「林藥師晚安，」, and
  the fix is to send it when the greeting is right, not to keep one word.
- Blank line between paragraphs. One paragraph per screen or item, each
  starting with 「：」 — 「追蹤清單：這是兩週內要再評估的病人。」 Short
  sentences, plain verbs (點、開、輸入、選、勾、存檔), 「您」 for her. No emoji,
  no markdown bullets, no 一、二、三 headings. Traditional Chinese.
- Write the screen as a sequence she can follow, the way the user did on 10/22:
  「先輸入病歷號碼，選這位病人用的是哪一種吸入劑，再照著清單把每個步驟對或
  錯勾起來，右邊會顯示還差幾項，存檔就完成。」 Never a line about the message
  itself. The user rejected 「我截圖標給您看」 on 10/23 — 「這不是我說話的
  風格，我不會寫…這種廢話！」 A report states the state of the system; the
  screenshots are the evidence, not the subject.
- Close the way the user closed on 10/22: 「您先試用看看，哪裡不好用、哪裡跟
  現場的流程不合，隨時跟我說，我們再一起討論調整。」 then 「10/27 討論的時候
  如果需要，可以一起看一次實際操作。」
- A screenshot makes it clearer, and it should be marked up: a red circle, a red
  arrow, and a short red label saying where the thing is. The markup is plain
  geometry, not a simulated hand-drawn scrawl. Place it by the browser's own
  bounding box, never by reading pixels by eye.
- **Describe where things are now, not what changed.** The user said it on
  2026-10-23: 「藥師根本沒經歷選單五項的過程，你的寫法不是在製作困擾而已？」.
  She never saw the five-item navigation, so 「匯入、匯出原本是左邊的一個分頁，
  現在搬到個案清單裡」 describes a change that never happened to her and only
  makes her look for a door that was never there. Say 「匯入、匯出在個案清單上方」
  — where it is now — and leave the history to the engineers. The same applies
  to the red label on the screenshot: 「左邊分頁只剩四項」 counts a menu she has
  never seen, so it is not drawn.
- **Sending is the user's call.** Show the text and the images first; send only
  after they approve. A message cannot be taken back and a second copy is not
  the same as a corrected one: one message, sent once.

## Deployment

The public LINE deployment, its environment variables and the daily push job
are written down in `docs/line-deployment-runbook.md`. `node scripts/line-setup.mjs check`
verifies a deploy; `node scripts/line-setup.mjs richmenu` uploads the six-cell
menu to the real channel.

The back-office accounts, roles, session rules and incident steps are in
`docs/admin-access-runbook.md`.

## Transient data

Live sheet URLs, deployment ids, session transcripts, and study media live
outside the repository. Record the URL and the date consulted, not the content.

## Task records

The handoff record and the acceptance table are task-local, so they live outside
the repository, under the session's temporary directory:

```
${TMPDIR}opencode/inhaler-v2/
```

`progress.md` there is the continuity record for this project; read it first when
resuming. `checks.md` there carries one row per requirement with its evidence.
Durable facts belong in this file instead. Do not commit either file.
