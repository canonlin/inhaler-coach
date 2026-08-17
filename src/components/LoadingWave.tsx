export function LoadingWave() {
	return (
		<div className="w-full text-center">
			<svg
				width="84"
				height="32"
				viewBox="0 0 84 32"
				className="inline-block text-primary/70 mx-auto"
			>
				{Array.from({ length: 7 }).map((_, i) => (
					<rect
						key={i}
						x={i * 13}
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
							begin={`${i * 0.15}s`}
						/>
						<animate
							attributeName="y"
							values="12;6;12"
							dur="1s"
							repeatCount="indefinite"
							begin={`${i * 0.15}s`}
						/>
					</rect>
				))}
			</svg>
		</div>
	);
}
