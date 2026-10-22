/**
 * One video row. Renders state, never fetches: readiness was decided by the
 * backend long before this page loads.
 *
 * The films are the society's own instruction films (and the hospital
 * pharmacist's), so the row says where it came from and how long it runs —
 * a patient should know whose voice they are about to listen to. A film that
 * is not live is shown disabled with its status, not hidden: hiding it would
 * make the menu entry a lie.
 */

export interface VideoEntry {
	id: string;
	title: string;
	description?: string;
	scope?: string;
	type?: string | null;
	drugId?: string | null;
	lang?: string;
	durationSeconds?: number;
	source?: string;
	sourceUrl?: string;
	videoUrl: string | null;
	thumbnailUrl?: string;
	status: string;
}

/** A film is playable when the backend published it. */
function isLive(status: string) {
	return status === "active" || status === "ready";
}

/** The language label a patient reads before pressing play. */
export function languageLabel(lang?: string): string {
	switch (lang) {
		case "nan-TW":
			return "台語版";
		case "hak-TW":
			return "客語版";
		case "eng-TW":
			return "英文版";
		default:
			return "國語版";
	}
}

/** Seconds into "2 分 22 秒". */
export function formatDuration(seconds?: number): string {
	if (!seconds || seconds <= 0) return "";
	const min = Math.floor(seconds / 60);
	const sec = Math.round(seconds % 60);
	if (!min) return `${sec} 秒`;
	return sec ? `${min} 分 ${sec} 秒` : `${min} 分鐘`;
}

export function VideoCard({ video }: { video: VideoEntry }) {
	const url = isLive(video.status) ? video.videoUrl : null;
	const duration = formatDuration(video.durationSeconds);
	const meta = [
		languageLabel(video.lang),
		duration,
		video.source ? `來源：${video.source}` : "",
	]
		.filter(Boolean)
		.join("・");

	return (
		<article
			aria-label={video.title}
			className="rounded-md border border-border-subtle bg-surface px-4 py-4"
		>
			{video.thumbnailUrl ? (
				<img
					src={video.thumbnailUrl}
					alt=""
					loading="lazy"
					className="mb-3 aspect-video w-full rounded-md object-cover"
				/>
			) : null}
			<h2 className="text-base font-bold text-text">{video.title}</h2>
			{meta ? <p className="mt-1 text-sm text-text-secondary">{meta}</p> : null}
			{video.description ? (
				<p className="mt-1 text-base text-text-secondary">
					{video.description}
				</p>
			) : null}
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
