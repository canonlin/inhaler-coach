/**
 * The pharmacist's three jobs, defined once.
 *
 * The tab bar, the route table and the redirect default all read from here.
 * They used to live in three separate places, which is how 收案評估 and 成效
 * ended up with no URLs while the tab bar and the router disagreed about names.
 */
export interface TabDef {
	/** Path segment under /admin. The index route has none. */
	path?: string;
	label: string;
	/** Shown when the tab is active, for assistive technology and for tests. */
	end: string;
}

export const TABS = [
	{ path: undefined, label: "收案評估", end: "收案評估" },
	{ path: "followups", label: "追蹤清單", end: "追蹤清單" },
	{ path: "outcomes", label: "成效", end: "成效" },
	{ path: "settings", label: "衛教內容", end: "衛教內容" },
] as const satisfies readonly TabDef[];

export type TabPath = (typeof TABS)[number]["path"];
