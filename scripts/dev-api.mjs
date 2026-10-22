/**
 * Local stand-in for the Vercel serverless function in api/index.mjs.
 *
 * It does not re-implement the API. It runs the very same handler the
 * deployment runs, so the guard — the session check, the origin check, the
 * security headers, the LINE signature check — behaves identically here and
 * there. A dev server that re-implemented the routing would drift, and a
 * drifted dev server hides bugs instead of finding them.
 *
 * The only difference is the response object: Node's ServerResponse has no
 * `.status()`, and the Vercel runtime's does.
 *
 * Run: DATABASE_URL=... bun run dev:api
 */
import { createServer } from "node:http";

import handler from "../api/index.mjs";

const port = Number(process.env.PORT ?? 4183);

// The browser reaches the API through Vite's proxy, so the page's origin is
// the Vite port, not this one. The dev server trusts local origins so a
// same-origin write is not mistaken for a cross-site one. The flag is set
// here and nowhere else: a deployment never runs this script.
process.env.ALLOW_LOCALHOST_ORIGINS = "true";
const devOrigins = ["http://localhost:5173", "http://localhost:4185"];
process.env.ALLOWED_ORIGINS = [
	...new Set([
		...(process.env.ALLOWED_ORIGINS ?? "").split(","),
		...devOrigins,
	]),
]
	.map((s) => s.trim())
	.filter(Boolean)
	.join(",");

createServer(async (req, res) => {
	// Vercel's response object carries .status(); Node's does not.
	res.status = (code) => {
		res.statusCode = code;
		return res;
	};
	try {
		await handler(req, res);
	} catch (err) {
		console.error("[dev-api]", err);
		if (!res.headersSent) {
			res.statusCode = 500;
			res.setHeader("Content-Type", "application/json; charset=utf-8");
		}
		res.end(JSON.stringify({ ok: false, error: err.message }));
	}
}).listen(port, () => console.log(`dev api on ${port}`));
