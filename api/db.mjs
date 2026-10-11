/**
 * Postgres access for the v2 API.
 *
 * The same code runs on Neon and on a local Docker Postgres; only DATABASE_URL
 * differs. `pg` speaks standard Postgres on both.
 */
import { createHash } from "node:crypto";
import pg from "pg";

const { Pool } = pg;

/** SHA-256 the medical record number with the server-side salt. Never stored raw. */
export function hashMrn(mrn, salt) {
	if (!salt) throw new Error("MRN_SALT is not configured");
	return createHash("sha256").update(`${salt}:${mrn}`).digest("hex");
}

/** The last 2 characters are what a screen may display. */
export function mrnTail(mrn) {
	const trimmed = String(mrn).trim();
	return trimmed.slice(-2);
}

/**
 * @param {string} [url] defaults to DATABASE_URL
 * @returns {import('pg').Pool}
 */
export function createPool(url = process.env.DATABASE_URL) {
	if (!url) throw new Error("DATABASE_URL is not configured");
	return new Pool({
		connectionString: url,
		// Neon and Vercel scale to zero; keep the pool small and idle-timeout fast.
		max: 4,
		idleTimeoutMillis: 10_000,
		connectionTimeoutMillis: 10_000,
		ssl:
			url.startsWith("postgres://") && !url.includes("localhost")
				? { rejectUnauthorized: false }
				: undefined,
	});
}

/**
 * Return DATE columns as plain `YYYY-MM-DD` strings.
 *
 * pg's default parser builds a JS Date in the server's local timezone, so a
 * follow-up due 2026-07-15 reads back as 2026-07-14T16:00Z from Taipei. A
 * clinical date must never shift with the machine it was read on.
 */
pg.types.setTypeParser(pg.types.builtins.DATE, (v) => v);

let shared = null;

/** Process-wide pool, created on first use. */
export function pool() {
	if (!shared) shared = createPool();
	return shared;
}

/** Close the shared pool. Used by tests and by graceful shutdown. */
export async function closePool() {
	if (shared) {
		await shared.end();
		shared = null;
	}
}
