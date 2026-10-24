/**
 * A signed-in session for the design checks.
 *
 * The back office is behind a login now, so a design check that opens /admin
 * without one sees the sign-in form instead of the app. That is worse than no
 * check: the rules would be measured against the wrong screen and the gate
 * would report green.
 *
 * So the gate signs in. The account is created for the run with a random
 * password, used, and deleted afterwards. There is no fixed password here —
 * this file is tracked in a public repository, and an account with a known
 * password would be an account anyone could use.
 *
 * Run: node output/design-review/session.mjs
 */
import { randomBytes } from "node:crypto";

import { upsertAdminUser } from "../../api/auth.mjs";
import { createPool } from "../../api/db.mjs";

const API = process.env.API ?? "http://localhost:4183";

/**
 * Sign in as a temporary reviewer.
 *
 * @returns {Promise<{token: string, cleanup: () => Promise<void>}>}
 */
export async function openReviewerSession() {
	const url = process.env.DATABASE_URL;
	if (!url) {
		throw new Error("DATABASE_URL is required to open a review session");
	}
	const pool = createPool(url);
	const query = (text, params) => pool.query(text, params);

	const email = `design.review.${Date.now()}@yunlin.org.tw`;
	const password = randomBytes(24).toString("base64url");

	try {
		await upsertAdminUser(query, {
			email,
			password,
			displayName: "設計檢查",
			role: "admin",
		});
		const res = await fetch(`${API}/api/auth/login`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ email, password }),
		});
		if (!res.ok) {
			throw new Error(`sign in failed: HTTP ${res.status} ${await res.text()}`);
		}
		const setCookie = res.headers.get("set-cookie") ?? "";
		const token = setCookie.match(/inhaler_admin=([^;]+)/)?.[1];
		if (!token) throw new Error("sign in returned no session cookie");

		return {
			token,
			// The credentials are handed over as well: the checks sign in through
			// the application's own form rather than having a cookie injected
			// into the browser. A cookie the browser never accepted is a cookie
			// the check cannot trust, and the app's own sign-in is the path a
			// pharmacist actually takes.
			email,
			password,
			cleanup: async () => {
				await query(`DELETE FROM admin_users WHERE email = $1`, [email]);
				await pool.end();
			},
		};
	} catch (err) {
		await query(`DELETE FROM admin_users WHERE email = $1`, [email]);
		await pool.end();
		throw err;
	}
}

// Run directly: print the token so a shell can use it.
if (import.meta.url === `file://${process.argv[1]}`) {
	const session = await openReviewerSession();
	console.log(session.token);
	await session.cleanup();
}
