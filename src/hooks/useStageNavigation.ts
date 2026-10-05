import { useCallback, useState } from "react";
import { STAGES, getInitialStageIdx } from "../config/stages.js";

export { getInitialStageIdx };

export function useStageNavigation() {
	const [screen, setScreen] = useState<"intro" | "stage" | "success">(() =>
		new URLSearchParams(window.location.search).has("stage")
			? "stage"
			: "intro",
	);
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
