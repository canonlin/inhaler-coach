export function distance(a, b) {
	const dx = a.x - b.x;
	const dy = a.y - b.y;
	const dz = (a.z || 0) - (b.z || 0);
	return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

export function distance2D(a, b) {
	const dx = a.x - b.x;
	const dy = a.y - b.y;
	return Math.sqrt(dx * dx + dy * dy);
}

export function midpoint(a, b) {
	return {
		x: (a.x + b.x) / 2,
		y: (a.y + b.y) / 2,
		z: ((a.z || 0) + (b.z || 0)) / 2,
	};
}

export function angle(a, vertex, c) {
	const v1 = { x: a.x - vertex.x, y: a.y - vertex.y };
	const v2 = { x: c.x - vertex.x, y: c.y - vertex.y };
	const dot = v1.x * v2.x + v1.y * v2.y;
	const mag1 = Math.sqrt(v1.x * v1.x + v1.y * v1.y);
	const mag2 = Math.sqrt(v2.x * v2.x + v2.y * v2.y);
	if (mag1 === 0 || mag2 === 0) return 0;
	return (
		Math.acos(Math.min(1, Math.max(-1, dot / (mag1 * mag2)))) * (180 / Math.PI)
	);
}

export function clamp(val, min, max) {
	return Math.min(max, Math.max(min, val));
}

export function lerp(a, b, t) {
	return a + (b - a) * t;
}

export function mapRange(value, inMin, inMax, outMin, outMax) {
	return ((value - inMin) / (inMax - inMin)) * (outMax - outMin) + outMin;
}
