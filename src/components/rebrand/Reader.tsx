import { useEffect, useMemo, useRef, useState } from "react";
import type { GrammarTopic, TopicProgress } from "../../types/grammar";
import type { PracticeSession } from "../../utils/learningState";
import { RichText } from "../RichText";
import { Icon, Tile } from "./Brand";
import { chapterRules, stageNumber, type LearningSource } from "./learningView";
import "./rebrand-learning.css";

export type ReaderProps = {
  topic: GrammarTopic;
  nextTopic?: GrammarTopic;
  progress?: TopicProgress;
  session?: PracticeSession;
  sectionId?: string;
  chapterCount?: number;
  topics?: GrammarTopic[];
  sources?: LearningSource[];
  courseId?: "en" | "es";
  onBack: () => void;
  onRead: (slug: string, sectionId?: string) => void;
  onPractice: (slug: string) => void;
};

/** Same presentation rule as the released native Reader: task labels become captions. */
export function splitReadingExample(example: string): {
  sentence: string;
  note: string;
} {
  const at = example.indexOf(": ");
  if (at > 0) {
    const head = example.slice(0, at),
      tail = example.slice(at + 2);
    const leadIn = head.split(/[.!?]["”’]?\s+/).pop() ?? head;
    if (
      leadIn.trim().split(/\s+/).length >= 2 &&
      !head.includes("**") &&
      tail.includes("**") &&
      !tail.includes(": ")
    )
      return { sentence: tail, note: head };
  }
  return { sentence: example, note: "" };
}

export function Reader({
  topic,
  nextTopic,
  progress,
  session,
  sectionId,
  chapterCount,
  topics = [],
  sources = [],
  onBack,
  onRead,
  onPractice,
}: ReaderProps) {
  const article = useRef<HTMLElement>(null);
  const contents = useRef<HTMLDetailsElement>(null);
  const [readProgress, setReadProgress] = useState(0);
  const rules = chapterRules(topic);
  const worked = useMemo(
    () =>
      [...new Set(topic.quizItems.map((question) => question.skill))].flatMap(
        (skill, index) => {
          const pool = topic.quizItems.filter(
            (question) => question.skill === skill,
          );
          const question = pool[(index * 3) % pool.length];
          return question ? [question] : [];
        },
      ),
    [topic],
  );
  const minutes = Math.max(
    3,
    Math.ceil(
      (
        JSON.stringify({
          i: topic.chapter?.introduction,
          r: rules,
          c: topic.chapter?.recap,
        }) +
        worked
          .map(
            (question) =>
              question.prompt + (question.teaching?.steps.join(" ") ?? ""),
          )
          .join(" ")
      ).split(/\s+/).length / 180,
    ),
  );
  const resuming = session && !session.complete;
  const referenced = sources.filter((source) =>
    (topic.readingReferenceIds ?? topic.provenance?.referenceIds)?.includes(
      source.id,
    ),
  );
  const prerequisites = topics.filter((candidate) =>
    topic.prerequisites?.includes(candidate.slug),
  );

  useEffect(() => {
    if (!sectionId) return;
    const frame = requestAnimationFrame(() => {
      const section = document.getElementById(`concept-${sectionId}`);
      section?.scrollIntoView({ block: "start", behavior: "instant" });
      section?.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(frame);
  }, [sectionId, topic.slug]);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const bounds = article.current?.getBoundingClientRect();
      if (bounds)
        setReadProgress(
          Math.max(
            0,
            Math.min(
              1,
              (82 - bounds.top) /
                Math.max(1, bounds.height - window.innerHeight + 82),
            ),
          ),
        );
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    const observer = new ResizeObserver(schedule);
    if (article.current) observer.observe(article.current);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [topic.slug]);

  return (
    <article
      className="rb-learning-page rb-reader"
      ref={article}
      aria-labelledby="rb-reader-title"
    >
      <div className="rb-reader-navigation">
        <button type="button" className="rb-learning-back" onClick={onBack}>
          <Icon name="arrowLeft" size={20} />
          <span>Back</span>
        </button>
        <span>
          Chapter {topic.order}
          {chapterCount ? ` of ${chapterCount}` : ""}
        </span>
        <button
          type="button"
          className="rb-learning-icon-button"
          aria-label="In this chapter"
          aria-controls="rb-reader-contents"
          onClick={() => {
            if (!contents.current) return;
            contents.current.open = true;
            contents.current.scrollIntoView({ block: "start" });
            contents.current
              .querySelector("summary")
              ?.focus({ preventScroll: true });
          }}
        >
          <Icon name="list" size={21} />
        </button>
      </div>
      <div className="rb-reader-progress" aria-hidden="true">
        <span style={{ transform: `scaleX(${readProgress})` }} />
      </div>
      <header className="rb-reader-intro">
        <div className="rb-reader-eyebrow">
          <Tile stage={stageNumber(topic.stage)} size={30} />
          <p className="rb-learning-eyebrow">
            Chapter {topic.order} · {topic.level}
          </p>
        </div>
        <h1 id="rb-reader-title">{topic.title}</h1>
        <p className="rb-reader-summary">{topic.summary}</p>
        <div className="rb-learning-pills">
          <span className="rb-learning-pill">{rules.length} sections</span>
          <span className="rb-learning-pill">About {minutes} min</span>
          <span className="rb-learning-pill">
            {topic.quizItems.length} questions
          </span>
          {progress?.isCompleted ? (
            <span className="rb-learning-pill rb-learning-pill-ok">
              Complete · best {progress.bestScore ?? progress.lastScore}%
            </span>
          ) : (
            !!progress?.completedSessions && (
              <span className="rb-learning-pill rb-learning-pill-brand">
                Last {progress.lastScore}%
              </span>
            )
          )}
        </div>
      </header>
      <details
        ref={contents}
        className="rb-learning-details rb-reader-contents"
        id="rb-reader-contents"
        open={!sectionId}
        key={`contents-${topic.slug}-${sectionId ?? "top"}`}
      >
        <summary>
          <strong>In this chapter</strong>
          <span className="rb-learning-caption">
            {rules.length + Number(!!worked.length)} parts
          </span>
          <Icon name="chevronDown" size={18} />
        </summary>
        <nav aria-label="Chapter contents">
          <ol>
            {rules.map((rule, index) => (
              <li key={rule.id ?? rule.title}>
                <a href={rule.id ? `#concept-${rule.id}` : `#rule-${index}`}>
                  <span>{index + 1}</span>
                  {rule.title}
                </a>
              </li>
            ))}
            {!!worked.length && (
              <li>
                <a href="#worked-examples">
                  <span aria-hidden="true" />
                  <strong>Worked examples</strong>
                </a>
              </li>
            )}
          </ol>
        </nav>
      </details>
      <div className="rb-reader-introduction">
        {topic.chapter?.introduction.map((paragraph, index) => (
          <p key={index}>
            <RichText>{paragraph}</RichText>
          </p>
        ))}
      </div>
      <div className="rb-reader-rules">
        {rules.map((rule, index) => (
          <section
            className="rb-reader-rule"
            id={rule.id ? `concept-${rule.id}` : `rule-${index}`}
            key={rule.id ?? rule.title}
            tabIndex={-1}
            aria-labelledby={`rb-rule-heading-${index}`}
          >
            {rule.id && <span id={`rule-${index}`} aria-hidden="true" />}
            <header>
              <p className="rb-learning-eyebrow">
                {String(index + 1).padStart(2, "0")}
              </p>
              <h2 id={`rb-rule-heading-${index}`}>{rule.title}</h2>
            </header>
            <p>
              <RichText>{rule.explanation}</RichText>
            </p>
            {rule.pattern && (
              <div className="rb-reader-pattern">
                <p className="rb-learning-eyebrow">Pattern</p>
                <p>
                  <RichText>{rule.pattern}</RichText>
                </p>
              </div>
            )}
            {rule.paragraphs?.map((paragraph, position) => (
              <p key={position}>
                <RichText>{paragraph}</RichText>
              </p>
            ))}
            {!!rule.examples.length && (
              <div className="rb-reader-examples">
                <h3 className="rb-learning-eyebrow">Examples</h3>
                {rule.examples.map((example, position) => {
                  const { sentence, note } = splitReadingExample(example);
                  return (
                    <div className="rb-reader-example" key={position}>
                      <p>
                        <RichText>{sentence}</RichText>
                      </p>
                      {note && <small>{note}</small>}
                    </div>
                  );
                })}
              </div>
            )}
            {!!rule.commonMistakes?.length && (
              <aside className="rb-reader-closer">
                <h3>
                  <Icon name="info" size={18} />A closer look
                </h3>
                {rule.commonMistakes.map((mistake, position) => (
                  <p key={position}>
                    <RichText>{mistake}</RichText>
                  </p>
                ))}
              </aside>
            )}
          </section>
        ))}
      </div>
      {!!worked.length && (
        <section
          className="rb-reader-worked"
          id="worked-examples"
          tabIndex={-1}
          aria-labelledby="rb-worked-title"
        >
          <header>
            <p className="rb-learning-eyebrow">From the rule to the answer</p>
            <h2 id="rb-worked-title">Worked examples</h2>
          </header>
          <p className="rb-reader-utility-copy">
            Read the question, notice the clue, then follow the explanation.
            Each example practises a different part of this chapter.
          </p>
          {worked.map((question, index) => (
            <section
              className="rb-reader-worked-card"
              key={question.id}
              aria-labelledby={`rb-example-${index}`}
            >
              <h3 className="rb-learning-eyebrow" id={`rb-example-${index}`}>
                Example {index + 1}
              </h3>
              <p className="rb-reader-question">{question.prompt}</p>
              <p className="rb-reader-answer">
                <span className="rb-learning-done">
                  <Icon name="check" size={14} />
                </span>
                <span>
                  <span className="sr-only">Answer: </span>
                  {
                    question.choices.find(
                      (choice) => choice.id === question.answerId,
                    )?.text
                  }
                </span>
              </p>
              {question.teaching?.steps.length ? (
                <ol>
                  {question.teaching.steps.slice(0, 2).map((step, position) => (
                    <li key={position}>
                      <RichText>{step}</RichText>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="rb-reader-utility-copy">
                  <RichText>{question.explanation}</RichText>
                </p>
              )}
            </section>
          ))}
        </section>
      )}
      {!!topic.chapter?.recap.length && (
        <section className="rb-reader-recap" aria-labelledby="rb-recap-title">
          <h2 id="rb-recap-title">The patterns to remember</h2>
          <ul>
            {topic.chapter.recap.map((point, index) => (
              <li key={index}>
                <RichText>{point}</RichText>
              </li>
            ))}
          </ul>
        </section>
      )}
      {nextTopic && (
        <button
          type="button"
          className="rb-reader-next"
          onClick={() => onRead(nextTopic.slug)}
        >
          <span>
            <small>Continue reading · Chapter {nextTopic.order}</small>
            <strong>{nextTopic.title}</strong>
          </span>
          <Icon name="arrowRight" size={22} />
        </button>
      )}
      <div className="rb-reader-guide">
        <details className="rb-learning-details">
          <summary>
            <strong>Study guide &amp; learning goals</strong>
            <Icon name="chevronDown" size={18} />
          </summary>
          <div className="rb-learning-disclosure-body">
            <p>{topic.guidance}</p>
            <ul>
              {topic.learningGoals.map((goal) => (
                <li key={goal}>{goal}</li>
              ))}
            </ul>
            {!!prerequisites.length && (
              <>
                <h3>Helpful chapters</h3>
                <ul>
                  {prerequisites.map((prerequisite) => (
                    <li key={prerequisite.slug}>
                      <button
                        type="button"
                        className="rb-learning-text-button"
                        onClick={() => onRead(prerequisite.slug)}
                      >
                        {prerequisite.title}
                        <Icon name="arrowRight" size={15} />
                      </button>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </details>
        <details className="rb-learning-details">
          <summary>
            <strong>Sources for this chapter</strong>
            <Icon name="chevronDown" size={18} />
          </summary>
          <div className="rb-learning-disclosure-body">
            <p>
              These published references inform the grammar and scope. The
              explanations and practice are original; they are not official
              examination items. Independent educator review is pending.
            </p>
            {!!referenced.length && (
              <ul className="rb-learning-source-list">
                {referenced.map((source) => (
                  <li key={source.id}>
                    <a href={source.url} target="_blank" rel="noreferrer">
                      {source.publisher}: {source.title}
                      <Icon name="external" size={16} />
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </details>
      </div>
      <div className="rb-reader-practice-bar">
        <div>
          <span className="rb-reader-practice-context">
            Chapter {topic.order} · {topic.title}
          </span>
          <button
            type="button"
            className="rb-learning-button rb-learning-button-primary"
            onClick={() => onPractice(topic.slug)}
          >
            {resuming
              ? `Resume practice · ${session.answers.length}/${session.itemIds.length}`
              : "Practise this chapter"}
            <Icon name="arrowRight" size={20} />
          </button>
        </div>
      </div>
    </article>
  );
}

export default Reader;
