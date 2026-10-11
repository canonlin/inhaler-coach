/**
 * The fixed left navigation.
 *
 * Real links, not buttons that set state: each section has an address, so it
 * can be bookmarked, sent to a colleague, and reached with the back button.
 * NavLink sets aria-current="page" on the active item, which is both what
 * assistive technology announces and what the highlight keys off, so the two
 * cannot disagree.
 *
 * The open-follow-up count sits beside its section because it is the one number
 * that changes whether the pharmacist should go there now — a count inside the
 * navigation is how back offices surface work, and leaving it in the list page
 * means finding out there is a queue only by going to look.
 */
import { NavLink } from "react-router-dom";
import { cn } from "../lib/utils";
import { TABS } from "./tabs";
import { useFollowupCount } from "./useFollowups";

/** Label of the section the current route belongs to, for the top bar. */
export function sectionFor(pathname: string): string {
	const tail = pathname.replace(/\/+$/, "");
	const hit = [...TABS]
		.reverse()
		.find((t) => t.path && tail.endsWith(`/${t.path}`));
	return hit?.label ?? TABS[0].label;
}

export function SideNav() {
	const openCount = useFollowupCount();

	return (
		<nav
			aria-label="藥師工作區"
			className="sticky top-0 flex h-dvh w-60 shrink-0 flex-col border-e border-border-subtle bg-surface"
		>
			{/*
			 * The platform name, not a product name. Symbicort Rapihaler is the
			 * pilot device in the plan's title ("以…為例"), and the record screen
			 * picks from every device on the formulary — branding this 「吸必擴」
			 * contradicted what the screen does.
			 */}
			<div className="border-b border-border-subtle px-5 py-4">
				<p className="text-lg font-bold tracking-tight text-primary">
					智慧呼吸照護平台
				</p>
				<p className="mt-0.5 text-caption text-text-muted">QCC 吸入劑衛教</p>
			</div>

			<ul className="grow overflow-y-auto p-3">
				{TABS.map((t) => {
					const to = t.path ? `/admin/${t.path}` : "/admin";
					const badge = t.path === "followups" ? openCount : null;
					return (
						<li key={t.label}>
							<NavLink
								to={to}
								end
								className={({ isActive }) =>
									cn(
										"flex min-h-11 items-center justify-between gap-2 rounded-md px-3 py-2.5 text-base font-semibold transition-colors",
										isActive
											? "bg-primary-soft text-primary"
											: "text-text-secondary hover:bg-surface-muted hover:text-text",
									)
								}
							>
								<span>{t.label}</span>
								{badge != null && badge > 0 && (
									<span
										data-testid="queue-count"
										/* Decorative: the count is announced as part of the
										   link, and a bare number beside the label reads as
										   noise to a screen reader on every visit. */
										aria-hidden="true"
										className="rounded-full bg-surface-muted px-2 py-0.5 text-caption font-bold tabular-nums text-text-secondary"
									>
										{badge}
									</span>
								)}
							</NavLink>
						</li>
					);
				})}
			</ul>
		</nav>
	);
}
