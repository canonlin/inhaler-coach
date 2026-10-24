/**
 * Apply db/schema.sql to DATABASE_URL. Safe to re-run: the schema is idempotent.
 *
 * The one thing it does beyond the schema: a database named in the scratch
 * allowlist is marked disposable, so that the test suite and the demo seed may
 * empty it. The deployment's database is not marked, and the schema's TRUNCATE
 * guard refuses there — which is the point of the guard.
 */
import { readFile } from "node:fs/promises";
import { createPool } from "../api/db.mjs";
import { databaseNameOf, isScratchDatabase } from "./scratch-db.mjs";

const url = process.env.DATABASE_URL;
if (!url) {
	console.error("DATABASE_URL is not set");
	process.exit(2);
}
const sql = await readFile(
	new URL("../db/schema.sql", import.meta.url),
	"utf8",
);
const pool = createPool(url);
await pool.query(sql);
const { rows } = await pool.query(
	"SELECT count(*)::int AS n FROM information_schema.tables WHERE table_schema = 'public'",
);
console.log(`applied schema · ${rows[0].n} tables present`);

/**
 * Mark the scratch database as disposable.
 *
 * The list lives in the database, and the schema's TRUNCATE guard reads it: a
 * database empties itself only if its own name is on the list. The deployment's
 * database (neondb) is not on it, so TRUNCATE fails there even for someone who
 * has the URL and the password — there is no flag to pass and no permission to
 * grant.
 */
const name = databaseNameOf(url);
if (isScratchDatabase(url)) {
	await pool.query(
		`INSERT INTO disposable_databases (name, note)
		 VALUES ($1, 'scratch database for the test suite')
		 ON CONFLICT (name) DO NOTHING`,
		[name],
	);
	console.log(`marked ${name} as disposable (emptying it is allowed there)`);
} else {
	console.log(
		`${name} is not a scratch database: emptying it is refused by the schema's guard`,
	);
}
await pool.end();
