/**
 * The steps nothing else can judge. For pMDI that is two — opening the cap and
 * sealing the lips. Everything the camera covers is confirmed as a block
 * elsewhere, so this list stays short on purpose.
 */
import type { Drug } from "../../api-client";
import type { Step } from "../../domain/steps.js";

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
		<div className="checklist">
			<div className="checklist-head">
				<h2>請你看這 {steps.length} 步</h2>
				<span className="muted">
					{done}／{steps.length}
				</span>
			</div>
			<p className="hint">相機看不到這幾步。請病人當場示範，再記結果。</p>

			<ol className="ck-list">
				{steps.map((step) => {
					const picked = value[step.code];
					return (
						<li
							key={step.code}
							className={`ck${picked ? " done" : ""}${picked === "錯誤" ? " wrong" : ""}`}
						>
							<span className="ck-char" aria-hidden="true">
								{step.char}
							</span>
							<span className="ck-text">
								{step.text}
								{step.critical && (
									<span className="crit" title="關鍵步驟">
										★
									</span>
								)}
							</span>
							<span className="seg">
								<button
									type="button"
									className="ok"
									aria-pressed={picked === "正確"}
									onClick={() => onChange({ ...value, [step.code]: "正確" })}
								>
									正確
								</button>
								<button
									type="button"
									className="ng"
									aria-pressed={picked === "錯誤"}
									onClick={() => onChange({ ...value, [step.code]: "錯誤" })}
								>
									錯誤
								</button>
							</span>
							<label className="demo">
								<input
									type="checkbox"
									checked={Boolean(demonstrated[step.code])}
									onChange={(e) =>
										onDemonstrate({
											...demonstrated,
											[step.code]: e.target.checked,
										})
									}
								/>
								示範過
							</label>
						</li>
					);
				})}
			</ol>
		</div>
	);
}
