/**
 * The pharmacist end's frame.
 *
 * The tabs used to float on an undifferentiated white page with the content
 * centred and unconstrained, which left most of the viewport empty and read as
 * a form rather than an application. The shell now does the work an application
 * frame does: a fixed product header with an identity, a real navigation strip,
 * and a content column with a reading measure and consistent gutters.
 *
 * Audience mode is Operate — a completed task at a pharmacy counter. That means
 * state and scanability over decoration, and it is why the header names the
 * site and the section rather than carrying an eyebrow label.
 */

import { cn } from "../lib/utils";
import { TabNav } from "./TabNav";

export function AdminShell({
	section,
	children,
}: {
	section: string;
	children?: React.ReactNode;
}) {
	return (
		<div className="min-h-dvh bg-bg">
			<header className="sticky top-0 z-10 border-b border-border-subtle bg-surface/95 backdrop-blur">
				<div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-3 px-6 py-3">
					<div className="flex min-w-0 items-baseline gap-3">
						{/* The platform name, not a product name. Symbicort Rapihaler
						    is the pilot device in the plan's title ("以…為例"), and the
						    record screen picks from every device on the formulary —
						    branding this "吸必擴" contradicted what the screen does. */}
						<span className="text-lg font-bold tracking-tight text-primary">
							智慧呼吸照護平台
						</span>
						<span className="truncate text-base text-text-secondary">
							QCC 吸入劑衛教
						</span>
					</div>
					<span className="text-base font-semibold text-text-muted">
						{section}
					</span>
				</div>

				<TabNav />
			</header>

			<main className="mx-auto max-w-6xl px-6 pt-6 pb-16">{children}</main>
		</div>
	);
}

/**
 * Page heading. One per screen, above the content it introduces, rather than
 * centred in the page.
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
			className={cn("mb-6 flex flex-wrap items-start justify-between gap-4")}
		>
			<div className="min-w-0">
				<h1 className="text-3xl font-bold tracking-tight text-text">{title}</h1>
				{description && (
					<p className="mt-2 max-w-prose text-base leading-relaxed text-text-secondary">
						{description}
					</p>
				)}
			</div>
			{action}
		</div>
	);
}
