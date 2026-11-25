import type { GrammarTopic } from "../../types/grammar";
import type { useProgress } from "../../hooks/useProgress";
import { Icon, Tile } from "./Brand";
import "./practice.css";

export type RebrandLearning = ReturnType<typeof useProgress> & {
  startFocusedSession?: (slug: string) => void;
  resetWaiting?: boolean;
};
export type PracticeProps = {
  courseId: "en" | "es";
  topics: readonly GrammarTopic[];
  learning: RebrandLearning;
  onPractice: (slug: string) => void;
  onRead: (slug: string, sectionId?: string) => void;
  onMistakes: () => void;
};
export const stageNumber = (stage?: string) =>
  Math.max(1, Math.min(6, Number.parseInt(stage ?? "1", 10) || 1));
export const stageTitle = (stage: string) =>
  stage.replace(/^\d+\s*[·.]\s*/, "");

function ChapterPracticeRow({
  topic,
  meta,
  onOpen,
}: {
  topic: GrammarTopic;
  meta: string;
  onOpen: () => void;
}) {
  return (
    <button className="rb-practice-chapter" type="button" onClick={onOpen}>
      <Tile stage={stageNumber(topic.stage)} size={42} />
      <span className="rb-practice-chapter-copy">
        <strong>{topic.title}</strong>
        <span>{meta}</span>
      </span>
      <Icon name="chevronRight" size={18} />
    </button>
  );
}

/** The same Continue / Up next / Scores hierarchy as the native Practice tab. */
export function Practice({
  courseId,
  topics,
  learning,
  onPractice,
  onRead,
  onMistakes,
}: PracticeProps) {
  const unfinished = topics.filter(
    (topic) =>
      learning.sessions[topic.slug] && !learning.sessions[topic.slug].complete,
  );
  const upNext = topics.find(
    (topic) =>
      !learning.progress[topic.slug]?.isCompleted &&
      !unfinished.includes(topic),
  );
  const scored = topics
    .filter((topic) => learning.progress[topic.slug]?.completedSessions)
    .sort((a, b) =>
      learning.progress[b.slug].updatedAt.localeCompare(
        learning.progress[a.slug].updatedAt,
      ),
    );
  const focus = (slug: string) => {
    learning.startFocusedSession(slug);
    onPractice(slug);
  };
  return (
    <div className="rb-practice-hub" data-course={courseId}>
      <header className="rb-practice-page-title">
        <h1>Practice</h1>
        <p>20 questions a session · no timer · 16 to complete</p>
      </header>
      <div className="rb-practice-hub-columns">
        <div className="rb-practice-hub-main">
          {unfinished.length > 0 && (
            <section
              className="rb-practice-section"
              aria-labelledby="practice-continue-title"
            >
              <div className="rb-practice-section-label">
                <h2 id="practice-continue-title">Continue</h2>
                <span>Your place is saved</span>
              </div>
              <div className="rb-card rb-practice-chapters">
                {unfinished.map((topic) => (
                  <ChapterPracticeRow
                    key={topic.slug}
                    topic={topic}
                    meta={`${topic.level} · pick up at question ${Math.min(learning.sessions[topic.slug].index + 1, 20)}`}
                    onOpen={() => onPractice(topic.slug)}
                  />
                ))}
              </div>
            </section>
          )}
          {upNext && (
            <section
              className="rb-practice-section"
              aria-labelledby="practice-next-title"
            >
              <div className="rb-practice-section-label">
                <h2 id="practice-next-title">Up next</h2>
              </div>
              <div className="rb-card rb-practice-up-next">
                <div className="rb-practice-feature-heading">
                  <Tile stage={stageNumber(upNext.stage)} size={62} />
                  <div>
                    <p className="rb-practice-eyebrow">
                      Chapter {upNext.order} · {upNext.level}
                    </p>
                    <h3>{upNext.title}</h3>
                  </div>
                </div>
                <p className="rb-practice-secondary">{upNext.summary}</p>
                <div className="rb-practice-paired-actions">
                  <button
                    className="rb-button"
                    type="button"
                    onClick={() => onPractice(upNext.slug)}
                  >
                    Practise <Icon name="arrowRight" size={18} />
                  </button>
                  <button
                    className="rb-button secondary"
                    type="button"
                    onClick={() => onRead(upNext.slug)}
                  >
                    Read first
                  </button>
                </div>
              </div>
            </section>
          )}
          <section
            className="rb-practice-section"
            aria-labelledby="practice-scores-title"
          >
            <div className="rb-practice-section-label">
              <h2 id="practice-scores-title">Your scores</h2>
              {scored.length > 0 && <span>Most recent first</span>}
            </div>
            {scored.length ? (
              <div className="rb-card rb-practice-chapters">
                {scored.map((topic) => {
                  const stats = learning.progress[topic.slug];
                  return (
                    <ChapterPracticeRow
                      key={topic.slug}
                      topic={topic}
                      meta={`Best ${stats.bestScore ?? 0}% · ${stats.completedSessions} ${stats.completedSessions === 1 ? "session" : "sessions"}`}
                      onOpen={() => onPractice(topic.slug)}
                    />
                  );
                })}
              </div>
            ) : (
              <div className="rb-card rb-practice-empty">
                <span className="rb-practice-empty-symbol" aria-hidden="true">
                  <Icon name="chart" size={26} />
                </span>
                <h3>No scores yet</h3>
                <p>
                  Finish a 20-question session and your scores appear here.
                  Score 16 or more to complete a chapter.
                </p>
              </div>
            )}
          </section>
        </div>
        <aside
          className="rb-practice-improve"
          aria-labelledby="practice-improve-title"
        >
          <section className="rb-practice-section">
            <div className="rb-practice-section-label">
              <h2 id="practice-improve-title">Review and improve</h2>
            </div>
            <div className="rb-card rb-practice-review-card">
              <span className="rb-practice-review-icon" aria-hidden="true">
                <Icon name="bulb" size={24} />
              </span>
              <h3>
                {learning.mistakes.length
                  ? `${learning.mistakes.length} saved ${learning.mistakes.length === 1 ? "mistake" : "mistakes"} to revisit`
                  : "Keep learning from your answers"}
              </h3>
              <p>
                Review incorrect answers and focus on the chapters and skills
                that need another look.
              </p>
              <button
                className="rb-button secondary"
                type="button"
                onClick={onMistakes}
              >
                Review mistakes <Icon name="arrowRight" size={17} />
              </button>
            </div>
            {learning.suggestions.map((suggestion) => (
              <div
                className="rb-card rb-practice-suggestion"
                key={`${suggestion.topicSlug}:${suggestion.skill}`}
              >
                <p className="rb-practice-eyebrow">A useful next step</p>
                <h3>{suggestion.title}</h3>
                <p>
                  {suggestion.mistakeCount} saved{" "}
                  {suggestion.mistakeCount === 1 ? "mistake" : "mistakes"} ·{" "}
                  {suggestion.skill.replaceAll("-", " ")}
                </p>
                <div className="rb-practice-paired-actions">
                  <button
                    className="rb-button secondary"
                    type="button"
                    onClick={() =>
                      onRead(suggestion.topicSlug, suggestion.sectionId)
                    }
                  >
                    Study
                  </button>
                  <button
                    className="rb-button"
                    type="button"
                    disabled={learning.resetWaiting}
                    onClick={() => focus(suggestion.topicSlug)}
                  >
                    Focus practice
                  </button>
                </div>
              </div>
            ))}
          </section>
        </aside>
      </div>
    </div>
  );
}
