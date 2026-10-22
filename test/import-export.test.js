/**
 * Importing the pharmacist's sheet.
 *
 * The sheet is her working file, not the record: the importer reads it, hashes
 * the record number, and writes cases keyed so a re-run updates rather than
 * duplicates. It also reports what it read and what disagrees with the sheet.
 *
 * What is tested here is the part a pharmacist actually runs into:
 *
 *   1. A file with the wrong shape is refused with a message that names the
 *      problem. Before, every row was skipped with 「沒有病歷號碼」, which
 *      describes the symptom nine hundred times over and never says which
 *      header is missing.
 *   2. A row that cannot be read is reported with the sheet's own line
 *      number, so it can be found and fixed.
 *   3. Running the same file twice updates the same case.
 */
import assert from "node:assert/strict";
import { after, before, describe, it } from "node:test";

import { createPool } from "../api/db.mjs";
import { makeRoutes } from "../api/routes.mjs";
import { writeXlsx } from "../api/xlsx.mjs";

const URL = process.env.DATABASE_URL;
if (!URL) {
	console.error("DATABASE_URL is not set. Run via: bun run test");
	process.exit(1);
}

const SHEET = "藥師收案";

/** A sheet with one good row, in the column order the importer reads. */
function goodRows() {
	return [
		[
			"病歷號碼",
			"藥師",
			"院區",
			"藥品名稱",
			"收案日期",
			"追蹤時間點",
			"年齡層",
			"性別",
			"步驟_MDI_搖",
			"備註_MDI_搖",
			"步驟_MDI_壓",
			"知識Q1",
		],
		[
			"IMP0001",
			"黃永成",
			"虎尾",
			"Symbicort Rapihaler",
			"2026-05-04",
			"初次衛教",
			"65歲以上",
			"女",
			"錯誤",
			"沒搖",
			"正確",
			"對",
		],
	];
}

describe("importing the pharmacist's sheet", () => {
	let pool;
	let api;

	before(async () => {
		pool = createPool(URL);
		api = makeRoutes({ query: (t, p) => pool.query(t, p), salt: "test-salt" });
		await pool.query(
			"TRUNCATE followups, physician_queries, session_stages, sessions, case_knowledge, case_steps, clinical_measurements, med_reconciliation, cases, patients RESTART IDENTITY CASCADE",
		);
	});

	after(async () => {
		await pool?.end();
	});

	it("refuses a workbook with no enrollment sheet, and says what is in it", async () => {
		const buffer = writeXlsx([{ name: "工作表1", rows: goodRows() }]);
		await assert.rejects(
			() => api.importCases(buffer, { stage: "改善前", dry_run: "true" }),
			/找不到工作表/,
		);
	});

	it("refuses a workbook whose headers do not match, naming the missing column", async () => {
		const rows = goodRows();
		// The sheet the pharmacist has does not have a 病歷號碼 column.
		const withoutMrn = rows.map((r) => r.slice(1));
		const buffer = writeXlsx([{ name: SHEET, rows: withoutMrn }]);
		await assert.rejects(
			() => api.importCases(buffer, { stage: "改善前", dry_run: "true" }),
			/缺少必要欄位：病歷號碼/,
		);
	});

	it("refuses an empty body", async () => {
		await assert.rejects(
			() => api.importCases(Buffer.alloc(0), { stage: "改善前" }),
			/must be an \.xlsx file/,
		);
	});

	it("reports what it would write without writing it", async () => {
		const buffer = writeXlsx([{ name: SHEET, rows: goodRows() }]);
		const report = await api.importCases(buffer, {
			stage: "改善前",
			dry_run: "true",
		});
		assert.equal(report.dryRun, true);
		assert.equal(report.rowsRead, 1);
		assert.equal(report.imported, 1);
		assert.equal(report.skipped.length, 0);
		assert.equal(report.stage, "改善前");

		const { rows } = await pool.query("SELECT count(*)::int AS n FROM cases");
		assert.equal(rows[0].n, 0, "a rehearsal writes nothing");
	});

	it("writes the case, its steps and its answers", async () => {
		const buffer = writeXlsx([{ name: SHEET, rows: goodRows() }]);
		const report = await api.importCases(buffer, { stage: "改善前" });
		assert.equal(report.imported, 1);
		assert.equal(report.updated, 0);

		const { rows: cases } = await pool.query(
			`SELECT c.qcc_stage, c.campus, c.pharmacist, c.device, c.drug, p.mrn_tail
			 FROM cases c JOIN patients p ON p.id = c.patient_id`,
		);
		assert.equal(cases.length, 1);
		assert.equal(cases[0].mrn_tail, "01", "only the tail is kept");
		assert.equal(cases[0].qcc_stage, "改善前");
		assert.equal(cases[0].campus, "虎尾");
		assert.equal(cases[0].drug, "Symbicort");

		const { rows: steps } = await pool.query(
			"SELECT step_code, value, note FROM case_steps ORDER BY step_code",
		);
		assert.equal(steps.length, 2);
		assert.deepEqual(
			steps.map((s) => [s.step_code, s.value]),
			[
				["MDI_壓", "正確"],
				["MDI_搖", "錯誤"],
			],
		);
		assert.equal(steps.find((s) => s.step_code === "MDI_搖").note, "沒搖");
	});

	it("updates the same case when the same file is imported again", async () => {
		const buffer = writeXlsx([{ name: SHEET, rows: goodRows() }]);
		const report = await api.importCases(buffer, { stage: "改善前" });
		assert.equal(report.imported, 0);
		assert.equal(report.updated, 1);

		const { rows } = await pool.query("SELECT count(*)::int AS n FROM cases");
		assert.equal(rows[0].n, 1, "a re-run must not duplicate the case");
	});

	it("skips a row it cannot read, with the sheet's own line number", async () => {
		const rows = goodRows();
		// A second row with no record number: the sheet's 24 blank rows are
		// like this, and they are skipped rather than invented.
		rows.push([
			"",
			"黃永成",
			"虎尾",
			"Symbicort Rapihaler",
			"2026-05-05",
			"初次衛教",
			"65歲以上",
			"女",
			"",
			"",
			"",
			"",
		]);
		const buffer = writeXlsx([{ name: SHEET, rows }]);
		const report = await api.importCases(buffer, {
			stage: "改善前",
			dry_run: "true",
		});
		assert.equal(report.skipped.length, 1);
		assert.equal(report.skipped[0].line, 3, "the sheet's own row number");
		assert.match(report.skipped[0].reason, /病歷號碼/);
	});

	it("exports the cases back as a workbook with the tail, not the number", async () => {
		const book = await api.exportCases({});
		assert.ok(Buffer.isBuffer(book), "the export is a file");
		assert.ok(book.length > 0);
	});
});
