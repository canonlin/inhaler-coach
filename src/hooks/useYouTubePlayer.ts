import { useEffect, useRef } from "react";

type UseYouTubePlayerProps = {
	videoURL: string;
	showVideo: boolean;
	onVideoEnd: () => void;
};

export function useYouTubePlayer({
	videoURL,
	showVideo,
	onVideoEnd,
}: UseYouTubePlayerProps) {
	const videoContainerRef = useRef<HTMLDivElement | null>(null);
	const ytRef = useRef<unknown>(null);

	useEffect(() => {
		if (!showVideo) return;

		const container = videoContainerRef.current;
		if (!container) return;

		const iframe = container.querySelector("iframe");
		const loadingEl = container.querySelector(
			"#video-loading",
		) as HTMLElement | null;

		if (loadingEl) {
			loadingEl.style.opacity = "1";
			loadingEl.style.pointerEvents = "auto";
		}

		if (iframe && videoURL) {
			const embedUrl = videoURL.includes("?")
				? `${videoURL}&enablejsapi=1&autoplay=1`
				: `${videoURL}?enablejsapi=1&autoplay=1`;
			iframe.src = embedUrl;

			const timer = setTimeout(() => {
				if (loadingEl) {
					loadingEl.style.opacity = "0";
					loadingEl.style.pointerEvents = "none";
				}
			}, 1200);

			return () => clearTimeout(timer);
		}
	}, [videoURL, showVideo]);

	useEffect(() => {
		function handleMessage(evt: MessageEvent) {
			try {
				const data =
					typeof evt.data === "string" ? JSON.parse(evt.data) : evt.data;
				if (data.event === "onStateChange" && data.info === 0) {
					onVideoEnd();
				}
			} catch {}
		}

		window.addEventListener("message", handleMessage);
		return () => window.removeEventListener("message", handleMessage);
	}, [onVideoEnd]);

	return { videoContainerRef, ytRef };
}
