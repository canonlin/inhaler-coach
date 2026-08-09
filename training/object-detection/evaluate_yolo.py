#!/usr/bin/env python3
"""Report coaching-relevant frame recall and no-inhaler false fires."""

from __future__ import annotations

import argparse
import json
from pathlib import Path

from ultralytics import YOLO


def main() -> None:
	parser = argparse.ArgumentParser()
	parser.add_argument("weights", type=Path)
	parser.add_argument("dataset", type=Path)
	parser.add_argument("--split", default="val")
	parser.add_argument("--confidence", type=float, default=0.3)
	parser.add_argument("--device", default="0")
	parser.add_argument("--output", type=Path)
	args = parser.parse_args()

	images = sorted((args.dataset / "images" / args.split).glob("*"))
	labels = args.dataset / "labels" / args.split
	model = YOLO(str(args.weights))
	results = model.predict(
		source=[str(image) for image in images],
		conf=args.confidence,
		device=args.device,
		verbose=False,
		stream=True,
	)

	positive = positive_hit = negative = false_fire = 0
	positive_scores = []
	by_session = {}
	for image, result in zip(images, results, strict=True):
		expected = bool((labels / f"{image.stem}.txt").read_text().strip())
		predicted = len(result.boxes) > 0
		session = image.name.split("_", 1)[0]
		row = by_session.setdefault(
			session,
			{"positive": 0, "positive_hit": 0, "negative": 0, "false_fire": 0},
		)
		if expected:
			positive += 1
			positive_hit += int(predicted)
			row["positive"] += 1
			row["positive_hit"] += int(predicted)
			if predicted:
				positive_scores.append(float(result.boxes.conf.max()))
		else:
			negative += 1
			false_fire += int(predicted)
			row["negative"] += 1
			row["false_fire"] += int(predicted)
	report = {
		"weights": str(args.weights),
		"confidence": args.confidence,
		"positive_frames": positive,
		"positive_hits": positive_hit,
		"frame_recall": round(positive_hit / positive, 4) if positive else None,
		"negative_frames": negative,
		"false_fires": false_fire,
		"false_fire_rate": round(false_fire / negative, 4) if negative else None,
		"mean_positive_score": round(sum(positive_scores) / len(positive_scores), 4) if positive_scores else None,
		"by_session": by_session,
	}
	text = json.dumps(report, indent=2)
	print(text)
	if args.output:
		args.output.write_text(text + "\n")


if __name__ == "__main__":
	main()
