#!/usr/bin/env python3
"""
Train small logistic-regression per-step classifiers on dataset-0519.json and
export weights to src/detection/step-weights.json for in-browser inference.

Only press & exhale get a shipped classifier: their signal is the red
canister's position/area, computed identically offline and in the browser, so
the model transfers. Shake & rinse stay on their engineered motion detectors —
motion's absolute scale differs between the 0519 close-ups and the collector's
framing, so a motion-trained classifier would not transfer; their weights are
still reported for the eventual in-domain retrain.
"""
import json, os, numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
ds = json.load(open(f"{HERE}/dataset-0519.json"))
FEATS = {
    "press":  ["canisterY", "canisterPresent", "canisterArea"],
    "exhale": ["canisterY", "canisterPresent", "canisterArea"],
    "shake":  ["motion"],
    "rinse":  ["motion"],
}
SHIP = {"press", "exhale"}   # transferable-feature classifiers

def mat(rows, feats):
    X = np.array([[r[f] for f in feats] for r in rows], float)
    y = np.array([r["label"] for r in rows], float)
    return X, y

def fit(X, y, iters=4000, lr=0.3, l2=1e-3):
    mu, sd = X.mean(0), X.std(0) + 1e-6
    Xs = (X - mu) / sd
    w = np.zeros(X.shape[1]); b = 0.0
    n = len(y)
    for _ in range(iters):
        z = Xs @ w + b
        p = 1 / (1 + np.exp(-z))
        g = p - y
        w -= lr * (Xs.T @ g / n + l2 * w)
        b -= lr * g.mean()
    return w, b, mu, sd

def evals(X, y, w, b, mu, sd):
    p = 1 / (1 + np.exp(-(((X - mu) / sd) @ w + b)))
    pred = (p >= 0.5).astype(int)
    pos = y == 1; neg = y == 0
    correct_pass = pred[pos].mean() if pos.any() else float("nan")
    incorrect_caught = 1 - pred[neg].mean() if neg.any() else float("nan")
    return correct_pass, incorrect_caught

weights = {}
for stage, feats in FEATS.items():
    Xtr, ytr = mat(ds[stage]["train"], feats)
    Xva, yva = mat(ds[stage]["val"], feats)
    w, b, mu, sd = fit(Xtr, ytr)
    cp, ic = evals(Xva, yva, w, b, mu, sd)
    tag = "SHIP" if stage in SHIP else "engineered-detector kept"
    print(f"{stage:7s} [{','.join(feats)}]  val correct_pass={cp*100:4.0f}%  incorrect_caught={ic*100:4.0f}%   ({tag})")
    if stage in SHIP:
        weights[stage] = {
            "features": feats,
            "mean": [round(float(x), 6) for x in mu],
            "std": [round(float(x), 6) for x in sd],
            "w": [round(float(x), 6) for x in w],
            "b": round(float(b), 6),
        }

out = f"{HERE}/../src/detection/step-weights.json"
json.dump(weights, open(out, "w"), indent=2)
print("wrote", out, "(press, exhale)")
