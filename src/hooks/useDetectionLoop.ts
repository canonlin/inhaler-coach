import { useCallback, useRef } from "react";
import { state } from "../core/state";
import { CoachingStageEvaluator } from "../detection/coaching-stage-evaluator";
import { handROI, padROI } from "../detection/motion-energy";
import { drawOverlay } from "../overlay";
import { getStageConfig, singletons } from "../services/detection-singletons";
import { mouthROI } from "../steps/step4-rinse";

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

type Landmark = {
	x: number;
	y: number;
	z?: number;
	score?: number | null;
};

type MotionRegion = {
	x: number;
	y: number;
	w: number;
	h: number;
};

const MOTION_SAMPLE_INTERVAL_MS = 1000 / 30;
// MediaPipe's VIDEO API is synchronous even though DetectionManager exposes an
// async method. Running it on every animation frame starves the separate motion
// sampler on real demo hardware (observed at ~21 fps in Brave). Ten landmark
// updates per second are enough to keep an ROI current while leaving the main
// thread enough time to measure shake motion near 30 fps.
const INFERENCE_INTERVAL_MS = 100;

// Fast shaking is exactly when hand landmarks and the blurred inhaler blink out.
// Keep the last trustworthy ROI briefly instead of turning every missed model
// frame into zero motion. Motion, direction and reversal gates still decide the
// action; a retained ROI is never pass evidence by itself.
const ACTION_ROI_DROPOUT_GRACE_MS = 1200;

export function useDetectionLoop({
	canvasRef,
	onStatusChange,
}: UseDetectionLoopProps) {
	const loopRef = useRef({
		running: false,
		lastFrameTime: 0,
		runId: 0,
	});

	const stopLoop = useCallback(() => {
		loopRef.current.running = false;
		loopRef.current.runId += 1;
	}, []);

	const startLoop = useCallback(
		(stageIdx: number, onPassStage: () => void) => {
			loopRef.current.running = true;
			loopRef.current.lastFrameTime = 0;
			const runId = ++loopRef.current.runId;

			const stage = getStageConfig(stageIdx);
			const evaluator = new CoachingStageEvaluator({
				stageIdx,
				passSeconds: stage.passSeconds ?? 0,
				inhaleSeconds: stage.inhaleSeconds ?? 0,
				holdSeconds: stage.holdSeconds ?? 0,
			});

			let isEvaluating = false;
			let frameCount = 0;
			let passed = false;
			let motionFrameCount = 0;
			let lastMotionSampleAt = Number.NEGATIVE_INFINITY;
			let latestMotionRoi: MotionRegion | null = null;
			let latestMotionRoiSeenAt = Number.NEGATIVE_INFINITY;
			let stage1InhalerDetectionPending = false;
			let stage1TargetLocked = false;
			let latestMotion = {
				hand: 0,
				background: 0,
				ratio: 0,
				flowX: 0,
				flowY: 0,
				observed: false,
			};

			// A new attempt must not inherit motion, duration or object-tracking
			// history from the previous stage or a retry.
			singletons.motionEnergy.reset();
			singletons.inhalerDetector.reset();
			singletons.step1.reset();
			singletons.step2.reset();
			singletons.step3.reset();
			singletons.step4.reset();

			console.log("=== Detection loop started ===");
			console.log(
				"DetectionManager initialized:",
				singletons.detection?.isInitialized,
			);
			console.log(
				"DetectionManager backend:",
				singletons.detection?.activeBackend,
			);
			console.log("webcamVideo available:", !!state.webcamVideo);
			console.log("Canvas ref available:", !!canvasRef.current);
			const isActiveRun = () =>
				loopRef.current.running && loopRef.current.runId === runId && !passed;

			function requestStage1InhalerRoi(
				canvas: HTMLCanvasElement,
				timestamp: number,
			) {
				if (stage1InhalerDetectionPending || stage1TargetLocked) return;
				stage1InhalerDetectionPending = true;

				// YOLO runs in a worker, but awaiting it here used to stall the hand
				// inference loop until the worker replied. During a fast shake that made
				// the hand model run at only a few fps, so a brief miss became a long ROI
				// outage. Keep this fallback genuinely in the background instead.
				void singletons.inhalerDetector
					.detect(canvas, canvas.width, canvas.height, 0.35, timestamp)
					.then((inhaler) => {
						if (!isActiveRun()) return;
						if (inhaler?.present && inhaler.box) {
							const observedAt =
								typeof inhaler.observedAt === "number"
									? inhaler.observedAt
									: timestamp;
							singletons.step1.observeInhaler(observedAt);
							stage1TargetLocked = true;
							if (inhaler.center) {
								singletons.step1.updatePosition(
									inhaler.center,
									observedAt,
									"inhaler",
								);
							}
							latestMotionRoi = padROI(inhaler.box, 0.4);
							// The tracker may persist a prior positive while raw YOLO misses a
							// blurred frame. Preserve its actual observation time; refreshing it
							// to "now" made a stale, misplaced box look permanently trustworthy.
							latestMotionRoiSeenAt = observedAt;
						} else if (
							performance.now() - latestMotionRoiSeenAt >
							ACTION_ROI_DROPOUT_GRACE_MS
						) {
							latestMotionRoi = null;
						}

						if (frameCount % 30 === 0) {
							console.log(
								"  inhaler:",
								`present:${inhaler?.present} score:${inhaler?.score} box:${inhaler?.box ? `x:${inhaler.box.x.toFixed(2)} y:${inhaler.box.y.toFixed(2)} w:${inhaler.box.w.toFixed(2)} h:${inhaler.box.h.toFixed(2)}` : "null"}`,
							);
						}
					})
					.catch((error) => {
						console.warn("Stage 1 inhaler fallback failed:", error);
					})
					.finally(() => {
						stage1InhalerDetectionPending = false;
					});
			}

			function sampleMotionFrame(now: number) {
				if (!isActiveRun()) return;

				const canvas = canvasRef.current;
				const ctx = canvas?.getContext("2d");
				if (canvas && ctx && state.webcamVideo) {
					ctx.drawImage(state.webcamVideo, 0, 0, canvas.width, canvas.height);

					if (
						(stageIdx === 1 || stageIdx === 4) &&
						now - lastMotionSampleAt >= MOTION_SAMPLE_INTERVAL_MS - 1
					) {
						lastMotionSampleAt = now;
						const actionPercentile = stageIdx === 1 ? 0.98 : 0.9;
						latestMotion = singletons.motionEnergy.sample(
							canvas,
							latestMotionRoi,
							actionPercentile,
						);
						motionFrameCount++;

						if (stageIdx === 1) {
							singletons.step1.update(latestMotion, now);
						}
						if (stageIdx === 4) {
							singletons.step4.update(latestMotion.ratio, now);
						}

						if (motionFrameCount % 30 === 0) {
							console.log(
								"  motion:",
								`action:${latestMotion.hand.toFixed(2)} bg:${latestMotion.background.toFixed(2)} ratio:${latestMotion.ratio.toFixed(2)} flow:(${latestMotion.flowX.toFixed(2)},${latestMotion.flowY.toFixed(2)}) samples:${motionFrameCount}`,
							);
						}
					}
				}

				if (isActiveRun()) requestAnimationFrame(sampleMotionFrame);
			}

			async function frame(now: number) {
				if (!isActiveRun()) return;

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
									pose: stageIdx === 2 || stageIdx === 3,
									face: stageIdx >= 2,
									hands: stageIdx === 1 || stageIdx === 3,
								};
								poseResult = await singletons.detection.processFrame(
									canvas,
									now,
									needs,
								);
								if (!isActiveRun()) return;
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
							pose?: Landmark[];
							face?: Landmark[];
							hands?: Landmark[];
						} | null;
						const hand = pr?.hands ?? null;
						const handRegion = handROI(hand, 0.6);
						const handCenter = hand?.length
							? hand.reduce(
									(center, landmark) => ({
										x: center.x + landmark.x / hand.length,
										y: center.y + landmark.y / hand.length,
									}),
									{ x: 0, y: 0 },
								)
							: null;
						if (stageIdx === 1 && handCenter) {
							singletons.step1.updatePosition(handCenter, now, "hand");
						}
						const face = pr?.face ?? null;

						// Extract mouth point from face landmarks (MediaPipe face mesh).
						// Landmarks 13 (top lip) and 14 (bottom lip) center.
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

						// Inference only publishes the current action ROI. The independent
						// fixed-rate sampler above consumes it at ~30 fps. A positive hand
						// observation refreshes the ROI immediately; a missed observation
						// does not erase it until both hand and inhaler tracking have been
						// absent beyond the bounded dropout grace.
						if (stageIdx === 1 && handRegion) {
							latestMotionRoi = handRegion;
							latestMotionRoiSeenAt = performance.now();
						}
						if (stageIdx === 1 && !stage1TargetLocked) {
							const canvas = canvasRef.current;
							if (canvas) requestStage1InhalerRoi(canvas, now);
						}
						if (!handRegion && stageIdx === 1) {
							const canvas = canvasRef.current;
							if (canvas) {
								if (
									performance.now() - latestMotionRoiSeenAt >
									ACTION_ROI_DROPOUT_GRACE_MS
								) {
									latestMotionRoi = null;
								}
							}
						}
						if (stageIdx === 4) {
							const nextMouthRoi = mouthROI(face);
							if (nextMouthRoi) {
								latestMotionRoi = nextMouthRoi;
								latestMotionRoiSeenAt = performance.now();
							} else if (
								performance.now() - latestMotionRoiSeenAt >
								ACTION_ROI_DROPOUT_GRACE_MS
							) {
								latestMotionRoi = null;
							}
						}

						frameCount++;
						if (frameCount % 30 === 0) {
							console.log("--- Frame", frameCount, "---");
							console.log(
								"  pose:",
								pr?.pose ? `${pr.pose.length} lm` : "null",
							);
							console.log(
								"  face:",
								pr?.face ? `${pr.face.length} lm` : "null",
							);
							console.log("  hands:", hand ? `${hand.length} pts` : "null");
							console.log(
								"  actionROI:",
								latestMotionRoi
									? `x:${latestMotionRoi.x.toFixed(2)} y:${latestMotionRoi.y.toFixed(2)} w:${latestMotionRoi.w.toFixed(2)} h:${latestMotionRoi.h.toFixed(2)}`
									: "null",
							);
						}

						// Detect inhaler with ONNX model (async, non-blocking)
						let device: {
							present: boolean;
							center: { x: number; y: number } | null;
							box: { x: number; y: number; w: number; h: number } | null;
							steadiness: number;
						} | null = null;
						if (stageIdx === 3) {
							const canvas = canvasRef.current;
							if (canvas) {
								device = await singletons.inhalerDetector.detect(
									canvas,
									canvas.width,
									canvas.height,
									0.35,
									now,
								);
								if (!isActiveRun()) return;
							}
						}

						if (
							isActiveRun() &&
							!isEvaluating &&
							now - loopRef.current.lastFrameTime > 200
						) {
							loopRef.current.lastFrameTime = now;
							isEvaluating = true;

							try {
								let stepResult: StepEvalResult = { ok: false, msg: "" };

								switch (stageIdx) {
									case 1: {
										const res = singletons.step1.detect(now);
										stepResult = evaluator.evaluate(res, now);
										if (frameCount % 30 === 0) {
											console.log(
												"  step1:",
												`ratio:${(res?.ratio ?? 0).toFixed(1)} vertical:${(res?.verticalShare ?? 0).toFixed(2)} reversals:${res?.verticalReversals ?? 0} path:${res?.trajectorySource ?? "none"} range:${(res?.positionVerticalRange ?? 0).toFixed(2)} travel:${(res?.positionVerticalTravel ?? 0).toFixed(2)} pathReversals:${res?.positionVerticalReversals ?? 0} shaking:${res?.shaking} held:${(res?.secondsHeld ?? 0).toFixed(1)}s passed:${res?.passed}`,
											);
										}
										break;
									}
									case 2:
										if (typeof singletons.step2?.detect === "function") {
											const step = singletons.step2 as unknown as {
												detect: (arg: {
													poseLandmarks?: unknown;
													faceLandmarks?: unknown;
													mouthPoint?: unknown;
													device?: unknown;
													timestamp?: number;
												}) => {
													ready?: boolean;
													exhaling?: boolean;
													shrugging?: boolean;
													atMouth?: boolean;
													shoulder?: unknown;
													mouthPursed?: boolean;
													confidence?: number;
												};
											};
											const res = step.detect({
												poseLandmarks: pr?.pose,
												faceLandmarks: pr?.face,
												mouthPoint,
												device,
												timestamp: now,
											});
											stepResult = evaluator.evaluate(res, now);
											if (frameCount % 30 === 0) {
												console.log(
													"  step2:",
													`ready:${res?.ready} exhaling:${res?.exhaling} pursed:${res?.mouthPursed} shrugging:${res?.shrugging}`,
												);
											}
										}
										break;
									case 3:
										if (typeof singletons.step3?.detect === "function") {
											const step = singletons.step3 as unknown as {
												detect: (arg: {
													device: unknown;
													mouthPoint: unknown;
													handPoint?: unknown;
													poseLandmarks?: unknown;
													timestamp?: number;
												}) => {
													pressing?: boolean;
													atMouth?: boolean;
													steady?: boolean;
													ready?: boolean;
													shoulder?: { isElevated?: boolean };
													inhaling?: boolean;
													breathHoldStable?: boolean;
													prematureExhale?: boolean;
												};
											};
											const res = step.detect({
												device,
												mouthPoint,
												handPoint: handCenter,
												poseLandmarks: pr?.pose,
												timestamp: now,
											});
											stepResult = evaluator.evaluate(res, now);
											if (frameCount % 30 === 0) {
												console.log(
													"  step3:",
													`device:${device?.present ? `(${device.center?.x?.toFixed(2)},${device.center?.y?.toFixed(2)})` : "null"} mouth:${mouthPoint ? `(${mouthPoint.x.toFixed(2)},${mouthPoint.y.toFixed(2)})` : "null"} pressing:${res?.pressing} shoulderElevated:${res?.shoulder?.isElevated}`,
												);
											}
										}
										break;
									case 4:
										if (typeof singletons.step4?.detect === "function") {
											const res = singletons.step4.detect();
											stepResult = evaluator.evaluate(
												{ ...res, facePresent: !!face },
												now,
											);
										}
										break;
									default:
										stepResult = evaluator.evaluate({}, now);
								}

								if (stepResult.ok) {
									onStatusChange(stepResult.msg || "動作正確！", "correct");
									passed = true;
									onPassStage();
								} else if (stepResult.msg) {
									// Guidance is an expected in-progress state, not a failure. A red
									// full-frame overlay made normal practice feel like an error.
									onStatusChange(stepResult.msg, "none");
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

				if (isActiveRun()) {
					window.setTimeout(() => {
						if (isActiveRun()) requestAnimationFrame(frame);
					}, INFERENCE_INTERVAL_MS);
				}
			}

			requestAnimationFrame(sampleMotionFrame);
			requestAnimationFrame(frame);
		},
		[canvasRef, onStatusChange],
	);

	return {
		startLoop,
		stopLoop,
	};
}
