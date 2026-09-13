# Grammacho web curriculum coverage

Version: foundations-2026-09-v1

Content SHA-256: 80f731f032a9eb103f1c1ff16dbb914b3e725cae49cb122d7d4df0e44da9c096

Original, generated offline with AI assistance; not copied or endorsed official exercises.

Automated structural checks complete; independent educator review pending.

Eight core topics, 200 questions each, 1,600 total. Each bank uses 50 authored lexical/situational contexts with four tasks per context. These are structured form-practice banks, not 1,600 independent real-world situations or a calibrated assessment. Grammar facts and task formats follow the linked references; no publisher question bank is reproduced.

| Topic | Questions | Skills |
| --- | ---: | --- |
| Present simple: be | 200 | agreement: 50; negative: 50; question: 50; correction: 50 |
| Present simple | 200 | affirmative: 50; negative: 50; question: 50; base-after-auxiliary: 50 |
| Present continuous | 200 | affirmative: 50; negative: 50; question: 50; ing-form: 50 |
| Past simple | 200 | affirmative: 50; negative: 50; question: 50; base-after-did: 50 |
| Articles: a, an and the | 200 | indefinite-sound: 50; second-mention: 50; general-plural: 50; identified-plural: 50 |
| Pronouns and possession | 200 | subject: 50; object: 50; possessive-determiner: 50; possessive-pronoun: 50 |
| Prepositions of time | 200 | at: 40; on: 60; in: 60; zero: 40 |
| Comparatives and superlatives | 200 | comparative-form: 50; superlative-form: 50; equality: 50; than: 50 |

## Expand without duplication

1. Read this index and coverage.json before authoring. The other 50 legacy mobile topics are not part of this web beta.
2. Use content/foundations.mjs and contexts.mjs as the authoring sources. Preserve existing topic slugs, skill identifiers and context keys; these derive stable UUIDs. Do not regenerate covered topics to add a new topic.
3. For genuinely new exercises, add unique context keys and new skill coverage, not option-order or name-only variations. To correct an existing answer, review progress compatibility and intentionally version the release.
4. Verify authoritative references, reuse licences and ambiguity. Distinguish reproduced, adapted and newly authored material. Never claim school/CEFR approval or educator review that has not occurred. Third-party videos and commercial workbooks require separate rights.
5. Run yarn content:build, yarn test and yarn build. The generator fails on duplicate prompts, duplicate fingerprints, invalid choices or absent provenance. Update the 200-item gate deliberately when expanding an existing bank.
6. Review all question/answer exports. Human educator review is still needed; automated checks do not establish pedagogical validity.
7. Create a versioned Supabase import with yarn content:sql. Apply only to the private grammar schema after reviewing the diff; never expose it through the Data API. User progress and auth are outside the content import. Verify database counts and fingerprints after import.
8. Commit the authoring files, catalog, coverage and release provenance together. Rebuild/redeploy web to distribute new content. No network, database, or AI call is made during an ordinary build or learner session.

## Sources

- [British Council: Present simple: to be](https://learnenglish.britishcouncil.org/free-resources/grammar/a1-a2/present-simple-be) — Guidance reference only; exercises and wording are not reproduced.
- [British Council: Present simple](https://learnenglish.britishcouncil.org/free-resources/grammar/a1-a2/present-simple) — Guidance reference only; exercises and wording are not reproduced.
- [British Council: Present continuous](https://learnenglish.britishcouncil.org/free-resources/grammar/english-grammar-reference/present-continuous) — Guidance reference only; exercises and wording are not reproduced.
- [British Council: Past simple](https://learnenglish.britishcouncil.org/free-resources/grammar/english-grammar-reference/past-simple) — Guidance reference only; exercises and wording are not reproduced.
- [British Council: Articles: a, an, the](https://learnenglish.britishcouncil.org/free-resources/grammar/a1-a2-grammar/articles-a-an-the) — Guidance reference only; exercises and wording are not reproduced.
- [British Council: Personal pronouns](https://learnenglish.britishcouncil.org/free-resources/grammar/english-grammar-reference/personal-pronouns) — Guidance reference only; exercises and wording are not reproduced.
- [British Council: Possessives](https://learnenglish.britishcouncil.org/free-resources/grammar/english-grammar-reference/possessives) — Guidance reference only; exercises and wording are not reproduced.
- [British Council: Comparative adjectives](https://learnenglish.britishcouncil.org/free-resources/grammar/a1-a2/comparative-adjectives) — Guidance reference only; exercises and wording are not reproduced.
- [British Council: Prepositions of time](https://learnenglishteens.britishcouncil.org/grammar/a1-a2-grammar/prepositions-time) — Guidance reference only; exercises and wording are not reproduced.
- [Portland Community College: A Digital Workbook for Beginning ESOL](https://openoregon.pressbooks.pub/esol23/front-matter/introduction-2/) — Course structure and task-format reference only; no H5P items or third-party videos copied. CC BY 4.0 (except separately credited material).
