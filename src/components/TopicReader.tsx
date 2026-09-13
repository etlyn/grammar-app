import { contentSources } from "../services/contentService";
import type { GrammarTopic } from "../types/grammar";

type Props = { topic: GrammarTopic; onPractice: () => void };
export function TopicReader({ topic, onPractice }: Props) {
  return (
    <article className="topic-reader panel-enter">
      <header className="topic-intro">
        <h1>{topic.title}</h1>
        <p className="lead">{topic.summary}</p>
        <div className="reading-meta">
          <span>{topic.rules.length} short lessons</span>
          <span>200 practice questions</span>
        </div>
      </header>
      <nav className="lesson-outline" aria-label="In this topic">
        <p className="eyebrow">In this topic</p>
        <ol>
          {topic.rules.map((rule, index) => (
            <li key={rule.title}>
              <a href={`#rule-${index}`}>
                <span aria-hidden="true">{index + 1}</span>
                {rule.title}
              </a>
            </li>
          ))}
        </ol>
      </nav>
      <div className="reading-rules">
        {topic.rules.map((rule, index) => (
          <section
            className="reading-rule"
            id={`rule-${index}`}
            key={rule.title}
            tabIndex={-1}
          >
            <p className="eyebrow">Lesson {index + 1}</p>
            <h2>{rule.title}</h2>
            <p>{rule.explanation}</p>
            <div className="examples">
              <p className="example-label">Examples</p>
              {rule.examples.map((example) => (
                <p key={example}>{example}</p>
              ))}
            </div>
            {!!rule.commonMistakes?.length && (
              <div className="common-mistake">
                <strong>Watch out</strong>
                {rule.commonMistakes.map((mistake) => (
                  <p key={mistake}>{mistake}</p>
                ))}
              </div>
            )}
          </section>
        ))}
      </div>
      <section className="reading-tips">
        <h2>Keep in mind</h2>
        <ul>
          {topic.tips.map((tip) => (
            <li key={tip}>{tip}</li>
          ))}
        </ul>
      </section>
      <div className="practice-invitation">
        <div>
          <h2>Put it into practice</h2>
          <p>20 questions. Take your time.</p>
        </div>
        <button type="button" className="button primary" onClick={onPractice}>
          Practise this topic <span aria-hidden="true">→</span>
        </button>
      </div>
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
        <summary>Sources & how this content is made</summary>
        <div className="disclosure-content">
          <p>
            Original Grammacho practice follows these published learning
            references. Questions are generated offline with AI assistance;
            independent educator review is pending. These are not official exam
            questions.
          </p>
          <ul>
            {contentSources
              .filter((source) =>
                topic.provenance?.referenceIds.includes(source.id),
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
          <p>
            Practice levels are approximate teaching labels. Completing a topic
            does not certify a CEFR level.
          </p>
        </div>
      </details>
    </article>
  );
}
