#!/usr/bin/env python3
"""Fail closed unless a candidate improves recall without new false fires."""

from __future__ import annotations

import argparse
import json
from pathlib import Path


def main() -> None:
	parser = argparse.ArgumentParser()
	parser.add_argument("baseline", type=Path)
	parser.add_argument("candidate", type=Path)
	parser.add_argument("--minimum-recall-gain", type=float, default=0.02)
	args = parser.parse_args()
	baseline = json.loads(args.baseline.read_text())
	candidate = json.loads(args.candidate.read_text())

	recall_gain = candidate["frame_recall"] - baseline["frame_recall"]
	false_fire_ok = candidate["false_fires"] <= baseline["false_fires"]
	accepted = recall_gain >= args.minimum_recall_gain and false_fire_ok
	result = {
		"accepted": accepted,
		"baseline_recall": baseline["frame_recall"],
		"candidate_recall": candidate["frame_recall"],
		"recall_gain": round(recall_gain, 4),
		"baseline_false_fires": baseline["false_fires"],
		"candidate_false_fires": candidate["false_fires"],
		"minimum_recall_gain": args.minimum_recall_gain,
	}
	print(json.dumps(result, indent=2))
	if not accepted:
		raise SystemExit(1)


if __name__ == "__main__":
	main()
