/**
 * The note rule, mechanically checked.
 *
 * A note and the body text it sits under are the same size and weight, because
 * the body is on the type scale's 16px floor and shrinking the note broke it.
 * Two attempts to separate them visually failed — muted grey, then a hairline
 * rule — both relying on subtlety against a surface that swallows it. The note
 * now says 註： in the text itself.
 *
 * That is a convention, and conventions rot silently: nothing stops the next
 * component from writing an unmarked muted paragraph and the next reviewer from
 * accepting it. So any element carrying the note class must also carry the
 * marker. This fails the build rather than the reader.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const NOTE_CLASS = "border-t border-border";
const MARKER = "註：";

const files = [];
const walk = (dir) => {
	for (const entry of readdirSync(dir)) {
		const full = join(dir, entry);
		if (statSync(full).isDirectory()) walk(full);
		else if (full.endsWith(".tsx")) files.push(full);
	}
};
walk("src/pharmacist");

const findings = [];
for (const file of files) {
	const src = readFileSync(file, "utf8");
	const lines = src.split("\n");
	lines.forEach((line, i) => {
		if (!line.includes(NOTE_CLASS)) return;
		/*
		 * The marker must come FIRST. The first version of this check only
		 * asked whether 註： appeared somewhere in the element, and passed a
		 * note that rendered 「以「人」計註：：至少…」 — the label had been
		 * appended after the opening words instead of placed before them, which
		 * is worse than no label at all because it reads as a typo in the copy.
		 *
		 * So: find the first line of actual text inside the element, ignoring
		 * JSX comments, and require it to begin with the marker.
		 */
		// Collapse the element's source, drop comments and tags, and look at
		// what a reader actually gets first. Skipping "lines starting with
		// <span" was wrong: the marker and the first words sit on the same
		// line, so the line was skipped whole and the note was reported as
		// unmarked while the marker was right there.
		const body = lines
			.slice(i + 1, i + 16)
			.join(" ")
			.replace(/\{[\s\S]*?\*\/\}/g, "")          // JSX comments
			.replace(/<[^>]*>/g, "")                         // tags
			.replace(/\s+/g, " ")
			.trim();
		const firstText = body;
		if (!firstText.includes(MARKER) || firstText.indexOf(MARKER) > 0) {
			findings.push({
				file,
				line: i + 1,
				detail: `a note does not open with ${MARKER} — it reads as `
					+ `body text, or as a typo in the copy. First line is: `
					+ `${firstText ? firstText.slice(0, 40) : "(empty)"}`,
			});
		}
	});
}

console.log(`\nnote marker — ${files.length} 個檔案`);
if (!findings.length) {
	console.log("✓ 每個備註都有 註： 標記");
} else {
	for (const f of findings) {
		console.log(`✗ ${f.file}:${f.line}  ${f.detail}`);
	}
}
process.exit(findings.length ? 1 : 0);