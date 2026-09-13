# Foundation extension: topics 9–18

This is an additive release, `foundations-2026-09-v2`, following ten uncovered topics from the British Council's published [A1–A2 grammar collection](https://learnenglish.britishcouncil.org/free-resources/grammar/a1-a2). The app's order is a chosen learning progression, not a claimed official school sequence. There is no universal school curriculum implied here.

`index.mjs` records each topic's direct guidance source, lesson rules, exercises and explanations. `contexts.mjs` supplies 50 explicit contexts per bank, used in four task types. Countability contexts are shared between the noun and quantifier banks to practise different skills. The resulting 2,000 questions are structured practice, not 2,000 independent situations. Examples, contexts and exercise wording are original, generated offline with AI assistance. No publisher questions are reproduced. Independent educator review remains pending.

| Order | Topic                             | Distinct coverage beyond the original eight                                          |
| ----- | --------------------------------- | ------------------------------------------------------------------------------------ |
| 9     | There is and there are            | Existential agreement, negatives, questions, short answers                           |
| 10    | Have got                          | Present possession and its auxiliary pattern                                         |
| 11    | Countable and uncountable nouns   | Countability in a specified sense, quantity questions, agreement, some phrases       |
| 12    | Few, a few, little and a little   | Positive small amounts versus scarcity and noun compatibility                        |
| 13    | Possessive ’s                     | Singular, regular plural and irregular plural owners; ownership versus owned objects |
| 14    | Prepositions of place             | Explicit containment, surface contact, conventional activity locations and points    |
| 15    | Past continuous and past simple   | Background activities, question/negative forms, event sequence                       |
| 16    | Infinitive of purpose             | Linking an action to its aim with a to-infinitive                                    |
| 17    | Verbs followed by -ing or to      | Complement patterns retained in affirmative, negative, question and correction tasks |
| 18    | Adjectives ending in -ed and -ing | Feeling versus cause, paired forms and interpretation                                |

## Review boundaries

- All 50 rows and the four construction templates for each bank were checked during authoring. Structural validation checks every generated record; focused tests cover irregular plurals, uncountable news, was/were, quantifier meaning and verb/adjective contrasts.
- Place questions state the intended physical relation to avoid treating in/at/on as interchangeable answers without context.
- Countability is pinned to a stated sense. Foods and materials may have countable meanings outside that context.
- Quantifier questions explicitly ask for positive emphasis or scarcity. A little and a bit of are not offered together as competing single answers.
- Verbs with two acceptable patterns, such as like/love, are excluded from single-answer pattern contrasts.
- Past-continuous explanations do not infer when the background activity ended.
- Possessive names ending in s, joint ownership, and advanced exceptions remain outside this bank.

## Expand safely

Preserve these released IDs, contexts and answers. Add later topics in another versioned module and compose them in `../catalog.mjs`; do not modify a published bank merely to add unrelated material. Read `../INDEX.md` and `../coverage.json` first. Existing v1 content remains unchanged, including provenance and fingerprints. `progressVersion` stays v1 because all existing IDs and answers are compatible. Any future correction that changes answer meaning requires an explicit progress-compatibility decision.
