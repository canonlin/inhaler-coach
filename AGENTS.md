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
  patients with a linked account, and only post-intervention cases.
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
