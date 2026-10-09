/**
 * Pharmacist end: 收案評估.
 *
 * One page, one job: record a case correctly enough to be counted. The step
 * checklist is the single source of truth from src/domain/steps.js — the
 * pharmacist never types a step code, they tap 正確 / 錯誤 against the wording
 * from the QCC 附件七 table.
 *
 * The 107-column spreadsheet became nine tables, so this form writes one
 * transaction instead of a row of blanks.
 */
import { useMemo, useState } from "react";

import { DEVICES, applicableSteps, type Step } from "../domain/steps.js";
import { DRUG_BY_NAME, ALL_DRUGS, type Drug } from "../domain/drugs.js";
import {
	KNOWLEDGE,
	PHARMACISTS,
	CAMPUSES,
	FACTORS,
	type Factor,
	type KnowledgeQuestion,
} from "../domain/roster.js";
import { createCase } from "../admin/api-client.js";
import { StepChecklist } from "./components/StepChecklist.jsx";
import "./pharmacist.css";

/** Drugs grouped by device, so the select mirrors the check table's sections. */
const byDevice = (Object.keys(DEVICES) as (keyof typeof DEVICES)[])
	.map((device) => [device, ALL_DRUGS.filter((d: Drug) => d.device === device)] as const)
	.filter(([, list]) => list.length > 0);

export function CaseEntry({ onSaved }: { onSaved?: () => void }) {
	const [drugName, setDrugName] = useState("");
	const [pharmacist, setPharmacist] = useState(PHARMACISTS[0] ?? "");
	const [campus, setCampus] = useState(CAMPUSES[0] ?? "虎尾");
	const [timepoint, setTimepoint] = useState("M0");
	const [qccStage, setQccStage] = useState("改善後");
	const [mrn, setMrn] = useState("");
	const [factors, setFactors] = useState<string[]>([]);
	const [steps, setSteps] = useState<Record<string, "正確" | "錯誤">>({});
	const [knowledge, setKnowledge] = useState<Record<string, "對" | "不對">>({});
	const [status, setStatus] = useState<{ tone: string; text: string } | null>(null);

	const drug: Drug | null = drugName ? DRUG_BY_NAME[drugName] : null;

	// The checklist is derived, not stored: pick a drug, get exactly the steps
	// that apply to it. Trimbow never shows 搖 because it is a solution.
	const applicable: Step[] = useMemo(() => (drug ? applicableSteps(drug.device, drug) : []), [drug]);

	const criticalWrong = applicable.filter(
		(s) => steps[s.code] === "錯誤" && s.critical,
	);
	const done = Object.keys(steps).length;
	const ready = Boolean(drug && mrn.trim() && pharmacist) && done === applicable.length && applicable.length > 0;

	async function save() {
		setStatus(null);
		try {
			const res = await createCase({
				mrn: mrn.trim(),
				caseDate: new Date().toISOString().slice(0, 10),
				pharmacist,
				campus,
				timepoint,
				qccStage,
				drug: drugName,
				steps,
				knowledge,
				factors,
			});
			setStatus({ tone: "good", text: `已收案 ${res.record_id ?? ""}` });
			setSteps({});
			setKnowledge({});
			setMrn("");
			onSaved?.();
		} catch (e) {
			setStatus({ tone: "bad", text: e instanceof Error ? e.message : "儲存失敗" });
		}
	}

	return (
		<div className="rx">
			<header className="rx-head">
				<span className="eyebrow">QCC 吸入劑 · 收案評估</span>
				<h1>記錄這一筆</h1>
			</header>

			<div className="rx-grid">
				<section className="rx-side">
					<label className="field">
						<span>病歷號碼</span>
						<input
							value={mrn}
							onChange={(e) => setMrn(e.target.value)}
							autoComplete="off"
							inputMode="numeric"
						/>
					</label>

					<label className="field">
						<span>吸入劑</span>
						<select value={drugName} onChange={(e) => setDrugName(e.target.value)}>
							<option value="">請選擇</option>
							{byDevice.map(([device, list]) => (
								<optgroup key={String(device)} label={DEVICES[device].label}>
									{list.map((d: Drug) => (
										<option key={d.name} value={d.name}>
											{d.label}
										</option>
									))}
								</optgroup>
							))}
						</select>
					</label>

					<div className="field-row">
						<label className="field">
							<span>藥師</span>
							<select value={pharmacist} onChange={(e) => setPharmacist(e.target.value)}>
								{PHARMACISTS.map((p) => (
									<option key={p}>{p}</option>
								))}
							</select>
						</label>
						<label className="field">
							<span>院區</span>
							<select value={campus} onChange={(e) => setCampus(e.target.value)}>
								{CAMPUSES.map((c) => (
									<option key={c}>{c}</option>
								))}
							</select>
						</label>
					</div>

					<div className="field-row">
						<label className="field">
							<span>時間點</span>
							<select value={timepoint} onChange={(e) => setTimepoint(e.target.value)}>
								<option value="M0">M0 初次</option>
								<option value="M1">M1 追蹤</option>
								<option value="M3">M3 追蹤</option>
							</select>
						</label>
						<label className="field">
							<span>QCC 階段</span>
							<select value={qccStage} onChange={(e) => setQccStage(e.target.value)}>
								<option value="改善前">改善前</option>
								<option value="改善後">改善後</option>
							</select>
						</label>
					</div>

					<fieldset className="field">
						<legend>病人因素</legend>
						<div className="chips">
							{FACTORS.map((f: Factor) => (
								<button
									key={f.code}
									type="button"
									className="chip"
									aria-pressed={factors.includes(f.code)}
									onClick={() =>
										setFactors((prev: string[]) =>
											prev.includes(f.code)
												? prev.filter((code: string) => code !== f.code)
												: [...prev, f.code],
										)
									}
								>
									{f.label}
								</button>
							))}
						</div>
					</fieldset>
				</section>

				<section className="rx-main">
					<StepChecklist steps={applicable} drug={drug} value={steps} onChange={setSteps} />

					<details className="knowledge" open={false}>
						<summary>知識題（{Object.keys(knowledge).length}/10）</summary>
						<ol className="kq">
							{KNOWLEDGE.map((q: KnowledgeQuestion) => (
								<li key={q.index}>
									<span className="kq-text">{q.text}</span>
									<span className="seg">
										<button
											type="button"
											aria-pressed={knowledge[String(q.index)] === "對"}
											onClick={() => setKnowledge((p: Record<string, "對" | "不對">) => ({ ...p, [String(q.index)]: "對" }))}
										>
											對
										</button>
										<button
											type="button"
											aria-pressed={knowledge[String(q.index)] === "不對"}
											onClick={() => setKnowledge((p: Record<string, "對" | "不對">) => ({ ...p, [String(q.index)]: "不對" }))}
										>
											不對
										</button>
									</span>
								</li>
							))}
						</ol>
					</details>

					<div className="rx-save">
						<p className="rx-progress">
							已評 {done}／{applicable.length} 步
							{criticalWrong.length > 0 && (
								<span className="warn">　▲ {criticalWrong.length} 個關鍵步驟錯誤</span>
							)}
						</p>
						<button type="button" className="btn-primary" disabled={!ready} onClick={save}>
							{drug ? "儲存收案" : "先選吸入劑"}
						</button>
						{status && (
							<p className={`rx-status ${status.tone}`} role="status">
								{status.text}
							</p>
						)}
					</div>
				</section>
			</div>
		</div>
	);
}