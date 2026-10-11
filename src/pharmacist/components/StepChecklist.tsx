/**
 * The steps nothing else can judge.
 *
 * For pMDI that is two — opening the cap and sealing the lips. Everything the
 * camera covers is confirmed as a block elsewhere, so this list stays short on
 * purpose.
 */
import type { Drug } from "../../api-client";
import type { Step } from "../../domain/steps.js";
import { cn } from "../../lib/utils";
import {
	Badge,
	Button,
	Card,
	CardHeader,
	Checkbox,
	DataTable,
	Td,
	Th,
} from "./ui";

export function StepChecklist({
	steps,
	drug,
	value,
	onChange,
	demonstrated,
	onDemonstrate,
}: {
	steps: Step[];
	drug: Drug | null;
	value: Record<string, "正確" | "錯誤">;
	onChange: (next: Record<string, "正確" | "錯誤">) => void;
	demonstrated: Record<string, boolean>;
	onDemonstrate: (next: Record<string, boolean>) => void;
}) {
	if (!drug || !steps.length) return null;
	const done = steps.filter((s) => value[s.code]).length;

	return (
		<Card>
			<CardHeader
				title={`請你看這 ${steps.length} 步`}
				description="相機看不到這幾步。請病人當場示範，再記結果。"
				action={
					<span className="text-sm font-semibold tabular-nums text-text-secondary">
						{done}／{steps.length}
					</span>
				}
			/>
			<DataTable>
				<thead>
					<tr>
						<Th className="w-14">步</Th>
						<Th>操作</Th>
						<Th className="w-56">判定</Th>
						<Th className="w-36">當場示範過</Th>
					</tr>
				</thead>
				<tbody>
					{steps.map((step) => {
						const picked = value[step.code];
						return (
							<tr
								key={step.code}
								className={cn(picked && "bg-surface-muted/60")}
							>
								<Td>
									<span className="inline-flex size-7 items-center justify-center rounded-md bg-surface-muted text-sm font-bold text-text">
										{step.char}
									</span>
								</Td>
								<Td>
									<span className="text-text">{step.text}</span>
									{step.critical && (
										<Badge tone="warning" className="ml-2">
											★ 關鍵
										</Badge>
									)}
								</Td>
								<Td>
									<div className="flex gap-2">
										<Button
											size="sm"
											variant={picked === "正確" ? "primary" : "secondary"}
											aria-pressed={picked === "正確"}
											onClick={() =>
												onChange({ ...value, [step.code]: "正確" })
											}
										>
											正確
										</Button>
										<Button
											size="sm"
											variant={picked === "錯誤" ? "danger" : "secondary"}
											aria-pressed={picked === "錯誤"}
											onClick={() =>
												onChange({ ...value, [step.code]: "錯誤" })
											}
										>
											錯誤
										</Button>
									</div>
								</Td>
								<Td>
									<div className="inline-flex min-h-11 items-center gap-2.5 text-base text-text-secondary">
										<Checkbox
											id={`demo-${step.code}`}
											aria-label={`${step.text} 示範過`}
											checked={Boolean(demonstrated[step.code])}
											onCheckedChange={(v) =>
												onDemonstrate({
													...demonstrated,
													[step.code]: v === true,
												})
											}
										/>
										示範過
									</div>
								</Td>
							</tr>
						);
					})}
				</tbody>
			</DataTable>
		</Card>
	);
}
