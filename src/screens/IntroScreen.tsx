import { IntroActions } from "../components/intro/IntroActions";
import { IntroHeader } from "../components/intro/IntroHeader";
import { IntroSteps } from "../components/intro/IntroSteps";

type IntroScreenProps = {
	onStart: () => void;
};

export function IntroScreen({ onStart }: IntroScreenProps) {
	return (
		<div className="w-full max-w-[1280px] h-full max-h-[820px] flex flex-col justify-between py-2 sm:py-6 lg:py-8">
			{/* Left-Aligned Container: Ultra Compact vertical gap on mobile (< 640px) */}
			<div className="w-full max-w-[540px] lg:max-w-[560px] flex flex-col justify-between h-full my-auto gap-2 sm:gap-5 z-10">
				{/* Top Hero Header */}
				<IntroHeader />

				{/* Middle 4-Step Cards */}
				<div className="w-full">
					<IntroSteps />
				</div>

				{/* Bottom Action CTA */}
				<IntroActions onStart={onStart} />
			</div>
		</div>
	);
}
