/**
 * Saves a session to the pharmacist's own machine.
 *
 * There is deliberately no upload server. An automatic upload needs a backend,
 * and the only person who could deploy one is the project lead — a pharmacist,
 * not an engineer. Trading "the recording pharmacist drags two files into a
 * shared folder" for "the project lead sets up a Google Apps Script Web App and
 * an environment variable" is a bad deal, and it puts the technical burden on
 * the one person least equipped to carry it. Two files, one drag.
 *
 * It also means there are no keys, no endpoints, and no third-party service in
 * the path — the recording goes from the browser to disk to the team's own
 * Drive folder.
 */

/** @returns {string[]} the filenames written */
export function saveSession(name, { metadata, signals, video }) {
	// The extension follows the blob's real type: Safari records MP4, and an MP4
	// saved as .webm is a file nothing will open.
	const extension = video.type.includes("mp4") ? "mp4" : "webm";

	saveBlob(`${name}.${extension}`, video);
	saveBlob(
		`${name}.json`,
		new Blob([JSON.stringify({ metadata, signals })], {
			type: "application/json",
		}),
	);
	return [`${name}.${extension}`, `${name}.json`];
}

function saveBlob(filename, blob) {
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	a.click();
	// Revoking immediately can cancel the download in some browsers.
	setTimeout(() => URL.revokeObjectURL(url), 60_000);
}
