import { contentSources } from "../services/contentService";
import type { GrammarTopic } from "../types/grammar";
import { RichText } from "./RichText";
type Props = {
  topic: GrammarTopic;
  onPractice: () => void;
  onNext?: () => void;
};
export function TopicReader({ topic, onPractice, onNext }: Props) {
  const chapter = topic.chapter;
  const rules = chapter?.rules ?? topic.rules;
  const skills = [...new Set(topic.quizItems.map((q) => q.skill))];
  const worked = skills.map(
    (skill, i) => topic.quizItems.filter((q) => q.skill === skill)[i * 3],
  );
  const minutes = Math.max(
    3,
    Math.ceil(
      (
        JSON.stringify(chapter ?? rules) +
        worked
          .map((q) => (q ? q.prompt + q.teaching?.steps.join(" ") : ""))
          .join(" ")
      ).split(/\s+/).length / 180,
    ),
  );
  return (
    <article className="topic-reader panel-enter">
      <header className="topic-intro">
        <p className="eyebrow">
          Chapter {topic.order} · {topic.level}
        </p>
        <h1>{topic.title}</h1>
        <p className="lead">{topic.summary}</p>
        <div className="reading-meta">
          <span>{rules.length} reading sections</span>
          <span>About {minutes} minutes to read</span>
          <span>{topic.quizItems.length} practice questions</span>
        </div>
      </header>
      <nav className="lesson-outline" aria-label="In this topic">
        <p className="eyebrow">In this chapter</p>
        <ol>
          {rules.map((rule, index) => (
            <li key={rule.title}>
              <a href={rule.id ? `#concept-${rule.id}` : `#rule-${index}`}>
                <span aria-hidden="true">{index + 1}</span>
                {rule.title}
              </a>
            </li>
          ))}
          <li>
            <a href="#worked-examples">Worked examples</a>
          </li>
        </ol>
      </nav>
      <div className="chapter-introduction">
        {chapter?.introduction.map((p, i) => (
          <p key={i}>
            <RichText>{p}</RichText>
          </p>
        ))}
      </div>
      <div className="reading-rules">
        {rules.map((rule, index) => (
          <section
            className="reading-rule"
            id={rule.id ? `concept-${rule.id}` : `rule-${index}`}
            key={rule.title}
            tabIndex={-1}
          >
            {rule.id && <span id={`rule-${index}`} aria-hidden="true" />}
            <p className="eyebrow">{String(index + 1).padStart(2, "0")}</p>
            <h2>{rule.title}</h2>
            <p>
              <RichText>{rule.explanation}</RichText>
            </p>
            {rule.pattern && (
              <p className="rule-pattern">
                <RichText>{rule.pattern}</RichText>
              </p>
            )}
            {rule.paragraphs?.map((p, i) => (
              <p key={i}>
                <RichText>{p}</RichText>
              </p>
            ))}
            <div className="examples">
              <p className="example-label">Examples</p>
              {rule.examples.map((example, i) => (
                <p key={i}>
                  <RichText>{example}</RichText>
                </p>
              ))}
            </div>
            {!!rule.commonMistakes?.length && (
              <div className="common-mistake">
                <strong>A closer look</strong>
                {rule.commonMistakes.map((mistake, i) => (
                  <p key={i}>
                    <RichText>{mistake}</RichText>
                  </p>
                ))}
              </div>
            )}
          </section>
        ))}
      </div>
      <section
        className="reading-rule worked-examples"
        id="worked-examples"
        tabIndex={-1}
      >
        <p className="eyebrow">From the rule to the answer</p>
        <h2>Worked examples</h2>
        <p>
          Read the question, notice the clue, then follow the explanation. Each
          example practises a different part of this chapter.
        </p>
        {worked.map(
          (q, i) =>
            q && (
              <div className="worked-example" key={q.id}>
                <h3>Example {i + 1}</h3>
                <p>{q.prompt}</p>
                <p className="worked-answer">
                  Answer:{" "}
                  <strong>
                    {q.choices.find((c) => c.id === q.answerId)?.text}
                  </strong>
                </p>
                <ol>
                  {q.teaching?.steps.slice(0, 2).map((step, j) => (
                    <li key={j}>
                      <RichText>{step}</RichText>
                    </li>
                  ))}
                </ol>
              </div>
            ),
        )}
      </section>
      {!!chapter?.recap.length && (
        <section className="chapter-recap">
          <h2>The patterns to remember</h2>
          <ul>
            {chapter.recap.map((p, i) => (
              <li key={i}>
                <RichText>{p}</RichText>
              </li>
            ))}
          </ul>
        </section>
      )}
      <div className="practice-invitation">
        <div>
          <h2>Put it into practice</h2>
          <p>20 randomly selected questions. Take your time.</p>
        </div>
        <button type="button" className="button primary" onClick={onPractice}>
          Practise this topic <span aria-hidden="true">→</span>
        </button>
      </div>
      {onNext && (
        <button type="button" className="next-reading" onClick={onNext}>
          Continue reading: next chapter <span aria-hidden="true">→</span>
        </button>
      )}
      <details className="reading-details">
        <summary>Study guide & learning goals</summary>
        <div className="disclosure-content">
          <p>{topic.guidance}</p>
          <ul>
            {topic.learningGoals.map((goal) => (
              <li key={goal}>{goal}</li>
            ))}
          </ul>
        </div>
      </details>
      <details className="reading-details">
        <summary>Sources for this chapter</summary>
        <div className="disclosure-content">
          <p>
            These published references inform the grammar and scope. The
            explanations and practice are original; they are not official
            examination items.
          </p>
          <ul>
            {contentSources
              .filter((source) =>
                (
                  topic.readingReferenceIds ?? topic.provenance?.referenceIds
                )?.includes(source.id),
              )
              .map((source) => (
                <li key={source.id}>
                  <a href={source.url} target="_blank" rel="noreferrer">
                    {source.publisher}: {source.title}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </li>
              ))}
          </ul>
        </div>
      </details>
    </article>
  );
}
