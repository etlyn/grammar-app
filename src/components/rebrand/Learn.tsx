import { useEffect, useMemo, useRef, useState } from "react";
import type { GrammarMap, GrammarTopic } from "../../types/grammar";
import { Icon, Tile } from "./Brand";
import {
  LearningChapterRow,
  LearningMeter,
  stageLabel,
  stageNumber,
  type LearningViewState,
} from "./learningView";
import "./rebrand-learning.css";

export type LearnProps = {
  courseId: "en" | "es";
  topics: GrammarTopic[];
  map: GrammarMap;
  learning: LearningViewState;
  startSlug?: string;
  onRead: (slug: string, sectionId?: string) => void;
  onPractice: (slug: string) => void;
  onMap: () => void;
};

export function Learn({
  topics,
  map,
  learning,
  startSlug,
  onRead,
  onPractice,
  onMap,
}: LearnProps) {
  const rail = useRef<HTMLDivElement>(null);
  const stages = useMemo(
    () => [...new Set(topics.map((topic) => topic.stage ?? "1 · Foundations"))],
    [topics],
  );
  const resumeTopic = useMemo(
    () =>
      topics
        .filter(
          (topic) =>
            learning.sessions[topic.slug] &&
            !learning.sessions[topic.slug].complete,
        )
        .sort((a, b) =>
          (learning.progress[b.slug]?.updatedAt ?? "").localeCompare(
            learning.progress[a.slug]?.updatedAt ?? "",
          ),
        )[0],
    [topics, learning.sessions, learning.progress],
  );
  const continueTopic = topics.find(
    (topic) => topic.slug === learning.activeSlug,
  );
  const hero =
    resumeTopic ??
    continueTopic ??
    topics.find((topic) => topic.slug === startSlug) ??
    topics[0];
  const [stage, setStage] = useState(
    hero?.stage ?? stages[0] ?? "1 · Foundations",
  );
  useEffect(
    () => setStage(hero?.stage ?? stages[0] ?? "1 · Foundations"),
    [hero?.stage, hero?.slug, stages],
  );
  useEffect(() => {
    const selected = rail.current?.querySelector<HTMLButtonElement>(
      '[aria-pressed="true"]',
    );
    if (!selected || !rail.current) return;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    rail.current.scrollTo({
      left: Math.max(0, selected.offsetLeft - rail.current.offsetLeft - 60),
      behavior: reduced ? "instant" : "smooth",
    });
  }, [stage]);
  const done = (name: string) =>
    topics.filter(
      (topic) =>
        (topic.stage ?? stages[0]) === name &&
        learning.progress[topic.slug]?.isCompleted,
    ).length;
  const members = topics.filter(
    (topic) => (topic.stage ?? stages[0]) === stage,
  );
  const mode = resumeTopic ? "resume" : continueTopic ? "continue" : "start";
  const answered = resumeTopic
    ? learning.sessions[resumeTopic.slug].answers.length
    : 0;
  const sessionLength = resumeTopic
    ? learning.sessions[resumeTopic.slug].itemIds.length
    : 20;
  if (!hero)
    return (
      <section className="rb-learning-empty" role="status">
        <Tile stage={11} size={64} />
        <h1>This course is not available</h1>
        <p>Choose another course to keep learning.</p>
      </section>
    );
  const copy = {
    resume: {
      eyebrow: "Resume practice",
      detail: `Chapter ${hero.order} · ${hero.level} · ${answered} of ${sessionLength} answered`,
      action: "Resume practice",
    },
    continue: {
      eyebrow: "Continue",
      detail: `Chapter ${hero.order} · ${hero.level}`,
      action: "Continue reading",
    },
    start: {
      eyebrow: "Start here",
      detail:
        hero.order === 1
          ? hero.summary
          : `Chapter ${hero.order} · ${hero.level} · ${stageLabel(hero.stage)}`,
      action: hero.order === 1 ? "Start with the foundations" : "Start reading",
    },
  }[mode];

  return (
    <section
      className="rb-learning-page rb-learn"
      aria-labelledby="rb-learn-title"
    >
      <header className="rb-learning-page-header">
        <div>
          <h1 id="rb-learn-title">Learn</h1>
          <p>
            {topics.length} chapters · {stages.length} stages ·{" "}
            {learning.totals?.completedTopics ??
              Object.values(learning.progress).filter(
                (progress) => progress.isCompleted,
              ).length}{" "}
            complete
          </p>
        </div>
      </header>
      <section className="rb-learning-hero" aria-labelledby="rb-hero-title">
        <Tile
          stage={stageNumber(hero.stage)}
          size={184}
          className="rb-learning-hero-tile"
        />
        <div className="rb-learning-hero-copy">
          <p className="rb-learning-eyebrow">{copy.eyebrow}</p>
          <h2 id="rb-hero-title">{hero.title}</h2>
          <p>{copy.detail}</p>
        </div>
        {mode === "resume" && (
          <LearningMeter
            value={answered}
            max={sessionLength}
            label="Session progress"
            inverse
          />
        )}
        <button
          type="button"
          className="rb-learning-button rb-learning-button-inverse"
          onClick={() =>
            mode === "resume" ? onPractice(hero.slug) : onRead(hero.slug)
          }
        >
          {copy.action}
          <Icon name="arrowRight" size={20} />
        </button>
      </section>
      <section className="rb-learning-path" aria-labelledby="rb-path-title">
        <div className="rb-learning-section-heading">
          <h2 id="rb-path-title">Your path</h2>
          <span className="rb-learning-caption">
            Stage {stageNumber(stage)} of {stages.length}
          </span>
        </div>
        <div
          className="rb-learning-stages"
          ref={rail}
          role="group"
          aria-label="Choose a learning stage"
        >
          {stages.map((name) => {
            const total = topics.filter(
              (topic) => (topic.stage ?? stages[0]) === name,
            ).length;
            return (
              <button
                key={name}
                type="button"
                className="rb-learning-stage"
                aria-pressed={name === stage}
                aria-label={`Stage ${stageNumber(name)}, ${stageLabel(name)}, ${done(name)} of ${total} chapters complete`}
                onClick={() => setStage(name)}
              >
                <Tile stage={stageNumber(name)} size={44} />
                <span className="rb-learning-stage-copy">
                  <small>Stage {stageNumber(name)}</small>
                  <strong>{stageLabel(name)}</strong>
                </span>
                <span className="rb-learning-stage-progress">
                  <LearningMeter
                    value={done(name)}
                    max={total}
                    label={`${stageLabel(name)} progress`}
                  />
                  <small>
                    {done(name)}/{total}
                  </small>
                </span>
              </button>
            );
          })}
        </div>
      </section>
      <section
        aria-labelledby="rb-stage-title"
        className="rb-learning-stage-chapters"
      >
        <div className="rb-learning-section-heading">
          <h2 id="rb-stage-title">{stageLabel(stage)}</h2>
          <span
            className={`rb-learning-pill${done(stage) ? " rb-learning-pill-ok" : ""}`}
          >
            {done(stage)} of {members.length} complete
          </span>
        </div>
        <div className="rb-learning-list">
          {members.map((topic) => (
            <LearningChapterRow
              key={topic.slug}
              topic={topic}
              learning={learning}
              onRead={onRead}
            />
          ))}
        </div>
      </section>
      <button type="button" className="rb-learning-map-link" onClick={onMap}>
        <Icon name="grid" size={22} />
        <span>
          <strong>Explore the grammar map</strong>
          <small>{map.domains.length} areas to find your way around</small>
        </span>
        <Icon name="arrowRight" size={20} />
      </button>
    </section>
  );
}

export default Learn;
