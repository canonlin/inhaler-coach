#!/usr/bin/env python3
"""
Build a per-step training set from the pharmacist's 0519 Teachable Machine
labels, using the SAME features the live collector logs, so a classifier
trained here consumes exactly what the browser produces.

Common, cohort-invariant features (pure red-canister colour blob, identical
algorithm offline and in device-tracker.js):
    canisterY        vertical position 0=top..1=bottom
    canisterPresent  fraction of frames the canister was seen
    canisterArea     blob area as a fraction of frame
    motion           frame-diff mean-abs (COHORT-SCALED; see caveat)

Windowed (median over W frames), temporal 70/30 split per class (boundary
window dropped). 0519 is essentially one demonstration per class, so val
accuracy proves FEATURE SEPARABILITY, not field generalisation — the
collector's silent background judging is what will supply in-domain labels.

Usage: python3 build_dataset.py <path-to-tm_ext>   (tm_ext/<stage>/<correct|incorrect>/*.jpg)
"""
import sys, os, glob, json, math
import numpy as np
from PIL import Image

SRC = sys.argv[1] if len(sys.argv) > 1 else "tm_ext"
W, STEP = 20, 5
STAGES = ["shake", "exhale", "press", "rinse"]

def is_red(a):
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    return (r > 110) & (r - g > 50) & (r - b > 50)

def frame_features(frames):
    H, Wd = frames[0].shape[:2]
    ys, pres, area = [], [], []
    for f in frames:
        m = is_red(f); n = int(m.sum())
        if n > 20:
            ys.append(float(np.argwhere(m)[:, 0].mean()) / H); pres.append(1.0)
            area.append(n / (H * Wd))
        else:
            ys.append(1.0); pres.append(0.0); area.append(0.0)   # absent => "very low / away"
    motion = [0.0] + [float(np.abs(frames[i] - frames[i-1]).mean()) for i in range(1, len(frames))]
    return np.array(ys), np.array(pres), np.array(area), np.array(motion)

def windows(y, p, a, mo):
    out = []
    for i in range(0, max(1, len(y) - W), STEP):
        s = slice(i, i + W)
        out.append({
            "canisterY": float(np.median(y[s])),
            "canisterPresent": float(np.mean(p[s])),
            "canisterArea": float(np.median(a[s])),
            "motion": float(np.median(mo[s])),
        })
    return out

def load(stage, cls):
    fs = sorted(glob.glob(f"{SRC}/{stage}/{cls}/*.jpg"))
    return [np.asarray(Image.open(f).convert("RGB"), dtype=np.float32) for f in fs]

dataset = {}
for stage in STAGES:
    rows = {"train": [], "val": []}
    for cls, label in [("correct", 1), ("incorrect", 0)]:
        y, p, a, mo = frame_features(load(stage, cls))
        w = windows(y, p, a, mo)
        cut = int(len(w) * 0.7)
        for j, feat in enumerate(w):
            if j == cut:      # drop the one window straddling the split
                continue
            feat = dict(feat); feat["label"] = label
            rows["train" if j < cut else "val"].append(feat)
    dataset[stage] = rows
    ntr, nva = len(rows["train"]), len(rows["val"])
    print(f"{stage:7s}: {ntr} train / {nva} val windows")

os.makedirs(os.path.dirname(os.path.abspath(__file__)) + "/../training", exist_ok=True)
out = os.path.dirname(os.path.abspath(__file__)) + "/dataset-0519.json"
json.dump(dataset, open(out, "w"), indent=0)
print("wrote", out)
