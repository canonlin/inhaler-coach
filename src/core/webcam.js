import { state } from "./state.js";

export function stopWebcam() {
	state.isRunning = false;
	if (state.stream) {
		state.stream.getTracks().forEach((t) => {
			t.stop();
		});
		state.stream = null;
	}
	if (state.webcamVideo) {
		state.webcamVideo.srcObject = null;
		state.webcamVideo = null;
	}
	if (state.holdInterval) {
		clearInterval(state.holdInterval);
		state.holdInterval = null;
	}
}

/**
 * @param {{shouldContinue?: () => boolean}} options
 */
export async function startWebcam({ shouldContinue = () => true } = {}) {
	console.log("[webcam] startWebcam called");
	const video = document.createElement("video");
	video.setAttribute("playsinline", "");
	video.setAttribute("autoplay", "");
	video.muted = true;

	const videoConstraints = { facingMode: "user", width: 480, height: 360 };
	let stream;
	try {
		stream = await navigator.mediaDevices.getUserMedia({
			video: videoConstraints,
			// Audio carries the events vision can't see: the actuation spray, and
			// exhalation. Disable the browser's cleanup — echo cancellation and noise
			// suppression are tuned to preserve speech and will happily filter out a
			// broadband hiss, which is exactly the signal we're after.
			audio: {
				echoCancellation: false,
				noiseSuppression: false,
				autoGainControl: false,
			},
		});
	} catch (audioOrCameraError) {
		if (!shouldContinue()) throw audioOrCameraError;
		// Audio is useful telemetry but is not a gate in the current coaching
		// flow. A missing or separately denied microphone must not make the
		// camera-based lesson unusable.
		console.warn(
			"[webcam] audio+video request failed; trying video only:",
			audioOrCameraError,
		);
		stream = await navigator.mediaDevices.getUserMedia({
			video: videoConstraints,
			audio: false,
		});
	}
	try {
		if (!shouldContinue()) {
			stream.getTracks().forEach((track) => {
				track.stop();
			});
			return null;
		}
		console.log(
			"[webcam] stream acquired:",
			stream
				.getTracks()
				.map((track) => track.kind)
				.join(", "),
		);
		video.srcObject = stream;
		await video.play();
		if (!shouldContinue()) {
			stream.getTracks().forEach((track) => {
				track.stop();
			});
			video.srcObject = null;
			return null;
		}
		console.log(
			"[webcam] video.play() resolved, readyState:",
			video.readyState,
		);

		const canvas = document.getElementById("webcam-canvas");
		if (!canvas) {
			throw new Error("canvas#webcam-canvas not found in DOM");
		}
		console.log("[webcam] canvas found:", canvas.width, "x", canvas.height);
		canvas.width = 480;
		canvas.height = 360;
		// The detection backends read this canvas back every frame.
		const ctx = canvas.getContext("2d", { willReadFrequently: true });
		if (!ctx) throw new Error("2D canvas context is unavailable");
		ctx.drawImage(video, 0, 0, 480, 360);

		state.stream = stream;
		state.webcamVideo = video;
		state.webcamCanvas = canvas;
		state.isRunning = true;
		console.log("[webcam] state.webcamVideo set:", !!state.webcamVideo);

		return { video, canvas, stream };
	} catch (error) {
		stream.getTracks().forEach((track) => {
			track.stop();
		});
		video.srcObject = null;
		throw error;
	}
}
