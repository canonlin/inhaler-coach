/**
 * Seed the local Postgres with the 61-case baseline so the admin has something
 * real to render, then report what it produced.
 *
 * Uses the published baseline aggregates, so this is demo data for rendering —
 * not a reconstruction of the real patient records.
 *
 * Run: DATABASE_URL=... node scripts/seed-demo.mjs
 */
import { createPool } from "../api/db.mjs";
import { makeRoutes } from "../api/routes.mjs";
import { drugOf } from "../src/domain/drugs.js";
import { PHARMACISTS } from "../src/domain/roster.js";
import { BASELINE_WRONG, baselineRows } from "../test/fixtures/baseline-61.mjs";

const url = process.env.DATABASE_URL;
if (!url) {
	console.error("DATABASE_URL is not set");
	process.exit(2);
}

const pool = createPool(url);
await pool.query(
	"TRUNCATE followups, physician_queries, session_stages, sessions, case_knowledge, case_steps, clinical_measurements, med_reconciliation, cases, patients RESTART IDENTITY CASCADE",
);

const api = makeRoutes({
	query: (t, p) => pool.query(t, p),
	salt: "demo-salt",
});

// One representative drug per device, so a row is always seeded with a product
// that actually uses the steps the baseline recorded for it.
const BY_DEVICE = {
	MDI: ["Symbicort", "Seretide Evohaler", "Breztri", "Trimbow", "Ventolin"],
	ELP: ["Relvar (Ellipta)", "Anoro (Ellipta)", "Trelegy 92/55/22 (Ellipta)"],
	BRZ: ["Ultibro Breezhaler"],
	RSP: ["Spiolto Respimat", "Spiriva Respimat", "Striverdi Respimat"],
};

/** The device a baseline row was actually assessed on. */
function deviceOf(row) {
	const counts = {};
	for (const code of Object.keys(row.steps)) {
		const d = code.split("_")[0];
		counts[d] = (counts[d] ?? 0) + 1;
	}
	return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "MDI";
}

/** Pick a product whose device matches the row, spreading across the catalog. */
function drugFor(row, i) {
	const device = deviceOf(row);
	const list = BY_DEVICE[device] ?? BY_DEVICE.MDI;
	return list[i % list.length];
}

const rows = baselineRows();
let created = 0;

for (const [i, row] of rows.entries()) {
	const drug = drugFor(row, i);
	const info = drugOf(drug);
	const steps = {};
	// Only record steps that belong to this drug's device.
	for (const [code, value] of Object.entries(row.steps)) {
		if (code.split("_")[0] === info.device) steps[code] = value;
	}
	await api.createCase({
		mrn: `DEMO${String(i + 1).padStart(6, "0")}`,
		caseDate: dateInPeriod(i),
		pharmacist: PHARMACISTS[i % PHARMACISTS.length],
		drug,
		qccStage: "改善前",
		timepoint: "M0",
		ageBand: i % 3 === 0 ? "65歲以上" : "18-64歲",
		steps,
	});
	created += 1;
}

// A smaller 改善後 cohort so the dashboard can actually show a comparison.
let afterCount = 0;
for (let i = 0; i < 18; i += 1) {
	const src = rows[i];
	const drug = drugFor(src, i);
	const info = drugOf(drug);
	const steps = {};
	for (const [code, value] of Object.entries(src.steps)) {
		if (code.split("_")[0] !== info.device) continue;
		// Roughly a third of the errors are corrected at the follow-up.
		steps[code] = value === "錯誤" && i % 3 !== 0 ? "正確" : value;
	}
	await api.createCase({
		mrn: `DEMO${String(i + 1).padStart(6, "0")}`,
		caseDate: dateInPeriod(90 + i),
		pharmacist: PHARMACISTS[i % PHARMACISTS.length],
		drug,
		qccStage: "改善後",
		timepoint: "M1",
		steps,
		knowledge: knowledgeFor(i),
	});
	afterCount += 1;
}

const { rows: agg } = await pool.query(
	`SELECT qcc_stage,
	        count(*)::int AS cases,
	        (SELECT count(*) FROM case_steps cs JOIN cases c2 ON c2.id = cs.case_id
	          WHERE c2.qcc_stage = c.qcc_stage AND cs.value <> 'na')::int AS assessed,
	        (SELECT count(*) FROM case_steps cs JOIN cases c2 ON c2.id = cs.case_id
	          WHERE c2.qcc_stage = c.qcc_stage AND cs.value = '錯誤')::int AS wrong
	 FROM cases c GROUP BY qcc_stage ORDER BY qcc_stage`,
);

console.log(`seeded ${created} 改善前 + ${afterCount} 改善後 cases`);
console.log(`baseline fixture expected wrong steps: ${BASELINE_WRONG}`);
for (const a of agg)
	console.log(
		`  ${a.qcc_stage}: ${a.cases} cases, ${a.assessed} assessed, ${a.wrong} wrong`,
	);
await pool.end();

function dateInPeriod(offset) {
	const start = Date.UTC(2026, 3, 21);
	const d = new Date(start + offset * 0.6 * 86400000);
	return d.toISOString().slice(0, 10);
}

function knowledgeFor(i) {
	const out = {};
	for (let q = 1; q <= 10; q += 1) {
		const correct = (i * 7 + q * 3) % 10 > 1;
		out[String(q)] = correct ? "對" : "不對";
	}
	return out;
}
