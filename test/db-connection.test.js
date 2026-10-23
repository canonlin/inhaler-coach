/**
 * A dead connection must fail fast, and a read may be tried again.
 *
 * The import check failed once with a 「read ETIMEDOUT」 that arrived long
 * after the test that caused it had finished: Neon had recycled an idle
 * pooled connection, the client kept the dead socket, and the next query on
 * it waited for a TCP timeout instead of failing. These are the two halves of
 * the fix — knowing a dead connection from a wrong query, and never waiting
 * longer than the database actually needs.
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { createPool, isDeadConnection } from "../api/db.mjs";

describe("the pool's connection failures", () => {
	it("knows a dead connection from a wrong query", () => {
		// The shapes a recycled connection takes.
		assert.equal(isDeadConnection(new Error("read ETIMEDOUT")), true);
		assert.equal(isDeadConnection(new Error("Query read timeout")), true);
		assert.equal(isDeadConnection(new Error("Connection terminated")), true);
		assert.equal(
			isDeadConnection(
				Object.assign(new Error("boom"), { code: "ECONNRESET" }),
			),
			true,
		);
		assert.equal(
			isDeadConnection(
				Object.assign(new Error("terminated"), { code: "57P01" }),
			),
			true,
		);

		// The shapes a query that was wrong takes. These must not be retried:
		// running the same statement again would fail the same way, and hiding
		// the real message behind a second failure helps nobody.
		assert.equal(
			isDeadConnection(
				new Error("duplicate key value violates unique constraint"),
			),
			false,
		);
		assert.equal(isDeadConnection(new Error("syntax error at or near")), false);
		assert.equal(
			isDeadConnection(
				Object.assign(new Error("bad value"), { code: "23505" }),
			),
			false,
		);
	});

	it("gives up on a query that never answers", () => {
		// No connection is made here: the pool only dials when it is asked to.
		const pool = createPool("postgres://nobody@127.0.0.1:1/none");
		assert.equal(
			pool.options.query_timeout,
			20_000,
			"a query must not wait for the operating system's TCP timeout",
		);
		assert.equal(pool.options.connectionTimeoutMillis, 10_000);
		return pool.end();
	});
});
