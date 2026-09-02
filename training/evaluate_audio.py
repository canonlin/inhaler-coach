#!/usr/bin/env python3
"""Evaluate whether collector audio separates exhale from hard negatives.

This script consumes the paired files produced by the browser collector:

    --pair SESSION.json SESSION.webm

The JSON supplies 10 ms task labels; FFmpeg decodes the original Opus track.
One-second windows are represented by log-mel summary statistics and evaluated
with leave-one-session-out logistic regression. The split is deliberately by
person/session, never by neighbouring windows from the same recording.

Only NumPy and FFmpeg are required. No recordings or derived features leave the
machine, and no model is exported from fewer than three independent sessions.
"""

from __future__ import annotations

import argparse
import json
import math
import subprocess
from dataclasses import dataclass
from pathlib import Path

import numpy as np


SAMPLE_RATE = 16_000
WINDOW_MS = 1_000
STEP_MS = 250
LABEL_TOLERANCE_MS = 40
POSITIVE_LABELS = {"exhale"}
NEGATIVE_LABELS = {"speak", "still", "handle", "move"}


@dataclass
class Session:
	name: str
	features: np.ndarray
	labels: np.ndarray
	window_labels: list[str]


def decode_audio(path: Path) -> np.ndarray:
	command = [
		"ffmpeg",
		"-v",
		"error",
		"-i",
		str(path),
		"-map",
		"0:a:0",
		"-ac",
		"1",
		"-ar",
		str(SAMPLE_RATE),
		"-f",
		"s16le",
		"pipe:1",
	]
	result = subprocess.run(command, check=True, capture_output=True)
	return np.frombuffer(result.stdout, dtype="<i2").astype(np.float32) / 32768.0


def contiguous_segments(samples: list[dict]) -> list[tuple[str, int, int]]:
	kept = [
		item
		for item in samples
		if item.get("label") in POSITIVE_LABELS | NEGATIVE_LABELS
		and isinstance(item.get("t"), (int, float))
	]
	kept.sort(key=lambda item: item["t"])
	segments: list[tuple[str, int, int]] = []
	if not kept:
		return segments

	label = kept[0]["label"]
	start = int(kept[0]["t"])
	previous = start
	for item in kept[1:]:
		timestamp = int(item["t"])
		if item["label"] != label or timestamp - previous > LABEL_TOLERANCE_MS:
			segments.append((label, start, previous + 10))
			label = item["label"]
			start = timestamp
		previous = timestamp
	segments.append((label, start, previous + 10))
	return segments


def hz_to_mel(hz: np.ndarray | float) -> np.ndarray | float:
	return 2595.0 * np.log10(1.0 + np.asarray(hz) / 700.0)


def mel_to_hz(mel: np.ndarray | float) -> np.ndarray | float:
	return 700.0 * (10.0 ** (np.asarray(mel) / 2595.0) - 1.0)


def mel_filterbank(n_fft: int = 512, bands: int = 24) -> np.ndarray:
	low_mel = hz_to_mel(80.0)
	high_mel = hz_to_mel(7_600.0)
	frequencies = mel_to_hz(np.linspace(low_mel, high_mel, bands + 2))
	bins = np.floor((n_fft + 1) * frequencies / SAMPLE_RATE).astype(int)
	bins = np.clip(bins, 0, n_fft // 2)
	filters = np.zeros((bands, n_fft // 2 + 1), dtype=np.float32)
	for band in range(bands):
		left, center, right = bins[band : band + 3]
		if center <= left:
			center = left + 1
		if right <= center:
			right = center + 1
		right = min(right, n_fft // 2)
		for index in range(left, min(center, filters.shape[1])):
			filters[band, index] = (index - left) / max(1, center - left)
		for index in range(center, min(right + 1, filters.shape[1])):
			filters[band, index] = (right - index) / max(1, right - center)
	return filters


MEL_FILTERS = mel_filterbank()


def audio_features(window: np.ndarray) -> np.ndarray:
	window = np.asarray(window, dtype=np.float32)
	window = window - np.mean(window)
	if len(window) > 1:
		window = np.concatenate(([window[0]], window[1:] - 0.97 * window[:-1]))

	frame_length = 400
	hop = 160
	frame_count = 1 + max(0, (len(window) - frame_length) // hop)
	frames = np.stack(
		[window[index * hop : index * hop + frame_length] for index in range(frame_count)]
	)
	frames *= np.hanning(frame_length).astype(np.float32)
	spectrum = np.fft.rfft(frames, n=512, axis=1)
	power = (spectrum.real**2 + spectrum.imag**2).astype(np.float32)
	mel_power = np.maximum(power @ MEL_FILTERS.T, 1e-12)
	log_mel = np.log(mel_power)

	statistics = [
		log_mel.mean(axis=0),
		log_mel.std(axis=0),
		np.percentile(log_mel, 10, axis=0),
		np.percentile(log_mel, 50, axis=0),
		np.percentile(log_mel, 90, axis=0),
	]
	rms = math.sqrt(float(np.mean(window**2)) + 1e-12)
	zero_crossing = float(np.mean(np.signbit(window[1:]) != np.signbit(window[:-1])))
	peak = float(np.max(np.abs(window)))
	crest = peak / max(rms, 1e-8)
	return np.concatenate([*statistics, [math.log(rms + 1e-12), zero_crossing, crest]])


def load_session(json_path: Path, media_path: Path) -> Session:
	payload = json.loads(json_path.read_text())
	session_id = payload.get("metadata", {}).get("sessionId", json_path.stem)
	audio = decode_audio(media_path)
	features: list[np.ndarray] = []
	labels: list[int] = []
	window_labels: list[str] = []

	for label, start_ms, end_ms in contiguous_segments(payload["signals"]["audio"]):
		for window_start in range(start_ms, end_ms - WINDOW_MS + 1, STEP_MS):
			start = round(window_start * SAMPLE_RATE / 1000)
			end = start + round(WINDOW_MS * SAMPLE_RATE / 1000)
			if start < 0 or end > len(audio):
				continue
			features.append(audio_features(audio[start:end]))
			labels.append(1 if label in POSITIVE_LABELS else 0)
			window_labels.append(label)

	if not features:
		raise RuntimeError(f"no labelled audio windows found in {json_path}")
	return Session(
		name=str(session_id),
		features=np.asarray(features, dtype=np.float64),
		labels=np.asarray(labels, dtype=np.float64),
		window_labels=window_labels,
	)


def fit_logistic(features: np.ndarray, labels: np.ndarray) -> tuple[np.ndarray, float]:
	weights = np.zeros(features.shape[1], dtype=np.float64)
	bias = 0.0
	positive = max(1, int(labels.sum()))
	negative = max(1, len(labels) - positive)
	sample_weights = np.where(labels == 1, len(labels) / (2 * positive), len(labels) / (2 * negative))
	for _ in range(2_000):
		logits = np.clip(features @ weights + bias, -30, 30)
		probabilities = 1.0 / (1.0 + np.exp(-logits))
		error = (probabilities - labels) * sample_weights
		weights -= 0.05 * (features.T @ error / len(labels) + 1e-3 * weights)
		bias -= 0.05 * float(np.mean(error))
	return weights, bias


def auc_score(labels: np.ndarray, scores: np.ndarray) -> float:
	positive = scores[labels == 1]
	negative = scores[labels == 0]
	if not len(positive) or not len(negative):
		return float("nan")
	comparisons = positive[:, None] - negative[None, :]
	return float(np.mean(comparisons > 0) + 0.5 * np.mean(comparisons == 0))


def metrics(labels: np.ndarray, scores: np.ndarray) -> dict[str, float | int]:
	predicted = scores >= 0.5
	positive = labels == 1
	negative = ~positive
	return {
		"windows": int(len(labels)),
		"positive": int(positive.sum()),
		"negative": int(negative.sum()),
		"accuracy": float(np.mean(predicted == positive)),
		"sensitivity": float(np.mean(predicted[positive])) if positive.any() else float("nan"),
		"specificity": float(np.mean(~predicted[negative])) if negative.any() else float("nan"),
		"auc": auc_score(labels, scores),
	}


def evaluate(sessions: list[Session]) -> dict:
	folds = []
	for test_index, test in enumerate(sessions):
		train = [session for index, session in enumerate(sessions) if index != test_index]
		train_x = np.concatenate([session.features for session in train])
		train_y = np.concatenate([session.labels for session in train])
		mean = train_x.mean(axis=0)
		std = train_x.std(axis=0) + 1e-6
		weights, bias = fit_logistic((train_x - mean) / std, train_y)
		test_x = (test.features - mean) / std
		scores = 1.0 / (1.0 + np.exp(-np.clip(test_x @ weights + bias, -30, 30)))
		folds.append({"heldOut": test.name, **metrics(test.labels.astype(bool), scores)})
	return {
		"method": "leave-one-session-out log-mel logistic regression",
		"sampleRate": SAMPLE_RATE,
		"windowMs": WINDOW_MS,
		"stepMs": STEP_MS,
		"sessions": [
			{
				"id": session.name,
				"windows": len(session.labels),
				"positive": int(session.labels.sum()),
				"negative": int(len(session.labels) - session.labels.sum()),
				"labels": {
					label: session.window_labels.count(label)
					for label in sorted(set(session.window_labels))
				},
			}
			for session in sessions
		],
		"folds": folds,
	}


def parse_args() -> argparse.Namespace:
	parser = argparse.ArgumentParser()
	parser.add_argument(
		"--pair",
		nargs=2,
		action="append",
		metavar=("SIGNALS_JSON", "MEDIA_FILE"),
		required=True,
	)
	parser.add_argument("--json-out", type=Path)
	return parser.parse_args()


def main() -> None:
	args = parse_args()
	sessions = [load_session(Path(json_path), Path(media_path)) for json_path, media_path in args.pair]
	if len(sessions) < 2:
		raise SystemExit("at least two independent sessions are required for held-out evaluation")
	report = evaluate(sessions)
	text = json.dumps(report, indent=2, ensure_ascii=False)
	print(text)
	if args.json_out:
		args.json_out.write_text(text + "\n")


if __name__ == "__main__":
	main()
