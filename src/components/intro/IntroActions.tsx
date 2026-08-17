import { motion } from "motion/react";
import { Button } from "../ui/button";

type IntroActionsProps = {
	onStart: () => void;
};

export function IntroActions({ onStart }: IntroActionsProps) {
	return (
		<motion.footer
			className="grid gap-3 pt-2"
			initial={{ opacity: 0, y: 16 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.35, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
		>
			<Button
				id="btn-start"
				onClick={onStart}
				className="w-full sm:w-fit"
			>
				開始導覽
			</Button>

			<p className="font-mono text-xs text-text-secondary">
				支援桌機 · 手機 · 平板
			</p>
		</motion.footer>
	);
}
