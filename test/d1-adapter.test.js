/**
 * Cloudflare D1 adapter and schema tests.
 *
 * Verifies:
 * 1. Adapter initialization & parameter validation.
 * 2. Native Cloudflare Workers D1 binding compatibility.
 * 3. Cloudflare D1 REST API query interface and error handling.
 * 4. SQLite schema DDL (db/schema-d1.sql) execution and constraint validation via node:sqlite.
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { DatabaseSync } from "node:sqlite";
import { describe, it } from "node:test";

import { createD1Adapter } from "../api/d1-adapter.mjs";

describe("Cloudflare D1 adapter", () => {
	it("throws if required credentials or binding are missing", () => {
		assert.throws(
			() =>
				createD1Adapter({
					accountId: "",
					databaseId: "",
					apiToken: "",
					d1Binding: null,
				}),
			/createD1Adapter requires CF_ACCOUNT_ID/,
		);
	});

	it("adapts native D1 binding with prepare/bind/all", async () => {
		const calls = [];
		const mockBinding = {
			prepare(sql) {
				return {
					bind(...params) {
						calls.push({ sql, params });
						return {
							async all() {
								return { results: [{ id: "p1", mrn_tail: "0001" }] };
							},
						};
					},
				};
			},
		};

		const adapter = createD1Adapter({ d1Binding: mockBinding });
		const res = await adapter.query("SELECT * FROM patients WHERE id = ?", [
			"p1",
		]);

		assert.equal(calls.length, 1);
		assert.equal(calls[0].sql, "SELECT * FROM patients WHERE id = ?");
		assert.deepEqual(calls[0].params, ["p1"]);
		assert.deepEqual(res.rows, [{ id: "p1", mrn_tail: "0001" }]);
	});

	it("executes query against Cloudflare D1 REST API", async () => {
		let requestUrl = "";
		let requestInit = null;

		const mockFetch = async (url, init) => {
			requestUrl = url;
			requestInit = init;
			return {
				ok: true,
				async json() {
					return {
						success: true,
						result: [
							{
								results: [
									{ id: "del-1", touch: "remind", sent_on: "2026-05-05" },
								],
							},
						],
					};
				},
			};
		};

		const adapter = createD1Adapter({
			accountId: "mock-acc-123",
			databaseId: "mock-db-456",
			apiToken: "mock-token-xyz",
			fetchImpl: mockFetch,
		});

		const res = await adapter.query(
			"SELECT * FROM line_deliveries WHERE line_user_id = ?",
			["U1234"],
		);

		assert.equal(
			requestUrl,
			"https://api.cloudflare.com/client/v4/accounts/mock-acc-123/d1/database/mock-db-456/query",
		);
		assert.equal(requestInit.method, "POST");
		assert.equal(requestInit.headers.Authorization, "Bearer mock-token-xyz");
		const body = JSON.parse(requestInit.body);
		assert.equal(
			body.sql,
			"SELECT * FROM line_deliveries WHERE line_user_id = ?",
		);
		assert.deepEqual(body.params, ["U1234"]);
		assert.deepEqual(res.rows, [
			{ id: "del-1", touch: "remind", sent_on: "2026-05-05" },
		]);
	});

	it("handles Cloudflare REST API HTTP errors", async () => {
		const mockFetch = async () => ({
			ok: false,
			status: 401,
			async text() {
				return "Unauthorized";
			},
		});

		const adapter = createD1Adapter({
			accountId: "acc",
			databaseId: "db",
			apiToken: "bad-token",
			fetchImpl: mockFetch,
		});

		await assert.rejects(
			async () => adapter.query("SELECT 1"),
			/Cloudflare D1 query failed \(401\): Unauthorized/,
		);
	});

	it("handles Cloudflare REST API logical errors", async () => {
		const mockFetch = async () => ({
			ok: true,
			async json() {
				return {
					success: false,
					errors: [{ message: "no such table: nonexistent_table" }],
				};
			},
		});

		const adapter = createD1Adapter({
			accountId: "acc",
			databaseId: "db",
			apiToken: "token",
			fetchImpl: mockFetch,
		});

		await assert.rejects(
			async () => adapter.query("SELECT * FROM nonexistent_table"),
			/Cloudflare D1 error: no such table: nonexistent_table/,
		);
	});
});

describe("Cloudflare D1 SQL Schema (schema-d1.sql)", () => {
	it("executes DDL successfully and satisfies table constraints", () => {
		const schemaPath = resolve(process.cwd(), "db/schema-d1.sql");
		const ddl = readFileSync(schemaPath, "utf-8");

		const db = new DatabaseSync(":memory:");
		db.exec("PRAGMA foreign_keys = ON;");
		db.exec(ddl);

		// Verify tables exist
		const tablesStmt = db.prepare(
			"SELECT name FROM sqlite_master WHERE type = 'table' ORDER BY name",
		);
		const tables = tablesStmt.all().map((r) => r.name);
		assert.ok(tables.includes("patients"));
		assert.ok(tables.includes("line_identities"));
		assert.ok(tables.includes("line_deliveries"));
		assert.ok(tables.includes("line_events"));
		assert.ok(tables.includes("line_medications"));

		// 1. Insert patient
		db.prepare(
			"INSERT INTO patients (id, mrn_hash, mrn_tail, age_band, consent_line) VALUES (?, ?, ?, ?, ?)",
		).run("p1", "hash-001", "0001", "65-74", 1);

		// 2. Insert line_identity
		db.prepare(
			"INSERT INTO line_identities (id, patient_id, line_user_id) VALUES (?, ?, ?)",
		).run("ident-1", "p1", "U_patient_1");

		// 3. Insert line_delivery
		db.prepare(
			"INSERT INTO line_deliveries (id, patient_id, line_user_id, case_id, touch, sent_on, kind, channel, payload) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
		).run(
			"del-1",
			"p1",
			"U_patient_1",
			"case-1",
			"remind",
			"2026-05-05",
			"push",
			"recording",
			JSON.stringify({ text: "Hello" }),
		);

		// Verify line_delivery uniqueness: UNIQUE (line_user_id, touch, sent_on)
		assert.throws(
			() =>
				db
					.prepare(
						"INSERT INTO line_deliveries (id, patient_id, line_user_id, case_id, touch, sent_on, kind, channel, payload) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
					)
					.run(
						"del-2",
						"p1",
						"U_patient_1",
						"case-1",
						"remind",
						"2026-05-05",
						"push",
						"recording",
						"{}",
					),
			/UNIQUE constraint failed/,
		);

		// 4. Insert line_medication
		db.prepare(
			"INSERT INTO line_medications (id, patient_id, role, drug_id, drug_name, device_line, ics) VALUES (?, ?, ?, ?, ?, ?, ?)",
		).run("med-1", "p1", "maintenance", "symbicort-160", "Symbicort", "MDI", 1);

		// Verify line_medication uniqueness: UNIQUE (patient_id, role)
		assert.throws(
			() =>
				db
					.prepare(
						"INSERT INTO line_medications (id, patient_id, role, drug_id, drug_name, device_line, ics) VALUES (?, ?, ?, ?, ?, ?, ?)",
					)
					.run(
						"med-2",
						"p1",
						"maintenance",
						"seretide-250",
						"Seretide",
						"DPI",
						1,
					),
			/UNIQUE constraint failed/,
		);

		// 5. Insert line_event
		db.prepare(
			"INSERT INTO line_events (id, patient_id, line_event_id, event_type, step_code, payload) VALUES (?, ?, ?, ?, ?, ?)",
		).run(
			"ev-1",
			"p1",
			"evt-123",
			"quiz_answer",
			"MDI_吸",
			JSON.stringify({ score: 100 }),
		);

		const events = db
			.prepare("SELECT * FROM line_events WHERE patient_id = ?")
			.all("p1");
		assert.equal(events.length, 1);
		assert.equal(events[0].event_type, "quiz_answer");
		assert.equal(events[0].step_code, "MDI_吸");

		db.close();
	});
});
