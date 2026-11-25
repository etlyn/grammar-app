# Grammacho web

Spanish and English grammar reading and practice with Vite, React and TypeScript. The web app uses the native 2.1 “Grammar, con gusto.” identity, including its Azul and Paper palette, Fraunces and Figtree typography, chapter tiles, and Learn, Map, Practice and Progress navigation.

New learners can pick a course and a starting stage. The English course includes 67 chapters, 403 reading sections and 13,400 original practice questions. Spanish includes 30 chapters, 120 reading sections and 720 questions, with explanations in English. See [curriculum coverage and expansion rules](content/INDEX.md).

The English questions were generated offline with AI assistance using British Council grammar guidance. The first eight topics also follow the structure of Portland Community College's _A Digital Workbook for Beginning ESOL_. Each bank has 50 lexical or situational contexts and four practice tasks per context. Independent educator review and CEFR calibration remain pending.

## Development

Use Node 24 and Yarn 1.

```sh
yarn install --frozen-lockfile
yarn dev
yarn test
yarn content:check
yarn build
yarn preview
```

`yarn build` deterministically generates and validates the committed content snapshot, typechecks the app, builds static assets and writes a versioned service-worker precache. No network, database connection or AI provider is required for content generation or the production build after dependencies are installed. Deploy `dist/` to the root of the web domain (the existing GitHub Pages workflow does this).

All lessons and questions are bundled into the production app. After a successful first online visit and service-worker installation, the same build can reopen and start new practice sessions offline. Source-reference links require a network connection. Browser storage/cache clearing removes local progress/offline availability; local progress is not a cloud backup.

## Learning behaviour

- Practice 20 questions balanced across the bank's skills, prioritising unseen questions.
- Answers, question order, current topic and unfinished sessions persist on the same browser.
- A completed 16/20 session marks a topic complete. Failed earlier attempts do not block a later pass; later practice does not revoke a pass.
- Overall accuracy includes all answers. Last/best session scores and completion are separate.
- Practice can reset an individual chapter. Settings can reset the selected course. Both actions require in-app confirmation.
- Previous prototype progress remains under its old local-storage key. It does not grant completion for the new curriculum.
- Accounts are optional. Signed-in learners can sync progress and use their missed questions to find lessons to revisit. See [accounts and progress sync](docs/accounts.md).

## Content and Supabase

Read [content/INDEX.md](content/INDEX.md) before adding topics. [content/coverage.json](content/coverage.json) records each question's stable ID, skill and duplicate fingerprint. The generated [catalog](src/generated/catalog.json) is the build snapshot; the matching content is stored in Supabase's private `grammar` schema.

```sh
yarn content:build   # regenerate local snapshot and coverage index
yarn content:check   # fail on drift, duplicates or invalid records
yarn content:sql     # prepare transactional SQL; does not connect to Supabase
```

For database imports, see [the content release runbook](supabase/content/README.md). The browser uses Supabase for identity and the Etlyn API for account progress. Lessons and question banks remain bundled, and practice works offline.

The standalone Supabase project was retired on 2026-09-12. See [the consolidation runbook](supabase/consolidation/README.md); never point legacy clients at the shared private schema.

## Spanish course materials

The [Spanish course](content/spanish/README.md) includes 30 chapters, 120 reading sections and 720 original exercises for web and native. English explanations accompany Spanish examples and questions, with complete hints, answer feedback, a grammar map and source provenance. Approximate A1–B2 labels are teaching labels; independent educator and native-speaker review remains pending.

Run `yarn content:spanish` to generate the separate `src/generated/catalog-es.json` export, coverage index and complete editorial review TSV. `yarn content:check`, `yarn test` and `yarn build` verify this export as well as the unchanged English catalog. The browser offers both course snapshots and keeps learning history separate by course. Existing English browser progress carries forward.

## Mobile

The legacy React Native client now lives in the separate local `grammacho-mobile` repository. Its mobile history and required curriculum modules were preserved. This repository owns the web beta and its content archive. See [the extraction record](docs/mobile-extraction.md).

## Web reading and keyboard controls

Use Learn for the next chapter or saved session, Map for the course outline or a concept search, Practice for recent scores and mistake review, and Progress for completion by chapter and stage. The selector in the header switches courses. Progress opens Settings for appearance, account access and reset.

Quiz choices stay editable until checked:

- Tab / Shift+Tab: move between controls; the answers form one native radio group.
- Up / Down: move and select within the answers. Space selects the focused choice.
- Enter / Right: submit the selected answer, then advance after feedback. An unselected answer is never submitted.
- Left: review the previous saved answer; Right returns toward the current question. Reviewing does not change scoring or discard the current selection.
- Tap Shift alone: reveal the hint. Shift+Tab continues normal backward navigation.
- Finishing focuses the result heading. Incorrect items have amber review containers with a specific diagnosis and a worked explanation.
- Left / Right and Home / End: switch the Learn / Map / Practice / Progress tabs when a tab is focused.
- Escape closes the course or search sheet and returns focus to the opener.

Hints, answer review, sources, and progress disclosures also work with Tab and Enter. Keyboard actions are scoped to the focused controls. Focus uses a single visible edge; reduced motion and forced-colors settings are respected. Only checked answers are saved; an unsubmitted choice is not persisted.

## Staging

Push reviewed changes to the `staging` branch for the protected Vercel Preview. The Vercel deployment record identifies the staged commit and URL. GitHub Actions validates staging, and the Pages publish job runs on main pushes.

Production account settings are pinned to the canonical web host. Preview builds start in guest mode. A development build with an explicit test issuer and API can exercise account sync. Set `VITE_PREVIEW_ACCOUNTS=true` explicitly for a preview build that uses an isolated test project. See [accounts and progress sync](docs/accounts.md).

The web mark, geometry, static fonts and tile artwork are adapted from the released [native brand assets](https://github.com/etlyn/grammacho-mobile/blob/2b9efefe85418494251857f1c08f81c31df548c4/docs/brand-assets.md). Font and icon licences ship with the web assets in `public/assets/rebrand/`.

## Additive curriculum release

`foundations-2026-09-v2` adds ten topics and 2,000 questions: 18 topics and 3,600 questions in the combined offline catalog. The first eight banks remain unchanged. Each added lesson links to British Council guidance; the app does not claim an official school sequence or publisher approval. See [extension coverage and review boundaries](content/extension/README.md). The original browser progress key is retained so checked answers and sessions survive this expansion.

## Core curriculum release

`core-2026-09-v3` adds 49 banks (9,800 questions) and expands the reading and feedback for all 67 chapters. The original 3,600 prompts, choices, correct answers, IDs and fingerprints remain unchanged; their teaching and hints are explicitly revised in the complete v3 archive. All prior progress remains compatible.

The six-stage sequence is our pedagogical synthesis of British Council level collections and Department for Education grammar scope. These institutions do not prescribe this exact sequence or certify this app. See [scope, skills and review boundaries](content/core/README.md). Completion records practice progress; it does not establish exhaustive mastery of every construction, dialect or usage in English.

## Whole-subject reading release

`core-2026-09-v4` adds 135 reading sections, bringing the book to 403 sections in the same 67 chapters. The 20-area map exposes the subject’s structure instead of treating chapter count as a count of English concepts. All 13,400 v3 quiz payloads remain unchanged; new reading sections do not each have their own dedicated 200-question bank.

See the [reference crosswalk and expansion rules](content/scope/README.md) and [complete reading index](content/CONCEPTS.md). The map covers the major systems of contemporary standard English with common variation, not every dialectal or lexical exception. Educator review remains pending.
