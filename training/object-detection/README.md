# Inhaler object detector — training pipeline

The model that replaced the colour filter (`public/models/inhaler.onnx`,
consumed by `src/detection/inhaler-detector.js`). It finds the red Symbicort
Rapihaler as an *object* (shape), so it stops mistaking a nostril or a door
handle for an inhaler the way the colour test did.

## Why this exists

The old presence check (`device-tracker.js` `isCanisterRed`) fired on skin and
any reddish object — on a real webcam of someone holding nothing it reported an
inhaler present 70–97 % of frames, so every step passed with no inhaler. It only
worked on the 0519 close-ups where the inhaler was the sole saturated red.

## Where the data and the GPU are

- **Source videos:** the 5–6 pharmacist collector recordings (`*.webm`), from
  林藥師's Google Drive ("teachable machine 專案 / collector"). That Drive is the
  durable home of the raw footage.
- **GPU box:** `desktop-cudbf36-1` on Tailscale (RTX 4080; exact package versions
  are written into each run's provenance). Original working dir
  `~/Workspace/inhaler-detector/`
  (`frames/`, `dataset/`, `runs/`) — the frames and trained weights live there.
  Reachable via Tailscale SSH (one-time browser auth).

## Pipeline (reproducible)

1. **Sample frames** — 1 fps, scaled to 640 wide, from each pharmacist webm
   (`ffmpeg -i in.webm -vf "fps=1,scale=640:-2" frames/<id>_%04d.jpg`). ~2400
   frames from 5 videos.
2. **Auto-label** (`autolabel.py`) — GroundingDINO (`IDEA-Research/grounding-dino-base`)
   with the prompt "an inhaler. a red inhaler. a white and red asthma inhaler
   device." writes `detections.json` (all boxes + scores per frame). The saved
   `labels-detections.json` here is that output — the dataset manifest.
   (Note: transformers renamed the post-process arg `box_threshold` → `threshold`.)
3. **Build YOLO dataset** (`build_yolo.py <conf> <val_holdout_id>`) — keeps boxes
   ≥ 0.5 confidence (~940 positive frames + ~1500 negatives), writes YOLO labels
   and `data.yaml`. Val split holds out ONE whole pharmacist, so the metric
   measures generalisation to a new person, not memorised frames.
4. **Train** (`train.py`) — yolo11n, 100 epochs, imgsz 640, val = held-out
   pharmacist. Export ONNX with NMS baked in:
   `YOLO('runs/inhaler/weights/best.pt').export(format='onnx', opset=12, imgsz=640, nms=True, simplify=True)`.

## Result and the key lesson

nano on the real failure clip (user holding nothing): **0/20 false fires**, and
still boxes a real inhaler at conf 0.94. A larger yolo11s scored higher mAP
against the (noisy pseudo-)labels but false-fired **15/20** on that same clip —
so **pseudo-label mAP is misleading; always test on the real failure clip.**
nano shipped. Recall ~0.7 on an unseen person → the app fails CLOSED (a missed
inhaler is "try again", never a false pass) and smooths presence over ~0.9 s to
hide the frame-to-frame flicker.

## Improving it (the flywheel)

Recall on a NEW person/device/lighting is the weak point (the model was trained
only on masked pharmacists). The collector logs its own detections per session;
feeding those frames back through steps 2–4 — especially footage of *other*
inhalers and *other* rooms — is how it gets better. To add a new cohort: sample
its frames, run `autolabel.py`, rebuild, retrain.

### Incremental collector workflow

Do not sample an entire collector WebM. A session can remain open for 7--30
minutes while the pharmacist reads or retries, so whole-video sampling assigns
task labels to waiting frames. The reproducible update path is:

1. `extract_collector.py` pairs JSON/WebM members even when split across ZIPs,
   decodes once at 1 fps, and keeps only exact protocol task timestamps.
2. `autolabel.py` runs GroundingDINO. Its raw boxes are not training labels:
   clinic background objects produce plausible false boxes.
3. `filter_pseudolabels.py` keeps only a DINO box near the independently logged
   production-YOLO or red-canister centre. Uncertain frames are excluded instead
   of becoming false negatives.
4. `build_yolo.py` holds out one complete new session. Then
   `merge_yolo_dataset.py` combines the original train+val corpus into training,
   the other new sessions into training, and preserves that new-person holdout.
5. Fine-tune from the previous `best.pt`, not from a generic checkpoint, and run
   `evaluate_yolo.py` on the holdout. A candidate must improve positive-frame
   recall without increasing no-inhaler false fires before ONNX export.

All scripts accept `INHALER_ROOT`; training additionally records explicit seed,
checkpoint, batch, epoch, dependency versions, dataset hashes, and export hash.

### 1150806 pharmacist cohort (2026-08-10)

The five newly collected pharmacist sessions were cut only at their exact
protocol timestamps, then filtered through two independent device signals before
they became training labels.  Fine-tuning YOLO11n from the prior model improved
the entirely held-out session's frame recall from **76.43% (107/140)** to
**85.71% (120/140)** at the production confidence threshold of 0.30, while
preserving **0/15** false fires on explicit no-inhaler frames.  The fixed-batch
ONNX export reproduced the same 120/140 result and was promoted to
`public/models/inhaler.onnx` only after both checks passed.  The machine-readable
reports and provenance are in `artifacts/1150806/`.
