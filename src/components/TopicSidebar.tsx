import { useId, useState } from "react";
import type { GrammarTopic, ProgressByTopic } from "../types/grammar";

type Props = {
  topics: GrammarTopic[];
  activeSlug: string;
  progress: ProgressByTopic;
  onSelect: (slug: string) => void;
  onClose?: () => void;
};
export function TopicSidebar({
  topics,
  activeSlug,
  progress,
  onSelect,
  onClose,
}: Props) {
  const searchId = useId();
  const [query, setQuery] = useState("");
  const filtered = topics.filter((topic) =>
    `${topic.title} ${topic.summary}`
      .toLowerCase()
      .includes(query.trim().toLowerCase()),
  );
  return (
    <nav className="topic-navigation" aria-label="Grammar topics">
      <div className="rail-heading">
        <h2>English foundations</h2>
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
      <label className="sr-only" htmlFor={searchId}>
        Search topics
      </label>
      <input
        id={searchId}
        type="search"
        className="topic-search"
        placeholder="Search topics"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      <ol className="topic-list">
        {filtered.map((topic) => (
          <li key={topic.slug}>
            <button
              type="button"
              aria-current={activeSlug === topic.slug ? "page" : undefined}
              onClick={() => onSelect(topic.slug)}
            >
              <span className="topic-number" aria-hidden="true">
                {String(topics.indexOf(topic) + 1).padStart(2, "0")}
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
      {!filtered.length && (
        <p className="empty-topics" role="status">
          No topics found. Try another word.
        </p>
      )}
    </nav>
  );
}
