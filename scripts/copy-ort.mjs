// Copies onnxruntime-web's wasm backend (the single-threaded jsep loader + binary)
// into public/ort/ so the app can serve it same-origin. Run before dev and build;
// the files are gitignored because they're a redistributable dependency that must
// track the installed onnxruntime-web version, not a source artifact.
import { copyFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const src = `${root}/node_modules/onnxruntime-web/dist`;
const dst = `${root}/public/ort`;
mkdirSync(dst, { recursive: true });
for (const f of [
  "ort-wasm-simd-threaded.jsep.mjs",
  "ort-wasm-simd-threaded.jsep.wasm",
]) {
  copyFileSync(`${src}/${f}`, `${dst}/${f}`);
}
console.log("copied onnxruntime-web wasm backend to public/ort/");
