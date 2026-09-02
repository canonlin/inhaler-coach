import { useCallback, useRef } from "react";
import { startWebcam, stopWebcam } from "../core/webcam";
import { singletons } from "../services/detection-singletons";

export function useWebcamStream() {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const requestIdRef = useRef(0);

	const stopTracks = useCallback(() => {
		requestIdRef.current += 1;
		stopWebcam();
		singletons.audio.destroy();
	}, []);

	const startStream = useCallback(async () => {
		const requestId = ++requestIdRef.current;
		const isCurrentRequest = () => requestId === requestIdRef.current;
		try {
			const res = await startWebcam({ shouldContinue: isCurrentRequest });
			if (!isCurrentRequest()) {
				res?.stream.getTracks().forEach((track) => {
					track.stop();
				});
				return false;
			}
			if (res?.stream) {
				if (res.stream.getAudioTracks().length > 0) {
					try {
						await singletons.audio.initialize(res.stream);
						singletons.audio.startSampling(
							(sound: object, timestamp: number) => {
								const det = singletons.actuationDet as unknown as {
									update: (sound: object, timestamp: number) => void;
								};
								det?.update?.(sound, timestamp);
							},
						);
					} catch (audioError) {
						console.warn(
							"Audio feature setup failed; continuing with vision",
							audioError,
						);
					}
				}
				return true;
			}
		} catch (err) {
			if (isCurrentRequest()) console.error("Failed to start webcam:", err);
		}
		return false;
	}, []);

	return {
		canvasRef,
		startStream,
		stopTracks,
	};
}
