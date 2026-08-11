# 1150806 pharmacist-cohort model promotion

## Decision

Promoted to `public/models/inhaler.onnx` after matching PyTorch and browser-format
ONNX evaluation.  The held-out pharmacist session (`80918593`) was not part of
fine-tuning.

| Metric at confidence 0.30 | Previous model | Candidate ONNX | Change |
| --- | ---: | ---: | ---: |
| Positive-frame recall | 107 / 140 (76.43%) | 120 / 140 (85.71%) | +9.28 pp |
| No-inhaler false fires | 0 / 15 | 0 / 15 | no regression |

The promotion gate requires at least +2 percentage points recall and no increase
in false fires.  Both the PyTorch checkpoint and fixed-batch browser ONNX export
passed it; see `acceptance-yolo.json` and `acceptance-onnx.json`.

## Data quality

The two user-provided archives supplied 954 exact protocol-labelled frames from
five pharmacist sessions.  Pseudo-label filtering retained 751 positive frames
only when GroundingDINO agreed with independently logged production-YOLO or
colour-device telemetry, plus 15 explicit speech negatives.  It excluded 188
unresolved frames rather than converting uncertainty into a negative label.

This validates object presence for the final coaching flow.  It does not turn
the YOLO object detector into an independent detector of an actual canister
press; the app still uses visible, steady, mouth-adjacent posture as its
fail-closed gate for that coaching step.

`provenance.json` records archive and label digests, source commit, training
configuration, checkpoint, evaluation, ONNX export, and GPU environment.
