import { useCallback, useEffect, useRef, useState } from "react";

type UseYouTubePlayerProps = {
	videoURL: string;
	showVideo: boolean;
	onVideoEnd: () => void;
};

declare global {
	interface Window {
		onYouTubeIframeAPIReady: () => void;
		YT: {
			Player: new (
				element: HTMLElement | string,
				config: Record<string, unknown>,
			) => YT.Player;
			PlayerState: {
				UNSTARTED: number;
				ENDED: number;
				PLAYING: number;
				PAUSED: number;
				BUFFERING: number;
				CUED: number;
			};
		};
	}
}

export function extractYouTubeVideoId(url: string): string {
	if (!url) return "";
	const match = url.match(
		/(?:embed\/|v=|vi\/|youtu\.be\/|\/v\/|\/e\/|watch\?v=|\?v=)([^#&?]+)/,
	);
	return match ? match[1] : "";
}

export function useYouTubePlayer({
	videoURL,
	showVideo,
	onVideoEnd,
}: UseYouTubePlayerProps) {
	const videoContainerRef = useRef<HTMLDivElement | null>(null);
	const playerRef = useRef<YT.Player | null>(null);
	const onVideoEndRef = useRef(onVideoEnd);
	const hasEndedRef = useRef(false);

	const [replayCount, setReplayCount] = useState(0);
	const [isVideoLoading, setIsVideoLoading] = useState(true);
	const [isVideoEnded, setIsVideoEnded] = useState(false);
	const [isPlaying, setIsPlaying] = useState(true);
	const [isMuted, setIsMuted] = useState(true);
	const [videoError, setVideoError] = useState<string | null>(null);
	// Tracks whether the container DOM element has been attached.
	// Refs don't trigger re-renders, so we mirror it with state
	// to make the player-creation effect re-run once the container exists.
	const [containerReady, setContainerReady] = useState(false);

	useEffect(() => {
		onVideoEndRef.current = onVideoEnd;
	}, [onVideoEnd]);

	const videoId = extractYouTubeVideoId(videoURL);

	const triggerVideoEnd = useCallback(() => {
		if (hasEndedRef.current) return;
		hasEndedRef.current = true;
		setIsVideoEnded(true);
		setIsVideoLoading(false);
		onVideoEndRef.current();
	}, []);

	// Callback ref: fires when the container div mounts/unmounts.
	const setContainerRef = useCallback((node: HTMLDivElement | null) => {
		videoContainerRef.current = node;
		setContainerReady(!!node);
	}, []);

	useEffect(() => {
		if (!showVideo || !videoId || !containerReady) {
			if (playerRef.current) {
				playerRef.current.destroy();
				playerRef.current = null;
			}
			return;
		}

		let destroyed = false;
		const loadingTimeout = window.setTimeout(() => {
			if (destroyed) return;
			setIsVideoLoading(false);
			setVideoError("教學影片載入逾時，可能是網路連線不穩定。");
		}, 12_000);

		const clearLoadingTimeout = () => window.clearTimeout(loadingTimeout);

		function createPlayer(count: number) {
			if (destroyed) return;
			const container = videoContainerRef.current;
			if (!container || !window.YT?.Player) return;

			if (playerRef.current) {
				playerRef.current.destroy();
				playerRef.current = null;
			}

			const player = new window.YT.Player(container, {
				videoId,
				width: "100%",
				height: "100%",
				playerVars: {
					autoplay: 1,
					mute: 1,
					playsinline: 1,
					rel: 0,
					modestbranding: 1,
					controls: 0,
					disablekb: 1,
					fs: 0,
					iv_load_policy: 3,
					_r: count,
				},
				events: {
					onReady: () => {
						if (destroyed) return;
						clearLoadingTimeout();
						setVideoError(null);
						setIsVideoLoading(false);
						setIsPlaying(true);
						setIsMuted(true);
					},
					onStateChange: (event: YT.OnStateChangeEvent) => {
						if (destroyed) return;
						if (event.data === window.YT.PlayerState.ENDED) {
							setIsPlaying(false);
							triggerVideoEnd();
						} else if (event.data === window.YT.PlayerState.PLAYING) {
							setIsPlaying(true);
						} else if (event.data === window.YT.PlayerState.PAUSED) {
							setIsPlaying(false);
						}
					},
					onError: (event: YT.OnErrorEvent) => {
						console.error("[YT] player error:", event.data);
						clearLoadingTimeout();
						setIsVideoLoading(false);
						setVideoError("YouTube 無法播放這段教學影片，請重新載入。");
					},
				},
			});

			playerRef.current = player;
		}

		hasEndedRef.current = false;
		setIsVideoEnded(false);
		setIsVideoLoading(true);
		setVideoError(null);

		// API already loaded — create player immediately
		if (window.YT?.Player) {
			createPlayer(replayCount);
			return () => {
				destroyed = true;
				clearLoadingTimeout();
				if (playerRef.current) {
					playerRef.current.destroy();
					playerRef.current = null;
				}
			};
		}

		// API not loaded yet — set global callback BEFORE injecting script
		const prevCallback = window.onYouTubeIframeAPIReady;
		window.onYouTubeIframeAPIReady = () => {
			prevCallback?.();
			createPlayer(replayCount);
		};

		if (
			!document.querySelector(
				'script[src="https://www.youtube.com/iframe_api"]',
			)
		) {
			const tag = document.createElement("script");
			tag.src = "https://www.youtube.com/iframe_api";
			tag.onerror = () => {
				if (destroyed) return;
				clearLoadingTimeout();
				setIsVideoLoading(false);
				setVideoError("無法連線至 YouTube，請檢查網路後重試。");
				tag.remove();
			};
			document.head.appendChild(tag);
		}

		// Polling fallback: if the callback was missed, periodically check
		const pollId = setInterval(() => {
			if (destroyed || playerRef.current) {
				clearInterval(pollId);
				return;
			}
			if (window.YT?.Player) {
				clearInterval(pollId);
				createPlayer(replayCount);
			}
		}, 500);

		return () => {
			destroyed = true;
			clearLoadingTimeout();
			clearInterval(pollId);
			if (playerRef.current) {
				playerRef.current.destroy();
				playerRef.current = null;
			}
		};
	}, [videoId, showVideo, containerReady, replayCount, triggerVideoEnd]);

	const replayVideo = useCallback(() => {
		if (!window.YT?.Player) {
			document
				.querySelector('script[src="https://www.youtube.com/iframe_api"]')
				?.remove();
		}
		hasEndedRef.current = false;
		setIsVideoEnded(false);
		setIsVideoLoading(true);
		setVideoError(null);
		setReplayCount((c) => c + 1);
	}, []);

	const togglePlay = useCallback(() => {
		const player = playerRef.current;
		if (!player) return;
		try {
			const state = player.getPlayerState();
			if (state === window.YT?.PlayerState?.PLAYING) {
				player.pauseVideo();
				setIsPlaying(false);
			} else {
				player.playVideo();
				setIsPlaying(true);
			}
		} catch (e) {
			console.warn("[YT] togglePlay failed:", e);
		}
	}, []);

	const toggleMute = useCallback(() => {
		const player = playerRef.current;
		if (!player) return;
		try {
			if (player.isMuted()) {
				player.unMute();
				setIsMuted(false);
			} else {
				player.mute();
				setIsMuted(true);
			}
		} catch (e) {
			console.warn("[YT] toggleMute failed:", e);
		}
	}, []);

	return {
		videoContainerRef,
		setContainerRef,
		isVideoLoading,
		isVideoEnded,
		videoError,
		isPlaying,
		isMuted,
		togglePlay,
		toggleMute,
		replayVideo,
		finishLoading: () => setIsVideoLoading(false),
		triggerVideoEnd,
	};
}
