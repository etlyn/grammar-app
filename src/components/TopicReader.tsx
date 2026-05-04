import {
  PASSING_ACCURACY,
  REQUIRED_CORRECT_ANSWERS,
  REQUIRED_QUIZ_ITEMS,
} from "../constants/learning";
import type { GrammarTopic, TopicProgress } from "../types/grammar";

type TopicReaderProps = {
  topic: GrammarTopic;
  progress?: TopicProgress;
  onGenerateMore: () => Promise<void>;
  generating: boolean;
  canGenerate: boolean;
};

export function TopicReader({
  topic,
  progress,
  onGenerateMore,
  generating,
  canGenerate,
}: TopicReaderProps) {
  const answered = Math.min(progress?.total ?? 0, REQUIRED_QUIZ_ITEMS);
  const completionProgress = Math.min(
    100,
    (answered / REQUIRED_QUIZ_ITEMS) * 100,
  );
  const isCompleted = Boolean(progress?.isCompleted);

  return (
    <section className="rounded-[2.25rem] border border-indigo-100 bg-white/75 p-5 shadow-sm shadow-indigo-100/70 backdrop-blur md:p-8">
      <div>
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-indigo-500">
              Read about · {topic.level} grammar
            </p>
            <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950 md:text-5xl">
              {topic.title}
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
              {topic.summary}
            </p>
          </div>
          <div className="rounded-3xl bg-gradient-to-br from-indigo-600 to-sky-500 px-5 py-4 text-white shadow-md shadow-indigo-200">
            <p className="text-xs font-semibold text-indigo-100">
              Topic status
            </p>
            <p className="text-2xl font-black">
              {isCompleted ? "Complete" : `${answered}/${REQUIRED_QUIZ_ITEMS}`}
            </p>
          </div>
        </div>

        <div className="mt-6 h-3 rounded-full bg-indigo-50 p-0.5">
          <div
            className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-sky-400 transition-all"
            style={{ width: `${completionProgress}%` }}
          />
        </div>
        <p className="mt-2 text-xs font-medium text-slate-500">
          Complete {REQUIRED_QUIZ_ITEMS} quiz items and score at least{" "}
          {PASSING_ACCURACY}% ({REQUIRED_CORRECT_ANSWERS} correct) to mark this
          topic complete.
        </p>
      </div>

      <div className="mt-8 grid gap-8 xl:grid-cols-[1fr_20rem]">
        <div>
          <h2 className="text-xl font-black text-slate-950">
            How to study this topic
          </h2>
          <p className="mt-3 leading-7 text-slate-600">{topic.guidance}</p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {topic.learningGoals.map((goal) => (
              <div
                className="rounded-3xl bg-indigo-50/70 p-4 text-sm font-medium text-indigo-950"
                key={goal}
              >
                {goal}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-sky-100 bg-sky-50/70 p-5">
          <h2 className="text-lg font-black text-slate-950">
            Reusable content
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Seed content works offline. With Supabase configured, AI-generated
            explanations and quiz items are saved once and reused from your
            content tables.
          </p>
          <button
            className="mt-4 w-full rounded-2xl bg-gradient-to-r from-indigo-600 to-sky-500 px-4 py-3 text-sm font-bold text-white shadow-sm shadow-sky-200 transition hover:-translate-y-0.5 hover:shadow-md disabled:cursor-not-allowed disabled:bg-none disabled:bg-slate-300 disabled:hover:translate-y-0"
            disabled={!canGenerate || generating}
            onClick={onGenerateMore}
            type="button"
          >
            {generating ? "Generating…" : "Generate more practice"}
          </button>
          {!canGenerate && (
            <p className="mt-3 text-xs text-slate-400">
              Configure Supabase and deploy the edge function to enable this.
            </p>
          )}
        </div>
      </div>

      <div className="mt-8 divide-y divide-indigo-100/80">
        {topic.rules.map((rule) => (
          <article className="py-7 first:pt-0 last:pb-0" key={rule.title}>
            <h3 className="text-lg font-black text-slate-950">{rule.title}</h3>
            <p className="mt-3 leading-7 text-slate-600">{rule.explanation}</p>
            <div className="mt-4 grid gap-2 sm:grid-cols-3">
              {rule.examples.map((example) => (
                <p
                  className="rounded-2xl bg-white/80 px-4 py-3 text-sm font-medium text-slate-700 shadow-sm shadow-indigo-100/40"
                  key={example}
                >
                  {example}
                </p>
              ))}
            </div>
            {rule.commonMistakes?.length ? (
              <div className="mt-4 rounded-2xl border border-orange-100 bg-orange-50 p-4">
                <p className="text-sm font-black text-orange-700">
                  Common mistake
                </p>
                {rule.commonMistakes.map((mistake) => (
                  <p className="mt-1 text-sm text-orange-800" key={mistake}>
                    {mistake}
                  </p>
                ))}
              </div>
            ) : null}
          </article>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-black text-slate-950">Practice tips</h2>
        <ul className="mt-4 grid gap-3 md:grid-cols-2">
          {topic.tips.map((tip) => (
            <li
              className="rounded-2xl bg-white/80 px-4 py-3 text-sm font-medium text-slate-700 shadow-sm shadow-indigo-100/40"
              key={tip}
            >
              {tip}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
