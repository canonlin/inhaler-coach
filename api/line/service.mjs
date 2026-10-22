/**
 * The LINE service: schedule, render, deliver, and record engagement.
 *
 * Everything here runs without a LINE account. The transport is injected, so
 * tests and the pre-launch dry run use the recording transport and verify the
 * whole chain up to the final HTTP call.
 */

import { DRUG_BY_NAME } from "../../src/domain/drugs.js";
import {
	ALL_STEP_CODES,
	CRITICAL_STEP_CODES,
	STEP_BY_CODE,
} from "../../src/domain/steps.js";
import { buildDualTags, findDrug, validateRegistration } from "./catalog.mjs";
import { findActiveQuiz, findActiveVideo, loadLineContent } from "./config.mjs";
import {
	buildJourney,
	JOURNEY_DAYS,
	JOURNEY_TOUCHES_PER_CASE,
	renderJourneyMessage,
} from "./journey.mjs";
import { buildSchedule, renderMessage, setCriticalCodes } from "./schedule.mjs";
import { countsAgainstQuota, quotaCheck } from "./transport.mjs";

setCriticalCodes(CRITICAL_STEP_CODES);

/**
 * The monthly free allowance.
 *
 * Taiwan's Communication plan gives 200 free messages a month and cannot buy
 * more, so this is a hard stop rather than a budget. It is read from the
 * environment because a hospital on a different plan should not have to change
 * code to use it.
 */
export function freeQuotaLimit() {
	const raw = Number(process.env.LINE_FREE_QUOTA);
	return Number.isFinite(raw) && raw > 0 ? raw : 200;
}

/** Filed by register(): one row per role, replaced on re-registration. */
async function registerJourney(query, { mrn, lineUserId, medications }) {
	const problem = validateRegistration({
		name: "present",
		identifier: "present",
		medications,
	});
	if (problem) throw new HttpError(400, problem);

	const { rows } = await query("SELECT id FROM patients WHERE mrn_hash = $1", [
		mrn,
	]);
	if (!rows[0]) throw new HttpError(404, "找不到病歷資料，請先至藥局建檔。");
	const patientId = rows[0].id;

	await query("UPDATE patients SET consent_line = true WHERE id = $1", [
		patientId,
	]);
	await query(
		`INSERT INTO line_identities (patient_id, line_user_id) VALUES ($1,$2)
		 ON CONFLICT (line_user_id) DO UPDATE SET patient_id = EXCLUDED.patient_id`,
		[patientId, lineUserId],
	);
	await query("DELETE FROM line_medications WHERE patient_id = $1", [
		patientId,
	]);
	const filed = [];
	for (const m of medications) {
		const drug = findDrug(m.drugId);
		await query(
			`INSERT INTO line_medications
			   (patient_id, role, drug_id, drug_name, device_line, ics)
			 VALUES ($1,$2,$3,$4,$5,$6)`,
			[patientId, m.role, drug.id, drug.displayName, drug.type, drug.ICS],
		);
		filed.push({ role: m.role, drugName: drug.displayName });
	}
	return {
		ok: true,
		patientId,
		medications: filed,
		...buildDualTags(medications),
	};
}

class HttpError extends Error {
	constructor(status, message) {
		super(message);
		this.status = status;
	}
}

/**
 * @param {{query: Function, transport: {channel: string, send: Function}}} deps
 *
 * The transport is required rather than defaulted. A silent default would mean
 * a production deploy could quietly record instead of send, and nobody would
 * find out until patients reported hearing nothing.
 */
export function makeLineService({ query, transport }) {
	if (!transport?.send) throw new Error("makeLineService needs a transport");
	const deliver = transport;

	/**
	 * Link a LINE account to a patient, recording consent at the same time.
	 *
	 * `mrn` is the stored hash, not the record number: the caller hashes, so no
	 * plain identifier passes through this layer.
	 */
	async function link({ mrn, lineUserId }) {
		const { rows } = await query(
			`UPDATE patients p SET consent_line = true
			 FROM (SELECT id FROM patients WHERE mrn_hash = $1) AS m
			 WHERE p.id = m.id RETURNING p.id`,
			[mrn],
		);
		if (!rows[0]) throw new HttpError(404, "patient not found");
		await query(
			`INSERT INTO line_identities (patient_id, line_user_id) VALUES ($1,$2)
			 ON CONFLICT (line_user_id) DO UPDATE SET patient_id = EXCLUDED.patient_id`,
			[rows[0].id, lineUserId],
		);
		return { ok: true, patientId: rows[0].id };
	}

	/** Schedule the touches for a case and render each into a LINE message. */
	async function plan({ caseId }) {
		const { rows } = await query(
			`SELECT c.case_date, c.drug, p.consent_line,
			        COALESCE((SELECT jsonb_object_agg(cs.step_code, cs.value)
			                  FROM case_steps cs WHERE cs.case_id = c.id), '{}'::jsonb) AS steps,
			        COALESCE((SELECT jsonb_object_agg(cs.step_code, to_jsonb(cs.demonstrated))
			                  FROM case_steps cs WHERE cs.case_id = c.id AND cs.demonstrated), '{}'::jsonb) AS demonstrated,
			        (SELECT line_user_id FROM line_identities li WHERE li.patient_id = p.id LIMIT 1) AS line_user_id
			 FROM cases c JOIN patients p ON p.id = c.patient_id
			 WHERE c.id = $1`,
			[caseId],
		);
		const c = rows[0];
		if (!c) throw new HttpError(404, "case not found");

		const touches = buildSchedule({
			caseDate: c.case_date,
			steps: c.steps,
			demonstrated: c.demonstrated,
		});
		const drugLabel = DRUG_BY_NAME[c.drug]?.label ?? c.drug;

		const planned = touches.map((t) => ({
			...t,
			message: renderMessage(t, { drugLabel, steps: STEP_BY_CODE }),
		}));

		return {
			ok: true,
			consentLine: c.consent_line,
			linked: Boolean(c.line_user_id),
			planned,
			quota: quotaCheck(planned),
			/** Why nothing was scheduled, when nothing was. */
			reason: touches.length ? undefined : "所有步驟都正確，沒有需要加強的地方",
		};
	}

	/**
	 * Send one planned touch.
	 *
	 * The claim is written before the send, not after. A LINE push cannot be
	 * unsent, so a retried cron must not be able to message someone twice while
	 * the unique index quietly absorbs the duplicate row. If the send fails the
	 * claim is released, so a transient LINE error stays retryable — losing one
	 * reminder is recoverable, sending a patient the same reminder twice is not.
	 */
	async function send({
		patientId,
		lineUserId,
		caseId,
		touch,
		kind,
		message,
		sentOn,
	}) {
		const claimed = await query(
			`INSERT INTO line_deliveries (patient_id, line_user_id, case_id, touch, sent_on, kind, channel, payload)
			 VALUES ($1,$2,$3,$4,$5,$6,$7,$8::jsonb)
			 ON CONFLICT (line_user_id, touch, sent_on) DO UPDATE
			   SET channel = EXCLUDED.channel,
			       payload = EXCLUDED.payload,
			       created_at = now()
			 WHERE line_deliveries.channel = 'recording' AND EXCLUDED.channel = 'live'
			 RETURNING id`,
			[
				patientId,
				lineUserId,
				caseId ?? null,
				touch,
				sentOn,
				kind,
				transport.channel,
				JSON.stringify(message),
			],
		);
		if (!claimed.rows.length) {
			return { ok: true, touch, kind, skipped: "already sent", counted: false };
		}

		try {
			const res = await deliver.send(lineUserId, message);
			if (!res.ok)
				throw new HttpError(res.status || 502, res.body ?? "send failed");
		} catch (err) {
			await query("DELETE FROM line_deliveries WHERE id = $1", [
				claimed.rows[0].id,
			]);
			throw err;
		}
		return { ok: true, touch, kind, counted: countsAgainstQuota(kind) };
	}

	/** Record what the patient did in LINE. */
	async function recordEvent({ eventId, type, stepCode, payload, lineUserId }) {
		if (stepCode && !ALL_STEP_CODES.includes(stepCode)) {
			throw new HttpError(400, `unknown step ${stepCode}`);
		}
		const { rows } = await query(
			`INSERT INTO line_events (patient_id, line_event_id, event_type, step_code, payload)
			 SELECT li.patient_id, $1, $2, $3, $4::jsonb FROM line_identities li WHERE li.line_user_id = $5
			 ON CONFLICT (line_event_id) DO NOTHING
			 RETURNING patient_id`,
			[
				eventId,
				type,
				stepCode ?? null,
				JSON.stringify(payload ?? {}),
				lineUserId,
			],
		);
		return {
			ok: true,
			recorded: rows.length > 0,
			patientId: rows[0]?.patient_id ?? null,
		};
	}

	/**
	 * Register a LIFF journey: validate, link the LINE account with consent,
	 * and file the medication list. The patient record itself must already
	 * exist (built at the pharmacy counter with age band and MRN tail) — this
	 * endpoint links to it, it does not invent one. The name is checked for
	 * presence and never stored: patients carry no name column by design.
	 *
	 * `mrn` is the stored hash, as in link(): no plain identifier reaches here.
	 *
	 * Module-level rather than a closure: it needs only query, and keeping it
	 * out stops makeLineService growing past the function-size budget.
	 */
	async function register(args) {
		return registerJourney(query, args);
	}

	/**
	 * Did the LINE channel actually work?
	 *
	 * Two independent aggregates joined per kind. A response is only meaningful
	 * when it arrives after the message it answers, so a patient who replied
	 * before being messaged cannot inflate the rate.
	 */
	async function engagement({ since }) {
		const { rows } = await query(
			`WITH sent AS (
			   SELECT kind, count(*)::int AS n FROM line_deliveries
			   WHERE created_at >= $1 GROUP BY kind
			 ), replied AS (
			   SELECT d.kind, count(DISTINCT d.id)::int AS n
			   FROM line_deliveries d
			   WHERE d.created_at >= $1
			     AND EXISTS (SELECT 1 FROM line_events e
			                 WHERE e.patient_id = d.patient_id
			                   AND e.created_at >= d.created_at)
			   GROUP BY d.kind
			 )
			 SELECT s.kind, s.n AS sent, COALESCE(r.n, 0) AS responded
			 FROM sent s LEFT JOIN replied r ON r.kind = s.kind
			 ORDER BY s.kind`,
			[since],
		);
		return {
			ok: true,
			byKind: rows.map((r) => ({
				...r,
				responseRate: r.sent ? r.responded / r.sent : null,
			})),
		};
	}

	/**
	 * What the month has already cost.
	 *
	 * LINE bills by the month the message went out, so this follows created_at
	 * rather than the day the touch was due. A day-3 touch for a patient
	 * enrolled on the 30th is billed in the next month, and the allowance has
	 * to be spent where the message actually left.
	 *
	 * Only real sends count. A rehearsal writes a row too, but it reached no
	 * phone and it cannot be billed, so it is counted separately: a dry run
	 * must not look like a month that has been spent.
	 */
	async function quotaUsage({ month }) {
		const { rows } = await query(
			`SELECT count(*) FILTER (WHERE channel = 'live')::int AS live,
			        count(*) FILTER (WHERE channel = 'recording')::int AS recorded
			 FROM line_deliveries
			 WHERE kind = 'push'
			   AND date_trunc('month', created_at AT TIME ZONE 'Asia/Taipei')::date = $1::date`,
			[`${month}-01`],
		);
		const billable = rows[0]?.live ?? 0;
		const recorded = rows[0]?.recorded ?? 0;
		const limit = freeQuotaLimit();
		const remaining = Math.max(0, limit - billable);
		return {
			ok: true,
			month,
			billable,
			/** Rehearsals: real payloads, no phone, no cost. */
			recorded,
			limit,
			remaining,
			withinFreeTier: billable <= limit,
			/** How many more cases the remaining allowance can carry. */
			caseCapacity: Math.floor(remaining / JOURNEY_TOUCHES_PER_CASE),
		};
	}

	/**
	 * The cases whose journey touch falls on one day.
	 *
	 * A case is due when enrolment + journey day = the target date. Only
	 * post-intervention cases are on the journey: the 改善前 cohort is the
	 * before-measurement, and messaging it would contaminate the comparison
	 * the QCC dashboard is built on.
	 */
	async function dueJourneyCases(target) {
		const caseDates = JOURNEY_DAYS.map((day) => shiftDate(target, -day));
		const { rows } = await query(
			`SELECT c.id AS case_id, c.case_date, c.drug, c.device, c.timepoint,
			        p.id AS patient_id, p.mrn_tail, li.line_user_id,
			        COALESCE(lm.device_line, 'MDI') AS device_line
			 FROM cases c
			 JOIN patients p ON p.id = c.patient_id
			 JOIN line_identities li ON li.patient_id = p.id
			 LEFT JOIN line_medications lm
			   ON lm.patient_id = p.id AND lm.role = 'maintenance'
			 WHERE p.consent_line = true
			   AND c.qcc_stage = '改善後'
			   AND c.case_date = ANY($1::date[])`,
			[caseDates],
		);

		const content = await loadLineContent(query);
		return rows
			.map((row) => {
				const journey = buildJourney({
					caseDate: row.case_date,
					deviceLine: row.device_line,
				});
				const touch = journey.find((t) => t.dueOn === target);
				if (!touch) return null;
				const drugLabel = DRUG_BY_NAME[row.drug]?.label ?? row.drug;
				return {
					...row,
					touch,
					message: renderJourneyMessage(touch, {
						drugLabel,
						videoInfo: findActiveVideo(content.videos, row.device_line),
						quizInfo: findActiveQuiz(content.quizzes, row.device_line),
					}),
				};
			})
			.filter(Boolean);
	}

	/**
	 * Has this patient already had a real message today?
	 *
	 * Rehearsals do not count. A dry run must never be the reason a patient
	 * does not get the message that was meant for them.
	 */
	async function messagedToday(lineUserId, date) {
		const { rows } = await query(
			`SELECT count(*)::int AS n FROM line_deliveries
			 WHERE line_user_id = $1 AND sent_on = $2::date AND channel = 'live'`,
			[lineUserId, date],
		);
		return (rows[0]?.n ?? 0) > 0;
	}

	/**
	 * Send the journey touches that fall due on one day.
	 *
	 * One push per patient per day. The learning journey and the error-driven
	 * reinforcement both touch days 3 and 7, and a patient who gets two
	 * messages about the same day is a patient who stops reading them. The
	 * first message of the day wins; the second is skipped and reported, not
	 * silently dropped.
	 *
	 * The free allowance is a hard stop: when it is reached the rest of the
	 * day is left unsent and reported, because the free plan cannot buy more.
	 */
	async function dispatchJourney({ date, dryRun = false } = {}) {
		const target = date ?? new Date().toISOString().slice(0, 10);
		const month = target.slice(0, 7);
		const quota = await quotaUsage({ month });
		const due = await dueJourneyCases(target);

		const sent = [];
		const skipped = [];
		/** Patients we could not reach, and why. Never silently dropped. */
		const failed = [];
		let stopped = null;

		for (const row of due) {
			if (quota.billable + sent.length >= quota.limit) {
				stopped = {
					mrnTail: row.mrn_tail,
					reason: "monthly free allowance reached",
				};
				break;
			}
			if (await messagedToday(row.line_user_id, target)) {
				skipped.push({
					mrnTail: row.mrn_tail,
					touch: row.touch.key,
					reason: "already messaged on this day",
				});
				continue;
			}
			if (dryRun) {
				sent.push({
					mrnTail: row.mrn_tail,
					touch: row.touch.key,
					dryRun: true,
				});
				continue;
			}
			// One patient who cannot be reached must not cost the others their
			// message. A push fails for ordinary reasons — the patient unfollowed
			// the account, LINE refused the recipient, the API was briefly
			// unavailable — and none of those are a reason to abandon the rest
			// of the day. The failure is recorded and the batch continues.
			let res;
			try {
				res = await send({
					patientId: row.patient_id,
					lineUserId: row.line_user_id,
					caseId: row.case_id,
					touch: row.touch.key,
					kind: row.touch.kind,
					message: row.message,
					sentOn: target,
				});
			} catch (err) {
				failed.push({
					mrnTail: row.mrn_tail,
					touch: row.touch.key,
					reason: err?.message ?? "send failed",
					status: err?.status ?? null,
				});
				continue;
			}
			if (res.skipped) {
				skipped.push({
					mrnTail: row.mrn_tail,
					touch: row.touch.key,
					reason: res.skipped,
				});
			} else {
				sent.push({
					mrnTail: row.mrn_tail,
					touch: row.touch.key,
					counted: res.counted,
				});
			}
		}

		return {
			ok: true,
			date: target,
			month,
			/** True when nothing left the building: this is a rehearsal. */
			dryRun,
			due: due.length,
			sent: sent.length,
			sentTouches: sent,
			skipped,
			/** Not delivered, with the reason. A failure must be visible. */
			failed,
			failedCount: failed.length,
			stopped,
			quota: await quotaUsage({ month }),
		};
	}

	/**
	 * Where every case on the journey stands.
	 *
	 * The pharmacist's question was "who has been reached and who has not", so
	 * the board shows the five touch dates per case next to what was actually
	 * sent. A case with no sent touch is a case nobody has heard from.
	 */
	async function journeyBoard({ month }) {
		const { rows } = await query(
			`SELECT c.id AS case_id, c.case_date, c.drug, c.timepoint, p.mrn_tail,
			        li.line_user_id,
			        COALESCE(lm.device_line, 'MDI') AS device_line,
			        COALESCE((SELECT jsonb_agg(d.touch) FROM line_deliveries d
			                   WHERE d.patient_id = p.id AND d.kind = 'push'
			                     AND d.channel = 'live'), '[]'::jsonb) AS touches_sent,
			        COALESCE((SELECT jsonb_agg(d.touch) FROM line_deliveries d
			                   WHERE d.patient_id = p.id AND d.kind = 'push'
			                     AND d.channel = 'recording'), '[]'::jsonb) AS touches_rehearsed
			 FROM cases c
			 JOIN patients p ON p.id = c.patient_id
			 JOIN line_identities li ON li.patient_id = p.id
			 LEFT JOIN line_medications lm
			   ON lm.patient_id = p.id AND lm.role = 'maintenance'
			 WHERE to_char(c.case_date, 'YYYY-MM') = $1
			   AND c.qcc_stage = '改善後'
			 ORDER BY c.case_date`,
			[month],
		);
		return {
			ok: true,
			month,
			cases: rows.map((row) => {
				const touches = buildJourney({
					caseDate: row.case_date,
					deviceLine: row.device_line,
				}).map((t) => ({
					day: t.day,
					key: t.key,
					dueOn: t.dueOn,
					label: t.label,
				}));
				const sent = new Set(row.touches_sent ?? []);
				const rehearsed = new Set(row.touches_rehearsed ?? []);
				return {
					caseId: row.case_id,
					mrnTail: row.mrn_tail,
					drug: row.drug,
					caseDate: row.case_date,
					deviceLine: row.device_line,
					sentCount: touches.filter((t) => sent.has(t.key)).length,
					/** Rehearsed but not actually sent. */
					rehearsedCount: touches.filter((t) => rehearsed.has(t.key)).length,
					touches: touches.map((t) => ({
						...t,
						sent: sent.has(t.key),
					})),
				};
			}),
			quota: await quotaUsage({ month }),
		};
	}

	return {
		link,
		plan,
		send,
		recordEvent,
		register,
		engagement,
		quotaUsage,
		dispatchJourney,
		journeyBoard,
		channel: transport.channel,
		transport,
	};
}

/** Move an ISO date by a number of days, without a timezone detour. */
function shiftDate(isoDate, days) {
	const d = new Date(`${isoDate}T00:00:00Z`);
	return new Date(d.getTime() + days * 86400000).toISOString().slice(0, 10);
}
