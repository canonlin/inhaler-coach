/**
 * Product catalog.
 *
 * `name` is the spreadsheet key. It is the value written to the database, the
 * value the QCC dashboard groups by, and the key the 61-case baseline fixture
 * is joined on. It is NOT the display name — `label` is. Changing a `name`
 * breaks historical aggregation, so treat it as frozen.
 *
 * Source: 臺大醫院雲林分院藥劑部 QCC 品項清單，17 支，含類固醇者需漱口。
 *
 * @typedef {import('./steps.js').DeviceKind} DeviceKind
 */

/**
 * @typedef {object} Drug
 * @property {string} name      spreadsheet key, e.g. `Symbicort`
 * @property {string} label     display name, e.g. `Symbicort Rapihaler`
 * @property {DeviceKind} device
 * @property {boolean} hasIcs   contains inhaled corticosteroid → needs rinsing
 * @property {boolean} needsShake suspension type, must be shaken before use
 * @property {number} [doses]   actuations per inhaler; device default otherwise
 * @property {string} [note]    an open question the pharmacist should see
 */

/** @type {Drug[]} */
export const ALL_DRUGS = [
	d("Symbicort", "Symbicort Rapihaler", "MDI", true, true),
	d("Seretide Evohaler", "Seretide Evohaler", "MDI", true, true),
	d("Flixotide Evohaler", "Flixotide Evohaler", "MDI", true, true),
	d("Duasma HFA", "Duasma HFA 200", "MDI", true, true, 200, "懸浮／溶液待確認"),
	d("Breztri", "Breztri Aerosphere", "MDI", true, true),
	// Trimbow is a solution: the package insert says do not shake.
	d("Trimbow", "Trimbow", "MDI", true, false, undefined, "溶液型，仿單不需搖"),
	d("Bevespi", "Bevespi Aerosphere", "MDI", false, true),
	d("Berotec N", "Berotec N", "MDI", false, true, 200, "懸浮／溶液待確認"),
	d("Ventolin", "Ventolin Inhaler", "MDI", false, true, 200, "急救藥"),

	d("Relvar (Ellipta)", "Relvar Ellipta", "ELP", true, false),
	d("Trelegy 92/55/22 (Ellipta)", "Trelegy 92/55/22", "ELP", true, false),
	d("Trelegy 184/55/22 (Ellipta)", "Trelegy 184/55/22", "ELP", true, false),
	d("Anoro (Ellipta)", "Anoro Ellipta", "ELP", false, false),
	d("Ultibro Breezhaler", "Ultibro Breezhaler", "BRZ", false, false),

	d("Spiolto Respimat", "Spiolto Respimat", "RSP", false, false),
	d("Striverdi Respimat", "Striverdi Respimat", "RSP", false, false),
	d("Spiriva Respimat", "Spiriva Respimat", "RSP", false, false),
];

/** Actuation count per inhaler when a specific product number is not known. */
const DEVICE_DEFAULT_DOSES = { MDI: 120, ELP: 30, BRZ: 30, RSP: 60 };

/**
 * @param {string} name
 * @param {string} label
 * @param {DeviceKind} device
 * @param {boolean} hasIcs
 * @param {boolean} needsShake
 * @param {number} [doses]
 * @param {string} [note]
 * @returns {Drug}
 */
function d(name, label, device, hasIcs, needsShake, doses, note) {
	return {
		name,
		label,
		device,
		hasIcs,
		needsShake,
		...(doses ? { doses } : {}),
		...(note ? { note } : {}),
	};
}

/** @type {Record<string, Drug>} */
export const DRUG_BY_NAME = Object.fromEntries(ALL_DRUGS.map((x) => [x.name, x]));

/**
 * @param {string} name spreadsheet key
 * @returns {Drug}
 */
export function drugOf(name) {
	const found = DRUG_BY_NAME[name];
	if (!found) throw new Error(`unknown drug: ${name}`);
	return found;
}

/**
 * @param {string} name spreadsheet key
 * @returns {number} actuations per inhaler
 */
export function drugDoses(name) {
	const found = DRUG_BY_NAME[name];
	if (!found) throw new Error(`unknown drug: ${name}`);
	return found.doses ?? DEVICE_DEFAULT_DOSES[found.device];
}