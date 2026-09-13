import type { QuizItem, QuizChoice } from "../types/grammar";
import { RichText } from "./RichText";
export function AnswerExplanation({
  item,
  selected,
}: {
  item: QuizItem;
  selected: QuizChoice["id"];
}) {
  const wrong = selected !== item.answerId;
  const choice = item.choices.find((c) => c.id === selected)!;
  return (
    <div className="solution-explanation">
      {wrong && (
        <p className="choice-diagnosis">
          <strong>Why “{choice.text}” does not fit: </strong>
          <RichText>
            {item.teaching?.choiceReasons[selected] ?? item.explanation}
          </RichText>
        </p>
      )}
      <p className="example-label">How to find the answer</p>
      <ol>
        {(item.teaching?.steps ?? [item.explanation]).map((step, i) => (
          <li key={i}>
            <RichText>{step}</RichText>
          </li>
        ))}
      </ol>
      <details>
        <summary>Compare all four answers</summary>
        <dl className="choice-reasons">
          {item.choices.map((c) => (
            <div key={c.id}>
              <dt>
                {c.id}. {c.text}
                {c.id === item.answerId ? " · Correct" : ""}
              </dt>
              <dd>
                <RichText>
                  {item.teaching?.choiceReasons[c.id] ?? item.explanation}
                </RichText>
              </dd>
            </div>
          ))}
        </dl>
      </details>
    </div>
  );
}
