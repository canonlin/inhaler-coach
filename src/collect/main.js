import "../style.css";
import { clearDemo, renderDemo, togglePaused } from "./demo.js";
import { LEAD_IN_SECONDS, TASKS } from "./protocol.js";
import { SessionRecorder } from "./recorder.js";
import { saveSession } from "./saver.js";
import { judge, judgeSession, TASK_JUDGE } from "./silent-judge.js";

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
 * The page does not know, and does not need to know, where the recordings go.
 *
 * It carried a shared-folder link for a while — first baked in at build time
 * (which shipped an empty one and stranded every recording), then read from a
 * config file. Both were machinery in service of something the project lead
 * already does anyway: send the pharmacist the folder link when asking them to
 * record. The page just saves the two files; the person who asked for them says
 * where to put them.
 */

const $ = (id) => document.getElementById(id);
const recorder = new SessionRecorder();

// Live detector read-out. The recorder fires onSample every frame; we keep a
// short rolling window and, only while a judgeable task is actually recording,
// show what the current detector concludes. Informational — the pharmacist
// records the task no matter what this says; it just surfaces how the shipped
// model reacts, and the same verdict is saved per task in the metadata.
const JUDGE_WINDOW = 30; // ~1s of samples
let liveBuf = [];

// Route each stream to the task's metric: shake reads the fast, fixed-rate
// motion samples (the ratio is only valid at that rate); press/exhale read the
// inference-rate frames (canister position/steadiness, rate-insensitive).
recorder.onMotion = (s) => feedLive("shake", s);
recorder.onSample = (f) => feedLive("device", f);

function feedLive(stream, sample) {
	const task = TASKS[taskIndex];
	const spec = task && TASK_JUDGE[task.id];
	if (!spec?.metric || sample.label !== task.id) return;
	const wantsMotion = spec.metric === "shake";
	if (wantsMotion !== (stream === "shake")) return;
	liveBuf.push(sample);
	if (liveBuf.length > JUDGE_WINDOW) liveBuf.shift();
	renderLiveJudge(judge(spec.metric, liveBuf));
}

function renderLiveJudge(r) {
	$("live-judge").classList.remove("hidden");
	$("judge-label").textContent = r.ready ? r.label : "偵測中…";
	$("judge-label").className = `text-2xl font-bold tabular-nums ${
		!r.ready ? "text-text-secondary" : r.pass ? "text-success" : "text-danger"
	}`;
	$("judge-detail").textContent = r.detail;
}

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

	// Reset the live read-out; hide it entirely for tasks the detector can't judge
	// (e.g. audio-only spray counting), so it never shows a stale or bogus verdict.
	liveBuf = [];
	$("live-judge").classList.toggle("hidden", !TASK_JUDGE[task.id]?.metric);
	$("judge-label").textContent = "偵測中…";
	$("judge-detail").textContent = "";

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
		// The current detectors scored against each task's ground truth, on this
		// machine and person — in-domain validation the 0519 seed set can't give.
		// Saved, not shown: the collection is about the raw data, this rides along.
		silentJudge: judgeSession(session.signals.frames, session.signals.motion),
	};

	const j = session.metadata.silentJudge;
	const scored = j.filter((x) => x.match != null);
	const hits = scored.filter((x) => x.match).length;
	console.log(
		`[silent-judge] detector matched ground truth on ${hits}/${scored.length} judgeable tasks`,
	);
	console.table(j);

	const files = saveSession(filename, session);
	$("file-names").textContent = files.join("　和　");
	show("screen-done");
}

document.addEventListener("DOMContentLoaded", init);
