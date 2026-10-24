/**
 * The rule that decides which database may be emptied.
 *
 * A test run once emptied the deployment's database, because the scripts read
 * DATABASE_URL and that variable holds the deployment's URL. So the rule is
 * now: only a database named `inhaler_test` may be emptied, the scripts carry
 * their own URL, and the database itself refuses (db/schema.sql).
 *
 * These tests are about the rule, not about a database: they touch nothing.
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
	assertScratchDatabase,
	databaseNameOf,
	isScratchDatabase,
	SCRATCH_DATABASE_NAMES,
	scratchDatabaseUrl,
} from "../scripts/scratch-db.mjs";

const PRODUCTION = "postgres://user:pass@db.example.com:5432/neondb";
const SCRATCH = "postgres://user:pass@db.example.com:5432/inhaler_test";

describe("which database may be emptied", () => {
	it("reads the database's name", () => {
		assert.equal(databaseNameOf(PRODUCTION), "neondb");
		assert.equal(databaseNameOf(SCRATCH), "inhaler_test");
		assert.equal(databaseNameOf(""), null);
		assert.equal(databaseNameOf("not a url"), null);
	});

	it("knows the deployment's database is not one of them", () => {
		assert.equal(isScratchDatabase(PRODUCTION), false);
		assert.equal(isScratchDatabase(SCRATCH), true);
		for (const name of SCRATCH_DATABASE_NAMES) {
			assert.equal(
				isScratchDatabase(`postgres://u:p@h:5432/${name}`),
				true,
				name,
			);
		}
	});

	it("refuses the deployment's database, with an explanation", () => {
		assert.throws(
			() => assertScratchDatabase(PRODUCTION),
			/neondb/,
			"the message has to name the database it refused",
		);
		assert.throws(() => assertScratchDatabase(PRODUCTION), /inhaler_test/);
	});

	it("takes the scratch database from the deployment's URL", () => {
		// The mistake is not merely unlikely: with the deployment's URL in the
		// environment, the test scripts resolve to the scratch database.
		assert.equal(
			databaseNameOf(scratchDatabaseUrl({ DATABASE_URL: PRODUCTION })),
			"inhaler_test",
		);
	});

	it("refuses a scratch URL that points at the deployment", () => {
		assert.throws(
			() => scratchDatabaseUrl({ DATABASE_URL_SCRATCH: PRODUCTION }),
			/neondb/,
		);
	});

	it("says what to do when there is no URL at all", () => {
		assert.throws(() => scratchDatabaseUrl({}), /DATABASE_URL/);
	});
});
