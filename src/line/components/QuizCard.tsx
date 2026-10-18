/**
 * One knowledge question: options, then the verdict.
 *
 * Correctness comes from the bank (quizzes.json → correctAnswer); the two
 * follow-ups are the spec's (開發構想 docx 肆節): a pass earns full marks plus
 * the return-visit model test notice, a miss gets comfort plus the video link.
 * The video link has no video behind it yet, so it says exactly that.
 */

import { useState } from "react";

export interface QuizOption {
	id: string;
	text: string;
}

export interface QuizQuestion {
	id: string;
	question: string;
	options: QuizOption[];
	correctAnswer: string;
	explanation: string;
}

export interface QuizAnswer {
	questionId: string;
	pickedOption: string;
	isCorrect: boolean;
}

export function QuizCard({
	q,
	onAnswer,
}: {
	q: QuizQuestion;
	onAnswer?: (ans: QuizAnswer) => void;
}) {
	const [picked, setPicked] = useState<string | null>(null);
	const correct = picked === q.correctAnswer;

	function handlePick(optionId: string) {
		setPicked(optionId);
		onAnswer?.({
			questionId: q.id,
			pickedOption: optionId,
			isCorrect: optionId === q.correctAnswer,
		});
	}

	return (
		<fieldset>
			<legend className="text-base font-bold text-text">{q.question}</legend>
			<div className="mt-3 flex flex-col gap-2">
				{q.options.map((o) => {
					const isAnswer = o.id === q.correctAnswer;
					const isPick = picked === o.id;
					return (
						<button
							key={o.id}
							type="button"
							disabled={picked !== null}
							onClick={() => handlePick(o.id)}
							aria-pressed={isPick}
							className={[
								"rounded-md border px-4 py-3 text-left text-base font-bold",
								"focus-visible:outline-2 focus-visible:outline-ring",
								"disabled:cursor-default",
								picked === null
									? "border-border bg-surface text-text"
									: isAnswer
										? "border-success bg-success-soft text-text"
										: isPick
											? "border-danger bg-danger-soft text-text"
											: "border-border-subtle bg-surface text-text-muted",
							].join(" ")}
						>
							{o.id}. {o.text}
						</button>
					);
				})}
			</div>
			{picked !== null && (
				<div
					role="status"
					className="mt-3 rounded-md bg-surface-muted px-4 py-4"
				>
					<p className="text-base font-bold text-text">
						{correct ? "滿分！" : "沒關係，很多人第一次都選這個。"}
					</p>
					<p className="mt-1 text-base text-text">{q.explanation}</p>
					<p className="mt-2 text-base text-text-secondary">
						{correct
							? "註：回診時會用實體模型再測一次，算進分數。"
							: "註：對應的操作影片準備中，做好會補在這裡。"}
					</p>
				</div>
			)}
		</fieldset>
	);
}
