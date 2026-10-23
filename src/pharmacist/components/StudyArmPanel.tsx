/**
 * The 1:1 study allocation, on the screen where a case is recorded.
 *
 * The study runs one patient against one: 實驗組 gets the AI practice,
 * 對照組 gets the usual education. The rotation suggests which group the next
 * patient goes to, and the pharmacist can put them in the other one — a
 * patient who will not use the camera, a case she knows belongs in the other
 * group.
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
} from "../../domain/study-arm.js";
import { Badge, Button, Card, CardHeader } from "./ui";

export function StudyArmPanel({
	balance,
	value,
	onChange,
	disabled,
	readOnly,
}: {
	/** The live balance. Null while it is being read. */
	balance: ArmBalance | null;
	/** The arm currently selected for this patient. */
	value: string | null;
	/** Called when the pharmacist picks a group herself. */
	onChange: (arm: string) => void;
	disabled?: boolean;
	/**
	 * The count without the choice.
	 *
	 * The enrollment screen opens with the record number as its only control,
	 * and that is deliberate: twenty-five controls on arrival is what made the
	 * form cost twenty-five taps. So the tally is on screen from the start,
	 * and the two buttons appear with the checklist, where the decision is
	 * actually made.
	 */
	readOnly?: boolean;
}) {
	const suggested = balance?.next ?? ARM_EXPERIMENTAL;
	const control = value === ARM_CONTROL;

	return (
		<Card data-testid="arm-panel">
			<CardHeader
				title="研究分組"
				description={
					readOnly
						? "實驗組做 AI 練習，對照組做一般衛教。分組在填清單時選。"
						: "實驗組做 AI 練習，對照組做一般衛教。預設照輪替排，藥師可以自己換。"
				}
			/>
			<div className="space-y-3 px-5 py-4">
				{!readOnly && (
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
					<Badge tone="neutral">下一位建議：{ARM_LABEL[suggested]}</Badge>
					{balance && (
						<span data-testid="arm-balance">
							{ARM_LABEL[ARM_EXPERIMENTAL]} {balance.experimental} 人 ·{" "}
							{ARM_LABEL[ARM_CONTROL]} {balance.control} 人 · 比例{" "}
							{balance.ratio}
						</span>
					)}
				</div>

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
				{control && !readOnly && (
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
