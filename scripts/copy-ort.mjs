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
  "ort-wasm-simd-threaded.jsep.mjs",
  "ort-wasm-simd-threaded.jsep.wasm",
]) {
  if (existsSync(`${src}/${f}`)) {
    copyFileSync(`${src}/${f}`, `${dst}/${f}`);
  } else if (existsSync(`${dst}/${f}`)) {
    console.log(`Using existing ${dst}/${f}`);
  }
}
console.log("checked onnxruntime-web wasm backend in public/ort/");
