/**
 * The open-follow-up count for the navigation badge.
 *
 * Shared rather than refetched per component: the sidebar is mounted on every
 * screen, so without this it would re-request the queue on each navigation.
 *
 * The cache expires, but expiry alone is not enough. Recording a case schedules
 * a follow-up, and closing one removes it — both happen on pages that already
 * have the sidebar mounted, so a count fetched at mount would sit at its old
 * value for the rest of the minute and the badge would contradict the queue the
 * pharmacist is looking at. Anything that changes the queue therefore
 * invalidates it, and the next reader refetches.
 *
 * A failed request leaves the badge absent rather than showing zero. "No work"
 * and "could not ask" are different facts, and only one of them is ever true at
 * a time.
 */

import { useEffect, useState } from "react";

import { fetchFollowups } from "../api-client";

/** null means "not known yet", which renders no badge rather than a zero. */
let cached: { open: number; at: number } | null = null;
let inFlight: Promise<void> | null = null;
const listeners = new Set<(n: number | null) => void>();

function publish(open: number | null) {
	cached = open == null ? null : { open, at: Date.now() };
	for (const fn of listeners) fn(open);
}

/**
 * Drop the cached count and refetch for everyone currently looking.
 *
 * Clearing the cache alone is not enough: the sidebar is mounted on every
 * screen, so its effect has already run and it would keep rendering the old
 * number until the next navigation. That produced a badge reading 1 beside a
 * queue page that had just closed its only row and correctly read 0 — the two
 * figures for the same thing disagreeing on the same screen.
 */
export function invalidateFollowupCount() {
	cached = null;
	void load();
}

async function load() {
	inFlight ??= fetchFollowups()
		.then((d) => {
			publish(d.followups.length);
		})
		.catch(() => {
			publish(null);
		})
		.finally(() => {
			inFlight = null;
		});
	await inFlight;
}

export function useFollowupCounts(): number | null {
	const [open, setOpen] = useState<number | null>(cached?.open ?? null);

	useEffect(() => {
		let live = true;
		const listener = (n: number | null) => {
			if (live) setOpen(n);
		};
		listeners.add(listener);

		// Re-read once a minute for the case where nothing this session changed
		// the queue — another pharmacist's closings, or a case recorded on the
		// counter terminal.
		const stale = !cached || Date.now() - cached.at > 60_000;
		if (stale) void load();

		return () => {
			live = false;
			listeners.delete(listener);
		};
	}, []);

	return open;
}
