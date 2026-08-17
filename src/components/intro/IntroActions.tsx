import { Button } from "../ui/button";

type IntroActionsProps = {
	onStart: () => void;
};

export function IntroActions({ onStart }: IntroActionsProps) {
	return (
		<footer className="grid gap-3 pt-2">
			<Button id="btn-start" onClick={onStart} className="w-full sm:w-fit">
				開始導覽
			</Button>

			<p className="font-mono text-xs text-text-secondary">
				支援桌機 · 手機 · 平板
			</p>
		</footer>
	);
}
