/**
 * The 基本表格: who this person is, before the steps.
 *
 * These are the columns the pharmacist's QCC sheet has in its 「藥師收案」
 * worksheet, and the fields the old app's 收案表單 asked for on its first
 * step. The back office asks for the same ones, so a case recorded in the
 * platform and a row in the sheet are the same thing — which is what makes
 * 「前後比對」 a comparison between two sets of the same columns.
 *
 * The old app's own rule was kept: the fields it required are required here,
 * and the ones it left optional stay optional. A pharmacist standing at a
 * counter with a patient cannot be blocked on a field the study does not use.
 */
import {
	ENROLLMENT_BASIC_FIELDS,
	STAGE_BEFORE,
	stageForTimepoint,
	TIMEPOINTS,
} from "../../domain/enrollment-sheet.js";
import { cn } from "../../lib/utils";
import {
	Badge,
	Card,
	CardHeader,
	Field,
	Input,
	Select,
	SelectItem,
} from "./ui";

/** What the 基本資料 card holds. */
export interface BasicInfoValue {
	caseType: string;
	ageBand: string;
	sex: string;
	diagnosis: string[];
	usageDuration: string;
	priorEducation: string;
	educationMinutes: string;
}

export const EMPTY_BASIC_INFO: BasicInfoValue = {
	caseType: "",
	ageBand: "18-64歲",
	sex: "",
	diagnosis: [],
	usageDuration: "",
	priorEducation: "",
	educationMinutes: "",
};

/**
 * The fields the old form would not submit without.
 *
 * 病歷號碼、藥劑型、藥品名稱 are checked by the screen itself, so they are not
 * repeated here.
 */
const REQUIRED_KEYS = ["caseType", "ageBand", "sex", "usageDuration"] as const;

/** How many required fields are still empty. */
export function missingBasicFields(value: BasicInfoValue): number {
	return REQUIRED_KEYS.filter((k) => !value[k]).length;
}

export function BasicInfo({
	value,
	onChange,
	timepoint,
	onTimepoint,
}: {
	value: BasicInfoValue;
	onChange: (next: BasicInfoValue) => void;
	timepoint: string;
	onTimepoint: (next: string) => void;
}) {
	const set = <K extends keyof BasicInfoValue>(
		key: K,
		next: BasicInfoValue[K],
	) => onChange({ ...value, [key]: next });

	const field = (key: string) =>
		ENROLLMENT_BASIC_FIELDS.find((f) => f.key === key);

	return (
		<Card>
			<CardHeader
				title="📋 基本資料"
				description="和你的收案試算表同一組欄位。填了之後，平台裡的這一筆就能跟試算表裡的那一列直接對照。"
			/>
			<div className="space-y-5 px-5 py-4">
				<div className="grid gap-4 sm:grid-cols-2">
					<Field
						label="追蹤時間點"
						htmlFor="timepoint"
						hint="M0 是收案當天。M1、M3、M6 是追蹤；如果這位病人在『追蹤清單』有排定的回診，請從那裡結案，不要記兩次。"
					>
						<Select
							id="timepoint"
							value={timepoint}
							onValueChange={(v) => onTimepoint(v)}
						>
							{TIMEPOINTS.map((t) => (
								<SelectItem key={t.value} value={t.value}>
									{t.label}
								</SelectItem>
							))}
						</Select>
					</Field>

					{/*
					 * Which half of the study this row will be filed under, shown
					 * rather than asked.
					 *
					 * 前測 and 改善前 are the same measurement, so the pharmacist
					 * should not have to pick a word for it — but she should be
					 * able to see what she is recording, because a row filed on
					 * the wrong side of 前測／後測 cannot be paired and drops
					 * out of the before/after numbers without saying so.
					 *
					 * It is not a Field: a <label for> has to point at something
					 * a pointer can reach, and this is a reading, not a control.
					 * The label sits next to the value in the DOM, so a screen
					 * reader reads them together.
					 */}
					<div className="flex flex-col gap-1.5">
						<p className="text-base font-semibold text-text">這筆會記成</p>
						<div
							data-testid="stage-readonly"
							className="flex min-h-11 items-center gap-2 rounded-md border border-border bg-surface-muted px-3"
						>
							<Badge
								tone={
									stageForTimepoint(timepoint) === STAGE_BEFORE
										? "neutral"
										: "success"
								}
							>
								{stageForTimepoint(timepoint)}
							</Badge>
							<span className="text-base text-text-secondary">
								{timepoint === "M0"
									? "收案＝對策前的基準（前測）"
									: "追蹤＝對策後（後測）"}
							</span>
						</div>
					</div>

					<Field
						label={field("caseType")?.label ?? "病患類別"}
						htmlFor="caseType"
					>
						<Select
							id="caseType"
							value={value.caseType}
							onValueChange={(v) => set("caseType", v)}
						>
							<SelectItem value="">請選擇</SelectItem>
							{(field("caseType")?.options ?? []).map((o) => (
								<SelectItem key={o} value={o}>
									{o}
								</SelectItem>
							))}
						</Select>
					</Field>

					<Field label={field("ageBand")?.label ?? "年齡層"} htmlFor="ageBand">
						<Select
							id="ageBand"
							value={value.ageBand}
							onValueChange={(v) => set("ageBand", v)}
						>
							{(field("ageBand")?.options ?? []).map((o) => (
								<SelectItem key={o} value={o}>
									{o}
								</SelectItem>
							))}
						</Select>
					</Field>

					<Field label={field("sex")?.label ?? "性別"} htmlFor="sex">
						<Select
							id="sex"
							value={value.sex}
							onValueChange={(v) => set("sex", v)}
						>
							<SelectItem value="">請選擇</SelectItem>
							{(field("sex")?.options ?? []).map((o) => (
								<SelectItem key={o} value={o}>
									{o}
								</SelectItem>
							))}
						</Select>
					</Field>

					<Field
						label={field("usageDuration")?.label ?? "使用多久"}
						htmlFor="usageDuration"
					>
						<Select
							id="usageDuration"
							value={value.usageDuration}
							onValueChange={(v) => set("usageDuration", v)}
						>
							<SelectItem value="">請選擇</SelectItem>
							{(field("usageDuration")?.options ?? []).map((o) => (
								<SelectItem key={o} value={o}>
									{o}
								</SelectItem>
							))}
						</Select>
					</Field>

					<Field
						label={field("priorEducation")?.label ?? "曾接受衛教"}
						htmlFor="priorEducation"
					>
						<Select
							id="priorEducation"
							value={value.priorEducation}
							onValueChange={(v) => set("priorEducation", v)}
						>
							<SelectItem value="">請選擇</SelectItem>
							{(field("priorEducation")?.options ?? []).map((o) => (
								<SelectItem key={o} value={o}>
									{o}
								</SelectItem>
							))}
						</Select>
					</Field>

					<Field
						label={field("educationMinutes")?.label ?? "衛教時間（分鐘）"}
						htmlFor="educationMinutes"
						hint="選填。這次衛教花掉幾分鐘。"
					>
						<Input
							id="educationMinutes"
							type="number"
							min={0}
							inputMode="numeric"
							value={value.educationMinutes}
							onChange={(e) => set("educationMinutes", e.target.value)}
							placeholder="例：10"
						/>
					</Field>
				</div>

				<fieldset>
					<legend className="mb-1.5 text-base font-semibold text-text">
						{field("diagnosis")?.label ?? "診斷"}（可複選，選填）
					</legend>
					<div className="flex flex-wrap gap-2">
						{(field("diagnosis")?.options ?? []).map((o) => {
							const on = value.diagnosis.includes(o);
							return (
								<button
									key={o}
									type="button"
									aria-pressed={on}
									onClick={() =>
										set(
											"diagnosis",
											on
												? value.diagnosis.filter((d) => d !== o)
												: [...value.diagnosis, o],
										)
									}
									className={cn(
										"min-h-11 rounded-md border px-4 text-base font-semibold transition-colors",
										on
											? "border-primary bg-primary text-primary-foreground"
											: "border-border bg-surface text-text hover:bg-surface-muted",
									)}
								>
									{o}
								</button>
							);
						})}
					</div>
				</fieldset>
			</div>
		</Card>
	);
}
