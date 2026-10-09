/** Vercel serverless adapter. Keeps routing thin; logic lives in routes.mjs. */
import { createHash, randomUUID } from "node:crypto";

import { createPool } from "./db.mjs";
import { HttpError, makeRoutes } from "./routes.mjs";

const pool = createPool();
const routes = makeRoutes({
	query: (text, params) => pool.query(text, params),
	salt: process.env.MRN_SALT,
});

// globalThis is required: Next.js and some runtimes reload the module per request.
const g = globalThis;
g.__inhalerPool ??= pool;
g.__inhalerRoutes ??= routes;

const ROUTES = {
	"GET /api/health": "health",
	"POST /api/cases": "createCase",
	"GET /api/cases": "listCases",
	"GET /api/metrics/summary": "summary",
	"POST /api/sessions": "recordSession",
	"GET /api/reference": "reference",
	"GET /api/followups": "followups",
};

export default async function handler(req, res) {
	const key = `${req.method} ${(req.url ?? "").split("?")[0]}`;
	const name = ROUTES[key];

	res.setHeader("Content-Type", "application/json; charset=utf-8");

	if (!name) {
		res.status(404).end(JSON.stringify({ ok: false, error: `no route for ${key}` }));
		return;
	}
	if (!process.env.MRN_SALT) {
		res.status(500).end(JSON.stringify({ ok: false, error: "MRN_SALT is not configured" }));
		return;
	}

	try {
		const url = new URL(req.url ?? "/", "http://localhost");
		const params = Object.fromEntries(url.searchParams);
		const body = req.method === "POST" ? await readJson(req) : undefined;
		const out = await g.__inhalerRoutes[name](body ?? params);
		res.status(200).end(JSON.stringify(out));
	} catch (err) {
		const status = err instanceof HttpError ? err.status : 500;
		if (status === 500) console.error("[api]", key, err);
		res.status(status).end(JSON.stringify({ ok: false, error: err.message }));
	}
}

async function readJson(req) {
	const chunks = [];
	for await (const c of req) chunks.push(c);
	if (!chunks.length) return {};
	try {
		return JSON.parse(Buffer.concat(chunks).toString("utf8"));
	} catch {
		throw new HttpError(400, "body is not valid JSON");
	}
}

export { createHash, randomUUID };