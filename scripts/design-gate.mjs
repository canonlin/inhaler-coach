/**
 * The design gate, together with the servers it needs.
 *
 * The gate opens the back office, so it needs the API and the dev server up.
 * Starting them here — rather than in each caller — is what keeps the three
 * places that run the gate (the pre-push hook, `check:all` and CI) measuring
 * the same thing.
 *
 * It also keeps the servers and the gate in one process group. A CI runner
 * tears down a step's background processes when the step ends, so a server
 * started in one step is gone by the next one; the gate then measures an API
 * that is no longer there and reports it as a design problem — a red light
 * about the wrong thing, which is worse than no light.
 *
 * Run: node scripts/design-gate.mjs
 */
import { spawn, spawnSync } from "node:child_process";
import net from "node:net";
import { scratchDatabaseUrl } from "./scratch-db.mjs";

const API_PORT = Number(process.env.DESIGN_API_PORT ?? 4183);
const WEB_PORT = Number(process.env.DESIGN_WEB_PORT ?? 4185);
const BOOT_TIMEOUT_MS = 60_000;

/** Is something already listening on this port? */
function inUse(port) {
	return new Promise((resolve) => {
		const socket = net.connect({ port, host: "127.0.0.1" });
		socket.setTimeout(500);
		const done = (yes) => {
			socket.destroy();
			resolve(yes);
		};
		socket.on("connect", () => done(true));
		socket.on("error", () => done(false));
		socket.on("timeout", () => done(false));
	});
}

/** Does this URL answer? */
async function answers(url) {
	try {
		const res = await fetch(url, { signal: AbortSignal.timeout(2000) });
		return res.ok;
	} catch {
		return false;
	}
}

async function waitFor(url, label) {
	const deadline = Date.now() + BOOT_TIMEOUT_MS;
	while (Date.now() < deadline) {
		if (await answers(url)) return true;
		await new Promise((r) => setTimeout(r, 500));
	}
	console.error(
		`\n${label} 沒有在 ${BOOT_TIMEOUT_MS / 1000} 秒內起來：${url}\n`,
	);
	return false;
}

/**
 * The disposable database, and only that one.
 *
 * The gate signs in as a temporary administrator, which means it writes to the
 * database: it creates an account and deletes it afterwards. So it runs
 * against the scratch database — the URL comes from scratchDatabaseUrl(),
 * which resolves to `inhaler_test` and refuses anything else. The deployment's
 * database is not reachable from here by configuration.
 *
 * It is also put back into DATABASE_URL, because the dev API and the dev
 * server it starts have to talk to the same database as the checks do.
 */
process.env.DATABASE_URL = scratchDatabaseUrl();

const busy = [];
if (await inUse(API_PORT)) busy.push(API_PORT);
if (await inUse(WEB_PORT)) busy.push(WEB_PORT);
if (busy.length) {
	// Reusing a server that is already running would mean measuring code that
	// may no longer be the code on disk. A gate that cannot say what it
	// measured is not a gate.
	console.error(
		`❌ 埠 ${busy.join(", ")} 已經有人在用。先把它關掉再跑這道閘門。`,
	);
	process.exit(1);
}

const api = spawn("node", ["scripts/dev-api.mjs"], {
	env: { ...process.env, PORT: String(API_PORT) },
	stdio: ["ignore", "pipe", "pipe"],
});
const web = spawn("bunx", ["vite", "--port", String(WEB_PORT)], {
	env: { ...process.env, VITE_API_PROXY: `http://localhost:${API_PORT}` },
	stdio: ["ignore", "pipe", "pipe"],
});

const logs = { api: [], web: [] };
api.stdout.on("data", (d) => logs.api.push(String(d)));
api.stderr.on("data", (d) => logs.api.push(String(d)));
web.stdout.on("data", (d) => logs.web.push(String(d)));
web.stderr.on("data", (d) => logs.web.push(String(d)));

const stop = () => {
	for (const child of [api, web]) {
		try {
			child.kill("SIGTERM");
		} catch {
			// It is already gone; nothing to stop.
		}
	}
};
process.on("exit", stop);

const up =
	(await waitFor(`http://localhost:${API_PORT}/api/health`, "dev api")) &&
	(await waitFor(`http://localhost:${WEB_PORT}/admin`, "vite"));

if (!up) {
	console.error("--- dev-api ---");
	console.error(logs.api.join(""));
	console.error("--- vite ---");
	console.error(logs.web.join(""));
	stop();
	process.exit(1);
}

const gate = spawnSync("node", ["output/design-review/design-gate.mjs"], {
	stdio: "inherit",
	env: process.env,
});
const code = gate.status ?? 1;

if (code !== 0) {
	console.error("\n--- dev-api ---\n");
	console.error(logs.api.join(""));
	console.error("--- vite ---\n");
	console.error(logs.web.join(""));
}

stop();
process.exit(code);
