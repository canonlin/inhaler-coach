/**
 * Which database may be emptied.
 *
 * The project's Neon instance carries two databases: `inhaler` is the
 * deployment's, `inhaler_test` is disposable. They used to be reached through
 * the same variable — DATABASE_URL — with the deployment's value sitting in
 * .env.local, so a script that emptied a table and a script that deployed the
 * app read the same string. That is how a test run, a demo seed, or one line of
 * ad-hoc SQL could delete the pharmacist's patients and still report green.
 *
 * So the destructive path gets its own binding and its own rule:
 *
 *   - The scripts that empty tables take their URL from `scratchDatabaseUrl()`,
 *     never from DATABASE_URL. There is no code path where "the app's
 *     database" and "the database we are about to empty" are the same
 *     variable.
 *   - The URL that comes out has to be a scratch database *by name*. Not "it
 *     looked empty" — empty is a property that changes; the name does not.
 *   - The database itself refuses: a BEFORE TRUNCATE trigger on the clinical
 *     tables raises unless the session says it is disposable, and only a
 *     database named in the allowlist has that permission (set by
 *     scripts/migrate.mjs). This is the layer that survives a typo, a copied
 *     command line, and an agent with the credentials in its environment.
 *
 * The rule is one rule: only `inhaler_test` may be emptied.
 */

/** The disposable database's name. The deployment's is anything else. */
export const SCRATCH_DATABASE_NAME = "inhaler_test";

/**
 * Database names that may be emptied.
 *
 * A local Postgres for development counts, because a developer's own machine
 * is disposable by definition — but it has to be named, so the rule stays
 * "the name decides" rather than "the host decides".
 */
export const SCRATCH_DATABASE_NAMES = [
	SCRATCH_DATABASE_NAME,
	"inhaler_test_local",
	"inhaler_test_ci",
];

/** The database name in a Postgres URL. */
export function databaseNameOf(url) {
	if (!url) return null;
	try {
		const name = new URL(url).pathname.replace(/^\/+/, "");
		return name || null;
	} catch {
		return null;
	}
}

/** Is this a database that may be emptied? */
export function isScratchDatabase(url) {
	const name = databaseNameOf(url);
	return name !== null && SCRATCH_DATABASE_NAMES.includes(name);
}

/**
 * Refuse to go on unless this is a disposable database.
 *
 * The message says what to do, because the person reading it is usually
 * holding the wrong URL and needs to know which one to use.
 */
export function assertScratchDatabase(url, what = "這支腳本") {
	if (isScratchDatabase(url)) return url;
	const name = databaseNameOf(url);
	throw new Error(
		[
			"",
			`  ${what} 會清空資料表，而「${name ?? "未知"}」不是可以清空的資料庫。`,
			"",
			"  只有拿名字是下面這些的資料庫才可以被清空：",
			...SCRATCH_DATABASE_NAMES.map((n) => `    ${n}`),
			"",
			"  正式部署的資料庫不是。病人資料在那裡，清掉不會有人再說一聲。",
			"",
			"  請用 scratch 庫跑：",
			"    DATABASE_URL_SCRATCH=…/inhaler_test bun run test",
			"  或把 DATABASE_URL 指向 scratch 庫——它會自動換成 inhaler_test。",
			"",
		].join("\n"),
	);
}

/**
 * The URL of the disposable database.
 *
 * `DATABASE_URL_SCRATCH` wins when it is set. Otherwise the scratch URL is
 * derived from DATABASE_URL by swapping the database name — so a developer
 * who has the deployment's URL in .env.local and runs `bun run test` gets the
 * scratch database, not the deployment's. The mistake is not merely unlikely
 * here; it is not expressible.
 */
export function scratchDatabaseUrl(env = process.env) {
	if (env.DATABASE_URL_SCRATCH) {
		return assertScratchDatabase(
			env.DATABASE_URL_SCRATCH,
			"DATABASE_URL_SCRATCH 指向的資料庫",
		);
	}
	const base = env.DATABASE_URL;
	if (!base) {
		throw new Error(
			[
				"",
				"  DATABASE_URL 沒有設定，找不到 scratch 資料庫的網址。",
				"",
				"  測試與任何會清空資料表的腳本都需要它：",
				"    DATABASE_URL=…/inhaler bun run test",
				"    （網址裡的庫名會被換成 inhaler_test）",
				"",
			].join("\n"),
		);
	}
	const url = new URL(base);
	url.pathname = `/${SCRATCH_DATABASE_NAME}`;
	return assertScratchDatabase(url.toString());
}
