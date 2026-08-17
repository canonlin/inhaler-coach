const BARS = [
	{ id: "wave-0", offset: 0, delay: "0s" },
	{ id: "wave-13", offset: 13, delay: "0.15s" },
	{ id: "wave-26", offset: 26, delay: "0.3s" },
	{ id: "wave-39", offset: 39, delay: "0.45s" },
	{ id: "wave-52", offset: 52, delay: "0.6s" },
	{ id: "wave-65", offset: 65, delay: "0.75s" },
	{ id: "wave-78", offset: 78, delay: "0.9s" },
];

export function LoadingWave() {
	return (
		<div className="w-full text-center">
			<svg
				aria-label="載入中"
				width="84"
				height="32"
				viewBox="0 0 84 32"
				className="inline-block text-primary/70 mx-auto"
			>
				{BARS.map((bar) => (
					<rect
						key={bar.id}
						x={bar.offset}
						y="12"
						width="6"
						height="8"
						rx="3"
						fill="currentColor"
					>
						<animate
							attributeName="height"
							values="8;20;8"
							dur="1s"
							repeatCount="indefinite"
							begin={bar.delay}
						/>
						<animate
							attributeName="y"
							values="12;6;12"
							dur="1s"
							repeatCount="indefinite"
							begin={bar.delay}
						/>
					</rect>
				))}
			</svg>
		</div>
	);
}
