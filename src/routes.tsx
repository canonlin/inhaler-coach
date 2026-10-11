/**
 * Route tree.
 *
 * The pharmacist's tabs used to be React state, which meant 成效 had no URL: it
 * could not be bookmarked, shared, or reached with the back button. Each tab is
 * a route now.
 *
 * The basename comes from Vite's resolved base rather than a literal, because
 * the production build is served under /inhaler-coach/ while development is
 * served at the root. A router without that matches nothing after deploy.
 */

import type { RouteObject } from "react-router-dom";
import { createBrowserRouter, Outlet, useLocation } from "react-router-dom";

import { App } from "./App";
import { AdminShell } from "./pharmacist/AdminShell";
import { CaseEntry } from "./pharmacist/CaseEntry";
import { FollowupList } from "./pharmacist/components/FollowupList";
import { Outcomes } from "./pharmacist/Outcomes";
import { sectionFor } from "./pharmacist/TabNav";

/**
 * The shell needs to know which tab it is showing so the header can name it.
 * Reading the location here rather than threading a prop through three routes
 * keeps the route table declarative.
 */
function AdminFrame() {
	return (
		<AdminShell section={sectionFor(useLocation().pathname)}>
			<Outlet />
		</AdminShell>
	);
}

export const routes: RouteObject[] = [
	{
		path: "/admin",
		element: <AdminFrame />,
		children: [
			{ index: true, element: <CaseEntry /> },
			{
				path: "followups",
				element: (
					<section>
						<h1 className="mb-1 text-2xl font-bold tracking-tight text-text">
							追蹤清單
						</h1>
						<p className="mb-6 max-w-prose text-sm text-text-secondary">
							依逾期程度排序，逾期紅燈最優先。結案後立即從待辦移除。
						</p>
						<FollowupList />
					</section>
				),
			},
			{ path: "outcomes", element: <Outcomes /> },
		],
	},
	{
		// The patient coaching loop owns the root. A wildcard is deliberate: a
		// mistyped path should land the patient in the coaching flow rather than
		// on a dead end.
		path: "*",
		element: <App />,
	},
];

export const router = createBrowserRouter(routes, {
	// "" is not a valid basename; Vite reports "/" in dev and "/inhaler-coach/"
	// for the default production build.
	basename: import.meta.env.BASE_URL.replace(/\/+$/, "") || "/",
});
