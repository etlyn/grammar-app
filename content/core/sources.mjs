const bc = "https://learnenglish.britishcouncil.org/free-resources/grammar/";
const entries = [
  ["bc-nouns", "Nouns", "english-grammar-reference/nouns"],
  [
    "bc-determiners",
    "Determiners and quantifiers",
    "english-grammar-reference/determiners-quantifiers",
  ],
  ["bc-question-forms", "Question forms", "a1-a2/question-forms"],
  ["bc-verbs-reference", "Verbs", "english-grammar-reference/verbs"],
  ["bc-adverbials", "Adverbials", "english-grammar-reference/adverbials"],
  ["bc-past-ability", "Past ability", "b1-b2/past-ability"],
  [
    "bc-future-forms",
    "Future forms",
    "b1-b2/future-forms-will-be-going-present-continuous",
  ],
  ["bc-present-perfect", "Present perfect", "b1-b2/present-perfect"],
  ["bc-past-perfect", "Past perfect", "b1-b2/past-perfect"],
  [
    "bc-perfect-continuous",
    "Present perfect simple and continuous",
    "b1-b2/present-perfect-simple-continuous",
  ],
  [
    "bc-future-perfect",
    "Future continuous and future perfect",
    "b1-b2/future-continuous-future-perfect",
  ],
  [
    "bc-past-habits",
    "Past habits: used to, would and the past simple",
    "b1-b2-grammar/past-habits-used-to-would-past-simple",
  ],
  ["bc-stative", "Stative verbs", "b1-b2/stative-verbs"],
  [
    "bc-obligation",
    "Modals: permission and obligation",
    "b1-b2/modals-permission-obligation",
  ],
  [
    "bc-deduction",
    "Modals: deductions about the present",
    "b1-b2/modals-deductions-about-present",
  ],
  [
    "bc-past-deduction",
    "Modals: deductions about the past",
    "b1-b2/modals-deductions-about-past",
  ],
  [
    "bc-verb-meaning",
    "Verbs followed by -ing or infinitive to change meaning",
    "b1-b2/verbs-followed-ing-or-infinitive-change-meaning",
  ],
  ["bc-question-tags", "Question tags", "b1-b2/question-tags"],
  [
    "bc-conditionals",
    "Conditionals: zero, first and second",
    "b1-b2/conditionals-zero-first-second",
  ],
  [
    "bc-third-conditionals",
    "Conditionals: third and mixed",
    "b1-b2/conditionals-third-mixed",
  ],
  ["bc-wishes", "Wishes: wish and if only", "b1-b2/wishes-wish-if-only"],
  ["bc-passives", "Passives", "b1-b2/passives"],
  [
    "bc-relative",
    "Relative clauses: defining relative clauses",
    "b1-b2/relative-clauses-defining-relative-clauses",
  ],
  [
    "bc-reported-statements",
    "Reported speech: statements",
    "b1-b2/reported-speech-statements",
  ],
  [
    "bc-reported-questions",
    "Reported speech: questions",
    "b1-b2/reported-speech-questions",
  ],
  [
    "bc-questions-reference",
    "Questions and negatives",
    "english-grammar-reference/questions-negatives",
  ],
  [
    "bc-advanced-passives",
    "Advanced passives review",
    "c1/advanced-passives-review",
  ],
  [
    "bc-reporting-patterns",
    "Patterns with reporting verbs",
    "c1/patterns-reporting-verbs",
  ],
  ["bc-participles", "Participle clauses", "c1/participle-clauses"],
  [
    "bc-inversion",
    "Inversion after negative adverbials",
    "c1/inversion-after-negative-adverbials",
  ],
  [
    "bc-emphasis",
    "Emphasis: cleft sentences, inversion and auxiliaries",
    "c1/emphasis-cleft-sentences-inversion-auxiliaries",
  ],
  ["bc-ellipsis", "Ellipsis", "c1/ellipsis"],
  ["bc-unreal", "Unreal time", "c1/unreal-time"],
  [
    "bc-agreement",
    "Verbs and agreement reference",
    "english-grammar-reference/verbs",
  ],
  ["bc-adjectives", "Adjectives", "english-grammar-reference/adjectives"],
  ["bc-degree", "Using enough", "b1-b2/using-enough"],
  ["bc-reflexive", "Reflexive pronouns", "b1-b2/reflexive-pronouns"],
  [
    "bc-contrast",
    "Contrasting ideas: although, despite and others",
    "b1-b2/contrasting-ideas-although-despite-others",
  ],
  [
    "bc-noun-modifiers",
    "Possession and noun modifiers",
    "c1/possession-noun-modifiers",
  ],
  [
    "bc-phrasal-order",
    "Word order in phrasal verbs",
    "c1/word-order-phrasal-verbs",
  ],
  [
    "bc-dependent-prepositions",
    "Adjectives and prepositions",
    "a1-a2/adjectives-prepositions",
  ],
  [
    "bc-varieties",
    "British English and American English",
    "b1-b2/british-english-american-english",
  ],
  [
    "bc-prepositions-reference",
    "Adverbials of place",
    "english-grammar-reference/adverbials-place",
  ],
  [
    "bc-zero-articles",
    "Articles: the or no article",
    "a1-a2-grammar/articles-the-or-no-article",
  ],
  [
    "bc-nondefining",
    "Relative clauses: non-defining",
    "b1-b2/relative-clauses-non-defining-relative-clauses",
  ],
  [
    "bc-inverted-conditions",
    "Inversion and conditionals",
    "c1/inversion-conditionals",
  ],
  [
    "bc-used-to",
    "Different uses of used to",
    "b1-b2-grammar/different-uses-of-used-to",
  ],
  ["bc-so-such", "Intensifiers: so and such", "b1-b2/intensifiers-so-such"],
  [
    "bc-comparison-modifiers",
    "Modifying comparatives",
    "b1-b2/modifying-comparatives",
  ],
  [
    "bc-gradability",
    "Adjectives: gradable and non-gradable",
    "b1-b2/adjectives-gradable-non-gradable",
  ],
];
export const sources = entries
  .map(([id, title, path]) => ({
    id,
    title,
    url: bc + path,
    publisher: "British Council LearnEnglish",
    use: "Grammar guidance and scope only. Original explanations and practice; no publisher exercise reproduced.",
    reviewedOn: "2026-09-13",
  }))
  .concat([
    {
      id: "dfe-grammar",
      title: "National curriculum in England: English programmes of study",
      publisher: "Department for Education",
      url: "https://www.gov.uk/government/publications/national-curriculum-in-england-english-programmes-of-study/national-curriculum-in-england-english-programmes-of-study",
      use: "School curriculum scope: clauses, word classes, agreement, cohesion and punctuation. Original practice; this EFL sequence is not the statutory year-by-year programme.",
      license:
        "Crown material is generally available under the Open Government Licence unless otherwise stated; no assessment questions reproduced.",
      reviewedOn: "2026-09-13",
    },
    {
      id: "english-profile",
      title: "English Profile: what the CEFR means for English",
      publisher: "English Profile",
      url: "https://englishprofile.org/",
      use: "Level interpretation background. Labels are approximate course labels, not an English Grammar Profile item-by-item validation or a CEFR certification.",
      reviewedOn: "2026-09-13",
    },
  ]);
export const extraReferences = {
  "relative-clauses": ["bc-nondefining"],
  inversion: ["bc-inverted-conditions"],
  "past-habits": ["bc-used-to"],
  "degree-comparison": [
    "bc-so-such",
    "bc-comparison-modifiers",
    "bc-gradability",
  ],
  "unreal-subjunctive": ["dfe-grammar"],
  "agreement-advanced": ["dfe-grammar"],
  "sentence-structure": ["bc-verbs-reference"],
  "noun-clauses": ["dfe-grammar"],
};
