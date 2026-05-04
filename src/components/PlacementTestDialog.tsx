import { useEffect, useMemo, useState } from "react";
import { PLACEMENT_TEST_ITEMS } from "../constants/learning";
import type {
  CEFRLevel,
  GrammarTopic,
  QuizChoice,
  QuizItem,
} from "../types/grammar";

type PlacementTestDialogProps = {
  topics: GrammarTopic[];
  onClose: () => void;
};

type PlacementAnswer = {
  item: QuizItem;
  selectedAnswer: QuizChoice["id"];
  isCorrect: boolean;
};

const levels: CEFRLevel[] = ["A1", "A2", "B1", "B2", "C1"];

const shuffle = <T,>(items: T[]) => {
  const copy = [...items];

  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }

  return copy;
};

const buildPlacementItems = (topics: GrammarTopic[]) => {
  const perLevel = Math.floor(PLACEMENT_TEST_ITEMS / levels.length);
  const selected = levels.flatMap((level) => {
    const pool = topics
      .filter((topic) => topic.level === level)
      .flatMap((topic) => topic.quizItems);

    return shuffle(pool).slice(0, perLevel);
  });

  if (selected.length >= PLACEMENT_TEST_ITEMS) {
    return shuffle(selected).slice(0, PLACEMENT_TEST_ITEMS);
  }

  const selectedIds = new Set(selected.map((item) => item.id));
  const fallback = shuffle(topics.flatMap((topic) => topic.quizItems)).filter(
    (item) => !selectedIds.has(item.id),
  );

  return shuffle([...selected, ...fallback]).slice(0, PLACEMENT_TEST_ITEMS);
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

export function PlacementTestDialog({
  topics,
  onClose,
}: PlacementTestDialogProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<QuizChoice["id"] | null>(
    null,
  );
  const [answers, setAnswers] = useState<PlacementAnswer[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const items = useMemo(() => buildPlacementItems(topics), [topics]);
  const currentItem = items[currentIndex];
  const correct = answers.filter((answer) => answer.isCorrect).length;
  const estimatedLevel = estimateLevel(answers);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [onClose]);

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

  return (
    <div
      aria-label="CEFR placement test"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
    >
      <button
        aria-label="Close CEFR placement test"
        className="absolute inset-0 bg-slate-950/45 backdrop-blur-sm"
        onClick={onClose}
        type="button"
      />
      <section className="relative max-h-[min(44rem,calc(100vh-2rem))] w-full max-w-3xl overflow-auto rounded-[2rem] border border-slate-200 bg-white p-5 shadow-soft sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
              CEFR placement
            </p>
            <h2 className="mt-1 text-2xl font-black text-slate-950">
              50-question level check
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Answer mixed A1–C1 grammar questions to estimate your current CEFR
              level.
            </p>
          </div>
          <button
            aria-label="Close placement test"
            className="rounded-full border border-slate-200 px-3 py-1 text-sm font-black text-slate-600 transition hover:bg-slate-50"
            onClick={onClose}
            type="button"
          >
            ✕
          </button>
        </div>

        {isComplete ? (
          <div className="mt-6 rounded-3xl bg-slate-50 p-5">
            <p className="text-sm font-bold text-slate-500">Estimated level</p>
            <p className="mt-1 text-5xl font-black text-slate-950">
              {estimatedLevel}
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Score: {correct}/{answers.length}. Use this result as a guide,
              then start with topics around {estimatedLevel} and move up when
              you score 80% or more.
            </p>
          </div>
        ) : currentItem ? (
          <div className="mt-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm font-black text-slate-600">
                Question {currentIndex + 1} of {items.length} ·{" "}
                {currentItem.level}
              </p>
              <div className="h-2 rounded-full bg-slate-100 sm:w-56">
                <div
                  className="h-2 rounded-full bg-slate-900 transition-all"
                  style={{
                    width: `${((currentIndex + Number(Boolean(selectedAnswer))) / items.length) * 100}%`,
                  }}
                />
              </div>
            </div>
            <p className="mt-5 rounded-3xl border border-slate-200 bg-white p-5 text-xl font-bold leading-8 text-slate-950 shadow-sm">
              {currentItem.prompt}
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
                  : "border-slate-200 bg-white text-slate-800 hover:border-slate-400 hover:bg-slate-50";

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
            <div className="mt-5 flex justify-end">
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
          <p className="mt-6 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
            Placement questions are loading.
          </p>
        )}
      </section>
    </div>
  );
}
