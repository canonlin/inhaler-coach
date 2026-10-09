/** Typed client for the v2 API. Keeps fetch concerns out of the components. */

export type DeviceKind = "MDI" | "RSP" | "ELP" | "BRZ";
export type QccStage = "改善前" | "改善後";

export interface Drug {
	name: string;
	label: string;
	device: DeviceKind;
	hasIcs: boolean;
	needsShake: boolean;
	doses?: number;
	note?: string;
}

export interface Step {
	device: DeviceKind;
	code: string;
	char: string;
	text: string;
	critical: boolean;
	condition?: "shake" | "ics";
}

export interface Reference {
	drugs: Drug[];
	pharmacists: string[];
	knowledge: { index: number; text: string; answer: "對" | "不對"; reversed: boolean }[];
	steps: string[];
}

export interface TechniqueStats {
	cases: number;
	totalSteps: number;
	wrongSteps: number;
	errorRate: number;
	criticalRate: number;
	correctRate: number;
}

export interface StepRate {
	stepCode: string;
	assessed: number;
	wrong: number;
	errorRate: number;
	critical: boolean;
	share?: number;
}

export interface Summary {
	ok: true;
	total: number;
	baseline: TechniqueStats;
	after: TechniqueStats;
	knowledge: { cases: number; mean: number };
	topSteps: StepRate[];
	stepRates: StepRate[];
	pareto: StepRate[];
	enrolment: { target: number; after: number };
}

const base = import.meta.env.VITE_API_BASE ?? "";

async function get<T>(path: string, params?: Record<string, string | number>): Promise<T> {
	const qs = params
		? `?${new URLSearchParams(
				Object.entries(params)
					.filter(([, v]) => v !== "" && v !== undefined)
					.map(([k, v]) => [k, String(v)]),
			)}`
		: "";
	const res = await fetch(`${base}${path}${qs}`);
	const json = await res.json();
	if (!res.ok || json.ok === false) throw new Error(json.error ?? `HTTP ${res.status}`);
	return json as T;
}

export const fetchSummary = (params?: { qccStage?: string; target?: number }) =>
	get<Summary>("/api/metrics/summary", params);

export const fetchReference = () => get<Reference>("/api/reference");

export const fetchFollowups = () =>
	get<{ followups: Followup[] }>("/api/followups");

export interface Followup {
	id: string;
	task: string;
	due_start: string;
	due_end: string;
	priority: "P1" | "P2" | "P3";
	mrn_tail: string;
	drug: string | null;
	device: DeviceKind | null;
	pharmacist: string | null;
	overdue: boolean;
	dueSoon: boolean;
}