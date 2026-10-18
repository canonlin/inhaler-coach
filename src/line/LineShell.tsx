/**
 * Chrome for the LIFF pages: back link, title, phone-width column.
 *
 * Deliberately plain. These pages render inside LINE on older adults' phones;
 * the legacy package's gradient hero and emoji badges did not survive contact
 * with the type scale (content below 16px, three unlisted sizes), so they were
 * not migrated. What was migrated is the structure: home → register / videos /
 * quiz, the same three entries as index.html's nav.
 */

import { Link } from "react-router-dom";

export function LineShell({
	title,
	children,
}: {
	title: string;
	children: React.ReactNode;
}) {
	return (
		<main className="mx-auto min-h-screen w-full max-w-md bg-bg px-5 pt-4 pb-10 text-text">
			<header className="flex items-center gap-3 border-b border-border-subtle pb-3">
				<Link
					to="/line"
					aria-label="回主選單"
					className="rounded-md px-2 py-2 text-lg leading-none text-text-secondary focus-visible:outline-2 focus-visible:outline-ring"
				>
					‹
				</Link>
				<h1 className="text-lg font-bold">{title}</h1>
			</header>
			<div className="pt-4">{children}</div>
		</main>
	);
}
