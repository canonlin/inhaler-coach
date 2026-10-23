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
 * Has the connection died, rather than the query being wrong?
 *
 * Neon recycles a pooled connection when it has been idle, and the client
 * keeps the socket until it notices. The next query on that socket waits for
 * a TCP timeout instead of failing, so a request hung with nothing on screen
 * and nothing in the log — which is how the import check failed with a
 * 「read ETIMEDOUT」 long after the test that caused it had finished.
 *
 * These are the shapes that mean the connection is gone. A query that was
 * wrong (a constraint, a syntax error) says something else and is not one of
 * them.
 */
export function isDeadConnection(error) {
	const message = String(error?.message ?? "");
	const code = String(error?.code ?? "");
	return (
		/ETIMEDOUT|ECONNRESET|ECONNREFUSED|EPIPE|ENOTFOUND|Query read timeout|Connection terminated|server closed the connection|Client has encountered a connection error/i.test(
			message,
		) ||
		[
			"ETIMEDOUT",
			"ECONNRESET",
			"ECONNREFUSED",
			"EPIPE",
			"ENOTFOUND",
			"57P01",
			"08000",
			"08001",
			"08003",
			"08004",
			"08006",
		].includes(code)
	);
}

/**
 * Is this statement safe to run twice?
 *
 * A read is. A write is not: an insert the server committed and then lost the
 * answer for would leave a second, identical row behind, and a clinical
 * record that exists twice is worse than one that visibly failed. A write
 * that fails is failed loudly, and every write path here is either keyed
 * (the import updates the same row) or a fresh row the pharmacist can see
 * was not saved.
 */
function isRead(text) {
	return /^\s*(select|with|explain|show|table)\b/i.test(String(text ?? ""));
}

/**
 * @param {string} [url] defaults to DATABASE_URL
 * @returns {import('pg').Pool}
 */
export function createPool(url = process.env.DATABASE_URL) {
	if (!url) throw new Error("DATABASE_URL is not configured");
	const pool = new Pool({
		connectionString: url,
		// Neon and Vercel scale to zero; keep the pool small and idle-timeout fast.
		max: 4,
		idleTimeoutMillis: 10_000,
		connectionTimeoutMillis: 10_000,
		// A query that has not answered in twenty seconds is a dead socket, not
		// a slow database. Without this the request waits for the TCP timeout —
		// minutes — and the screen shows nothing at all.
		query_timeout: 20_000,
		ssl:
			url.startsWith("postgres://") && !url.includes("localhost")
				? { rejectUnauthorized: false }
				: undefined,
	});

	/*
	 * One retry, on a fresh connection, when the connection was the problem.
	 *
	 * The dead socket is picked up out of the pool by the next query, and that
	 * query fails even though the database is perfectly well. Retrying it costs
	 * one round trip and heals the request.
	 */
	const run = pool.query.bind(pool);
	pool.query = async (text, values) => {
		try {
			return await run(text, values);
		} catch (error) {
			if (!isDeadConnection(error) || !isRead(text)) throw error;
			return await run(text, values);
		}
	};
	return pool;
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
