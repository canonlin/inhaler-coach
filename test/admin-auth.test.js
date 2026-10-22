/**
 * The back office's front door.
 *
 * Two things are being checked here, and they are not the same thing:
 *
 *   - The cryptography: a password is stored as a salted scrypt hash, a
 *     session token is stored as a hash of a hash, and neither can be read
 *     back into a credential.
 *   - The gate: a route that touches patient data must refuse a stranger,
 *     and a route the patient end needs must stay open. The second is the
 *     one that is easy to break by accident — adding a login to the patient
 *     end would break the one promise this project makes.
 *
 * The gate is checked against a real Postgres, because the whole point of a
 * gate is that it stands between a request and the data.
 */
import assert from "node:assert/strict";
import { after, before, describe, it } from "node:test";

import {
	ADMIN_ENDPOINTS,
	CRON_ENDPOINTS,
	checkPasswordPolicy,
	clearedCookie,
	hashPassword,
	hashToken,
	isPublic,
	login,
	logout,
	MIN_PASSWORD_LENGTH,
	newSessionToken,
	PUBLIC_ENDPOINTS,
	parseCookies,
	resolveSession,
	sessionCookie,
	upsertAdminUser,
	verifyPassword,
} from "../api/auth.mjs";
import { createPool } from "../api/db.mjs";
import handler from "../api/index.mjs";
import { ROUTES } from "../api/route-table.mjs";

const URL = process.env.DATABASE_URL;
if (!URL) {
	console.error("DATABASE_URL is not set. Run via: bun run test");
	process.exit(1);
}

const PASSWORD = "yunlin-pharmacy-2026";
const EMAIL = "pharmacist.test@yunlin.org.tw";

/** A request the handler can read. */
function mockReq({ method = "GET", url = "/", headers = {}, body = "" } = {}) {
	return {
		method,
		url,
		headers,
		socket: { encrypted: false, remoteAddress: "127.0.0.1" },
		async *[Symbol.asyncIterator]() {
			if (body) yield Buffer.from(body);
		},
	};
}

/** A response the handler can write. */
function mockRes() {
	return {
		statusCode: 200,
		headers: {},
		body: "",
		setHeader(key, value) {
			this.headers[key.toLowerCase()] = value;
		},
		status(code) {
			this.statusCode = code;
			return this;
		},
		end(payload) {
			this.body = payload === undefined ? "" : String(payload);
			return this;
		},
	};
}

describe("password storage", () => {
	it("never stores the password itself", async () => {
		const hash = await hashPassword(PASSWORD);
		assert.ok(!hash.includes(PASSWORD));
		assert.match(hash, /^scrypt\$\d+\$\d+\$\d+\$/);
	});

	it("salts, so two accounts with the same password hash differently", async () => {
		const a = await hashPassword(PASSWORD);
		const b = await hashPassword(PASSWORD);
		assert.notEqual(a, b);
	});

	it("accepts the right password", async () => {
		const hash = await hashPassword(PASSWORD);
		assert.equal(await verifyPassword(PASSWORD, hash), true);
	});

	it("refuses the wrong password", async () => {
		const hash = await hashPassword(PASSWORD);
		assert.equal(await verifyPassword(`${PASSWORD}x`, hash), false);
	});

	it("refuses a stored value it cannot read instead of throwing", async () => {
		assert.equal(await verifyPassword(PASSWORD, "not-a-hash"), false);
		assert.equal(await verifyPassword(PASSWORD, ""), false);
		assert.equal(await verifyPassword(PASSWORD, undefined), false);
	});
});

describe("password policy", () => {
	it("asks for a passphrase, not a PIN", () => {
		assert.match(checkPasswordPolicy("short"), /至少/);
		assert.equal(checkPasswordPolicy("x".repeat(MIN_PASSWORD_LENGTH)), null);
	});
});

describe("session tokens", () => {
	it("is random enough to be unguessable", () => {
		const a = newSessionToken();
		const b = newSessionToken();
		assert.notEqual(a, b);
		assert.ok(a.length >= 40);
	});

	it("is stored as a hash, so the table cannot be replayed", () => {
		const token = newSessionToken();
		assert.notEqual(hashToken(token), token);
		assert.equal(hashToken(token), hashToken(token));
		assert.notEqual(hashToken(token), hashToken(newSessionToken()));
	});
});

describe("the session cookie", () => {
	it("is unreadable by scripts and does not travel to other sites", () => {
		const cookie = sessionCookie("abc", { secure: true });
		assert.match(cookie, /HttpOnly/);
		assert.match(cookie, /SameSite=Lax/);
		assert.match(cookie, /Secure/);
	});

	it("is cleared on the way out", () => {
		assert.match(clearedCookie(), /Max-Age=0/);
	});

	it("is read back out of a Cookie header", () => {
		const cookies = parseCookies("inhaler_admin=tok123; other=1");
		assert.equal(cookies.inhaler_admin, "tok123");
		assert.equal(cookies.other, "1");
	});
});

describe("the route table", () => {
	it("leaves the patient's own paths open", () => {
		assert.equal(isPublic("POST", "/api/sessions"), true);
		assert.equal(isPublic("POST", "/api/line/webhook"), true);
		assert.equal(isPublic("POST", "/api/line/journeys"), true);
		assert.equal(isPublic("GET", "/api/health"), true);
	});

	it("closes every path that carries patient data", () => {
		const closed = [
			"GET /api/cases",
			"POST /api/cases",
			"POST /api/cases/lookup",
			"GET /api/metrics/summary",
			"GET /api/followups",
			"POST /api/followups/close",
			"GET /api/sessions/pending",
			"GET /api/reference",
			"GET /api/line/engagement",
			"GET /api/line/quota",
			"GET /api/line/journey",
			"GET /api/line/plan",
			"POST /api/line/send",
			"POST /api/admin/config",
			"POST /api/import/cases",
			"GET /api/export/cases.xlsx",
		];
		for (const entry of closed) {
			const [method, path] = entry.split(" ");
			assert.equal(
				isPublic(method, path),
				false,
				`${entry} must not be public`,
			);
		}
	});

	it("keeps the quiz's answer key out of the open", () => {
		// GET /api/reference carries the education quiz's answers. The quiz is
		// what the QCC measures, so the key is not public.
		assert.equal(isPublic("GET", "/api/reference"), false);
	});

	it("keeps the sign-in endpoints reachable without a session", () => {
		assert.ok(ADMIN_ENDPOINTS.has("POST /api/auth/login"));
		assert.ok(ADMIN_ENDPOINTS.has("POST /api/auth/logout"));
		assert.ok(ADMIN_ENDPOINTS.has("GET /api/auth/me"));
	});

	it("gives the dispatch routes to the scheduler, not to a browser", () => {
		// A dispatch reaches a patient's phone. It answers to the cron secret
		// and to nothing else, so it is not on the public list and it is not
		// on the browser's list either.
		assert.ok(CRON_ENDPOINTS.has("GET /api/line/dispatch"));
		assert.ok(CRON_ENDPOINTS.has("POST /api/line/dispatch"));
		for (const key of CRON_ENDPOINTS) {
			const [method, path] = key.split(" ");
			assert.equal(isPublic(method, path), false, `${key} must not be public`);
		}
	});

	it("has no route that is neither public nor guarded", () => {
		// The public surface is written out in full on purpose. A route that
		// joins it has to be a deliberate act, and this list is where the
		// deliberate act is recorded. Everything not on it needs a session.
		const expected = [
			"GET /api/health",
			"POST /api/sessions",
			"POST /api/line/webhook",
			"POST /api/line/event",
			"POST /api/line/link",
			"POST /api/line/journeys",
		].sort();
		assert.deepEqual([...PUBLIC_ENDPOINTS].sort(), expected);

		// Every entry in the public list names a route that exists, so the list
		// cannot drift away from the table and quietly stop meaning anything.
		for (const entry of PUBLIC_ENDPOINTS) {
			assert.ok(ROUTES[entry], `${entry} is listed public but has no route`);
		}
	});
});

describe("signing in", () => {
	let pool;
	let query;

	before(async () => {
		pool = createPool(URL);
		query = (text, params) => pool.query(text, params);
		// Only this file's own accounts are removed. Truncating admin_users
		// would delete the real back-office accounts on the deployed database,
		// and a test that destroys the thing it is supposed to protect is a
		// test that has to be re-run before every deployment.
		await pool.query(
			`DELETE FROM admin_users WHERE email LIKE '%.test@yunlin.org.tw'`,
		);
	});

	after(async () => {
		// Leave the deployed database as it was found. A test that creates an
		// account and walks away is a test that leaves a way in.
		await pool?.query(
			`DELETE FROM admin_users WHERE email LIKE '%.test@yunlin.org.tw'`,
		);
		await pool?.end();
	});

	it("creates an account and signs in with the right password", async () => {
		await upsertAdminUser(query, {
			email: EMAIL,
			password: PASSWORD,
			displayName: "測試藥師",
			role: "pharmacist",
		});
		const result = await login(query, { email: EMAIL, password: PASSWORD });
		assert.ok(result.token);
		assert.equal(result.user.email, EMAIL);
		assert.equal(result.user.role, "pharmacist");
	});

	it("treats the address as the same whatever its case", async () => {
		const result = await login(query, {
			email: EMAIL.toUpperCase(),
			password: PASSWORD,
		});
		assert.equal(result.user.email, EMAIL);
	});

	it("refuses a wrong password without saying which half was wrong", async () => {
		await assert.rejects(
			() => login(query, { email: EMAIL, password: "wrong-password-x" }),
			(err) => err.status === 401 && err.message === "帳號或密碼不正確",
		);
	});

	it("refuses an address that has no account, with the same message", async () => {
		await assert.rejects(
			() => login(query, { email: "nobody@yunlin.org.tw", password: PASSWORD }),
			(err) => err.status === 401 && err.message === "帳號或密碼不正確",
		);
	});

	it("locks the account after five failures", async () => {
		const email = "locked.test@yunlin.org.tw";
		await upsertAdminUser(query, {
			email,
			password: PASSWORD,
			displayName: "鎖定測試",
			role: "pharmacist",
		});
		for (let i = 0; i < 5; i++) {
			await assert.rejects(() =>
				login(query, { email, password: `wrong-${i}-password` }),
			);
		}
		// Even the right password is refused now.
		await assert.rejects(
			() => login(query, { email, password: PASSWORD }),
			(err) => err.status === 401,
		);
	});

	it("resolves a live session and forgets it after sign-out", async () => {
		const { token } = await login(query, { email: EMAIL, password: PASSWORD });
		const user = await resolveSession(query, token);
		assert.equal(user.email, EMAIL);
		assert.equal(user.role, "pharmacist");

		await logout(query, token);
		assert.equal(await resolveSession(query, token), null);
	});

	it("does not resolve a token that was never issued", async () => {
		assert.equal(await resolveSession(query, newSessionToken()), null);
	});

	it("does not resolve an expired session", async () => {
		const { token } = await login(query, { email: EMAIL, password: PASSWORD });
		await query(
			`UPDATE admin_sessions SET expires_at = now() - interval '1 minute'
			  WHERE token_hash = $1`,
			[hashToken(token)],
		);
		assert.equal(await resolveSession(query, token), null);
	});

	it("does not resolve a session whose account was switched off", async () => {
		const { token } = await login(query, { email: EMAIL, password: PASSWORD });
		await query(`UPDATE admin_users SET active = false WHERE email = $1`, [
			EMAIL,
		]);
		assert.equal(await resolveSession(query, token), null);
		await query(`UPDATE admin_users SET active = true WHERE email = $1`, [
			EMAIL,
		]);
	});
});

describe("the gate", () => {
	let pool;
	let query;
	let sessionCookieHeader = "";

	before(async () => {
		pool = createPool(URL);
		query = (text, params) => pool.query(text, params);
		// Same rule as above: this file's own accounts only. A truncate here
		// would delete the real back-office accounts on the deployed database.
		await pool.query(
			`DELETE FROM admin_users WHERE email LIKE '%.test@yunlin.org.tw'`,
		);
		await upsertAdminUser(query, {
			email: EMAIL,
			password: PASSWORD,
			displayName: "守衛測試",
			role: "admin",
		});
		const { token } = await login(query, { email: EMAIL, password: PASSWORD });
		sessionCookieHeader = `inhaler_admin=${token}`;
	});

	after(async () => {
		// Leave the deployed database as it was found. A test that creates an
		// account and walks away is a test that leaves a way in.
		await pool?.query(
			`DELETE FROM admin_users WHERE email LIKE '%.test@yunlin.org.tw'`,
		);
		await pool?.end();
	});

	it("refuses a stranger at a patient-data route", async () => {
		const res = mockRes();
		await handler(mockReq({ method: "GET", url: "/api/cases" }), res);
		assert.equal(res.statusCode, 401);
		assert.match(res.body, /尚未登入/);
	});

	it("refuses a stranger at the spreadsheet export", async () => {
		const res = mockRes();
		await handler(
			mockReq({ method: "GET", url: "/api/export/cases.xlsx" }),
			res,
		);
		assert.equal(res.statusCode, 401);
	});

	it("refuses a stranger at the content settings", async () => {
		const res = mockRes();
		await handler(mockReq({ method: "POST", url: "/api/admin/config" }), res);
		assert.equal(res.statusCode, 401);
	});

	it("lets a signed-in pharmacist through", async () => {
		const res = mockRes();
		await handler(
			mockReq({
				method: "GET",
				url: "/api/cases",
				headers: { cookie: sessionCookieHeader },
			}),
			res,
		);
		assert.equal(res.statusCode, 200);
		assert.match(res.body, /"ok":true/);
	});

	it("lets the patient's own session through without an account", async () => {
		const res = mockRes();
		await handler(
			mockReq({
				method: "POST",
				url: "/api/sessions",
				body: JSON.stringify({
					mrn: "A123456789",
					ageBand: "65歲以上",
					device: "MDI",
					stages: {},
				}),
				headers: { "content-type": "application/json" },
			}),
			res,
		);
		assert.equal(res.statusCode, 200);
	});

	it("refuses a write that came from another site, session or not", async () => {
		const res = mockRes();
		await handler(
			mockReq({
				method: "POST",
				url: "/api/cases",
				headers: {
					cookie: sessionCookieHeader,
					origin: "https://elsewhere.example",
					"sec-fetch-site": "cross-site",
				},
				body: "{}",
			}),
			res,
		);
		assert.equal(res.statusCode, 403);
	});

	it("refuses a cookie-driven write that does not say where it came from", async () => {
		const res = mockRes();
		await handler(
			mockReq({
				method: "POST",
				url: "/api/cases",
				headers: { cookie: sessionCookieHeader },
				body: "{}",
			}),
			res,
		);
		assert.equal(res.statusCode, 403);
	});

	it("answers with the security headers on every route", async () => {
		const res = mockRes();
		await handler(mockReq({ method: "GET", url: "/api/health" }), res);
		assert.equal(res.headers["x-content-type-options"], "nosniff");
		assert.equal(res.headers["x-frame-options"], "DENY");
		assert.ok(res.headers["strict-transport-security"]);
	});

	it("does not tell other websites that they may read the answer", async () => {
		const res = mockRes();
		await handler(
			mockReq({
				method: "GET",
				url: "/api/health",
				headers: { origin: "https://elsewhere.example" },
			}),
			res,
		);
		assert.equal(res.headers["access-control-allow-origin"], undefined);
	});

	it("answers the sign-in endpoint with a cookie the browser cannot read", async () => {
		const res = mockRes();
		await handler(
			mockReq({
				method: "POST",
				url: "/api/auth/login",
				headers: { "content-type": "application/json" },
				body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
			}),
			res,
		);
		assert.equal(res.statusCode, 200);
		assert.match(res.headers["set-cookie"], /HttpOnly/);
		assert.match(res.body, /"signedIn":true/);
	});

	it("refuses a wrong password without saying which half was wrong", async () => {
		const res = mockRes();
		await handler(
			mockReq({
				method: "POST",
				url: "/api/auth/login",
				headers: { "content-type": "application/json" },
				body: JSON.stringify({ email: EMAIL, password: "not-the-password" }),
			}),
			res,
		);
		assert.equal(res.statusCode, 401);
		assert.match(res.body, /帳號或密碼不正確/);
	});

	it("answers who is signed in, and who is not", async () => {
		const signedIn = mockRes();
		await handler(
			mockReq({
				method: "GET",
				url: "/api/auth/me",
				headers: { cookie: sessionCookieHeader },
			}),
			signedIn,
		);
		assert.equal(signedIn.statusCode, 200);
		assert.match(signedIn.body, /"signedIn":true/);

		const anonymous = mockRes();
		await handler(mockReq({ method: "GET", url: "/api/auth/me" }), anonymous);
		assert.equal(anonymous.statusCode, 401);
	});
});
