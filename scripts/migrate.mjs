/** Apply db/schema.sql to DATABASE_URL. Safe to re-run: the schema is idempotent. */
import { readFile } from "node:fs/promises";
import { createPool } from "../api/db.mjs";

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
await pool.end();
