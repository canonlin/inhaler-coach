/**
 * Pharmacist end: 收案評估.
 *
 * TAM governs this form. Perceived Ease of Use is the binding constraint on
 * adoption, so the design target is explicit: a pharmacist confirms a case in
 * about five interactions, not twenty-five.
 *
 * Three mechanisms do the work:
 *   1. The camera judged six of the eight pMDI steps. They arrive as a block to
 *      confirm, not as eight separate taps.
 *   2. Only the steps nothing can judge (MDI_開, MDI_含) are judged by hand.
 *   3. Two targeted knowledge questions, chosen by device, instead of ten.
 *
 * Defaults carry the rest: the pharmacist is whoever is signed in, the campus
 * and timepoint default, and the drug arrives with the AI session when there
 * is one.
 *
 * Every judgement is a tap the patient could have failed. Recording whether the
 * patient actually demonstrated the step is the point of the whole exercise:
 * hearing an instruction is not evidence they can perform it.
 */
import { useMemo, useState } from "react";
import {
	type AiStep,
	createCase,
	fetchPendingSession,
} from "../api-client.js";
import { ALL_DRUGS, DRUG_BY_NAME, type Drug } from "../domain/drugs.js";
import {
	CAMPUSES,
	FACTORS,
	type Factor,
	KNOWLEDGE,
	type KnowledgeQuestion,
	PHARMACISTS,
} from "../domain/roster.js";
import {
	applicableSteps,
	DEVICES,
	pharmacistSteps,
	stepReviewSource,
} from "../domain/steps.js";
import { StepChecklist } from "./components/StepChecklist.jsx";
import "./pharmacist.css";

/** Two questions, chosen by device. The device dictates what patients get wrong. */
function targetedQuestions(device: string): KnowledgeQuestion[] {
	if (device === "MDI") {
		// 84% of the cohort believed DPI is also a slow inhale.
		return [KNOWLEDGE[2], KNOWLEDGE[6]];
	}
	// DPI/SMI: the reversed inhale-speed trap plus stopping medication on their own.
	return [KNOWLEDGE[2], KNOWLEDGE[9]];
}

const drugsByDevice = (Object.keys(DEVICES) as (keyof typeof DEVICES)[])
	.map(
		(device) =>
			[device, ALL_DRUGS.filter((d: Drug) => d.device === device)] as const,
	)
	.filter(([, list]) => list.length > 0);

/** What the AI session hands over, so the pharmacist types nothing twice. */
export interface SessionPreset {
	mrn?: string;
	drug?: string;
	device?: string;
	/** AI-judged step results, keyed by step code. */
	aiSteps?: Record<string, "正確" | "錯誤">;
}

export function CaseEntry({
	preset,
	onSaved,
}: {
	preset?: SessionPreset;
	onSaved?: () => void;
}) {
	const [drugName, setDrugName] = useState(preset?.drug ?? "");
	const [askedMrn, setAskedMrn] = useState(Boolean(preset?.mrn));
	const [pharmacist, setPharmacist] = useState(PHARMACISTS[0] ?? "");
	const [campus, setCampus] = useState(CAMPUSES[0] ?? "虎尾");
	const [mrn, setMrn] = useState(preset?.mrn ?? "");
	const [factors, setFactors] = useState<string[]>([]);
	const [steps, setSteps] = useState<Record<string, "正確" | "錯誤">>({
		...(preset?.aiSteps ?? {}),
	});
	const [demonstrated, setDemonstrated] = useState<Record<string, boolean>>({});
	const [knowledge, setKnowledge] = useState<Record<string, "對" | "不對">>({});
	const [status, setStatus] = useState<{ tone: string; text: string } | null>(
		null,
	);
	// What the camera already saw, fetched once the record number is known.
	const [ai, setAi] = useState<Record<string, AiStep>>({});

	async function lookUpSession(value: string) {
		setMrn(value);
		if (!value.trim()) {
			setAi({});
			return;
		}
		try {
			const r = await fetchPendingSession(value);
			setAskedMrn(true);
			if (r.found) {
				setAi(r.steps);
				// The session knows which inhaler was practised, so the drug
				// arrives with it rather than being chosen again.
				if (r.drug) setDrugName(r.drug);
				// Pre-fill only what the camera judged; hand-judged steps stay empty.
				setSteps((prev: Record<string, "正確" | "錯誤">) => {
					const next = { ...prev };
					for (const [code, v] of Object.entries(r.steps)) next[code] = v.value;
					return next;
				});
			} else {
				setAi({});
			}
		} catch {
			setAi({});
		}
	}

	const drug: Drug | null = drugName ? DRUG_BY_NAME[drugName] : null;
	const applicable = useMemo(
		() => (drug ? applicableSteps(drug.device, drug) : []),
		[drug],
	);
	const manual = useMemo(
		() => (drug ? pharmacistSteps(drug.device, drug) : []),
		[drug],
	);
	const questions = useMemo(
		() => (drug ? targetedQuestions(drug.device) : []),
		[drug],
	);

	// Split the checklist: what the camera already saw, and what it cannot see.
	const aiDone = applicable.filter(
		(s) => stepReviewSource(s.code) === "ai" && steps[s.code],
	);

	const ready =
		Boolean(drug && mrn.trim() && pharmacist) &&
		manual.every((s) => steps[s.code]) &&
		questions.every((q) => knowledge[String(q.index)]);

	async function save() {
		setStatus(null);
		try {
			const res = await createCase({
				mrn: mrn.trim(),
				caseDate: new Date().toISOString().slice(0, 10),
				pharmacist,
				campus,
				timepoint: "M0",
				qccStage: "改善後",
				drug: drugName,
				steps,
				demonstrated,
				knowledge,
				factors,
			});
			setStatus({
				tone: "good",
				text: `已收案${res.followup ? "，已排入追蹤" : ""}`,
			});
			setSteps({});
			setDemonstrated({});
			setKnowledge({});
			setMrn("");
			onSaved?.();
		} catch (e) {
			setStatus({
				tone: "bad",
				text: e instanceof Error ? e.message : "儲存失敗",
			});
		}
	}

	if (!drug) {
		return (
			<div className="rx">
				<header className="rx-head">
					<span className="eyebrow">QCC 吸入劑 · 收案評估</span>
					<h1>{askedMrn ? "這位病人用哪一種？" : "先輸入病歷號碼"}</h1>
					<p className="hint">
						{askedMrn
							? "若病人剛做過 AI 練習，這裡會自動帶入他練的那一支。"
							: "輸入後系統會查有沒有 AI 練習紀錄，有的話直接帶入。"}
					</p>
					{askedMrn && mrn.trim() && (
						<p className="field-note">
							{Object.keys(ai).length > 0
								? `已帶入 AI 練習結果 ${Object.keys(ai).length} 步`
								: "查無 AI 練習紀錄，請手動評估"}
						</p>
					)}
				</header>

				{!askedMrn && (
					<label className="field mrn-only">
						<span>病歷號碼</span>
						<input
							value={mrn}
							onChange={(e) => lookUpSession(e.target.value)}
							autoComplete="off"
							inputMode="numeric"
						/>
					</label>
				)}

				{/*
				 * The product list waits until the record number is in.
				 *
				 * Offering seventeen products on the first screen invites the
				 * pharmacist to skip the lookup, and skipping it is what made
				 * this form cost twenty-five interactions. Most of these patients
				 * have just practised with the camera, so the session already
				 * knows the answer.
				 */}
				{askedMrn && (
					<div className="drug-pick">
						{drugsByDevice.map(([device, list]) => (
							<section key={device}>
								<h2>{DEVICES[device].label}</h2>
								<div className="chips">
									{list.map((d) => (
										<button
											key={d.name}
											type="button"
											className="chip"
											onClick={() => {
												setDrugName(d.name);
												setSteps({ ...(preset?.aiSteps ?? {}) });
											}}
										>
											{d.label}
											{d.hasIcs && <span className="ics">ICS</span>}
										</button>
									))}
								</div>
							</section>
						))}
					</div>
				)}
			</div>
		);
	}

	return (
		<div className="rx">
			<header className="rx-head">
				<div>
					<span className="eyebrow">QCC 吸入劑 · 收案評估</span>
					<h1>
						{drug.label}
						<span className="rx-sub">
							{drug.hasIcs ? "含類固醇" : "不含類固醇"} ·{" "}
							{DEVICES[drug.device].speed}
						</span>
					</h1>
				</div>
				<button
					type="button"
					className="linkish"
					onClick={() => setDrugName("")}
				>
					換藥
				</button>
			</header>

			<div className="rx-grid">
				<section className="rx-side">
					<label className="field">
						<span>病歷號碼</span>
						<input
							value={mrn}
							onChange={(e) => lookUpSession(e.target.value)}
							autoComplete="off"
							inputMode="numeric"
							placeholder="病人領藥後輸入"
						/>
						{mrn.trim() && (
							<span className="field-note">
								{Object.keys(ai).length > 0
									? `已帶入 AI 練習結果 ${Object.keys(ai).length} 步`
									: "查無 AI 練習紀錄，請手動評估"}
							</span>
						)}
					</label>
					<label className="field">
						<span>評估者</span>
						<select
							value={pharmacist}
							onChange={(e) => setPharmacist(e.target.value)}
						>
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
					<fieldset className="field">
						<legend>病人因素（影響怎麼教）</legend>
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
					{/* One confirmation for everything the camera already judged. */}
					{aiDone.length > 0 && (
						<div className="ai-block">
							<div className="ai-head">
								<b>AI 已判 {aiDone.length} 步</b>
								<span className="muted">確認就好，不用重打</span>
							</div>
							<ul className="ai-list">
								{applicable
									.filter((s) => stepReviewSource(s.code) === "ai")
									.map((s) => (
										<li
											key={s.code}
											className={steps[s.code] === "錯誤" ? "ng" : "ok"}
										>
											<span className="ck-char">{s.char}</span>
											<span className="ai-text">{s.text}</span>
											<b>
												{steps[s.code] ?? "未判"}
												{ai[s.code] && (
													<span className="conf" title="相機信心值">
														{Math.round(ai[s.code].confidence * 100)}%
													</span>
												)}
											</b>
											<label className="demo">
												<input
													type="checkbox"
													checked={Boolean(demonstrated[s.code])}
													onChange={(e) =>
														setDemonstrated(
															(prev: Record<string, boolean>) => ({
																...prev,
																[s.code]: e.target.checked,
															}),
														)
													}
												/>
												當場示範過
											</label>
										</li>
									))}
							</ul>
						</div>
					)}

					{/* Only the steps nothing else can judge. */}
					<StepChecklist
						steps={manual}
						drug={drug}
						value={steps}
						onChange={setSteps}
						demonstrated={demonstrated}
						onDemonstrate={setDemonstrated}
					/>

					{/* Two questions, not ten. */}
					<section className="knowledge">
						<h2>
							確認兩件事（{Object.keys(knowledge).length}/{questions.length}）
						</h2>
						<ol className="kq">
							{questions.map((q) => (
								<li key={q.index}>
									<span className="kq-text">{q.text}</span>
									<span className="seg">
										<button
											type="button"
											aria-pressed={knowledge[String(q.index)] === "對"}
											onClick={() =>
												setKnowledge((p: Record<string, "對" | "不對">) => ({
													...p,
													[String(q.index)]: "對",
												}))
											}
										>
											對
										</button>
										<button
											type="button"
											aria-pressed={knowledge[String(q.index)] === "不對"}
											onClick={() =>
												setKnowledge((p: Record<string, "對" | "不對">) => ({
													...p,
													[String(q.index)]: "不對",
												}))
											}
										>
											不對
										</button>
									</span>
								</li>
							))}
						</ol>
					</section>

					<div className="rx-save">
						<p className="rx-progress">
							AI 已判 {aiDone.length} 步 · 待補{" "}
							{manual.filter((s) => !steps[s.code]).length} 步 ·{" "}
							{Object.keys(knowledge).length}/{questions.length} 題
						</p>
						<button
							type="button"
							className="btn-primary"
							disabled={!ready}
							onClick={save}
						>
							{ready
								? "儲存收案"
								: `還差 ${missingCount(manual, steps, questions, knowledge)}`}
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

/** What is still missing, as a count the pharmacist can act on. */
function missingCount(
	manual: { code: string }[],
	steps: Record<string, string>,
	questions: KnowledgeQuestion[],
	knowledge: Record<string, string>,
): number {
	return (
		manual.filter((s) => !steps[s.code]).length +
		questions.filter((q) => !knowledge[String(q.index)]).length
	);
}
