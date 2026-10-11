/**
 * The open follow-up queue, fetched once and shared.
 *
 * Two components needed this data — the navigation badge and the queue page —
 * and each fetched it separately. That is not only duplicated work: the queue
 * started from `null` every time it mounted, so switching to it blanked the
 * page to 「載入中」 for about a second even though the sidebar already held the
 * answer. Measured, it went: table visible at 4ms, loading state at 12ms, table
 * back at 1495ms. A back office that vanishes when you look at it is worse than
 * one that is a second late.
 *
 * One owner fixes both. The first fetch populates the cache, the queue renders
 * from it immediately on navigation, and a refresh is an explicit call after
 * something that changes the queue rather than something that happens to mount.
 */

import { useCallback, useEffect, useState } from "react";

import { type Followup, fetchFollowups } from "../api-client";

let cached: Followup[] | null = null;
let fetchedAt = 0;
let inFlight: Promise<void> | null = null;
const listeners = new Set<(rows: Followup[] | null) => void>();

function publish(rows: Followup[] | null) {
	cached = rows;
	if (rows) fetchedAt = Date.now();
	for (const fn of listeners) fn(rows);
}

async function load() {
	inFlight ??= fetchFollowups()
		.then((d) => publish(d.followups))
		.catch(() => publish(null))
		.finally(() => {
			inFlight = null;
		});
	await inFlight;
}

/**
 * Re-read the queue. Call this after anything that changes it — recording a
 * case schedules a follow-up, closing one removes it — not on mount.
 */
export function refreshFollowups() {
	cached = null;
	void load();
}

export function useFollowups(): {
	rows: Followup[] | null;
	refresh: () => void;
} {
	const [rows, setRows] = useState<Followup[] | null>(cached);

	useEffect(() => {
		let live = true;
		const listener = (next: Followup[] | null) => {
			if (live) setRows(next);
		};
		listeners.add(listener);

		// A minute is short enough that another pharmacist's closings show up
		// without a reload, and long enough that a pharmacist working through
		// the queue is not re-requesting it on every tab switch.
		if (!cached || Date.now() - fetchedAt > 60_000) void load();

		return () => {
			live = false;
			listeners.delete(listener);
		};
	}, []);

	const refresh = useCallback(() => {
		refreshFollowups();
	}, []);

	return { rows, refresh };
}

/** Just the count, for the navigation badge. Same fetch, no second request. */
export function useFollowupCount(): number | null {
	return useFollowups().rows?.length ?? null;
}
