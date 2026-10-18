/**
 * Registration page: education.html + app.js, migrated.
 *
 * Same fields in the same order (name → identifier → maintenance → rescue
 * opt-in), same validation messages (validate.ts, transcribed from app.py),
 * same result (DualTagSummary). What changed is everything around them:
 * Radix Select/Checkbox + labelled Fields instead of native controls, type
 * scale instead of hand sizes, and the submit posts to this repo's API
 * instead of Flask.
 *
 * Identity comes from LIFF (liff.ts). Without it the form can be filled but
 * not submitted — an anonymous journey record would be unplottable.
 */

import * as SelectPrimitive from "@radix-ui/react-select";
import { useEffect, useState } from "react";

import {
	Button,
	Checkbox,
	Field,
	Input,
	Select,
	SelectItem,
} from "../../pharmacist/components/ui";
import { findDrug, maintenanceDrugs, RESCUE_ONLY_ID } from "../catalog";
import { DualTagSummary } from "../components/DualTagSummary";
import { LINE_DEVICE_LABELS, type LineDevice } from "../devices";
import { submitJourney } from "../journeys";
import { LineShell } from "../LineShell";
import { getLiffContext } from "../liff";
import { type RegistrationMed, validateRegistration } from "../validate";

const DEVICES: LineDevice[] = ["MDI", "DPI", "SMI"];

export function RegisterPage() {
	const [name, setName] = useState("");
	const [identifier, setIdentifier] = useState("");
	const [maintenanceId, setMaintenanceId] = useState<string | undefined>();
	const [hasRescue, setHasRescue] = useState(false);
	const [lineUserId, setLineUserId] = useState<string | null>(null);
	const [liffFailed, setLiffFailed] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [sending, setSending] = useState(false);
	const [done, setDone] = useState<{
		tag1: string;
		tag2: string;
		names: string[];
	} | null>(null);

	useEffect(() => {
		getLiffContext().then((c) => {
			setLineUserId(c.userId);
			if (!c.userId) setLiffFailed(true);
		});
	}, []);

	const meds: RegistrationMed[] = maintenanceId
		? [
				{ role: "maintenance", drugId: maintenanceId },
				...(hasRescue
					? [{ role: "rescue" as const, drugId: RESCUE_ONLY_ID }]
					: []),
			]
		: [];

	async function submit() {
		setError(null);
		const problem = validateRegistration({
			name,
			identifier,
			medications: meds,
		});
		if (problem) {
			setError(problem);
			return;
		}
		if (!lineUserId) {
			setError("請在 LINE 內開啟此頁，才能送出。");
			return;
		}
		setSending(true);
		try {
			const res = await submitJourney({
				name: name.trim(),
				identifier: identifier.trim(),
				medications: meds,
				lineUserId,
			});
			setDone({
				tag1: res.tag1,
				tag2: res.tag2,
				names: res.medications.map((m) => m.drugName),
			});
		} catch (e) {
			setError(e instanceof Error ? e.message : "送出失敗，請稍後再試。");
		} finally {
			setSending(false);
		}
	}

	return (
		<LineShell title="開始衛教">
			<div className="flex flex-col gap-4">
				{liffFailed && (
					<p role="status" className="text-base text-text-secondary">
						註：尚未取得 LINE 身份，可以先填表，但送出前請在 LINE 內開啟此頁。
					</p>
				)}
				<Field label="病人姓名" htmlFor="line-name">
					<Input
						id="line-name"
						value={name}
						onChange={(e) => setName(e.target.value)}
						placeholder="王○明"
						autoComplete="name"
					/>
				</Field>
				<Field label="病人識別 ID" htmlFor="line-identifier">
					<Input
						id="line-identifier"
						value={identifier}
						onChange={(e) => setIdentifier(e.target.value)}
						placeholder="P00123"
						autoComplete="off"
					/>
				</Field>
				<Field label="保養用吸入劑" htmlFor="line-maintenance">
					<Select
						id="line-maintenance"
						value={maintenanceId}
						onValueChange={(v) => setMaintenanceId(v || undefined)}
						placeholder="請選擇…"
					>
						{DEVICES.map((t) => (
							<SelectPrimitive.Group key={t}>
								<SelectPrimitive.Label className="px-2 pt-2 text-base font-bold text-text-muted">
									{LINE_DEVICE_LABELS[t]}
								</SelectPrimitive.Label>
								{maintenanceDrugs()
									.filter((d) => d.type === t)
									.map((d) => (
										<SelectItem key={d.id} value={d.id}>
											{d.displayName}
										</SelectItem>
									))}
							</SelectPrimitive.Group>
						))}
					</Select>
				</Field>
				<div className="flex items-center gap-3">
					<Checkbox
						id="line-rescue"
						checked={hasRescue}
						onCheckedChange={(v) => setHasRescue(v === true)}
					/>
					<label
						htmlFor="line-rescue"
						className="text-base font-semibold text-text"
					>
						我還有緊急用吸入劑
					</label>
				</div>
				{hasRescue && (
					<p className="text-base text-text-secondary">
						緊急用吸入劑：
						{findDrug(RESCUE_ONLY_ID)?.displayName}
						（目前只收這一支，選別的會被退件）
					</p>
				)}
				{error && (
					<p role="alert" className="text-base font-bold text-danger">
						{error}
					</p>
				)}
				{done ? (
					<DualTagSummary
						tag1={done.tag1}
						tag2={done.tag2}
						drugNames={done.names}
					/>
				) : (
					<Button size="lg" onClick={submit} disabled={sending}>
						{sending ? "送出中…" : "送出"}
					</Button>
				)}
			</div>
		</LineShell>
	);
}
