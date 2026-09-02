#!/usr/bin/env bash
set -euo pipefail

WORKSPACE=/mnt/shared/inhaler-coach
MODEL_CACHE=/mnt/model-cache/inhaler-coach
GPU_LOCK=/mnt/shared/.a100-training.lock
SOURCE_COMMIT=${1:?usage: run_audio_a100.sh SOURCE_COMMIT RUN_ID}
RUN_ID=${2:?usage: run_audio_a100.sh SOURCE_COMMIT RUN_ID}
RUN_DIR="$WORKSPACE/runs/$RUN_ID"
TRAIN_LOG="$WORKSPACE/logs/$RUN_ID.log"
GPU_LOG="$WORKSPACE/logs/$RUN_ID-gpu.csv"
PROCESS_LOG="$WORKSPACE/logs/$RUN_ID-processes.csv"
STATUS_FILE="$WORKSPACE/logs/$RUN_ID.status"

if [[ -e "$RUN_DIR" || -e "$TRAIN_LOG" ]]; then
  echo "run already exists: $RUN_ID" >&2
  exit 72
fi

exec 9>"$GPU_LOCK"
if ! flock -n 9; then
  echo "A100 lock is already held" >&2
  exit 73
fi
if nvidia-smi --query-compute-apps=pid --format=csv,noheader | grep -q .; then
  echo "A100 already has a compute process" >&2
  exit 75
fi

install -d -m 700 "$RUN_DIR" "$MODEL_CACHE/torch"
export TMPDIR="$WORKSPACE/cache/tmp"
export XDG_CACHE_HOME="$WORKSPACE/cache"
export TORCH_HOME="$MODEL_CACHE/torch"
export PYTHONUNBUFFERED=1

{
  echo "run_id=$RUN_ID"
  echo "source_commit=$SOURCE_COMMIT"
  echo "workspace=$WORKSPACE"
  echo "started_at=$(date --iso-8601=seconds)"
  "$WORKSPACE/.venv/bin/python" -V
  "$WORKSPACE/.venv/bin/python" -c \
    'import numpy, torch; print(f"numpy={numpy.__version__} torch={torch.__version__} cuda={torch.version.cuda}")'
  nvidia-smi --query-gpu=index,name,driver_version,memory.total \
    --format=csv,noheader
} >"$TRAIN_LOG"
: >"$GPU_LOG"
: >"$PROCESS_LOG"

"$WORKSPACE/.venv/bin/python" -u "$WORKSPACE/code/train_audio_dscnn.py" \
  --window-cache "$WORKSPACE/cache/1150806-audio-windows.npz" \
  --output-dir "$RUN_DIR" \
  --epochs 100 \
  --batch-size 128 \
  --memory-fraction 0.60 \
  --source-commit "$SOURCE_COMMIT" >>"$TRAIN_LOG" 2>&1 &
TRAIN_PID=$!
echo "training_pid=$TRAIN_PID" >>"$TRAIN_LOG"

while kill -0 "$TRAIN_PID" 2>/dev/null; do
  nvidia-smi --query-gpu=timestamp,utilization.gpu,memory.used,temperature.gpu \
    --format=csv,noheader >>"$GPU_LOG"
  nvidia-smi --query-compute-apps=pid,process_name,used_memory \
    --format=csv,noheader >>"$PROCESS_LOG" || true
  sleep 2
done

set +e
wait "$TRAIN_PID"
STATUS=$?
set -e
{
  echo "exit_code=$STATUS"
  echo "finished_at=$(date --iso-8601=seconds)"
} >"$STATUS_FILE"
exit "$STATUS"
