import { useEffect, useId, useState } from "react";
import type { GrammarTopic, ProgressByTopic } from "../types/grammar";
type Props = {
  topics: GrammarTopic[];
  activeSlug: string;
  progress: ProgressByTopic;
  onSelect: (slug: string) => void;
  onClose?: () => void;
  onMap?: () => void;
};
export function TopicSidebar({
  topics,
  activeSlug,
  progress,
  onSelect,
  onClose,
  onMap,
}: Props) {
  const searchId = useId();
  const [query, setQuery] = useState("");
  const activeStage =
    topics.find((t) => t.slug === activeSlug)?.stage ?? "Foundations";
  const [expanded, setExpanded] = useState<string[]>([activeStage]);
  useEffect(() => {
    setExpanded((v) => (v.includes(activeStage) ? v : [...v, activeStage]));
  }, [activeStage]);
  const stages = [...new Set(topics.map((t) => t.stage ?? "Foundations"))];
  const filtered = topics.filter((t) =>
    `${t.title} ${t.summary} ${t.level} ${t.chapter?.rules.map((r) => r.title).join(" ")}`
      .toLowerCase()
      .includes(query.trim().toLowerCase()),
  );
  const completed = topics.filter((t) => progress[t.slug]?.isCompleted).length;
  return (
    <nav className="topic-navigation" aria-label="Grammar topics">
      <div className="rail-heading">
        <h2>English grammar</h2>
        {onClose && (
          <button
            className="text-button"
            type="button"
            onClick={onClose}
            aria-label="Close topics menu"
          >
            Close
          </button>
        )}
      </div>
      <p className="curriculum-count">
        {topics.length} chapters · {stages.length} stages
        <br />
        {completed} complete · {topics.length - completed} to explore
      </p>
      {onMap && (
        <button type="button" className="map-rail-link" onClick={onMap}>
          Explore the grammar map <span aria-hidden="true">↗</span>
        </button>
      )}
      <label className="sr-only" htmlFor={searchId}>
        Search topics
      </label>
      <input
        id={searchId}
        type="search"
        className="topic-search"
        placeholder="Search topics or level"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <div className="contents-controls">
        <span>Course contents</span>
        <button
          className="text-button"
          type="button"
          onClick={() =>
            setExpanded(
              expanded.length === stages.length ? [activeStage] : stages,
            )
          }
        >
          {expanded.length === stages.length ? "Collapse" : "Expand all"}
        </button>
      </div>
      <div className="staged-contents">
        {stages.map((stage) => {
          const members = filtered.filter(
            (t) => (t.stage ?? "Foundations") === stage,
          );
          if (!members.length) return null;
          const open = !!query.trim() || expanded.includes(stage);
          const done = members.filter(
            (t) => progress[t.slug]?.isCompleted,
          ).length;
          return (
            <section className="curriculum-stage" key={stage}>
              <h3>
                <button
                  className="stage-toggle"
                  type="button"
                  aria-expanded={open}
                  onClick={() =>
                    setExpanded((v) =>
                      v.includes(stage)
                        ? v.filter((s) => s !== stage)
                        : [...v, stage],
                    )
                  }
                >
                  <span>{stage}</span>
                  <span className="stage-count">
                    {done}/{members.length}{" "}
                    <span aria-hidden="true">{open ? "−" : "+"}</span>
                  </span>
                </button>
              </h3>
              {open && (
                <ol className="topic-list">
                  {members.map((topic) => (
                    <li key={topic.slug}>
                      <button
                        type="button"
                        aria-current={
                          activeSlug === topic.slug ? "page" : undefined
                        }
                        onClick={() => onSelect(topic.slug)}
                      >
                        <span className="topic-number" aria-hidden="true">
                          {String(topic.order).padStart(2, "0")}
                        </span>
                        <span>{topic.title}</span>
                        {progress[topic.slug]?.isCompleted && (
                          <span className="complete-mark" aria-label="Complete">
                            ✓
                          </span>
                        )}
                      </button>
                    </li>
                  ))}
                </ol>
              )}
            </section>
          );
        })}
      </div>
      {!filtered.length && (
        <p className="empty-topics" role="status">
          No topics found. Try another word.
        </p>
      )}
    </nav>
  );
}
