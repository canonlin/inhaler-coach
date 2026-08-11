# Dual Backend Detection System — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add TensorFlow.js WASM fallback backend alongside MediaPipe for pose/face/hand detection, with automatic fallback when WebGL is unavailable.

**Architecture:** Adapter pattern with DetectionManager orchestrator. Both backends implement DetectionBackend interface returning identical `{ pose, face, hands }` normalized landmark format. DetectionManager tries MediaPipe first, falls back to TF.js on failure.

**Tech Stack:** Vite, Vanilla JS, ES Modules, Tailwind CSS v4, @mediapipe/tasks-vision, @tensorflow/tfjs, @tensorflow-models/pose-detection, @tensorflow-models/face-landmarks-detection, @tensorflow-models/hand-pose-detection, @tensorflow/tfjs-backend-wasm

---

## Chunk 1: Foundation — Interface + Normalization + Manager

### Task 1: Install TF.js dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install TF.js model packages**

```bash
cd /Users/gloomcheng/Workspace/inhaler-coach
npm install @tensorflow/tfjs-core @tensorflow/tfjs-converter @tensorflow/tfjs-backend-wasm @tensorflow-models/pose-detection @tensorflow-models/face-landmarks-detection @tensorflow-models/hand-pose-detection @tensorflow-models/face-detection
```

- [ ] **Step 2: Verify installation**

```bash
cat package.json | grep -E "tensorflow|mediapipe"
```

Expected: All packages listed in dependencies.

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add TF.js model dependencies for WASM fallback"
```

---

### Task 2: Create DetectionBackend interface

**Files:**
- Create: `src/detection/backends/detection-backend.js`

- [ ] **Step 1: Create backends directory**

```bash
mkdir -p /Users/gloomcheng/Workspace/inhaler-coach/src/detection/backends
```

- [ ] **Step 2: Create interface definition**

```js
/**
 * @typedef {Object} DetectionResult
 * @property {Array<{x: number, y: number, z: number}> | null} pose - 33 normalized [0,1] landmarks
 * @property {Array<{x: number, y: number, z: number}> | null} face - 468 normalized [0,1] landmarks
 * @property {Array<{x: number, y: number, z: number}> | null} hands - 21 normalized [0,1] landmarks
 */

/**
 * @interface DetectionBackend
 */
export class DetectionBackend {
  /**
   * Initialize the backend (load models, create contexts)
   * @returns {Promise<void>}
   */
  async initialize() {
    throw new Error('initialize() must be implemented')
  }

  /**
   * Process a video frame and return landmarks
   * @param {HTMLCanvasElement} canvas - Input frame
   * @param {DOMHighResTimeStamp} timestamp - Frame timestamp
   * @returns {DetectionResult}
   */
  processFrame(canvas, timestamp) {
    throw new Error('processFrame() must be implemented')
  }

  /**
   * Clean up resources
   */
  destroy() {
    throw new Error('destroy() must be implemented')
  }
}
```

- [ ] **Step 3: Verify no lint errors**

```bash
npx biome check src/detection/backends/detection-backend.js
```

Expected: No errors.

- [ ] **Step 4: Commit**

```bash
git add src/detection/backends/detection-backend.js
git commit -m "feat: add DetectionBackend interface definition"
```

---

### Task 3: Create normalization utility

**Files:**
- Create: `src/detection/backends/normalize.js`

- [ ] **Step 1: Create normalize.js**

```js
/**
 * Convert pixel-space keypoints to normalized [0,1] coordinates
 * matching MediaPipe Tasks Vision output format.
 *
 * @param {Array<{x: number, y: number, z?: number, score?: number, name?: string}>} keypoints
 * @param {number} imageWidth - Width of the input image in pixels
 * @param {number} imageHeight - Height of the input image in pixels
 * @returns {Array<{x: number, y: number, z: number}>}
 */
export function normalizeKeypoints(keypoints, imageWidth, imageHeight) {
  if (!keypoints || keypoints.length === 0) return []
  return keypoints.map(kp => ({
    x: kp.x / imageWidth,
    y: kp.y / imageHeight,
    z: (kp.z || 0) / imageWidth, // z is in same scale as x, normalize by width
  }))
}

/**
 * Extract first result from TF.js detector output array
 * @param {Array} results - TF.js detector.estimatePoses/estimateFaces/estimateHands result
 * @returns {Object|null} - First result or null if empty
 */
export function extractFirstResult(results) {
  return results && results.length > 0 ? results[0] : null
}
```

- [ ] **Step 2: Verify no lint errors**

```bash
npx biome check src/detection/backends/normalize.js
```

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add src/detection/backends/normalize.js
git commit -m "feat: add coordinate normalization utility for TF.js backends"
```

---

### Task 4: Create DetectionManager orchestrator

**Files:**
- Create: `src/detection/detection-manager.js`

- [ ] **Step 1: Create detection-manager.js**

```js
import { DetectionBackend } from './backends/detection-backend.js'

/**
 * Orchestrates detection backend initialization with automatic fallback.
 * Tries MediaPipe (WebGL) first, falls back to TF.js (WASM) on failure.
 */
export class DetectionManager {
  constructor() {
    /** @type {DetectionBackend|null} */
    this.backend = null
    /** @type {'mediapipe'|'tfjs'|null} */
    this.activeBackend = null
    this.isInitialized = false
  }

  /**
   * Initialize detection with automatic fallback
   * @param {Object} options
   * @param {string} options.mediapipeWasmUrl - CDN URL for MediaPipe WASM
   * @param {string} options.mediapipeModelBaseUrl - CDN URL for MediaPipe models
   */
  async initialize(options = {}) {
    // Try MediaPipe first
    try {
      const { MediaPipeBackend } = await import('./backends/mediapipe-backend.js')
      const backend = new MediaPipeBackend()
      await backend.initialize(options)
      this.backend = backend
      this.activeBackend = 'mediapipe'
      this.isInitialized = true
      console.log('Detection: MediaPipe backend initialized (WebGL)')
      return
    } catch (e) {
      console.warn('MediaPipe initialization failed, trying TF.js:', e.message)
    }

    // Fallback to TF.js
    try {
      const { TFJSBackend } = await import('./backends/tfjs-backend.js')
      const backend = new TFJSBackend()
      await backend.initialize(options)
      this.backend = backend
      this.activeBackend = 'tfjs'
      this.isInitialized = true
      console.log('Detection: TF.js backend initialized (WASM)')
      return
    } catch (e) {
      console.error('TF.js initialization also failed:', e.message)
      throw new Error('No detection backend available: ' + e.message)
    }
  }

  /**
   * Process a video frame
   * @param {HTMLCanvasElement} canvas
   * @param {DOMHighResTimeStamp} timestamp
   * @returns {import('./backends/detection-backend.js').DetectionResult}
   */
  processFrame(canvas, timestamp) {
    if (!this.isInitialized || !this.backend) {
      return { pose: null, face: null, hands: null }
    }
    return this.backend.processFrame(canvas, timestamp)
  }

  /**
   * Get the name of the active backend
   * @returns {'mediapipe'|'tfjs'|null}
   */
  getBackendName() {
    return this.activeBackend
  }

  destroy() {
    this.backend?.destroy()
    this.backend = null
    this.activeBackend = null
    this.isInitialized = false
  }
}
```

- [ ] **Step 2: Verify no lint errors**

```bash
npx biome check src/detection/detection-manager.js
```

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add src/detection/detection-manager.js
git commit -m "feat: add DetectionManager with automatic MediaPipe→TF.js fallback"
```

---

## Chunk 2: Backend Implementations

### Task 5: Refactor MediaPipe as backend

**Files:**
- Create: `src/detection/backends/mediapipe-backend.js`
- Modify: `src/detection/mediapipe-manager.js` (redirect imports)

- [ ] **Step 1: Create mediapipe-backend.js**

Move existing `MediaPipeManager` logic into `MediaPipeBackend` class implementing `DetectionBackend` interface. Keep same initialization code, same `processFrame` logic, same model URLs.

```js
import { DetectionBackend } from './detection-backend.js'
import {
  FaceLandmarker,
  FilesetResolver,
  HandLandmarker,
  PoseLandmarker,
} from '@mediapipe/tasks-vision'

export class MediaPipeBackend extends DetectionBackend {
  constructor() {
    super()
    this.poseLandmarker = null
    this.faceLandmarker = null
    this.handLandmarker = null
    this.isInitialized = false
  }

  async initialize() {
    const vision = await FilesetResolver.forVisionTasks(
      'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
    )

    this.poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_heavy/float16/1/pose_landmarker_heavy.task',
        delegate: 'CPU',
      },
      runningMode: 'VIDEO',
      numPoses: 1,
      minPoseDetectionConfidence: 0.5,
      minPosePresenceConfidence: 0.5,
      minTrackingConfidence: 0.5,
    })

    this.faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task',
        delegate: 'CPU',
      },
      runningMode: 'VIDEO',
      numFaces: 1,
      minFaceDetectionConfidence: 0.5,
      minFacePresenceConfidence: 0.5,
      minTrackingConfidence: 0.5,
      outputFaceBlendshapes: false,
    })

    this.handLandmarker = await HandLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
        delegate: 'CPU',
      },
      runningMode: 'VIDEO',
      numHands: 1,
      minHandDetectionConfidence: 0.5,
      minHandPresenceConfidence: 0.5,
      minTrackingConfidence: 0.5,
    })

    this.isInitialized = true
  }

  processFrame(canvas, timestamp) {
    if (!this.isInitialized) {
      return { pose: null, face: null, hands: null }
    }

    const ctx = canvas.getContext('2d')
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)

    const poseResult = this.poseLandmarker.detectForVideo(imageData, timestamp)
    const faceResult = this.faceLandmarker.detectForVideo(imageData, timestamp)
    const handResult = this.handLandmarker.detectForVideo(imageData, timestamp)

    return {
      pose: poseResult.landmarks?.[0] || null,
      face: faceResult.faceLandmarks?.[0] || null,
      hands: handResult.landmarks?.[0] || null,
    }
  }

  destroy() {
    this.poseLandmarker?.close()
    this.faceLandmarker?.close()
    this.handLandmarker?.close()
    this.isInitialized = false
  }
}
```

- [ ] **Step 2: Update mediapipe-manager.js to re-export**

```js
export { MediaPipeBackend as MediaPipeManager } from './backends/mediapipe-backend.js'
```

- [ ] **Step 3: Verify no lint errors**

```bash
npx biome check src/detection/backends/mediapipe-backend.js src/detection/mediapipe-manager.js
```

Expected: No errors.

- [ ] **Step 4: Commit**

```bash
git add src/detection/backends/mediapipe-backend.js src/detection/mediapipe-manager.js
git commit -m "refactor: extract MediaPipeManager into MediaPipeBackend implementing DetectionBackend interface"
```

---

### Task 6: Create TF.js backend

**Files:**
- Create: `src/detection/backends/tfjs-backend.js`

- [ ] **Step 1: Create tfjs-backend.js**

```js
import { DetectionBackend } from './detection-backend.js'
import { normalizeKeypoints, extractFirstResult } from './normalize.js'

export class TFJSBackend extends DetectionBackend {
  constructor() {
    super()
    this.poseDetector = null
    this.faceDetector = null
    this.handDetector = null
    this.isInitialized = false
    this.imageWidth = 640
    this.imageHeight = 480
  }

  async initialize() {
    // Dynamically import TF.js modules
    const tf = await import('@tensorflow/tfjs-core')
    await import('@tensorflow/tfjs-backend-wasm')

    // Set WASM backend
    await tf.setBackend('wasm')
    await tf.ready()

    // Import detection models
    const poseDetection = await import('@tensorflow-models/pose-detection')
    const faceLandmarksDetection = await import('@tensorflow-models/face-landmarks-detection')
    const handPoseDetection = await import('@tensorflow-models/hand-pose-detection')

    // Initialize detectors in parallel
    const [poseDetector, faceDetector, handDetector] = await Promise.all([
      poseDetection.createDetector(
        poseDetection.SupportedModels.BlazePose,
        { runtime: 'tfjs', modelType: 'heavy' }
      ),
      faceLandmarksDetection.createDetector(
        faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh,
        { runtime: 'tfjs', maxFaces: 1, refineLandmarks: false }
      ),
      handPoseDetection.createDetector(
        handPoseDetection.SupportedModels.MediaPipeHands,
        { runtime: 'tfjs', maxHands: 1, modelType: 'full' }
      ),
    ])

    this.poseDetector = poseDetector
    this.faceDetector = faceDetector
    this.handDetector = handDetector
    this.isInitialized = true
  }

  processFrame(canvas, timestamp) {
    if (!this.isInitialized) {
      return { pose: null, face: null, hands: null }
    }

    this.imageWidth = canvas.width
    this.imageHeight = canvas.height

    // Run all three detectors sequentially (parallel would overload CPU)
    const poseResult = this.detectPose(canvas)
    const faceResult = this.detectFace(canvas)
    const handResult = this.detectHand(canvas)

    return {
      pose: poseResult,
      face: faceResult,
      hands: handResult,
    }
  }

  detectPose(canvas) {
    try {
      const poses = this.poseDetector.estimatePoses(canvas)
      const first = extractFirstResult(poses)
      if (!first?.keypoints) return null
      return normalizeKeypoints(first.keypoints, this.imageWidth, this.imageHeight)
    } catch (e) {
      console.warn('TF.js pose detection failed:', e.message)
      return null
    }
  }

  detectFace(canvas) {
    try {
      const faces = this.faceDetector.estimateFaces(canvas)
      const first = extractFirstResult(faces)
      if (!first?.keypoints) return null
      return normalizeKeypoints(first.keypoints, this.imageWidth, this.imageHeight)
    } catch (e) {
      console.warn('TF.js face detection failed:', e.message)
      return null
    }
  }

  detectHand(canvas) {
    try {
      const hands = this.handDetector.estimateHands(canvas)
      const first = extractFirstResult(hands)
      if (!first?.keypoints) return null
      return normalizeKeypoints(first.keypoints, this.imageWidth, this.imageHeight)
    } catch (e) {
      console.warn('TF.js hand detection failed:', e.message)
      return null
    }
  }

  destroy() {
    this.poseDetector?.dispose()
    this.faceDetector?.dispose()
    this.handDetector?.dispose()
    this.isInitialized = false
  }
}
```

- [ ] **Step 2: Verify no lint errors**

```bash
npx biome check src/detection/backends/tfjs-backend.js
```

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add src/detection/backends/tfjs-backend.js
git commit -m "feat: add TF.js WASM backend with BlazePose + face + hand detection"
```

---

## Chunk 3: Integration + Testing

### Task 7: Update app.js to use DetectionManager

**Files:**
- Modify: `src/core/app.js`

- [ ] **Step 1: Update imports**

Replace:
```js
import { MediaPipeManager } from '../detection/mediapipe-manager.js'
```

With:
```js
import { DetectionManager } from '../detection/detection-manager.js'
```

- [ ] **Step 2: Update singleton initialization**

Replace:
```js
const mediapipe = new MediaPipeManager()
```

With:
```js
const detection = new DetectionManager()
```

- [ ] **Step 3: Update initMediaPipe function**

Rename `initMediaPipe` to `initDetection` and update to use DetectionManager:

```js
async function initDetection() {
  try {
    await detection.initialize()
    console.log('Detection initialized with backend:', detection.getBackendName())
  } catch (e) {
    console.error('Detection initialization failed:', e)
    // Show user-friendly error
    const status = document.getElementById('status')
    if (status) {
      status.textContent = '偵測系統初始化失敗，請確認瀏覽器支援 WebGL 或 WASM'
      status.classList.remove('hidden')
    }
  }
}
```

- [ ] **Step 4: Update call site**

In `initApp()`, replace `initMediaPipe()` with `initDetection()`.

- [ ] **Step 5: Update predictionLoop**

Replace:
```js
const results = mediapipe.processFrame(canvas, timestamp)
```

With:
```js
const results = detection.processFrame(canvas, timestamp)
```

- [ ] **Step 6: Verify no lint errors**

```bash
npx biome check src/core/app.js
```

Expected: No errors.

- [ ] **Step 7: Commit**

```bash
git add src/core/app.js
git commit -m "feat: integrate DetectionManager with automatic fallback in app.js"
```

---

### Task 8: Update state.js (remove old references)

**Files:**
- Modify: `src/core/state.js`

- [ ] **Step 1: Verify state.js has no mediapipe references**

```bash
grep -n "mediapipe\|MediaPipe\|model\|tmImage" src/core/state.js
```

Expected: No matches (state.js should only contain webcamVideo, webcamCanvas, stream, isRunning, etc.)

- [ ] **Step 2: Commit if changes needed**

```bash
git add src/core/state.js
git commit -m "chore: clean up state.js references"
```

(Skip if no changes needed)

---

### Task 9: Run lint and verify build

**Files:**
- None (verification only)

- [ ] **Step 1: Run lint**

```bash
cd /Users/gloomcheng/Workspace/inhaler-coach
npx biome check src/
```

Expected: No errors.

- [ ] **Step 2: Run build**

```bash
npm run build
```

Expected: Build succeeds with no errors.

- [ ] **Step 3: Commit any fixes**

```bash
git add -A
git commit -m "fix: resolve lint and build issues"
```

(Skip if no issues)

---

### Task 10: Manual testing checklist

**Files:**
- None (testing only)

- [ ] **Step 1: Start dev server**

```bash
npm run dev
```

- [ ] **Step 2: Test in browser with WebGL**

Open browser → verify MediaPipe backend initializes (check console for "Detection: MediaPipe backend initialized")

- [ ] **Step 3: Test in browser without WebGL**

Open browser with WebGL disabled (Chrome flags or extension) → verify TF.js backend initializes (check console for "Detection: TF.js backend initialized (WASM)")

- [ ] **Step 4: Verify landmarks render**

Both backends should show pose skeleton (blue), face outline (white), hand skeleton (green) on the overlay canvas.

- [ ] **Step 5: Verify step detection works**

Test shake detection (step 1) and rinse detection (step 4) with both backends.

- [ ] **Step 6: Final commit**

```bash
git add -A
git commit -m "feat: dual backend detection system complete"
```

---

## Summary

| Task | Files Created | Files Modified |
|------|---------------|----------------|
| 1. Install deps | — | package.json |
| 2. Interface | detection-backend.js | — |
| 3. Normalize | normalize.js | — |
| 4. Manager | detection-manager.js | — |
| 5. MediaPipe backend | mediapipe-backend.js | mediapipe-manager.js |
| 6. TF.js backend | tfjs-backend.js | — |
| 7. App integration | — | app.js |
| 8. State cleanup | — | state.js |
| 9. Lint/build | — | — |
| 10. Testing | — | — |

**Total:** 5 new files, 3 modified files
