import { useCoaching } from "./hooks/useCoaching";
import { IntroScreen } from "./screens/IntroScreen";
import { StageScreen } from "./screens/StageScreen";
import { SuccessScreen } from "./screens/SuccessScreen";

const baseUrl = import.meta.env.BASE_URL;
const introBackground = `${baseUrl}inhaler_bg.jpg?v=20260818_left_nozzle_final`;

export function App() {
	const c = useCoaching();

	if (c.screen === "intro") {
		return (
			<main className="fixed inset-0 flex h-[100dvh] w-full flex-col justify-center overflow-hidden bg-slate-950 text-slate-900 px-4 md:px-12 lg:px-16">
				<img
					src={introBackground}
					alt="吸必擴定量吸入器"
					decoding="async"
					fetchPriority="high"
					className="pointer-events-none absolute inset-0 h-full w-full select-none object-cover object-[72%_center] transition-all duration-300 sm:object-[78%_center] lg:object-[82%_center]"
					style={{ imageRendering: "-webkit-optimize-contrast" }}
				/>

				{/* Preserve headline contrast when the wide product image is cropped on phones. */}
				<div className="pointer-events-none absolute inset-0 bg-white/80 sm:bg-transparent sm:bg-gradient-to-r sm:from-white/40 sm:via-white/10 sm:to-transparent lg:from-white/20" />

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
