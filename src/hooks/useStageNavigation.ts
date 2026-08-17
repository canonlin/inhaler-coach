import { useCallback, useState } from "react";
import { STAGES } from "../config/stages";

export function getInitialStageIdx(): number {
	const raw = new URLSearchParams(window.location.search).get("stage");
	if (!raw) return 0;
	const n = Number.parseInt(raw, 10);
	return Number.isNaN(n) ? 0 : Math.max(0, Math.min(n, STAGES.length - 1));
}

export function useStageNavigation() {
	const [screen, setScreen] = useState<"intro" | "stage" | "success">("intro");
	const [stageIdx, setStageIdx] = useState<number>(getInitialStageIdx);
	const [phase, setPhase] = useState<"video" | "ai" | "pharmacist">("video");
	const [stagePassed, setStagePassed] = useState(false);

	const finishIntro = useCallback(() => {
		setScreen("stage");
		setStageIdx(0);
		setPhase("video");
		setStagePassed(false);
	}, []);

	const loadStage = useCallback((idx: number) => {
		setStageIdx(idx);
		setPhase("video");
		setStagePassed(false);
	}, []);

	const restartGame = useCallback(() => {
		setScreen("intro");
		setStageIdx(0);
		setPhase("video");
		setStagePassed(false);
	}, []);

	const nextStage = useCallback(() => {
		const nextIdx = stageIdx + 1;
		if (nextIdx >= STAGES.length) {
			setScreen("success");
		} else {
			loadStage(nextIdx);
		}
	}, [stageIdx, loadStage]);

	const backToVideo = useCallback(() => {
		setPhase("video");
		setStagePassed(false);
	}, []);

	const startAIPhase = useCallback(() => {
		setPhase("ai");
		setStagePassed(false);
	}, []);

	const retryStage = useCallback(() => {
		setPhase("ai");
		setStagePassed(false);
	}, []);

	return {
		screen,
		setScreen,
		stageIdx,
		setStageIdx,
		phase,
		setPhase,
		stagePassed,
		setStagePassed,
		finishIntro,
		loadStage,
		restartGame,
		nextStage,
		backToVideo,
		startAIPhase,
		retryStage,
	};
}
