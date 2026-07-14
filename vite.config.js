import { fileURLToPath } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

const emptyModule = fileURLToPath(
  new URL('./src/stubs/empty-module.js', import.meta.url),
);

export default defineConfig(({ command }) => ({
  plugins: [tailwindcss()],
  resolve: {
    alias: {
      // The @tensorflow-models/* packages pull in these MediaPipe solution
      // bundles at module scope even when only the 'tfjs' runtime is used, and
      // that code touches `document` — which doesn't exist in a Web Worker.
      // Detection runs in a worker, so they get stubbed out. See
      // src/stubs/empty-module.js.
      '@mediapipe/face_mesh': emptyModule,
      '@mediapipe/face_detection': emptyModule,
      '@mediapipe/hands': emptyModule,
      '@mediapipe/pose': emptyModule,
      '@mediapipe/selfie_segmentation': emptyModule,
    },
  },
  server: {
    host: 'localhost',
    port: 3000,
    open: true,
  },
  // GitHub Pages serves a project site from /<repo>/, so built assets need that
  // prefix — but the dev server is at the root, and applying it there just makes
  // every local URL 404. Overridable for other hosts: VITE_BASE=/ bun run build
  base: command === 'build' ? (process.env.VITE_BASE ?? '/inhaler-coach/') : '/',
  build: {
    target: 'esnext',
    outDir: 'dist',
    assetsInlineLimit: 0,
    rollupOptions: {
      input: {
        // The coaching app, and the data collector the pharmacists run.
        main: fileURLToPath(new URL('./index.html', import.meta.url)),
        collect: fileURLToPath(new URL('./collect.html', import.meta.url)),
      },
    },
  },
  worker: {
    format: 'es',
  },
}));
