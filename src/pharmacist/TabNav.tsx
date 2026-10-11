/**
 * The tab strip.
 *
 * Real links, not buttons that set state: the outcomes view now has an address,
 * so it can be bookmarked, sent to a colleague, and reached with the back
 * button. NavLink sets aria-current="page" on the active tab, which is both what
 * assistive technology announces and what the underline keys off, so the two
 * cannot disagree.
 */
import { NavLink } from "react-router-dom";
import { cn } from "../lib/utils";
import { TABS } from "./tabs";

/** Label of the tab the current route belongs to, for the header. */
export function sectionFor(pathname: string): string {
	const tail = pathname.replace(/\/+$/, "");
	const hit = [...TABS]
		.reverse()
		.find((t) => t.path && tail.endsWith(`/${t.path}`));
	return hit?.label ?? TABS[0].label;
}

export function TabNav() {
	return (
		<nav aria-label="藥師工作區" className="rx-tabs mx-auto max-w-6xl px-6">
			<ul className="-mb-px flex gap-1">
				{TABS.map((t) => (
					<li key={t.label}>
						<NavLink
							to={t.path ? `/admin/${t.path}` : "/admin"}
							end
							className={({ isActive }) =>
								cn(
									"-mb-px inline-block border-b-2 px-4 py-3 text-base font-semibold transition-colors",
									isActive
										? "border-primary text-primary"
										: "border-transparent text-text-secondary hover:border-border hover:text-text",
								)
							}
						>
							{t.label}
						</NavLink>
					</li>
				))}
			</ul>
		</nav>
	);
}
