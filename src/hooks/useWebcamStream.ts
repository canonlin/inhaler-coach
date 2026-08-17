import { useCallback, useRef } from "react";
import { startWebcam, stopWebcam } from "../core/webcam";
import { singletons } from "../services/detection-singletons";

export function useWebcamStream() {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);

	const stopTracks = useCallback(() => {
		stopWebcam();
		singletons.audio.stopSampling();
	}, []);

	const startStream = useCallback(async () => {
		try {
			const res = await startWebcam();
			if (res?.stream) {
				singletons.audio.initialize(res.stream);
				singletons.audio.startSampling();
				return true;
			}
		} catch (err) {
			console.error("Failed to start webcam:", err);
		}
		return false;
	}, []);

	return {
		canvasRef,
		startStream,
		stopTracks,
	};
}
