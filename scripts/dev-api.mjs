/**
 * Local stand-in for the Vercel serverless function in api/index.mjs.
 *
 * It mirrors the real router exactly — same path table, same GET-query versus
 * POST-body split — so what works here works in production. A dev server that
 * behaved differently from the adapter would hide bugs rather than find them.
 *
 * Run: DATABASE_URL=... bun run dev:api
 */
import { createServer } from "node:http";

import { createPool } from "../api/db.mjs";
import { HttpError, makeRoutes } from "../api/routes.mjs";

const pool = createPool(process.env.DATABASE_URL);
const api = makeRoutes({ query: (t, p) => pool.query(t, p), salt: process.env.MRN_SALT ?? "demo-salt" });

/** Same table as api/index.mjs. */
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
	"POST /api/line/send": "lineSend",
	"POST /api/line/event": "lineEvent",
	"GET /api/line/engagement": "lineEngagement",
};

const port = Number(process.env.PORT ?? 4183);

createServer(async (req, res) => {
	const url = new URL(req.url ?? "/", "http://localhost");
	const name = ROUTES[`${req.method} ${url.pathname}`];
	res.setHeader("Content-Type", "application/json; charset=utf-8");

	if (!name) {
		res.statusCode = 404;
		res.end(JSON.stringify({ ok: false, error: `no route for ${req.method} ${url.pathname}` }));
		return;
	}
	try {
		const input =
			req.method === "POST"
				? await readJson(req)
				: Object.fromEntries(url.searchParams);
		res.end(JSON.stringify(await api[name](input)));
	} catch (err) {
		const status = err instanceof HttpError ? err.status : 500;
		if (status === 500) console.error("[dev-api]", name, err);
		res.statusCode = status;
		res.end(JSON.stringify({ ok: false, error: err.message }));
	}
}).listen(port, () => console.log(`dev api on ${port}`));

async function readJson(req) {
	const chunks = [];
	for await (const c of req) chunks.push(c);
	if (!chunks.length) return {};
	return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}