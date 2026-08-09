#!/usr/bin/env python3
"""Export a validated YOLO checkpoint to the browser's NMS ONNX contract."""

from __future__ import annotations

import argparse
import hashlib
import shutil
from pathlib import Path

import onnx
from ultralytics import YOLO


def sha256(path: Path) -> str:
	digest = hashlib.sha256()
	with path.open("rb") as source:
		for chunk in iter(lambda: source.read(1024 * 1024), b""):
			digest.update(chunk)
	return digest.hexdigest()


def main() -> None:
	parser = argparse.ArgumentParser()
	parser.add_argument("weights", type=Path)
	parser.add_argument("output", type=Path)
	args = parser.parse_args()

	model = YOLO(str(args.weights))
	exported = Path(
		model.export(
			format="onnx",
			opset=12,
			imgsz=640,
			nms=True,
			simplify=True,
			dynamic=False,
		)
	)
	args.output.parent.mkdir(parents=True, exist_ok=True)
	shutil.copy2(exported, args.output)
	graph = onnx.load(args.output)
	onnx.checker.check_model(graph)
	print(f"exported={args.output}")
	print(f"sha256={sha256(args.output)}")
	print(f"outputs={[output.name for output in graph.graph.output]}")


if __name__ == "__main__":
	main()
