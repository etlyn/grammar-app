import { useEffect, useState } from "react";
import {
  PASSING_ACCURACY,
  REQUIRED_CORRECT_ANSWERS,
  REQUIRED_QUIZ_ITEMS,
} from "../constants/learning";
import type {
  GrammarTopic,
  QuizAttempt,
  QuizChoice,
  QuizItem,
  TopicProgress,
} from "../types/grammar";
import { buildQuizSessionItems, cleanQuizPrompt } from "../utils/quiz";

type PracticePanelProps = {
  topic: GrammarTopic;
  progress?: TopicProgress;
  onRecordAttempt: (attempt: QuizAttempt) => Promise<void>;
  onResetTopic: (topicSlug: string) => Promise<void>;
};

type AnswerRecord = {
  item: QuizItem;
  selectedAnswer: QuizChoice["id"];
  isCorrect: boolean;
};

const escapeRegExp = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

function HighlightedPrompt({
  prompt,
  keywords,
  enabled,
}: {
  prompt: string;
  keywords: string[];
  enabled: boolean;
}) {
  if (!enabled || !keywords.length) return <>{prompt}</>;

  const pattern = new RegExp(`(${keywords.map(escapeRegExp).join("|")})`, "gi");
  const parts = prompt.split(pattern);

  return (
    <>
      {parts.map((part, index) =>
        keywords.some(
          (keyword) => keyword.toLowerCase() === part.toLowerCase(),
        ) ? (
          <mark
            className="rounded-lg bg-amber-100 px-1.5 py-0.5 text-amber-900"
            key={`${part}-${index}`}
          >
            {part}
          </mark>
        ) : (
          <span key={`${part}-${index}`}>{part}</span>
        ),
      )}
    </>
  );
}

const buildSessionItems = (topic: GrammarTopic, progress?: TopicProgress) => {
  return buildQuizSessionItems({
    items: topic.quizItems,
    answeredItemIds: progress?.answeredItemIds,
    count: REQUIRED_QUIZ_ITEMS,
  });
};

export function PracticePanel({
  topic,
  progress,
  onRecordAttempt,
  onResetTopic,
}: PracticePanelProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<QuizChoice["id"] | null>(
    null,
  );
  const [showHint, setShowHint] = useState(false);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [sessionItems, setSessionItems] = useState<QuizItem[]>(() =>
    buildSessionItems(topic, progress),
  );

  const currentItem = sessionItems[currentIndex];
  const score = answers.filter((answer) => answer.isCorrect).length;
  const scorePercent = answers.length
    ? Math.round((score / answers.length) * 100)
    : 0;
  const passedCurrentSession =
    answers.length >= REQUIRED_QUIZ_ITEMS && scorePercent >= PASSING_ACCURACY;

  useEffect(() => {
    setSessionItems(buildSessionItems(topic, progress));
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setShowHint(false);
    setAnswers([]);
    setSessionComplete(false);
  }, [topic.slug]);

  useEffect(() => {
    if (answers.length || currentIndex || selectedAnswer || sessionComplete) {
      return;
    }

    setSessionItems(buildSessionItems(topic, progress));
  }, [
    answers.length,
    currentIndex,
    progress?.updatedAt,
    selectedAnswer,
    sessionComplete,
    topic,
    progress,
  ]);

  const submitAnswer = async (choiceId: QuizChoice["id"]) => {
    if (!currentItem || selectedAnswer) return;

    const isCorrect = choiceId === currentItem.answerId;
    setSelectedAnswer(choiceId);
    setAnswers((current) => [
      ...current,
      { item: currentItem, selectedAnswer: choiceId, isCorrect },
    ]);

    await onRecordAttempt({
      topicSlug: topic.slug,
      quizItemId: currentItem.id,
      selectedAnswer: choiceId,
      correctAnswer: currentItem.answerId,
      isCorrect,
    });
  };

  const next = () => {
    setSelectedAnswer(null);
    setShowHint(false);

    if (currentIndex + 1 >= sessionItems.length) {
      setSessionComplete(true);
      return;
    }

    setCurrentIndex((value) => value + 1);
  };

  const restart = () => {
    setSessionItems(buildSessionItems(topic, progress));
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setShowHint(false);
    setAnswers([]);
    setSessionComplete(false);
  };

  if (!currentItem) {
    return (
      <section className="rounded-[2.25rem] border border-indigo-100 bg-white p-6 shadow-soft md:p-8">
        <h2 className="text-xl font-black text-slate-950">Practice</h2>
        <p className="mt-3 text-slate-600">
          No quiz items are available for this topic yet.
        </p>
      </section>
    );
  }

  if (sessionComplete) {
    return (
      <section className="relative overflow-hidden rounded-[2.25rem] border border-indigo-100 bg-white p-6 shadow-soft md:p-8">
        <div className="absolute right-0 top-0 h-36 w-36 rounded-full bg-fuchsia-100 blur-3xl" />
        <p className="relative text-xs font-bold uppercase tracking-[0.25em] text-indigo-500">
          Session complete
        </p>
        <h2 className="relative mt-3 text-3xl font-black text-slate-950">
          You scored {score}/{answers.length}
        </h2>
        <p className="relative mt-3 max-w-2xl text-slate-600">
          {passedCurrentSession
            ? "Great work. This topic is complete because you reached at least 80%."
            : `Review the explanations below, then repeat the topic until you answer at least ${REQUIRED_CORRECT_ANSWERS}/${REQUIRED_QUIZ_ITEMS} correctly.`}
        </p>

        <div className="relative mt-6 space-y-3">
          {answers.map((answer) => (
            <div
              className="rounded-3xl border border-indigo-50 bg-indigo-50/40 p-4"
              key={answer.item.id}
            >
              <p className="font-medium text-slate-900">
                {cleanQuizPrompt(answer.item.prompt)}
              </p>
              <p className="mt-2 text-sm text-slate-600">
                Your answer: {answer.selectedAnswer}. Correct answer:{" "}
                {answer.item.answerId}.
              </p>
              <p className="mt-2 text-sm text-slate-600">
                {answer.item.explanation}
              </p>
            </div>
          ))}
        </div>

        <div className="relative mt-6 flex flex-wrap gap-3">
          <button
            className="rounded-2xl bg-gradient-to-r from-indigo-600 to-sky-500 px-5 py-3 text-sm font-bold text-white shadow-sm shadow-indigo-200 transition hover:-translate-y-0.5 hover:shadow-md"
            onClick={restart}
            type="button"
          >
            Practice again
          </button>
          <button
            className="rounded-2xl border border-indigo-100 bg-white px-5 py-3 text-sm font-bold text-indigo-600 transition hover:border-indigo-200 hover:bg-indigo-50"
            onClick={() => onResetTopic(topic.slug)}
            type="button"
          >
            Reset topic progress
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden rounded-[2.5rem] border border-indigo-100 bg-white shadow-[0_28px_80px_rgba(79,70,229,0.14)]">
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-r from-indigo-50 via-sky-50 to-fuchsia-50" />
      <div className="relative p-5 sm:p-6 md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-indigo-500">
              {progress?.isCompleted ? "Topic complete" : "Topic practice"}
            </p>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
              Quiz item {currentIndex + 1} of {sessionItems.length}
            </h2>
          </div>
          <div className="h-3 w-full rounded-full bg-white/80 p-0.5 shadow-inner md:w-60">
            <div
              className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-sky-400 transition-all"
              style={{
                width: `${((currentIndex + Number(Boolean(selectedAnswer))) / sessionItems.length) * 100}%`,
              }}
            />
          </div>
        </div>

        <div className="mt-6 rounded-[2rem] border border-indigo-50 bg-white/85 p-5 text-xl font-semibold leading-9 text-slate-950 shadow-sm shadow-indigo-100/60 md:p-8 md:text-2xl md:leading-10">
          <HighlightedPrompt
            enabled={showHint}
            keywords={currentItem.keywords}
            prompt={cleanQuizPrompt(currentItem.prompt)}
          />
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {currentItem.choices.map((choice) => {
            const isCorrect = choice.id === currentItem.answerId;
            const isSelected = selectedAnswer === choice.id;
            const stateClass = selectedAnswer
              ? isCorrect
                ? "border-cyan-200 bg-cyan-50 text-cyan-950 shadow-cyan-100"
                : isSelected
                  ? "border-orange-200 bg-orange-50 text-orange-950 shadow-orange-100"
                  : "border-indigo-50 bg-white/70 text-slate-500"
              : "border-indigo-100 bg-white text-slate-800 hover:-translate-y-0.5 hover:border-indigo-200 hover:bg-indigo-50 hover:shadow-md hover:shadow-indigo-100";

            return (
              <button
                className={`rounded-3xl border p-4 text-left shadow-sm transition ${stateClass}`}
                disabled={Boolean(selectedAnswer)}
                key={choice.id}
                onClick={() => submitAnswer(choice.id)}
                type="button"
              >
                <span className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-sm font-black text-indigo-600">
                    {choice.id}
                  </span>
                  <span>{choice.text}</span>
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <button
            className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-3 text-sm font-bold text-amber-800 transition hover:-translate-y-0.5 hover:bg-amber-100"
            onClick={() => setShowHint((value) => !value)}
            type="button"
          >
            {showHint ? "Hide hint" : "Show hint"}
          </button>
          <button
            className="rounded-2xl bg-gradient-to-r from-indigo-600 to-sky-500 px-6 py-3 text-sm font-bold text-white shadow-sm shadow-indigo-200 transition hover:-translate-y-0.5 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-sm"
            disabled={!selectedAnswer}
            onClick={next}
            type="button"
          >
            {currentIndex + 1 >= sessionItems.length
              ? "Finish topic"
              : "Next item"}
          </button>
        </div>

        {(showHint || selectedAnswer) && (
          <div className="mt-5 rounded-3xl border border-amber-100 bg-amber-50/90 p-5 text-sm leading-6 text-amber-950 shadow-sm shadow-amber-100/60">
            <p className="font-black">
              {selectedAnswer ? "Explanation" : "Hint"}
            </p>
            <p className="mt-1">
              {selectedAnswer ? currentItem.explanation : currentItem.hint}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
