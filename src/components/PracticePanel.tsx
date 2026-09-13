import { useEffect, useRef, useState, type KeyboardEvent } from "react";
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
// Holding Enter must not check a newly focused answer or skip its explanation.
function preventHeldKey(event: KeyboardEvent<HTMLElement>) {
  if (event.repeat && ["Enter", " "].includes(event.key))
    event.preventDefault();
}
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
  const [draft, setDraft] = useState<QuizChoice["id"] | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const panel = useRef<HTMLElement>(null);
  const firstChoice = useRef<HTMLInputElement>(null);
  const action = useRef<HTMLButtonElement>(null);
  const startButton = useRef<HTMLButtonElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const resetButton = useRef<HTMLButtonElement>(null);
  const keepButton = useRef<HTMLButtonElement>(null);
  const focusIntent = useRef<"question" | "action" | "start" | null>(null);
  const item = session
    ? topic.quizItems.find((q) => q.id === session.itemIds[session.index])
    : undefined;
  const answer = session?.answers.find((a) => a.itemId === item?.id);
  useEffect(() => {
    setDraft(null);
    setShowHint(false);
    setConfirmReset(false);
  }, [item?.id, session?.id]);
  useEffect(() => {
    if (focusIntent.current === "question") {
      if (session?.complete) heading.current?.focus();
      else firstChoice.current?.focus();
      if (panel.current && panel.current.getBoundingClientRect().top < 80) {
        panel.current.scrollIntoView({
          block: "start",
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
            .matches
            ? "instant"
            : "smooth",
        });
      }
    } else if (focusIntent.current === "action") action.current?.focus();
    else if (focusIntent.current === "start") startButton.current?.focus();
    focusIntent.current = null;
  }, [session, answer]);
  useEffect(() => {
    if (confirmReset) keepButton.current?.focus();
  }, [confirmReset]);
  const correct =
    session?.answers.filter(
      (a) =>
        topic.quizItems.find((q) => q.id === a.itemId)?.answerId ===
        a.selectedAnswer,
    ).length ?? 0;
  const score = session?.answers.length
    ? Math.round((correct / session.answers.length) * 100)
    : 0;
  const start = () => {
    focusIntent.current = "question";
    onStart();
  };
  const check = (choice = draft) => {
    if (!session || !item || answer || !choice) return;
    focusIntent.current = "action";
    onAnswer(session.id, item.id, choice);
  };
  const next = () => {
    if (!session || !answer) return;
    focusIntent.current = "question";
    onNext(session.id);
  };
  return (
    <section
      ref={panel}
      aria-label="Topic practice"
      className="practice-panel panel-enter"
      onKeyDown={preventHeldKey}
    >
      {!session ? (
        <>
          <p className="eyebrow">Practice · {topic.title}</p>
          <h1>
            A little practice.
            <br />A stronger foundation.
          </h1>
          <p className="lead">
            Take what you’ve learned and try it out, one question at a time.
          </p>
          <dl className="session-facts">
            <div>
              <dt>20</dt>
              <dd>questions</dd>
            </div>
            <div>
              <dt>No timer</dt>
              <dd>go at your pace</dd>
            </div>
            <div>
              <dt>16 correct</dt>
              <dd>to complete the topic</dd>
            </div>
          </dl>
          <button
            ref={startButton}
            className="button primary"
            onClick={start}
            type="button"
          >
            Start 20-question practice <span aria-hidden="true">→</span>
          </button>
          <p className="session-note">
            Your place and checked answers are saved on this browser. Each
            session draws from {topic.quizItems.length} questions.
          </p>
          <KeyboardGuide />
        </>
      ) : session.complete ? (
        <>
          <p className="eyebrow">Session complete · {topic.title}</p>
          <h1 ref={heading} tabIndex={-1}>
            You scored {correct}/{session.answers.length}{" "}
            <span className="score-percent">· {score}%</span>
          </h1>
          <p className="lead">
            {score >= PASSING_ACCURACY
              ? "Session passed. This topic is complete."
              : progress?.isCompleted
                ? "This session needs more practice. Your earlier passing result is still saved."
                : "Every attempt helps. Review your answers and aim for 16 correct next time."}
          </p>
          <div className="result-actions">
            <button className="button primary" onClick={start} type="button">
              Practice again
            </button>
            {onContinue && (
              <button
                className="button secondary"
                onClick={onContinue}
                type="button"
              >
                Next topic <span aria-hidden="true">→</span>
              </button>
            )}
          </div>
          <div className="answer-review">
            <h2>Review your answers</h2>
            <p className="muted">Open a question to see the explanation.</p>
            {session.answers.map((a, index) => {
              const q = topic.quizItems.find((q) => q.id === a.itemId)!;
              const selected = q.choices.find(
                (c) => c.id === a.selectedAnswer,
              )!;
              const expected = q.choices.find((c) => c.id === q.answerId)!;
              return (
                <details className="review-item" key={q.id}>
                  <summary>
                    <span className="review-number">{index + 1}</span>
                    <span>{q.prompt}</span>
                    <span
                      className={
                        a.selectedAnswer === q.answerId
                          ? "review-correct"
                          : "review-wrong"
                      }
                    >
                      {a.selectedAnswer === q.answerId ? "Correct" : "Review"}
                    </span>
                  </summary>
                  <div className="disclosure-content">
                    <p>
                      Your answer: <strong>{selected.text}</strong>. Correct
                      answer: <strong>{expected.text}</strong>.
                    </p>
                    <p>{q.explanation}</p>
                  </div>
                </details>
              );
            })}
          </div>
          <button
            ref={resetButton}
            className="text-button reset-button"
            onClick={() => setConfirmReset(true)}
            type="button"
          >
            Reset topic progress
          </button>
          {confirmReset && (
            <div className="notice reset-notice" role="alert">
              <p>
                Clear all saved practice and completion for {topic.title} on
                this browser?
              </p>
              <div className="result-actions">
                <button
                  ref={keepButton}
                  className="button secondary"
                  onClick={() => {
                    setConfirmReset(false);
                    resetButton.current?.focus();
                  }}
                  type="button"
                >
                  Keep progress
                </button>
                <button
                  className="button primary"
                  onClick={() => {
                    focusIntent.current = "start";
                    onReset();
                    setConfirmReset(false);
                  }}
                  type="button"
                >
                  Clear this topic
                </button>
              </div>
            </div>
          )}
        </>
      ) : item ? (
        <>
          <p className="eyebrow">{topic.title}</p>
          <div className="question-meta">
            <h1 className="question-count">
              Question {session.index + 1} <span>of {REQUIRED_QUIZ_ITEMS}</span>
            </h1>
            <span>
              {session.answers.length}{" "}
              {session.answers.length === 1 ? "answer" : "answers"} saved
            </span>
          </div>
          <progress
            max={REQUIRED_QUIZ_ITEMS}
            value={session.answers.length}
            aria-label="Session progress"
          />
          <fieldset
            className="question-options"
            aria-describedby="answer-instructions"
          >
            <legend>{item.prompt}</legend>
            <p id="answer-instructions" className="answer-instructions">
              Choose one answer, then check it.
            </p>
            {item.choices.map((choice, index) => {
              const right = choice.id === item.answerId;
              const selected = choice.id === (answer?.selectedAnswer ?? draft);
              return (
                <label
                  className={`answer-option ${selected ? "selected" : ""} ${answer ? (right ? "is-correct" : selected ? "is-incorrect" : "is-muted") : ""}`}
                  key={choice.id}
                >
                  <input
                    ref={index === 0 ? firstChoice : undefined}
                    type="radio"
                    name={`answer-${session.id}-${item.id}`}
                    value={choice.id}
                    checked={selected}
                    disabled={!!answer}
                    onChange={() => setDraft(choice.id)}
                    onKeyDown={(event) => {
                      if (
                        event.key !== "Enter" ||
                        event.altKey ||
                        event.ctrlKey ||
                        event.metaKey ||
                        event.shiftKey
                      )
                        return;
                      event.preventDefault();
                      if (!event.repeat) check(choice.id);
                    }}
                  />
                  <span className="choice-letter" aria-hidden="true">
                    {choice.id}
                  </span>
                  <span className="choice-text">{choice.text}</span>
                  {answer && (right || selected) && (
                    <span className="answer-label">
                      {right ? "Correct answer" : "Your answer"}
                    </span>
                  )}
                </label>
              );
            })}
          </fieldset>
          <div
            aria-live="polite"
            aria-atomic="true"
            className={`feedback-wrap ${answer || showHint ? "expanded" : ""}`}
            onTransitionEnd={(event) => {
              // Expansion can move the focused action below a small viewport.
              if (
                event.target === event.currentTarget &&
                event.propertyName === "grid-template-rows" &&
                answer &&
                document.activeElement === action.current
              ) {
                action.current?.scrollIntoView({
                  block: "nearest",
                  behavior: "smooth",
                });
              }
            }}
          >
            <div>
              <div
                className={`answer-feedback ${answer?.selectedAnswer === item.answerId ? "correct-feedback" : ""}`}
              >
                {(answer || showHint) && (
                  <>
                    <strong>
                      {answer
                        ? answer.selectedAnswer === item.answerId
                          ? "That’s right."
                          : "Not quite. Here’s why."
                        : "A little hint"}
                    </strong>
                    <p>{answer ? item.explanation : item.hint}</p>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="question-actions">
            <button
              className="text-button"
              onClick={() => setShowHint((v) => !v)}
              aria-expanded={showHint}
              type="button"
              disabled={!!answer}
            >
              {showHint ? "Hide hint" : "Show hint"}
            </button>
            <button
              ref={action}
              className="button primary"
              disabled={!answer && !draft}
              onClick={() => (answer ? next() : check())}
              type="button"
            >
              {answer
                ? session.index === session.itemIds.length - 1
                  ? "Finish session"
                  : "Next question"
                : "Check answer"}
              <span aria-hidden="true">{answer ? "→" : "↵"}</span>
            </button>
          </div>
          <KeyboardGuide answered={!!answer} />
        </>
      ) : (
        <p role="alert">
          This saved question is unavailable.{" "}
          <button className="text-button" onClick={onReset} type="button">
            Clear this topic and start again
          </button>
          .
        </p>
      )}
    </section>
  );
}
function KeyboardGuide({ answered = false }: { answered?: boolean }) {
  return (
    <p className="keyboard-guide">
      <span>
        <kbd>↑</kbd> <kbd>↓</kbd> Choose
      </span>
      <span>
        <kbd>Enter</kbd> {answered ? "Next" : "Check"}
      </span>
      <span>
        <kbd>Tab</kbd> Move between controls
      </span>
    </p>
  );
}
