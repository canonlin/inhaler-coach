#!/usr/bin/env python3
"""Write machine-readable provenance for a promoted inhaler model."""

from __future__ import annotations

import argparse
import hashlib
import json
import platform
from datetime import datetime, timezone
from pathlib import Path

import torch
import transformers
import ultralytics


def digest(path: Path) -> dict:
	hash_value = hashlib.sha256(path.read_bytes()).hexdigest()
	return {"path": str(path), "bytes": path.stat().st_size, "sha256": hash_value}


def main() -> None:
	parser = argparse.ArgumentParser()
	parser.add_argument("--output", required=True, type=Path)
	parser.add_argument("--source-commit", required=True)
	parser.add_argument("--dataset-id", required=True)
	parser.add_argument("--source-archive-sha256", action="append", required=True)
	parser.add_argument("--manifest", required=True, type=Path)
	parser.add_argument("--filtered-labels", required=True, type=Path)
	parser.add_argument("--base-weights", required=True, type=Path)
	parser.add_argument("--candidate-weights", required=True, type=Path)
	parser.add_argument("--onnx", required=True, type=Path)
	parser.add_argument("--baseline-report", required=True, type=Path)
	parser.add_argument("--candidate-report", required=True, type=Path)
	args = parser.parse_args()

	record = {
		"created_at": datetime.now(timezone.utc).isoformat(),
		"dataset": {
			"id": args.dataset_id,
			"purpose": "internal inhaler object detection model improvement",
			"source": "user-provided pharmacist collector exports",
			"authorization": "user explicitly requested YOLO training for this coaching application",
			"use_restriction": "internal inhaler coaching model development and validation only",
			"source_archive_sha256": args.source_archive_sha256,
			"source_commit": args.source_commit,
			"manifest": digest(args.manifest),
			"filtered_labels": digest(args.filtered_labels),
		},
		"training": {
			"architecture": "YOLO11n",
			"seed": 42,
			"epochs": 100,
			"image_size": 640,
			"batch": 32,
			"base_weights": digest(args.base_weights),
			"candidate_weights": digest(args.candidate_weights),
		},
		"evaluation": {
			"holdout_session": "80918593",
			"baseline": json.loads(args.baseline_report.read_text()),
			"candidate": json.loads(args.candidate_report.read_text()),
		},
		"export": {"format": "ONNX", "opset": 12, "nms": True, **digest(args.onnx)},
		"environment": {
			"python": platform.python_version(),
			"torch": torch.__version__,
			"cuda": torch.version.cuda,
			"gpu": torch.cuda.get_device_name(0),
			"ultralytics": ultralytics.__version__,
			"transformers": transformers.__version__,
		},
	}
	args.output.write_text(json.dumps(record, indent=2) + "\n")
	print(args.output)


if __name__ == "__main__":
	main()
