/**
 * Videos page: videos.html + videos.js, migrated.
 *
 * Same data (videos.json), same empty/error states, minus the load failure
 * mode: the JSON is bundled, so "載入失敗請稍後再試" cannot happen. All four
 * entries are currently preparing (see VideoCard), which this page states
 * once up front instead of four times.
 */

import { VideoCard, type VideoEntry } from "../components/VideoCard";
import videos from "../data/videos.json";
import { LineShell } from "../LineShell";

const VIDEOS = videos as VideoEntry[];

export function VideosPage() {
	return (
		<LineShell title="觀看影片">
			<p className="text-base text-text-secondary">
				註：操作影片由藥劑部提供中，目前顯示的是即將上架的清單。
			</p>
			<div className="mt-4 flex flex-col gap-3">
				{VIDEOS.map((v) => (
					<VideoCard key={v.id} video={v} />
				))}
			</div>
		</LineShell>
	);
}
