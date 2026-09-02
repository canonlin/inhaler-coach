# Inhaler Coach UI Style Guide

Version 1.0-draft · 2026-09-02 · Owner: Inhaler Coach product team

## Context and goal

This is an `APPLICATION` of the existing Inhaler Coach identity. The light,
rose-and-slate introduction screen is the visual authority; this guide extends
that language into video, live recognition, recovery, and completion states.
It does not redesign the product identity or the Symbicort device imagery.

The service should feel clinically trustworthy without becoming cold: precise
instructions, calm pacing, visible system state, and one obvious next action.

## Interaction contract

| Field | Contract |
| --- | --- |
| User goal | Learn and rehearse the four inhaler steps, understand the current instruction, and know when the sequence is complete. |
| Entry | The learner starts from the introduction or a facilitator restores a specific stage with `?stage=1…4`. |
| Primary action | Each state has one emphasized action: start, begin recognition, retry, continue, or practise again. |
| Feedback | Loading, guidance, success, and error are named in text. Colour and motion may reinforce text but never replace it. |
| State model | Intro → video loading/playing/error/ended → AI loading/live/error/passed → next stage → completion. |
| Fallback | Video failure offers reload or direct practice. Camera/model failure offers retry or return to the video. A clinician may confirm the step. |
| Completion and exit | The completion screen lists all four learned steps and offers a single restart action. |
| Accessibility | WCAG 2.2 AA contrast; 44 px minimum controls; visible keyboard focus; semantic buttons and headings; reduced-motion support; layouts remain usable at 320 px width. |
| Information architecture | Global identity and stage progress stay at the top; the current instruction stays visually separate from media; recovery replaces the failed surface instead of appearing behind it. |
| Validation | Observe one normal full path, one video failure, one model/camera failure, keyboard focus order, reduced motion, the demo viewport, and a 320 px viewport. |

## Tokens and foundations

- Brand: rose `#e11d48`; strong rose `#be123c`.
- Canvas: slate 50 `#f8fafc`; surface: white `#ffffff`.
- Live media surface: slate 950 `#020617`; elevated dark surface: slate 900 `#0f172a`.
- Text: slate 900 `#0f172a`; secondary text: slate 600 `#475569`.
- Success: emerald 700 `#047857`; warning: amber 700 `#b45309`; danger: red 700 `#b91c1c`.
- Spacing follows 4, 8, 12, 16, 24, and 32 px. Large presentation spacing may use 48 or 64 px.
- Corners use 12 px for controls, 16 px for cards, and 24 px for modal recovery surfaces.
- The bundled `jf-openhuninn` font is the primary face. DM Mono or a system monospace stack is reserved for stage numbers and technical labels.

## Component rules

- The stage bar must show product identity, the current step, `N / 4`, and a real progress line.
- The instruction banner states one physical action. It must not pulse continuously or obscure video controls.
- Primary buttons use brand rose. Success green communicates an achieved state; it is not a general call-to-action colour.
- Guidance banners are neutral/dark. Success and error banners use both an icon or label and text; colour alone is insufficient.
- Loading surfaces name what is happening and must transition to a visible error within a bounded time.
- Human confirmation is a legitimate secondary recovery action and must be labelled as clinician confirmation, not AI success.
- Completion must summarize the four learned steps. It must not claim clinical mastery or certification.

## Content and tone

Use short, direct Taiwanese Traditional Chinese. Name the action before the
reason: 「將吸入器移離嘴邊，再慢慢吐氣」. Avoid confidence percentages,
internal model terminology, cheerleading punctuation, and claims the available
sensors cannot verify.

## Prohibited patterns

- Undefined semantic classes such as `text-text` without a token declaration.
- A red full-screen overlay for normal in-progress guidance.
- Infinite loading indicators or console-only errors.
- Multiple equally prominent next actions.
- Decorative animation without a reduced-motion path.
- Completion copy that presents practice as medical certification.

## QA checklist

- [ ] One primary action is visually dominant in every state.
- [ ] Every network, permission, and recognition failure has visible recovery.
- [ ] All controls are at least 44 × 44 px and show `focus-visible`.
- [ ] Colour contrast meets WCAG 2.2 AA.
- [ ] Stage progress and current instruction remain visible at the demo distance.
- [ ] The normal path and both error paths are observed in a real browser.
- [ ] The layout is observed at the demo viewport and 320 px width.
- [ ] Reduced motion removes non-essential pulsing, scaling, and translation.
