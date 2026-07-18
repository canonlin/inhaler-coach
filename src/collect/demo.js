/**
 * An animated demonstration of each task.
 *
 * Written instructions are not enough for a movement. "輕輕慢搖" and "用力快搖"
 * describe the same gesture at different amplitudes and speeds, and no wording
 * conveys how small "小幅度" is meant to be — the pharmacist testing this said
 * exactly that, and they were right. So each task shows the motion instead of
 * describing it, at the amplitude and tempo the recording actually wants.
 *
 * It's an SVG inhaler driven by CSS keyframes, not a video: nothing to record,
 * nothing to host, and the parameters live next to the task definition rather
 * than baked into a file somebody would have to re-shoot to change them.
 */

const INHALER_SVG = `
<svg viewBox="0 0 60 110" width="72" height="132" aria-hidden="true">
  <rect x="18" y="4" width="24" height="42" rx="5" fill="#cbd5e1"/>
  <rect x="18" y="4" width="24" height="10" rx="5" fill="#94a3b8"/>
  <path d="M14 44 h32 a4 4 0 0 1 4 4 v34 a4 4 0 0 1 -4 4 h-32 a4 4 0 0 1 -4 -4 v-34 a4 4 0 0 1 4 -4 z" fill="#ef4444"/>
  <rect x="20" y="86" width="20" height="18" rx="3" fill="#f8fafc"/>
</svg>`;

/**
 * Describes the movement in words as well as showing it.
 *
 * The animation can be missed — and on a machine with reduce-motion enabled it
 * was, entirely — so the amplitude and tempo are also stated in text. Tasks that
 * aren't about moving the inhaler get their own caption: an earlier version
 * captioned 吐氣 and 說話 as "完全靜止", which describes the inhaler and tells the
 * person nothing about what to do.
 */
function caption(demo) {
	if (demo.breathe) return "吐氣（吸入器不用動）";
	if (demo.speak) return "說話（吸入器不用動）";
	if (demo.steadyPress)
		return `${demo.atMouth ? "含住吸嘴、" : "拿在胸前、"}拿穩不動，慢慢按 ${demo.presses ?? 5} 下`;
	if (demo.press) return "搖 → 噴 → 搖 → 噴";
	if (!demo.periodMs) return "完全靜止";
	if (demo.putDown) return "放下 → 拿起，重複";
	if (demo.drift) return "慢慢平移、旋轉，不要上下";

	const perSecond = (1000 / demo.periodMs).toFixed(1);
	const size =
		demo.translate >= 0.7
			? "大幅度"
			: demo.translate >= 0.4
				? "中等幅度"
				: "小幅度";
	return `${size}上下，每秒約 ${perSecond} 次`;
}

/**
 * @param {HTMLElement} container
 * @param {object} demo - the task's demo spec (see protocol.js)
 */
export function renderDemo(container, demo) {
	const moving = Boolean(demo.periodMs);

	container.innerHTML = `
    <div class="demo-stage">
      ${moving && !demo.drift && !demo.putDown ? '<div class="demo-arrow demo-arrow-up">▲</div>' : ""}
      <div class="demo-inhaler">${INHALER_SVG}</div>
      ${moving && !demo.drift && !demo.putDown ? '<div class="demo-arrow demo-arrow-down">▼</div>' : ""}
      ${demo.press || demo.steadyPress ? '<div class="demo-puff">💨</div>' : ""}
      ${demo.atMouth ? '<div class="demo-mouth" aria-hidden="true">👄</div>' : ""}
      ${demo.breathe ? '<div class="demo-breath">😮‍💨</div>' : ""}
      ${demo.speak ? '<div class="demo-speak">💬</div>' : ""}
    </div>
    <div class="demo-caption">${caption(demo)}</div>`;

	if (!moving) return;

	const inhaler = container.querySelector(".demo-inhaler");
	inhaler.style.setProperty(
		"--demo-travel",
		`${(demo.translate ?? 0) * 100}px`,
	);
	inhaler.style.setProperty("--demo-spin", `${demo.rotate ?? 0}deg`);

	const keyframes = demo.putDown
		? "demo-putdown"
		: demo.drift
			? "demo-drift"
			: "demo-shake";
	inhaler.style.animation = `${keyframes} ${demo.periodMs}ms ease-in-out infinite`;
}

export function clearDemo(container) {
	container.innerHTML = "";
}

/** @param {HTMLElement} container */
export function togglePaused(container) {
	container.classList.toggle("demo-paused");
	return container.classList.contains("demo-paused");
}
