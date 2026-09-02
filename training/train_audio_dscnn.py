#!/usr/bin/env python3
"""Train and evaluate a compact exhale-audio model on collector sessions.

The unit of separation is always a session/person.  Every reported score comes
from leave-one-session-out evaluation; neighbouring windows from one recording
never cross the train/test boundary.  After evaluation, one research candidate
is trained on all supplied sessions.  It is not promoted into the browser by
this script.

Only NumPy, PyTorch, and the FFmpeg executable are required.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import math
import os
import random
import subprocess
import time
from dataclasses import asdict, dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Iterable

import numpy as np
import torch
from torch import nn
from torch.utils.data import DataLoader, Dataset


SAMPLE_RATE = 16_000
WINDOW_MS = 1_000
STEP_MS = 250
EDGE_TRIM_MS = 500
POSITIVE_LABELS = {"exhale"}
NEGATIVE_LABELS = {
    "still",
    "move",
    "handle",
    "speak",
    "shake_normal",
    "shake_hard",
    "shake_gentle",
    "shake_limited",
    "press_mouth_steady",
    "press_air_steady",
    "spray_x2",
}


@dataclass(frozen=True)
class Config:
    sample_rate: int = SAMPLE_RATE
    window_ms: int = WINDOW_MS
    step_ms: int = STEP_MS
    edge_trim_ms: int = EDGE_TRIM_MS
    epochs: int = 100
    batch_size: int = 128
    learning_rate: float = 1e-3
    weight_decay: float = 1e-4
    seeds: tuple[int, ...] = (42, 31415, 271828)
    memory_fraction: float = 0.60
    gate_sensitivity: float = 0.80
    gate_specificity: float = 0.80
    gate_auc: float = 0.85


@dataclass
class SessionWindows:
    session_id: str
    waveforms: np.ndarray
    labels: np.ndarray
    task_labels: list[str]
    source_json: str
    source_media: str


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for block in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def git_commit() -> str:
    try:
        return subprocess.run(
            ["git", "rev-parse", "HEAD"],
            check=True,
            capture_output=True,
            text=True,
        ).stdout.strip()
    except (OSError, subprocess.CalledProcessError):
        return "unknown"


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


def labelled_segments(samples: list[dict]) -> list[tuple[str, int, int]]:
    """Recover task intervals from sparse collector audio samples.

    Some 1150806 browsers sampled audio features at roughly 2.5 Hz instead of
    the intended 100 Hz.  The raw Opus audio is continuous, so labels remain
    useful as interval markers.  The gap tolerance is derived from the session
    cadence and capped so separate task attempts cannot be merged.
    """
    allowed = POSITIVE_LABELS | NEGATIVE_LABELS
    kept = [
        item
        for item in samples
        if item.get("label") in allowed
        and isinstance(item.get("t"), (int, float))
    ]
    kept.sort(key=lambda item: float(item["t"]))
    if not kept:
        return []

    same_label_gaps = [
        float(current["t"]) - float(previous["t"])
        for previous, current in zip(kept, kept[1:])
        if current["label"] == previous["label"]
        and 0 < float(current["t"]) - float(previous["t"]) < 2_000
    ]
    cadence = float(np.median(same_label_gaps)) if same_label_gaps else 250.0
    tolerance = int(min(1_500, max(750, cadence * 3.0)))
    tail = int(min(1_000, max(100, cadence)))

    segments: list[tuple[str, int, int]] = []
    label = str(kept[0]["label"])
    start = int(float(kept[0]["t"]))
    previous = start
    for item in kept[1:]:
        timestamp = int(float(item["t"]))
        if item["label"] != label or timestamp - previous > tolerance:
            segments.append((label, start, previous + tail))
            label = str(item["label"])
            start = timestamp
        previous = timestamp
    segments.append((label, start, previous + tail))
    return segments


def load_session(json_path: Path, media_path: Path) -> SessionWindows:
    payload = json.loads(json_path.read_text(encoding="utf-8"))
    session_id = str(payload.get("metadata", {}).get("sessionId", json_path.stem))
    audio = decode_audio(media_path)
    waveforms: list[np.ndarray] = []
    labels: list[int] = []
    task_labels: list[str] = []
    window_samples = round(WINDOW_MS * SAMPLE_RATE / 1000)

    for label, start_ms, end_ms in labelled_segments(payload["signals"]["audio"]):
        first = start_ms + EDGE_TRIM_MS
        last = end_ms - EDGE_TRIM_MS
        for window_start in range(first, last - WINDOW_MS + 1, STEP_MS):
            start = round(window_start * SAMPLE_RATE / 1000)
            end = start + window_samples
            if start < 0 or end > len(audio):
                continue
            waveforms.append(np.array(audio[start:end], copy=True))
            labels.append(1 if label in POSITIVE_LABELS else 0)
            task_labels.append(label)

    if not waveforms or 1 not in labels or 0 not in labels:
        raise RuntimeError(f"session lacks usable positive/negative windows: {json_path}")
    return SessionWindows(
        session_id=session_id,
        waveforms=np.stack(waveforms).astype(np.float32),
        labels=np.asarray(labels, dtype=np.float32),
        task_labels=task_labels,
        source_json=str(json_path),
        source_media=str(media_path),
    )


def save_window_cache(
    path: Path,
    sessions: list[SessionWindows],
    dataset_receipt: list[dict],
) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    arrays: dict[str, np.ndarray] = {}
    session_metadata = []
    for index, session in enumerate(sessions):
        arrays[f"waveforms_{index}"] = session.waveforms
        arrays[f"labels_{index}"] = session.labels
        arrays[f"task_labels_{index}"] = np.asarray(session.task_labels, dtype=np.str_)
        session_metadata.append({
            "sessionId": session.session_id,
            "sourceJson": session.source_json,
            "sourceMedia": session.source_media,
        })
    arrays["metadata"] = np.asarray(json.dumps({
        "schemaVersion": 1,
        "sessions": session_metadata,
        "dataset": dataset_receipt,
    }, ensure_ascii=False))
    np.savez(path, **arrays)


def load_window_cache(path: Path) -> tuple[list[SessionWindows], list[dict]]:
    with np.load(path, allow_pickle=False) as payload:
        metadata = json.loads(str(payload["metadata"]))
        sessions = [
            SessionWindows(
                session_id=item["sessionId"],
                waveforms=np.array(payload[f"waveforms_{index}"], copy=True),
                labels=np.array(payload[f"labels_{index}"], copy=True),
                task_labels=payload[f"task_labels_{index}"].astype(str).tolist(),
                source_json=item["sourceJson"],
                source_media=item["sourceMedia"],
            )
            for index, item in enumerate(metadata["sessions"])
        ]
    return sessions, metadata["dataset"]


class WaveDataset(Dataset):
    def __init__(self, waveforms: np.ndarray, labels: np.ndarray, augment: bool):
        self.waveforms = torch.from_numpy(waveforms)
        self.labels = torch.from_numpy(labels)
        self.augment = augment

    def __len__(self) -> int:
        return len(self.labels)

    def __getitem__(self, index: int) -> tuple[torch.Tensor, torch.Tensor]:
        wave = self.waveforms[index].clone()
        if self.augment:
            shift = random.randint(-1_600, 1_600)
            wave = torch.roll(wave, shift)
            rms = wave.square().mean().sqrt().clamp_min(1e-5)
            snr_db = random.uniform(12.0, 30.0)
            noise_rms = rms / (10.0 ** (snr_db / 20.0))
            wave = wave + torch.randn_like(wave) * noise_rms
        return wave, self.labels[index]


def hz_to_mel(hz: np.ndarray | float) -> np.ndarray:
    return 2595.0 * np.log10(1.0 + np.asarray(hz) / 700.0)


def mel_to_hz(mel: np.ndarray | float) -> np.ndarray:
    return 700.0 * (10.0 ** (np.asarray(mel) / 2595.0) - 1.0)


def mel_filterbank(n_fft: int = 512, bands: int = 40) -> torch.Tensor:
    frequencies = mel_to_hz(
        np.linspace(hz_to_mel(80.0), hz_to_mel(7_600.0), bands + 2)
    )
    bins = np.floor((n_fft + 1) * frequencies / SAMPLE_RATE).astype(int)
    bins = np.clip(bins, 0, n_fft // 2)
    filters = np.zeros((bands, n_fft // 2 + 1), dtype=np.float32)
    for band in range(bands):
        left, center, right = bins[band : band + 3]
        center = max(center, left + 1)
        right = min(n_fft // 2, max(right, center + 1))
        for index in range(left, min(center, filters.shape[1])):
            filters[band, index] = (index - left) / max(1, center - left)
        for index in range(center, min(right + 1, filters.shape[1])):
            filters[band, index] = (right - index) / max(1, right - center)
    return torch.from_numpy(filters)


class LogMelFrontend(nn.Module):
    def __init__(self):
        super().__init__()
        self.register_buffer("window", torch.hann_window(400), persistent=True)
        self.register_buffer("mel_filters", mel_filterbank(), persistent=True)

    def forward(self, wave: torch.Tensor) -> torch.Tensor:
        wave = wave - wave.mean(dim=1, keepdim=True)
        spectrum = torch.stft(
            wave,
            n_fft=512,
            hop_length=160,
            win_length=400,
            window=self.window,
            center=True,
            return_complex=True,
        )
        power = spectrum.abs().square()
        mel = torch.einsum("mf,bft->bmt", self.mel_filters, power).clamp_min(1e-8)
        log_mel = mel.log()
        mean = log_mel.mean(dim=(1, 2), keepdim=True)
        std = log_mel.std(dim=(1, 2), keepdim=True).clamp_min(1e-5)
        return ((log_mel - mean) / std).unsqueeze(1)


class DepthwiseBlock(nn.Module):
    def __init__(self, in_channels: int, out_channels: int, stride: int = 1):
        super().__init__()
        self.layers = nn.Sequential(
            nn.Conv2d(
                in_channels,
                in_channels,
                kernel_size=3,
                stride=stride,
                padding=1,
                groups=in_channels,
                bias=False,
            ),
            nn.BatchNorm2d(in_channels),
            nn.SiLU(),
            nn.Conv2d(in_channels, out_channels, kernel_size=1, bias=False),
            nn.BatchNorm2d(out_channels),
            nn.SiLU(),
        )

    def forward(self, features: torch.Tensor) -> torch.Tensor:
        return self.layers(features)


class ExhaleDSCNN(nn.Module):
    def __init__(self):
        super().__init__()
        self.frontend = LogMelFrontend()
        self.encoder = nn.Sequential(
            nn.Conv2d(1, 24, kernel_size=3, stride=2, padding=1, bias=False),
            nn.BatchNorm2d(24),
            nn.SiLU(),
            DepthwiseBlock(24, 40, stride=2),
            DepthwiseBlock(40, 64, stride=2),
            DepthwiseBlock(64, 96, stride=2),
            DepthwiseBlock(96, 96, stride=1),
            nn.AdaptiveAvgPool2d(1),
            nn.Flatten(),
            nn.Dropout(0.20),
            nn.Linear(96, 1),
        )

    def forward(self, wave: torch.Tensor) -> torch.Tensor:
        return self.encoder(self.frontend(wave)).squeeze(1)


def set_seed(seed: int) -> None:
    random.seed(seed)
    np.random.seed(seed)
    torch.manual_seed(seed)
    torch.cuda.manual_seed_all(seed)
    torch.backends.cudnn.benchmark = False
    torch.backends.cudnn.deterministic = True


def concatenate(sessions: Iterable[SessionWindows]) -> tuple[np.ndarray, np.ndarray]:
    items = list(sessions)
    return (
        np.concatenate([item.waveforms for item in items]),
        np.concatenate([item.labels for item in items]),
    )


def fit_model(
    waveforms: np.ndarray,
    labels: np.ndarray,
    config: Config,
    seed: int,
    device: torch.device,
) -> tuple[ExhaleDSCNN, list[float]]:
    set_seed(seed)
    model = ExhaleDSCNN().to(device)
    dataset = WaveDataset(waveforms, labels, augment=True)
    generator = torch.Generator().manual_seed(seed)
    loader = DataLoader(
        dataset,
        batch_size=config.batch_size,
        shuffle=True,
        generator=generator,
        num_workers=0,
        pin_memory=True,
    )
    positive = max(1.0, float(labels.sum()))
    negative = max(1.0, float(len(labels) - labels.sum()))
    criterion = nn.BCEWithLogitsLoss(
        pos_weight=torch.tensor([negative / positive], device=device)
    )
    optimizer = torch.optim.AdamW(
        model.parameters(),
        lr=config.learning_rate,
        weight_decay=config.weight_decay,
    )
    scheduler = torch.optim.lr_scheduler.CosineAnnealingLR(
        optimizer, T_max=config.epochs
    )
    losses: list[float] = []
    model.train()
    for _epoch in range(config.epochs):
        running = 0.0
        seen = 0
        for batch_wave, batch_labels in loader:
            batch_wave = batch_wave.to(device, non_blocking=True)
            batch_labels = batch_labels.to(device, non_blocking=True)
            optimizer.zero_grad(set_to_none=True)
            logits = model(batch_wave)
            loss = criterion(logits, batch_labels)
            loss.backward()
            optimizer.step()
            running += float(loss.detach()) * len(batch_labels)
            seen += len(batch_labels)
        scheduler.step()
        losses.append(running / max(1, seen))
    return model, losses


@torch.inference_mode()
def predict(
    model: ExhaleDSCNN,
    waveforms: np.ndarray,
    labels: np.ndarray,
    batch_size: int,
    device: torch.device,
) -> tuple[np.ndarray, np.ndarray]:
    loader = DataLoader(
        WaveDataset(waveforms, labels, augment=False),
        batch_size=batch_size,
        shuffle=False,
        num_workers=0,
        pin_memory=True,
    )
    model.eval()
    scores: list[np.ndarray] = []
    truths: list[np.ndarray] = []
    for batch_wave, batch_labels in loader:
        logits = model(batch_wave.to(device, non_blocking=True))
        scores.append(torch.sigmoid(logits).cpu().numpy())
        truths.append(batch_labels.numpy())
    return np.concatenate(truths), np.concatenate(scores)


def auc_score(labels: np.ndarray, scores: np.ndarray) -> float:
    positive = scores[labels == 1]
    negative = scores[labels == 0]
    if not len(positive) or not len(negative):
        return float("nan")
    comparisons = positive[:, None] - negative[None, :]
    return float(np.mean(comparisons > 0) + 0.5 * np.mean(comparisons == 0))


def metrics(labels: np.ndarray, scores: np.ndarray) -> dict[str, float | int]:
    labels = labels.astype(bool)
    predicted = scores >= 0.5
    positive = labels
    negative = ~labels
    sensitivity = float(np.mean(predicted[positive]))
    specificity = float(np.mean(~predicted[negative]))
    return {
        "windows": int(len(labels)),
        "positive": int(positive.sum()),
        "negative": int(negative.sum()),
        "accuracy": float(np.mean(predicted == labels)),
        "balancedAccuracy": (sensitivity + specificity) / 2.0,
        "sensitivity": sensitivity,
        "specificity": specificity,
        "auc": auc_score(labels.astype(np.int8), scores),
    }


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--pair",
        nargs=2,
        action="append",
        metavar=("SIGNALS_JSON", "MEDIA_FILE"),
    )
    parser.add_argument("--output-dir", type=Path, required=True)
    parser.add_argument("--window-cache", type=Path)
    parser.add_argument("--prepare-only", action="store_true")
    parser.add_argument("--epochs", type=int, default=Config.epochs)
    parser.add_argument("--batch-size", type=int, default=Config.batch_size)
    parser.add_argument("--memory-fraction", type=float, default=Config.memory_fraction)
    parser.add_argument("--source-commit")
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    config = Config(
        epochs=args.epochs,
        batch_size=args.batch_size,
        memory_fraction=args.memory_fraction,
    )
    source_commit = args.source_commit or git_commit()
    if not 0 < config.memory_fraction <= 1:
        raise SystemExit("memory fraction must be within (0, 1]")
    args.output_dir.mkdir(parents=True, exist_ok=True)

    started = time.monotonic()
    if args.window_cache and args.window_cache.exists():
        sessions, dataset_receipt = load_window_cache(args.window_cache)
    else:
        if not args.pair:
            raise SystemExit("--pair is required when no prepared --window-cache exists")
        pair_paths = [
            (Path(json_path), Path(media_path))
            for json_path, media_path in args.pair
        ]
        dataset_receipt = [
            {
                "json": str(json_path),
                "jsonSha256": sha256_file(json_path),
                "media": str(media_path),
                "mediaSha256": sha256_file(media_path),
            }
            for json_path, media_path in pair_paths
        ]
        sessions = [
            load_session(json_path, media_path)
            for json_path, media_path in pair_paths
        ]
        if args.window_cache:
            save_window_cache(args.window_cache, sessions, dataset_receipt)
    if len(sessions) < 3:
        raise SystemExit("at least three independent sessions are required")
    if args.prepare_only:
        if not args.window_cache:
            raise SystemExit("--prepare-only requires --window-cache")
        print(json.dumps({
            "windowCache": str(args.window_cache),
            "bytes": args.window_cache.stat().st_size,
            "sha256": sha256_file(args.window_cache),
            "sessions": [
                {
                    "id": item.session_id,
                    "windows": int(len(item.labels)),
                    "positive": int(item.labels.sum()),
                    "negative": int(len(item.labels) - item.labels.sum()),
                }
                for item in sessions
            ],
        }, ensure_ascii=False, indent=2))
        return

    if not torch.cuda.is_available():
        raise SystemExit("CUDA is required for this training run")
    torch.cuda.set_per_process_memory_fraction(config.memory_fraction, 0)
    device = torch.device("cuda:0")

    folds: list[dict] = []
    for seed in config.seeds:
        for held_out in sessions:
            training = [item for item in sessions if item.session_id != held_out.session_id]
            train_wave, train_labels = concatenate(training)
            model, losses = fit_model(train_wave, train_labels, config, seed, device)
            truth, scores = predict(
                model,
                held_out.waveforms,
                held_out.labels,
                config.batch_size,
                device,
            )
            result = {
                "seed": seed,
                "heldOut": held_out.session_id,
                "trainSessions": [item.session_id for item in training],
                "finalTrainLoss": losses[-1],
                **metrics(truth, scores),
            }
            folds.append(result)
            print(json.dumps(result, ensure_ascii=False), flush=True)

    fold_gate = [
        fold["sensitivity"] >= config.gate_sensitivity
        and fold["specificity"] >= config.gate_specificity
        and fold["auc"] >= config.gate_auc
        for fold in folds
    ]
    summary = {
        key: {
            "mean": float(np.mean([float(fold[key]) for fold in folds])),
            "min": float(np.min([float(fold[key]) for fold in folds])),
            "max": float(np.max([float(fold[key]) for fold in folds])),
        }
        for key in ("accuracy", "balancedAccuracy", "sensitivity", "specificity", "auc")
    }

    all_wave, all_labels = concatenate(sessions)
    final_model, final_losses = fit_model(
        all_wave, all_labels, config, config.seeds[0], device
    )
    checkpoint_path = args.output_dir / "exhale-dscnn-research-candidate.pt"
    torch.save(
        {
            "modelClass": "ExhaleDSCNN",
            "stateDict": final_model.state_dict(),
            "config": asdict(config),
            "sessions": [item.session_id for item in sessions],
            "sourceCommit": source_commit,
            "labelMap": {"negative": 0, "exhale": 1},
            "finalTrainLoss": final_losses[-1],
        },
        checkpoint_path,
    )
    torch.cuda.synchronize()
    checkpoint_hash = sha256_file(checkpoint_path)
    gpu_properties = torch.cuda.get_device_properties(0)
    max_allocated = int(torch.cuda.max_memory_allocated(0))
    report = {
        "schemaVersion": 1,
        "status": "research-candidate" if all(fold_gate) else "rejected-by-loso-gate",
        "claimBoundary": (
            "Training completion does not prove lung emptying or authorize browser promotion."
        ),
        "createdAt": datetime.now(timezone.utc).isoformat(),
        "sourceCommit": source_commit,
        "dataset": dataset_receipt,
        "sessions": [
            {
                "id": item.session_id,
                "windows": int(len(item.labels)),
                "positive": int(item.labels.sum()),
                "negative": int(len(item.labels) - item.labels.sum()),
                "taskCounts": {
                    label: item.task_labels.count(label)
                    for label in sorted(set(item.task_labels))
                },
            }
            for item in sessions
        ],
        "config": asdict(config),
        "evaluation": {
            "method": "leave-one-session-out; fixed threshold 0.5; three fixed seeds",
            "folds": folds,
            "summary": summary,
            "gate": {
                "requiredEveryFold": {
                    "sensitivity": config.gate_sensitivity,
                    "specificity": config.gate_specificity,
                    "auc": config.gate_auc,
                },
                "passedFolds": int(sum(fold_gate)),
                "totalFolds": len(fold_gate),
                "passed": bool(all(fold_gate)),
            },
        },
        "artifact": {
            "path": str(checkpoint_path),
            "sha256": checkpoint_hash,
            "bytes": checkpoint_path.stat().st_size,
        },
        "environment": {
            "python": os.sys.version,
            "numpy": np.__version__,
            "torch": torch.__version__,
            "cuda": torch.version.cuda,
            "gpu": gpu_properties.name,
            "gpuTotalBytes": int(gpu_properties.total_memory),
            "memoryFractionLimit": config.memory_fraction,
            "maxAllocatedBytes": max_allocated,
        },
        "elapsedSeconds": time.monotonic() - started,
    }
    report_path = args.output_dir / "evaluation.json"
    report_path.write_text(
        json.dumps(report, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(json.dumps({
        "report": str(report_path),
        "status": report["status"],
        "checkpointSha256": checkpoint_hash,
        "maxAllocatedBytes": max_allocated,
    }, ensure_ascii=False), flush=True)


if __name__ == "__main__":
    main()
