import os, sys, json, glob
import torch
from PIL import Image, ImageDraw
from transformers import AutoProcessor, AutoModelForZeroShotObjectDetection

FRAMES = os.path.expanduser("~/inhaler-detector/frames")
OUT = os.path.expanduser("~/inhaler-detector")
MODEL = "IDEA-Research/grounding-dino-base"
PROMPT = "an inhaler. a red inhaler. a white and red asthma inhaler device."
BOX_TH, TEXT_TH = 0.30, 0.25

limit = int(sys.argv[1]) if len(sys.argv) > 1 else 0
viz = "--viz" in sys.argv

dev = "cuda"
proc = AutoProcessor.from_pretrained(MODEL)
model = AutoModelForZeroShotObjectDetection.from_pretrained(MODEL).to(dev).eval()

files = sorted(glob.glob(f"{FRAMES}/*.jpg"))
if limit:
    files = files[:: max(1, len(files) // limit)][:limit]
print(f"processing {len(files)} frames", flush=True)

os.makedirs(f"{OUT}/viz", exist_ok=True)
dets = {}
scores_all = []
for i, f in enumerate(files):
    img = Image.open(f).convert("RGB")
    inp = proc(images=img, text=PROMPT, return_tensors="pt").to(dev)
    with torch.no_grad():
        out = model(**inp)
    res = proc.post_process_grounded_object_detection(
        out, inp.input_ids, threshold=BOX_TH, text_threshold=TEXT_TH,
        target_sizes=[img.size[::-1]])[0]
    boxes = res["boxes"].tolist(); scs = res["scores"].tolist()
    allb = [[round(b[0],1),round(b[1],1),round(b[2],1),round(b[3],1),round(s,3)]
            for b, s in zip(boxes, scs)]
    best = None
    if scs:
        j = max(range(len(scs)), key=lambda k: scs[k])
        best = {"box": [round(x, 1) for x in boxes[j]], "score": round(scs[j], 3)}
        scores_all.append(best["score"])
    dets[os.path.basename(f)] = {"w": img.width, "h": img.height, "best": best,
                                 "boxes": allb, "n": len(scs)}
    if viz:
        d = ImageDraw.Draw(img)
        for b, s in zip(boxes, scs):
            d.rectangle(b, outline=(0, 255, 0), width=3)
            d.text((b[0], max(0, b[1] - 12)), f"{s:.2f}", fill=(0, 255, 0))
        img.save(f"{OUT}/viz/{os.path.basename(f)}")
    if (i + 1) % 50 == 0:
        print(f"  {i+1}/{len(files)}", flush=True)

suffix = "_sample" if limit else ""
json.dump(dets, open(f"{OUT}/detections{suffix}.json", "w"))
found = sum(1 for v in dets.values() if v["best"])
print(f"frames with a detection: {found}/{len(files)} ({found/len(files)*100:.0f}%)")
if scores_all:
    scores_all.sort()
    q = lambda p: scores_all[int(p * (len(scores_all) - 1))]
    print(f"score quantiles: min={q(0):.2f} p25={q(.25):.2f} med={q(.5):.2f} p75={q(.75):.2f} max={q(1):.2f}")
