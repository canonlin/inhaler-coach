import { AnimatePresence, motion } from "motion/react";
import { useCoaching } from "./hooks/useCoaching";
import { IntroScreen } from "./screens/IntroScreen";
import { StageScreen } from "./screens/StageScreen";
import { SuccessScreen } from "./screens/SuccessScreen";

export function App() {
	const c = useCoaching();

	return (
		<AnimatePresence mode="wait">
			{c.screen === "intro" && (
				<motion.main
					key="intro"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.3 }}
					className="mx-auto flex h-[100dvh] w-full max-w-[780px] flex-col justify-center px-6 md:px-10 bg-white text-text overflow-y-auto"
				>
					<IntroScreen onStart={c.finishIntro} />
					<motion.div
						className="fixed bottom-0 left-0 h-px w-full bg-primary"
						initial={{ scaleX: 0, originX: 0 }}
						animate={{ scaleX: 1 }}
						transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
					/>
				</motion.main>
			)}
			{c.screen === "stage" && (
				<motion.main
					key="stage"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.3 }}
				>
					<StageScreen {...c} />
				</motion.main>
			)}
			{c.screen === "success" && (
				<motion.div
					key="success"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.3 }}
				>
					<SuccessScreen onRestart={c.restartGame} />
				</motion.div>
			)}
		</AnimatePresence>
	);
}
