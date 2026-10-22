/**
 * Read an .xlsx into rows, with no dependencies.
 *
 * An .xlsx is a zip of XML: the cell values live in xl/worksheets/sheetN.xml
 * and every shared string in xl/sharedStrings.xml. Reading it by hand avoids
 * adding a spreadsheet library to a project that has none, and it is a
 * hundred lines rather than a hundred megabytes.
 *
 * Bun's zlib and Node's zlib both inflate; this script is run with bun.
 */

import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";

/**
 * @param {string} path an .xlsx file
 * @returns {{sheets: {name: string, rows: string[][]}[]}}
 */
export function readXlsx(path) {
	const dir = execSync(`mktemp -d`, { encoding: "utf8" }).trim();
	try {
		execSync(`unzip -o -q ${JSON.stringify(path)} -d ${JSON.stringify(dir)}`);

		const shared = readSharedStrings(dir);
		const workbook = readFileSync(`${dir}/xl/workbook.xml`, "utf8");
		const rels = readFileSync(`${dir}/xl/_rels/workbook.xml.rels`, "utf8");

		// rId -> target file
		const relMap = new Map();
		for (const m of rels.matchAll(/Id="([^"]+)"[^>]*Target="([^"]+)"/g)) {
			relMap.set(m[1], m[2]);
		}

		const sheets = [];
		for (const m of workbook.matchAll(
			/<sheet[^>]*name="([^"]*)"[^>]*r:id="([^"]*)"/g,
		)) {
			const [, name, rid] = m;
			const target = relMap.get(rid) ?? "";
			const file = `${dir}/xl/${target.replace(/^\/?xl\//, "")}`;
			sheets.push({ name, rows: readSheet(file, shared) });
		}
		return { sheets };
	} finally {
		execSync(`rm -rf ${JSON.stringify(dir)}`);
	}
}

/**
 * Every string in the shared string table, in order.
 *
 * A cell that holds text points at this table by index, so the index is a
 * value, not the value itself.
 */
function readSharedStrings(dir) {
	try {
		const xml = readFileSync(`${dir}/xl/sharedStrings.xml`, "utf8");
		return [...xml.matchAll(/<si\b([^>]*?)(?:\/>|>([\s\S]*?)<\/si>)/g)].map(
			(m) =>
				[...(m[2] ?? "").matchAll(/<t[^>]*>([\s\S]*?)<\/t>/g)]
					.map((t) => decode(t[1]))
					.join(""),
		);
	} catch {
		return [];
	}
}

/**
 * One sheet as rows of cell text, with empty cells kept in place.
 *
 * The cell pattern accepts both `<c .../>` and `<c ...>...</c>`. That matters:
 * a styled but empty cell is written self-closing, and a pattern that only
 * knows the paired form swallows the cells that follow it. The result reads
 * fine and is wrong — a step of 正確 comes back as the number 134, which is
 * its index in the shared string table.
 */
function readSheet(file, shared) {
	const xml = readFileSync(file, "utf8");
	const rows = [];
	for (const rowM of xml.matchAll(
		/<row\b([^>]*?)(?:\/>|>([\s\S]*?)<\/row>)/g,
	)) {
		const attrs = rowM[1] ?? "";
		const number = Number(attrs.match(/\br="(\d+)"/)?.[1] ?? rows.length + 1);
		const row = [];
		for (const cellM of (rowM[2] ?? "").matchAll(
			/<c\b([^>]*?)(?:\/>|>([\s\S]*?)<\/c>)/g,
		)) {
			const cellAttrs = cellM[1] ?? "";
			const body = cellM[2] ?? "";
			const ref = cellAttrs.match(/\br="([A-Z]+)\d+"/);
			const col = ref ? columnIndex(ref[1]) : row.length;
			const type = cellAttrs.match(/\bt="([^"]+)"/)?.[1];
			let value = "";
			if (type === "s") {
				const idx = Number(body.match(/<v>([\s\S]*?)<\/v>/)?.[1] ?? -1);
				value = shared[idx] ?? "";
			} else if (type === "inlineStr") {
				value = (body.match(/<t[^>]*>([\s\S]*?)<\/t>/)?.[1] ?? "").replace(
					/<[^>]+>/g,
					"",
				);
			} else {
				value = body.match(/<v>([\s\S]*?)<\/v>/)?.[1] ?? "";
			}
			row[col] = decode(value);
		}
		rows[number - 1] = row.map((v) => v ?? "");
	}
	return rows.filter((r) => r !== undefined);
}

/** "A" -> 0, "B" -> 1, "AA" -> 26. */
function columnIndex(letters) {
	let n = 0;
	for (const ch of letters) n = n * 26 + (ch.charCodeAt(0) - 64);
	return n - 1;
}

function decode(text) {
	return text
		.replace(/&lt;/g, "<")
		.replace(/&gt;/g, ">")
		.replace(/&quot;/g, '"')
		.replace(/&apos;/g, "'")
		.replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
		.replace(/&amp;/g, "&");
}
