/**
 * Import the pharmacist's QCC sheet, and take it back out again.
 *
 *   node scripts/qcc-import.mjs "<file>.xlsx" --dry-run     # read and report
 *   node scripts/qcc-import.mjs "<file>.xlsx"               # write it
 *   node scripts/qcc-import.mjs --clear                     # remove what was imported
 *   node scripts/qcc-import.mjs --export out.xlsx           # write the cases out
 *
 * The record number is hashed on the way in and only its tail is kept, so
 * nothing in the database can be read back to a patient.
 */
import { readFile, writeFile } from "node:fs/promises";

import { createPool } from "../api/db.mjs";
import { exportEnrollment, importEnrollment } from "../api/import-export.mjs";
import { writeXlsx } from "../api/xlsx.mjs";

const args = process.argv.slice(2);
const file = args.find((a) => !a.startsWith("--"));
const has = (flag) => args.includes(flag);
const flagValue = (flag) => {
	const i = args.indexOf(flag);
	return i >= 0 ? args[i + 1] : undefined;
};

const URL = process.env.DATABASE_URL;
if (!URL) {
	console.error("DATABASE_URL 未設定。");
	process.exit(1);
}
const SALT = process.env.MRN_SALT;
if (!SALT) {
	console.error(
		"MRN_SALT 未設定。雜湊用的鹽必須跟部署上的一樣，否則同一位病人會變成兩筆。",
	);
	process.exit(1);
}

const pool = createPool(URL);
const query = (text, params) => pool.query(text, params);

if (has("--export")) {
	const target = flagValue("--export") ?? "output/export.xlsx";
	const { sheets } = await exportEnrollment(query, {
		month: flagValue("--month"),
		stage: flagValue("--stage"),
	});
	await writeFile(target, writeXlsx(sheets));
	console.log(`已匯出到 ${target}`);
	await pool.end();
	process.exit(0);
}

if (has("--clear")) {
	const result = await clearImported(query);
	console.log(
		`已清除匯入的資料：${result.cases} 個案、${result.patients} 位病人`,
	);
	await pool.end();
	process.exit(0);
}

if (!file) {
	console.error(
		"用法：node scripts/qcc-import.mjs <file.xlsx> [--stage 改善前|改善後] [--dry-run]",
	);
	process.exit(2);
}

const buffer = await readFile(file);
const report = await importEnrollment(query, {
	buffer,
	salt: SALT,
	stage: flagValue("--stage"),
	dryRun: has("--dry-run"),
});

console.log(`\n${report.dryRun ? "試跑（不寫入）" : "匯入"}：${file}`);
console.log("─".repeat(64));
console.log(`  讀到的資料列：${report.rowsRead}`);
console.log(`  階段：${report.stage}`);
console.log(`  新增：${report.imported}　更新：${report.updated}`);
if (report.skipped.length) {
	console.log(`  略過：${report.skipped.length}`);
	for (const s of report.skipped.slice(0, 20)) {
		console.log(`    第 ${s.line} 列：${s.reason}`);
	}
	if (report.skipped.length > 20) {
		console.log(`    …還有 ${report.skipped.length - 20} 列`);
	}
}
if (report.warnings.length) {
	console.log(`  提醒：${report.warnings.length}`);
	for (const w of report.warnings.slice(0, 20)) {
		console.log(`    第 ${w.line} 列：${w.message}`);
	}
	if (report.warnings.length > 20) {
		console.log(`    …還有 ${report.warnings.length - 20} 筆`);
	}
}
console.log("─".repeat(64));

await pool.end();

/**
 * Remove what the import added, and nothing else.
 *
 * Only cases this importer wrote (their record id starts with IMP-) go, and
 * a patient is removed only if the import was the last thing that had a row
 * for them. A patient with a LINE account or another case stays.
 */
async function clearImported(q) {
	const { rows } = await q(
		`SELECT DISTINCT patient_id FROM cases WHERE record_id LIKE 'IMP-%'`,
	);
	const patientIds = rows.map((r) => r.patient_id);
	if (!patientIds.length) return { cases: 0, patients: 0 };

	const deletedCases = await q(
		`WITH removed AS (
		   DELETE FROM cases WHERE record_id LIKE 'IMP-%' RETURNING patient_id
		 )
		 SELECT count(*)::int AS n FROM removed`,
	);
	const deletedPatients = await q(
		`WITH removed AS (
		   DELETE FROM patients p
		   WHERE p.id = ANY($1::uuid[])
		     AND NOT EXISTS (SELECT 1 FROM cases c WHERE c.patient_id = p.id)
		     AND NOT EXISTS (SELECT 1 FROM line_identities li WHERE li.patient_id = p.id)
		   RETURNING p.id
		 )
		 SELECT count(*)::int AS n FROM removed`,
		[patientIds],
	);
	return {
		cases: deletedCases.rows[0].n,
		patients: deletedPatients.rows[0].n,
	};
}
