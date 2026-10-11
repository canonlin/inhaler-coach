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
import { type AiStep, createCase, fetchPendingSession } from "../api-client.js";
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
import { cn } from "../lib/utils";
import { StepChecklist } from "./components/StepChecklist.jsx";
import {
	Badge,
	Button,
	Card,
	CardHeader,
	DataTable,
	Field,
	Input,
	Select,
	Td,
	Th,
} from "./components/ui";

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
			<div className="flex min-h-[calc(100dvh-9rem)] items-center justify-center py-8">
				{/* A screen whose only job is to ask for one number is a focus state:
				    centred, and sized for a hand holding a tablet at a counter. No
				    header band — the heading introduces the field directly, and the
				    divider between them only added a dead strip. */}
				<div className="w-full max-w-2xl rounded-lg border border-border-subtle bg-surface px-10 py-10 shadow-sm">
					<h1 className="text-2xl font-bold tracking-tight text-text">
						{askedMrn ? "這位病人用哪一種？" : "先輸入病歷號碼"}
					</h1>
					<p className="mt-2 text-base leading-relaxed text-text-secondary">
						{askedMrn
							? "若病人剛做過 AI 練習，這裡會自動帶入他練的那一支。"
							: "輸入後系統會查有沒有 AI 練習紀錄，有的話直接帶入藥品與判定，你只需要看相機看不到的兩步。"}
					</p>

					{!askedMrn && (
						<Field
							className="mt-8"
							label="病歷號碼"
							htmlFor="mrn"
							hint="病人領藥後輸入。"
						>
							<Input
								id="mrn"
								className="mrn-only text-xl"
								value={mrn}
								onChange={(e) => lookUpSession(e.target.value)}
								autoComplete="off"
								inputMode="numeric"
								placeholder="例：A123456789"
							/>
						</Field>
					)}

					{askedMrn && mrn.trim() && (
						<div className="mt-6">
							<Badge tone={Object.keys(ai).length > 0 ? "success" : "neutral"}>
								{Object.keys(ai).length > 0
									? `已帶入 AI 練習結果 ${Object.keys(ai).length} 步`
									: "查無 AI 練習紀錄，請手動評估"}
							</Badge>
						</div>
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
						<div className="drug-pick space-y-5">
							{drugsByDevice.map(([device, list]) => (
								<div key={device}>
									<h2 className="mb-2 text-xs font-bold tracking-wide text-text-secondary">
										{DEVICES[device].label}
									</h2>
									<div className="flex flex-wrap gap-2">
										{list.map((d) => (
											<Button
												key={d.name}
												variant="secondary"
												onClick={() => {
													setDrugName(d.name);
													setSteps({ ...(preset?.aiSteps ?? {}) });
												}}
											>
												{d.label}
												{d.hasIcs && <span className="text-primary">ICS</span>}
											</Button>
										))}
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			</div>
		);
	}

	return (
		<div className="grid gap-6 lg:grid-cols-[20rem_minmax(0,1fr)]">
			{/* Identity and teaching context, in a narrow column because it is read
			    once and then left alone while the right column does the work. */}
			<aside className="space-y-5">
				<Card>
					<CardHeader title="這位病人" />
					<div className="space-y-4 px-5 py-4">
						<Field label="病歷號碼" htmlFor="mrn2">
							<Input
								id="mrn2"
								value={mrn}
								onChange={(e) => lookUpSession(e.target.value)}
								autoComplete="off"
								inputMode="numeric"
							/>
						</Field>
						{mrn.trim() && (
							<Badge tone={Object.keys(ai).length > 0 ? "success" : "neutral"}>
								{Object.keys(ai).length > 0
									? `已帶入 AI 練習結果 ${Object.keys(ai).length} 步`
									: "查無 AI 練習紀錄，請手動評估"}
							</Badge>
						)}

						<div className="rounded-md bg-surface-muted px-3 py-2.5">
							<div className="flex items-baseline justify-between gap-2">
								<span className="text-sm font-bold text-text">
									{drug.label}
								</span>
								<Button
									variant="ghost"
									size="sm"
									onClick={() => setDrugName("")}
								>
									換藥
								</Button>
							</div>
							<p className="mt-0.5 text-xs text-text-secondary">
								{drug.hasIcs ? "含類固醇" : "不含類固醇"} ·{" "}
								{DEVICES[drug.device].speed}
							</p>
						</div>

						<Field label="評估者" htmlFor="pharmacist">
							<Select
								id="pharmacist"
								value={pharmacist}
								onChange={(e) => setPharmacist(e.target.value)}
							>
								{PHARMACISTS.map((p) => (
									<option key={p}>{p}</option>
								))}
							</Select>
						</Field>

						<Field label="院區" htmlFor="campus">
							<Select
								id="campus"
								value={campus}
								onChange={(e) => setCampus(e.target.value)}
							>
								{CAMPUSES.map((c) => (
									<option key={c}>{c}</option>
								))}
							</Select>
						</Field>

						<fieldset>
							<legend className="mb-1.5 text-sm font-semibold text-text">
								病人因素（影響怎麼教）
							</legend>
							<div className="flex flex-wrap gap-2">
								{FACTORS.map((f: Factor) => (
									<Button
										key={f.code}
										size="sm"
										variant={factors.includes(f.code) ? "primary" : "secondary"}
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
									</Button>
								))}
							</div>
						</fieldset>
					</div>
				</Card>
			</aside>

			<div className="space-y-6">
				{/* One confirmation for everything the camera already judged. */}
				{aiDone.length > 0 && (
					<Card>
						<CardHeader
							title={`AI 已判 ${aiDone.length} 步`}
							description="相機看過了，確認就好，不用重打。百分比是相機信心值。"
						/>
						<DataTable>
							<thead>
								<tr>
									<Th className="w-14">步</Th>
									<Th>操作</Th>
									<Th className="w-28 text-right">判定</Th>
									<Th className="w-36">當場示範過</Th>
								</tr>
							</thead>
							<tbody>
								{applicable
									.filter((s) => stepReviewSource(s.code) === "ai")
									.map((s) => (
										<tr key={s.code}>
											<Td>
												<span className="inline-flex size-7 items-center justify-center rounded-md bg-surface-muted text-sm font-bold text-text">
													{s.char}
												</span>
											</Td>
											<Td className="text-text-secondary">{s.text}</Td>
											<Td className="text-right">
												<Badge
													tone={steps[s.code] === "錯誤" ? "danger" : "success"}
												>
													{steps[s.code] ?? "未判"}
													{ai[s.code]
														? ` · ${Math.round(ai[s.code].confidence * 100)}%`
														: ""}
												</Badge>
											</Td>
											<Td>
												<label className="inline-flex min-h-9 cursor-pointer items-center gap-2 text-sm text-text-secondary">
													<input
														type="checkbox"
														className="size-4"
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
													示範過
												</label>
											</Td>
										</tr>
									))}
							</tbody>
						</DataTable>
					</Card>
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
				<Card>
					<CardHeader
						title={`確認兩件事（${Object.keys(knowledge).length}/${questions.length}）`}
						description="依這位病人的裝置，挑出最容易錯的兩題。"
					/>
					<div className="divide-y divide-border-subtle">
						{questions.map((q) => (
							<div
								key={q.index}
								className="flex flex-wrap items-center justify-between gap-3 px-5 py-3"
							>
								<p className="min-w-0 flex-1 text-sm text-text">{q.text}</p>
								<div className="flex gap-2">
									<Button
										size="sm"
										variant={
											knowledge[String(q.index)] === "對"
												? "primary"
												: "secondary"
										}
										aria-pressed={knowledge[String(q.index)] === "對"}
										onClick={() =>
											setKnowledge((p: Record<string, "對" | "不對">) => ({
												...p,
												[String(q.index)]: "對",
											}))
										}
									>
										對
									</Button>
									<Button
										size="sm"
										variant={
											knowledge[String(q.index)] === "不對"
												? "primary"
												: "secondary"
										}
										aria-pressed={knowledge[String(q.index)] === "不對"}
										onClick={() =>
											setKnowledge((p: Record<string, "對" | "不對">) => ({
												...p,
												[String(q.index)]: "不對",
											}))
										}
									>
										不對
									</Button>
								</div>
							</div>
						))}
					</div>
				</Card>

				{/* The save bar stays visible while the page scrolls: the decision to
				    finish belongs beside the progress, not at the bottom. */}
				<div className="sticky bottom-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border-subtle bg-surface/95 px-5 py-3 shadow-lg backdrop-blur">
					<p className="text-sm text-text-secondary">
						AI 已判 {aiDone.length} 步 · 待補{" "}
						{manual.filter((s) => !steps[s.code]).length} 步 ·{" "}
						{Object.keys(knowledge).length}/{questions.length} 題
					</p>
					<div className="flex items-center gap-3">
						{status && (
							<span
								className={cn(
									"text-sm font-semibold",
									status.tone === "good" ? "text-success" : "text-danger",
								)}
							>
								{status.text}
							</span>
						)}
						<Button size="lg" disabled={!ready} onClick={save}>
							{ready
								? "儲存收案"
								: missingLabel(manual, steps, questions, knowledge)}
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}

/**
 * What is still missing, phrased as the next action.
 *
 * "還差 4" told the pharmacist a number and nothing else; they still had to read
 * the progress line above to find out whether it was two steps, two questions,
 * or one of each. Saying which removes that second read.
 */
function missingLabel(
	manual: { code: string }[],
	steps: Record<string, string>,
	questions: KnowledgeQuestion[],
	knowledge: Record<string, string>,
): string {
	const pendingSteps = manual.filter((s) => !steps[s.code]).length;
	const pendingQs = questions.filter((q) => !knowledge[String(q.index)]).length;
	const parts: string[] = [];
	if (pendingSteps) parts.push(`${pendingSteps} 個步驟`);
	if (pendingQs) parts.push(`${pendingQs} 題`);
	return `還差 ${parts.join(" + ")}`;
}
