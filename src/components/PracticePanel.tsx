import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import type {
  GrammarTopic,
  QuizChoice,
  QuizItem,
  TopicProgress,
} from "../types/grammar";
import { RichText } from "./RichText";
import type { PracticeSession } from "../utils/learningState";
import { REQUIRED_QUIZ_ITEMS, PASSING_ACCURACY } from "../constants/learning";
import { Icon, Tile } from "./rebrand/Brand";
import "./rebrand/practice.css";

type Props = {
  topic: GrammarTopic;
  courseId?: "en" | "es";
  onClose?: () => void;
  onRead?: () => void;
  storageNote?: string;
  blocked?: string;
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
export function PracticePanel({
  topic,
  courseId = "en",
  onClose,
  onRead,
  storageNote = "Your place and checked answers are saved on this browser.",
  blocked,
  progress,
  session,
  onStart,
  onAnswer,
  onNext,
  onReset,
  onContinue,
}: Props) {
  const [resultFilter, setResultFilter] = useState<"all" | "review">("all");
  const [draft, setDraft] = useState<QuizChoice["id"] | null>(null);
  const [reviewIndex, setReviewIndex] = useState<number | null>(null);
  const shiftAlone = useRef(false);
  const [showHint, setShowHint] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const panel = useRef<HTMLElement>(null);
  const firstChoice = useRef<HTMLInputElement>(null);
  const action = useRef<HTMLButtonElement>(null);
  const startButton = useRef<HTMLButtonElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const resetButton = useRef<HTMLButtonElement>(null);
  const keepButton = useRef<HTMLButtonElement>(null);
  const focusIntent = useRef<
    "question" | "restore" | "action" | "start" | null
  >(null);
  const displayIndex = reviewIndex ?? session?.index ?? 0;
  const item = session
    ? topic.quizItems.find((q) => q.id === session.itemIds[displayIndex])
    : undefined;
  const answer = session?.answers.find((a) => a.itemId === item?.id);
  useLayoutEffect(() => {
    setDraft(null);
    setShowHint(false);
    setConfirmReset(false);
  }, [session?.index, session?.id]);
  useEffect(() => {
    setShowHint(false);
  }, [item?.id]);
  useEffect(() => {
    setReviewIndex(null);
    setResultFilter("all");
  }, [session?.id]);
  useEffect(() => {
    if (
      focusIntent.current === "question" ||
      focusIntent.current === "restore"
    ) {
      if (session?.complete) heading.current?.focus();
      else if (answer) action.current?.focus();
      else if (focusIntent.current === "restore")
        (
          panel.current?.querySelector<HTMLInputElement>(
            'input[type="radio"]:checked',
          ) ?? firstChoice.current
        )?.focus();
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
  }, [session, answer, reviewIndex]);
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
    if (blocked) return;
    focusIntent.current = "question";
    setReviewIndex(null);
    onStart();
  };
  const check = (choice = draft) => {
    if (!session || !item || answer || !choice || blocked) return;
    focusIntent.current = "action";
    onAnswer(session.id, item.id, choice);
  };
  const next = () => {
    if (!session || !answer) return;
    if (reviewIndex !== null) {
      focusIntent.current = "restore";
      setReviewIndex(reviewIndex + 1 < session.index ? reviewIndex + 1 : null);
      return;
    }
    focusIntent.current = "question";
    onNext(session.id);
  };
  const previous = () => {
    if (!session || displayIndex === 0) return;
    focusIntent.current = "action";
    setReviewIndex(displayIndex - 1);
  };
  const keys = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "Shift") {
      if (!event.repeat)
        shiftAlone.current = !event.ctrlKey && !event.altKey && !event.metaKey;
      return;
    }
    shiftAlone.current = false;
    if (
      event.repeat &&
      ["Enter", " ", "ArrowRight", "ArrowLeft"].includes(event.key)
    ) {
      event.preventDefault();
      return;
    }
    if (
      !session ||
      session.complete ||
      confirmReset ||
      !item ||
      event.altKey ||
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey
    )
      return;
    const target = event.target as HTMLElement;
    // Disclosure controls retain their standard Enter/Space behaviour.
    if (
      target.closest("details") ||
      target.closest("a, textarea, select, input:not([type=radio])")
    )
      return;
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      previous();
    }
    if (
      event.key === "ArrowRight" ||
      (event.key === "Enter" &&
        (target.matches("input[type=radio]") ||
          target === action.current ||
          target === panel.current))
    ) {
      event.preventDefault();
      answer ? next() : check();
    }
  };
  const results =
    session?.answers.map(
      (saved) =>
        topic.quizItems.find((question) => question.id === saved.itemId)
          ?.answerId === saved.selectedAnswer,
    ) ?? [];
  const toReview = (session?.answers.length ?? 0) - correct;
  const passed = score >= PASSING_ACCURACY;
  const stage = Math.max(
    1,
    Math.min(6, Number.parseInt(topic.stage ?? "1", 10) || 1),
  );
  const prompt = item
    ? splitPracticePrompt(item.prompt)
    : { instruction: "", sentence: "" };
  const answerText =
    answer && item
      ? item.choices.find((choice) => choice.id === item.answerId)?.text
      : undefined;
  const pieces = completedSentence(prompt.sentence, answerText);
  const primaryLabel = answer
    ? reviewIndex !== null
      ? reviewIndex + 1 === session?.index
        ? "Return to current question"
        : "Next saved answer"
      : session?.index === (session?.itemIds.length ?? 20) - 1
        ? "Finish session"
        : "Next question"
    : "Check answer";
  const resetControl = (
    <div className="rb-practice-reset">
      <button
        ref={resetButton}
        className="rb-practice-quiet-button reset-button"
        onClick={() => setConfirmReset(true)}
        type="button"
      >
        Reset chapter progress
      </button>
      {confirmReset && (
        <div className="rb-practice-reset-confirm" role="alert">
          <h3>Reset this chapter?</h3>
          <p>
            Clear saved practice and completion for {topic.title}? Your other
            chapters stay as they are.
          </p>
          <div className="rb-practice-paired-actions">
            <button
              ref={keepButton}
              className="rb-button secondary"
              onClick={() => {
                setConfirmReset(false);
                resetButton.current?.focus();
              }}
              type="button"
            >
              Keep progress
            </button>
            <button
              className="rb-button"
              onClick={() => {
                focusIntent.current = "start";
                onReset();
                setConfirmReset(false);
              }}
              type="button"
            >
              Clear this chapter
            </button>
          </div>
        </div>
      )}
    </div>
  );
  return (
    <section
      ref={panel}
      aria-label="Topic practice"
      className={`rb-practice-session ${session?.complete ? "rb-practice-complete" : ""}`}
      onKeyDown={keys}
      onKeyUp={(event) => {
        if (event.key === "Shift") {
          if (
            shiftAlone.current &&
            session &&
            !session.complete &&
            !answer &&
            !confirmReset
          )
            setShowHint(true);
          shiftAlone.current = false;
        }
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null))
          shiftAlone.current = false;
      }}
      tabIndex={-1}
    >
      <div className="rb-practice-session-header">
        {onClose && (
          <button
            className="rb-practice-icon-button"
            type="button"
            aria-label="Close practice"
            onClick={onClose}
          >
            <Icon name="close" size={22} />
          </button>
        )}
        {session && !session.complete ? (
          <div className="rb-practice-session-status">
            <div className="rb-practice-status-caption">
              <h1 className="question-count">
                Question {displayIndex + 1}{" "}
                <span>of {REQUIRED_QUIZ_ITEMS}</span>
                {reviewIndex !== null && <span> · review</span>}
              </h1>
              {results.length > 0 && (
                <span className="rb-practice-correct-text">
                  {correct} correct{reviewIndex === null ? " so far" : ""}
                </span>
              )}
            </div>
            <SessionSegments
              results={results}
              current={displayIndex}
              reviewing={reviewIndex !== null}
            />
          </div>
        ) : (
          <strong>{session?.complete ? "Session complete" : "Practice"}</strong>
        )}
        {session && !session.complete && (
          <button
            className={`rb-practice-icon-button ${showHint && !answer ? "active-hint" : ""}`}
            onClick={() => setShowHint((value) => !value)}
            aria-label={showHint ? "Hide hint" : "Show hint"}
            aria-expanded={showHint}
            disabled={Boolean(answer)}
            type="button"
          >
            <Icon name="bulb" size={21} />
          </button>
        )}
      </div>
      {blocked && (
        <p role="status" className="rb-practice-blocked">
          {blocked}
        </p>
      )}
      {!session ? (
        <div className="rb-practice-intro">
          <div className="rb-practice-intro-title">
            <div className="rb-practice-intro-eyebrow">
              <Tile stage={stage} size={32} />
              <p>Practice · Chapter {topic.order}</p>
            </div>
            <h1>{topic.title}</h1>
            <p>
              Take what you’ve learned and try it out, one question at a time.
            </p>
          </div>
          <dl className="rb-practice-session-facts">
            <div>
              <dt>20</dt>
              <dd>questions</dd>
            </div>
            <div>
              <dt>No timer</dt>
              <dd>go at your pace</dd>
            </div>
            <div>
              <dt>16</dt>
              <dd>correct to complete</dd>
            </div>
          </dl>
          {Boolean(progress?.completedSessions) && (
            <div className="rb-practice-pills">
              {progress?.isCompleted && (
                <span className="complete">Chapter complete</span>
              )}
              <span>Last {progress?.lastScore ?? 0}%</span>
              <span>Best {progress?.bestScore ?? 0}%</span>
              <span>
                {progress?.completedSessions}{" "}
                {progress?.completedSessions === 1 ? "session" : "sessions"}
              </span>
            </div>
          )}
          <p className="rb-practice-session-note">
            {storageNote} Each session draws from {topic.quizItems.length}{" "}
            questions, balancing skills and favouring ones you have not seen.
          </p>
          <div className="rb-practice-intro-actions">
            <button
              ref={startButton}
              className="button primary rb-practice-primary"
              onClick={start}
              disabled={Boolean(blocked)}
              type="button"
            >
              Start 20-question practice <Icon name="arrowRight" size={19} />
            </button>
            {Boolean(progress?.total) && resetControl}
          </div>
          <KeyboardGuide />
        </div>
      ) : session.complete ? (
        <div className="rb-practice-results">
          <div className="rb-practice-result-hero">
            <div
              className={`rb-practice-score-ring ${passed ? "passed" : ""}`}
              role="heading"
              aria-level={2}
              aria-label={`You scored ${correct}/${session.answers.length} · ${score}%`}
            >
              <svg viewBox="0 0 168 168" aria-hidden="true">
                <circle className="rb-score-track" cx="84" cy="84" r="75" />
                <circle
                  className="rb-score-value"
                  cx="84"
                  cy="84"
                  r="75"
                  pathLength="100"
                  strokeDasharray="100"
                  strokeDashoffset={100 - score}
                />
              </svg>
              <div aria-hidden="true">
                <strong>{score}%</strong>
                <span>
                  {correct} of {session.answers.length}
                </span>
              </div>
            </div>
            <div>
              <h1 ref={heading} tabIndex={-1}>
                {passed ? "Chapter complete" : "Not there yet"}
              </h1>
              <p>
                {passed
                  ? `Session passed. ${topic.title} is now complete.`
                  : progress?.isCompleted
                    ? "This session needs more practice. Your earlier passing result is still saved."
                    : "Every attempt helps. Review your answers and aim for 16 correct next time."}
              </p>
            </div>
          </div>
          <SessionSegments results={results} />
          <div className="rb-practice-result-actions">
            {passed && onContinue && (
              <button
                className="button primary"
                onClick={onContinue}
                type="button"
              >
                Next chapter <Icon name="arrowRight" size={18} />
              </button>
            )}
            <button
              className={`button ${passed && onContinue ? "secondary" : "primary"}`}
              onClick={start}
              disabled={Boolean(blocked)}
              type="button"
            >
              <Icon name="refresh" size={17} /> Practice again
            </button>
            {onRead && (
              <button
                className="button secondary"
                onClick={onRead}
                type="button"
              >
                Read the chapter again
              </button>
            )}
            {!passed && onContinue && (
              <button
                className="rb-practice-quiet-button"
                onClick={onContinue}
                type="button"
              >
                Next chapter <Icon name="arrowRight" size={17} />
              </button>
            )}
          </div>
          <section
            className="rb-practice-answer-review"
            aria-labelledby="answer-review-title"
          >
            <div className="rb-practice-review-heading">
              <h2 id="answer-review-title">Review your answers</h2>
              <div
                className="rb-practice-answer-filter"
                role="group"
                aria-label="Answers shown"
              >
                <button
                  type="button"
                  aria-pressed={resultFilter === "all"}
                  onClick={() => setResultFilter("all")}
                >
                  All {session.answers.length}
                </button>
                {toReview > 0 && (
                  <button
                    type="button"
                    aria-pressed={resultFilter === "review"}
                    onClick={() => setResultFilter("review")}
                  >
                    To review {toReview}
                  </button>
                )}
              </div>
            </div>
            <div className="rb-practice-review-list">
              {session.answers.map((saved, index) => {
                const question = topic.quizItems.find(
                  (question) => question.id === saved.itemId,
                );
                if (!question || (resultFilter === "review" && results[index]))
                  return null;
                const right = saved.selectedAnswer === question.answerId;
                return (
                  <details
                    className={`rb-practice-reviewed-answer review-item ${right ? "" : "needs-review"}`}
                    key={question.id}
                  >
                    <summary>
                      <span
                        className={`rb-practice-verdict ${right ? "right" : "wrong"}`}
                        aria-hidden="true"
                      >
                        {right ? <Icon name="check" size={15} /> : "~"}
                      </span>
                      <span className="rb-practice-reviewed-prompt">
                        {index + 1}. {question.prompt}
                      </span>
                      <span
                        className={
                          right
                            ? "rb-practice-correct-text"
                            : "rb-practice-warn-text"
                        }
                      >
                        {right ? "Correct" : "Review"}
                      </span>
                      <Icon name="chevronDown" size={15} />
                    </summary>
                    <div className="rb-practice-reviewed-body">
                      <p>
                        Your answer:{" "}
                        <strong lang={courseId}>
                          {
                            question.choices.find(
                              (choice) => choice.id === saved.selectedAnswer,
                            )?.text
                          }
                        </strong>
                      </p>
                      <p>
                        Correct answer:{" "}
                        <strong
                          className="rb-practice-correct-text"
                          lang={courseId}
                        >
                          {
                            question.choices.find(
                              (choice) => choice.id === question.answerId,
                            )?.text
                          }
                        </strong>
                      </p>
                      <PracticeExplanation
                        item={question}
                        selected={saved.selectedAnswer}
                      />
                    </div>
                  </details>
                );
              })}
            </div>
          </section>
          {resetControl}
        </div>
      ) : item ? (
        <>
          <div className="rb-practice-question-body" key={item.id}>
            {reviewIndex !== null && (
              <p
                className="rb-practice-history-note history-note"
                role="status"
              >
                Reviewing a saved answer. Your current question and selection
                are kept.
              </p>
            )}
            <div className="rb-practice-question-heading">
              <p className="rb-practice-eyebrow">{topic.title}</p>
              {prompt.instruction && (
                <p className="rb-practice-instruction">{prompt.instruction}</p>
              )}
              <h2
                className="rb-practice-sentence"
                lang={courseId}
                aria-label={pieces
                  .map((piece) =>
                    piece.kind === "blank"
                      ? courseId === "es"
                        ? "espacio en blanco"
                        : "blank"
                      : piece.text,
                  )
                  .join("")}
              >
                {pieces.map((piece, index) =>
                  piece.kind === "text" ? (
                    piece.text
                  ) : (
                    <span key={index} className={`rb-sentence-${piece.kind}`}>
                      {piece.text}
                    </span>
                  ),
                )}
              </h2>
              <p
                id="answer-instructions"
                className="rb-practice-question-instructions"
              >
                Choose one answer, then check it.
              </p>
            </div>
            {showHint && !answer && (
              <div className="rb-practice-hint" role="status">
                <strong>
                  <Icon name="bulb" size={18} /> A little hint
                </strong>
                <p>
                  <RichText>{item.hint}</RichText>
                </p>
              </div>
            )}
            <fieldset
              className="rb-practice-options question-options"
              aria-describedby="answer-instructions"
            >
              <legend className="rb-practice-visually-hidden">
                {item.prompt}
              </legend>
              {item.choices.map((choice, index) => {
                const right = choice.id === item.answerId;
                const selected =
                  choice.id === (answer?.selectedAnswer ?? draft);
                return (
                  <label
                    className={`rb-practice-option answer-option ${selected ? "selected" : ""} ${answer ? (right ? "is-correct" : selected ? "is-incorrect" : "is-muted") : ""}`}
                    key={choice.id}
                  >
                    <input
                      ref={index === 0 ? firstChoice : undefined}
                      type="radio"
                      name={`answer-${session.id}-${item.id}`}
                      value={choice.id}
                      checked={selected}
                      disabled={Boolean(answer) || Boolean(blocked)}
                      onChange={() => setDraft(choice.id)}
                    />
                    <span
                      className="rb-practice-choice-badge"
                      aria-hidden="true"
                    >
                      {answer && right ? (
                        <Icon name="check" size={19} />
                      ) : (
                        choice.id
                      )}
                    </span>
                    <span className="rb-practice-choice-copy">
                      <span lang={courseId}>{choice.text}</span>
                      {answer && (right || selected) && (
                        <span className="rb-practice-answer-note">
                          {right ? "Correct answer" : "Your answer"}
                        </span>
                      )}
                    </span>
                  </label>
                );
              })}
            </fieldset>
            <p className="rb-practice-saved-count">
              {session.answers.length}{" "}
              {session.answers.length === 1 ? "answer" : "answers"} saved
            </p>
          </div>
          <div
            className={`rb-practice-session-footer ${answer ? "with-feedback" : ""} ${answer?.selectedAnswer === item.answerId ? "right" : ""}`}
          >
            {answer && (
              <div className="rb-practice-feedback-body" aria-live="polite">
                <div className="rb-practice-feedback-title">
                  <span
                    className={`rb-practice-verdict ${answer.selectedAnswer === item.answerId ? "right" : "wrong"}`}
                    aria-hidden="true"
                  >
                    {answer.selectedAnswer === item.answerId ? (
                      <Icon name="check" size={17} />
                    ) : (
                      "~"
                    )}
                  </span>
                  <h2>
                    {answer.selectedAnswer === item.answerId
                      ? "That’s right."
                      : "Not quite. Here’s why."}
                  </h2>
                </div>
                <PracticeExplanation
                  item={item}
                  selected={answer.selectedAnswer}
                />
              </div>
            )}
            <div className="rb-practice-question-actions">
              <button
                className="button secondary"
                type="button"
                onClick={previous}
                disabled={displayIndex === 0}
                aria-label="Previous answer"
              >
                <Icon name="chevronLeft" size={18} /> Back
              </button>
              <button
                ref={action}
                className="button primary"
                disabled={Boolean(blocked) || (!answer && !draft)}
                onClick={() => (answer ? next() : check())}
                type="button"
              >
                {primaryLabel}
                <Icon name={answer ? "arrowRight" : "check"} size={18} />
              </button>
            </div>
          </div>
          <KeyboardGuide answered={Boolean(answer)} />
        </>
      ) : (
        <p role="alert">
          This saved question is unavailable.{" "}
          <button
            className="rb-practice-quiet-button"
            onClick={onReset}
            type="button"
          >
            Clear this chapter and start again
          </button>
          .
        </p>
      )}
    </section>
  );
}

export function SessionSegments({
  results,
  current = -1,
  reviewing = false,
}: {
  results: boolean[];
  current?: number;
  reviewing?: boolean;
}) {
  return (
    <div
      className="rb-practice-segments"
      role="progressbar"
      aria-label="Session progress"
      aria-valuemin={0}
      aria-valuemax={20}
      aria-valuenow={results.length}
      aria-valuetext={`${results.length} of 20 answered, ${results.filter(Boolean).length} correct`}
    >
      {Array.from({ length: 20 }, (_, index) => (
        <span
          key={index}
          className={
            index === current
              ? reviewing
                ? "reviewing"
                : "current"
              : index < results.length
                ? results[index]
                  ? "correct"
                  : "incorrect"
                : ""
          }
        />
      ))}
    </div>
  );
}

/** Native's three explanation layers: a reason, optional steps, optional comparison. */
export function PracticeExplanation({
  item,
  selected,
}: {
  item: QuizItem;
  selected: QuizChoice["id"];
}) {
  const reason =
    selected === item.answerId
      ? item.explanation
      : (item.teaching?.choiceReasons[selected] ?? item.explanation);
  return (
    <div className="rb-practice-explanation">
      <p>
        <RichText>{reason}</RichText>
      </p>
      <div className="rb-practice-explanation-links">
        <details>
          <summary>How to find the answer</summary>
          <ol>
            {(item.teaching?.steps ?? [item.explanation]).map((step, index) => (
              <li key={index}>
                <RichText>{step}</RichText>
              </li>
            ))}
          </ol>
        </details>
        <details>
          <summary>Compare all four</summary>
          <div className="rb-practice-compare">
            <h3>Compare all four answers</h3>
            <dl>
              {item.choices.map((choice) => (
                <div key={choice.id}>
                  <dt
                    className={
                      choice.id === item.answerId
                        ? "rb-practice-correct-text"
                        : ""
                    }
                  >
                    {choice.id}. <span>{choice.text}</span>
                    {choice.id === item.answerId ? " · Correct" : ""}
                  </dt>
                  <dd>
                    <RichText>
                      {item.teaching?.choiceReasons[choice.id] ??
                        item.explanation}
                    </RichText>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </details>
      </div>
    </div>
  );
}

function KeyboardGuide({ answered = false }: { answered?: boolean }) {
  return (
    <p className="rb-practice-keyboard">
      <span>
        <kbd>↑</kbd> <kbd>↓</kbd> Choose
      </span>
      <span>
        <kbd>Enter</kbd> / <kbd>→</kbd> {answered ? "Next" : "Submit"}
      </span>
      <span>
        <kbd>←</kbd> Previous answer
      </span>
      <span>
        <kbd>Shift</kbd> Hint
      </span>
      <span>
        <kbd>Tab</kbd> Move between controls
      </span>
    </p>
  );
}

type SentencePiece = { text: string; kind: "text" | "blank" | "answer" };
/** Copied as a pure web adaptation of native domain/prompt.ts; no sibling runtime import. */
function splitPracticePrompt(prompt: string) {
  const at = prompt.indexOf(": ");
  if (at > 0) {
    const head = prompt.slice(0, at),
      tail = prompt.slice(at + 2);
    if (!/_{3,}/.test(head) && (/_{3,}/.test(tail) || /^[“"]/.test(tail)))
      return { instruction: head, sentence: tail };
  }
  return { instruction: "", sentence: prompt };
}
function completedSentence(sentence: string, answer?: string): SentencePiece[] {
  const chunks = sentence.split(/_{3,}/),
    blanks = chunks.length - 1;
  if (!blanks) return [{ text: sentence, kind: "text" }];
  const fills =
    answer === undefined
      ? undefined
      : blanks === 1
        ? [answer]
        : answer.split(" / ").length === blanks
          ? answer.split(" / ")
          : undefined;
  const pieces: SentencePiece[] = [];
  let before = "",
    closeUp = false,
    openSentence = false;
  const capitalise = (text: string) =>
    text.replace(
      /^(\s*)([a-zà-öø-ÿ])/,
      (_, space: string, letter: string) => space + letter.toUpperCase(),
    );
  chunks.forEach((chunk, index) => {
    let text = closeUp ? chunk.replace(/^\s+/, "") : chunk;
    if (openSentence) text = capitalise(text);
    closeUp = false;
    openSentence = false;
    if (index === blanks) {
      if (text) pieces.push({ text, kind: "text" });
      return;
    }
    if (!fills) {
      if (text) pieces.push({ text, kind: "text" });
      pieces.push({ text: "______", kind: "blank" });
      before += text + "______";
      return;
    }
    const fill = fills[index].trim();
    const opening =
      /^[\s“"‘'([¿¡]*$/.test(before + text) ||
      /[.!?]["”’)]*\s+[“"‘'([¿¡]*$/.test(before + text);
    if (/^[—–]$/.test(fill)) {
      if (opening || /\s$/.test(text)) closeUp = true;
      openSentence = opening;
      if (text) pieces.push({ text, kind: "text" });
      before += text;
      return;
    }
    if (/^[;,.:!?]/.test(fill)) text = text.replace(/\s+$/, "");
    if (text) pieces.push({ text, kind: "text" });
    const words = opening ? capitalise(fill) : fill;
    pieces.push({ text: words, kind: "answer" });
    before += text + words;
  });
  return pieces;
}
