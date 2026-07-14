import "../style.css";
import { REST_SECONDS, TASKS } from "./protocol.js";
import { SessionRecorder } from "./recorder.js";
import { saveSession } from "./saver.js";

/**
 * Data collection app, deployed separately from the coaching app.
 *
 * It exists because every threshold in the detector so far was fitted to one
 * person's one recording, in one room, shaking one way — and each of them broke
 * as soon as anything changed. Pharmacists recording the same labelled tasks on
 * their own machines is the only thing that turns "it works for him" into
 * something defensible.
 */

/** The shared Drive folder recordings get dropped into. Set at build time. */
const FOLDER_URL = import.meta.env.VITE_DRIVE_FOLDER_URL ?? "";

const $ = (id) => document.getElementById(id);
const recorder = new SessionRecorder();

/**
 * Nobody knows whether they are "P01" or "P07", and asking them to invent an ID
 * invites collisions and typos. The machine can name the session; the person
 * never has to think about it.
 */
const sessionId = crypto.randomUUID().slice(0, 8);

let session = null;
let filename = "";

async function init() {
	$("participant").textContent = sessionId;

	$("btn-begin").onclick = run;
	$("btn-again").onclick = () => location.reload();
	$("btn-resave").onclick = () => session && saveSession(filename, session);

	if (FOLDER_URL) {
		$("btn-folder").href = FOLDER_URL;
	} else {
		$("btn-folder").classList.add("hidden");
	}

	try {
		await recorder.initialize($("preview"));
		$("setup-status").textContent = "✅ 準備好了，可以開始";
		$("btn-begin").disabled = false;
	} catch (e) {
		$("setup-status").textContent = `❌ 無法啟動相機或麥克風：${e.message}`;
	}
}

function show(id) {
	for (const s of ["screen-setup", "screen-record", "screen-done"]) {
		$(s).classList.toggle("hidden", s !== id);
	}
}

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

async function countdown(seconds, onTick) {
	for (let i = seconds; i > 0; i--) {
		onTick(i);
		await wait(1000);
	}
}

async function run() {
	show("screen-record");
	recorder.start();

	const total = TASKS.reduce((a, t) => a + t.seconds + REST_SECONDS, 0);
	let elapsed = 0;

	for (const [index, task] of TASKS.entries()) {
		// Rest first, so the previous task's label doesn't bleed into this one.
		recorder.setLabel(`rest_before_${task.id}`);
		$("task-title").textContent = "準備…";
		$("task-detail").textContent = task.detail;
		await countdown(REST_SECONDS, (n) => {
			$("task-count").textContent = n;
			updateProgress(elapsed + (REST_SECONDS - n), total, index);
		});
		elapsed += REST_SECONDS;

		recorder.setLabel(task.id);
		$("task-title").textContent = task.title;
		await countdown(task.seconds, (n) => {
			$("task-count").textContent = n;
			updateProgress(elapsed + (task.seconds - n), total, index);
		});
		elapsed += task.seconds;
	}

	recorder.setLabel("end");
	session = await recorder.stop();
	finish();
}

function updateProgress(done, total, index) {
	$("progress").style.width = `${(done / total) * 100}%`;
	$("progress-label").textContent = `${index + 1} / ${TASKS.length}`;
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
		protocol: TASKS.map((t) => ({ id: t.id, seconds: t.seconds })),
	};

	const files = saveSession(filename, session);
	$("file-names").textContent = files.join("　和　");
	show("screen-done");
}

document.addEventListener("DOMContentLoaded", init);
