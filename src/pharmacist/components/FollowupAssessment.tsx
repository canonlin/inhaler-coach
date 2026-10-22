/**
 * Completing a follow-up: the M1 assessment.
 *
 * Closing a queue row used to record nothing, which meant the plan's
 * before/after could never gain a case from real work. The endpoint now accepts
 * an assessment; this is the screen that produces one.
 *
 * One rule governs what may be recorded, and it is the reason this form asks
 * about *every* applicable step rather than only the ones that failed last
 * time:
 *
 *   Measuring only the previously-wrong steps would make improvement look
 *   better than it is. A patient who has since started fumbling a step nobody
 *   re-checked would still be counted as an improvement, because the only rows
 *   in the comparison are the ones that were already bad. The error rate is
 *   "people with at least one error ÷ people assessed" — restricting the
 *   denominator's contents is how that number stops meaning what it says.
 *
 * So the form covers the whole device, same as the original assessment. The
 * burden is kept down the same way it is there: when the patient has practised
 * with the camera since, those steps arrive pre-judged and are one confirmation
 * rather than eight taps. The steps to re-check are marked, not filtered — they
 * are where attention belongs, not the whole scope.
 */
import { useMemo, useState } from "react";

import {
	closeFollowup,
	type Followup,
	fetchPendingSession,
} from "../../api-client";
import { DRUG_BY_NAME, type Drug } from "../../domain/drugs.js";
import { KNOWLEDGE, type KnowledgeQuestion } from "../../domain/roster.js";
import {
	pharmacistSteps,
	STEP_BY_CODE,
	type Step,
	stepReviewSource,
} from "../../domain/steps.js";
import { cn } from "../../lib/utils";
import { StepChecklist } from "./StepChecklist";
import {
	Badge,
	Button,
	Card,
	CardHeader,
	Field,
	Select,
	SelectItem,
} from "./ui";

/** Two questions, chosen by device — the same rule the M0 entry uses. */
function targetedQuestions(device: string): KnowledgeQuestion[] {
	if (device === "MDI") return [KNOWLEDGE[2], KNOWLEDGE[6]];
	return [KNOWLEDGE[2], KNOWLEDGE[9]];
}

type Verdict = "正確" | "錯誤";

export function FollowupAssessment({
	followup,
	pharmacist,
	onDone,
	onCancel,
}: {
	followup: Followup;
	pharmacist: string;
	onDone: (message: string) => void;
	onCancel: () => void;
}) {
	const drug: Drug | null = followup.drug
		? (DRUG_BY_NAME[followup.drug] ?? null)
		: null;

	const [steps, setSteps] = useState<Record<string, Verdict>>({});
	const [demonstrated, setDemonstrated] = useState<Record<string, boolean>>({});
	const [knowledge, setKnowledge] = useState<Record<string, "對" | "不對">>({});
	const [ai, setAi] = useState<Record<string, Verdict> | null>(null);
	const [aiLooked, setAiLooked] = useState(false);
	const [busy, setBusy] = useState(false);
	const [error, setError] = useState<string | null>(null);

	/*
	 * The camera only knows the six steps it watches. Anything it judged is
	 * confirmed rather than typed; the rest are the pharmacist's to watch the
	 * patient do.
	 */
	const kind = followup.device ?? "MDI";
	const manual: Step[] = useMemo(
		() => (drug ? pharmacistSteps(kind, drug) : []),
		[drug, kind],
	);

	async function loadAi() {
		setAiLooked(true);
		try {
			// The queue carries only mrn_tail; the full record number is hashed
			// on the way in and is not recoverable from a row. The session lookup
			// is therefore opt-in from the case-entry screen, where the number is
			// still in hand, rather than silently reaching for an id it cannot get.
			const s = await fetchPendingSession("");
			const judged: Record<string, Verdict> = {};
			for (const [code, step] of Object.entries(s.steps ?? {})) {
				if (stepReviewSource(code) === "ai" && step?.value) {
					judged[code] = step.value as Verdict;
				}
			}
			setAi(Object.keys(judged).length > 0 ? judged : null);
			if (Object.keys(judged).length > 0)
				setSteps((p) => ({ ...judged, ...p }));
		} catch {
			// No session is the ordinary case, not an error worth showing.
			setAi(null);
		}
	}

	const questions = targetedQuestions(followup.device ?? "MDI");
	// Parity with the M0 entry, which requires exactly the camera-blind steps
	// (see CaseEntry's `ready`). Requiring the whole device here would make M1
	// cover a different set of steps than M0 on the same patient, which breaks
	// the comparison in a different way than omitting them does.
	const answered = manual.filter((s) => steps[s.code]).length;
	const ready =
		drug != null &&
		answered === manual.length &&
		questions.every((q) => knowledge[String(q.index)]);

	async function submit() {
		setBusy(true);
		setError(null);
		try {
			const res = await closeFollowup({
				id: followup.id,
				by: pharmacist,
				status: "done",
				assessment: { steps, knowledge, demonstrated },
			});
			onDone(
				res.assessment
					? `已結案並記錄 M1 評估（${answered} 步、${questions.length} 題）${
							res.superseded > 0 ? `，另結案 ${res.superseded} 個回診時段` : ""
						}`
					: "已結案",
			);
		} catch (e) {
			setError(e instanceof Error ? e.message : "結案失敗");
		} finally {
			setBusy(false);
		}
	}

	if (!drug) {
		return (
			<Card className="p-5">
				<p className="text-base text-danger">
					這筆追蹤沒有對應的收案紀錄，無法記錄評估。
				</p>
				<Button className="mt-3" onClick={onCancel}>
					返回
				</Button>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader
				title={`複評 …${followup.mrn_tail} · ${drug.label}`}
				description={`這是${followup.slot ? `第 ${followup.slot.slice(1)} 天` : "這次"}的回診 Checklist（${followup.task}）。結案後會產生一筆 M1，成效頁的前後比較才有資料；同一個案排定在別天的回診時段會一併結案，不會再跳出來提醒。要記的是相機看不到的那幾步，和收案時範圍相同；若只複評上次錯的，改善會被高估。`}
				action={
					<span className="text-sm font-semibold tabular-nums text-text-secondary">
						步驟 {answered}／{manual.length}
					</span>
				}
			/>

			<div className="space-y-4 px-5 py-4">
				{/* What to pay attention to. Marked, not filtered — see the note
				    at the top of this file. */}
				{followup.wrongSteps.length > 0 && (
					<p className="flex flex-wrap items-center gap-2 rounded-md bg-danger-soft px-4 py-3 text-base text-danger">
						<span className="font-semibold">上次錯在這幾步：</span>
						{followup.wrongSteps.map((c) => (
							<span
								key={c}
								className={cn(
									"rounded px-2 py-0.5 text-base",
									steps[c]
										? "bg-success-soft text-success"
										: "bg-danger-soft text-danger",
								)}
							>
								{STEP_BY_CODE[c]?.text ?? c}
							</span>
						))}
					</p>
				)}

				{!aiLooked && (
					<div className="flex flex-wrap items-center gap-3 rounded-md bg-surface-muted px-4 py-3">
						<p className="grow text-base text-text-secondary">
							這位病人有先做 AI 練習嗎？有���話相機判過的步驟可以直接帶入。
						</p>
						<Button size="sm" onClick={loadAi}>
							帶入 AI 練習結果
						</Button>
					</div>
				)}

				{ai && (
					<p className="text-base text-success">
						已帶入 {Object.keys(ai).length} 步相機判定，確認即可。
					</p>
				)}

				<StepChecklist
					steps={manual}
					drug={drug}
					value={steps}
					onChange={setSteps}
					demonstrated={demonstrated}
					onDemonstrate={setDemonstrated}
				/>

				{/* The AI-judged steps, shown so the record is complete rather
				    than silently partial. */}
				{ai && (
					<Card>
						<CardHeader
							title={`AI 已判 ${Object.keys(ai).length} 步`}
							description="相機看過了，確認就好，不用重打。"
						/>
						<ul className="flex flex-wrap gap-2 px-5 py-4">
							{Object.entries(ai).map(([code, v]) => (
								<li key={code}>
									<Badge tone={v === "正確" ? "success" : "danger"}>
										{v === "正確" ? "正確" : "錯誤"}
									</Badge>
								</li>
							))}
						</ul>
					</Card>
				)}

				<Card>
					<CardHeader
						title={`${questions.length} 題知識題`}
						description="依裝置挑的，不是全部十題。"
					/>
					<div className="space-y-3 px-5 py-4">
						{questions.map((q) => (
							<Field
								key={q.index}
								htmlFor={`k${q.index}`}
								label={`Q${q.index}. ${q.text}`}
							>
								<Select
									id={`k${q.index}`}
									placeholder="—"
									value={knowledge[String(q.index)]}
									onValueChange={(v) =>
										setKnowledge((p) => ({
											...p,
											[String(q.index)]: v as "對" | "不對",
										}))
									}
									className="w-32"
								>
									<SelectItem value={"對"}>對</SelectItem>
									<SelectItem value={"不對"}>不對</SelectItem>
								</Select>
							</Field>
						))}
					</div>
				</Card>

				{error && <p className="text-base text-danger">{error}</p>}

				<div className="flex items-center gap-3">
					<Button onClick={submit} disabled={!ready || busy}>
						{busy
							? "結案中…"
							: `結案並記錄 M1（${answered}/${manual.length} 步）`}
					</Button>
					<Button variant="ghost" onClick={onCancel} disabled={busy}>
						取消
					</Button>
					{!ready && (
						<p className={cn("text-base", "text-text-secondary")}>
							還需要 {manual.length - answered} 個步驟、
							{questions.length -
								questions.filter((q) => knowledge[String(q.index)]).length}{" "}
							題
						</p>
					)}
				</div>
			</div>
		</Card>
	);
}
