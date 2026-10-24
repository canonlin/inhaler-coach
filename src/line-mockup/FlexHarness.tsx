/**
 * LINE Official Flex Message Simulator Test Harness.
 *
 * PURPOSE:
 * 1. Pixel-perfect rendering using official LINE Flex Message Simulator specification.
 * 2. Strict schema verification using validateFlexContainer() to eliminate any hallucinated formatting.
 * 3. Interactive action dispatcher supporting native Postback & Message events.
 * 4. Developer & Pharmacist inspectability: 1-click JSON inspector and verification badge.
 */

import {
	type FlexContainer,
	FlexMessagePreview,
	validateFlexContainer,
} from "line-flex-message-renderer";
import {
	AlertTriangle,
	Check,
	CheckCircle2,
	ChevronLeft,
	ChevronRight,
	Code,
	Copy,
} from "lucide-react";
import type React from "react";
import { useEffect, useMemo, useRef, useState } from "react";

export interface FlexActionPayload {
	type: string;
	label?: string;
	data?: string;
	displayText?: string;
	text?: string;
	uri?: string;
}

export interface FlexHarnessProps {
	json: unknown;
	onAction?: (action: FlexActionPayload, bubbleIndex?: number) => void;
	showInspector?: boolean;
	className?: string;
}

/**
 * A node inside a Flex container, as far as the action lookup cares.
 *
 * The JSON comes from outside, so it arrives as `unknown`. The lookup only
 * needs an `action` and a `text`, and walks whatever else is there.
 */
type FlexNode = {
	action?: FlexActionPayload;
	text?: string;
};

function findActionInNode(
	node: unknown,
	label: string,
): FlexActionPayload | null {
	if (!node || typeof node !== "object") return null;

	const record = node as FlexNode & Record<string, unknown>;
	const action = record.action;
	if (action && (action.label === label || record.text === label)) {
		return action;
	}

	for (const key of Object.keys(record)) {
		const val = record[key];
		if (Array.isArray(val)) {
			for (const item of val) {
				const found = findActionInNode(item, label);
				if (found) return found;
			}
		} else if (typeof val === "object") {
			const found = findActionInNode(val, label);
			if (found) return found;
		}
	}

	return null;
}

/** A carousel container, as far as this harness cares. */
function asCarouselContainer(value: unknown): {
	type?: string;
	contents?: unknown[];
} | null {
	if (!value || typeof value !== "object") return null;
	return value as { type?: string; contents?: unknown[] };
}

export const FlexHarness: React.FC<FlexHarnessProps> = ({
	json,
	onAction,
	showInspector = false,
	className = "",
}) => {
	const [isOpenJson, setIsOpenJson] = useState(false);
	const [copied, setCopied] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);
	const isDraggingRef = useRef(false);

	// Strict Schema Validation against official LINE Flex specification
	const validationResult = useMemo(() => {
		return validateFlexContainer(json);
	}, [json]);

	const isCarousel = asCarouselContainer(json)?.type === "carousel";

	// Enable natural mouse click-and-drag swipe & horizontal wheel scroll on Carousel
	useEffect(() => {
		const root = containerRef.current;
		if (!root || !isCarousel) return;
		const el = root.querySelector("div[style*='overflow']") as HTMLElement;
		if (!el) return;

		let isDown = false;
		let startX = 0;
		let scrollLeft = 0;

		const onMouseDown = (e: MouseEvent) => {
			if (e.button !== 0) return;
			isDown = true;
			isDraggingRef.current = false;
			startX = e.pageX - el.offsetLeft;
			scrollLeft = el.scrollLeft;
			el.style.cursor = "grabbing";
			el.style.userSelect = "none";
		};

		const onMouseMove = (e: MouseEvent) => {
			if (!isDown) return;
			const x = e.pageX - el.offsetLeft;
			const walk = x - startX;
			if (Math.abs(walk) > 5) {
				isDraggingRef.current = true;
			}
			el.scrollLeft = scrollLeft - walk;
		};

		const onMouseUp = () => {
			if (!isDown) return;
			isDown = false;
			el.style.cursor = "grab";
			el.style.removeProperty("user-select");
			setTimeout(() => {
				isDraggingRef.current = false;
			}, 60);
		};

		const onMouseLeave = () => {
			if (!isDown) return;
			isDown = false;
			el.style.cursor = "grab";
			el.style.removeProperty("user-select");
			setTimeout(() => {
				isDraggingRef.current = false;
			}, 60);
		};

		const onWheel = (e: WheelEvent) => {
			if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
				e.preventDefault();
				el.scrollLeft += e.deltaY;
			}
		};

		el.style.cursor = "grab";
		el.classList.add("no-scrollbar");

		el.addEventListener("mousedown", onMouseDown);
		window.addEventListener("mousemove", onMouseMove);
		window.addEventListener("mouseup", onMouseUp);
		el.addEventListener("mouseleave", onMouseLeave);
		el.addEventListener("wheel", onWheel, { passive: false });

		return () => {
			el.removeEventListener("mousedown", onMouseDown);
			window.removeEventListener("mousemove", onMouseMove);
			window.removeEventListener("mouseup", onMouseUp);
			el.removeEventListener("mouseleave", onMouseLeave);
			el.removeEventListener("wheel", onWheel);
		};
	}, [isCarousel]);

	const handleScrollStep = (direction: "left" | "right") => {
		const root = containerRef.current;
		if (!root) return;
		const el = root.querySelector("div[style*='overflow']") as HTMLElement;
		if (!el) return;
		const delta = direction === "left" ? -260 : 260;
		el.scrollBy({ left: delta, behavior: "smooth" });
	};

	const handleContainerClick = (
		e: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>,
	) => {
		if (isDraggingRef.current) {
			e.stopPropagation();
			return;
		}

		const target = e.target as HTMLElement;
		const button = target.closest("button");
		if (!button) return;

		const label = button.innerText.trim();
		if (!label || !onAction) return;

		const container = asCarouselContainer(json);
		if (container?.type === "carousel" && Array.isArray(container.contents)) {
			// Find which bubble was clicked
			const carouselWrapper = button.closest("div[style*='scrollSnapType']");
			const bubbleDiv = button.closest("div[style*='scrollSnapAlign']");

			let bubbleIndex = 0;
			if (carouselWrapper && bubbleDiv) {
				const children = Array.from(carouselWrapper.children);
				const idx = children.indexOf(bubbleDiv);
				if (idx !== -1) bubbleIndex = idx;
			}

			const targetBubble = container.contents[bubbleIndex];
			const action = findActionInNode(targetBubble, label);
			if (action) {
				onAction(action, bubbleIndex);
				return;
			}
		}

		// Single bubble or fallback
		const action = findActionInNode(container, label);
		if (action) {
			onAction(action);
		}
	};

	const copyJson = () => {
		navigator.clipboard.writeText(JSON.stringify(json, null, 2));
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	if (!validationResult.ok) {
		return (
			<div className="rounded-xl border-2 border-red-500 bg-red-50 p-4 text-red-900 shadow-md">
				<div className="flex items-center gap-2 font-bold text-red-700">
					<AlertTriangle className="h-5 w-5 shrink-0" />
					<span>❌ LINE Flex Message 規格違規（Harness 嚴格攔截）</span>
				</div>
				<p className="mt-1 text-xs text-red-600">
					傳入的 JSON 不符合 LINE 官方 Flex Message 規範，已阻止非標準格式渲染：
				</p>
				<ul className="mt-2 list-disc pl-5 text-xs font-mono space-y-1">
					{validationResult.errors.map((err) => (
						<li key={`${err.path || "root"}-${err.message}`}>
							<strong className="text-red-800">{err.path || "root"}:</strong>{" "}
							{err.message}
						</li>
					))}
				</ul>
				<div className="mt-3">
					<button
						type="button"
						onClick={() => setIsOpenJson(!isOpenJson)}
						className="inline-flex items-center gap-1 rounded bg-red-200 px-2 py-1 text-xs font-semibold text-red-800 hover:bg-red-300"
					>
						<Code className="h-3 w-3" />
						{isOpenJson ? "隱藏違規 JSON" : "檢視違規 JSON"}
					</button>
					{isOpenJson && (
						<pre className="mt-2 max-h-60 overflow-auto rounded bg-slate-900 p-2 text-[11px] text-red-300 font-mono">
							{JSON.stringify(json, null, 2)}
						</pre>
					)}
				</div>
			</div>
		);
	}

	const container = validationResult.value as FlexContainer;

	return (
		<div className={`relative group ${className}`}>
			{/* Developer & Pharmacist Verification Indicator (Only when showInspector is true) */}
			{showInspector && (
				<div className="mb-1 flex items-center justify-between text-[10px] text-slate-500">
					<span className="inline-flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
						<CheckCircle2 className="h-3 w-3 text-emerald-600" />
						LINE Flex 官方規格認證 (Harness Pass)
					</span>
					<div className="flex items-center gap-1">
						<button
							type="button"
							onClick={() => setIsOpenJson(!isOpenJson)}
							className="hover:text-slate-800 flex items-center gap-0.5 px-1 py-0.5 rounded hover:bg-slate-200"
							title="檢視真實 LINE Flex JSON"
						>
							<Code className="h-3 w-3" />
							JSON
						</button>
						<button
							type="button"
							onClick={copyJson}
							className="hover:text-slate-800 flex items-center gap-0.5 px-1 py-0.5 rounded hover:bg-slate-200"
							title="複製 JSON 到 LINE 官方 Flex Simulator 測試"
						>
							{copied ? (
								<Check className="h-3 w-3 text-emerald-600" />
							) : (
								<Copy className="h-3 w-3" />
							)}
							{copied ? "已複製" : "複製"}
						</button>
					</div>
				</div>
			)}

			{/* Collapsible JSON Inspector */}
			{showInspector && isOpenJson && (
				<div className="mb-2 overflow-hidden rounded-lg border border-slate-700 bg-slate-900 text-slate-200 shadow-inner">
					<div className="flex items-center justify-between bg-slate-800 px-3 py-1.5 text-[11px]">
						<span className="font-mono text-emerald-400">
							Official Flex Container Schema
						</span>
						<button
							type="button"
							onClick={copyJson}
							className="text-[10px] text-slate-300 hover:text-white"
						>
							{copied ? "已複製" : "複製到剪貼簿"}
						</button>
					</div>
					<pre className="max-h-56 overflow-auto p-3 text-[10.5px] font-mono leading-relaxed text-slate-300">
						{JSON.stringify(container, null, 2)}
					</pre>
				</div>
			)}

			{/* Authentic LINE Flex Simulator Renderer */}
			<section
				ref={containerRef}
				onClick={handleContainerClick}
				onKeyDown={(e) => {
					if (e.key === "Enter" || e.key === " ") {
						handleContainerClick(e);
					}
				}}
				aria-label="LINE Flex Message Content"
				className="flex-message-container relative cursor-default"
			>
				<FlexMessagePreview json={container} />

				{/* Smooth Scroll Navigation Arrows for Carousel */}
				{isCarousel && (
					<>
						<button
							type="button"
							onClick={(e) => {
								e.stopPropagation();
								handleScrollStep("left");
							}}
							className="absolute -left-2 top-1/2 -translate-y-1/2 z-20 flex h-7 w-7 items-center justify-center rounded-full bg-slate-900/60 text-white shadow-md hover:bg-slate-900/90 active:scale-95 transition-all"
							title="向左滑動"
							aria-label="Previous card"
						>
							<ChevronLeft className="h-4 w-4" />
						</button>
						<button
							type="button"
							onClick={(e) => {
								e.stopPropagation();
								handleScrollStep("right");
							}}
							className="absolute -right-2 top-1/2 -translate-y-1/2 z-20 flex h-7 w-7 items-center justify-center rounded-full bg-slate-900/60 text-white shadow-md hover:bg-slate-900/90 active:scale-95 transition-all"
							title="向右滑動"
							aria-label="Next card"
						>
							<ChevronRight className="h-4 w-4" />
						</button>
					</>
				)}
			</section>
		</div>
	);
};
