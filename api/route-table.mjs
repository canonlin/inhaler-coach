/**
 * The route table, in one place.
 *
 * The Vercel adapter and the local dev server both dispatch from this map.
 * Two copies of a route table drift, and a drifted dev server hides bugs
 * instead of finding them — the local server has to answer exactly what
 * production answers.
 *
 * The map is also where a route's audience is recorded. A route that is not
 * in PUBLIC_ENDPOINTS needs a signed-in pharmacist; see api/auth.mjs.
 */
export const ROUTES = {
	"GET /api/health": "health",
	"POST /api/cases": "createCase",
	"POST /api/cases/lookup": "lookupCases",
	"GET /api/cases": "listCases",
	"GET /api/metrics/summary": "summary",
	"POST /api/sessions": "recordSession",
	"GET /api/reference": "reference",
	"GET /api/followups": "followups",
	"POST /api/followups/close": "closeFollowup",
	"GET /api/study/arms": "studyArms",
	"GET /api/sessions/pending": "pendingSession",
	"POST /api/line/link": "lineLink",
	"GET /api/line/plan": "linePlan",
	"POST /api/line/journeys": "lineJourneys",
	"POST /api/line/send": "lineSend",
	"POST /api/line/event": "lineEvent",
	"POST /api/line/webhook": "lineEvent",
	"GET /api/line/engagement": "lineEngagement",
	"POST /api/line/dispatch": "lineDispatch",
	"GET /api/line/dispatch": "lineDispatch",
	"GET /api/line/quota": "lineQuota",
	"GET /api/line/journey": "lineJourney",
	"POST /api/import/cases": "importCases",
	"GET /api/export/cases.xlsx": "exportCases",
	"GET /api/admin/config": "getAdminConfig",
	"POST /api/admin/config": "updateAdminConfig",
};

/**
 * Routes that change content or move patient data out.
 *
 * A 'viewer' account is read-only. The clinical staff who enter cases and
 * export the QCC sheet are 'pharmacist'. Changing what the hospital teaches —
 * the videos, the quiz, the drug cards — is 'admin', because it changes what
 * every future patient is measured against.
 */
export const WRITE_ROUTES = new Set([
	"POST /api/cases",
	"POST /api/followups/close",
	"POST /api/import/cases",
	"GET /api/export/cases.xlsx",
]);

/** Only an admin may change the content configuration. */
export const ADMIN_ONLY_ROUTES = new Set(["POST /api/admin/config"]);
