import { IntroActions } from "../components/intro/IntroActions";
import { IntroHeader } from "../components/intro/IntroHeader";
import { IntroSteps } from "../components/intro/IntroSteps";

type IntroScreenProps = {
	onStart: () => void;
};

export function IntroScreen({ onStart }: IntroScreenProps) {
	return (
		<div className="flex min-h-0 flex-col justify-center gap-6 sm:gap-8 md:gap-10">
			<IntroHeader />
			<IntroSteps />
			<IntroActions onStart={onStart} />
		</div>
	);
}
