/**
 * The 基本表格: the fields every enrollment records.
 *
 * The pharmacist's QCC sheet has a 「藥師收案」 worksheet with these columns,
 * and the old app (qcc-inhaler-platform.vercel.app) asked for all of them on
 * the first step of its 收案表單. The back office has to ask for the same
 * ones, or the pharmacist fills the same case in twice and the before/after
 * comparison ends up comparing a full row with a half row.
 *
 * The other thing tested here is the cohort. A case filed as 「改善後」 when it
 * is the enrollment has no 「改善前」 to pair against, so it does not appear in
 * the study's headline number at all — which is worse than a wrong number,
 * because the number looks right.
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

let pool;
let api;

const FULL_BASICS = {
	caseType: "初診衛教",
	ageBand: "65歲以上",
	sex: "女",
	diagnosis: "氣喘/COPD",
	usageDuration: "1-6個月",
	priorEducation: "有(院外)",
	educationMinutes: 12,
};

describe("the enrollment's 基本表格", () => {
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

	it("records every field the sheet's row has", async () => {
		await api.createCase({
			mrn: "BASIC0001",
			caseDate: "2026-07-01",
			pharmacist: "黃永成",
			campus: "虎尾",
			timepoint: "M0",
			drug: "Symbicort",
			steps: { MDI_搖: "正確" },
			...FULL_BASICS,
		});
		const { rows } = await pool.query(
			`SELECT c.case_type, c.usage_duration, c.prior_education,
			        c.education_minutes, p.age_band, p.sex, p.diagnosis
			 FROM cases c JOIN patients p ON p.id = c.patient_id
			 WHERE p.mrn_tail = '01'`,
		);
		assert.equal(rows.length, 1);
		assert.equal(rows[0].case_type, "初診衛教");
		assert.equal(rows[0].age_band, "65歲以上");
		assert.equal(rows[0].sex, "女");
		assert.equal(rows[0].diagnosis, "氣喘/COPD");
		assert.equal(rows[0].usage_duration, "1-6個月");
		assert.equal(rows[0].prior_education, "有(院外)");
		assert.equal(rows[0].education_minutes, 12);
	});

	it("takes the family-collector case type the old form offered", async () => {
		await api.createCase({
			mrn: "BASIC0002",
			caseDate: "2026-07-01",
			pharmacist: "黃永成",
			campus: "虎尾",
			timepoint: "M0",
			drug: "Symbicort",
			steps: { MDI_搖: "正確" },
			...FULL_BASICS,
			caseType: "家屬/看護代領",
		});
		const { rows } = await pool.query(
			`SELECT c.case_type FROM cases c JOIN patients p ON p.id = c.patient_id
			 WHERE p.mrn_tail = '02'`,
		);
		assert.equal(rows[0].case_type, "家屬/看護代領");
	});

	/*
	 * Which cohort an enrollment belongs to.
	 *
	 * The enrollment is the before-measurement: 10/19 會議【八】，林藥師「因為
	 * 我現在是對策前，後面沒有追蹤分析，未來我是想做一個月後（M1）追蹤成效有
	 * 沒有改善」。 The M1 follow-up is where the improvement is read, and that
	 * pairing is the whole point — a case filed as 改善後 with no 改善前 to pair
	 * against never appears in the before/after comparison at all.
	 */
	it("files an enrollment as the before cohort", async () => {
		const { rows } = await pool.query(
			`SELECT c.timepoint, c.qcc_stage FROM cases c
			 JOIN patients p ON p.id = c.patient_id ORDER BY p.mrn_tail`,
		);
		assert.deepEqual(
			rows.map((r) => [r.timepoint, r.qcc_stage]),
			[
				["M0", "改善前"],
				["M0", "改善前"],
			],
		);
	});

	it("keeps the step notes the pharmacist wrote", async () => {
		await api.createCase({
			mrn: "BASIC0003",
			caseDate: "2026-07-01",
			pharmacist: "黃永成",
			campus: "虎尾",
			timepoint: "M0",
			drug: "Symbicort",
			steps: { MDI_搖: "錯誤" },
			stepNotes: { MDI_搖: "忘了搖" },
			...FULL_BASICS,
		});
		const { rows } = await pool.query(
			`SELECT cs.note FROM case_steps cs JOIN cases c ON c.id = cs.case_id
			 JOIN patients p ON p.id = c.patient_id
			 WHERE p.mrn_tail = '03' AND cs.step_code = 'MDI_搖'`,
		);
		assert.equal(rows[0].note, "忘了搖");
	});

	it("accepts the M6 timepoint the old form offered", async () => {
		await api.createCase({
			mrn: "BASIC0004",
			caseDate: "2026-07-01",
			pharmacist: "黃永成",
			campus: "虎尾",
			timepoint: "M6",
			drug: "Symbicort",
			steps: { MDI_搖: "正確" },
			...FULL_BASICS,
		});
		const { rows } = await pool.query(
			`SELECT c.timepoint, c.qcc_stage FROM cases c
			 JOIN patients p ON p.id = c.patient_id WHERE p.mrn_tail = '04'`,
		);
		assert.equal(rows[0].timepoint, "M6");
		assert.equal(
			rows[0].qcc_stage,
			"改善後",
			"a follow-up is the after cohort",
		);
	});

	/*
	 * The export is how the platform hands a case back to the sheet. The
	 * columns have to be the sheet's.
	 */
	it("exports the 基本表格 in the sheet's shape", async () => {
		const book = await api.exportCases({});
		assert.ok(Buffer.isBuffer(book));
		const { readXlsx } = await import("../api/xlsx.mjs");
		const { sheets } = readXlsx(book);
		const sheet = sheets.find((s) => s.name === "收案紀錄") ?? sheets[0];
		const headers = sheet.rows[0].map(String);
		for (const column of [
			"病歷號碼尾碼",
			"追蹤時間點",
			"病患類別",
			"年齡層",
			"性別",
			"診斷",
			"吸入劑型",
			"藥品名稱",
			"衛教時間_分鐘",
			"含ICS",
			"使用多久",
			"曾接受衛教",
		]) {
			assert.ok(
				headers.includes(column),
				`the export must carry ${column}: ${headers.join(",")}`,
			);
		}
		const row = sheet.rows.find((r) => String(r[0]) === "01");
		assert.ok(row, "the exported row must be found");
		assert.equal(row[headers.indexOf("病患類別")], "初診衛教");
		assert.equal(row[headers.indexOf("年齡層")], "65歲以上");
		assert.equal(row[headers.indexOf("使用多久")], "1-6個月");
		assert.equal(row[headers.indexOf("曾接受衛教")], "有(院外)");
		assert.equal(row[headers.indexOf("衛教時間_分鐘")], "12");
	});

	/*
	 * The sheet the pharmacist hands over is read by the same field names the
	 * form asks for. A column that the importer does not read is a column the
	 * pharmacist filled in for nothing.
	 */
	it("reads the 基本表格 columns the old form wrote", async () => {
		const buffer = writeXlsx([
			{
				name: "藥師收案",
				rows: [
					[
						"病歷號碼",
						"藥師",
						"院區",
						"藥品名稱",
						"收案日期",
						"追蹤時間點",
						"病患類別",
						"年齡層",
						"性別",
						"診斷",
						"吸入劑型",
						"衛教時間_分鐘",
						"含ICS",
						"使用多久",
						"曾接受衛教",
						"步驟_MDI_搖",
					],
					[
						"IMP0002",
						"林家薐",
						"斗六",
						"Symbicort",
						"2026-05-06",
						"M1（1個月）",
						"複診回測",
						"65歲以上",
						"男",
						"氣喘",
						"MDI",
						8,
						"是",
						">6個月",
						"無",
						"正確",
					],
				],
			},
		]);
		const report = await api.importCases(buffer, { stage: "改善後" });
		assert.equal(report.skipped.length, 0);
		assert.equal(report.imported, 1);

		const { rows } = await pool.query(
			`SELECT c.timepoint, c.qcc_stage, c.case_type, c.usage_duration,
			        c.prior_education, c.education_minutes, p.age_band, p.sex, p.diagnosis
			 FROM cases c JOIN patients p ON p.id = c.patient_id
			 WHERE c.record_id LIKE 'IMP-%'`,
		);
		assert.equal(rows.length, 1);
		assert.equal(rows[0].timepoint, "M1");
		assert.equal(rows[0].qcc_stage, "改善後");
		assert.equal(rows[0].case_type, "複診回測");
		assert.equal(rows[0].usage_duration, ">6個月");
		assert.equal(rows[0].prior_education, "無");
		assert.equal(rows[0].education_minutes, 8);
		assert.equal(rows[0].age_band, "65歲以上");
		assert.equal(rows[0].sex, "男");
		assert.equal(rows[0].diagnosis, "氣喘");
	});
});
