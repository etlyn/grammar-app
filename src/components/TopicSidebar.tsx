import { useId, useMemo, useState } from "react";
import { REQUIRED_QUIZ_ITEMS } from "../constants/learning";
import type { GrammarTopic, ProgressByTopic } from "../types/grammar";

type TopicSidebarProps = {
  topics: GrammarTopic[];
  activeSlug: string;
  progress: ProgressByTopic;
  onSelect: (slug: string) => void;
  onClose?: () => void;
  onCollapse?: () => void;
};

export function TopicSidebar({
  topics,
  activeSlug,
  progress,
  onSelect,
  onClose,
  onCollapse,
}: TopicSidebarProps) {
  const searchId = useId();
  const [query, setQuery] = useState("");
  const filteredTopics = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) return topics;

    return topics.filter((topic) =>
      [topic.title, topic.level, topic.summary]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery),
    );
  }, [query, topics]);

  return (
    <aside className="flex h-full flex-col rounded-[2rem] border border-indigo-100 bg-white/90 p-3 shadow-soft backdrop-blur lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)]">
      <div className="px-3 py-2">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-indigo-400">
              Curriculum
            </p>
            <h2 className="mt-1 text-lg font-black text-slate-950">
              Grammar topics
            </h2>
          </div>
          {onClose ? (
            <button
              aria-label="Close topics menu"
              className="rounded-full border border-slate-200 px-3 py-1 text-sm text-slate-500 transition hover:border-slate-400 hover:text-slate-950 lg:hidden"
              onClick={onClose}
              type="button"
            >
              ✕
            </button>
          ) : onCollapse ? (
            <button
              aria-label="Minimize curriculum"
              className="hidden h-9 w-9 items-center justify-center rounded-full border border-indigo-100 bg-white text-lg font-black text-indigo-600 transition hover:border-indigo-200 hover:bg-indigo-50 lg:inline-flex"
              onClick={onCollapse}
              title="Minimize curriculum"
              type="button"
            >
              ‹
            </button>
          ) : null}
        </div>
        <label
          className="mt-4 block text-xs font-semibold uppercase tracking-wide text-slate-400"
          htmlFor={searchId}
        >
          Search topics
        </label>
        <input
          className="mt-2 w-full rounded-2xl border border-indigo-100 bg-indigo-50/50 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-300 focus:bg-white focus:ring-4 focus:ring-indigo-100"
          id={searchId}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Try ‘perfect’, ‘articles’, ‘modal’..."
          type="search"
          value={query}
        />
      </div>
      <div className="mt-2 flex-1 space-y-1 overflow-auto pr-1">
        {filteredTopics.map((topic) => {
          const topicProgress = progress[topic.slug];
          const accuracy = topicProgress?.total
            ? Math.round((topicProgress.correct / topicProgress.total) * 100)
            : 0;
          const answered = Math.min(
            topicProgress?.total ?? 0,
            REQUIRED_QUIZ_ITEMS,
          );
          const isCompleted = Boolean(topicProgress?.isCompleted);

          return (
            <button
              className={`w-full rounded-2xl px-3 py-3 text-left transition ${
                activeSlug === topic.slug
                  ? "bg-gradient-to-r from-indigo-600 to-sky-500 text-white shadow-md shadow-indigo-200"
                  : "text-slate-700 hover:bg-indigo-50"
              }`}
              key={topic.slug}
              onClick={() => {
                onSelect(topic.slug);
                onClose?.();
              }}
              type="button"
            >
              <span className="flex items-start justify-between gap-3">
                <span>
                  <span className="block text-sm font-semibold">
                    {topic.title}
                  </span>
                  <span
                    className={`mt-1 block text-xs ${activeSlug === topic.slug ? "text-indigo-100" : "text-slate-400"}`}
                  >
                    {topic.level} ·{" "}
                    {isCompleted
                      ? "Complete"
                      : `${answered}/${REQUIRED_QUIZ_ITEMS}`}
                  </span>
                </span>
                {topicProgress?.total ? (
                  <span
                    className={`rounded-full px-2 py-1 text-xs ${
                      isCompleted
                        ? activeSlug === topic.slug
                          ? "bg-cyan-200 text-cyan-950"
                          : "bg-cyan-50 text-cyan-700"
                        : activeSlug === topic.slug
                          ? "bg-white/10"
                          : "bg-indigo-50 text-indigo-500"
                    }`}
                  >
                    {isCompleted ? "Done" : `${accuracy}%`}
                  </span>
                ) : null}
              </span>
            </button>
          );
        })}
        {!filteredTopics.length ? (
          <div className="rounded-2xl bg-indigo-50 px-4 py-6 text-center text-sm font-medium text-indigo-500">
            No topics found. Try a different grammar word.
          </div>
        ) : null}
      </div>
    </aside>
  );
}
