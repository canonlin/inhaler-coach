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

/**
 * Which arm of the 1:1 study a patient is in.
 *
 * The counts are people, not rows: one patient is enrolled once and followed
 * up, so counting rows would count the same patient twice.
 */
export interface ArmBalance {
	ok: true;
	experimental: number;
	control: number;
	total: number;
	/** As a person would say it: 「12:10」. */
	ratio: string;
	/** The arm the last patient was given. */
	previous: string | null;
	/** The arm the rotation points at next. */
	next: string;
	/** The same counts by row, for reconciling against the list. */
	cases: { experimental: number; control: number };
}

/**
 * GET /api/study/arms — the balance and the next suggestion.
 *
 * It is on screen while she works, so it is a read of its own rather than a
 * field on the case list: the count has to be true before the next patient
 * arrives, not after the list is refetched.
 */
export async function fetchArmBalance(): Promise<ArmBalance> {
	return get<ArmBalance>("/api/study/arms");
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
	/**
	 * How far along the study is: how many patients have been enrolled in the
	 * platform, against the plan's target.
	 */
	enrolment: { target: number; enrolled: number };
}

const base = import.meta.env.VITE_API_BASE ?? "";

/** The API's origin, or "" when it is served from the same one. */
export const API_BASE = base;

/**
 * Thrown when the API refuses the request because nobody is signed in.
 *
 * It is its own type because the back office has to react to it differently
 * from an ordinary failure: a 401 means "show the sign-in screen", not "the
 * server is down".
 */
export class UnauthorizedError extends Error {
	constructor(message = "尚未登入") {
		super(message);
		this.name = "UnauthorizedError";
	}
}

/**
 * Called when the API answers 401.
 *
 * The session can end in the middle of a shift, so any request may be the one
 * that discovers it. The provider installs a handler that drops the app back
 * to the sign-in screen instead of leaving a half-dead page full of errors.
 */
let unauthorizedHandler: (() => void) | null = null;

export function onUnauthorized(handler: () => void): void {
	unauthorizedHandler = handler;
}

/**
 * The one place an HTTP call is made.
 *
 * Credentials are sent, because the session is a cookie, and the browser only
 * attaches it to a same-origin request. A 401 is turned into the typed error
 * and reported to the handler above.
 */
async function request<T>(path: string, init?: RequestInit): Promise<T> {
	const res = await fetch(`${base}${path}`, {
		credentials: "same-origin",
		...init,
	});
	if (res.status === 401) {
		unauthorizedHandler?.();
		throw new UnauthorizedError();
	}
	const json = await res.json().catch(() => ({}));
	if (!res.ok || json.ok === false)
		throw new Error(json.error ?? `HTTP ${res.status}`);
	return json as T;
}

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
	return request<T>(`${path}${qs}`);
}

export const fetchSummary = (params?: { qccStage?: string; target?: number }) =>
	get<Summary>("/api/metrics/summary", params);

export const fetchReference = () => get<Reference>("/api/reference");

export const fetchFollowups = () =>
	get<{ followups: Followup[]; dueToday: number; overdue: number }>(
		"/api/followups",
	);

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
	return request<{
		ok: true;
		id: string;
		status: string;
		completed_by: string;
		/** Only when an assessment was recorded, so closed and measured differ. */
		assessment?: { mrn_tail: string; steps: number };
		/** Other planned return visits this one replaced. */
		superseded: number;
	}>(`${base}/api/followups/close`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(input),
	});
}

export interface Followup {
	id: string;
	task: string;
	due_start: string;
	due_end: string;
	priority: "P1" | "P2" | "P3";
	/**
	 * Which planned return visit this row is — 'D14' | 'D21' | 'D28' — or null
	 * on a row that predates the schedule.
	 */
	slot: string | null;
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
	/** Today is inside the due window: this is the visit happening today. */
	dueToday: boolean;
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
	const json = await request<{ cases?: CaseRow[] }>(
		`${base}/api/cases/lookup`,
		{
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ mrn: mrn.trim() }),
		},
	);
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
	const json = await request<{ cases?: CaseRow[] }>(
		`${base}/api/cases${qs ? `?${qs}` : ""}`,
	);
	return (json.cases ?? []) as CaseRow[];
}

/** What one import read, and what it did about it. */
export interface ImportReport {
	ok: true;
	/** The cohort the rows were filed under: 改善前 or 改善後. */
	stage: string;
	/** Rows in the sheet, not counting the header. */
	rowsRead: number;
	imported: number;
	updated: number;
	/** Rows that could not be read, with the sheet's own line number. */
	skipped: { line: number; reason: string }[];
	/** Rows that were read but disagree with the sheet's own summary columns. */
	warnings: { line: number; message: string }[];
	/** True when the report is a rehearsal: nothing was written. */
	dryRun: boolean;
}

/**
 * POST /api/import/cases — upload the pharmacist's QCC workbook.
 *
 * The body is the file itself rather than a form: the importer reads the
 * workbook byte-for-byte, and a multipart form would only add a second copy of
 * the same bytes to parse.
 *
 * `dryRun` parses and reports without writing. That is not a convenience: a
 * sheet of 987 rows with 62 real ones in it cannot be read by eye, and the
 * importer's job is to say what it read and what disagrees with the sheet
 * before anything is written.
 */
export async function importCases(
	file: File,
	{ stage, dryRun }: { stage: string; dryRun: boolean },
): Promise<ImportReport> {
	const qs = new URLSearchParams({
		stage,
		dry_run: dryRun ? "true" : "false",
	});
	return request<ImportReport>(`${base}/api/import/cases?${qs}`, {
		method: "POST",
		headers: {
			"Content-Type":
				"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
		},
		body: file,
	});
}

/**
 * The export's address.
 *
 * A link rather than a fetch: the export is a download, and the browser
 * already knows how to handle one. The session is a cookie, so it rides along
 * with the navigation.
 */
export function exportCasesUrl(params?: { month?: string; stage?: string }) {
	const qs = new URLSearchParams();
	if (params?.month) qs.set("month", params.month);
	if (params?.stage) qs.set("stage", params.stage);
	const q = qs.toString();
	return `${base}/api/export/cases.xlsx${q ? `?${q}` : ""}`;
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
	const json = await request<{ cases?: CaseRow[] }>(
		`${base}/api/cases?patientId=${encodeURIComponent(patientId)}`,
	);
	return (json.cases ?? []) as CaseRow[];
}

/** POST /api/cases — one transaction for the case and all of its results. */
export interface NewCase {
	mrn: string;
	caseDate: string;
	pharmacist: string;
	campus: string;
	timepoint: string;
	/**
	 * Which cohort the case belongs to.
	 *
	 * Left out, the platform files it by its timepoint: M0 is 前測（改善前） and
	 * M1 and later are 後測（改善後）. The screen does not send it, because the
	 * pharmacist should not have to say which half of the study a measurement
	 * belongs to — the timepoint already says it, and the two are the same fact
	 * written twice.
	 */
	qccStage?: string;
	drug: string;
	steps: Record<string, "正確" | "錯誤" | "na">;
	/** Did the patient actually perform the step in front of the pharmacist. */
	demonstrated?: Record<string, boolean>;
	knowledge?: Record<string, "對" | "不對">;
	factors?: string[];
	caseType?: string;
	stepNotes?: Record<string, string>;
	measurements?: Record<string, string | number>;
	/* The 基本表格 — the columns the QCC sheet has and the old 收案表單 asked
	   for. A case recorded without them is a half row, and a half row cannot be
	   compared with a full one. */
	ageBand?: string;
	sex?: string;
	diagnosis?: string;
	usageDuration?: string;
	priorEducation?: string;
	educationMinutes?: number;
	/**
	 * Which arm of the 1:1 study this patient goes into: 'experimental' (AI
	 * 練習) or 'control' (一般衛教).
	 *
	 * Left out, the rotation decides and the arm is recorded as the rotation's
	 * choice. Sent, it is the pharmacist's own decision and the record says so,
	 * because an override is a fact about the study that has to be auditable.
	 */
	studyArm?: string;
}

export async function createCase(body: NewCase) {
	return request<{
		ok: true;
		id: string;
		record_id: string;
		mrn_tail: string;
		/** The arm this case was given, and how it was decided. */
		study_arm: string | null;
		arm_source: string | null;
		steps: number;
		knowledge: number;
		measures: number;
		followup: number;
	}>(`${base}/api/cases`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(body),
	});
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
	return request<PendingSession>(
		`${base}/api/sessions/pending?mrn=${encodeURIComponent(mrn.trim())}`,
	);
}

export interface AdminDrugCard {
	id: string;
	name: string;
	deviceType: string;
	containsSteroid?: boolean;
	hasIcs?: boolean;
	rinseMouthNeeded?: boolean;
	colorShape?: string;
	imageUrl: string;
	technique?: string;
	quickTip?: string;
	enabled?: boolean;
	status?: string;
}

export interface AdminVideoConfig {
	id?: string;
	type?: string;
	scope?: string;
	device?: string;
	deviceType?: string;
	/** Which medicine this film teaches; empty means the device family. */
	drugId?: string | null;
	/** BCP-47 language of the film, e.g. zh-TW (國語), nan-TW (台語). */
	lang?: string;
	title: string;
	duration?: string;
	durationSeconds?: number;
	videoUrl: string;
	embedUrl?: string;
	steps?: string | string[];
	description?: string;
	/** Who published the film: the society, a hospital, a pharmacist. */
	source?: string;
	sourceUrl?: string;
	thumbnailUrl?: string;
	enabled?: boolean;
	status?: string;
}

export interface AdminQuizOption {
	id: string;
	text: string;
}

export interface AdminQuizQuestion {
	id: string;
	question: string;
	options: AdminQuizOption[];
	answer?: number;
	correctAnswer?: string;
	explanation: string;
	enabled?: boolean;
	status?: string;
}

export interface AdminConfigResponse {
	ok: true;
	config: {
		videos: AdminVideoConfig[];
		quizzes: Record<string, AdminQuizQuestion[]>;
		drugs: AdminDrugCard[];
		updated?: Record<string, { at: string; by: string }>;
	};
}

export async function fetchAdminConfig(
	key?: string,
): Promise<AdminConfigResponse> {
	return get<AdminConfigResponse>(
		"/api/admin/config",
		key ? { key } : undefined,
	);
}

export async function saveAdminConfig(
	key: "videos" | "quizzes" | "drugs",
	value:
		| AdminVideoConfig[]
		| Record<string, AdminQuizQuestion[]>
		| AdminDrugCard[],
	user = "藥劑部管理員",
) {
	return request<{ ok: true; key: string; updated: boolean }>(
		`${base}/api/admin/config`,
		{
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ key, value, user }),
		},
	);
}
