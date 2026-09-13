import { sha, normalize } from "../foundations.mjs";
export const VERSION = "core-2026-09-v3";
export const row = (text) =>
  text
    .trim()
    .split("\n")
    .map((s) => s.split("|"));
export const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
// Every distractor is paired with its diagnosis before answer positions rotate.
export const task = (skill, prompt, correct, explanation, wrong, hint) => ({
  skill,
  prompt,
  correct,
  explanation,
  wrong,
  hint,
});
export function question(topic, contextKey, spec) {
  const key = `${topic.slug}|${contextKey}|${spec.skill}`;
  const h = sha(key);
  const id = `${h.slice(0, 8)}-${h.slice(8, 12)}-5${h.slice(13, 16)}-a${h.slice(17, 20)}-${h.slice(20, 32)}`;
  const entries = [[spec.correct, spec.explanation], ...spec.wrong];
  if (entries.length !== 4 || entries.some((e) => !e[0] || !e[1]))
    throw Error(`Incomplete options: ${key}`);
  const offset = parseInt(h.slice(-2), 16) % 4;
  const rotated = entries.slice(offset).concat(entries.slice(0, offset));
  const choices = rotated.map(([text], i) => ({ id: "ABCD"[i], text }));
  return {
    id,
    topicSlug: topic.slug,
    level: topic.level,
    prompt: spec.prompt,
    choices,
    answerId: choices.find((c) => c.text === spec.correct).id,
    hint:
      spec.hint ??
      topic.rules.find((r) => r.skill === spec.skill)?.explanation ??
      topic.rules[0].explanation,
    explanation: spec.explanation,
    keywords: [spec.skill],
    skill: spec.skill,
    contextKey,
    fingerprint: sha(normalize(`${topic.slug}|${spec.prompt}|${spec.correct}`)),
    source: "seed",
    provenance: topic.provenance,
    teaching: {
      steps: [
        spec.hint ??
          `Identify the structure being tested: **${spec.skill.replaceAll("-", " ")}**.`,
        spec.explanation,
        `Choose **${spec.correct}**. Read the complete sentence again and check both its form and its intended meaning.`,
      ],
      choiceReasons: Object.fromEntries(
        rotated.map((e, i) => ["ABCD"[i], e[1]]),
      ),
    },
  };
}
export function define(
  slug,
  title,
  level,
  reference,
  summary,
  lessons,
  contexts,
  make,
) {
  const provenance = {
    kind: "original-guidance-aligned",
    referenceIds: [reference],
    version: VERSION,
    reviewStatus: "automated-checked; educator-review-pending",
  };
  const rules = lessons.map(([title, explanation, pattern, edge], i) => ({
    title,
    explanation,
    pattern,
    commonMistakes: [edge],
    examples: [],
    skill: ["form", "meaning", "contrast", "application"][i],
  }));
  const topic = {
    slug,
    title,
    level,
    order: 0,
    summary,
    guidance:
      "Read the form and meaning together. Study the contrasts, then explain a worked example in your own words before starting a fresh practice session.",
    learningGoals: lessons.map((l) => l[0]),
    rules,
    tips: [],
    source: "seed",
    provenance,
  };
  topic.quizItems = contexts.flatMap((context, i) =>
    make(context, i).map((spec) => question(topic, `${slug}-${i + 1}`, spec)),
  );
  for (let i = 0; i < rules.length; i++)
    rules[i].examples = topic.quizItems
      .filter((q) => q.skill === topic.quizItems[i].skill)
      .slice(0, 2)
      .map((q) =>
        q.prompt.includes("____")
          ? q.prompt.replace(
              "____",
              `**${q.choices.find((c) => c.id === q.answerId).text}**`,
            )
          : `${q.prompt} → **${q.choices.find((c) => c.id === q.answerId).text}**`,
      );
  topic.chapter = {
    introduction: [
      summary,
      "The form tells you how to build the sentence; the context tells you why that form is useful. Read each section with both questions in mind. The examples make one contrast at a time, while the practice mixes the skills so that you learn to recognise the pattern yourself.",
    ],
    rules,
    recap: lessons.map((l) => l[2]),
  };
  return topic;
}
