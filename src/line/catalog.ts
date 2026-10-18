/**
 * The pharmacist's drug catalog, exactly as shipped in the LINE package.
 *
 * Source: LINE衛教-20261013T160136Z-1-001.zip → data/drugs.json (16 drugs).
 * Do not edit clinical content here; it is the pharmacist's table, and the
 * backend trusts this file over anything the browser sends (see validate.ts).
 */

import drugs from "./data/drugs.json";

export interface LineDrug {
	id: string;
	displayName: string;
	type: "MDI" | "DPI" | "SMI";
	ICS: boolean;
	roles: ("maintenance" | "rescue")[];
}

const CATALOG = drugs as LineDrug[];

/** Backend rule, app.py → start_journey: rescue takes Ventolin and nothing else. */
export const RESCUE_ONLY_ID = "Ventolin_Evohaler";

export function findDrug(id: string): LineDrug | undefined {
	return CATALOG.find((d) => d.id === id);
}

export function maintenanceDrugs(): LineDrug[] {
	return CATALOG.filter((d) => d.roles.includes("maintenance"));
}

export function drugCount(): number {
	return CATALOG.length;
}
