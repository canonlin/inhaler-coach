/**
 * Importing the pharmacist's QCC sheet, and exporting it back out.
 *
 * The sheet is the pharmacist's own record: 99 columns, of which 33 are the
 * step checklist (步驟_*) with a note beside each (備註_*), ten are the
 * knowledge questions (知識Q1…Q10), and the rest describe the case.
 *
 * Three rules this module follows:
 *
 *   1. The medical record number never reaches a table. It is hashed on the
 *      way in and only its tail is kept, exactly as when a case is created
 *      through the app. The export carries the tail and nothing else.
 *   2. The spine is the domain's, not the sheet's. The device class, whether
 *      the drug contains a steroid, and whether it is shaken come from
 *      src/domain, so a sheet that disagrees is reported rather than obeyed.
 *   3. Nothing is silently dropped. A row that cannot be imported is
 *      reported with the reason, because a missing case in a QCC dashboard
 *      is a number that quietly does not add up.
 */

import { createHash } from "node:crypto";

import { ALL_DRUGS, drugOf } from "../src/domain/drugs.js";
import {
	ENROLLMENT_SHEET,
	REQUIRED_COLUMNS,
} from "../src/domain/enrollment-sheet.js";
import { PHARMACISTS } from "../src/domain/roster.js";
import { ALL_STEP_CODES, CRITICAL_STEP_CODES } from "../src/domain/steps.js";
import { hashMrn, mrnTail } from "./db.mjs";
import { readXlsx } from "./xlsx.mjs";

/** The sheet the pharmacist fills in. Defined in the domain, because the back
 *  office tells the pharmacist what to prepare and the two must agree. */
export { ENROLLMENT_SHEET };

/** Stage labels the schema accepts. */
const STAGES = ["改善前", "改善後"];

/**
 * A drug name as people write it, made comparable.
 *
 * The sheet is filled in by hand, so the same drug arrives in several shapes:
 * "Ultibro Breezhaler", "Ultibro (Breezhaler)", "ultibro  breezhaler". Case,
 * brackets and repeated spaces are not differences in the drug, so they are
 * taken out before anything is compared.
 */
export function normaliseDrugSpelling(name) {
	return name
		.toLowerCase()
		.replace(/[()（）]/g, "")
		.replace(/\s+/g, " ")
		.trim();
}

/**
 * Drug names as the sheet writes them, where they differ from the spine.
 *
 * The spine's names are frozen (they are the spreadsheet key the dashboard
 * groups by), so the sheet's variant is mapped onto it rather than the other
 * way round.
 *
 * The keys are normalised the same way the lookup normalises what it is given,
 * so an alias written with brackets still finds its key.
 *
 * Exported so the test can hold every alias to the catalogue: an alias that
 * points at a name the spine does not have is a spelling the importer reads
 * as no drug at all, and the row's patient is lost with it.
 */
export const DRUG_ALIASES = new Map(
	[
		["seretide 250 evohaler", "Seretide Evohaler"],
		["seretide evohaler", "Seretide Evohaler"],
		["symbicort rapihaler", "Symbicort"],
		["trelegy 92/55/22 (ellipta)", "Trelegy 92/55/22 (Ellipta)"],
		["trelegy 184/55/22 (ellipta)", "Trelegy 184/55/22 (Ellipta)"],
		["relvar (ellipta)", "Relvar (Ellipta)"],
		["anoro (ellipta)", "Anoro (Ellipta)"],
		["ultibro breezhaler", "Ultibro Breezhaler"],
		["spiolto respimat", "Spiolto Respimat"],
		["striverdi respimat", "Striverdi Respimat"],
		["spiriva respimat", "Spiriva Respimat"],
		["breztri aerosolphere", "Breztri"],
		["bevespi aerosolphere", "Bevespi"],
		["duasma hfa 200", "Duasma HFA"],
		["trimbow inhalation solution", "Trimbow"],
		["flixotide evohaler", "Flixotide Evohaler"],
		["berotec n", "Berotec N"],
	].map(([spelling, target]) => [normaliseDrugSpelling(spelling), target]),
);

/**
 * The sheet's device classes are coarser than the spine's.
 *
 * The sheet says MDI / DPI / SMI (the classes a patient recognises); the
 * spine says MDI / ELP / BRZ / RSP (the classes the steps and the dashboard
 * use). A DPI device can be an ELP or a BRZ, and only the drug says which.
 */
const SPINE_TO_SHEET_DEVICE = {
	MDI: "MDI",
	ELP: "DPI",
	BRZ: "DPI",
	RSP: "SMI",
};

/**
 * Read the workbook and find the enrollment sheet.
 *
 * @param {Buffer} buffer
 * @returns {{headers: string[], rows: string[][]}}
 */
export function parseEnrollmentWorkbook(buffer) {
	const { sheets } = readXlsx(buffer);
	const sheet =
		sheets.find((s) => s.name === ENROLLMENT_SHEET) ??
		sheets.find((s) => s.name.includes("收案"));
	if (!sheet) {
		throw new Error(
			`找不到工作表「${ENROLLMENT_SHEET}」。這份檔案有：${sheets
				.map((s) => s.name)
				.join("、")}`,
		);
	}
	const [headers = [], ...rows] = sheet.rows;
	const names = headers.map((h) => String(h).trim());

	/*
	 * The file is refused before any row is read.
	 *
	 * A workbook whose headers do not match has no readable rows, and saying
	 * so row by row — 「沒有病歷號碼」 nine hundred times — is a message that
	 * describes the symptom instead of the cause. One line naming the missing
	 * column is what the pharmacist can act on.
	 */
	const missing = REQUIRED_COLUMNS.filter((c) => !names.includes(c));
	if (missing.length) {
		throw new Error(
			`這份檔案缺少必要欄位：${missing.join("、")}。工作表「${sheet.name}」的標題列需要：${REQUIRED_COLUMNS.join("、")}。`,
		);
	}

	return {
		headers,
		rows: rows.filter((r) => r.some((v) => String(v ?? "").trim() !== "")),
	};
}

/**
 * Map one sheet row to a case.
 *
 * @param {Record<string, number>} index header name -> column
 * @param {string[]} row
 * @param {{stage: string}} options
 * @returns {{ok: boolean, skip?: string, case?: object, steps?: object[], knowledge?: object[], warnings?: string[]}}
 */
export function mapRow(index, row, { stage }) {
	const get = (name) => {
		const column = index[name];
		return column === undefined ? "" : String(row[column] ?? "").trim();
	};
	const warnings = [];

	const mrn = get("病歷號碼");
	if (!mrn) return { ok: false, skip: "沒有病歷號碼" };

	const pharmacist = get("藥師");
	if (!PHARMACISTS.includes(pharmacist)) {
		return { ok: false, skip: `藥師不在名單：${pharmacist || "(空白)"}` };
	}

	const campus = get("院區");
	if (campus !== "斗六" && campus !== "虎尾") {
		return { ok: false, skip: `院區不合法：${campus || "(空白)"}` };
	}

	const drugName = resolveDrug(get("藥品名稱"));
	if (!drugName) return { ok: false, skip: `查不到這個藥：${get("藥品名稱")}` };
	const drug = drugOf(drugName);

	const caseDate = parseDate(get("收案日期"));
	if (!caseDate) return { ok: false, skip: "收案日期看不懂" };

	const timepoint = parseTimepoint(get("追蹤時間點"));
	const caseType = parseCaseType(get("病患類別"));
	const ageBand = parseAgeBand(get("年齡層"));
	const sex = parseSex(get("性別"));
	const usageDuration = parseEnum(get("使用多久"), [
		"初次使用",
		"<1個月",
		"1-6個月",
		">6個月",
	]);
	const priorEducation = parseEnum(get("曾接受衛教"), [
		"有(院內)",
		"有(院外)",
		"無",
	]);

	// The sheet's device class is a coarser label; the spine's device class is
	// what the steps and the dashboard use. A disagreement is worth saying out
	// loud, but the spine wins.
	const sheetDevice = get("吸入劑型");
	const expectedSheetDevice = SPINE_TO_SHEET_DEVICE[drug.device];
	if (
		sheetDevice &&
		expectedSheetDevice &&
		sheetDevice !== expectedSheetDevice
	) {
		warnings.push(
			`吸入劑型欄位是 ${sheetDevice}，但 ${drug.label} 是 ${drug.device}（${expectedSheetDevice}）`,
		);
	}
	if (get("含ICS") === "是" && !drug.hasIcs) {
		warnings.push(`含ICS 欄位是「是」，但 ${drug.label} 依仿單不含類固醇`);
	}
	if (get("含ICS") === "否" && drug.hasIcs) {
		warnings.push(`含ICS 欄位是「否」，但 ${drug.label} 含類固醇（需漱口）`);
	}

	// The steps: only the ones for this case's device. The sheet leaves the
	// other devices' columns empty, but a stale value in a neighbouring
	// column must not become a step of a different inhaler.
	const steps = [];
	for (const code of ALL_STEP_CODES) {
		const value = get(`步驟_${code}`);
		if (!value) continue;
		if (code.split("_")[0] !== drug.device) continue;
		if (value !== "正確" && value !== "錯誤" && value !== "na") {
			warnings.push(`步驟 ${code} 的值看不懂：${value}`);
			continue;
		}
		steps.push({ code, value, note: get(`備註_${code}`) });
	}

	const knowledge = [];
	for (let q = 1; q <= 10; q += 1) {
		const answer = get(`知識Q${q}`);
		if (!answer) continue;
		if (answer !== "對" && answer !== "不對") {
			warnings.push(`知識 Q${q} 的值看不懂：${answer}`);
			continue;
		}
		knowledge.push({ index: q, answer });
	}

	const recordId = makeRecordId(mrn, caseDate, timepoint, drugName, pharmacist);

	// The sheet carries summary columns next to the detail they summarise.
	// They are checked, not trusted: a case is stored from the detail, and a
	// disagreement is reported so the pharmacist can fix the sheet.
	for (const problem of compareDerived(get, steps, knowledge)) {
		warnings.push(problem);
	}

	return {
		ok: true,
		warnings,
		case: {
			recordId,
			mrn,
			caseDate,
			timepoint,
			stage,
			campus,
			pharmacist,
			caseType,
			ageBand,
			sex,
			diagnosis: get("診斷") || null,
			device: drug.device,
			drug: drug.name,
			hasIcs: drug.hasIcs,
			needsShake: drug.needsShake,
			educationMinutes: parseNumber(get("衛教時間_分鐘")),
			usageDuration,
			priorEducation,
			// The sheet cannot say whether the patient performed a step in
			// front of the pharmacist, only how it was scored.
			demonstrated: false,
		},
		steps,
		knowledge,
	};
}

/**
 * Import a workbook.
 *
 * @param {Function} query
 * @param {{buffer: Buffer, salt: string, stage?: string, dryRun?: boolean}} options
 */
export async function importEnrollment(query, { buffer, salt, stage, dryRun }) {
	const chosenStage = STAGES.includes(stage) ? stage : "改善前";
	const { headers, rows } = parseEnrollmentWorkbook(buffer);

	const index = {};
	headers.forEach((h, i) => {
		index[String(h).trim()] = i;
	});

	const report = {
		ok: true,
		stage: chosenStage,
		rowsRead: rows.length,
		imported: 0,
		updated: 0,
		skipped: [],
		warnings: [],
		dryRun: Boolean(dryRun),
	};

	for (const [position, row] of rows.entries()) {
		const mapped = mapRow(index, row, { stage: chosenStage });
		const line = position + 2; // the sheet's own row number
		if (!mapped.ok) {
			report.skipped.push({ line, reason: mapped.skip });
			continue;
		}
		for (const w of mapped.warnings) {
			report.warnings.push({ line, message: w });
		}
		if (dryRun) {
			report.imported += 1;
			continue;
		}
		const result = await writeCase(query, mapped, salt);
		if (result.updated) report.updated += 1;
		else report.imported += 1;
	}

	return report;
}

/** Insert or update one case, with its steps and answers. */
async function writeCase(query, mapped, salt) {
	const c = mapped.case;
	const mrnHash = hashMrn(c.mrn, salt);

	const { rows: patientRows } = await query(
		`INSERT INTO patients (mrn_hash, mrn_tail, age_band, sex, diagnosis)
		 VALUES ($1,$2,$3,$4,$5)
		 ON CONFLICT (mrn_hash) DO UPDATE
		   SET age_band = EXCLUDED.age_band,
		       sex = EXCLUDED.sex,
		       diagnosis = EXCLUDED.diagnosis
		 RETURNING id`,
		[mrnHash, mrnTail(c.mrn), c.ageBand, c.sex, c.diagnosis],
	);
	const patientId = patientRows[0].id;

	const { rows: caseRows } = await query(
		`INSERT INTO cases (patient_id, case_date, timepoint, qcc_stage, campus,
		                    pharmacist, device, drug, has_ics, needs_shake, case_type,
		                    education_minutes, prior_education, usage_duration, record_id)
		 VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
		 ON CONFLICT (record_id) DO UPDATE
		   SET case_date = EXCLUDED.case_date,
		       timepoint = EXCLUDED.timepoint,
		       qcc_stage = EXCLUDED.qcc_stage,
		       campus = EXCLUDED.campus,
		       pharmacist = EXCLUDED.pharmacist,
		       device = EXCLUDED.device,
		       drug = EXCLUDED.drug,
		       has_ics = EXCLUDED.has_ics,
		       needs_shake = EXCLUDED.needs_shake,
		       case_type = EXCLUDED.case_type,
		       education_minutes = EXCLUDED.education_minutes,
		       prior_education = EXCLUDED.prior_education,
		       usage_duration = EXCLUDED.usage_duration
		 RETURNING id, (xmax = 0) AS inserted`,
		[
			patientId,
			c.caseDate,
			c.timepoint,
			c.stage,
			c.campus,
			c.pharmacist,
			c.device,
			c.drug,
			c.hasIcs,
			c.needsShake,
			c.caseType,
			c.educationMinutes,
			c.priorEducation,
			c.usageDuration,
			c.recordId,
		],
	);
	const caseId = caseRows[0].id;

	await query("DELETE FROM case_steps WHERE case_id = $1", [caseId]);
	for (const step of mapped.steps) {
		await query(
			`INSERT INTO case_steps (case_id, step_code, value, note, demonstrated)
			 VALUES ($1,$2,$3,$4,false)`,
			[caseId, step.code, step.value, step.note],
		);
	}

	await query("DELETE FROM case_knowledge WHERE case_id = $1", [caseId]);
	for (const k of mapped.knowledge) {
		await query(
			"INSERT INTO case_knowledge (case_id, q_index, answer) VALUES ($1,$2,$3)",
			[caseId, k.index, k.answer],
		);
	}

	return { caseId, updated: !caseRows[0].inserted };
}

/**
 * Build the export workbook: the same shape the pharmacist's sheet has, so
 * the two can be compared side by side.
 *
 * @param {Function} query
 * @param {{month?: string, stage?: string}} options
 */
export async function exportEnrollment(query, { month, stage } = {}) {
	// Which steps are critical lives in the domain, not in the database, so
	// the critical errors are counted here rather than in SQL.
	const critical = CRITICAL_STEP_CODES;
	const { rows } = await query(
		`SELECT c.id, c.case_date, c.timepoint, c.qcc_stage, c.campus, c.pharmacist,
		        c.case_type, p.age_band, p.sex, p.diagnosis, c.device, c.drug,
		        c.education_minutes, c.has_ics, c.usage_duration, c.prior_education,
		        p.mrn_tail,
		        (SELECT count(*)::int FROM case_steps cs
		          WHERE cs.case_id = c.id AND cs.value = '正確') AS correct,
		        (SELECT count(*)::int FROM case_steps cs
		          WHERE cs.case_id = c.id AND cs.value <> 'na') AS total,
		        (SELECT count(*)::int FROM case_steps cs
		          WHERE cs.case_id = c.id AND cs.value = '錯誤'
		            AND cs.step_code = ANY($3::text[])) AS critical_errors,
		        (SELECT count(*)::int FROM case_knowledge ck
		          WHERE ck.case_id = c.id AND ck.answer = '對') AS knowledge_correct,
		        (SELECT count(*)::int FROM case_knowledge ck
		          WHERE ck.case_id = c.id) AS knowledge_total
		 FROM cases c JOIN patients p ON p.id = c.patient_id
		 WHERE ($1::text IS NULL OR to_char(c.case_date, 'YYYY-MM') = $1)
		   AND ($2::text IS NULL OR c.qcc_stage = $2)
		 ORDER BY c.case_date`,
		[month ?? null, stage ?? null, critical],
	);

	const headers = [
		"病歷號碼尾碼",
		"追蹤時間點",
		"收案日期",
		"階段",
		"院區",
		"藥師",
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
		"操作正確數",
		"操作總步驟",
		"操作正確率",
		"錯誤率",
		"重大錯誤數",
		"知識答對數",
		"知識總題數",
		"知識答對率",
	];

	const body = rows.map((r) => {
		const total = r.total ?? 0;
		const correct = r.correct ?? 0;
		const knowledgeTotal = r.knowledge_total ?? 0;
		const knowledgeCorrect = r.knowledge_correct ?? 0;
		return [
			r.mrn_tail,
			r.timepoint,
			r.case_date,
			r.qcc_stage,
			r.campus,
			r.pharmacist,
			r.case_type ?? "",
			r.age_band,
			r.sex ?? "",
			r.diagnosis ?? "",
			r.device,
			r.drug,
			r.education_minutes ?? "",
			r.has_ics ? "是" : "否",
			r.usage_duration ?? "",
			r.prior_education ?? "",
			correct,
			total,
			total ? Number((correct / total).toFixed(4)) : "",
			total ? Number(((total - correct) / total).toFixed(4)) : "",
			r.critical_errors ?? 0,
			knowledgeCorrect,
			knowledgeTotal,
			knowledgeTotal
				? Number((knowledgeCorrect / knowledgeTotal).toFixed(4))
				: "",
		];
	});

	return {
		sheets: [{ name: "收案明細", rows: [headers, ...body] }],
	};
}

// ── field parsing ───────────────────────────────────────────────────────────

/**
 * The spine's drug name for a name the sheet wrote.
 *
 * The sheet's spellings differ in more than case: brackets, spaces, and the
 * order of the words all move around as people type. The lookup therefore
 * normalises the spelling first — lower case, single spaces, no brackets —
 * and only then asks the alias list, so "Ultibro (Breezhaler)" and
 * "Ultibro Breezhaler" reach the same product.
 */
export function resolveDrug(name) {
	if (!name) return null;
	// drugOf() throws on an unknown name, so the lookup here is the list.
	const exact = ALL_DRUGS.find((d) => d.name === name);
	if (exact) return exact.name;
	const key = normaliseDrugSpelling(name);
	const alias = DRUG_ALIASES.get(key);
	if (alias && ALL_DRUGS.some((d) => d.name === alias)) return alias;
	const byLabel = ALL_DRUGS.find(
		(d) => d.label.toLowerCase() === key || d.name.toLowerCase() === key,
	);
	return byLabel ? byLabel.name : null;
}

/** An Excel serial, an ISO date, or nothing. */
function parseDate(value) {
	if (!value) return null;
	if (/^\d+(\.\d+)?$/.test(value)) {
		const serial = Number(value);
		const date = new Date(
			Date.UTC(1899, 11, 30) + Math.floor(serial) * 86400000,
		);
		return date.toISOString().slice(0, 10);
	}
	const parsed = new Date(value);
	if (Number.isNaN(parsed.getTime())) return null;
	return parsed.toISOString().slice(0, 10);
}

function parseTimepoint(value) {
	// M6 included: the old app's 收案表單 offered it and the sheet has the
	// column. A row that was filed as an M0 was a silent lie about the
	// study's timeline.
	const match = value?.match(/M([0136])/i);
	return match ? `M${match[1]}` : "M0";
}

function parseCaseType(value) {
	if (value === "初診衛教" || value === "複診回測") return value;
	return null;
}

function parseAgeBand(value) {
	if (value === "≥65歲" || value === "65歲以上") return "65歲以上";
	if (value === "18-64歲") return "18-64歲";
	if (value === "未滿18歲") return "未滿18歲";
	return "18-64歲";
}

function parseSex(value) {
	return value === "男" || value === "女" ? value : null;
}

function parseEnum(value, allowed) {
	return allowed.includes(value) ? value : null;
}

function parseNumber(value) {
	if (!value) return null;
	const n = Number(value);
	return Number.isFinite(n) ? Math.round(n) : null;
}

/**
 * Compare the sheet's summary columns with the detail they summarise.
 *
 * The summary columns are what a spreadsheet recalculates, and they drift:
 * an error rate that became a copy of the correct rate is invisible on the
 * sheet and wrong in every dashboard built on it. The detail wins, and the
 * difference is reported.
 *
 * @param {(name: string) => string} get
 * @param {{code: string, value: string}[]} steps
 * @param {{index: number, answer: string}[]} knowledge
 * @returns {string[]} the problems found
 */
function compareDerived(get, steps, knowledge) {
	const problems = [];
	const total = steps.filter((s) => s.value !== "na").length;
	const correct = steps.filter((s) => s.value === "正確").length;
	const wrong = steps.filter((s) => s.value === "錯誤").length;
	const knowledgeCorrect = knowledge.filter((k) => k.answer === "對").length;

	const sheetNumber = (name) => {
		const raw = get(name);
		if (!raw) return null;
		const n = Number(raw);
		return Number.isFinite(n) ? n : null;
	};

	const sheetCorrect = sheetNumber("操作正確數");
	if (sheetCorrect !== null && sheetCorrect !== correct) {
		problems.push(`操作正確數是 ${sheetCorrect}，依步驟重算是 ${correct}`);
	}
	const sheetTotal = sheetNumber("操作總步驟");
	if (sheetTotal !== null && sheetTotal !== total) {
		problems.push(`操作總步驟是 ${sheetTotal}，依步驟重算是 ${total}`);
	}
	const sheetRate = sheetNumber("操作正確率");
	if (sheetRate !== null && total > 0) {
		const expected = Number((correct / total).toFixed(4));
		if (Math.abs(sheetRate - expected) > 0.001) {
			problems.push(`操作正確率是 ${sheetRate}，依步驟重算是 ${expected}`);
		}
	}
	const sheetErrorRate = sheetNumber("errorRate");
	if (sheetErrorRate !== null && total > 0) {
		const expected = Number((wrong / total).toFixed(4));
		if (Math.abs(sheetErrorRate - expected) > 0.001) {
			problems.push(
				`errorRate 是 ${sheetErrorRate}，依步驟重算是 ${expected}（${wrong}/${total}）`,
			);
		}
	}
	const sheetKnowledge = sheetNumber("知識總分");
	if (sheetKnowledge !== null && sheetKnowledge !== knowledgeCorrect) {
		problems.push(
			`知識總分是 ${sheetKnowledge}，依 Q1–Q10 重算是 ${knowledgeCorrect}`,
		);
	}
	return problems;
}

/**
 * A record id that is the same for the same case every time.
 *
 * The import is then a sync: re-running it updates the case instead of
 * creating a second one.
 */
function makeRecordId(mrn, caseDate, timepoint, drug, pharmacist) {
	const digest = createHash("sha256")
		.update(`${mrn}|${caseDate}|${timepoint}|${drug}|${pharmacist}`)
		.digest("hex")
		.slice(0, 20);
	return `IMP-${digest}`;
}
