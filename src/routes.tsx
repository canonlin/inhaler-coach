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
import { sectionFor } from "./pharmacist/SideNav";

/**
 * The shell needs to know which section it is showing so the top bar can name
 * it. Reading the location here rather than threading a prop through three
 * routes keeps the route table declarative.
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
			{ path: "followups", element: <FollowupList /> },
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
