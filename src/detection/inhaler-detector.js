import * as ort from "onnxruntime-web";

/**
 * Real inhaler object detection, replacing the colour filter that mistook a
 * nostril and a door handle for the inhaler.
 *
 * This is a YOLO11-nano detector trained (on the GPU box, from the six
 * pharmacist videos auto-labelled by an open-vocabulary model) to find the
 * Symbicort Rapihaler as an OBJECT — shape, not just redness. On a live webcam
 * of a person holding NOTHING it fires on 0 % of frames, where the colour filter
 * fired on 70–97 %. When it does fire, the box is on a real inhaler.
 *
 * The model has NMS baked in: input `images` [1,3,640,640] RGB 0..1, output
 * `output0` [1,300,6] rows of [x1,y1,x2,y2,score,class] in the 640-letterboxed
 * pixel space. We letterbox in, take the highest-scoring box above threshold,
 * and map it back to normalized frame coordinates so the step logic (canister
 * distance-to-mouth / height) works exactly as before — but on a trustworthy
 * box. Recall is imperfect (~0.7 on an unseen person), so it fails CLOSED: a
 * missed inhaler means "try again", never a false pass.
 */

// Served from public/ (see vite base handling). Single-threaded SIMD wasm so we
// don't need cross-origin isolation (COOP/COEP) for threads.
ort.env.wasm.wasmPaths = `${import.meta.env.BASE_URL}ort/`;
ort.env.wasm.numThreads = 1;

const MODEL_URL = `${import.meta.env.BASE_URL}models/inhaler.onnx`;
const SIZE = 640;
const DEFAULT_CONF = 0.35;

const EMPTY = { present: false, score: 0, center: null, box: null };

export class InhalerDetector {
	constructor() {
		this.session = null;
		this._loading = null;
		this.canvas = document.createElement("canvas");
		this.canvas.width = SIZE;
		this.canvas.height = SIZE;
		this.ctx = this.canvas.getContext("2d", { willReadFrequently: true });
		this.input = new Float32Array(3 * SIZE * SIZE);
	}

	/** Idempotent; safe to await from several callers. */
	async load() {
		if (this.session) return;
		if (!this._loading) {
			this._loading = ort.InferenceSession.create(MODEL_URL, {
				executionProviders: ["wasm"],
				graphOptimizationLevel: "all",
			});
		}
		this.session = await this._loading;
	}

	get ready() {
		return !!this.session;
	}

	/**
	 * @param {CanvasImageSource} source - the raw video frame
	 * @param {number} srcW @param {number} srcH - its natural pixel size
	 * @returns {{present:boolean, score:number,
	 *            center:{x:number,y:number}|null,
	 *            box:{x:number,y:number,w:number,h:number}|null}} normalized 0..1
	 */
	async detect(source, srcW, srcH, conf = DEFAULT_CONF) {
		if (!this.session || !srcW || !srcH) return EMPTY;

		// Letterbox into 640×640, preserving aspect ratio.
		const scale = Math.min(SIZE / srcW, SIZE / srcH);
		const w = Math.round(srcW * scale);
		const h = Math.round(srcH * scale);
		const padX = (SIZE - w) >> 1;
		const padY = (SIZE - h) >> 1;
		this.ctx.fillStyle = "#000";
		this.ctx.fillRect(0, 0, SIZE, SIZE);
		this.ctx.drawImage(source, 0, 0, srcW, srcH, padX, padY, w, h);
		const { data } = this.ctx.getImageData(0, 0, SIZE, SIZE);

		// RGBA → planar RGB float32 [0,1].
		const chw = this.input;
		const plane = SIZE * SIZE;
		for (let i = 0; i < plane; i++) {
			const p = i * 4;
			chw[i] = data[p] / 255;
			chw[plane + i] = data[p + 1] / 255;
			chw[2 * plane + i] = data[p + 2] / 255;
		}

		const tensor = new ort.Tensor("float32", chw, [1, 3, SIZE, SIZE]);
		const out = await this.session.run({ images: tensor });
		const o = out.output0;
		const a = o.data;
		const rows = o.dims[1];

		// Highest-scoring detection above threshold (don't assume sorted order).
		let best = -1;
		let bestScore = conf;
		for (let i = 0; i < rows; i++) {
			const s = a[i * 6 + 4];
			if (s > bestScore) {
				bestScore = s;
				best = i;
			}
		}
		if (best < 0) return EMPTY;

		// Undo the letterbox → original pixels → normalized 0..1.
		const b = best * 6;
		const x1 = (a[b] - padX) / scale;
		const y1 = (a[b + 1] - padY) / scale;
		const x2 = (a[b + 2] - padX) / scale;
		const y2 = (a[b + 3] - padY) / scale;
		return {
			present: true,
			score: +bestScore.toFixed(3),
			center: { x: (x1 + x2) / 2 / srcW, y: (y1 + y2) / 2 / srcH },
			box: {
				x: x1 / srcW,
				y: y1 / srcH,
				w: (x2 - x1) / srcW,
				h: (y2 - y1) / srcH,
			},
		};
	}

	reset() {}
}
