/**
 * Cloudflare D1 Query Adapter.
 *
 * Implements the same query(sql, params) interface as pg.Pool.query:
 *   returns { rows: Array<object> }
 *
 * Can query Cloudflare D1 via:
 * 1. Cloudflare REST API (when called from outside Cloudflare, e.g. Vercel/Node.js)
 * 2. Native D1 binding (when running inside Cloudflare Workers or Pages Functions)
 */

export function createD1Adapter({
	accountId = process.env.CF_ACCOUNT_ID,
	databaseId = process.env.CF_D1_DATABASE_ID,
	apiToken = process.env.CF_API_TOKEN,
	d1Binding = null,
	fetchImpl = fetch,
} = {}) {
	// 1. Native Cloudflare Workers/Pages binding
	if (d1Binding?.prepare) {
		return {
			async query(sql, params = []) {
				const stmt = d1Binding.prepare(sql).bind(...params);
				const result = await stmt.all();
				return { rows: result.results ?? [] };
			},
		};
	}

	// 2. Cloudflare D1 REST API Client
	if (!accountId || !databaseId || !apiToken) {
		throw new Error(
			"createD1Adapter requires CF_ACCOUNT_ID, CF_D1_DATABASE_ID, and CF_API_TOKEN (or d1Binding)",
		);
	}

	const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${databaseId}/query`;

	return {
		async query(sql, params = []) {
			const res = await fetchImpl(url, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${apiToken}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ sql, params }),
			});

			if (!res.ok) {
				const errorText = await res.text();
				throw new Error(
					`Cloudflare D1 query failed (${res.status}): ${errorText}`,
				);
			}

			const json = await res.json();
			if (!json.success) {
				throw new Error(
					`Cloudflare D1 error: ${json.errors?.map((e) => e.message).join(", ")}`,
				);
			}

			const results = json.result?.[0]?.results ?? [];
			return { rows: results };
		},
	};
}
