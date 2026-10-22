/**
 * Reading and writing .xlsx, without a dependency.
 *
 * An .xlsx is a zip of XML. Reading it needs the zip container and the
 * spreadsheet XML; writing it needs both plus a CRC. A spreadsheet library
 * would be a hundred megabytes of transitive dependency for a project that
 * has none, and this is the part the deployment has to be able to do on a
 * serverless function where there is no shell to call `unzip`.
 */

/**
 * Unpack a zip archive held in memory.
 *
 * @param {Buffer} buffer
 * @returns {Map<string, Buffer>} file name -> contents
 */
export function unzip(buffer) {
	// The end-of-central-directory record is at the end, but a comment may
	// follow it, so it is searched for from the back.
	let eocd = -1;
	for (let i = buffer.length - 22; i >= 0; i -= 1) {
		if (buffer.readUInt32LE(i) === 0x06054b50) {
			eocd = i;
			break;
		}
	}
	if (eocd < 0) throw new Error("not a zip archive");

	const count = buffer.readUInt16LE(eocd + 10);
	let offset = buffer.readUInt32LE(eocd + 16);
	const files = new Map();

	for (let i = 0; i < count; i += 1) {
		if (buffer.readUInt32LE(offset) !== 0x02014b50) break;
		const method = buffer.readUInt16LE(offset + 10);
		const compressedSize = buffer.readUInt32LE(offset + 20);
		const nameLength = buffer.readUInt16LE(offset + 28);
		const extraLength = buffer.readUInt16LE(offset + 30);
		const commentLength = buffer.readUInt16LE(offset + 32);
		const localOffset = buffer.readUInt32LE(offset + 42);
		const name = buffer
			.subarray(offset + 46, offset + 46 + nameLength)
			.toString("utf8");

		// The local header repeats the name and extra lengths, and they can
		// differ from the central directory's, so they are read again here.
		const localNameLength = buffer.readUInt16LE(localOffset + 26);
		const localExtraLength = buffer.readUInt16LE(localOffset + 28);
		const dataStart = localOffset + 30 + localNameLength + localExtraLength;
		const raw = buffer.subarray(dataStart, dataStart + compressedSize);

		if (method === 0) files.set(name, Buffer.from(raw));
		else if (method === 8) files.set(name, inflateRaw(raw));
		// Other methods are not used by .xlsx.

		offset += 46 + nameLength + extraLength + commentLength;
	}
	return files;
}

/**
 * Pack files into a zip archive.
 *
 * @param {Map<string, Buffer>|Array<[string, Buffer]>} entries
 * @returns {Buffer}
 */
export function zip(entries) {
	const list = entries instanceof Map ? [...entries] : entries;
	const locals = [];
	const centrals = [];
	let offset = 0;

	for (const [name, content] of list) {
		const nameBytes = Buffer.from(name, "utf8");
		const deflated = deflateRaw(content);
		const crc = crc32(content);

		const local = Buffer.alloc(30 + nameBytes.length);
		local.writeUInt32LE(0x04034b50, 0);
		local.writeUInt16LE(20, 4); // version needed
		local.writeUInt16LE(0x0800, 6); // UTF-8 names
		local.writeUInt16LE(8, 8); // deflate
		local.writeUInt16LE(0, 10); // time
		local.writeUInt16LE(0x2821, 12); // date (2000-01-01)
		local.writeUInt32LE(crc, 14);
		local.writeUInt32LE(deflated.length, 18);
		local.writeUInt32LE(content.length, 22);
		local.writeUInt16LE(nameBytes.length, 26);
		local.writeUInt16LE(0, 28);
		nameBytes.copy(local, 30);
		locals.push(local, deflated);

		const central = Buffer.alloc(46 + nameBytes.length);
		central.writeUInt32LE(0x02014b50, 0);
		central.writeUInt16LE(20, 4);
		central.writeUInt16LE(20, 6);
		central.writeUInt16LE(0x0800, 8);
		central.writeUInt16LE(8, 10);
		central.writeUInt16LE(0, 12);
		central.writeUInt16LE(0x2821, 14);
		central.writeUInt32LE(crc, 16);
		central.writeUInt32LE(deflated.length, 20);
		central.writeUInt32LE(content.length, 24);
		central.writeUInt16LE(nameBytes.length, 28);
		central.writeUInt16LE(0, 30);
		central.writeUInt16LE(0, 32);
		central.writeUInt16LE(0, 34);
		central.writeUInt16LE(0, 36);
		central.writeUInt32LE(0, 38);
		central.writeUInt32LE(offset, 42);
		nameBytes.copy(central, 46);
		centrals.push(central);

		offset += local.length + deflated.length;
	}

	const centralBuffer = Buffer.concat(centrals);
	const end = Buffer.alloc(22);
	end.writeUInt32LE(0x06054b50, 0);
	end.writeUInt16LE(0, 4);
	end.writeUInt16LE(0, 6);
	end.writeUInt16LE(list.length, 8);
	end.writeUInt16LE(list.length, 10);
	end.writeUInt32LE(centralBuffer.length, 12);
	end.writeUInt32LE(offset, 16);
	end.writeUInt16LE(0, 20);

	return Buffer.concat([...locals, centralBuffer, end]);
}

/**
 * Read a workbook into sheets of rows.
 *
 * @param {Buffer} buffer an .xlsx file
 * @returns {{sheets: {name: string, rows: string[][]}[]}}
 */
export function readXlsx(buffer) {
	const files = unzip(buffer);
	const shared = readSharedStrings(files);
	const workbook = text(files.get("xl/workbook.xml"));
	const rels = text(files.get("xl/_rels/workbook.xml.rels"));

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
		const path = `xl/${target.replace(/^\/?xl\//, "")}`;
		sheets.push({ name, rows: readSheet(text(files.get(path)), shared) });
	}
	return { sheets };
}

/**
 * Write sheets as a workbook.
 *
 * @param {{name: string, rows: Array<Array<string|number|Date|null>>}[]} sheets
 * @returns {Buffer}
 */
export function writeXlsx(sheets) {
	const files = new Map();

	const contentTypes = [
		'<?xml version="1.0" encoding="UTF-8" standalone="yes"?>',
		'<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">',
		'<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>',
		'<Default Extension="xml" ContentType="application/xml"/>',
		'<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>',
		'<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>',
		...sheets.map(
			(_, i) =>
				`<Override PartName="/xl/worksheets/sheet${i + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`,
		),
		"</Types>",
	].join("");
	files.set("[Content_Types].xml", Buffer.from(contentTypes, "utf8"));

	files.set(
		"_rels/.rels",
		Buffer.from(
			[
				'<?xml version="1.0" encoding="UTF-8" standalone="yes"?>',
				'<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">',
				'<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>',
				"</Relationships>",
			].join(""),
			"utf8",
		),
	);

	files.set(
		"xl/workbook.xml",
		Buffer.from(
			[
				'<?xml version="1.0" encoding="UTF-8" standalone="yes"?>',
				'<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets>',
				...sheets.map(
					(s, i) =>
						`<sheet name="${escapeXml(s.name)}" sheetId="${i + 1}" r:id="rId${i + 1}"/>`,
				),
				"</sheets></workbook>",
			].join(""),
			"utf8",
		),
	);

	files.set(
		"xl/_rels/workbook.xml.rels",
		Buffer.from(
			[
				'<?xml version="1.0" encoding="UTF-8" standalone="yes"?>',
				'<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">',
				...sheets.map(
					(_, i) =>
						`<Relationship Id="rId${i + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet${i + 1}.xml"/>`,
				),
				'<Relationship Id="rIdStyles" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>',
				"</Relationships>",
			].join(""),
			"utf8",
		),
	);

	// Two cell formats: default, and a date. A date written as a number with
	// this style sorts and filters like a date in Excel; written as text it
	// does not.
	files.set(
		"xl/styles.xml",
		Buffer.from(
			[
				'<?xml version="1.0" encoding="UTF-8" standalone="yes"?>',
				'<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">',
				'<numFmts count="1"><numFmt numFmtId="164" formatCode="yyyy\\-mm\\-dd"/></numFmts>',
				'<fonts count="1"><font><sz val="11"/><name val="Calibri"/></font></fonts>',
				'<fills count="1"><fill><patternFill patternType="none"/></fill></fills>',
				'<borders count="1"><border/></borders>',
				'<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>',
				'<cellXfs count="2">',
				'<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>',
				'<xf numFmtId="164" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"/>',
				"</cellXfs>",
				"</styleSheet>",
			].join(""),
			"utf8",
		),
	);

	sheets.forEach((sheet, index) => {
		files.set(
			`xl/worksheets/sheet${index + 1}.xml`,
			Buffer.from(sheetXml(sheet), "utf8"),
		);
	});

	return zip(files);
}

/** One sheet as worksheet XML. */
function sheetXml(sheet) {
	const rows = sheet.rows
		.map((row, r) => {
			const cells = row
				.map((value, c) => cellXml(value, c, r))
				.filter(Boolean)
				.join("");
			return `<row r="${r + 1}">${cells}</row>`;
		})
		.join("");
	return [
		'<?xml version="1.0" encoding="UTF-8" standalone="yes"?>',
		'<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">',
		`<sheetData>${rows}</sheetData>`,
		"</worksheet>",
	].join("");
}

function cellXml(value, column, row) {
	if (value === null || value === undefined || value === "") return "";
	const ref = `${columnName(column)}${row + 1}`;
	if (value instanceof Date) {
		const serial = Math.round(
			(value.getTime() - Date.UTC(1899, 11, 30)) / 86400000,
		);
		return `<c r="${ref}" s="1"><v>${serial}</v></c>`;
	}
	if (typeof value === "number" && Number.isFinite(value)) {
		return `<c r="${ref}"><v>${value}</v></c>`;
	}
	return `<c r="${ref}" t="inlineStr"><is><t xml:space="preserve">${escapeXml(String(value))}</t></is></c>`;
}

function columnName(index) {
	let n = index + 1;
	let name = "";
	while (n > 0) {
		const rem = (n - 1) % 26;
		name = String.fromCharCode(65 + rem) + name;
		n = Math.floor((n - 1) / 26);
	}
	return name;
}

function readSharedStrings(files) {
	const xml = text(files.get("xl/sharedStrings.xml"));
	if (!xml) return [];
	return [...xml.matchAll(/<si\b([^>]*?)(?:\/>|>([\s\S]*?)<\/si>)/g)].map((m) =>
		[...(m[2] ?? "").matchAll(/<t[^>]*>([\s\S]*?)<\/t>/g)]
			.map((t) => decodeXml(t[1]))
			.join(""),
	);
}

/**
 * One sheet as rows of cell text.
 *
 * The cell pattern accepts both `<c .../>` and `<c ...>...</c>`. A styled but
 * empty cell is written self-closing, and a pattern that only knows the
 * paired form swallows the cells after it: the sheet then reads fine and is
 * wrong, a step of 正確 coming back as the number 134 — its index in the
 * shared string table.
 */
function readSheet(xml, shared) {
	if (!xml) return [];
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
			const column = ref ? columnIndex(ref[1]) : row.length;
			const type = cellAttrs.match(/\bt="([^"]+)"/)?.[1];
			let value = "";
			if (type === "s") {
				const index = Number(body.match(/<v>([\s\S]*?)<\/v>/)?.[1] ?? -1);
				value = shared[index] ?? "";
			} else if (type === "inlineStr") {
				value = (body.match(/<t[^>]*>([\s\S]*?)<\/t>/)?.[1] ?? "").replace(
					/<[^>]+>/g,
					"",
				);
			} else {
				value = body.match(/<v>([\s\S]*?)<\/v>/)?.[1] ?? "";
			}
			row[column] = decodeXml(value);
		}
		rows[number - 1] = row.map((v) => v ?? "");
	}
	return rows.filter((r) => r !== undefined);
}

function columnIndex(letters) {
	let n = 0;
	for (const ch of letters) n = n * 26 + (ch.charCodeAt(0) - 64);
	return n - 1;
}

function text(buffer) {
	return buffer ? buffer.toString("utf8") : "";
}

function escapeXml(value) {
	return String(value)
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&apos;");
}

function decodeXml(value) {
	return String(value)
		.replace(/&lt;/g, "<")
		.replace(/&gt;/g, ">")
		.replace(/&quot;/g, '"')
		.replace(/&apos;/g, "'")
		.replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
		.replace(/&amp;/g, "&");
}

// ── compression and checksums ───────────────────────────────────────────────

import { deflateRawSync, inflateRawSync } from "node:zlib";

function deflateRaw(buffer) {
	return deflateRawSync(buffer);
}

function inflateRaw(buffer) {
	return inflateRawSync(buffer);
}

const CRC_TABLE = (() => {
	const table = new Uint32Array(256);
	for (let i = 0; i < 256; i += 1) {
		let c = i;
		for (let k = 0; k < 8; k += 1) {
			c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
		}
		table[i] = c >>> 0;
	}
	return table;
})();

function crc32(buffer) {
	let crc = 0xffffffff;
	for (let i = 0; i < buffer.length; i += 1) {
		crc = CRC_TABLE[(crc ^ buffer[i]) & 0xff] ^ (crc >>> 8);
	}
	return (crc ^ 0xffffffff) >>> 0;
}
