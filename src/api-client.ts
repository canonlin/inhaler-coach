/** Typed client for the v2 API. Keeps fetch concerns out of the components. */

import type { Engagement } from "./pharmacist/components/EngagementPanel";

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
	knowledge: {
		index: number;
		text: string;
		answer: "對" | "不對";
		reversed: boolean;
	}[];
	steps: string[];
}

export interface PairedResult {
	paired: number;
	b: number;
	c: number;
	p: number | null;
}

export interface TechniqueStats {
	/** People with at least one assessed step. */
	cases: number;
	/** People with at least one wrong step — the plan's numerator. */
	peopleWithError: number;
	/** People with at least one wrong ★ step. */
	peopleWithCritical: number;
	/** Per person, per the plan: 有任一錯誤的人 ÷ 完成評估的人。 */
	errorRate: number;
	criticalRate: number;
	correctRate: number;
	/** Step-level, kept for diagnosing which steps to fix. */
	totalSteps: number;
	wrongSteps: number;
	stepErrorRate: number;
}

export interface StepRate {
	stepCode: string;
	assessed: number;
	wrong: number;
	errorRate: number;
	critical: boolean;
	share?: number;
}

/** One step's rate in both cohorts, with the denominator that produced it. */
export interface StepPair {
	stepCode: string;
	critical: boolean;
	before: { rate: number; assessed: number } | null;
	after: { rate: number; assessed: number } | null;
	/**
	 * The ▲ 頑固 finding. The server decides, because the threshold depends on
	 * the false-alarm rate of marking a step that actually improved — not a
	 * display preference — and a client cannot compute that from these fields.
	 */
	stubborn: boolean;
	noAfterData: boolean;
}

export interface Summary {
	engagement?: Engagement;
	ok: true;
	total: number;
	baseline: TechniqueStats;
	after: TechniqueStats;
	paired?: PairedResult;
	knowledge: { cases: number; mean: number };
	topSteps: StepRate[];
	stepRates: StepRate[];
	/** Before → after per step, for the heatmap. Sorted by baseline rate. */
	stepsBeforeAfter: StepPair[];
	/** Per device class, both cohorts. Carries a device with no cases at all. */
	byDevice: {
		before: Record<string, TechniqueStats>;
		after: Record<string, TechniqueStats>;
	};
	pareto: StepRate[];
	enrolment: { target: number; after: number };
}

const base = import.meta.env.VITE_API_BASE ?? "";

async function get<T>(
	path: string,
	params?: Record<string, string | number>,
): Promise<T> {
	const qs = params
		? `?${new URLSearchParams(
				Object.entries(params)
					.filter(([, v]) => v !== "" && v !== undefined)
					.map(([k, v]) => [k, String(v)]),
			)}`
		: "";
	const res = await fetch(`${base}${path}${qs}`);
	const json = await res.json();
	if (!res.ok || json.ok === false)
		throw new Error(json.error ?? `HTTP ${res.status}`);
	return json as T;
}

export const fetchSummary = (params?: { qccStage?: string; target?: number }) =>
	get<Summary>("/api/metrics/summary", params);

export const fetchReference = () => get<Reference>("/api/reference");

export const fetchFollowups = () =>
	get<{ followups: Followup[] }>("/api/followups");

/**
 * POST /api/followups/close — record that a follow-up was actually done.
 *
 * A queue that can be read but not closed cannot produce an M1. `by` is required
 * server-side: an unattributed close cannot be audited, and an unattributed
 * close is the same as no close.
 */
export async function closeFollowup(input: {
	id: string;
	by: string;
	status?: "done" | "missed";
	note?: string;
	/**
	 * What the patient did at the re-check. Present on a completion, absent on a
	 * miss — the endpoint records the M1 only when this arrives, and a rejected
	 * assessment leaves the follow-up open.
	 */
	assessment?: {
		steps: Record<string, "正確" | "錯誤" | "na">;
		knowledge: Record<string, "對" | "不對">;
		demonstrated: Record<string, boolean>;
	};
}) {
	const res = await fetch(`${base}/api/followups/close`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(input),
	});
	const json = await res.json();
	if (!res.ok || json.ok === false)
		throw new Error(json.error ?? `HTTP ${res.status}`);
	return json as {
		ok: true;
		id: string;
		status: string;
		completed_by: string;
		/** Only when an assessment was recorded, so closed and measured differ. */
		assessment?: { mrn_tail: string; steps: number };
	};
}

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
	/** The case this follow-up came from, and the patient it belongs to. */
	case_id: string | null;
	patient_id: string;
	/** Step codes the linked case got wrong — what this follow-up is for. */
	wrongSteps: string[];
	overdue: boolean;
	dueSoon: boolean;
}
export interface CaseRow {
	id: string;
	case_date: string;
	timepoint: string;
	qcc_stage: string;
	device: string | null;
	drug: string | null;
	pharmacist: string | null;
	campus: string | null;
	mrn_tail: string;
	knowledgeScore: number | null;
	steps: Record<string, string>;
}

/**
 * One patient's history.
 *
 * POST rather than GET: the record number is hashed server-side and never
 * travels in a query string, where it would land in browser history, proxy
 * logs and any link a pharmacist pastes to a colleague.
 */
export async function lookupCases(mrn: string): Promise<CaseRow[]> {
	if (!mrn.trim()) return [];
	const res = await fetch(`${base}/api/cases/lookup`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ mrn: mrn.trim() }),
	});
	const json = await res.json();
	if (!res.ok || json.ok === false) {
		throw new Error(json.error ?? `HTTP ${res.status}`);
	}
	return (json.cases ?? []) as CaseRow[];
}

/** GET /api/cases — every recorded case, newest first. */
export async function fetchCases(
	q: {
		qccStage?: string;
		timepoint?: string;
		campus?: string;
		pharmacist?: string;
		drug?: string;
		device?: string;
	} = {},
): Promise<CaseRow[]> {
	const params = new URLSearchParams();
	for (const [k, v] of Object.entries(q)) {
		if (v) params.set(k, v);
	}
	const qs = params.toString();
	const res = await fetch(`${base}/api/cases${qs ? `?${qs}` : ""}`);
	const json = await res.json();
	if (!res.ok || json.ok === false) {
		throw new Error(json.error ?? `HTTP ${res.status}`);
	}
	return (json.cases ?? []) as CaseRow[];
}

/**
 * One patient's history, found from the queue.
 *
 * Same endpoint as the record-number lookup but keyed by the opaque internal
 * id, because the queue has the masked tail only — enough to recognise a row,
 * not enough to retrieve anything. The tail cannot be used to look up, and
 * reconstructing the full number from a tail would be guessing at a patient's
 * identity.
 */
export async function casesForPatient(patientId: string): Promise<CaseRow[]> {
	const res = await fetch(
		`${base}/api/cases?patientId=${encodeURIComponent(patientId)}`,
	);
	const json = await res.json();
	if (!res.ok || json.ok === false) {
		throw new Error(json.error ?? `HTTP ${res.status}`);
	}
	return (json.cases ?? []) as CaseRow[];
}

/** POST /api/cases — one transaction for the case and all of its results. */
export interface NewCase {
	mrn: string;
	caseDate: string;
	pharmacist: string;
	campus: string;
	timepoint: string;
	qccStage: string;
	drug: string;
	steps: Record<string, "正確" | "錯誤" | "na">;
	/** Did the patient actually perform the step in front of the pharmacist. */
	demonstrated?: Record<string, boolean>;
	knowledge?: Record<string, "對" | "不對">;
	factors?: string[];
	caseType?: string;
	stepNotes?: Record<string, string>;
	measurements?: Record<string, string | number>;
}

export async function createCase(body: NewCase) {
	const res = await fetch(`${base}/api/cases`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(body),
	});
	const json = await res.json();
	if (!res.ok || json.ok === false)
		throw new Error(json.error ?? `HTTP ${res.status}`);
	return json as {
		ok: true;
		id: string;
		record_id: string;
		mrn_tail: string;
		steps: number;
		knowledge: number;
		measures: number;
		followup: number;
	};
}

/** One step as the camera judged it. */
export interface AiStep {
	value: "正確" | "錯誤";
	attempts: number;
	confidence: number;
}

/** GET /api/sessions/pending — the pharmacist's reason to type the MRN. */
export interface PendingSession {
	ok: true;
	found: boolean;
	device?: string;
	drug?: string;
	steps: Record<string, AiStep>;
}

export async function fetchPendingSession(
	mrn: string,
): Promise<PendingSession> {
	if (!mrn.trim()) return { ok: true, found: false, steps: {} };
	const res = await fetch(
		`${base}/api/sessions/pending?mrn=${encodeURIComponent(mrn.trim())}`,
	);
	const json = await res.json();
	if (!res.ok || json.ok === false)
		throw new Error(json.error ?? `HTTP ${res.status}`);
	return json as PendingSession;
}
