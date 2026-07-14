# Dual Backend Detection System — Design Spec

## Problem

MediaPipe Tasks Vision requires WebGL for its WASM runtime's internal image preprocessing, even when using CPU delegate. The browser environment has no WebGL support (both WebGL 1 and 2 context creation fail), causing `activeTexture` errors and memory corruption during inference.

## Goal

Provide both MediaPipe (WebGL) and TensorFlow.js (WASM) backends with automatic fallback. Users should get real-time pose/face/hand detection regardless of WebGL availability.

## Constraints

- **500 line limit** per source file
- **Tailwind CSS only** — no custom CSS beyond `style.css`
- **Vite + Vanilla JS** — ES modules, no framework
- **Feature parity** — both backends must provide pose (33), face (468), and hand (21) landmarks
- **Same interface contract** — downstream code (feature extractors, overlay, step detectors) unchanged
- **CPU backend too slow** (~893ms/frame). WASM is the fallback (~98ms/frame).

## Architecture

### File Structure

```
src/detection/
  backends/
    detection-backend.js      ← Interface definition + DetectionResult type
    mediapipe-backend.js      ← MediaPipe Tasks Vision (WebGL)
    tfjs-backend.js           ← TF.js BlazePose + face + hand (WASM)
    normalize.js              ← Shared coordinate normalization utility
  detection-manager.js        ← Orchestrator: tries MediaPipe → falls back to TF.js
  pose-features.js            ← Unchanged
  face-features.js            ← Unchanged
  hand-features.js            ← Unchanged
```

### Interface Contract

Both backends implement:

```js
class DetectionBackend {
  async initialize(): Promise<void>
  processFrame(canvas, timestamp): DetectionResult
  destroy(): void
}
```

DetectionResult shape (identical for both backends):

```js
{
  pose:  [{ x, y, z }] | null,   // 33 normalized [0,1] landmarks
  face:  [{ x, y, z }] | null,   // 468 normalized [0,1] landmarks
  hands: [{ x, y, z }] | null,   // 21 normalized [0,1] landmarks
}
```

### DetectionManager

```js
class DetectionManager {
  async initialize() {
    try {
      this.backend = new MediaPipeBackend()
      await this.backend.initialize()
    } catch (e) {
      console.warn('MediaPipe failed, falling back to TF.js:', e)
      this.backend = new TFJSBackend()
      await this.backend.initialize()
    }
  }

  processFrame(canvas, timestamp) {
    return this.backend.processFrame(canvas, timestamp)
  }
}
```

### MediaPipe Backend

- Uses `@mediapipe/tasks-vision` with CPU delegate
- Loads PoseLandmarker, FaceLandmarker, HandLandmarker from CDN WASM
- Returns normalized `[0,1]` coordinates natively
- Fails if WebGL context creation fails (caught by DetectionManager)

### TF.js Backend

- Uses three separate packages:
  - `@tensorflow-models/pose-detection` → BlazePose (33 keypoints)
  - `@tensorflow-models/face-landmarks-detection` → MediaPipeFaceMesh (478 keypoints)
  - `@tensorflow-models/hand-pose-detection` → MediaPipeHands (21 keypoints)
- Requires `@tensorflow/tfjs-backend-wasm` for CPU fallback
- Returns pixel-space coordinates — normalized via `normalize.js`
- `@tensorflow-models/face-detection` required by face-landmarks-detection

### Normalization Layer

`normalize.js` provides:

```js
function normalizeKeypoints(keypoints, imageWidth, imageHeight) {
  return keypoints.map(kp => ({
    x: kp.x / imageWidth,
    y: kp.y / imageHeight,
    z: kp.z || 0,
  }))
}
```

### Initialization Sequence

1. `DetectionManager.initialize()` called from `initApp()`
2. Try `MediaPipeBackend.initialize()`:
   - Load WASM fileset from CDN
   - Create PoseLandmarker, FaceLandmarker, HandLandmarker
   - If any WebGL error → throw
3. On failure → try `TFJSBackend.initialize()`:
   - Set WASM backend: `tf.setBackend('wasm')`
   - Create BlazePose detector (runtime: 'tfjs', modelType: 'heavy')
   - Create MediaPipeFaceMesh detector (runtime: 'tfjs', maxFaces: 1)
   - Create MediaPipeHands detector (runtime: 'tfjs', maxHands: 1)
   - Load models in parallel
4. If both fail → throw (app cannot run)

### Frame Processing

1. `processFrame(canvas, timestamp)` delegates to active backend
2. Backend returns landmarks in pixel or normalized format
3. If TF.js backend: normalize coordinates via `normalizeKeypoints()`
4. Return standardized `{ pose, face, hands }` to caller

## Dependencies

### New (TF.js fallback)
- `@tensorflow/tfjs-core` ^4.22.0
- `@tensorflow/tfjs-converter` ^4.22.0
- `@tensorflow/tfjs-backend-wasm` ^4.22.0
- `@tensorflow-models/pose-detection` ^2.1.0
- `@tensorflow-models/face-landmarks-detection` ^1.0.6
- `@tensorflow-models/hand-pose-detection` ^2.0.1
- `@tensorflow-models/face-detection` ^1.0.3

### Existing (unchanged)
- `@mediapipe/tasks-vision` ^0.10.18
- `@tensorflow/tfjs` ^4.22.0

## Files Modified

| File | Change |
|------|--------|
| `src/detection/mediapipe-manager.js` | Rename to `backends/mediapipe-backend.js`, refactor to implement DetectionBackend interface |
| `src/core/app.js` | Replace `MediaPipeManager` with `DetectionManager`, async init with fallback UI |
| `package.json` | Add TF.js model packages and WASM backend |

## Files Created

| File | Purpose |
|------|---------|
| `src/detection/backends/detection-backend.js` | Interface + DetectionResult type |
| `src/detection/backends/tfjs-backend.js` | TF.js implementation |
| `src/detection/backends/normalize.js` | Coordinate normalization |
| `src/detection/detection-manager.js` | Orchestrator with auto-fallback |

## Files Unchanged

- `src/detection/pose-features.js` — consumes normalized landmarks (same format)
- `src/detection/face-features.js` — consumes normalized landmarks (same format)
- `src/detection/hand-features.js` — consumes normalized landmarks (same format)
- `src/ui/overlay.js` — consumes normalized landmarks (same format)
- All step detectors — consume extracted features (same format)

## Performance Expectations

| Backend | Inference Time | FPS |
|---------|---------------|-----|
| MediaPipe (WebGL) | ~20ms | ~50 FPS |
| TF.js WASM (BlazePose heavy) | ~98ms | ~10 FPS |
| TF.js WASM (Face Mesh) | ~50ms | ~20 FPS |
| TF.js WASM (Hand) | ~30ms | ~33 FPS |

Note: TF.js runs three models sequentially per frame. Total ~180ms/frame → ~5-6 FPS achievable with WASM backend.

## Risks

1. **WASM backend initialization** — may fail if WASM not supported in browser
2. **Model loading time** — TF.js models are 10-35MB each, may take several seconds to load
3. **Sequential model execution** — three TF.js models per frame may be too slow for real-time
4. **Face/hand detection quality** — TF.js MediaPipe wrappers may have different accuracy than native MediaPipe Tasks Vision
