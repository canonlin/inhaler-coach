/**
 * The pharmacist end's frame.
 *
 * This is the classic back-office shell: fixed left navigation, a top bar
 * carrying the page's own context and actions, and a content column that fills
 * whatever width is left. That is the documented default for internal and
 * CRUD-heavy admin tools — it scales from five menu items to fifty, and it
 * keeps the user oriented, which matters more here than saving pixels because
 * this app has exactly three sections and a counter tablet.
 *
 * It replaces a centred column under a thin tab strip, which read as a web page
 * with tabs rather than an application: there was no persistent frame saying
 * "you are inside a tool", the navigation disappeared when the content grew,
 * and the content was capped at 72rem in the middle of a wide screen, so a
 * 37-row table could not use the room it needed.
 *
 * The content column is deliberately unconstrained. Text blocks carry their own
 * reading measure; tables and grids take the full width, because narrowing a
 * record list is what turns a back office back into a brochure.
 */
import { cn } from "../lib/utils";
import { SideNav } from "./SideNav";

export function AdminShell({
	section,
	actions,
	children,
}: {
	section: string;
	/** Per-screen controls, shown in the top bar rather than in a strip of
	 *  their own — controls belong next to the page they belong to. */
	actions?: React.ReactNode;
	children?: React.ReactNode;
}) {
	return (
		<div className="surface-admin flex min-h-dvh bg-bg">
			<SideNav />

			{/* The content region scrolls; the navigation does not, so the three
			    sections stay reachable from anywhere in a long queue. */}
			<div className="flex min-w-0 flex-1 flex-col">
				<header className="sticky top-0 z-10 border-b border-border-subtle bg-surface/95 backdrop-blur">
					<div className="flex min-h-14 flex-wrap items-center justify-between gap-x-6 gap-y-2 px-6 py-2.5">
						<h1 className="text-xl font-bold tracking-tight text-text">
							{section}
						</h1>
						{actions && (
							<div className="flex flex-wrap items-center gap-3">{actions}</div>
						)}
					</div>
				</header>

				<main className="min-w-0 grow px-6 py-5">{children}</main>
			</div>
		</div>
	);
}

/**
 * Page heading for a section within the content column.
 *
 * One per screen, directly above what it introduces. The description is capped
 * to a reading measure rather than the full column width — a 900px paragraph
 * is a wall of text, and a back office is not a reading surface.
 */
export function PageTitle({
	title,
	description,
	action,
}: {
	title: string;
	description?: string;
	action?: React.ReactNode;
}) {
	return (
		<div
			className={cn("mb-5 flex flex-wrap items-start justify-between gap-4")}
		>
			<div className="min-w-0">
				<h2 className="text-lg font-bold tracking-tight text-text">{title}</h2>
				{description && (
					<p className="mt-1 max-w-prose text-base leading-relaxed text-text-secondary">
						{description}
					</p>
				)}
			</div>
			{action}
		</div>
	);
}
