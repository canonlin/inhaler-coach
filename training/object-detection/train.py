from ultralytics import YOLO
m = YOLO("yolo11n.pt")
m.train(data="/home/gloomcheng/inhaler-detector/dataset/data.yaml",
        epochs=100, imgsz=640, batch=32, device=0, patience=25,
        project="/home/gloomcheng/inhaler-detector/runs", name="inhaler", exist_ok=True)
print("TRAIN_DONE")
