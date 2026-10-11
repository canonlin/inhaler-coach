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
import { buildSchedule, renderMessage, setCriticalCodes } from "./schedule.mjs";
import { countsAgainstQuota, quotaCheck } from "./transport.mjs";

setCriticalCodes(CRITICAL_STEP_CODES);

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
	async function send({ patientId, lineUserId, touch, kind, message, sentOn }) {
		const claimed = await query(
			`INSERT INTO line_deliveries (patient_id, line_user_id, touch, sent_on, kind, channel, payload)
			 VALUES ($1,$2,$3,$4,$5,$6,$7::jsonb)
			 ON CONFLICT (line_user_id, touch, sent_on) DO NOTHING
			 RETURNING id`,
			[
				patientId,
				lineUserId,
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

	return {
		link,
		plan,
		send,
		recordEvent,
		engagement,
		channel: transport.channel,
	};
}
