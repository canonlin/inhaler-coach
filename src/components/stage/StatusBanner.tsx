type StatusBannerProps = {
	text: string;
};

function getStatusClass(text: string): string {
	if (
		text.includes("正確") ||
		text.includes("成功") ||
		text.includes("通過") ||
		text.includes("完成") ||
		text.includes("很好")
	) {
		return "border-emerald-400/50 bg-emerald-950/90 text-emerald-100";
	}
	if (
		text.includes("不正確") ||
		text.includes("失敗") ||
		text.includes("請再試") ||
		text.includes("無法")
	) {
		return "border-rose-400/50 bg-rose-950/90 text-rose-100";
	}
	return "border-white/15 bg-slate-950/80 text-white";
}

export function StatusBanner({ text }: StatusBannerProps) {
	if (!text) return null;

	return (
		<div className="w-full max-w-[560px] px-4" role="status" aria-live="polite">
			<div
				className={`rounded-2xl border px-5 py-3.5 text-center text-sm font-black leading-6 shadow-2xl backdrop-blur-md transition-colors duration-200 sm:text-base ${getStatusClass(text)}`}
			>
				{text}
			</div>
		</div>
	);
}
