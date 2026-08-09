import os, json, glob, shutil, sys
ROOT = os.path.expanduser(os.environ.get("INHALER_ROOT", "~/inhaler-detector"))
FRAMES = f"{ROOT}/frames"
DS = f"{ROOT}/dataset"
THRESH = float(sys.argv[1]) if len(sys.argv) > 1 else 0.45
VAL_VIDEO = sys.argv[2] if len(sys.argv) > 2 else "a53265e2"  # hold out one pharmacist

detection_file = os.environ.get("INHALER_DETECTIONS", "detections.json")
dets = json.load(open(f"{ROOT}/{detection_file}"))
for sub in ["images/train", "images/val", "labels/train", "labels/val"]:
    os.makedirs(f"{DS}/{sub}", exist_ok=True)

stats = {"train": {"pos": 0, "neg": 0, "boxes": 0}, "val": {"pos": 0, "neg": 0, "boxes": 0}}
for name, d in dets.items():
	if d.get("usable") is False:
		continue
	split = "val" if name.startswith(VAL_VIDEO) else "train"
	w, h = d["w"], d["h"]
	keep = [b for b in d.get("boxes", []) if b[4] >= THRESH]
	lines = []
	for x1, y1, x2, y2, s in keep:
		cx, cy = (x1 + x2) / 2 / w, (y1 + y2) / 2 / h
		bw, bh = (x2 - x1) / w, (y2 - y1) / h
		if bw <= 0 or bh <= 0:
			continue
		lines.append(f"0 {cx:.6f} {cy:.6f} {bw:.6f} {bh:.6f}")
	shutil.copy(f"{FRAMES}/{name}", f"{DS}/images/{split}/{name}")
	open(f"{DS}/labels/{split}/{name.rsplit('.',1)[0]}.txt", "w").write(
		"\n".join(lines)
	)
	stats[split]["pos" if lines else "neg"] += 1
	stats[split]["boxes"] += len(lines)

yaml = f"""path: {DS}
train: images/train
val: images/val
names:
  0: inhaler
"""
open(f"{DS}/data.yaml", "w").write(yaml)
print(f"threshold={THRESH}  val_holdout={VAL_VIDEO}")
for sp in ["train", "val"]:
    s = stats[sp]
    print(f"  {sp}: {s['pos']} with-inhaler, {s['neg']} empty(neg), {s['boxes']} boxes")
