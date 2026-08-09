#!/usr/bin/env python3
"""Reproduce detector coverage and collector judgments from exported ZIPs."""

from __future__ import annotations

import argparse
import importlib.util
import json
import statistics
import zipfile
from collections import defaultdict
from pathlib import Path


EXTRACTOR_PATH = Path(__file__).with_name("extract_collector.py")
SPEC = importlib.util.spec_from_file_location("extract_collector", EXTRACTOR_PATH)
EXTRACTOR = importlib.util.module_from_spec(SPEC)
assert SPEC.loader is not None
SPEC.loader.exec_module(EXTRACTOR)


def pct(numerator: int, denominator: int) -> float:
	return round(100 * numerator / denominator, 1) if denominator else 0.0


def summarize_task(frames: list[dict], persistence_ms: int) -> dict:
	frames = sorted(frames, key=lambda frame: frame["t"])
	last_positive = None
	raw = 0
	smoothed = 0
	scores = []
	for frame in frames:
		if frame.get("det"):
			raw += 1
			last_positive = frame["t"]
			scores.append(float(frame["det"][3]))
		if last_positive is not None and frame["t"] - last_positive <= persistence_ms:
			smoothed += 1
	return {
		"frames": len(frames),
		"raw_detection_pct": pct(raw, len(frames)),
		"smoothed_detection_pct": pct(smoothed, len(frames)),
		"score_median": round(statistics.median(scores), 3) if scores else None,
		"score_min": round(min(scores), 3) if scores else None,
		"score_max": round(max(scores), 3) if scores else None,
	}


def evaluate(archives: list[Path], persistence_ms: int) -> dict:
	sessions = EXTRACTOR.inventory(archives)
	results = []
	for sid, parts in sorted(sessions.items()):
		archive, member = parts["json"]
		with zipfile.ZipFile(archive) as bundle, bundle.open(member) as source:
			payload = json.load(source)
		tasks = {task["id"] for task in payload["metadata"]["protocol"]}
		grouped = defaultdict(list)
		for frame in payload["signals"]["frames"]:
			if frame.get("label") in tasks:
				grouped[frame["label"]].append(frame)
		judge = {
			item["taskId"]: {
				"expected": item.get("expected"),
				"predicted": item.get("predicted"),
				"match": item.get("match"),
			}
			for item in payload["metadata"].get("silentJudge", [])
		}
		results.append(
			{
				"session": sid,
				"tasks": {
					task: {
						**summarize_task(grouped[task], persistence_ms),
						"collector_judge": judge.get(task),
					}
					for task in sorted(tasks)
				},
			}
		)

	pooled = {}
	for task in sorted(results[0]["tasks"]):
		rows = [session["tasks"][task] for session in results]
		total = sum(row["frames"] for row in rows)
		pooled[task] = {
			"frames": total,
			"raw_detection_pct": round(
				sum(row["raw_detection_pct"] * row["frames"] for row in rows) / total,
				1,
			),
			"smoothed_detection_pct": round(
				sum(row["smoothed_detection_pct"] * row["frames"] for row in rows) / total,
				1,
			),
			"judge_matches": sum(
				1 for row in rows if row["collector_judge"] and row["collector_judge"]["match"] is True
			),
			"judge_total": sum(
				1 for row in rows if row["collector_judge"] and row["collector_judge"]["match"] is not None
			),
		}
	return {
		"schema": 1,
		"persistence_ms": persistence_ms,
		"session_count": len(results),
		"pooled": pooled,
		"sessions": results,
	}


def main() -> None:
	parser = argparse.ArgumentParser()
	parser.add_argument("archives", nargs="+", type=Path)
	parser.add_argument("--persistence-ms", type=int, default=1200)
	parser.add_argument("--output", type=Path)
	args = parser.parse_args()
	report = evaluate(args.archives, args.persistence_ms)
	text = json.dumps(report, ensure_ascii=False, indent=2)
	if args.output:
		args.output.parent.mkdir(parents=True, exist_ok=True)
		args.output.write_text(text + "\n", encoding="utf-8")
	else:
		print(text)


if __name__ == "__main__":
	main()
