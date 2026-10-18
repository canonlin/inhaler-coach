/**
 * LIFF home: the three entries from the pharmacist's index.html nav.
 *
 * 開始衛教 → registration (education.html), 觀看影片 → videos.html,
 * 學習測驗 → quiz.html. Descriptions are shortened to one line each; the
 * originals live in the legacy package, the wording here is new.
 */

import { Link } from "react-router-dom";

const ENTRIES = [
	{
		to: "/line/register",
		title: "開始衛教",
		desc: "建立資料並選擇吸入劑",
	},
	{
		to: "/line/videos",
		title: "觀看影片",
		desc: "MDI、DPI、SMI 操作教學",
	},
	{
		to: "/line/quiz",
		title: "學習測驗",
		desc: "吸氣、清潔與漱口觀念",
	},
];

export function LineHome() {
	return (
		<main className="mx-auto min-h-screen w-full max-w-md bg-bg px-5 pt-10 pb-10 text-text">
			<h1 className="text-lg font-bold">吸入劑衛教</h1>
			<p className="mt-1 text-base text-text-secondary">
				雲林醫院藥劑部。選一項開始。
			</p>
			<nav aria-label="衛教主選單" className="mt-5 flex flex-col gap-3">
				{ENTRIES.map((e) => (
					<Link
						key={e.to}
						to={e.to}
						className="flex items-center gap-3 rounded-md border border-border-subtle bg-surface px-4 py-4 focus-visible:outline-2 focus-visible:outline-ring"
					>
						<span className="flex-1">
							<span className="block text-base font-bold">{e.title}</span>
							<span className="mt-0.5 block text-base text-text-secondary">
								{e.desc}
							</span>
						</span>
						<span aria-hidden="true" className="text-lg text-text-muted">
							›
						</span>
					</Link>
				))}
			</nav>
		</main>
	);
}
