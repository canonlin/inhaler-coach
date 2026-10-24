/**
 * Wait for this commit's CI run and fail if it is red.
 *
 * The gate is not the push: the push is how the code leaves the machine, and
 * what says whether it may is the CI run on that commit. Four pushes in a row
 * went out with a red CI because nobody looked at the result. This script is
 * the looking, and it is a command that can fail.
 */
import { execFileSync } from "node:child_process";

const BRANCH = process.env.BRANCH || "feature/multimodal-v2";
const TIMEOUT_MS = Number(process.env.CI_TIMEOUT_MS || 20 * 60 * 1000);
const POLL_MS = 15000;

function git(...args) {
	return execFileSync("git", args, { encoding: "utf8" }).trim();
}

function ghAvailable() {
	try {
		execFileSync("gh", ["auth", "status"], { stdio: "ignore" });
		return true;
	} catch {
		return false;
	}
}

if (!ghAvailable()) {
	console.log("  gh 沒有登入，略過 CI 等待（這不是綠燈，是沒看）。");
	process.exit(0);
}

const sha = git("rev-parse", "HEAD");
const deadline = Date.now() + TIMEOUT_MS;

console.log(`  等 CI：${BRANCH} @ ${sha.slice(0, 7)}`);

let seen = null;
while (Date.now() < deadline) {
	const out = execFileSync(
		"gh",
		[
			"run",
			"list",
			"--branch",
			BRANCH,
			"--commit",
			sha,
			"--limit",
			"1",
			"--json",
			"databaseId,status,conclusion,url",
		],
		{ encoding: "utf8" },
	);
	const runs = JSON.parse(out || "[]");
	if (runs.length > 0) {
		seen = runs[0];
		if (seen.status === "completed") break;
	}
	await new Promise((r) => setTimeout(r, POLL_MS));
}

if (!seen) {
	console.error("  這次 push 沒有對應的 CI run，請到 Actions 看一眼。");
	process.exit(1);
}

if (seen.conclusion !== "success") {
	console.error(
		`  CI 是 ${seen.conclusion}：${seen.url}\n  閘門是紅的，這個 commit 不能就這樣留著。`,
	);
	process.exit(1);
}

console.log(`  CI 綠：${seen.url}`);
