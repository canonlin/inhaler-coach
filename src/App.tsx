import { useCoaching } from "./hooks/useCoaching";
import { IntroScreen } from "./screens/IntroScreen";
import { StageScreen } from "./screens/StageScreen";
import { SuccessScreen } from "./screens/SuccessScreen";

export function App() {
	const c = useCoaching();

	if (c.screen === "intro") {
		return (
			<main className="relative mx-auto flex h-[100dvh] w-full max-w-[840px] flex-col justify-center px-6 sm:px-10 md:px-12 bg-[#090d12] text-slate-100 overflow-y-auto bg-grid-pattern">
				{/* Ambient Glow Orbs */}
				<div className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full bg-teal-500/15 blur-[120px]" />
				<div className="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-emerald-500/10 blur-[120px]" />

				<IntroScreen onStart={c.finishIntro} />

				{/* Bottom Neon Accent */}
				<div className="fixed bottom-0 left-0 h-0.5 w-full bg-gradient-to-r from-transparent via-teal-500 to-transparent opacity-80" />
			</main>
		);
	}

	if (c.screen === "success") {
		return <SuccessScreen onRestart={c.restartGame} />;
	}

	return <StageScreen {...c} />;
}
