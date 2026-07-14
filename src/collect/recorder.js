import { AudioFeatures } from "../detection/audio-features.js";
import { DetectionManager } from "../detection/detection-manager.js";
import { handROI, MotionEnergy } from "../detection/motion-energy.js";
import { extractPoseFeatures } from "../detection/pose-features.js";

/**
 * Records one session: raw video+audio, plus the derived signals, plus the
 * label of whatever task is running at each moment.
 *
 * Raw media is kept deliberately. Feature extraction has already been rewritten
 * three times in a single day — landmark oscillation, then energy thresholds,
 * then periodicity — and each rewrite invalidated every signal recorded under
 * the previous one. With the video kept, a new idea can be tried against
 * everything already collected instead of asking ten pharmacists to come back.
 */

/** Audio must be sampled far faster than the render loop: an actuation lasts
 * 60–110 ms, which the ~27 fps video loop samples two or three times. */
const AUDIO_INTERVAL_MS = 10;

export class SessionRecorder {
	constructor() {
		this.detection = new DetectionManager();
		this.motionEnergy = new MotionEnergy();
		this.audio = new AudioFeatures();

		this.stream = null;
		this.video = null;
		this.canvas = null;
		this.mediaRecorder = null;
		this.chunks = [];

		this.frames = [];
		this.audioSamples = [];
		this.label = "idle";
		this.running = false;
		this.startedAt = 0;
	}

	async initialize(canvas) {
		this.canvas = canvas;

		this.stream = await navigator.mediaDevices.getUserMedia({
			video: { facingMode: "user", width: 640, height: 480 },
			// The browser's cleanup is tuned to preserve speech and will filter out
			// a broadband hiss — which is exactly the actuation we need to hear.
			audio: {
				echoCancellation: false,
				noiseSuppression: false,
				autoGainControl: false,
			},
		});

		this.video = document.createElement("video");
		this.video.setAttribute("playsinline", "");
		this.video.muted = true;
		this.video.srcObject = this.stream;
		await this.video.play();

		canvas.width = 640;
		canvas.height = 480;

		await this.detection.initialize();
		await this.audio.initialize(this.stream);
	}

	get backendName() {
		return this.detection.getBackendName();
	}

	start() {
		this.frames = [];
		this.audioSamples = [];
		this.chunks = [];
		this.running = true;
		this.startedAt = performance.now();

		this.mediaRecorder = new MediaRecorder(this.stream, {
			mimeType: MediaRecorder.isTypeSupported("video/webm;codecs=vp9,opus")
				? "video/webm;codecs=vp9,opus"
				: "video/webm",
			videoBitsPerSecond: 1_200_000,
		});
		this.mediaRecorder.ondataavailable = (e) => {
			if (e.data.size > 0) this.chunks.push(e.data);
		};
		this.mediaRecorder.start(1000);

		this.audio.startSampling((sound, timestamp) => {
			this.audioSamples.push({
				t: Math.round(timestamp - this.startedAt),
				label: this.label,
				hi: +sound.highBand.toExponential(3),
				br: +sound.breathBand.toExponential(3),
				flat: +sound.flatness.toFixed(4),
				rms: +sound.rms.toExponential(3),
			});
		}, AUDIO_INTERVAL_MS);

		this.loop();
	}

	async loop() {
		if (!this.running) return;

		const ctx = this.canvas.getContext("2d", { willReadFrequently: true });
		if (this.video.readyState >= 2) {
			ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);
		}

		const now = performance.now();
		try {
			const results = await this.detection.processFrame(this.canvas, now, {
				pose: true,
				face: false,
				hands: true,
			});
			if (!this.running) return;

			const roi = handROI(results.hands);
			const motion = roi
				? this.motionEnergy.sample(this.canvas, roi)
				: { hand: 0, background: 0, ratio: 0 };
			if (!roi) this.motionEnergy.reset();

			const pose = extractPoseFeatures(results.pose);

			this.frames.push({
				t: Math.round(now - this.startedAt),
				label: this.label,
				handSeen: !!results.hands,
				// Full hand landmarks: cheap, and lets any future feature be derived
				// without re-recording.
				hand: results.hands?.map((p) => [
					+p.x.toFixed(4),
					+p.y.toFixed(4),
					+p.z.toFixed(4),
				]),
				wrist: pose
					? [
							+pose.dominantWrist.x.toFixed(4),
							+pose.dominantWrist.y.toFixed(4),
							+(pose.dominantWrist.score ?? 0).toFixed(3),
						]
					: null,
				motionHand: +motion.hand.toFixed(2),
				motionBg: +motion.background.toFixed(2),
			});
		} catch (e) {
			console.error("Detection error:", e);
		}

		requestAnimationFrame(() => this.loop());
	}

	setLabel(label) {
		this.label = label;
	}

	/**
	 * Mark a task's frames as a discarded attempt rather than deleting them.
	 *
	 * The video is one continuous recording, so the botched attempt is in it
	 * regardless — cutting the signals out would only make the two disagree.
	 * Relabelling keeps them aligned, and a discarded attempt is itself worth
	 * having: it's a recording of someone doing the task wrong, which is data.
	 */
	discardAttempt(taskId) {
		let attempt = 1;
		while (
			this.frames.some((f) => f.label === `discarded${attempt}_${taskId}`)
		) {
			attempt++;
		}
		const discarded = `discarded${attempt}_${taskId}`;
		for (const f of this.frames) {
			if (f.label === taskId) f.label = discarded;
		}
		for (const a of this.audioSamples) {
			if (a.label === taskId) a.label = discarded;
		}
	}

	/** @returns {Promise<{video: Blob, signals: object}>} */
	async stop() {
		this.running = false;
		this.audio.stopSampling();

		const video = await new Promise((resolve) => {
			this.mediaRecorder.onstop = () =>
				resolve(new Blob(this.chunks, { type: "video/webm" }));
			this.mediaRecorder.stop();
		});

		for (const track of this.stream.getTracks()) track.stop();

		return {
			video,
			metadata: null, // filled in by the caller once the session is over
			signals: {
				frames: this.frames,
				audio: this.audioSamples,
			},
		};
	}
}
