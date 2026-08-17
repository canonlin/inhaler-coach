import { useRef, useCallback } from "react";
import { drawOverlay } from "../overlay";
import { singletons } from "../services/detection-singletons";

type UseDetectionLoopProps = {
	canvasRef: React.RefObject<HTMLCanvasElement | null>;
	onStatusChange: (statusText: string, overlay: "none" | "correct" | "wrong") => void;
};

export function useDetectionLoop({
	canvasRef,
	onStatusChange,
}: UseDetectionLoopProps) {
	const loopRef = useRef({
		running: false,
		lastFrameTime: 0,
	});

	const stopLoop = useCallback(() => {
		loopRef.current.running = false;
	}, []);

	const startLoop = useCallback(
		(stageIdx: number, onPassStage: () => void) => {
			loopRef.current.running = true;

			let isEvaluating = false;

			async function frame(now: number) {
				if (!loopRef.current.running) return;

				const canvas = canvasRef.current;
				if (canvas) {
					const ctx = canvas.getContext("2d");
					if (ctx) {
						// Perform ML detection frame
						const poseResult = singletons.detection.detect(canvas);
						drawOverlay(ctx, poseResult);

						// Evaluate stage logic periodically
						if (!isEvaluating && now - loopRef.current.lastFrameTime > 200) {
							loopRef.current.lastFrameTime = now;
							isEvaluating = true;

							try {
								let stepResult = { ok: false, msg: "" };

								switch (stageIdx) {
									case 1:
										stepResult = singletons.step1.evaluate(poseResult);
										break;
									case 2:
										stepResult = singletons.step2.evaluate(poseResult);
										break;
									case 3:
										stepResult = singletons.step3.evaluate(poseResult);
										break;
									case 4:
										stepResult = singletons.step4.evaluate(poseResult);
										break;
									default:
										stepResult = { ok: true, msg: "檢測完成" };
								}

								if (stepResult.ok) {
									onStatusChange(stepResult.msg || "動作正確！", "correct");
									onPassStage();
								} else if (stepResult.msg) {
									onStatusChange(stepResult.msg, "wrong");
								} else {
									onStatusChange("請配合提示進行動作...", "none");
								}
							} catch (e) {
								console.error("Evaluation error:", e);
							} finally {
								isEvaluating = false;
							}
						}
					}
				}

				if (loopRef.current.running) {
					requestAnimationFrame(frame);
				}
			}

			requestAnimationFrame(frame);
		},
		[canvasRef, onStatusChange]
	);

	return {
		startLoop,
		stopLoop,
	};
}
