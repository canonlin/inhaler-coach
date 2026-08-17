type StatusBannerProps = {
	text: string;
};

function getStatusClass(text: string): string {
	if (text.includes("正確") || text.includes("成功") || text.includes("通過")) {
		return "py-3 px-6 rounded-lg text-center text-base font-bold transition-colors duration-200 border border-success bg-success/10 text-success";
	}
	if (
		text.includes("不正確") ||
		text.includes("失敗") ||
		text.includes("請再試")
	) {
		return "py-3 px-6 rounded-lg text-center text-base font-bold transition-colors duration-200 border border-danger bg-danger/10 text-danger";
	}
	return "py-3 px-6 rounded-lg text-center text-base font-bold transition-colors duration-200 border border-primary bg-primary/10 text-primary";
}

export function StatusBanner({ text }: StatusBannerProps) {
	if (!text) return null;

	return (
		<div className="w-full max-w-[500px] px-4">
			<div className={getStatusClass(text)}>{text}</div>
		</div>
	);
}
