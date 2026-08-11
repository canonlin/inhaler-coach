const $ = (id) => document.getElementById(id);

export function resetDots() {
	for (let i = 1; i <= 4; i++) {
		const dot = $(`side-dot-${i}`);
		if (dot) {
			dot.className =
				"w-16 h-16 rounded-full border-[3px] border-danger bg-danger/10 flex items-center justify-center relative transition-all duration-300";
		}
		const line = $(`side-line-${i}`);
		if (line) {
			line.className = "w-0.5 h-5 bg-border my-2 transition-all duration-300";
		}
	}
}

export function updateDots(stageIdx) {
	for (let i = 0; i < 4; i++) {
		const dot = $(`side-dot-${i + 1}`);
		const line = $(`side-line-${i + 1}`);
		const relIdx = stageIdx - 1;

		if (i < relIdx) {
			dot.className =
				"w-16 h-16 rounded-full border-[3px] border-success bg-success/10 flex items-center justify-center relative transition-all duration-300";
			dot.innerHTML = `<span class="text-2xl">${dot.querySelector("span")?.textContent || ""}</span>`;
			if (line)
				line.className =
					"w-0.5 h-5 bg-success my-2 transition-all duration-300";
		} else if (i === relIdx) {
			dot.className =
				"w-16 h-16 rounded-full border-[3px] border-primary bg-primary/10 flex items-center justify-center relative transition-all duration-300";
			if (line)
				line.className = "w-0.5 h-5 bg-border my-2 transition-all duration-300";
		} else {
			dot.className =
				"w-16 h-16 rounded-full border-[3px] border-danger bg-danger/10 flex items-center justify-center relative transition-all duration-300";
			if (line)
				line.className = "w-0.5 h-5 bg-border my-2 transition-all duration-300";
		}
	}
}

export function markDotDone(dotIdx) {
	const dot = $(`side-dot-${dotIdx}`);
	if (dot) {
		dot.className =
			"w-16 h-16 rounded-full border-[3px] border-success bg-success/10 flex items-center justify-center relative transition-all duration-300";
		dot.innerHTML = `<span class="text-2xl">${dot.querySelector("span")?.textContent || ""}</span>`;
	}
	const line = $(`side-line-${dotIdx}`);
	if (line)
		line.className = "w-0.5 h-5 bg-success my-2 transition-all duration-300";
}

export function initDotsAsPending() {
	for (let i = 1; i <= 4; i++) {
		const dot = $(`side-dot-${i}`);
		dot.classList.remove("done", "active");
	}
}

export function setActiveDotOnly(stageNum) {
	for (let i = 1; i <= 4; i++) {
		const dot = $(`side-dot-${i}`);
		if (i === stageNum) {
			dot.className =
				"w-16 h-16 rounded-full border-[3px] border-primary bg-primary/10 flex items-center justify-center relative transition-all duration-300";
		} else {
			dot.className =
				"w-16 h-16 rounded-full border-[3px] border-danger bg-danger/10 flex items-center justify-center relative transition-all duration-300";
		}
	}
}

export function showSideProgress() {
	$("side-progress").classList.remove("hidden");
	$("stage-topbar").classList.remove("hidden");
}

export function hideSideProgress() {
	$("side-progress").classList.add("hidden");
	$("stage-topbar").classList.add("hidden");
}
