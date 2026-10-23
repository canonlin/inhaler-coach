/**
 * The pharmacist's jobs, defined once.
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

/**
 * Pages that are reached from a list, not from the navigation.
 *
 * 資料匯入 used to be a fifth item in the navigation, and it did not belong
 * there: the navigation is the pharmacist's jobs — record, follow up, read the
 * results, edit the teaching material — and moving a spreadsheet in and out is
 * not one of them. It is an action over the same cases the list already shows,
 * so it now hangs off 追蹤清單 → 全部個案 as a button, and this is the page
 * that button opens.
 */
export const SUBPAGES = [
	{ path: "data", label: "資料匯入", end: "資料匯入" },
] as const satisfies readonly TabDef[];

export type TabPath = (typeof TABS)[number]["path"];
