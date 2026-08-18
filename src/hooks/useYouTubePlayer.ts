import { useCallback, useEffect, useRef, useState } from "react";
import { VIDEO_LOCK_SECONDS } from "../config/stages";

type UseYouTubePlayerProps = {
	videoURL: string;
	stageIdx?: number;
	showVideo: boolean;
	onVideoEnd: () => void;
};

/**
 * Builds YouTube embed URL with enablejsapi=1, autoplay=1, mute=1, playsinline=1, and origin
 */
export function buildEmbedUrl(videoURL: string, replayCount = 0): string {
	if (!videoURL) return "";
	const origin =
		typeof window !== "undefined" &&
		window.location.origin &&
		window.location.origin !== "null"
			? window.location.origin
			: "";
	const separator = videoURL.includes("?") ? "&" : "?";
	const originParam = origin ? `&origin=${encodeURIComponent(origin)}` : "";
	return `${videoURL}${separator}enablejsapi=1&autoplay=1&mute=1&playsinline=1&rel=0&modestbranding=1${originParam}&_r=${replayCount}`;
}

export function extractYouTubeVideoId(url: string): string {
	if (!url) return "";
	const match = url.match(
		/(?:embed\/|v=|vi\/|youtu\.be\/|\/v\/|\/e\/|watch\?v=|\?v=)([^#&?]+)/,
	);
	return match ? match[1] : "";
}

declare global {
	interface Window {
		YT?: {
			Player: new (
				element: HTMLElement | string,
				options: {
					events?: {
						onReady?: (event: unknown) => void;
						onStateChange?: (event: { data: number }) => void;
					};
				},
			) => {
				destroy?: () => void;
			};
			PlayerState: {
				ENDED: number;
				PLAYING: number;
				PAUSED: number;
				BUFFERING: number;
				CUED: number;
			};
		};
		onYouTubeIframeAPIReady?: () => void;
	}
}

let ytApiLoadingPromise: Promise<void> | null = null;

function loadYouTubeIframeApi(): Promise<void> {
	if (typeof window === "undefined") return Promise.resolve();
	if (window.YT?.Player) return Promise.resolve();

	if (!ytApiLoadingPromise) {
		ytApiLoadingPromise = new Promise((resolve) => {
			const existing = document.querySelector(
				'script[src*="youtube.com/iframe_api"]',
			);
			if (!existing) {
				const tag = document.createElement("script");
				tag.src = "https://www.youtube.com/iframe_api";
				document.head.appendChild(tag);
			}

			const prevOnReady = window.onYouTubeIframeAPIReady;
			window.onYouTubeIframeAPIReady = () => {
				if (typeof prevOnReady === "function") {
					try {
						prevOnReady();
					} catch {}
				}
				resolve();
			};

			const interval = setInterval(() => {
				if (window.YT?.Player) {
					clearInterval(interval);
					resolve();
				}
			}, 150);

			setTimeout(() => {
				clearInterval(interval);
				resolve();
			}, 3000);
		});
	}
	return ytApiLoadingPromise;
}

export function useYouTubePlayer({
	videoURL,
	stageIdx = 1,
	showVideo,
	onVideoEnd,
}: UseYouTubePlayerProps) {
	const videoContainerRef = useRef<HTMLDivElement | null>(null);
	const onVideoEndRef = useRef(onVideoEnd);
	const hasEndedRef = useRef(false);
	const [replayCount, setReplayCount] = useState(0);
	const [isVideoLoading, setIsVideoLoading] = useState(true);
	const [isVideoEnded, setIsVideoEnded] = useState(false);

	useEffect(() => {
		onVideoEndRef.current = onVideoEnd;
	}, [onVideoEnd]);

	const videoEmbedUrl =
		showVideo && videoURL ? buildEmbedUrl(videoURL, replayCount) : "";

	const finishLoading = useCallback(() => {
		setIsVideoLoading(false);
	}, []);

	const triggerVideoEnd = useCallback(() => {
		if (hasEndedRef.current) return;
		hasEndedRef.current = true;
		setIsVideoEnded(true);
		setIsVideoLoading(false);
		onVideoEndRef.current();
	}, []);

	useEffect(() => {
		if (!showVideo || !videoEmbedUrl) return;

		hasEndedRef.current = false;
		setIsVideoEnded(false);
		setIsVideoLoading(true);

		let ytPlayerInstance: { destroy?: () => void } | null = null;
		let isCancelled = false;

		// 1. YouTube Iframe API Initialization
		loadYouTubeIframeApi().then(() => {
			if (isCancelled) return;
			const container = videoContainerRef.current;
			const iframe = container?.querySelector("iframe");
			if (iframe && window.YT?.Player) {
				try {
					ytPlayerInstance = new window.YT.Player(iframe, {
						events: {
							onReady: () => {
								if (!isCancelled) finishLoading();
							},
							onStateChange: (e: { data: number }) => {
								if (isCancelled) return;
								finishLoading();
								if (e.data === 0 || e.data === window.YT?.PlayerState.ENDED) {
									triggerVideoEnd();
								}
							},
						},
					});
				} catch {}
			}
		});

		// 2. Continuous postMessage handshake & listener
		function handleMessage(evt: MessageEvent) {
			const origin = typeof evt.origin === "string" ? evt.origin : "";
			const isAllowed =
				!origin ||
				origin.includes("youtube.com") ||
				origin.includes("youtube-nocookie.com") ||
				origin === window.location.origin;

			if (!isAllowed) {
				return;
			}

			try {
				const data =
					typeof evt.data === "string" ? JSON.parse(evt.data) : evt.data;
				if (!data) return;

				if (
					data.event === "onReady" ||
					data.event === "initialDelivery" ||
					data.event === "infoDelivery" ||
					(data.event === "onStateChange" && data.info !== undefined)
				) {
					finishLoading();
				}

				const isEnded =
					(data.event === "onStateChange" &&
						(data.info === 0 || data.data === 0)) ||
					(data.event === "infoDelivery" &&
						(data.info?.playerState === 0 || data.data?.playerState === 0)) ||
					(data.event === "infoDelivery" &&
						typeof data.info?.duration === "number" &&
						data.info.duration > 2 &&
						typeof data.info?.currentTime === "number" &&
						data.info.currentTime >= data.info.duration - 0.4);

				if (isEnded) {
					triggerVideoEnd();
				}
			} catch {}
		}

		window.addEventListener("message", handleMessage);

		// Periodic handshake ping to YouTube iframe
		const container = videoContainerRef.current;
		const iframe = container?.querySelector("iframe");
		const pingInterval = setInterval(() => {
			if (hasEndedRef.current) {
				clearInterval(pingInterval);
				return;
			}
			try {
				iframe?.contentWindow?.postMessage(
					JSON.stringify({ event: "listening", id: 1 }),
					"*",
				);
			} catch {}
		}, 300);

		// 3. Robust Duration Timer Fallback
		const durationSec =
			(VIDEO_LOCK_SECONDS as Record<number, number>)[stageIdx] ?? 12;
		const fallbackTimer = setTimeout(
			() => {
				if (!hasEndedRef.current && !isCancelled) {
					triggerVideoEnd();
				}
			},
			(durationSec + 2) * 1000,
		);

		return () => {
			isCancelled = true;
			clearInterval(pingInterval);
			clearTimeout(fallbackTimer);
			window.removeEventListener("message", handleMessage);
			if (ytPlayerInstance && typeof ytPlayerInstance.destroy === "function") {
				try {
					ytPlayerInstance.destroy();
				} catch {}
			}
		};
	}, [videoEmbedUrl, showVideo, stageIdx, finishLoading, triggerVideoEnd]);

	const replayVideo = useCallback(() => {
		hasEndedRef.current = false;
		setIsVideoEnded(false);
		setIsVideoLoading(true);
		setReplayCount((c) => c + 1);
	}, []);

	return {
		videoContainerRef,
		videoEmbedUrl,
		isVideoLoading,
		isVideoEnded,
		replayVideo,
		finishLoading,
		triggerVideoEnd,
	};
}
