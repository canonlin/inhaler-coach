export function LoadingWave() {
	return (
		<div className="flex flex-col items-center justify-center gap-3 py-4 select-none">
			{/* Dynamic Glowing Wave Bars using CSS Keyframes */}
			<div className="flex items-center gap-2 h-9 px-2">
				<div
					className="w-2 rounded-full bg-rose-500 animate-[wave_1s_ease-in-out_infinite] shadow-[0_0_12px_rgba(225,29,72,0.55)]"
					style={{ animationDelay: "0ms" }}
				/>
				<div
					className="w-2 rounded-full bg-rose-500 animate-[wave_1s_ease-in-out_infinite] shadow-[0_0_12px_rgba(225,29,72,0.55)]"
					style={{ animationDelay: "150ms" }}
				/>
				<div
					className="w-2 rounded-full bg-rose-500 animate-[wave_1s_ease-in-out_infinite] shadow-[0_0_12px_rgba(225,29,72,0.55)]"
					style={{ animationDelay: "300ms" }}
				/>
				<div
					className="w-2 rounded-full bg-rose-500 animate-[wave_1s_ease-in-out_infinite] shadow-[0_0_12px_rgba(225,29,72,0.55)]"
					style={{ animationDelay: "450ms" }}
				/>
				<div
					className="w-2 rounded-full bg-rose-500 animate-[wave_1s_ease-in-out_infinite] shadow-[0_0_12px_rgba(225,29,72,0.55)]"
					style={{ animationDelay: "600ms" }}
				/>
			</div>

			<span className="text-sm font-black tracking-wider text-slate-200">
				影片載入中...
			</span>

			<style>{`
				@keyframes wave {
					0%, 100% { height: 10px; opacity: 0.4; }
					50% { height: 32px; opacity: 1; }
				}
			`}</style>
		</div>
	);
}
