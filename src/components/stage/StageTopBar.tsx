type StageTopBarProps = {
	text: string;
	leftClass: string;
};

export function StageTopBar({ text, leftClass }: StageTopBarProps) {
	if (!text) return null;

	return (
		<div
			className={`fixed top-0 right-0 z-[99] px-5 py-3 bg-surface border-b border-border text-center text-base font-bold text-text ${leftClass}`}
		>
			{text}
		</div>
	);
}
