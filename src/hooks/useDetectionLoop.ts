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

						// Use inhaler ONNX detection as ROI for motion energy when hand not detected
						// This measures motion specifically where the inhaler is
						let motionRoi = roi;
						if (!motionRoi && stageIdx === 1) {
							const canvas = canvasRef.current;
							if (canvas) {
								const inhaler = await singletons.inhalerDetector.detect(canvas, canvas.width, canvas.height, 0.35);
								if (inhaler?.present && inhaler.box) {
									motionRoi = {
										x: inhaler.box.x,
										y: inhaler.box.y,
										w: inhaler.box.w,
										h: inhaler.box.h,
									};
								}
								if (frameCount % 30 === 0) {
									console.log("  inhaler:", `present:${inhaler?.present} score:${inhaler?.score} box:${inhaler?.box ? `x:${inhaler.box.x.toFixed(2)} y:${inhaler.box.y.toFixed(2)} w:${inhaler.box.w.toFixed(2)} h:${inhaler.box.h.toFixed(2)}` : "null"}`);
								}
							}
						}

						const motion = singletons.motionEnergy.sample(canvas, motionRoi);

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

						// Extract mouth point from face landmarks (MediaPipe face mesh)
						// Landmarks 13 (top lip) and 14 (bottom lip) center
						const face = pr?.face;
						let mouthPoint: { x: number; y: number } | null = null;
						if (face && face.length >= 15) {
							const topLip = face[13];
							const bottomLip = face[14];
							if (topLip && bottomLip) {
								mouthPoint = {
									x: (topLip.x + bottomLip.x) / 2,
									y: (topLip.y + bottomLip.y) / 2,
								};
							}
						}

						// Detect inhaler with ONNX model (async, non-blocking)
						let device: { present: boolean; center: { x: number; y: number } | null; box: { x: number; y: number; w: number; h: number } | null } | null = null;
						if (stageIdx === 2 || stageIdx === 3) {
							const canvas = canvasRef.current;
							if (canvas) {
								device = await singletons.inhalerDetector.detect(canvas, canvas.width, canvas.height, 0.35);
							}
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
													ready?: boolean;
												};
											};
											const res = step.detect({
												device: null,
												mouthPoint,
											});
											stepResult = {
												ok: res?.exhaling ?? false,
												msg: res?.exhaling
													? "吐氣完全！"
													: "請深吐氣...",
											};
											if (frameCount % 30 === 0) {
												console.log("  step2:", `mouth:${mouthPoint ? `(${mouthPoint.x.toFixed(2)},${mouthPoint.y.toFixed(2)})` : "null"} exhaling:${res?.exhaling}`);
											}
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
													atMouth?: boolean;
												};
											};
											const res = step.detect({
												device,
												mouthPoint,
											});
											stepResult = {
												ok: res?.pressing ?? false,
												msg: res?.pressing
													? "按壓吸氣正確！"
													: res?.atMouth
														? "請按壓吸入器並深吸氣..."
														: "請將吸入器放入口中...",
											};
											if (frameCount % 30 === 0) {
												console.log("  step3:", `device:${device?.present ? `(${device.center?.x?.toFixed(2)},${device.center?.y?.toFixed(2)})` : "null"} mouth:${mouthPoint ? `(${mouthPoint.x.toFixed(2)},${mouthPoint.y.toFixed(2)})` : "null"} pressing:${res?.pressing}`);
											}
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
