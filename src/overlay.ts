type Keypoint = {
	x: number;
	y: number;
	score?: number;
	name?: string;
};

type PoseResult = {
	keypoints?: Keypoint[];
	box?: { x: number; y: number; width: number; height: number };
	score?: number;
};

export function drawOverlay(
	ctx: CanvasRenderingContext2D,
	result: PoseResult | null,
) {
	if (!ctx) return;

	if (!result) return;

	if (result.box) {
		const { x, y, width: w, height: h } = result.box;
		ctx.strokeStyle = "#5eead4";
		ctx.lineWidth = 2;
		ctx.strokeRect(x, y, w, h);
	}

	if (result.keypoints && Array.isArray(result.keypoints)) {
		for (const kp of result.keypoints) {
			if ((kp.score ?? 1) > 0.3) {
				ctx.beginPath();
				ctx.arc(kp.x, kp.y, 4, 0, 2 * Math.PI);
				ctx.fillStyle = "#5eead4";
				ctx.fill();
			}
		}
	}
}
