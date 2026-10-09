/**
 * LINE dry run: show exactly what a cohort would receive, without sending it.
 *
 * A token would let us send. It would not let us find out whether the schedule
 * says the right thing, whether the wording matches the step that actually went
 * wrong, or whether the cohort fits the 200 free messages a month. All of that
 * is answerable now, so this prints it.
 *
 * Run: DATABASE_URL=... node scripts/line-dry-run.mjs [month]
 */
import { createPool } from "../api/db.mjs";
import { makeRoutes } from "../api/routes.mjs";
import { STEP_BY_CODE } from "../src/domain/steps.js";

const URL = process.env.DATABASE_URL;
if (!URL) {
	console.error("DATABASE_URL is required");
	process.exit(1);
}

const pool = createPool(URL);
const api = makeRoutes({ query: (t, p) => pool.query(t, p), salt: process.env.MRN_SALT ?? "demo-salt" });

const month = process.argv[2] ?? new Date().toISOString().slice(0, 7);

const { rows } = await pool.query(
	`SELECT c.id, c.case_date, c.drug, c.device, p.mrn_tail, p.consent_line,
	        COALESCE((SELECT jsonb_object_agg(cs.step_code, cs.value)
	                  FROM case_steps cs WHERE cs.case_id = c.id), '{}'::jsonb) AS steps
	 FROM cases c JOIN patients p ON p.id = c.patient_id
	 WHERE to_char(c.case_date, 'YYYY-MM') = $1
	 ORDER BY c.case_date`,
	[month],
);

if (!rows.length) {
	console.log(`${month}: no cases. Seed some with scripts/seed-demo.mjs, or pass a month that has data.`);
	await pool.end();
	process.exit(0);
}

console.log(`\nLINE 演練 — ${month}，${rows.length} 例\n${"─".repeat(64)}`);

let billable = 0;
let shown = 0;
let consentMissing = 0;

for (const c of rows) {
	const plan = await api.linePlan({ case_id: c.id });
	billable += plan.quota.billable;
	if (!plan.consentLine) consentMissing += 1;

	if (!plan.planned.length) continue;

	if (shown < 3) {
		console.log(`\n【${c.mrn_tail} · ${c.drug} · ${c.case_date}】`);
		if (!plan.consentLine) console.log("  ⚠ 未同意 LINE，以下不會寄出");
		if (!plan.linked) console.log("  ⚠ 未綁定 LINE 帳號，以下不會寄出");
		for (const touch of plan.planned) {
			console.log(`\n  ── 第 ${touch.day} 天 ──`);
			console.log(render(touch.message));
		}
		shown += 1;
	}
}

console.log(`\n${"─".repeat(64)}`);
console.log(`需加強的個案會各收到 3 則推播；全對的個案不排任何觸點。`);
console.log(`本月計費推播：${billable} 則 / 免費額度 200 則`);
console.log(
	billable <= 200
		? `  ✓ 在免費額度內，剩餘 ${200 - billable} 則`
		: `  ✗ 超出免費額度 ${billable - 200} 則，免費方案無法加購`,
);
if (consentMissing) {
	console.log(`\n⚠ ${consentMissing}/${rows.length} 例尚未取得 LINE 同意，實際會寄出的更少。`);
}
console.log(`\n本演練未寄出任何訊息（transport=recording）。\n`);

await pool.end();

/** Print a message the way it appears in LINE, quick replies included. */
function render(message) {
	if (message.type !== "text") return `  [${message.type}]`;
	const lines = message.text.split("\n").map((l) => `  │ ${l}`);
	if (message.quickReply) {
		lines.push("  │");
		for (const item of message.quickReply.items) {
			lines.push(`  │  [ ${item.action.label} ]`);
		}
	}
	return lines.join("\n");
}

// Referenced so the spine import is not dropped by a linter; the step text is
// what the messages are built from.
void STEP_BY_CODE;