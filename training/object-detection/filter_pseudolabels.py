#!/usr/bin/env python3
"""Keep GroundingDINO boxes corroborated by independently logged telemetry.

GroundingDINO eagerly boxes small red objects in the clinic background.  The
collector JSON contains the production YOLO centre (or, on a recall miss, the
red-canister centre).  Selecting only a nearby DINO box turns two noisy signals
into a conservative pseudo-label.  Uncorroborated frames are excluded rather
than silently becoming false negatives.
"""

from __future__ import annotations

import argparse
import csv
import json
import math
from pathlib import Path


def choose_box(detection: dict, row: dict, max_distance: float) -> dict:
	seeded = row.get("seed_x") not in {None, ""} and row.get("seed_y") not in {None, ""}
	negative = row.get("task") == "speak" and not seeded
	if not seeded:
		return {**detection, "boxes": [], "best": None, "usable": negative, "label_source": "negative" if negative else "excluded"}

	w, h = detection["w"], detection["h"]
	sx, sy = float(row["seed_x"]), float(row["seed_y"])
	candidates = []
	for box in detection.get("boxes", []):
		x1, y1, x2, y2, score = box
		cx, cy = (x1 + x2) / (2 * w), (y1 + y2) / (2 * h)
		distance = math.hypot(cx - sx, cy - sy)
		if distance <= max_distance:
			candidates.append((distance, -score, box))
	if not candidates:
		return {**detection, "boxes": [], "best": None, "usable": False, "label_source": "excluded"}
	box = min(candidates)[2]
	return {
		**detection,
		"boxes": [box],
		"best": {"box": box[:4], "score": box[4]},
		"usable": True,
		"label_source": f"dino+{row['seed_source']}",
	}


def main() -> None:
	parser = argparse.ArgumentParser()
	parser.add_argument("detections", type=Path)
	parser.add_argument("manifest", type=Path)
	parser.add_argument("output", type=Path)
	parser.add_argument("--max-distance", type=float, default=0.18)
	args = parser.parse_args()

	detections = json.loads(args.detections.read_text())
	rows = {row["file"]: row for row in csv.DictReader(args.manifest.open())}
	filtered = {
		name: choose_box(detection, rows[name], args.max_distance)
		for name, detection in detections.items()
	}
	args.output.write_text(json.dumps(filtered), encoding="utf-8")
	sources = {}
	for item in filtered.values():
		sources[item["label_source"]] = sources.get(item["label_source"], 0) + 1
	print(json.dumps(sources, sort_keys=True))


if __name__ == "__main__":
	main()
