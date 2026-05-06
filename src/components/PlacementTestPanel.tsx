import { useMemo, useState } from "react";
import { PLACEMENT_TEST_ITEMS } from "../constants/learning";
import type {
  CEFRLevel,
  GrammarTopic,
  QuizChoice,
  QuizItem,
} from "../types/grammar";
import { cleanQuizPrompt, shuffle, uniqueQuizItems } from "../utils/quiz";

type PlacementTestPanelProps = {
  topics: GrammarTopic[];
  onClose: () => void;
};

type PlacementAnswer = {
  item: QuizItem;
  selectedAnswer: QuizChoice["id"];
  isCorrect: boolean;
};

const levels: CEFRLevel[] = ["A1", "A2", "B1", "B2", "C1"];

const buildPlacementItems = (topics: GrammarTopic[]) => {
  const allItems = topics.flatMap((topic) => topic.quizItems);
  const perLevel = Math.max(
    1,
    Math.floor(PLACEMENT_TEST_ITEMS / levels.length),
  );
  const selected = levels.flatMap((level) => {
    const pool = uniqueQuizItems(
      topics
        .filter((topic) => topic.level === level)
        .flatMap((topic) => topic.quizItems),
    );

    return shuffle(pool).slice(0, perLevel);
  });
  const selectedIds = new Set(selected.map((item) => item.id));
  const fallback = uniqueQuizItems(
    shuffle(allItems).filter((item) => !selectedIds.has(item.id)),
  );

  return shuffle(uniqueQuizItems([...selected, ...fallback])).slice(
    0,
    PLACEMENT_TEST_ITEMS,
  );
};

const estimateLevel = (answers: PlacementAnswer[]) => {
  if (!answers.length) return "A1";

  const correctByLevel = new Map<
    CEFRLevel,
    { correct: number; total: number }
  >();

  levels.forEach((level) =>
    correctByLevel.set(level, { correct: 0, total: 0 }),
  );
  answers.forEach((answer) => {
    const current = correctByLevel.get(answer.item.level) ?? {
      correct: 0,
      total: 0,
    };
    correctByLevel.set(answer.item.level, {
      correct: current.correct + Number(answer.isCorrect),
      total: current.total + 1,
    });
  });

  let estimated: CEFRLevel = "A1";

  for (const level of levels) {
    const score = correctByLevel.get(level);
    if (!score?.total) continue;

    if (score.correct / score.total >= 0.6) {
      estimated = level;
    }
  }

  return estimated;
};

export function PlacementTestPanel({
  topics,
  onClose,
}: PlacementTestPanelProps) {
  const [sessionKey, setSessionKey] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<QuizChoice["id"] | null>(
    null,
  );
  const [answers, setAnswers] = useState<PlacementAnswer[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const items = useMemo(
    () => buildPlacementItems(topics),
    [topics, sessionKey],
  );
  const currentItem = items[currentIndex];
  const correct = answers.filter((answer) => answer.isCorrect).length;
  const estimatedLevel = estimateLevel(answers);

  const chooseAnswer = (choiceId: QuizChoice["id"]) => {
    if (!currentItem || selectedAnswer) return;

    setSelectedAnswer(choiceId);
    setAnswers((current) => [
      ...current,
      {
        item: currentItem,
        selectedAnswer: choiceId,
        isCorrect: choiceId === currentItem.answerId,
      },
    ]);
  };

  const next = () => {
    setSelectedAnswer(null);

    if (currentIndex + 1 >= items.length) {
      setIsComplete(true);
      return;
    }

    setCurrentIndex((value) => value + 1);
  };

  const restart = () => {
    setSessionKey((value) => value + 1);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setAnswers([]);
    setIsComplete(false);
  };

  return (
    <section className="relative overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white p-5 shadow-soft sm:p-6 md:p-8">
      <div className="pointer-events-none absolute right-0 top-0 h-52 w-52 rounded-full bg-sky-100 blur-3xl" />
      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
            CEFR placement
          </p>
          <h2 className="mt-1 text-2xl font-black text-slate-950 sm:text-3xl">
            50-question level check
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            Answer mixed A1–C1 grammar questions to estimate your current CEFR
            level. This panel stays on the page, so your result will not vanish
            because of an accidental backdrop click.
          </p>
        </div>
        <button
          className="self-start rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-black text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-50"
          onClick={onClose}
          type="button"
        >
          Hide test
        </button>
      </div>

      {isComplete ? (
        <div className="relative mt-6 grid gap-5 lg:grid-cols-[18rem_minmax(0,1fr)]">
          <div className="rounded-3xl bg-slate-950 p-5 text-white">
            <p className="text-sm font-bold text-slate-300">Estimated level</p>
            <p className="mt-1 text-6xl font-black">{estimatedLevel}</p>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Score: {correct}/{answers.length}. Use this result as a guide,
              then start with topics around {estimatedLevel} and move up when
              you score 80% or more.
            </p>
            <button
              className="mt-5 rounded-2xl bg-white px-5 py-3 text-sm font-black text-slate-950 transition hover:-translate-y-0.5 hover:bg-slate-100"
              onClick={restart}
              type="button"
            >
              Start a new check
            </button>
          </div>
          <div className="max-h-[34rem] space-y-3 overflow-auto pr-1">
            {answers.map((answer, index) => (
              <div
                className="rounded-3xl border border-slate-100 bg-slate-50/80 p-4"
                key={`${answer.item.id}-${index}`}
              >
                <div className="flex flex-wrap items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                  <span>Question {index + 1}</span>
                  <span>·</span>
                  <span>{answer.item.level}</span>
                  <span>·</span>
                  <span
                    className={
                      answer.isCorrect ? "text-emerald-600" : "text-orange-600"
                    }
                  >
                    {answer.isCorrect ? "Correct" : "Review"}
                  </span>
                </div>
                <p className="mt-2 font-semibold text-slate-950">
                  {cleanQuizPrompt(answer.item.prompt)}
                </p>
                <p className="mt-2 text-sm text-slate-600">
                  Your answer: {answer.selectedAnswer}. Correct answer:{" "}
                  {answer.item.answerId}.
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {answer.item.explanation}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : currentItem ? (
        <div className="relative mt-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-black text-slate-600">
              Question {currentIndex + 1} of {items.length} ·{" "}
              {currentItem.level}
            </p>
            <div className="h-2 rounded-full bg-slate-100 sm:w-64">
              <div
                className="h-2 rounded-full bg-slate-900 transition-all"
                style={{
                  width: `${((currentIndex + Number(Boolean(selectedAnswer))) / items.length) * 100}%`,
                }}
              />
            </div>
          </div>
          <p className="mt-5 rounded-3xl border border-slate-200 bg-white p-5 text-xl font-bold leading-8 text-slate-950 shadow-sm sm:text-2xl sm:leading-9">
            {cleanQuizPrompt(currentItem.prompt)}
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {currentItem.choices.map((choice) => {
              const isCorrect = choice.id === currentItem.answerId;
              const isSelected = selectedAnswer === choice.id;
              const stateClass = selectedAnswer
                ? isCorrect
                  ? "border-slate-900 bg-slate-900 text-white"
                  : isSelected
                    ? "border-orange-200 bg-orange-50 text-orange-950"
                    : "border-slate-200 bg-white text-slate-500"
                : "border-slate-200 bg-white text-slate-800 hover:-translate-y-0.5 hover:border-slate-400 hover:bg-slate-50 hover:shadow-md";

              return (
                <button
                  className={`rounded-2xl border p-4 text-left text-sm font-semibold transition ${stateClass}`}
                  disabled={Boolean(selectedAnswer)}
                  key={choice.id}
                  onClick={() => chooseAnswer(choice.id)}
                  type="button"
                >
                  <span className="mr-2 font-black">{choice.id}</span>
                  {choice.text}
                </button>
              );
            })}
          </div>
          {selectedAnswer ? (
            <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-700">
              <p className="font-black text-slate-950">Explanation</p>
              <p>{currentItem.explanation}</p>
            </div>
          ) : null}
          <div className="mt-5 flex flex-wrap justify-end gap-3">
            {answers.length ? (
              <button
                className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 transition hover:-translate-y-0.5 hover:bg-slate-50"
                onClick={restart}
                type="button"
              >
                Start over
              </button>
            ) : null}
            <button
              className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={!selectedAnswer}
              onClick={next}
              type="button"
            >
              {currentIndex + 1 >= items.length ? "Show level" : "Next"}
            </button>
          </div>
        </div>
      ) : (
        <p className="relative mt-6 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
          Placement questions are loading.
        </p>
      )}
    </section>
  );
}
