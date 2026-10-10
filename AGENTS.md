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
provides a `postgres:16-alpine` service for this; locally it is
`postgres://postgres:devpw@localhost:55432/inhaler` in the `inhaler-pg`
container. The suite runs with `--test-concurrency=1` because those files
truncate shared tables.

## What this repository is

`inhaler-coach` is the v2 work: a browser-only asthma/COPD inhaler-technique
coaching platform for 臺大醫院雲林分院藥劑部, built as one plan with two layers —
a hospital QCC／深耕計畫 quality-improvement layer and a research layer.

- Patient end: camera + AI step coaching (`src/steps/`, `src/detection/`).
- Pharmacist end: standardized checklist, education, follow-up tracking.
- Management end: QCC metrics, baseline vs. post-intervention analytics.
- Data backend: consolidated behind one API (see the plan in `docs/`).

Package name is `inhaler-coach-v2`, version `2.0.0`. Deployment target is
`inhaler-coach.vercel.app`; `https://canonlin.github.io/inhaler-coach/collector/`
hosts the research data collector.

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

## Durable facts

- Baseline study data: 61 cases, collected 2026-04-21 to 2026-05-27, with real
  error notes. It is the reference the QCC dashboard validates against.
- The AI detection ground-truth problem is open: `docs/paper-methods-revision.md`
  downgrades perinasal optical flow, promotes audio, and proposes thermal imaging
  as laboratory ground truth. Treat optical flow as an evaluated candidate, not
  the primary detector.

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
