const $ = (id) => document.getElementById(id);

const SCREEN_SHOW =
	"flex flex-col items-center justify-center min-h-screen p-6 w-full box-border";

export function showScreen(id) {
	document.querySelectorAll(".screen").forEach((s) => {
		s.classList.add("hidden");
		SCREEN_SHOW.split(" ").forEach((c) => {
			s.classList.remove(c);
		});
	});
	const target = $(id);
	target.classList.remove("hidden");
	if (id !== "screen-stage") {
		SCREEN_SHOW.split(" ").forEach((c) => {
			target.classList.add(c);
		});
	}
}

export function showVideoSection() {
	$("video-section").classList.remove("hidden");
	$("ai-section").classList.add("hidden");
}

export function showAISection() {
	$("video-section").classList.add("hidden");
	$("ai-section").classList.remove("hidden");
}

export function setVideoLabel(text) {
	$("video-label-text").textContent = text;
}

export function setTopbarText(text) {
	$("stage-topbar").textContent = text;
}

export function setTopbarVisible(visible) {
	$("stage-topbar").classList[visible ? "remove" : "add"]("hidden");
}

export function setTopbarLeft(left) {
	const el = $("stage-topbar");
	el.classList.remove("left-0", "left-[120px]");
	el.classList.add(left === "0" ? "left-0" : "left-[120px]");
}

export function setStagePaddingLeft(px) {
	const el = $("screen-stage");
	el.classList.remove("pl-0", "pl-[130px]");
	el.classList.add(px === "0" ? "pl-0" : "pl-[130px]");
}

export function setStageHeaderVisible(visible) {
	$("stage-header").classList[visible ? "remove" : "add"]("hidden");
}

export function setStageBadge(text, className) {
	const badge = $("stage-badge");
	badge.textContent = text;
	badge.className = `inline-block px-4 py-1 rounded text-xs font-bold text-text-secondary mb-2 ${className}`;
}

export function setStageTitle(text, className) {
	const title = $("stage-title");
	title.textContent = text;
	title.className = `text-[clamp(28px,5vw,44px)] font-black text-text leading-tight ${className}`;
}

export function setStageHint(text) {
	const hint = $("stage-hint");
	const wrap = $("stage-hint-wrap");
	hint.textContent = text;
	if (text) {
		wrap.classList.remove("hidden");
	} else {
		wrap.classList.add("hidden");
	}
}

export function setModelLabel(text) {
	$("ai-model-label").textContent = text;
}

export function resetButtons() {
	$("btn-next").classList.add("hidden");
	$("btn-pharmacist").classList.add("hidden");
	$("btn-retry").classList.add("hidden");
	resetBtnTry();
}

export function resetBtnTry() {
	const btn = $("btn-try");
	const wrap = $("btn-try-wrap");
	wrap.classList.add("hidden");
	btn.className =
		"px-8 py-4 rounded-xl border-none text-lg font-bold cursor-pointer transition-all duration-300 bg-success text-black shadow-2xl shadow-success/40 hover:scale-105 pointer-events-auto";
	btn.textContent = "開始挑戰 →";
	btn.onclick = null;
}

export function setBtnTryVisible() {
	$("btn-try-wrap").classList.remove("hidden");
}

export function setBtnTryLocked(seconds) {
	const btn = $("btn-try");
	const wrap = $("btn-try-wrap");
	wrap.classList.remove("hidden");
	btn.textContent = `請先觀看影片（${seconds} 秒後解鎖）`;
	btn.className =
		"px-8 py-4 rounded-xl border border-border bg-surface text-text-secondary text-lg font-bold cursor-not-allowed pointer-events-none";
	btn.onclick = null;
}

export function setBtnTryUnlocked(text, onClick) {
	const btn = $("btn-try");
	const wrap = $("btn-try-wrap");
	wrap.classList.remove("hidden");
	btn.textContent = text;
	btn.className =
		"px-8 py-4 rounded-xl border-none text-lg font-bold cursor-pointer transition-all duration-300 bg-success text-black shadow-2xl shadow-success/40 hover:scale-105 pointer-events-auto";
	btn.onclick = onClick;
}

export function showPharmacistBtn() {
	$("btn-pharmacist").classList.remove("hidden");
}

export function showRetryBtn() {
	$("btn-retry").classList.remove("hidden");
}

export function hideRetryBtn() {
	$("btn-retry").classList.add("hidden");
}

export function showNextBtn(text, onClick) {
	const btn = $("btn-next");
	btn.textContent = text;
	btn.classList.remove("hidden");
	btn.onclick = onClick;
}

export function hideNextBtn() {
	$("btn-next").classList.add("hidden");
}
