import { useCallback, useRef } from "react";
import { state } from "../core/state";
import { handROI } from "../detection/motion-energy";
import { drawOverlay } from "../overlay";
import { singletons } from "../services/detection-singletons";

type UseDetectionLoopProps = {
	canvasRef: React.RefObject<HTMLCanvasElement | null>;
	onStatusChange: (
		statusText: string,
		overlay: "none" | "correct" | "wrong",
	) => void;
};

type FrameNeeds = {
	pose: boolean;
	face: boolean;
	hands: boolean;
};

type StepEvalResult = {
	ok: boolean;
	msg: string;
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
			let frameCount = 0;
			let passed = false;

			console.log("=== Detection loop started ===");
			console.log("DetectionManager initialized:", singletons.detection?.isInitialized);
			console.log("DetectionManager backend:", singletons.detection?.activeBackend);
			console.log("webcamVideo available:", !!state.webcamVideo);
			console.log("Canvas ref available:", !!canvasRef.current);

			async function frame(now: number) {
				if (!loopRef.current.running || passed) return;

				const canvas = canvasRef.current;
				if (canvas) {
					const ctx = canvas.getContext("2d");
					if (ctx) {
						if (state.webcamVideo) {
							ctx.drawImage(
								state.webcamVideo,
								0,
								0,
								canvas.width,
								canvas.height,
							);
						}

						let poseResult: unknown = null;
						try {
							if (typeof singletons.detection?.processFrame === "function") {
								const needs: FrameNeeds = {
									pose: true,
									face: true,
									hands: true,
								};
								poseResult = await singletons.detection.processFrame(
									canvas,
									now,
									needs,
								);
							}
						} catch {}

						const poseData =
							poseResult &&
							typeof poseResult === "object" &&
							"pose" in poseResult
								? (poseResult as { pose: unknown }).pose
								: poseResult;
						drawOverlay(ctx, poseData as Parameters<typeof drawOverlay>[1]);

						const pr = poseResult as {
							pose?: unknown[];
							face?: unknown[];
							hands?: { x: number; y: number; z: number }[][];
						} | null;
						const hands = pr?.hands;
						const hand = hands?.[0] ?? null;
						const roi = handROI(hand);

						const motion = singletons.motionEnergy.sample(canvas, roi);

						frameCount++;
						if (frameCount % 30 === 0) {
							console.log("--- Frame", frameCount, "---");
							console.log("  pose:", pr?.pose ? `${pr.pose.length} lm` : "null");
							console.log("  face:", pr?.face ? `${pr.face.length} lm` : "null");
							console.log("  hands:", hand ? `${hand.length} pts` : "null");
							console.log("  handROI:", roi ? `x:${roi.x.toFixed(2)} y:${roi.y.toFixed(2)} w:${roi.w.toFixed(2)} h:${roi.h.toFixed(2)}` : "null");
							console.log("  motion:", `hand:${motion.hand.toFixed(2)} bg:${motion.background.toFixed(2)} ratio:${motion.ratio.toFixed(2)}`);
						}

						if (stageIdx === 1) {
							singletons.step1.update(motion, now);
						}

						if (!isEvaluating && now - loopRef.current.lastFrameTime > 200) {
							loopRef.current.lastFrameTime = now;
							isEvaluating = true;

							try {
								let stepResult: StepEvalResult = { ok: false, msg: "" };

								switch (stageIdx) {
									case 1: {
										const res = singletons.step1.detect(now);
										const ratio = res?.ratio ?? 0;
										const held = res?.secondsHeld ?? 0;
										const required = res?.requiredSeconds ?? 5;
										stepResult = {
											ok: res?.passed ?? false,
											msg: res?.passed
												? `動作正確！已搖動 ${held.toFixed(1)} 秒`
												: ratio > 0
													? `搖動偵測中... ratio:${ratio.toFixed(1)} (${held.toFixed(1)}/${required} 秒)`
													: "請拿起吸入器上下搖動...",
										};
										if (frameCount % 30 === 0) {
											console.log("  step1:", `ratio:${ratio.toFixed(1)} shaking:${res?.shaking} held:${held.toFixed(1)}s passed:${res?.passed}`);
										}
										break;
									}
									case 2:
										if (typeof singletons.step2?.detect === "function") {
											const step = singletons.step2 as unknown as {
												detect: (arg: {
													device: unknown;
													mouthPoint: unknown;
												}) => {
													exhaling?: boolean;
												};
											};
											const res = step.detect({
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
											const step = singletons.step3 as unknown as {
												detect: (arg: {
													device: unknown;
													mouthPoint: unknown;
												}) => {
													pressing?: boolean;
												};
											};
											const res = step.detect({
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
									passed = true;
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
