/**
 * One video row. Renders state, never fetches: readiness was decided by the
 * backend (line_messaging.py → is_video_ready) long before this page loads.
 * A preparing video is shown disabled with its status, not hidden — hiding it
 * would make the menu entry a lie.
 */

export interface VideoEntry {
	id: string;
	title: string;
	description: string;
	status: string;
	videoUrl: string | null;
}

export function VideoCard({ video }: { video: VideoEntry }) {
	const url = video.status === "ready" ? video.videoUrl : null;
	return (
		<article
			aria-label={video.title}
			className="rounded-md border border-border-subtle bg-surface px-4 py-4"
		>
			<h2 className="text-base font-bold text-text">{video.title}</h2>
			<p className="mt-1 text-base text-text-secondary">{video.description}</p>
			{url ? (
				<a
					href={url}
					target="_blank"
					rel="noreferrer"
					className="mt-3 inline-block rounded-md bg-primary px-4 py-2 text-base font-bold text-primary-foreground focus-visible:outline-2 focus-visible:outline-ring"
				>
					播放影片
				</a>
			) : (
				<p className="mt-3 text-base font-bold text-warning">
					準備中（藥師提供影片後會在這裡播）
				</p>
			)}
		</article>
	);
}
