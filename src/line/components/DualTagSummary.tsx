/**
 * The dual-tag result: what the backend filed this registration under.
 *
 * tag1 (device) + tag2 (role) are built by validate.ts → buildDualTags, the
 * same shape app.js wrote into tag1/tag2. This component only renders them;
 * it never computes them.
 */

export function DualTagSummary({
	tag1,
	tag2,
	drugNames,
}: {
	tag1: string;
	tag2: string;
	drugNames: string[];
}) {
	return (
		<section
			aria-label="建檔結果"
			className="rounded-md border border-border-subtle bg-success-soft px-4 py-4"
		>
			<p className="text-base font-bold text-text">
				建檔成功，D0 衛教會接著發送。
			</p>
			<ul className="mt-2 flex flex-col gap-1">
				{drugNames.map((n) => (
					<li key={n} className="text-base text-text">
						{n}
					</li>
				))}
			</ul>
			<p className="mt-2 text-base text-text">{tag1}</p>
			<p className="mt-1 text-base text-text">{tag2}</p>
		</section>
	);
}
