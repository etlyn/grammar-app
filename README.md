# Grammacho web beta

English foundation practice with Vite, React and TypeScript. Eight topics each include 200 original practice questions, short explanations and published learning references.

The questions were generated offline with AI assistance using British Council grammar guidance and the structure of Portland Community College's _A Digital Workbook for Beginning ESOL_. They are **not copied publisher exercises, official test material, endorsed school content, or a calibrated CEFR assessment**. Automated checks have passed; independent educator review remains pending. Each bank has 50 lexical/situational contexts and four practice tasks per context. See [curriculum coverage and expansion rules](content/INDEX.md).

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
