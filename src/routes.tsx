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
import { LineHome } from "./line/pages/LineHome";
import { QuizPage } from "./line/pages/QuizPage";
import { RegisterPage } from "./line/pages/RegisterPage";
import { VideosPage } from "./line/pages/VideosPage";
import { LineMockup } from "./line-mockup/LineMockup";
import { AdminShell } from "./pharmacist/AdminShell";
import { AuthGate } from "./pharmacist/Auth";
import { CaseEntry } from "./pharmacist/CaseEntry";
import { ContentSettings } from "./pharmacist/ContentSettings";
import { FollowupList } from "./pharmacist/components/FollowupList";
import { DataTransfer } from "./pharmacist/DataTransfer";
import { Outcomes } from "./pharmacist/Outcomes";
import { QuickLookup } from "./pharmacist/QuickLookup";
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
		// The back office. Behind the gate because every screen under it reads
		// or writes patient records; the patient end below is not.
		path: "/admin",
		element: (
			<AuthGate>
				<AdminFrame />
			</AuthGate>
		),
		children: [
			{ index: true, element: <CaseEntry /> },
			{ path: "followups", element: <FollowupList /> },
			{ path: "lookup", element: <QuickLookup /> },
			{ path: "outcomes", element: <Outcomes /> },
			{ path: "settings", element: <ContentSettings /> },
			{ path: "data", element: <DataTransfer /> },
		],
	},
	{
		// Clinical Discussion Cockpit for NTUH Yunlin Pharmacy (臺大醫院雲林分院藥劑部).
		// Dedicated presentation tool for engineering and pharmacist alignment.
		// Demonstrates the 100% native conversational LINE Bot journey
		// (registration, videos, quiz in-chat cards) rather than a patient sandbox.
		path: "/line-mockup",
		element: <LineMockup />,
	},
	{
		// Secondary / reference preview routes migrated from the initial prototype.
		// Primary patient workflow is 100% LINE Bot native conversational in-chat.
		path: "/line",
		children: [
			{ index: true, element: <LineHome /> },
			{ path: "register", element: <RegisterPage /> },
			{ path: "videos", element: <VideosPage /> },
			{ path: "quiz", element: <QuizPage /> },
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
