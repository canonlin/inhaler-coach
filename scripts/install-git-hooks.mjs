/**
 * Point git at the hooks in this repository.
 *
 * A hook in .git/hooks lives on one machine and dies with the clone. The hook
 * that decides whether a push may happen has to travel with the code, or the
 * gate exists only for whoever wrote it.
 */
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

if (!existsSync(resolve(ROOT, ".git"))) {
	// Not a clone (a Docker build, a tarball): there is nothing to configure.
	process.exit(0);
}

try {
	execFileSync("git", ["config", "core.hooksPath", ".githooks"], {
		cwd: ROOT,
		stdio: "ignore",
	});
} catch {
	// A read-only checkout or a git build without a repository: not fatal.
	process.exit(0);
}
