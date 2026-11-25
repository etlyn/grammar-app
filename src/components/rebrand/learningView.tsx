import type { GrammarTopic, ProgressByTopic } from "../../types/grammar";
import type { PracticeSession } from "../../utils/learningState";
import { Icon } from "./Brand";

export type LearningSource = {
  id: string;
  title: string;
  publisher: string;
  url: string;
};
export type LearningViewState = {
  activeSlug: string;
  progress: ProgressByTopic;
  sessions: Record<string, PracticeSession>;
  totals?: { completedTopics: number };
  storageMessage?: string;
};

export const stageNumber = (stage?: string) =>
  Math.max(1, Number.parseInt(stage ?? "1", 10) || 1);
export const stageLabel = (stage?: string) =>
  stage?.replace(/^\d+\s*[·.]\s*/, "") ?? "Foundations";
export const chapterRules = (topic: GrammarTopic) =>
  topic.chapter?.rules ?? topic.rules;

export function LearningMeter({
  value,
  max,
  label,
  inverse = false,
}: {
  value: number;
  max: number;
  label: string;
  inverse?: boolean;
}) {
  return (
    <span
      className={`rb-learning-meter${inverse ? " rb-learning-meter-inverse" : ""}`}
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={max || 1}
      aria-valuenow={value}
    >
      <span
        style={{
          width: `${Math.max(0, Math.min(100, max ? (value / max) * 100 : 0))}%`,
        }}
      />
    </span>
  );
}

export function LearningChapterRow({
  topic,
  learning,
  meta,
  onRead,
}: {
  topic: GrammarTopic;
  learning: LearningViewState;
  meta?: string;
  onRead: (slug: string) => void;
}) {
  const progress = learning.progress[topic.slug];
  const session = learning.sessions[topic.slug];
  const unfinished = session && !session.complete;
  const done = progress?.isCompleted;
  const status = unfinished
    ? `${session.answers.length} of ${session.itemIds.length} answered`
    : done
      ? "Complete"
      : "";
  const detail =
    meta ??
    `${topic.level} · ${chapterRules(topic).length} sections${done && progress?.bestScore ? ` · best ${progress.bestScore}%` : ""}`;
  return (
    <button
      type="button"
      className="rb-learning-chapter"
      onClick={() => onRead(topic.slug)}
      aria-label={`Chapter ${topic.order}, ${topic.title}, ${detail}${status ? `, ${status}` : ""}`}
    >
      <span
        className={`rb-learning-number${unfinished ? " is-active" : done ? " is-complete" : ""}`}
      >
        {String(topic.order).padStart(2, "0")}
      </span>
      <span className="rb-learning-row-copy">
        <strong>{topic.title}</strong>
        <small>{detail}</small>
      </span>
      {unfinished ? (
        <span className="rb-learning-pill rb-learning-pill-brand">
          {session.answers.length}/{session.itemIds.length}
        </span>
      ) : done ? (
        <span className="rb-learning-done">
          <Icon name="check" size={14} />
        </span>
      ) : (
        <Icon name="chevronRight" size={19} />
      )}
    </button>
  );
}
