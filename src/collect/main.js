import "../style.css";
import { clearDemo, renderDemo, togglePaused } from "./demo.js";
import { LEAD_IN_SECONDS, TASKS } from "./protocol.js";
import { SessionRecorder } from "./recorder.js";
import { saveSession } from "./saver.js";

/**
 * Data collection app, deployed separately from the coaching app.
 *
 * It exists because every threshold in the detector so far was fitted to one
 * person's one recording, in one room, shaking one way — and each of them broke
 * as soon as anything changed. Pharmacists recording the same labelled tasks on
 * their own machines is what turns "it works for him" into something defensible.
 *
 * Each task is briefed with an animation before it is recorded, and nothing
 * starts until the person says they're ready. The first version simply counted
 * down through the tasks; the pharmacist who tested it couldn't tell what half
 * of them were asking for, which would have produced ten recordings of ten
 * different guesses — worse than no data, because it would look like data.
 */

/**
 * Where the recordings are meant to end up.
 *
 * Read at RUNTIME from config.json, not baked in at build time. Build-time
 * injection had already broken the deployed collector: with the variable unset,
 * the bundler inlined an empty string, eliminated the branch that shows the
 * link, and shipped a page that never told the pharmacist where to put the
 * files. It also meant changing the folder required a rebuild by someone who can
 * run a build. Now the project lead edits collector/config.json on GitHub.
 */
async function loadFolderUrl() {
	try {
		const response = await fetch("./config.json", { cache: "no-store" });
		if (!response.ok) return "";
		const config = await response.json();
		return config.driveFolderUrl ?? "";
	} catch {
		return "";
	}
}

const $ = (id) => document.getElementById(id);
const recorder = new SessionRecorder();

/**
 * Nobody knows whether they are "P01" or "P07", and asking them to invent an ID
 * invites collisions and typos. The machine names the session.
 */
const sessionId = makeSessionId();

/** randomUUID needs a secure context and a recent browser; neither is worth a
 * blank page, since the id only has to be unlikely to collide. */
function makeSessionId() {
	if (crypto?.randomUUID) return crypto.randomUUID().slice(0, 8);
	if (crypto?.getRandomValues) {
		const bytes = crypto.getRandomValues(new Uint8Array(4));
		return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
	}
	return Math.random().toString(16).slice(2, 10);
}

let session = null;
let filename = "";
let taskIndex = 0;

async function init() {
	$("participant").textContent = sessionId;

	$("btn-begin").onclick = begin;
	$("btn-ready").onclick = recordCurrentTask;
	$("btn-next").onclick = nextTask;
	$("btn-redo").onclick = redoTask;
	$("btn-again").onclick = () => location.reload();
	$("btn-resave").onclick = () => session && saveSession(filename, session);

	$("btn-pause-demo").onclick = () => {
		const paused = togglePaused($("demo"));
		$("btn-pause-demo").textContent = paused
			? "▶ 繼續播放示範"
			: "⏸ 暫停示範動畫";
	};

	const folderUrl = await loadFolderUrl();
	if (folderUrl) {
		$("btn-folder").href = folderUrl;
	} else {
		// Never silently hide the one instruction that tells them what to do with
		// the files they just recorded.
		$("btn-folder").removeAttribute("href");
		$("btn-folder").textContent =
			"⚠️ 尚未設定共用資料夾 — 請把下載的檔案交給研究負責人";
		$("btn-folder").classList.add("cursor-not-allowed", "opacity-70");
	}

	try {
		await recorder.initialize($("preview"));
		$("setup-status").textContent = "✅ 準備好了";
		$("btn-begin").disabled = false;
	} catch (e) {
		$("setup-status").textContent = `❌ 無法啟動相機或麥克風：${e.message}`;
	}
}

function show(id) {
	for (const s of [
		"screen-setup",
		"screen-brief",
		"screen-record",
		"screen-review",
		"screen-done",
	]) {
		$(s).classList.toggle("hidden", s !== id);
	}
}

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

function begin() {
	recorder.start();
	taskIndex = 0;
	brief();
}

/** Show the demonstration and wait — no timer runs here. */
function brief() {
	const task = TASKS[taskIndex];
	recorder.setLabel(`brief_${task.id}`);

	$("brief-step").textContent = `第 ${taskIndex + 1} 項 / 共 ${TASKS.length}`;
	$("brief-seconds").textContent = `這一項要錄 ${task.seconds} 秒`;
	$("brief-title").textContent = task.title;
	$("brief-detail").textContent = task.detail;
	$("brief-why").textContent = task.why;
	renderDemo($("demo"), task.demo);

	show("screen-brief");
}

async function recordCurrentTask() {
	const task = TASKS[taskIndex];
	show("screen-record");

	$("task-title").textContent = task.title;
	$("task-detail").textContent = task.detail;
	// Keep the demo running beside the camera, so they can copy it while doing it.
	renderDemo($("demo-live"), task.demo);
	updateProgress();

	// Lead-in, so the recording doesn't start while they're still getting set.
	recorder.setLabel(`leadin_${task.id}`);
	for (let i = LEAD_IN_SECONDS; i > 0; i--) {
		$("task-count").textContent = i;
		$("task-count").className =
			"text-6xl font-black tabular-nums text-text-secondary";
		await wait(1000);
	}

	recorder.setLabel(task.id);
	$("task-count").className = "text-6xl font-black tabular-nums text-success";
	for (let i = task.seconds; i > 0; i--) {
		$("task-count").textContent = i;
		await wait(1000);
	}

	recorder.setLabel(`after_${task.id}`);
	clearDemo($("demo-live"));

	$("btn-next").textContent =
		taskIndex === TASKS.length - 1 ? "完成，產生檔案" : "下一項 →";
	show("screen-review");
}

function redoTask() {
	recorder.discardAttempt(TASKS[taskIndex].id);
	recordCurrentTask();
}

async function nextTask() {
	taskIndex++;
	if (taskIndex < TASKS.length) {
		brief();
		return;
	}

	recorder.setLabel("end");
	session = await recorder.stop();
	finish();
}

function updateProgress() {
	$("progress").style.width = `${(taskIndex / TASKS.length) * 100}%`;
	$("progress-label").textContent = `${taskIndex + 1} / ${TASKS.length}`;
}

function finish() {
	const stamp = new Date().toISOString().replace(/[:.]/g, "-");
	filename = `${sessionId}_${stamp}`;

	session.metadata = {
		sessionId,
		recordedAt: new Date().toISOString(),
		backend: recorder.backendName,
		userAgent: navigator.userAgent,
		// Lighting and camera distance moved the motion scale by 3× between two
		// recordings of the same person doing the same thing. Whatever varies per
		// machine has to travel with the data, or the same trap is waiting.
		videoWidth: recorder.video.videoWidth,
		videoHeight: recorder.video.videoHeight,
		// What the camera actually granted, which is not necessarily what was
		// asked for — laptops differ, and a session recorded at 15fps or 480p has
		// to be recognisable as such when the analysis disagrees with the others.
		cameraSettings: recorder.cameraSettings,
		protocol: TASKS.map((t) => ({ id: t.id, seconds: t.seconds })),
	};

	const files = saveSession(filename, session);
	$("file-names").textContent = files.join("　和　");
	show("screen-done");
}

document.addEventListener("DOMContentLoaded", init);
