const $ = (id) => document.getElementById(id);

export function setWebcamSize(width, height) {
	const canvas = $("webcam-canvas");
	canvas.width = width;
	canvas.height = height;
}

const POSE_CONNECTIONS = [
	[11, 12],
	[11, 13],
	[13, 15],
	[12, 14],
	[14, 16],
	[11, 23],
	[12, 24],
	[23, 24],
	[23, 25],
	[24, 26],
	[25, 27],
	[26, 28],
	[27, 29],
	[28, 30],
	[29, 31],
	[30, 32],
];

const HAND_CONNECTIONS = [
	[0, 1],
	[1, 2],
	[2, 3],
	[3, 4],
	[0, 5],
	[5, 6],
	[6, 7],
	[7, 8],
	[5, 9],
	[9, 10],
	[10, 11],
	[11, 12],
	[9, 13],
	[13, 14],
	[14, 15],
	[15, 16],
	[13, 17],
	[17, 18],
	[18, 19],
	[19, 20],
	[0, 17],
];

export function drawLandmarks(ctx, landmarks, color, radius = 2) {
	if (!landmarks) return;
	const w = ctx.canvas.width;
	const h = ctx.canvas.height;
	ctx.fillStyle = color;
	for (const p of landmarks) {
		ctx.beginPath();
		ctx.arc(p.x * w, p.y * h, radius, 0, 2 * Math.PI);
		ctx.fill();
	}
}

export function drawConnections(
	ctx,
	landmarks,
	connections,
	color,
	lineWidth = 1,
) {
	if (!landmarks) return;
	const w = ctx.canvas.width;
	const h = ctx.canvas.height;
	ctx.strokeStyle = color;
	ctx.lineWidth = lineWidth;
	for (const [a, b] of connections) {
		const pa = landmarks[a];
		const pb = landmarks[b];
		if (!pa || !pb) continue;
		ctx.beginPath();
		ctx.moveTo(pa.x * w, pa.y * h);
		ctx.lineTo(pb.x * w, pb.y * h);
		ctx.stroke();
	}
}

export function drawPoseLandmarks(ctx, landmarks) {
	if (!landmarks) return;
	drawConnections(ctx, landmarks, POSE_CONNECTIONS, "#3b82f6", 2);
	drawLandmarks(ctx, landmarks, "#60a5fa", 3);
}

export function drawHandLandmarks(ctx, landmarks) {
	if (!landmarks) return;
	drawConnections(ctx, landmarks, HAND_CONNECTIONS, "#22c55e", 1.5);
	drawLandmarks(ctx, landmarks, "#4ade80", 2);
}

export function drawFaceLandmarks(ctx, landmarks) {
	if (!landmarks) return;
	const faceOval = [
		10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365, 379,
		378, 400, 377, 152, 148, 176, 149, 150, 136, 172, 58, 132, 93, 234, 127,
		162, 21, 54, 103, 67, 109, 10,
	];
	const conns = [];
	for (let i = 0; i < faceOval.length - 1; i++) {
		conns.push([faceOval[i], faceOval[i + 1]]);
	}
	drawConnections(ctx, landmarks, conns, "rgba(255,255,255,0.15)", 1);
}
