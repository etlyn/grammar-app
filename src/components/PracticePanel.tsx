import { useEffect, useRef, useState } from "react";
import type { GrammarTopic, QuizChoice, TopicProgress } from "../types/grammar";
import type { PracticeSession } from "../utils/learningState";
import { REQUIRED_QUIZ_ITEMS, PASSING_ACCURACY } from "../constants/learning";

type Props = {
  topic: GrammarTopic;
  progress?: TopicProgress;
  session?: PracticeSession;
  onStart: () => void;
  onAnswer: (
    sessionId: string,
    itemId: string,
    choice: QuizChoice["id"],
  ) => void;
  onNext: (sessionId: string) => void;
  onReset: () => void;
  onContinue?: () => void;
};
const button =
  "rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50";
const secondary =
  "rounded-2xl border border-indigo-200 bg-white px-5 py-3 text-sm font-bold text-indigo-700 hover:bg-indigo-50";
export function PracticePanel({
  topic,
  progress,
  session,
  onStart,
  onAnswer,
  onNext,
  onReset,
  onContinue,
}: Props) {
  const [showHint, setShowHint] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    setShowHint(false);
    setConfirmReset(false);
  }, [topic.slug, session?.index, session?.id]);
  const item = session
    ? topic.quizItems.find((q) => q.id === session.itemIds[session.index])
    : undefined;
  const answer = session?.answers.find((a) => a.itemId === item?.id);
  const correct =
    session?.answers.filter(
      (a) =>
        topic.quizItems.find((q) => q.id === a.itemId)?.answerId ===
        a.selectedAnswer,
    ).length ?? 0;
  const score = session?.answers.length
    ? Math.round((correct / session.answers.length) * 100)
    : 0;
  const next = () => {
    if (!session) return;
    onNext(session.id);
    requestAnimationFrame(() => heading.current?.focus());
  };
  const reset = () => {
    onReset();
    setConfirmReset(false);
  };
  return (
    <section
      aria-label="Topic practice"
      className="relative overflow-hidden rounded-[2.5rem] border border-indigo-100 bg-white p-5 shadow-soft sm:p-8"
    >
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-500">
        {topic.title} · Practice
      </p>
      {!session ? (
        <>
          <h2 ref={heading} tabIndex={-1} className="mt-3 text-3xl font-black">
            Build confidence, one session at a time.
          </h2>
          <p className="mt-3 max-w-2xl leading-7 text-slate-600">
            20 questions from a bank of {topic.quizItems.length}. Score 16 or
            more to complete this topic. Your answers and place are saved on
            this browser.
          </p>
          <button className={`${button} mt-6`} onClick={onStart} type="button">
            Start 20-question practice
          </button>
        </>
      ) : session.complete ? (
        <>
          <h2 ref={heading} tabIndex={-1} className="mt-3 text-3xl font-black">
            You scored {correct}/{session.answers.length} · {score}%
          </h2>
          <p className="mt-3 leading-7 text-slate-600">
            {score >= PASSING_ACCURACY
              ? "Session passed. This topic is complete."
              : progress?.isCompleted
                ? "This session needs more practice. Your earlier passing result is still saved."
                : "Review the explanations, then try another session. Aim for 16 correct answers."}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button className={button} onClick={onStart} type="button">
              Practice again
            </button>
            {onContinue && (
              <button className={secondary} onClick={onContinue} type="button">
                Next topic
              </button>
            )}
            <button
              className={secondary}
              onClick={() => setConfirmReset(true)}
              type="button"
            >
              Reset topic progress
            </button>
          </div>
          {confirmReset && (
            <div role="alert" className="mt-4 rounded-2xl bg-amber-50 p-4">
              <p>
                Clear all saved practice and completion for {topic.title} on
                this browser?
              </p>
              <div className="mt-3 flex gap-3">
                <button className={button} onClick={reset} type="button">
                  Clear this topic
                </button>
                <button
                  className={secondary}
                  onClick={() => setConfirmReset(false)}
                  type="button"
                >
                  Keep progress
                </button>
              </div>
            </div>
          )}
          <h3 className="mt-8 text-xl font-bold">Review your answers</h3>
          <div className="mt-4 space-y-3">
            {session.answers.map((a, index) => {
              const q = topic.quizItems.find((q) => q.id === a.itemId)!;
              const selected = q.choices.find(
                (c) => c.id === a.selectedAnswer,
              )!;
              const expected = q.choices.find((c) => c.id === q.answerId)!;
              return (
                <article
                  key={q.id}
                  className="rounded-2xl border border-indigo-100 bg-indigo-50/30 p-4"
                >
                  <p className="text-xs font-bold text-indigo-700">
                    Question {index + 1} ·{" "}
                    {a.selectedAnswer === q.answerId ? "Correct" : "Review"}
                  </p>
                  <p className="mt-2 font-semibold">{q.prompt}</p>
                  <p className="mt-2 text-sm">
                    Your answer: {selected.text}. Correct answer:{" "}
                    {expected.text}.
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {q.explanation}
                  </p>
                </article>
              );
            })}
          </div>
        </>
      ) : item ? (
        <>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <h2 ref={heading} tabIndex={-1} className="text-2xl font-black">
              Question {session.index + 1} of {REQUIRED_QUIZ_ITEMS}
            </h2>
            <span className="text-xs font-semibold text-slate-500">
              {session.answers.length} answers saved
            </span>
          </div>
          <progress
            className="mt-4 h-2 w-full accent-indigo-600"
            max={REQUIRED_QUIZ_ITEMS}
            value={session.answers.length}
            aria-label="Session progress"
          />
          <p className="mt-6 rounded-3xl bg-indigo-50/60 p-5 text-xl font-semibold leading-9 sm:text-2xl">
            {item.prompt}
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {item.choices.map((choice) => {
              const right = choice.id === item.answerId;
              const selected = choice.id === answer?.selectedAnswer;
              const color = answer
                ? right
                  ? "border-emerald-300 bg-emerald-50 text-emerald-950"
                  : selected
                    ? "border-orange-300 bg-orange-50 text-orange-950"
                    : "border-slate-100 text-slate-500"
                : "border-indigo-100 hover:border-indigo-400 hover:bg-indigo-50";
              return (
                <button
                  className={`rounded-2xl border p-4 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-600 ${color}`}
                  disabled={!!answer}
                  onClick={() => onAnswer(session.id, item.id, choice.id)}
                  type="button"
                  key={choice.id}
                >
                  <span className="mr-3 font-black">{choice.id}</span>
                  {choice.text}
                  {answer && (right || selected) && (
                    <span className="ml-2 text-xs font-bold">
                      {right ? "Correct answer" : "Your answer"}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          <div className="mt-5 flex flex-wrap justify-between gap-3">
            <button
              className={secondary}
              onClick={() => setShowHint((v) => !v)}
              aria-expanded={showHint}
              type="button"
            >
              {showHint ? "Hide hint" : "Show hint"}
            </button>
            <button
              className={button}
              disabled={!answer}
              onClick={next}
              type="button"
            >
              {session.index === session.itemIds.length - 1
                ? "Finish session"
                : "Next question"}
            </button>
          </div>
          <div aria-live="polite" aria-atomic="true">
            {(answer || showHint) && (
              <div className="mt-5 rounded-2xl bg-amber-50 p-5 text-sm leading-6 text-amber-950">
                <p className="font-bold">
                  {answer
                    ? answer.selectedAnswer === item.answerId
                      ? "Correct"
                      : "Not quite"
                    : "Hint"}
                </p>
                <p>{answer ? item.explanation : item.hint}</p>
              </div>
            )}
          </div>
          <p className="mt-4 text-xs text-slate-500">
            Skill: {item.skill?.replaceAll("-", " ")} · Original practice based
            on the references below.
          </p>
        </>
      ) : (
        <p role="alert">
          This saved question is unavailable.{" "}
          <button onClick={onReset} type="button">
            Clear this topic and start again
          </button>
          .
        </p>
      )}
    </section>
  );
}
