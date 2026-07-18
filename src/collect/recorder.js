import { AudioFeatures } from "../detection/audio-features.js";
import { DetectionManager } from "../detection/detection-manager.js";
import { DeviceTracker } from "../detection/device-tracker.js";
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

/** How long a hand box stays usable after the hand model loses the hand. */
const ROI_GRACE_MS = 600;

/** Shake-motion sample interval, ~28 fps — the rate the shake ratio threshold
 * was calibrated at (matches the coaching app's SHAKE_SAMPLE_MS). */
const SHAKE_SAMPLE_MS = 35;

/**
 * Preference order for the recording container. VP9 first for quality per bit,
 * then VP8, then whatever WebM the browser has, then MP4 for Safari — which
 * supports no WebM at all and would otherwise throw NotSupportedError out of the
 * MediaRecorder constructor, leaving the pharmacist with a dead page.
 */
const MIME_CANDIDATES = [
	"video/webm;codecs=vp9,opus",
	"video/webm;codecs=vp8,opus",
	"video/webm",
	"video/mp4;codecs=h264,aac",
	"video/mp4",
];

function pickMimeType() {
	if (typeof MediaRecorder?.isTypeSupported !== "function") return "";
	return (
		MIME_CANDIDATES.find((type) => MediaRecorder.isTypeSupported(type)) ?? ""
	);
}

export class SessionRecorder {
	constructor() {
		this.detection = new DetectionManager();
		this.motionEnergy = new MotionEnergy();
		// A SECOND motion accumulator for the fast, decoupled shake-motion loop.
		// Its own instance so its frame-to-frame history isn't interleaved with the
		// slow inference-rate sampling above (each sample differences against the
		// previous one it saw — mixing two rates corrupts both).
		this.shakeMotion = new MotionEnergy();
		this.deviceTracker = new DeviceTracker();
		this.audio = new AudioFeatures();

		this.stream = null;
		this.video = null;
		this.canvas = null;
		this.mediaRecorder = null;
		this.chunks = [];

		this.frames = [];
		this.audioSamples = [];
		// High-rate shake motion, sampled on its own clock (see fastMotionLoop).
		// Separate from `frames` because the shake ratio is only meaningful at a
		// high, fixed sample rate — the inference loop runs at a few fps on weak
		// hardware, and at that rate a slow move is indistinguishable from a shake
		// (measured: the old JSON couldn't tell "move" from "shake" at all).
		this.motionSamples = [];
		this.label = "idle";
		this.running = false;
		this.startedAt = 0;
		this.lastROI = null;
		this.lastROIAt = 0;
		this.lastMotionAt = 0;
		// onSample: every inference-rate frame (canister/steadiness — rate-
		// insensitive). onMotion: every fast shake-motion sample. The UI uses each
		// for the live read-out without the recorder knowing about detectors.
		this.onSample = null;
		this.onMotion = null;
	}

	async initialize(canvas) {
		this.canvas = canvas;

		// Record at the highest fidelity the camera will give, not at the
		// resolution the live detector happens to want.
		//
		// Everything is re-derived from this file later, so whatever the recording
		// throws away is gone for good. At 640x480 a small wrist-only shake did not
		// appear in the motion signal at all (2.5, against 2.3 for a motionless
		// hand) — and it is not established whether the motion was too small or
		// simply below the resolution. That question can only be answered if the
		// pixels were kept.
		//
		// The detection loop still runs at 640x480 off a downscaled canvas; this is
		// only about what gets written to disk.
		this.stream = await navigator.mediaDevices.getUserMedia({
			video: {
				facingMode: "user",
				width: { ideal: 1280 },
				height: { ideal: 720 },
				frameRate: { ideal: 30, min: 24 },
			},
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

		// 16:9, matching the camera — squeezing a 1280x720 frame into a 4:3 canvas
		// would distort every landmark and every motion measurement.
		canvas.width = 640;
		canvas.height = 360;

		await this.detection.initialize();
		await this.audio.initialize(this.stream);
	}

	get backendName() {
		return this.detection.getBackendName();
	}

	/** What the camera actually granted, not what was requested. */
	get cameraSettings() {
		const track = this.stream?.getVideoTracks()[0];
		if (!track) return null;
		const { width, height, frameRate, deviceId } = track.getSettings();
		return { width, height, frameRate, deviceId, label: track.label };
	}

	start() {
		this.frames = [];
		this.audioSamples = [];
		this.motionSamples = [];
		this.chunks = [];
		this.running = true;
		this.startedAt = performance.now();

		this.mimeType = pickMimeType();
		this.mediaRecorder = new MediaRecorder(this.stream, {
			// Omitting mimeType entirely (rather than forcing webm) is the last
			// resort: on a browser without WebM the constructor throws
			// NotSupportedError, and the pharmacist gets a dead page instead of a
			// recording.
			...(this.mimeType ? { mimeType: this.mimeType } : {}),
			// Generous, deliberately. Video compression works by discarding small
			// changes between frames — which is precisely the signal here. A gentle
			// wrist shake is exactly the kind of motion a low bitrate would smooth
			// away, and it cannot be recovered afterwards. ~5 minutes lands around
			// 150MB, which is a file to drag once, not a constraint worth optimising.
			videoBitsPerSecond: 4_000_000,
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
		this.fastMotionLoop();
	}

	/**
	 * Shake motion on its own fixed ~28 fps clock, decoupled from the inference
	 * loop, mirroring the coaching app's shakeMotionLoop. The shake ratio is only
	 * valid at this rate; sampling it inside the (slow, variable) inference loop is
	 * exactly what made the earlier recordings unable to separate a shake from a
	 * plain move. Samples the live video directly — not this.canvas, which the
	 * inference loop only refreshes at its own slow rate — reusing the last hand
	 * box, and logs a dense motion series alongside the rich inference frames.
	 */
	fastMotionLoop() {
		if (!this.running) return;
		requestAnimationFrame(() => this.fastMotionLoop());

		const now = performance.now();
		if (now - this.lastMotionAt < SHAKE_SAMPLE_MS) return;
		this.lastMotionAt = now;
		if (!this.video || this.video.readyState < 2) return;

		const roi =
			this.lastROI && now - this.lastROIAt < ROI_GRACE_MS ? this.lastROI : null;
		const motion = this.shakeMotion.sample(this.video, roi);
		const sample = {
			t: Math.round(now - this.startedAt),
			label: this.label,
			// Same field names as the inference frames, so the judge reads either.
			motionHand: +motion.hand.toFixed(2),
			motionBg: +motion.background.toFixed(2),
		};
		this.motionSamples.push(sample);
		this.onMotion?.(sample);
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

			// Sample every frame, even without a hand: the sampler needs the previous
			// frame to difference against, and skipping the call throws that away.
			const roi = this.resolveROI(results.hands, now);
			const motion = this.motionEnergy.sample(this.canvas, roi);

			// Track the inhaler itself by colour (the red canister). Sample the clean
			// downscaled frame BEFORE any overlay — recorder.js draws no landmarks on
			// the canvas, so this.canvas is the raw camera image. Position-agnostic on
			// purpose: it serves both the into-air priming sprays and the at-mouth
			// actuation; the step decides which from context. See device-tracker.js.
			const device = this.deviceTracker.sample(this.canvas, roi, now);

			const pose = extractPoseFeatures(results.pose);

			const frame = {
				t: Math.round(now - this.startedAt),
				label: this.label,
				handSeen: !!results.hands,
				// Whether a box was available at all, including a briefly reused one.
				// Distinguishes "the model blinked" from "there is no hand here",
				// which the earlier data could not tell apart.
				roi: !!roi,
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
				// Inhaler (red canister) track. `dev` is present/where; `dip` is the
				// press-candidate signal (canister pushed down), only trustworthy while
				// `steady` is high — the threshold for "a press" still needs steady-hold
				// clips to set, so this is recorded raw, not thresholded.
				dev: device.present
					? [
							+device.center.x.toFixed(4),
							+device.center.y.toFixed(4),
							+device.area.toFixed(4),
							+device.height.toFixed(4),
						]
					: null,
				dip: +device.dip.toFixed(4),
				steady: +device.steadiness.toFixed(3),
			};
			this.frames.push(frame);
			this.onSample?.(frame);
		} catch (e) {
			console.error("Detection error:", e);
		}

		requestAnimationFrame(() => this.loop());
	}

	/**
	 * The hand box, reused briefly when the hand model blinks.
	 *
	 * It blinks constantly, and worst when the hand is moving fastest — measured
	 * over a full collection run, it saw the hand in 13% of frames during a normal
	 * shake. Without this, the motion signal is absent for exactly the movements
	 * the recording exists to capture. A shaking hand doesn't travel far, so a
	 * slightly stale box still frames it.
	 */
	resolveROI(hands, timestamp) {
		const roi = handROI(hands);
		if (roi) {
			this.lastROI = roi;
			this.lastROIAt = timestamp;
			return roi;
		}
		if (this.lastROI && timestamp - this.lastROIAt < ROI_GRACE_MS) {
			return this.lastROI;
		}
		this.lastROI = null;
		return null;
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

		// Label the blob with what was actually recorded, not with what we hoped
		// for — a Safari MP4 saved as .webm is a file nothing will open.
		const type = this.mediaRecorder.mimeType || this.mimeType || "video/webm";
		const video = await new Promise((resolve) => {
			this.mediaRecorder.onstop = () =>
				resolve(new Blob(this.chunks, { type }));
			this.mediaRecorder.stop();
		});

		for (const track of this.stream.getTracks()) track.stop();

		return {
			video,
			metadata: null, // filled in by the caller once the session is over
			signals: {
				frames: this.frames,
				audio: this.audioSamples,
				// Dense, fixed-rate shake motion — the channel the earlier JSONs
				// lacked, which left the shake signal recoverable only from the webm.
				motion: this.motionSamples,
			},
		};
	}
}
