import { useCoaching } from "./hooks/useCoaching";
import { IntroScreen } from "./screens/IntroScreen";
import { StageScreen } from "./screens/StageScreen";
import { SuccessScreen } from "./screens/SuccessScreen";

export function App() {
	const c = useCoaching();

	if (c.screen === "intro") {
		return (
			<main className="fixed inset-0 flex h-[100dvh] w-full flex-col justify-center overflow-hidden bg-slate-950 text-slate-900 px-4 md:px-12 lg:px-16">
				{/* 8K AI Commercial 3D Render of Authentic Symbicort RAPihaler */}
				<img
					src="/inhaler_bg.jpg?v=20260818_left_nozzle_final"
					alt="吸必擴 Symbicort RAPihaler 8K 3D 商業攝影實景"
					decoding="async"
					fetchPriority="high"
					className="absolute inset-0 h-full w-full object-cover object-[78%_center] lg:object-[82%_center] select-none pointer-events-none transition-all duration-300"
					style={{ imageRendering: "-webkit-optimize-contrast" }}
				/>

				{/* Soft backdrop vignette */}
				<div className="absolute inset-0 bg-slate-950/5 pointer-events-none" />

				<div className="relative z-10 w-full h-full flex flex-col justify-center">
					<IntroScreen onStart={c.finishIntro} />
				</div>

				<div className="fixed bottom-0 left-0 h-1.5 w-full bg-rose-600 opacity-90 z-20" />
			</main>
		);
	}

	if (c.screen === "success") {
		return <SuccessScreen onRestart={c.restartGame} />;
	}

	return <StageScreen {...c} />;
}
