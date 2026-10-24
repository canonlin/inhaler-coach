/**
 * Device taxonomy, and where it meets this repo's.
 *
 * The pharmacist plans in three classes (MDI / DPI / SMI); the repo's domain
 * (src/domain/drugs.js) splits DPI into ELP/BRZ and calls SMI RSP. The map
 * below is per drug, because the split cannot be derived from the class:
 * Ultibro is BRZ while the other DPIs are ELP.
 *
 * Sources: data/drugs.json (left) + src/domain/drugs.js ALL_DRUGS (right).
 */

import type { DeviceKind } from "../api-client";

export type LineDevice = "MDI" | "DPI" | "SMI";

/** app.js → TYPE_LABELS, verbatim. */
export const LINE_DEVICE_LABELS: Record<LineDevice, string> = {
	MDI: "定量吸入劑（MDI）",
	DPI: "乾粉吸入劑（DPI）",
	SMI: "軟霧吸入劑（SMI）",
};

export const LINE_ROLE_LABELS: Record<"maintenance" | "rescue", string> = {
	maintenance: "保養用藥",
	rescue: "緊急用藥",
};

const TO_REPO: Record<string, DeviceKind> = {
	Symbicort_Rapihaler: "MDI",
	Seretide_Evohaler: "MDI",
	Flixotide_Evohaler: "MDI",
	Duasma_MDI: "MDI",
	Breztri_Aerosphere: "MDI",
	Trimbow_Inhalation: "MDI",
	Bevespi_Aerosphere: "MDI",
	Berotec_N: "MDI",
	Ventolin_Evohaler: "MDI",
	Relvar_Ellipta: "ELP",
	Trelegy_92: "ELP",
	Trelegy_184: "ELP",
	Anoro_Ellipta: "ELP",
	Ultibro_Breezhaler: "BRZ",
	Spiolto_Respimat: "RSP",
	Striverdi_Respimat: "RSP",
	Spiriva_Respimat: "RSP",
};

/** Line drug id → repo device. Unknown ids stay unknown rather than guessed. */
export function toRepoDevice(drugId: string): DeviceKind | undefined {
	return TO_REPO[drugId];
}
