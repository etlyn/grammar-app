import { useState } from "react";
import type { GrammarTopic } from "../types/grammar";
import type { Mistake, Suggestion } from "../utils/accountProgress";

export function MistakeSuggestions({
  mistakes,
  suggestions,
  topics,
  onRead,
  onReviewed,
}: {
  mistakes: Mistake[];
  suggestions: Suggestion[];
  topics: readonly GrammarTopic[];
  onRead: (slug: string, sectionId?: string) => void;
  onReviewed: (id: string, slug: string) => void;
}) {
  const [shown, setShown] = useState(10);
  if (!mistakes.length) return null;
  return (
    <section className="mistake-suggestions" aria-labelledby="mistakes-title">
      <h2 id="mistakes-title">Learn from your mistakes</h2>
      <p className="muted">
        A few useful places to return to, based on your checked answers.
      </p>
      <ul className="suggestion-list">
        {suggestions.map((suggestion) => (
          <li key={`${suggestion.topicSlug}:${suggestion.skill}`}>
            <div>
              <strong>{suggestion.title}</strong>
              <p>
                {suggestion.skill.replaceAll("-", " ")} ·{" "}
                {suggestion.mistakeCount}{" "}
                {suggestion.mistakeCount === 1 ? "mistake" : "mistakes"} to
                review
              </p>
            </div>
            <button
              type="button"
              className="button secondary"
              onClick={() => onRead(suggestion.topicSlug, suggestion.sectionId)}
            >
              Review lesson
            </button>
          </li>
        ))}
      </ul>
      <details>
        <summary>Review saved mistakes ({mistakes.length})</summary>
        {mistakes.slice(0, shown).map((mistake) => {
          const topic = topics.find(
            (value) => value.slug === mistake.topicSlug,
          );
          const item = topic?.quizItems.find(
            (value) => value.id === mistake.itemId,
          );
          if (!topic || !item) return null;
          return (
            <div className="mistake-item" key={mistake.id}>
              <p>
                <strong>{item.prompt}</strong>
              </p>
              <p>
                Your answer:{" "}
                {
                  item.choices.find((choice) => choice.id === mistake.choice)
                    ?.text
                }
                . Correct answer:{" "}
                {
                  item.choices.find((choice) => choice.id === item.answerId)
                    ?.text
                }
                .
              </p>
              <p className="muted">{item.explanation}</p>
              <div className="account-actions">
                <button
                  className="text-button"
                  type="button"
                  onClick={() => onRead(topic.slug)}
                >
                  Read lesson
                </button>
                <button
                  className="text-button"
                  type="button"
                  onClick={() => onReviewed(mistake.id, topic.slug)}
                >
                  Mark reviewed
                </button>
              </div>
            </div>
          );
        })}
        {shown < mistakes.length && (
          <button
            className="text-button"
            type="button"
            onClick={() => setShown((value) => value + 10)}
          >
            Show more mistakes
          </button>
        )}
      </details>
    </section>
  );
}
