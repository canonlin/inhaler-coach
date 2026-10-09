/**
 * The checklist. Steps and their wording come from the spine, so this component
 * decides nothing about which steps exist or which are critical.
 */
import type { Drug } from "../../admin/api-client";
import type { Step } from "../../domain/steps.js";

export function StepChecklist({
	steps,
	drug,
	value,
	onChange,
}: {
	steps: Step[];
	drug: Drug | null;
	value: Record<string, "正確" | "錯誤">;
	onChange: (next: Record<string, "正確" | "錯誤">) => void;
}) {
	if (!drug) {
		return <p className="empty">先選擇吸入劑，這裡會列出該品項適用的操作步驟。</p>;
	}
	if (!steps.length) {
		return <p className="empty">這個品項沒有可評的步驟。</p>;
	}

	const done = steps.filter((s) => value[s.code]).length;

	return (
		<div className="checklist">
			<div className="checklist-head">
				<h2>{drug.label}</h2>
				<span className="chip">{drug.hasIcs ? "含類固醇 · 需漱口" : "不含類固醇"}</span>
				<span className="chip">{DEVICES_LABEL[drug.device] ?? drug.device}</span>
				<span className="muted">{done}／{steps.length}</span>
			</div>

			<ol className="ck-list">
				{steps.map((step) => {
					const picked = value[step.code];
					return (
						<li key={step.code} className={`ck${picked ? " done" : ""}${picked === "錯誤" ? " wrong" : ""}`}>
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
							<span className="seg" role="group" aria-label={`${step.char} 判定`}>
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
						</li>
					);
				})}
			</ol>
		</div>
	);
}

const DEVICES_LABEL: Record<string, string> = {
	MDI: "定量噴霧",
	RSP: "軟霧",
	ELP: "乾粉 Ellipta",
	BRZ: "乾粉 Breezhaler",
};