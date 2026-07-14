const $ = (id) => document.getElementById(id);

const STATUS_BASE =
	"py-3 px-6 rounded-lg text-center text-base font-bold transition-colors duration-200";

export function setStatusWaiting() {
	const box = $("status-box");
	box.className = `${STATUS_BASE} border border-border bg-surface text-text-secondary`;
	box.textContent = "等待操作中...";
	$("status-wrap").classList.remove("hidden");
}

export function setStatusDetecting(text) {
	const box = $("status-box");
	box.className = `${STATUS_BASE} border border-primary bg-primary/10 text-primary`;
	box.textContent = text;
	$("status-wrap").classList.remove("hidden");
}

export function setStatusSuccess(text) {
	const box = $("status-box");
	box.className = `${STATUS_BASE} border border-success bg-success/10 text-success`;
	box.textContent = text;
	$("status-wrap").classList.remove("hidden");
}

export function setStatusFail(text) {
	const box = $("status-box");
	box.className = `${STATUS_BASE} border border-danger bg-danger/10 text-danger`;
	box.textContent = text;
	$("status-wrap").classList.remove("hidden");
}

export function hideStatus() {
	$("status-wrap").classList.add("hidden");
}

export function setOverlay(state) {
	const overlay = $("webcam-overlay");
	const base =
		"absolute inset-0 rounded-lg pointer-events-none border-2 border-transparent transition-all duration-300";
	if (state === "correct") {
		overlay.className = `${base} border-success`;
	} else if (state === "wrong") {
		overlay.className = `${base} border-danger`;
	} else {
		overlay.className = base;
	}
}

export function showCountdown(num) {
	const el = $("countdown-display");
	el.textContent = num;
	$("countdown-wrap").classList.remove("hidden");
}

export function hideCountdown() {
	$("countdown-wrap").classList.add("hidden");
}

export function updateResultBars(predictions) {
	const colors = [
		"#3b82f6",
		"#22c55e",
		"#f59e0b",
		"#ef4444",
		"#8b5cf6",
		"#06b6d4",
	];
	let html = "";
	predictions.forEach((p, i) => {
		const pct = Math.round(p.probability * 100);
		const _color = colors[i % colors.length];
		html += `
      <div class="flex items-center gap-3">
        <div class="text-sm font-bold min-w-[80px] text-text-secondary">${p.className}</div>
        <div class="flex-1 h-5 bg-surface-light rounded overflow-hidden">
          <div class="h-full rounded transition-[width] duration-200 bg-primary" style="width:${pct}%"></div>
        </div>
        <div class="text-sm font-bold min-w-[40px] text-right text-primary">${pct}%</div>
      </div>`;
	});
	$("ai-results").innerHTML = html;
}
