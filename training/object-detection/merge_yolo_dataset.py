#!/usr/bin/env python3
"""Merge the original YOLO corpus with a new whole-person holdout dataset."""

from __future__ import annotations

import argparse
import shutil
from pathlib import Path


def copy_split(source: Path, source_split: str, target: Path, target_split: str) -> int:
	count = 0
	for image in (source / "images" / source_split).glob("*"):
		stem = image.stem
		label = source / "labels" / source_split / f"{stem}.txt"
		if not label.exists():
			raise FileNotFoundError(label)
		destination = target / "images" / target_split / image.name
		if destination.exists():
			raise FileExistsError(f"dataset filename collision: {image.name}")
		shutil.copy2(image, destination)
		shutil.copy2(label, target / "labels" / target_split / label.name)
		count += 1
	return count


def main() -> None:
	parser = argparse.ArgumentParser()
	parser.add_argument("--base", required=True, type=Path)
	parser.add_argument("--new", required=True, type=Path)
	parser.add_argument("--output", required=True, type=Path)
	args = parser.parse_args()

	if args.output.exists():
		shutil.rmtree(args.output)
	for split in ("train", "val"):
		(args.output / "images" / split).mkdir(parents=True)
		(args.output / "labels" / split).mkdir(parents=True)

	counts = {
		"base_train": copy_split(args.base, "train", args.output, "train"),
		"base_val_to_train": copy_split(args.base, "val", args.output, "train"),
		"new_train": copy_split(args.new, "train", args.output, "train"),
		"new_val": copy_split(args.new, "val", args.output, "val"),
	}
	(args.output / "data.yaml").write_text(
		f"path: {args.output.resolve()}\ntrain: images/train\nval: images/val\nnames:\n  0: inhaler\n"
	)
	print(counts)


if __name__ == "__main__":
	main()
