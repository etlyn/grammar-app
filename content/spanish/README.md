# Spanish course — authoring and activation

`spanish-2026-11-v1` is an initial grammar course for English-speaking learners of Spanish. It has 30 ordered chapters, 120 reading sections and 720 original exercises. The six stages progress from writing and sentence foundations to connected language, subjunctive constructions and reporting. Approximate A1–B2 labels guide navigation; this is not a full CEFR programme, pronunciation/listening course or calibrated proficiency assessment.

Every chapter has an introduction, four rules with patterns, examples and common mistakes, study goals, recap and 24 individually authored questions across four skills. Each question includes a hint, three teaching steps and an explanation for every choice. Practice sessions use 20 questions; no questions were added by permuting names or options to reach the English bank's size.

The instruction language is English. Spanish examples preserve accents, ñ, ü and inverted punctuation. Shared Spanish usage is the default. Exercises specify person, time, intended meaning or variety where those could produce more than one answer. Regional variation in address, pronouns and past-tense use is a teaching topic, not an error category. No audio, translated interface, commercial workbook, video or licensed third-party exercise is bundled.

## Ownership and provenance

The web/content repository owns `part-1.mjs` and `part-2.mjs`. These are new authoring modules; the released English sources, IDs and progress namespace remain unchanged. `catalog.mjs` assembles stable IDs from the chapter slug and semantic question key. Question IDs and option placement are stable across rebuilds and do not depend on the date, network or array position.

The Instituto Cervantes inventories supply a scope crosswalk. They do not prescribe this exact course sequence or approve its CEFR labels. The inventories were search-index accessible on November 17, 2026; full grammar pages redirected to maintenance. RAE/ASALE guidance was consulted for spelling, clitics and impersonal/passive constructions. Source-use and access notes are recorded in the catalog. All explanations, examples and questions are original and authored offline with AI assistance. No publisher exercises or dictionary entries are copied. Independent educator and native-speaker editorial review is **pending**.

## Build and review

```sh
yarn content:spanish
yarn content:spanish:check
yarn test
yarn content:check
yarn build
```

The Spanish build writes `src/generated/catalog-es.json`, `coverage.json`, `INDEX.md` and `review.tsv`. These are generated; edit the authoring modules and rebuild. The TSV exposes all 720 questions, answers and individual choice reasons for editorial review. The catalog also contains the full lessons. Builds are deterministic and offline after dependency installation.

Automated validation checks unique prompts, fingerprints and stable IDs, four distinct choices, complete feedback, balanced skills, prerequisites, valid references and exact map-to-reading coverage. It cannot prove that a distractor is linguistically impossible or that an explanation is pedagogically adequate. Review contexts, alternative regional readings, translations and all answer reasons before claiming educator acceptance.

For later changes, preserve semantic keys for unchanged exercises. Correcting an answer requires a deliberately versioned release and a review of saved-progress compatibility. Add genuinely new contexts and skills rather than option or name permutations.

## Native activation

Commit the reviewed export in this repository, then in `grammacho-mobile` run:

```sh
node scripts/import-web-catalog.mjs <grammar-app>/src/generated/catalog-es.json --source-commit <full-commit-sha> --course es
```

Native owns the generated `src/content/catalog-es` snapshot and the course selector. It imports a frozen export with source commit and SHA-256 provenance, never a sibling runtime path. English keeps its existing storage namespace; Spanish uses `spanish-2026-11-v1`. Language selection, current chapter, answers and unfinished practice persist independently. The app remains offline and account-free.

This task activates the mobile course. The web interface remains on its existing English catalog; the Spanish export is ready for a separately scoped web activation. No private Supabase import is needed for the offline mobile course. Native JavaScript tests, bundle/build validation, installed-device acceptance, VoiceOver and educator review are distinct checks; a source push is not a store release.
