/**
 * The 1:1 study allocation, on the screen where a case is recorded.
 *
 * The study runs one patient against one: 實驗組 gets the AI practice,
 * 對照組 gets the usual education. The rotation suggests which group the next
 * patient goes to, and the pharmacist can put them in the other one — a
 * patient who will not use the camera, a case she knows belongs in the other
 * group.
 *
 * The allocation belongs to the research plan, and the research plan is one
 * product — 吸必擴. Everything else on this screen is QCC. So the tally is
 * about the research cohort, and the two buttons only appear when the
 * product in front of her is one the study enrolled.
 *
 * The counts stay on screen because the balance is the thing she is managing.
 * A number that only appears after the case is saved is a number she cannot
 * act on: the suggestion is worth following only while she can see what the
 * last twenty allocations did to the ratio.
 *
 * The rule itself lives in src/domain/study-arm.js, so this screen, the API
 * and the count cannot drift apart.
 */
import type { ArmBalance } from "../../api-client";
import {
	ARM_CONTROL,
	ARM_EXPERIMENTAL,
	ARM_LABEL,
	ARM_MEANING,
	STUDY_COHORT_LABEL,
} from "../../domain/study-arm.js";
import { Badge, Button, Card, CardHeader } from "./ui";

export function StudyArmPanel({
	balance,
	value,
	onChange,
	disabled,
	cohort,
}: {
	/** The live balance. Null while it is being read. */
	balance: ArmBalance | null;
	/** The arm currently selected for this patient. */
	value: string | null;
	/** Called when the pharmacist picks a group herself. */
	onChange: (arm: string) => void;
	disabled?: boolean;
	/**
	 * Whether the product in front of her is in the research cohort.
	 *
	 * null means the product has not been chosen yet: the tally is on screen,
	 * but there is nobody to put in a group until the product is known.
	 */
	cohort: boolean | null;
}) {
	const suggested = balance?.next ?? ARM_EXPERIMENTAL;
	const control = value === ARM_CONTROL;
	// The research plan takes a hundred people. When it has taken them, there is
	// no group left to put this patient in, and offering the buttons would be
	// offering a choice the server will refuse.
	const full = balance?.full ?? false;
	const canChoose = cohort === true && !full;

	return (
		<Card data-testid="arm-panel">
			<CardHeader
				title={`研究分組（${STUDY_COHORT_LABEL}）`}
				description={
					full && cohort === true
						? "研究計畫已收滿，這筆不會分派組別。"
						: canChoose
							? "實驗組做 AI 練習，對照組做一般衛教。預設照輪替排，藥師可以自己換。"
							: "實驗組做 AI 練習，對照組做一般衛教。研究計畫目前只收吸必擴。"
				}
			/>
			<div className="space-y-3 px-5 py-4">
				{canChoose && (
					<div className="flex flex-wrap gap-2">
						{[ARM_EXPERIMENTAL, ARM_CONTROL].map((arm) => (
							<Button
								key={arm}
								variant={value === arm ? "primary" : "secondary"}
								aria-pressed={value === arm}
								disabled={disabled}
								data-testid={`arm-${arm}`}
								onClick={() => onChange(arm)}
							>
								{ARM_LABEL[arm]}
								<span className="font-normal opacity-80">
									{ARM_MEANING[arm]}
								</span>
							</Button>
						))}
					</div>
				)}

				{/*
				 * The suggestion is marked on the button itself, so it is read
				 * at the same moment as the choice — a separate line saying
				 * 「建議實驗組」 above two buttons is one more thing to keep in
				 * the head while the hands work.
				 */}
				<div className="flex flex-wrap items-center gap-2 text-meta text-text-secondary">
					{cohort !== false && (
						<Badge tone="neutral">下一位建議：{ARM_LABEL[suggested]}</Badge>
					)}
					{balance && (
						<span data-testid="arm-balance">
							{ARM_LABEL[ARM_EXPERIMENTAL]} {balance.experimental} 人 ·{" "}
							{ARM_LABEL[ARM_CONTROL]} {balance.control} 人 · 比例{" "}
							{balance.ratio} · 已收 {balance.enrolled}/{balance.target} 人
						</span>
					)}
				</div>

				{/*
				 * Why this product is not in the study.
				 *
				 * The QCC covers every inhaler and the research plan does not.
				 * A case that is not in the study carries no arm at all, and NULL
				 * is not 對照組 — so the screen says so rather than leaving a
				 * pharmacist to wonder whether the case was left out.
				 */}
				{/*
				 * Why the plan has no room left.
				 *
				 * The patient is still enrolled and still gets the checklist, the
				 * follow-up visits and the before/after comparison — the QCC does
				 * not stop because the study finished. What stops is the group: a
				 * hundred and first patient is not one the plan agreed to see, and
				 * putting them in anyway would make the balance on screen a number
				 * about a study that did not happen.
				 */}
				{cohort === true && full && (
					<p
						className="rounded-md bg-surface-muted px-3 py-2 text-meta leading-relaxed text-text-secondary"
						data-testid="arm-study-full"
					>
						研究計畫已收滿 {balance?.target ?? 100}{" "}
						人，這筆仍可收案（清單、追蹤與前後測照常），但不會分派組別。
					</p>
				)}

				{cohort === false && (
					<p
						className="rounded-md bg-surface-muted px-3 py-2 text-meta leading-relaxed text-text-secondary"
						data-testid="arm-out-of-cohort"
					>
						這支藥不在研究計畫的分派範圍（目前只有{STUDY_COHORT_LABEL}
						），這筆不會分派組別。
					</p>
				)}

				{/*
				 * Why the control group does not get the camera's verdict.
				 *
				 * The pre-fill is the intervention: it is what the AI practice
				 * produced. Filling a control patient's checklist with it would
				 * put the countermeasure into the group that is supposed to get
				 * usual education, and the before/after comparison would be
				 * comparing the two groups on something other than what was
				 * given to them.
				 */}
				{control && canChoose && (
					<p
						className="rounded-md bg-surface-muted px-3 py-2 text-meta leading-relaxed text-text-secondary"
						data-testid="arm-control-note"
					>
						對照組不帶入 AI 練習結果，請照著清單手動評估。
					</p>
				)}
			</div>
		</Card>
	);
}
