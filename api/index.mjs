/** Vercel serverless adapter. Keeps routing thin; logic lives in routes.mjs. */
import { createHash, randomUUID } from "node:crypto";

import { createPool } from "./db.mjs";
import { HttpError, makeRoutes } from "./routes.mjs";

const g = globalThis;
let pool = null;

function getPool() {
	if (!pool && process.env.DATABASE_URL) {
		try {
			pool = createPool();
		} catch (err) {
			console.error("[api] Failed to initialize Postgres pool:", err);
		}
	}
	return pool;
}

function getRoutes() {
	if (g.__inhalerRoutes) return g.__inhalerRoutes;
	const routes = makeRoutes({
		query: (text, params) => {
			const activePool = getPool();
			if (!activePool) {
				throw new HttpError(503, "Database connection not available");
			}
			return activePool.query(text, params);
		},
		salt: process.env.MRN_SALT ?? "inhaler-v2-fallback-salt",
	});
	g.__inhalerRoutes = routes;
	return routes;
}

const ROUTES = {
	"GET /api/health": "health",
	"POST /api/cases": "createCase",
	"POST /api/cases/lookup": "lookupCases",
	"GET /api/cases": "listCases",
	"GET /api/metrics/summary": "summary",
	"POST /api/sessions": "recordSession",
	"GET /api/reference": "reference",
	"GET /api/followups": "followups",
	"POST /api/followups/close": "closeFollowup",
	"GET /api/sessions/pending": "pendingSession",
	"POST /api/line/link": "lineLink",
	"GET /api/line/plan": "linePlan",
	"POST /api/line/journeys": "lineJourneys",
	"POST /api/line/send": "lineSend",
	"POST /api/line/event": "lineEvent",
	"GET /api/line/engagement": "lineEngagement",
	"GET /api/admin/config": "getAdminConfig",
	"POST /api/admin/config": "updateAdminConfig",
};

function getNormalizedPath(req) {
	const xForwardedUri = req.headers?.["x-forwarded-uri"];
	if (xForwardedUri) return xForwardedUri.split("?")[0];

	const xMatchedPath = req.headers?.["x-matched-path"];
	if (xMatchedPath && !xMatchedPath.endsWith(".mjs"))
		return xMatchedPath.split("?")[0];

	const urlObj = new URL(req.url ?? "/", "http://localhost");
	const pathParam =
		urlObj.searchParams.get("__path") || urlObj.searchParams.get("path");
	if (pathParam) {
		return pathParam.startsWith("/api") ? pathParam : `/api/${pathParam}`;
	}

	return (req.url ?? "").split("?")[0];
}

export default async function handler(req, res) {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
	res.setHeader(
		"Access-Control-Allow-Headers",
		"Content-Type, Authorization, X-Line-Signature",
	);

	if (req.method === "OPTIONS") {
		res.status(204).end();
		return;
	}

	res.setHeader("Content-Type", "application/json; charset=utf-8");

	const path = getNormalizedPath(req);
	const key = `${req.method} ${path}`;
	const name = ROUTES[key];

	if (!name) {
		res
			.status(404)
			.end(JSON.stringify({ ok: false, error: `no route for ${key}` }));
		return;
	}

	try {
		const routes = getRoutes();
		const url = new URL(req.url ?? "/", "http://localhost");
		const params = Object.fromEntries(url.searchParams);
		const body = req.method === "POST" ? await readJson(req) : undefined;
		const out = await routes[name](body ?? params);
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
