import os
from ultralytics import YOLO

root = os.path.expanduser(os.environ.get("INHALER_ROOT", "~/inhaler-detector"))
seed = int(os.environ.get("INHALER_SEED", "42"))
epochs = int(os.environ.get("INHALER_EPOCHS", "100"))
batch = int(os.environ.get("INHALER_BATCH", "32"))
name = os.environ.get("INHALER_RUN_NAME", "inhaler")
weights = os.environ.get("INHALER_WEIGHTS", "yolo11n.pt")
m = YOLO(weights)
m.train(
	data=f"{root}/dataset/data.yaml",
	epochs=epochs,
	imgsz=640,
	batch=batch,
	device=0,
	patience=25,
	seed=seed,
	deterministic=True,
	project=f"{root}/runs",
	name=name,
	exist_ok=True,
)
print("TRAIN_DONE")
