/**
 * Videos page: the films a patient can actually watch.
 *
 * The films are the Taiwan Society of Pulmonary and Critical Care Medicine's
 * own instruction manual, plus the hospital pharmacist's Taiwanese versions.
 * The page groups them by the kind of inhaler, because that is how the
 * patient knows which one is theirs.
 */

import { VideoCard, type VideoEntry } from "../components/VideoCard";
import videos from "../data/videos.json";
import { LineShell } from "../LineShell";

const VIDEOS = videos as VideoEntry[];

const DEVICE_LABEL: Record<string, string> = {
	MDI: "定量噴霧吸入器（按壓式）",
	DPI: "乾粉吸入器",
	SMI: "軟霧吸入器",
};

function groupVideos(list: VideoEntry[]) {
	const groups = new Map<string, VideoEntry[]>();
	for (const video of list) {
		const key = video.type || "其他";
		const bucket = groups.get(key) ?? [];
		bucket.push(video);
		groups.set(key, bucket);
	}
	return [...groups.entries()];
}

export function VideosPage() {
	return (
		<LineShell title="觀看影片">
			<p className="text-base text-text-secondary">
				註：以下操作示範影片由台灣胸腔暨重症加護醫學會與本院藥劑部提供，
				依您使用的吸入劑種類與語言挑選觀看。
			</p>
			<div className="mt-4 flex flex-col gap-6">
				{groupVideos(VIDEOS).map(([device, list]) => (
					<section key={device} aria-label={DEVICE_LABEL[device] ?? device}>
						<h2 className="mb-2 text-base font-bold text-text">
							{DEVICE_LABEL[device] ?? device}
						</h2>
						<div className="flex flex-col gap-3">
							{list.map((v) => (
								<VideoCard key={v.id} video={v} />
							))}
						</div>
					</section>
				))}
			</div>
		</LineShell>
	);
}
