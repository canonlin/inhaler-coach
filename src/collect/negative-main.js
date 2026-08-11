import "../style.css";
import { saveSession } from "./saver.js";

export const NEGATIVE_TASK_ID = "negative_no_inhaler";
export const RECORD_SECONDS = 45;
const SAMPLE_INTERVAL_MS = 250;

const $ = (id) => document.getElementById(id);
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let stream = null;
let recording = null;
let filename = "";
let cameraReady = false;

function makeSessionId() {
	if (crypto?.randomUUID) return `neg-${crypto.randomUUID().slice(0, 8)}`;
	return `neg-${Math.random().toString(16).slice(2, 10)}`;
}

function pickMimeType() {
	const candidates = [
		"video/webm;codecs=vp9",
		"video/webm;codecs=vp8",
		"video/webm",
		"video/mp4;codecs=h264",
		"video/mp4",
	];
	return candidates.find((type) => MediaRecorder.isTypeSupported(type)) ?? "";
}

function show(screen) {
	for (const id of [
		"screen-setup",
		"screen-record",
		"screen-review",
		"screen-done",
	]) {
		$(id).classList.toggle("hidden", id !== screen);
	}
}

function updateStartButton() {
	$("btn-start").disabled = !cameraReady || !$("confirm-empty").checked;
}

async function initCamera() {
	try {
		stream = await navigator.mediaDevices.getUserMedia({
			video: {
				facingMode: "user",
				width: { ideal: 1280 },
				height: { ideal: 720 },
				frameRate: { ideal: 30, min: 20 },
			},
			audio: false,
		});
		$("preview").srcObject = stream;
		$("record-preview").srcObject = stream;
		cameraReady = true;
		$("setup-status").textContent = "✅ 攝影機已準備好";
		updateStartButton();
	} catch (error) {
		$("setup-status").textContent = `❌ 無法開啟攝影機：${error.message}`;
	}
}

function cameraSettings() {
	const track = stream?.getVideoTracks()[0];
	if (!track) return null;
	const { width, height, frameRate, deviceId } = track.getSettings();
	return { width, height, frameRate, deviceId, label: track.label };
}

async function record() {
	show("screen-record");
	const mimeType = pickMimeType();
	const chunks = [];
	const frames = [];
	const startedAt = performance.now();
	const recorder = new MediaRecorder(stream, {
		...(mimeType ? { mimeType } : {}),
		videoBitsPerSecond: 2_500_000,
	});
	recorder.ondataavailable = (event) => {
		if (event.data.size) chunks.push(event.data);
	};
	const stopped = new Promise((resolve) => {
		recorder.onstop = resolve;
	});
	recorder.start(1000);

	const sampler = setInterval(() => {
		frames.push({
			t: Math.round(performance.now() - startedAt),
			label: NEGATIVE_TASK_ID,
		});
	}, SAMPLE_INTERVAL_MS);

	for (let remaining = RECORD_SECONDS; remaining > 0; remaining--) {
		$("countdown").textContent = remaining;
		$("progress").style.width =
			`${((RECORD_SECONDS - remaining) / RECORD_SECONDS) * 100}%`;
		await wait(1000);
	}
	clearInterval(sampler);
	recorder.stop();
	await stopped;
	$("progress").style.width = "100%";

	const sessionId = makeSessionId();
	const settings = cameraSettings();
	recording = {
		video: new Blob(chunks, {
			type: recorder.mimeType || mimeType || "video/webm",
		}),
		metadata: {
			schema: 1,
			kind: "quick_negative",
			sessionId,
			recordedAt: new Date().toISOString(),
			confirmedNoInhaler: true,
			userAgent: navigator.userAgent,
			cameraSettings: settings,
			protocol: [{ id: NEGATIVE_TASK_ID, seconds: RECORD_SECONDS }],
		},
		signals: { frames, audio: [], motion: [] },
	};
	const stamp = new Date().toISOString().replace(/[:.]/g, "-");
	filename = `${sessionId}_negative_${stamp}`;
	show("screen-review");
}

function save() {
	if (!recording) return;
	const files = saveSession(filename, recording);
	$("file-names").textContent = files.join("　和　");
	for (const track of stream?.getTracks() ?? []) track.stop();
	show("screen-done");
}

function init() {
	$("confirm-empty").onchange = updateStartButton;
	$("btn-start").onclick = record;
	$("btn-retry").onclick = () => location.reload();
	$("btn-save").onclick = save;
	$("btn-resave").onclick = () => recording && saveSession(filename, recording);
	initCamera();
}

document.addEventListener("DOMContentLoaded", init);
