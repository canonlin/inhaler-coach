// Copies onnxruntime-web's wasm backend (the single-threaded jsep loader + binary)
// into public/ort/ so the app can serve it same-origin. Run before dev and build;
// the files are gitignored because they're a redistributable dependency that must
// track the installed onnxruntime-web version, not a source artifact.
import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const src = `${root}/node_modules/onnxruntime-web/dist`;
const dst = `${root}/public/ort`;
mkdirSync(dst, { recursive: true });
for (const f of [
  "ort-wasm-simd-threaded.mjs",
  "ort-wasm-simd-threaded.wasm",
]) {
  if (existsSync(`${src}/${f}`)) {
    copyFileSync(`${src}/${f}`, `${dst}/${f}`);
  } else if (existsSync(`${dst}/${f}`)) {
    console.log(`Using existing ${dst}/${f}`);
  }
}

const mpSrc = `${root}/node_modules/@mediapipe/tasks-vision/wasm`;
const mpDst = `${root}/public/mediapipe`;
mkdirSync(mpDst, { recursive: true });
for (const f of ["vision_wasm_internal.js", "vision_wasm_internal.wasm"]) {
  if (existsSync(`${mpSrc}/${f}`)) {
    copyFileSync(`${mpSrc}/${f}`, `${mpDst}/${f}`);
  }
}

const taskModels = [
  {
    name: "pose_landmarker_lite.task",
    url: "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task",
  },
  {
    name: "face_landmarker.task",
    url: "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
  },
  {
    name: "hand_landmarker.task",
    url: "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
  },
];

const mpModelDst = `${root}/public/models/mediapipe`;
mkdirSync(mpModelDst, { recursive: true });

for (const m of taskModels) {
  const target = `${mpModelDst}/${m.name}`;
  if (!existsSync(target)) {
    console.log(`Downloading ${m.name}...`);
    const res = await fetch(m.url);
    if (!res.ok) throw new Error(`Failed to download ${m.name}: ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    const { writeFileSync } = await import("node:fs");
    writeFileSync(target, buf);
  }
}

console.log("checked mediapipe and onnxruntime-web assets in public/");
