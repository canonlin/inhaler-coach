import type { RefObject } from "react";
import { IconArrowLeft, IconBrain } from "../icons";
import { StatusBanner } from "./StatusBanner";

type AISectionProps = {
	canvasRef: RefObject<HTMLCanvasElement | null>;
	overlay: "none" | "correct" | "wrong";
	aiLabel: string;
	statusText: string;
	onBackToVideo: () => void;
};

const OVERLAY_CLASSES: Record<string, string> = {
	none: "hidden",
	correct:
		"absolute inset-0 border-4 border-success bg-success/10 rounded-lg pointer-events-none transition-all duration-300",
	wrong:
		"absolute inset-0 border-4 border-danger bg-danger/10 rounded-lg pointer-events-none transition-all duration-300",
};

export function AISection({
	canvasRef,
	overlay,
	aiLabel,
	statusText,
	onBackToVideo,
}: AISectionProps) {
	return (
		<div className="absolute inset-0 bg-bg flex items-center justify-center z-20">
			<div className="w-full max-w-[800px] bg-surface border border-border rounded-xl overflow-hidden mx-4">
				<div className="px-5 py-3 text-sm font-bold text-text-secondary border-b border-border flex items-center gap-2">
					<span className="flex items-center gap-1.5">
						<IconBrain />
						AI 即時辨識
					</span>
					<span className="ml-auto text-xs text-text-secondary/60">
						{aiLabel}
					</span>
				</div>

				<div className="p-5 flex gap-5 items-start flex-wrap max-md:flex-col">
					<div className="relative w-[clamp(280px,40vw,480px)] min-w-[260px] flex-shrink-0">
						<canvas
							ref={canvasRef}
							className="w-full h-auto rounded-lg bg-black block border border-border min-h-[200px]"
							width="480"
							height="360"
						/>
						<div className={OVERLAY_CLASSES[overlay] ?? "hidden"} />
					</div>

					<div className="flex-1 min-w-[180px] flex flex-col gap-3" id="ai-results">
						<div className="text-sm text-text-secondary text-center p-5">
							{statusText ? (
								<StatusBanner text={statusText} />
							) : (
								"AI 模型載入中，請稍候..."
							)}
						</div>
					</div>
				</div>

				<div className="px-4 py-2 border-t border-border text-left">
					<button
						type="button"
						onClick={onBackToVideo}
						className="bg-none border-none text-text-secondary text-xs cursor-pointer font-sans hover:text-text flex items-center gap-1"
					>
						<IconArrowLeft />
						重新觀看影片
					</button>
				</div>
			</div>
		</div>
	);
}
