import { motion } from "motion/react";

const container = {
	hidden: {},
	show: {
		transition: { staggerChildren: 0.1 },
	},
};

const item = {
	hidden: { opacity: 0, y: 16 },
	show: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
	},
};

export function IntroHeader() {
	return (
		<motion.header
			className="grid gap-4 sm:gap-5"
			variants={container}
			initial="hidden"
			animate="show"
		>
			<motion.p
				variants={item}
				className="font-mono text-sm font-medium tracking-[0.25em] text-primary"
			>
				INHALER COACH
			</motion.p>

			<div className="grid gap-2 sm:gap-3">
				<motion.h1
					variants={item}
					className="text-3xl font-black leading-tight text-text sm:text-4xl md:text-5xl"
				>
					吸必擴智慧教學平台
				</motion.h1>
				<motion.p
					variants={item}
					className="text-base leading-7 text-text-secondary md:text-lg"
				>
					四步流程：看影片、調姿勢、AI 糾正、看結果。一次導覽，直接上手。
				</motion.p>
			</div>
		</motion.header>
	);
}
