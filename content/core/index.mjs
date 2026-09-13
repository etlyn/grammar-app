import { buildBasics } from "./basics.mjs";
import { buildTenses } from "./tenses.mjs";
import { buildVerbs } from "./verbs.mjs";
import { buildClauses } from "./clauses.mjs";
import { buildAdvanced } from "./advanced.mjs";
import { buildModifiers } from "./modifiers.mjs";
import { buildLexical } from "./lexical.mjs";
import { buildReference } from "./reference.mjs";
export { VERSION } from "./engine.mjs";
export { enrichChapter } from "./chapters.mjs";
export { enrichTeaching } from "./teaching.mjs";
export const buildCore = () => [
  ...buildBasics(),
  ...buildTenses(),
  ...buildVerbs(),
  ...buildClauses(),
  ...buildAdvanced(),
  ...buildModifiers(),
  ...buildLexical(),
  ...buildReference(),
];
export const stages = [
  [
    "1 · Sentence foundations",
    "sentence-structure nouns-and-plurals pronouns-and-possessive-determiners present-simple-be demonstratives articles possessive-s there-is-there-are have-got present-simple question-forms imperatives",
  ],
  [
    "2 · Everyday descriptions",
    "present-continuous countable-uncountable small-quantities determiners-quantifiers prepositions-of-time prepositions-of-place movement-prepositions articles-place-names adjective-order ed-ing-adjectives comparatives-and-superlatives adverbs-position modals-ability",
  ],
  [
    "3 · Time and experience",
    "past-simple past-continuous future-forms present-perfect stative-dynamic present-perfect-continuous past-perfect past-perfect-continuous future-perfect-continuous past-habits",
  ],
  [
    "4 · Connecting meanings",
    "infinitive-of-purpose verb-patterns dependent-prepositions modal-obligation modal-deduction past-modals conditionals third-mixed-conditionals wishes linking-clauses contrast-concession degree-comparison",
  ],
  [
    "5 · Complex sentences",
    "passive-voice relative-clauses reported-statements reported-questions question-tags reflexive-reciprocal verb-pattern-meaning phrasal-verbs noun-clauses punctuation-clauses agreement-advanced",
  ],
  [
    "6 · Advanced control",
    "advanced-passives reporting-verb-patterns participle-clauses inversion clefts-emphasis ellipsis-substitution unreal-subjunctive noun-modifiers register-variation",
  ],
];
export function sequence(topics) {
  const ordered = stages.flatMap(([stage, slugs]) =>
    slugs.split(" ").map((slug) => ({ stage, slug })),
  );
  if (new Set(ordered.map((x) => x.slug)).size !== topics.length)
    throw Error("Roadmap must list every topic exactly once");
  return ordered.map(({ stage, slug }, i) => {
    const t = topics.find((t) => t.slug === slug);
    if (!t) throw Error("Missing topic " + slug);
    return {
      ...t,
      order: i + 1,
      stage,
      prerequisites: i ? [ordered[i - 1].slug] : [],
    };
  });
}
