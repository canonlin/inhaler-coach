/**
 * Quiz page: quiz.html + quiz.js, migrated.
 *
 * Same bank (quizzes.json: one inhalation question per device), same device
 * picker, same missing-bank state ("此類型目前尚無測驗題目"). Answering
 * behaviour lives in QuizCard; this page only owns which device is showing.
 */

import { useEffect, useState } from "react";
import {
	type QuizAnswer,
	QuizCard,
	type QuizQuestion,
} from "../components/QuizCard";
import quizzes from "../data/quizzes.json";
import { LINE_DEVICE_LABELS, type LineDevice } from "../devices";
import { LineShell } from "../LineShell";
import { getLiffContext } from "../liff";

const BANK = quizzes as Record<LineDevice, QuizQuestion[]>;
const DEVICES = Object.keys(BANK) as LineDevice[];

export function QuizPage() {
	const [device, setDevice] = useState<LineDevice>("MDI");
	const [lineUserId, setLineUserId] = useState<string | null>(null);
	const q = BANK[device]?.[0];

	useEffect(() => {
		getLiffContext().then((ctx) => {
			if (ctx.userId) setLineUserId(ctx.userId);
		});
	}, []);

	function handleAnswer(ans: QuizAnswer) {
		if (!lineUserId) return;
		fetch("/api/line/event", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				events: [
					{
						webhookEventId: `quiz-${Date.now()}-${ans.questionId}`,
						type: "quiz_answer",
						source: { userId: lineUserId },
						payload: {
							questionId: ans.questionId,
							pickedOption: ans.pickedOption,
							isCorrect: ans.isCorrect,
							device,
						},
					},
				],
			}),
		}).catch(() => {
			// Non-blocking telemetry
		});
	}

	return (
		<LineShell title="學習測驗">
			<fieldset>
				<legend className="text-base font-bold text-text">裝置分類</legend>
				<div className="mt-2 flex gap-2">
					{DEVICES.map((t) => (
						<button
							key={t}
							type="button"
							onClick={() => setDevice(t)}
							aria-pressed={device === t}
							className={`rounded-full border px-4 py-2 text-base font-bold focus-visible:outline-2 focus-visible:outline-ring ${
								device === t
									? "border-primary bg-primary text-primary-foreground"
									: "border-border bg-surface text-text-secondary"
							}`}
						>
							{LINE_DEVICE_LABELS[t]}
						</button>
					))}
				</div>
			</fieldset>
			<div className="mt-4">
				{q ? (
					<QuizCard key={q.id} q={q} onAnswer={handleAnswer} />
				) : (
					<p className="text-base text-text-secondary">
						此類型目前尚無測驗題目。
					</p>
				)}
			</div>
		</LineShell>
	);
}
