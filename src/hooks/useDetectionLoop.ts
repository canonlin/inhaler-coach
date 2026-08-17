import { useCallback, useRef } from "react";
import { drawOverlay } from "../overlay";
import { singletons } from "../services/detection-singletons";

type UseDetectionLoopProps = {
	canvasRef: React.RefObject<HTMLCanvasElement | null>;
	onStatusChange: (
		statusText: string,
		overlay: "none" | "correct" | "wrong",
	) => void;
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
						let poseResult: any = null;
						try {
							if (typeof singletons.detection?.processFrame === "function") {
								poseResult = await singletons.detection.processFrame(
									canvas,
									now,
									{ pose: true, face: true, hands: true } as any,
								);
							}
						} catch {}

						drawOverlay(ctx, poseResult?.pose ?? poseResult);

						if (!isEvaluating && now - loopRef.current.lastFrameTime > 200) {
							loopRef.current.lastFrameTime = now;
							isEvaluating = true;

							try {
								let stepResult: any = { ok: false, msg: "" };

								switch (stageIdx) {
									case 1:
										if (typeof singletons.step1?.detect === "function") {
											const res = singletons.step1.detect(now);
											stepResult = {
												ok: res?.passed ?? false,
												msg: res?.passed ? "動作正確！" : "請持續均勻搖動...",
											};
										}
										break;
									case 2:
										if (typeof singletons.step2?.detect === "function") {
											const res = (singletons.step2 as any).detect({
												device: null,
												mouthPoint: null,
											});
											stepResult = {
												ok: res?.exhaling ?? false,
												msg: res?.exhaling ? "吐氣完全！" : "請深吐氣...",
											};
										}
										break;
									case 3:
										if (typeof singletons.step3?.detect === "function") {
											const res = (singletons.step3 as any).detect({
												device: null,
												mouthPoint: null,
											});
											stepResult = {
												ok: res?.pressing ?? false,
												msg: res?.pressing ? "按壓吸氣正確！" : "請配合按壓...",
											};
										}
										break;
									case 4:
										if (typeof singletons.step4?.detect === "function") {
											const res = singletons.step4.detect();
											stepResult = {
												ok: res?.rinsing ?? false,
												msg: res?.rinsing ? "漱口完成！" : "請進行漱口...",
											};
										}
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
		[canvasRef, onStatusChange],
	);

	return {
		startLoop,
		stopLoop,
	};
}
