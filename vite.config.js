import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

// onnxruntime-web loads its wasm backend by dynamically importing a `.mjs` glue
// file from public/ort/. Vite's dev server appends `?import` to that request and
// answers it as HTML, breaking the load. This serves /ort/*.mjs as raw
// JavaScript regardless of query string. Prod is unaffected (static host serves
// dist/ort/ verbatim), so this plugin only touches the dev server.
const serveOrtMjs = {
	name: "serve-ort-mjs",
	configureServer(server) {
		server.middlewares.use((req, res, next) => {
			const url = req.url || "";
			if (url.startsWith("/ort/") && url.includes(".mjs")) {
				const file = path.join(process.cwd(), "public", url.split("?")[0]);
				if (fs.existsSync(file)) {
					res.setHeader("Content-Type", "application/javascript");
					fs.createReadStream(file).pipe(res);
					return;
				}
			}
			next();
		});
	},
};

const emptyModule = fileURLToPath(
	new URL("./src/stubs/empty-module.js", import.meta.url),
);

export default defineConfig(({ command }) => ({
	plugins: [tailwindcss(), serveOrtMjs],
	resolve: {
		alias: {
			// The @tensorflow-models/* packages pull in these MediaPipe solution
			// bundles at module scope even when only the 'tfjs' runtime is used, and
			// that code touches `document` — which doesn't exist in a Web Worker.
			// Detection runs in a worker, so they get stubbed out. See
			// src/stubs/empty-module.js.
			"@mediapipe/face_mesh": emptyModule,
			"@mediapipe/face_detection": emptyModule,
			"@mediapipe/hands": emptyModule,
			"@mediapipe/pose": emptyModule,
			"@mediapipe/selfie_segmentation": emptyModule,
		},
	},
	// onnxruntime-web loads its wasm backend by dynamically importing a `.mjs`
	// glue file from `ort.env.wasm.wasmPaths` (public/ort/). If Vite pre-bundles
	// ort, its dep optimiser rewrites that import with a `?import` query and the
	// dev server answers it as HTML, so the wasm backend fails to load. Excluding
	// it leaves the runtime dynamic import untouched, served straight from public/.
	optimizeDeps: {
		exclude: ["onnxruntime-web", "onnxruntime-web/wasm"],
	},
	server: {
		host: "0.0.0.0",
		port: 5173,
		strictPort: true,
		open: false,
		// Dev only: the v2 API runs separately (bun run dev:api). In production
		// these routes are served by the api/ directory on Vercel.
		//
		// The proxy is merged INTO the server settings rather than spread over
		// them. Spreading a second `server` key over the first one replaced the
		// whole object, so the moment VITE_API_PROXY was set the host, the port
		// and strictPort silently disappeared: the dev server stopped listening
		// on the interface it was told to, and a busy port moved it to another
		// one instead of failing. A gate that then measured the wrong port
		// would report green on the wrong server.
		...(process.env.VITE_API_PROXY
			? {
					proxy: {
						"/api": { target: process.env.VITE_API_PROXY, changeOrigin: true },
					},
				}
			: {}),
	},
	// GitHub Pages serves a project site from /<repo>/, so built assets need that
	// prefix — but the dev server is at the root, and applying it there just makes
	// every local URL 404. Overridable for other hosts: VITE_BASE=/ bun run build
	base:
		command === "build" ? (process.env.VITE_BASE ?? "/inhaler-coach/") : "/",
	build: {
		target: "esnext",
		outDir: "dist",
		assetsInlineLimit: 0,
		rollupOptions: {
			input: {
				main: fileURLToPath(new URL("./index.html", import.meta.url)),
			},
		},
	},
	worker: {
		format: "es",
	},
}));
