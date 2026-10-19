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
import {
	BarChart3,
	BookOpen,
	ClipboardCheck,
	ListTodo,
} from "lucide-react";
import type { ElementType } from "react";
import { NavLink } from "react-router-dom";
import { cn } from "../lib/utils";
import { TABS } from "./tabs";
import { useFollowupCount } from "./useFollowups";

const TAB_ICONS: Record<string, ElementType> = {
	收案評估: ClipboardCheck,
	追蹤清單: ListTodo,
	成效: BarChart3,
	衛教內容: BookOpen,
};

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
		<aside className="sticky top-0 flex h-dvh w-60 shrink-0 flex-col border-e border-border-subtle bg-surface">
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

			<nav aria-label="藥師工作區" className="grow overflow-y-auto">
				<ul className="p-3">
					{TABS.map((t) => {
						const to = t.path ? `/admin/${t.path}` : "/admin";
						const badge = t.path === "followups" ? openCount : null;
						const Icon = TAB_ICONS[t.label];
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
									<span className="flex items-center gap-2.5">
										{Icon && (
											<Icon
												className="h-4 w-4 shrink-0 text-current"
												aria-hidden="true"
											/>
										)}
										{t.label}
									</span>
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
		</aside>
	);
}
