# Grammacho web beta

English foundation practice with Vite, React and TypeScript. 67 ordered chapters each include 200 original practice questions, extended explanations and published learning references: 13,400 questions in six stages from sentence foundations to advanced control.

The questions were generated offline with AI assistance using British Council grammar guidance; the first eight topics also follow the structure of Portland Community College's _A Digital Workbook for Beginning ESOL_. They are **not copied publisher exercises, official test material, endorsed school content, or a calibrated CEFR assessment**. Automated checks have passed; independent educator review remains pending. Each bank has 50 lexical/situational contexts and four practice tasks per context. See [curriculum coverage and expansion rules](content/INDEX.md).

## Development

Use Node 20 or later and Yarn 1:

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
- Reset clears only the selected topic after an in-app confirmation.
- Previous prototype progress remains under its old local-storage key. It does not grant completion for the new curriculum.
- The old CEFR placement test and account/generation UI are not part of this web beta. Historical modules are not imported into its runtime bundle.

## Content and Supabase

Read [content/INDEX.md](content/INDEX.md) before adding topics. [content/coverage.json](content/coverage.json) records each question's stable ID, skill and duplicate fingerprint. The generated [catalog](src/generated/catalog.json) is the build snapshot; the matching content is stored in Supabase's private `grammar` schema.

```sh
yarn content:build   # regenerate local snapshot and coverage index
yarn content:check   # fail on drift, duplicates or invalid records
yarn content:sql     # prepare transactional SQL; does not connect to Supabase
```

For database imports, see [the content release runbook](supabase/content/README.md). The browser does not fetch from Supabase or use API keys. No runtime AI function is enabled. Hosted accounts and progress synchronisation remain a separate future FastAPI project.

The standalone Supabase project was retired on 2026-09-12. See [the consolidation runbook](supabase/consolidation/README.md); never point legacy clients at the shared private schema.

## Mobile

`mobile/` retains the earlier React Native client and seed curriculum. This release changes the web app only, except for backward-compatible optional additions to shared types.

## Web reading and keyboard controls

Read and Practice are separate views. Lessons use a single reading column with linked sections, examples, and expandable study goals and source notes. Selecting another topic opens its lesson; switching back to Practice resumes checked answers. The chosen view is remembered on this browser.

Quiz choices stay editable until checked:

- Tab / Shift+Tab: move between controls; the answers form one native radio group.
- Up / Down: move and select within the answers. Space selects the focused choice.
- Enter / Right: submit the selected answer, then advance after feedback. An unselected answer is never submitted.
- Left: review the previous saved answer; Right returns toward the current question. Reviewing does not change scoring or discard the current selection.
- Tap Shift alone: reveal the hint. Shift+Tab continues normal backward navigation.
- Finishing focuses the result heading. Incorrect items have amber review containers with a specific diagnosis and a worked explanation.
- Left / Right and Home / End: switch the Read / Practice tabs when a tab is focused.
- Escape: close the mobile topic dialog and restore focus to Topics.

Hints, answer review, sources, and progress disclosures also work with Tab and Enter. Keyboard actions are scoped to the focused controls. Focus uses a single visible edge; reduced motion and forced-colors settings are respected. Only checked answers are saved; an unsubmitted choice is not persisted.

## Additive curriculum release

`foundations-2026-09-v2` adds ten topics and 2,000 questions: 18 topics and 3,600 questions in the combined offline catalog. The first eight banks remain unchanged. Each added lesson links to British Council guidance; the app does not claim an official school sequence or publisher approval. See [extension coverage and review boundaries](content/extension/README.md). The original browser progress key is retained so checked answers and sessions survive this expansion.

## Core curriculum release

`core-2026-09-v3` adds 49 banks (9,800 questions) and expands the reading and feedback for all 67 chapters. The original 3,600 prompts, choices, correct answers, IDs and fingerprints remain unchanged; their teaching and hints are explicitly revised in the complete v3 archive. All prior progress remains compatible.

The six-stage sequence is our pedagogical synthesis of British Council level collections and Department for Education grammar scope. These institutions do not prescribe this exact sequence or certify this app. See [scope, skills and review boundaries](content/core/README.md). Completion records practice progress; it does not establish exhaustive mastery of every construction, dialect or usage in English.
