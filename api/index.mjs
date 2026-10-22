/**
 * Vercel serverless adapter. Keeps routing thin; logic lives in routes.mjs.
 *
 * This file is the edge, and the edge is where the front door is. Before it
 * dispatched anything, every endpoint below /api answered anyone who asked,
 * on the open internet, including the one that exports the QCC spreadsheet.
 * The guard here is the difference between a study tool and a breach.
 *
 * The order of operations matters:
 *
 *   1. Security headers and CORS. Cheap, and they apply to every answer.
 *   2. The auth endpoints, handled here because they set the cookie that
 *      step 3 looks for.
 *   3. The session guard. A route that is not public needs a signed-in
 *      pharmacist; the cron routes need the scheduler's secret.
 *   4. The LINE signature check. The webhook has to prove it is LINE.
 *   5. Dispatch.
 */
import { createHash, randomUUID, timingSafeEqual } from "node:crypto";

import {
	ADMIN_ENDPOINTS,
	checkLoginThrottle,
	clearedCookie,
	isPublic,
	login,
	logout,
	noteLoginAttempt,
	parseCookies,
	resolveSession,
	SESSION_COOKIE,
	sessionCookie,
} from "./auth.mjs";
import { createPool } from "./db.mjs";
import { HttpError } from "./http-error.mjs";
import { verifySignature } from "./line/signature.mjs";
import { ADMIN_ONLY_ROUTES, ROUTES, WRITE_ROUTES } from "./route-table.mjs";
import { makeRoutes } from "./routes.mjs";

const g = globalThis;
let pool = null;

/**
 * The paths that accept LINE's own webhook POSTs.
 *
 * These are the only public write endpoints, so they are the only ones that
 * have to prove the request came from LINE.
 */
const LINE_WEBHOOK_PATHS = new Set(["/api/line/webhook", "/api/line/event"]);

/**
 * The paths that send messages to patients.
 *
 * A scheduler calls these. A stranger should not be able to, so they need the
 * cron secret — Vercel sends it automatically for cron jobs, and a person
 * running it by hand passes the same header. They deliberately do not accept a
 * browser session: a dispatch reaches a patient's phone, and a GET that sends
 * messages is a request a web page could trigger by pointing an <img> at it.
 */
const DISPATCH_PATHS = new Set(["/api/line/dispatch"]);

/**
 * The paths whose body is a file rather than JSON.
 *
 * The spreadsheet import uploads the workbook itself, so the bytes have to
 * survive to the handler unparsed.
 */
const BINARY_BODY_PATHS = new Set(["/api/import/cases"]);

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

/**
 * The origin this request was made to.
 *
 * Vercel sets x-forwarded-proto and x-forwarded-host; the Host header is the
 * fallback for the local dev server.
 */
function requestOrigin(req) {
	const forwarded = String(req.headers["x-forwarded-proto"] ?? "")
		.split(",")[0]
		.trim();
	const proto = forwarded || (req.socket?.encrypted ? "https" : "http");
	const host = String(req.headers["x-forwarded-host"] ?? req.headers.host ?? "")
		.split(",")[0]
		.trim();
	return host ? `${proto}://${host}` : null;
}

/**
 * Is this request HTTPS?
 *
 * The session cookie carries the Secure flag, and a Secure cookie is dropped
 * by the browser on a plain http origin — which would make the local dev
 * server impossible to sign in to.
 */
function isSecureRequest(req) {
	if (process.env.NODE_ENV === "development") return false;
	const proto = String(req.headers["x-forwarded-proto"] ?? "").toLowerCase();
	if (proto) return proto === "https";
	return Boolean(req.socket?.encrypted);
}

/**
 * Extra origins allowed to call the API with credentials.
 *
 * Empty by default. The patient app, the back office and the LINE webhook are
 * all same-origin or server-to-server, so nothing needs to be listed — and an
 * empty list is the safe one.
 */
function allowedOrigins() {
	return String(process.env.ALLOWED_ORIGINS ?? "")
		.split(",")
		.map((s) => s.trim())
		.filter(Boolean);
}

/**
 * May this origin call the API?
 *
 * Our own origin always may. An extra origin may only if somebody put it in
 * ALLOWED_ORIGINS on purpose — the patient app, the back office and the LINE
 * webhook are all same-origin or server-to-server, so the list is empty by
 * default and an empty list is the safe one.
 *
 * The local dev server is the one exception: the page runs on Vite's port and
 * the API on its own, so they are different origins by construction. The
 * dev server asks for that explicitly, and the flag is not set in a
 * deployment.
 */
function originAllowed(req, origin) {
	if (!origin) return false;
	const own = requestOrigin(req);
	if (own && origin === own) return true;
	if (allowedOrigins().includes(origin)) return true;
	if (process.env.ALLOW_LOCALHOST_ORIGINS === "true") {
		return /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
	}
	return false;
}

/**
 * CORS, narrowed.
 *
 * It used to answer every request with `Access-Control-Allow-Origin: *`,
 * which tells every website on the internet that it may read this API's
 * answers — medical record tails, follow-up queues, the whole QCC dataset.
 * Now an origin is echoed only when it is allowed, and credentials are
 * allowed only then.
 */
function applyCors(req, res) {
	const origin = req.headers.origin;
	if (!origin) return false;
	if (!originAllowed(req, origin)) return false;
	res.setHeader("Access-Control-Allow-Origin", origin);
	res.setHeader("Access-Control-Allow-Credentials", "true");
	res.setHeader("Vary", "Origin");
	return true;
}

/**
 * Headers every answer carries.
 *
 * These are cheap and remove whole classes of problem: a browser guessing
 * that a .xlsx is HTML, a page being framed into someone else's site, a
 * referral URL leaking the path, a downgrade to plain http.
 */
function applySecurityHeaders(res) {
	res.setHeader("X-Content-Type-Options", "nosniff");
	res.setHeader("X-Frame-Options", "DENY");
	res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
	res.setHeader(
		"Permissions-Policy",
		"camera=(self), microphone=(self), geolocation=(), payment=(), usb=()",
	);
	res.setHeader(
		"Strict-Transport-Security",
		"max-age=63072000; includeSubDomains",
	);
}

/**
 * Is this write coming from our own page?
 *
 * A browser that posts from our page says so, in Sec-Fetch-Site or Origin.
 * A request that says it came from somewhere else is refused, whatever
 * session it carries.
 */
function isCrossSite(req) {
	const fetchSite = req.headers["sec-fetch-site"];
	if (fetchSite && fetchSite !== "same-origin" && fetchSite !== "none") {
		return true;
	}
	const origin = req.headers.origin;
	if (!origin) return false;
	return !originAllowed(req, origin);
}

/**
 * The session token on this request, and how it arrived.
 *
 * A cookie is what a browser carries, and a browser can be made to carry it
 * by another site. A bearer token is what a script carries, and a script is
 * not steered by a web page. The difference decides how strict the write
 * checks have to be.
 */
function readSessionToken(req) {
	const cookies = parseCookies(req.headers.cookie);
	const cookieToken = cookies[SESSION_COOKIE];
	const header = String(req.headers.authorization ?? "");
	const bearer = header.replace(/^Bearer\s+/i, "").trim();
	if (bearer) return { token: bearer, viaCookie: false };
	if (cookieToken) return { token: cookieToken, viaCookie: true };
	return { token: null, viaCookie: false };
}

/** The client's address, for the audit trail. */
function clientIp(req) {
	const forwarded = String(req.headers["x-forwarded-for"] ?? "")
		.split(",")[0]
		.trim();
	return forwarded || req.socket?.remoteAddress || null;
}

function getNormalizedPath(req) {
	const urlObj = new URL(req.url ?? "/", "http://localhost");
	const pathParam =
		urlObj.searchParams.get("__path") || urlObj.searchParams.get("path");
	if (pathParam) {
		return pathParam.startsWith("/api") ? pathParam : `/api/${pathParam}`;
	}

	const xForwardedUri = req.headers?.["x-forwarded-uri"];
	if (xForwardedUri && xForwardedUri !== "/api" && xForwardedUri !== "/api/") {
		return xForwardedUri.split("?")[0];
	}

	const xMatchedPath = req.headers?.["x-matched-path"];
	if (
		xMatchedPath &&
		!xMatchedPath.endsWith(".mjs") &&
		xMatchedPath !== "/api"
	) {
		return xMatchedPath.split("?")[0];
	}

	return (req.url ?? "").split("?")[0];
}

/**
 * POST /api/auth/login, POST /api/auth/logout, GET /api/auth/me.
 *
 * These live at the edge rather than in routes.mjs because they are the ones
 * that set and clear the cookie the rest of the guard looks for, and a
 * handler that cannot reach the response object cannot set a cookie.
 */
async function handleAuthEndpoint(req, res, key, raw) {
	const activePool = getPool();
	if (!activePool) {
		res.status(503).end(
			JSON.stringify({
				ok: false,
				error: "Database connection not available",
			}),
		);
		return;
	}
	const query = (text, params) => activePool.query(text, params);

	if (key === "GET /api/auth/me") {
		const { token } = readSessionToken(req);
		const user = await resolveSession(query, token);
		if (!user) {
			res
				.status(401)
				.end(JSON.stringify({ ok: false, error: "尚未登入", signedIn: false }));
			return;
		}
		res.status(200).end(JSON.stringify({ ok: true, signedIn: true, user }));
		return;
	}

	if (key === "POST /api/auth/logout") {
		const { token } = readSessionToken(req);
		await logout(query, token);
		res.setHeader("Set-Cookie", clearedCookie());
		res.status(200).end(JSON.stringify({ ok: true, signedIn: false }));
		return;
	}

	// POST /api/auth/login
	const body = parseJson(raw.toString("utf8"));
	const email = String(body.email ?? "").trim();
	const password = String(body.password ?? "");
	const ip = clientIp(req);

	const throttle = checkLoginThrottle(ip);
	if (throttle) {
		res.status(429).end(
			JSON.stringify({
				ok: false,
				error: `嘗試次數過多，請於 ${throttle.retryAfterSeconds} 秒後再試`,
			}),
		);
		return;
	}
	noteLoginAttempt(ip);

	try {
		const result = await login(query, {
			email,
			password,
			ip,
			userAgent: req.headers["user-agent"] ?? null,
		});
		res.setHeader(
			"Set-Cookie",
			sessionCookie(result.token, { secure: isSecureRequest(req) }),
		);
		res.status(200).end(
			JSON.stringify({
				ok: true,
				signedIn: true,
				user: result.user,
				expiresAt: result.expiresAt,
			}),
		);
	} catch (err) {
		const status = err instanceof HttpError ? err.status : 500;
		res.status(status).end(JSON.stringify({ ok: false, error: err.message }));
	}
}

/**
 * Does this request carry the scheduler's secret?
 *
 * Compared in constant time, because the secret is the one credential a
 * stranger can keep guessing at without any visible effect.
 */
function hasCronSecret(req) {
	const secret = process.env.CRON_SECRET;
	if (!secret) return false;
	const given = String(req.headers.authorization ?? "").replace(
		/^Bearer\s+/i,
		"",
	);
	const a = Buffer.from(given);
	const b = Buffer.from(secret);
	return a.length === b.length && timingSafeEqual(a, b);
}

/**
 * The guard.
 *
 * A route is public only if it is on the public list in api/auth.mjs.
 * Everything else needs a signed-in pharmacist, and the dispatch routes need
 * the scheduler's secret instead of a session — a dispatch reaches a patient's
 * phone, and a GET that sends messages is a request a web page could trigger
 * by pointing an <img> at it.
 *
 * Returns true when the request may proceed. When it returns false it has
 * already answered, and the caller must stop.
 */
async function authorize(req, res, key, path) {
	if (isPublic(req.method, path)) return true;

	if (DISPATCH_PATHS.has(path)) {
		if (!hasCronSecret(req)) {
			res.status(401).end(JSON.stringify({ ok: false, error: "需要排程密鑰" }));
			return false;
		}
		return true;
	}

	const activePool = getPool();
	if (!activePool) {
		res.status(503).end(
			JSON.stringify({
				ok: false,
				error: "Database connection not available",
			}),
		);
		return false;
	}

	const { token, viaCookie } = readSessionToken(req);
	const session = await resolveSession(
		(text, params) => activePool.query(text, params),
		token,
	);
	if (!session) {
		res
			.status(401)
			.end(JSON.stringify({ ok: false, error: "尚未登入", signedIn: false }));
		return false;
	}

	const isWrite = req.method !== "GET";
	// A write that arrived from another site is refused even with a valid
	// session: a cookie that another page can make the browser send is not a
	// credential.
	if (isWrite && isCrossSite(req)) {
		res.status(403).end(JSON.stringify({ ok: false, error: "跨站請求被拒絕" }));
		return false;
	}
	// A cookie-driven write has to say where it came from. A script with a
	// bearer token is not steered by a web page and is allowed to omit it.
	if (
		isWrite &&
		viaCookie &&
		!req.headers.origin &&
		!req.headers["sec-fetch-site"]
	) {
		res.status(403).end(JSON.stringify({ ok: false, error: "來源不明" }));
		return false;
	}
	// Roles. A viewer reads; a pharmacist enters cases and exports the study
	// sheet; an admin changes what the hospital teaches.
	if (WRITE_ROUTES.has(key) && session.role === "viewer") {
		res.status(403).end(JSON.stringify({ ok: false, error: "此帳號為唯讀" }));
		return false;
	}
	if (ADMIN_ONLY_ROUTES.has(key) && session.role !== "admin") {
		res.status(403).end(JSON.stringify({ ok: false, error: "需要管理員權限" }));
		return false;
	}
	return true;
}

export default async function handler(req, res) {
	applySecurityHeaders(res);

	if (req.method === "OPTIONS") {
		applyCors(req, res);
		res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
		res.setHeader(
			"Access-Control-Allow-Headers",
			"Content-Type, Authorization, X-Line-Signature",
		);
		res.status(204).end();
		return;
	}

	applyCors(req, res);
	res.setHeader("Content-Type", "application/json; charset=utf-8");

	const path = getNormalizedPath(req);
	const key = `${req.method} ${path}`;

	if (ADMIN_ENDPOINTS.has(key)) {
		try {
			const raw = req.method === "POST" ? await readRaw(req) : Buffer.alloc(0);
			await handleAuthEndpoint(req, res, key, raw);
		} catch (err) {
			res.status(500).end(JSON.stringify({ ok: false, error: err.message }));
		}
		return;
	}

	const name = ROUTES[key];

	if (!name) {
		res
			.status(404)
			.end(JSON.stringify({ ok: false, error: `no route for ${key}` }));
		return;
	}

	try {
		// ── the guard ────────────────────────────────────────────────────────
		if (!(await authorize(req, res, key, path))) return;

		// The body is read as bytes and kept as bytes: the signature is
		// computed over the exact bytes LINE sent (parsing then re-serialising
		// the JSON would change them), and the spreadsheet import needs the
		// file, not a string of it.
		const raw = req.method === "POST" ? await readRaw(req) : Buffer.alloc(0);
		let signatureVerified = false;
		if (req.method === "POST" && LINE_WEBHOOK_PATHS.has(path)) {
			const verdict = verifySignature({
				secret: process.env.LINE_CHANNEL_SECRET,
				body: raw.toString("utf8"),
				signature: req.headers["x-line-signature"],
			});
			signatureVerified = verdict.ok;
			// A configured secret makes a bad signature fatal. No secret means
			// the deploy is not finished; the request is still answered, but the
			// response says plainly that it was not verified.
			if (!verdict.ok && process.env.LINE_CHANNEL_SECRET) {
				res
					.status(401)
					.end(JSON.stringify({ ok: false, error: "invalid LINE signature" }));
				return;
			}
		}

		const routes = getRoutes();
		const url = new URL(req.url ?? "/", "http://localhost");
		const params = Object.fromEntries(url.searchParams);

		const body =
			req.method === "POST"
				? BINARY_BODY_PATHS.has(path)
					? raw
					: parseJson(raw.toString("utf8"))
				: undefined;
		const out = await routes[name](
			body ?? params,
			body && params ? params : undefined,
		);
		// A spreadsheet comes back as bytes, not as JSON.
		if (Buffer.isBuffer(out)) {
			res.setHeader(
				"Content-Type",
				"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
			);
			res.setHeader(
				"Content-Disposition",
				'attachment; filename="inhaler-export.xlsx"',
			);
			res.status(200).end(out);
			return;
		}
		const payload =
			LINE_WEBHOOK_PATHS.has(path) && out && typeof out === "object"
				? { ...out, signatureVerified }
				: out;
		res.status(200).end(JSON.stringify(payload));
	} catch (err) {
		const status = err instanceof HttpError ? err.status : 500;
		if (status === 500) console.error("[api]", key, err);
		res.status(status).end(JSON.stringify({ ok: false, error: err.message }));
	}
}

async function readRaw(req) {
	const chunks = [];
	for await (const c of req) chunks.push(c);
	return Buffer.concat(chunks);
}

function parseJson(raw) {
	if (!raw) return {};
	try {
		return JSON.parse(raw);
	} catch {
		throw new HttpError(400, "body is not valid JSON");
	}
}

export { createHash, randomUUID };
