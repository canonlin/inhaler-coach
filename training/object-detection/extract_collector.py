#!/usr/bin/env python3
"""Extract only protocol-labelled seconds from collector ZIP archives.

The recorder can remain open for 7--30 minutes while a pharmacist reads or
retries a task.  Sampling a whole WebM therefore contaminates the dataset with
unlabelled waiting frames.  This script pairs split ZIP members by session id,
decodes each video once at 1 fps, and copies only seconds whose JSON frame label
is an exact protocol task id.

Example:
  python3 extract_collector.py --output /tmp/collector-1150806 \
    ~/Downloads/1150806-*-001.zip ~/Downloads/1150806-*-002.zip
"""

from __future__ import annotations

import argparse
import csv
import json
import shutil
import subprocess
import tempfile
import zipfile
from collections import defaultdict
from pathlib import Path


def session_id(member: str) -> str:
	return Path(member).name.split("_", 1)[0]


def inventory(archives: list[Path]) -> dict[str, dict[str, tuple[Path, str]]]:
	sessions: dict[str, dict[str, tuple[Path, str]]] = defaultdict(dict)
	for archive in archives:
		with zipfile.ZipFile(archive) as bundle:
			for member in bundle.namelist():
				suffix = Path(member).suffix.lower()
				if suffix not in {".json", ".webm", ".mp4"}:
					continue
				sid = session_id(member)
				kind = "json" if suffix == ".json" else "video"
				if kind in sessions[sid]:
					raise ValueError(f"duplicate {kind} for session {sid}")
				sessions[sid][kind] = (archive, member)
	missing = {sid: sorted({"json", "video"} - set(parts)) for sid, parts in sessions.items() if len(parts) != 2}
	if missing:
		raise ValueError(f"unpaired collector members: {missing}")
	return dict(sessions)


def labelled_seconds(payload: dict) -> dict[int, tuple[str, int]]:
	tasks = {task["id"] for task in payload["metadata"]["protocol"]}
	by_second: dict[int, list[tuple[str, int]]] = defaultdict(list)
	for frame in payload["signals"]["frames"]:
		label = frame.get("label")
		if label in tasks:
			by_second[int(frame["t"]) // 1000].append((label, int(frame["t"])))

	selected: dict[int, tuple[str, int]] = {}
	for second, observations in by_second.items():
		# A boundary second can contain two task labels.  Keep the majority label;
		# ties are omitted rather than introducing a knowingly ambiguous frame.
		counts: dict[str, int] = defaultdict(int)
		for label, _ in observations:
			counts[label] += 1
		ordered = sorted(counts.items(), key=lambda item: item[1], reverse=True)
		if len(ordered) > 1 and ordered[0][1] == ordered[1][1]:
			continue
		label = ordered[0][0]
		times = sorted(t for candidate, t in observations if candidate == label)
		selected[second] = (label, times[len(times) // 2])
	return selected


def extract_member(archive: Path, member: str, destination: Path) -> None:
	with zipfile.ZipFile(archive) as bundle, bundle.open(member) as source, destination.open("wb") as target:
		shutil.copyfileobj(source, target, length=1024 * 1024)


def decode_one_fps(video: Path, output_pattern: Path) -> None:
	subprocess.run(
		[
			"ffmpeg",
			"-hide_banner",
			"-loglevel",
			"error",
			"-i",
			str(video),
			"-vf",
			"fps=1,scale=640:-2",
			"-q:v",
			"2",
			str(output_pattern),
		],
		check=True,
	)


def run(archives: list[Path], output: Path, reuse_frames: bool = False) -> int:
	sessions = inventory(archives)
	frames_dir = output / "frames"
	frames_dir.mkdir(parents=True, exist_ok=True)
	rows: list[dict[str, object]] = []

	with tempfile.TemporaryDirectory(prefix="inhaler-collector-") as raw_temp:
		temp_root = Path(raw_temp)
		for sid, parts in sorted(sessions.items()):
			json_archive, json_member = parts["json"]
			with zipfile.ZipFile(json_archive) as bundle, bundle.open(json_member) as source:
				payload = json.load(source)
			seconds = labelled_seconds(payload)
			frame_by_time = {int(frame["t"]): frame for frame in payload["signals"]["frames"]}

			video_archive, video_member = parts["video"]
			if not reuse_frames:
				video_path = temp_root / Path(video_member).name
				extract_member(video_archive, video_member, video_path)
				raw_dir = temp_root / sid
				raw_dir.mkdir()
				decode_one_fps(video_path, raw_dir / "%06d.jpg")

			for second, (task, timestamp_ms) in sorted(seconds.items()):
				# ffmpeg's first fps=1 output is the frame around t=0, numbered 1.
				filename = f"{sid}_{task}_{timestamp_ms:07d}.jpg"
				if reuse_frames:
					if not (frames_dir / filename).exists():
						raise FileNotFoundError(f"missing reusable frame {filename}")
				else:
					source_frame = raw_dir / f"{second + 1:06d}.jpg"
					if not source_frame.exists():
						continue
					shutil.copy2(source_frame, frames_dir / filename)
				logged = frame_by_time[timestamp_ms]
				detection = logged.get("det")
				colour_device = logged.get("dev")
				seed = detection or colour_device
				rows.append(
					{
						"file": filename,
						"session": sid,
						"task": task,
						"timestamp_ms": timestamp_ms,
						"source_archive": video_archive.name,
						"source_video": Path(video_member).name,
						"seed_source": "yolo" if detection else "colour" if colour_device else "",
						"seed_x": seed[1] if detection else seed[0] if seed else "",
						"seed_y": seed[2] if detection else seed[1] if seed else "",
						"seed_score": detection[3] if detection else "",
					}
				)
			if not reuse_frames:
				video_path.unlink()
				shutil.rmtree(raw_dir)

	with (output / "manifest.csv").open("w", newline="", encoding="utf-8") as target:
		writer = csv.DictWriter(target, fieldnames=list(rows[0]) if rows else ["file"])
		writer.writeheader()
		writer.writerows(rows)
	return len(rows)


def main() -> None:
	parser = argparse.ArgumentParser()
	parser.add_argument("archives", nargs="+", type=Path)
	parser.add_argument("--output", required=True, type=Path)
	parser.add_argument("--reuse-frames", action="store_true")
	args = parser.parse_args()
	count = run(args.archives, args.output, reuse_frames=args.reuse_frames)
	print(f"extracted {count} labelled frames to {args.output}")


if __name__ == "__main__":
	main()
