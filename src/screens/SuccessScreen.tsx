import { IconCheck } from "../components/icons";

type SuccessScreenProps = {
	onRestart: () => void;
};

export function SuccessScreen({ onRestart }: SuccessScreenProps) {
	return (
		<div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-bg px-6">
			<div className="flex flex-col items-center gap-6 text-center max-w-md">
				<div className="flex h-20 w-20 items-center justify-center rounded-full bg-success/10 text-success">
					<IconCheck className="w-10 h-10" />
				</div>

				<div className="grid gap-2">
					<h1 className="text-3xl font-black text-text">學習完成！</h1>
					<p className="text-base text-text-secondary">
						恭喜您完成吸藥衛教闖關練習，已掌握正確的吸藥技巧。
					</p>
				</div>

				<button
					type="button"
					onClick={onRestart}
					className="mt-4 rounded-full bg-primary px-9 py-3.5 text-base font-bold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-dark cursor-pointer"
				>
					再練一次
				</button>
			</div>
		</div>
	);
}
