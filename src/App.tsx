import { useCoaching } from "./hooks/useCoaching";
import { IntroScreen } from "./screens/IntroScreen";
import { StageScreen } from "./screens/StageScreen";
import { SuccessScreen } from "./screens/SuccessScreen";

export function App() {
	const c = useCoaching();

	if (c.screen === "intro") {
		return (
			<main className="mx-auto flex h-[100dvh] w-full max-w-[780px] flex-col justify-center px-6 md:px-10 bg-white text-text overflow-y-auto">
				<IntroScreen onStart={c.finishIntro} />
				<div className="fixed bottom-0 left-0 h-px w-full bg-primary" />
			</main>
		);
	}

	if (c.screen === "success") {
		return <SuccessScreen onRestart={c.restartGame} />;
	}

	return <StageScreen {...c} />;
}
