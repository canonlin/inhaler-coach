/**
 * Admin sign-in: password hashing, sessions, and the table that says which
 * endpoint belongs to whom.
 *
 * Two audiences share this API.
 *
 *   - The patient end. A browser-only coaching loop: no install, no account,
 *     no login. It writes its session to POST /api/sessions and, for the LINE
 *     channel, registers through the LIFF endpoints. Those endpoints are
 *     public by design — adding a login would break the one promise this
 *     project makes to patients.
 *
 *   - The back office. It reads and writes medical record numbers, exports
 *     spreadsheets and changes what the hospital teaches. It must not be
 *     reachable by a stranger on the open internet.
 *
 * The split lives in PUBLIC_ENDPOINTS below, so there is exactly one list to
 * read when someone adds a route. Anything not on the list needs a session.
 * The safe default is closed: a new endpoint is protected unless somebody
 * deliberately says otherwise.
 *
 * Nothing here talks about a medical record number. The auth layer knows about
 * accounts and sessions only.
 */
import {
	createHash,
	randomBytes,
	scrypt as scryptCallback,
	timingSafeEqual,
} from "node:crypto";
import { promisify } from "node:util";

import { HttpError } from "./http-error.mjs";

const scrypt = promisify(scryptCallback);

/**
 * scrypt parameters. N=16384 with r=8 costs ~16 MB and ~50 ms per hash on the
 * hardware this runs on, which is the right order of magnitude for an account
 * that a pharmacist signs into once or twice a day.
 */
const SCRYPT = { N: 16384, r: 8, p: 1 };
const KEY_LENGTH = 64;
const SALT_LENGTH = 16;

/**
 * A working day. The counter tablet is shared, and a session that outlives the
 * shift is a session left on the tablet.
 */
export const SESSION_TTL_MS = 12 * 60 * 60 * 1000;

/** The cookie the browser keeps. HttpOnly so no script can read it. */
export const SESSION_COOKIE = "inhaler_admin";

const MAX_FAILED_ATTEMPTS = 5;
const LOCK_MS = 15 * 60 * 1000;

/**
 * Endpoints anyone may reach.
 *
 * Each entry is "METHOD /path". Two rules decide membership:
 *
 *   1. It must be needed by a patient who has not signed in anywhere.
 *   2. It must not carry medical data out.
 *
 * GET /api/reference is deliberately absent: it carries the education quiz's
 * answer key, and the quiz is what the QCC measures.
 */
export const PUBLIC_ENDPOINTS = new Set([
	// Liveness only. No data.
	"GET /api/health",
	// The patient's own coaching session. The browser writes it directly; the
	// record number is hashed server-side and never comes back.
	"POST /api/sessions",
	// LINE's own webhook. It proves itself with an HMAC over the raw body.
	"POST /api/line/webhook",
	"POST /api/line/event",
	// The patient binds their own LINE account from the LIFF page.
	"POST /api/line/link",
	"POST /api/line/journeys",
]);

/** Endpoints that answer to the scheduler rather than to a browser. */
export const CRON_ENDPOINTS = new Set([
	"POST /api/line/dispatch",
	"GET /api/line/dispatch",
]);

/** Endpoints the back office calls with a signed-in session. */
export const ADMIN_ENDPOINTS = new Set([
	"POST /api/auth/login",
	"POST /api/auth/logout",
	"GET /api/auth/me",
]);

/** Is this route reachable without a session? */
export function isPublic(method, path) {
	return PUBLIC_ENDPOINTS.has(`${method} ${path}`);
}

/**
 * Is this route one that reads or writes patient data?
 *
 * Used by the guard to decide how strict to be: a GET can be satisfied by a
 * session cookie, a write additionally has to come from our own origin.
 */
export function isAdmin(method, path) {
	return (
		!isPublic(method, path) &&
		!CRON_ENDPOINTS.has(`${method} ${path}`) &&
		!ADMIN_ENDPOINTS.has(`${method} ${path}`)
	);
}

// ── passwords ────────────────────────────────────────────────────────────────

/**
 * Hash a password.
 *
 * The result is one self-describing string:
 *   scrypt$N$r$p$salt$hash
 * so the parameters travel with the hash. Raising N later does not invalidate
 * the accounts already stored, and an old hash can still be checked.
 */
export async function hashPassword(password) {
	const salt = randomBytes(SALT_LENGTH);
	const derived = await scrypt(password, salt, KEY_LENGTH, SCRYPT);
	return [
		"scrypt",
		SCRYPT.N,
		SCRYPT.r,
		SCRYPT.p,
		salt.toString("base64"),
		derived.toString("base64"),
	].join("$");
}

/**
 * Check a password against a stored hash.
 *
 * Every failure returns false, and the comparison is timing-safe, so the
 * response says nothing about which half was wrong.
 */
export async function verifyPassword(password, stored) {
	try {
		const [scheme, N, r, p, saltB64, hashB64] = String(stored ?? "").split("$");
		if (scheme !== "scrypt") return false;
		const salt = Buffer.from(saltB64, "base64");
		const expected = Buffer.from(hashB64, "base64");
		if (!salt.length || !expected.length) return false;
		const derived = await scrypt(password, salt, expected.length, {
			N: Number(N),
			r: Number(r),
			p: Number(p),
		});
		return timingSafeEqual(derived, expected);
	} catch {
		return false;
	}
}

/**
 * The shortest password this system accepts.
 *
 * Twelve characters, because the account is a hospital workstation with
 * medical data behind it, and because a passphrase is the only thing an
 * elderly pharmacist will actually remember without a password manager.
 */
export const MIN_PASSWORD_LENGTH = 12;

export function checkPasswordPolicy(password) {
	const value = String(password ?? "");
	if (value.length < MIN_PASSWORD_LENGTH) {
		return `密碼至少需要 ${MIN_PASSWORD_LENGTH} 個字元`;
	}
	if (value.length > 200) return "密碼過長";
	return null;
}

// ── tokens ───────────────────────────────────────────────────────────────────

/** A fresh session token: 32 random bytes, URL-safe. */
export function newSessionToken() {
	return randomBytes(32).toString("base64url");
}

/**
 * What the database stores instead of the token.
 *
 * SHA-256, not a password hash: the token is 256 bits of entropy, so there is
 * nothing to brute-force, and lookups must be a single indexed equality.
 */
export function hashToken(token) {
	return createHash("sha256").update(String(token)).digest("hex");
}

/** Read one cookie out of a Cookie header. */
export function parseCookies(header) {
	const out = {};
	for (const part of String(header ?? "").split(";")) {
		const idx = part.indexOf("=");
		if (idx < 0) continue;
		const name = part.slice(0, idx).trim();
		if (!name) continue;
		out[name] = decodeURIComponent(part.slice(idx + 1).trim());
	}
	return out;
}

/**
 * The Set-Cookie value for a signed-in browser.
 *
 * HttpOnly keeps the token out of reach of any script on the page, which is
 * what makes an XSS bug unable to steal the session. SameSite=Lax stops other
 * sites from driving the browser into a write; the origin check in the guard
 * covers what Lax lets through.
 */
export function sessionCookie(token, { secure = true } = {}) {
	const attrs = [
		`${SESSION_COOKIE}=${token}`,
		"Path=/",
		"HttpOnly",
		"SameSite=Lax",
		`Max-Age=${Math.floor(SESSION_TTL_MS / 1000)}`,
	];
	if (secure) attrs.push("Secure");
	return attrs.join("; ");
}

/** The Set-Cookie value that ends a session. */
export function clearedCookie() {
	return [
		`${SESSION_COOKIE}=`,
		"Path=/",
		"HttpOnly",
		"SameSite=Lax",
		"Max-Age=0",
		"Secure",
	].join("; ");
}

// ── accounts ─────────────────────────────────────────────────────────────────

/**
 * Create or update an account.
 *
 * There is no public sign-up: a pharmacist is added by someone who already
 * holds the console. The email is the login name, lower-cased so that
 * "A@b.c" and "a@b.c" are the same person.
 */
export async function upsertAdminUser(
	query,
	{ email, password, displayName, role = "pharmacist" },
) {
	const login = String(email ?? "")
		.trim()
		.toLowerCase();
	if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(login)) {
		throw new HttpError(400, "email is not a valid address");
	}
	const policy = checkPasswordPolicy(password);
	if (policy) throw new HttpError(400, policy);
	if (!displayName) throw new HttpError(400, "displayName is required");
	if (!["admin", "pharmacist", "viewer"].includes(role)) {
		throw new HttpError(400, `unknown role ${role}`);
	}

	const hash = await hashPassword(password);
	const { rows } = await query(
		`INSERT INTO admin_users (email, display_name, password_hash, role)
		 VALUES ($1,$2,$3,$4)
		 ON CONFLICT (email) DO UPDATE
		   SET display_name = EXCLUDED.display_name,
		       password_hash = EXCLUDED.password_hash,
		       role = EXCLUDED.role,
		       active = true,
		       failed_attempts = 0,
		       locked_until = NULL
		 RETURNING id, email, display_name, role`,
		[login, String(displayName), hash, role],
	);
	return rows[0];
}

/**
 * Sign in.
 *
 * The same message is returned for an unknown address, a wrong password and a
 * locked account, so the endpoint cannot be used to find out who has an
 * account here.
 */
export async function login(
	query,
	{ email, password, ip = null, userAgent = null },
) {
	const login = String(email ?? "")
		.trim()
		.toLowerCase();
	const { rows } = await query(
		`SELECT id, email, display_name, password_hash, role, active,
		        failed_attempts, locked_until
		 FROM admin_users WHERE email = $1`,
		[login],
	);
	const user = rows[0];

	const locked = user?.locked_until
		? new Date(user.locked_until).getTime() > Date.now()
		: false;
	if (!user || !user.active || locked) {
		if (user && !locked && !user.active) {
			// The account exists but is disabled. Count it as a failure so a
			// probe cannot keep trying without cost.
			await recordFailure(query, user.id);
		}
		throw new HttpError(401, "帳號或密碼不正確");
	}

	if (!(await verifyPassword(String(password ?? ""), user.password_hash))) {
		await recordFailure(query, user.id);
		throw new HttpError(401, "帳號或密碼不正確");
	}

	const token = newSessionToken();
	const expiresAt = new Date(Date.now() + SESSION_TTL_MS);
	await query(
		`UPDATE admin_users SET failed_attempts = 0, locked_until = NULL,
		        last_login_at = now() WHERE id = $1`,
		[user.id],
	);
	await query(
		`INSERT INTO admin_sessions (token_hash, admin_user_id, expires_at, user_agent, ip)
		 VALUES ($1,$2,$3,$4,$5)`,
		[hashToken(token), user.id, expiresAt.toISOString(), userAgent, ip],
	);
	return {
		token,
		expiresAt,
		user: {
			id: user.id,
			email: user.email,
			displayName: user.display_name,
			role: user.role,
		},
	};
}

async function recordFailure(query, userId) {
	await query(
		`UPDATE admin_users
		    SET failed_attempts = failed_attempts + 1,
		        locked_until = CASE
		          WHEN failed_attempts + 1 >= $2 THEN now() + ($3 || ' milliseconds')::interval
		          ELSE locked_until
		        END
		  WHERE id = $1`,
		[userId, MAX_FAILED_ATTEMPTS, String(LOCK_MS)],
	);
}

// ── per-address throttle ─────────────────────────────────────────────────────

/**
 * A second brake, on the address rather than the account.
 *
 * The account lock stops one account being guessed. It does not stop one
 * address trying every account in turn. This counts attempts per address in
 * a window and refuses the ones that go too fast.
 *
 * It is deliberately best-effort: serverless instances are not shared, so the
 * count is per instance rather than global. That is still worth having — it
 * stops the naive case — and the account lock is what actually holds.
 */
const IP_ATTEMPTS = new Map();
const IP_WINDOW_MS = 15 * 60 * 1000;
const IP_MAX_ATTEMPTS = 20;
const IP_MAX_TRACKED = 5_000;

export function checkLoginThrottle(ip) {
	if (!ip) return null;
	const now = Date.now();
	const entry = IP_ATTEMPTS.get(ip);
	if (!entry || now - entry.first > IP_WINDOW_MS) return null;
	if (entry.count < IP_MAX_ATTEMPTS) return null;
	return {
		retryAfterSeconds: Math.ceil((IP_WINDOW_MS - (now - entry.first)) / 1000),
	};
}

export function noteLoginAttempt(ip) {
	if (!ip) return;
	const now = Date.now();
	const entry = IP_ATTEMPTS.get(ip);
	if (!entry || now - entry.first > IP_WINDOW_MS) {
		// Keep the map from growing without bound on a long-lived instance.
		if (IP_ATTEMPTS.size > IP_MAX_TRACKED) {
			for (const [key, value] of IP_ATTEMPTS) {
				if (now - value.first > IP_WINDOW_MS) IP_ATTEMPTS.delete(key);
			}
		}
		IP_ATTEMPTS.set(ip, { first: now, count: 1 });
		return;
	}
	entry.count += 1;
}

/**
 * The signed-in account behind a token, or null.
 *
 * An expired session is deleted on the way past, so the table does not
 * accumulate rows for tokens that will never be used again.
 */
export async function resolveSession(query, token) {
	if (!token) return null;
	const { rows } = await query(
		`SELECT s.token_hash, s.expires_at, s.last_seen_at,
		        u.id, u.email, u.display_name, u.role, u.active
		 FROM admin_sessions s
		 JOIN admin_users u ON u.id = s.admin_user_id
		 WHERE s.token_hash = $1`,
		[hashToken(token)],
	);
	const row = rows[0];
	if (!row) return null;
	if (new Date(row.expires_at).getTime() <= Date.now()) {
		await query(`DELETE FROM admin_sessions WHERE token_hash = $1`, [
			row.token_hash,
		]);
		return null;
	}
	if (!row.active) return null;

	// Touch the session so an audit can show when it was last used. Once a
	// minute is enough; more is just write amplification.
	const lastSeen = new Date(row.last_seen_at).getTime();
	if (Date.now() - lastSeen > 60_000) {
		await query(
			`UPDATE admin_sessions SET last_seen_at = now() WHERE token_hash = $1`,
			[row.token_hash],
		);
	}

	return {
		id: row.id,
		email: row.email,
		displayName: row.display_name,
		role: row.role,
		expiresAt: row.expires_at,
	};
}

/** End a session. */
export async function logout(query, token) {
	if (!token) return false;
	const { rowCount } = await query(
		`DELETE FROM admin_sessions WHERE token_hash = $1`,
		[hashToken(token)],
	);
	return rowCount > 0;
}

/** Delete sessions whose expiry has passed. Called by the maintenance script. */
export async function purgeExpiredSessions(query) {
	const { rowCount } = await query(
		`DELETE FROM admin_sessions WHERE expires_at <= now()`,
	);
	return rowCount;
}
