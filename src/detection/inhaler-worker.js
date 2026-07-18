import * as ort from "onnxruntime-web";

/**
 * Runs the inhaler ONNX model OFF the main thread.
 *
 * The wasm inference is a ~200–400 ms SYNCHRONOUS call. On the main thread it
 * froze the preview and starved the motion/recording loops every ~200 ms — the
 * "fps too low / ghosting" seen in the collector. Here it runs in a worker on an
 * OffscreenCanvas, so the main thread only pays the near-free cost of grabbing a
 * frame (createImageBitmap) and posting it across.
 *
 * Model: input `images` [1,3,640,640] RGB 0..1, output `output0` [1,300,6] rows
 * of [x1,y1,x2,y2,score,class] in 640-letterboxed pixel space, NMS baked in.
 */

ort.env.wasm.wasmPaths = `${import.meta.env.BASE_URL}ort/`;
ort.env.wasm.numThreads = 1;

const MODEL_URL = `${import.meta.env.BASE_URL}models/inhaler.onnx`;
const SIZE = 640;

let session = null;
let canvas = null;
let ctx = null;
const input = new Float32Array(3 * SIZE * SIZE);

async function ensure() {
	if (session) return;
	canvas = new OffscreenCanvas(SIZE, SIZE);
	ctx = canvas.getContext("2d", { willReadFrequently: true });
	session = await ort.InferenceSession.create(MODEL_URL, {
		executionProviders: ["wasm"],
		graphOptimizationLevel: "all",
	});
	self.postMessage({ ready: true });
}

const EMPTY = { present: false, score: 0, center: null, box: null };

function preprocess(bitmap, srcW, srcH) {
	const scale = Math.min(SIZE / srcW, SIZE / srcH);
	const w = Math.round(srcW * scale);
	const h = Math.round(srcH * scale);
	const padX = (SIZE - w) >> 1;
	const padY = (SIZE - h) >> 1;
	ctx.fillStyle = "#000";
	ctx.fillRect(0, 0, SIZE, SIZE);
	ctx.drawImage(bitmap, 0, 0, srcW, srcH, padX, padY, w, h);
	const { data } = ctx.getImageData(0, 0, SIZE, SIZE);

	const plane = SIZE * SIZE;
	for (let i = 0; i < plane; i++) {
		const p = i * 4;
		input[i] = data[p] / 255;
		input[plane + i] = data[p + 1] / 255;
		input[2 * plane + i] = data[p + 2] / 255;
	}
	return { scale, padX, padY };
}

self.onmessage = async (e) => {
	const { id, bitmap, srcW, srcH, conf } = e.data;
	try {
		await ensure();
		const { scale, padX, padY } = preprocess(bitmap, srcW, srcH);
		bitmap.close();

		const tensor = new ort.Tensor("float32", input, [1, 3, SIZE, SIZE]);
		const out = await session.run({ images: tensor });
		const a = out.output0.data;
		const rows = out.output0.dims[1];

		let best = -1;
		let bestScore = conf;
		for (let i = 0; i < rows; i++) {
			const s = a[i * 6 + 4];
			if (s > bestScore) {
				bestScore = s;
				best = i;
			}
		}
		if (best < 0) {
			self.postMessage({ id, result: EMPTY });
			return;
		}
		const b = best * 6;
		const x1 = (a[b] - padX) / scale;
		const y1 = (a[b + 1] - padY) / scale;
		const x2 = (a[b + 2] - padX) / scale;
		const y2 = (a[b + 3] - padY) / scale;
		self.postMessage({
			id,
			result: {
				present: true,
				score: +bestScore.toFixed(3),
				center: { x: (x1 + x2) / 2 / srcW, y: (y1 + y2) / 2 / srcH },
				box: {
					x: x1 / srcW,
					y: y1 / srcH,
					w: (x2 - x1) / srcW,
					h: (y2 - y1) / srcH,
				},
			},
		});
	} catch (err) {
		if (bitmap) bitmap.close?.();
		self.postMessage({ id, error: String(err) });
	}
};
