import type { CSSProperties } from "react";
import { useState } from "react";
import type { GrammarTopic } from "../../types/grammar";
import { Icon, Tile } from "./Brand";
import { type RebrandLearning, stageNumber, stageTitle } from "./Practice";
import { PracticeExplanation } from "../PracticePanel";
import "./practice.css";

type ProgressProps = {
  courseId: "en" | "es";
  topics: readonly GrammarTopic[];
  learning: RebrandLearning;
  onRead: (slug: string, sectionId?: string) => void;
  onMistakes: () => void;
};
const stageColor = (stage: number) =>
  [
    "var(--brand-primary)",
    "var(--sol-main)",
    "var(--terra-main)",
    "var(--menta-main)",
    "var(--malva-main, #7A5AE0)",
    "var(--text-primary)",
  ][stage - 1];

export function Progress({
  courseId,
  topics,
  learning,
  onRead,
  onMistakes,
}: ProgressProps) {
  const stages = [
    ...new Set(topics.map((topic) => topic.stage ?? "1 · Foundations")),
  ];
  return (
    <div className="rb-progress-view" data-course={courseId}>
      <header className="rb-practice-page-title">
        <h1>Progress</h1>
        <p>
          {learning.totals.completedTopics} of {topics.length} chapters complete
        </p>
      </header>
      <div className="rb-progress-columns">
        <div className="rb-progress-overview">
          <section
            className="rb-card rb-progress-mosaic-card"
            aria-labelledby="chapter-mosaic-title"
          >
            <div className="rb-progress-card-heading">
              <h2 id="chapter-mosaic-title">Chapter mosaic</h2>
              <span>
                {learning.totals.completedTopics} / {topics.length}
              </span>
            </div>
            <div
              className="rb-progress-mosaic"
              role="group"
              aria-label="Chapters by completion"
            >
              {topics.map((topic) => {
                const done = Boolean(
                  learning.progress[topic.slug]?.isCompleted,
                );
                const started = Boolean(
                  learning.sessions[topic.slug] &&
                    !learning.sessions[topic.slug].complete,
                );
                return (
                  <button
                    key={topic.slug}
                    type="button"
                    className={`rb-progress-mosaic-tile ${done ? "complete" : started ? "started" : ""}`}
                    style={
                      {
                        "--stage-color": stageColor(stageNumber(topic.stage)),
                      } as CSSProperties
                    }
                    aria-label={`Chapter ${topic.order}, ${topic.title}, ${done ? "complete" : started ? "practice in progress" : "not complete"}`}
                    title={`${topic.order}. ${topic.title} · ${done ? "Complete" : started ? "In progress" : "Not complete"}`}
                    onClick={() => onRead(topic.slug)}
                  >
                    <span>{topic.order}</span>
                    {done && <Icon name="check" size={15} />}
                  </button>
                );
              })}
            </div>
            <p className="rb-progress-caption">
              One tile per chapter, coloured by stage. Choose a tile to open its
              chapter.
            </p>
            <div className="rb-progress-legend">
              <span>
                <i className="complete" />
                Complete
              </span>
              <span>
                <i className="started" />
                In progress
              </span>
              <span>
                <i />
                Not started
              </span>
            </div>
          </section>
          <dl className="rb-progress-stats">
            <div className="rb-card">
              <dd>{learning.totals.accuracy}%</dd>
              <dt>Overall accuracy</dt>
            </div>
            <div className="rb-card">
              <dd>{learning.totals.totalAnswers.toLocaleString()}</dd>
              <dt>Questions answered</dt>
            </div>
            <div className="rb-card">
              <dd>{learning.totals.correctAnswers.toLocaleString()}</dd>
              <dt>Correct answers</dt>
            </div>
          </dl>
          <button
            className="rb-card rb-progress-mistakes-link"
            type="button"
            onClick={onMistakes}
          >
            <span className="rb-practice-review-icon" aria-hidden="true">
              <Icon name="bulb" size={23} />
            </span>
            <span>
              <strong>Learn from your mistakes</strong>
              <span>
                {learning.mistakes.length
                  ? `${learning.mistakes.length} saved ${learning.mistakes.length === 1 ? "answer" : "answers"} waiting for a closer look`
                  : "Your saved incorrect answers will appear here"}
              </span>
            </span>
            <Icon name="chevronRight" size={20} />
          </button>
        </div>
        <section
          className="rb-card rb-progress-stages"
          aria-labelledby="stage-progress-title"
        >
          <h2 id="stage-progress-title">By stage</h2>
          {stages.map((stage) => {
            const members = topics.filter(
              (topic) => (topic.stage ?? "1 · Foundations") === stage,
            );
            const done = members.filter(
              (topic) => learning.progress[topic.slug]?.isCompleted,
            ).length;
            const number = stageNumber(stage);
            return (
              <div className="rb-progress-stage" key={stage}>
                <Tile stage={number} size={38} />
                <div>
                  <div className="rb-progress-stage-label">
                    <h3>{stageTitle(stage)}</h3>
                    <span>
                      {done}/{members.length}
                    </span>
                  </div>
                  <div
                    className="rb-progress-stage-bar"
                    role="progressbar"
                    aria-label={`${stageTitle(stage)} progress`}
                    aria-valuenow={done}
                    aria-valuemax={members.length}
                    aria-valuemin={0}
                  >
                    <span
                      style={{
                        width: `${(done / members.length) * 100}%`,
                        background: stageColor(number),
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
          <p className="rb-progress-caption">
            Score 16/20 in one session to complete a chapter. Completion records
            practice progress; it is not a CEFR certificate.
          </p>
        </section>
      </div>
      <p className="rb-progress-storage">
        Progress is saved on this browser. Account learning syncs when
        connected.
      </p>
    </div>
  );
}

type MistakesProps = Omit<ProgressProps, "onMistakes"> & {
  onPractice: (slug: string) => void;
  onBack?: () => void;
};
export function Mistakes({
  courseId,
  topics,
  learning,
  onRead,
  onPractice,
  onBack,
}: MistakesProps) {
  const [shown, setShown] = useState(12);
  const focus = (slug: string) => {
    learning.startFocusedSession(slug);
    onPractice(slug);
  };
  return (
    <div className="rb-mistakes-view" data-course={courseId}>
      {onBack && (
        <button className="rb-practice-back" type="button" onClick={onBack}>
          <Icon name="chevronLeft" size={18} /> Mistake review
        </button>
      )}
      <header className="rb-practice-page-title">
        <h1>A closer look</h1>
        <p>
          Review an answer and its explanation, then revisit the chapter or
          practise with these questions prioritised. Earlier scores may not
          include detailed answer history.
        </p>
      </header>
      {!learning.mistakes.length ? (
        <div className="rb-card rb-practice-empty">
          <span className="rb-practice-empty-symbol" aria-hidden="true">
            <Icon name="check" size={30} />
          </span>
          <h2>Nothing waiting for review</h2>
          <p>Incorrect answers from saved practice appear here.</p>
        </div>
      ) : (
        <div className="rb-mistakes-grid">
          {learning.mistakes.slice(0, shown).map((mistake) => {
            const topic = topics.find(
              (topic) => topic.slug === mistake.topicSlug,
            );
            const item = topic?.quizItems.find(
              (item) => item.id === mistake.itemId,
            );
            if (!topic || !item) return null;
            return (
              <article className="rb-card rb-mistake-card" key={mistake.id}>
                <p className="rb-practice-eyebrow">{topic.title}</p>
                <h2 className="rb-mistake-prompt" lang={courseId}>
                  {item.prompt}
                </h2>
                <dl className="rb-mistake-answers">
                  <div>
                    <dt>Your answer</dt>
                    <dd>
                      {
                        item.choices.find(
                          (choice) => choice.id === mistake.choice,
                        )?.text
                      }
                    </dd>
                  </div>
                  <div>
                    <dt>Correct answer</dt>
                    <dd className="rb-practice-correct-text">
                      {
                        item.choices.find(
                          (choice) => choice.id === item.answerId,
                        )?.text
                      }
                    </dd>
                  </div>
                </dl>
                <PracticeExplanation
                  item={item}
                  selected={mistake.choice as "A" | "B" | "C" | "D"}
                />
                <div className="rb-practice-paired-actions">
                  <button
                    className="rb-button secondary"
                    type="button"
                    onClick={() => onRead(topic.slug)}
                  >
                    Study chapter
                  </button>
                  <button
                    className="rb-button"
                    type="button"
                    disabled={learning.resetWaiting}
                    onClick={() => focus(topic.slug)}
                  >
                    Focus practice
                  </button>
                </div>
                <button
                  className="rb-practice-quiet-button"
                  type="button"
                  onClick={() => learning.markReviewed(mistake.id, topic.slug)}
                >
                  Mark reviewed <Icon name="check" size={16} />
                </button>
              </article>
            );
          })}
        </div>
      )}
      {shown < learning.mistakes.length && (
        <button
          className="rb-button secondary rb-mistakes-more"
          type="button"
          onClick={() => setShown((value) => value + 12)}
        >
          Show more mistakes
        </button>
      )}
    </div>
  );
}
