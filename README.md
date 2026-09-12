# Grammacho Grammar App

A minimal English grammar learning app built with Vite, React, TypeScript, Tailwind CSS, and optional Supabase.

## What it does

- Read each grammar topic with simple, grammar-book-style guidance.
- Practice 20 quiz items per topic.
- Mark a topic complete by answering at least 80% correctly.
- Track progress locally by default.
- Sync progress with Supabase Auth when configured.
- Reuse AI-generated explanations, tips, and quiz items by saving them into Supabase tables through an Edge Function.

## Setup

```bash
yarn install
yarn dev
```

Leave the Supabase environment variables unset to run in local learner mode with the seed curriculum. The existing direct-Supabase client is a legacy integration; it is not configured for the new private Grammar schema.

## Supabase

Grammar uses the private `grammar` schema in the shared **Etlyn Apps** project, alongside shared Supabase Auth and the existing Offtasks and analytics schemas. Its standalone Supabase project was retired on 2026-09-12.

See [the consolidation runbook](supabase/consolidation/README.md) for applied migrations, permissions, identity handling, recovery, and the deferred FastAPI integration. Do not run the legacy migration in `supabase/migrations` against Etlyn Apps or deploy the legacy Edge Function there.

## Production

```bash
yarn build
yarn start
yarn preview
```

The production build is emitted to `dist`. GitHub Pages deployment is configured in `.github/workflows/main.yml`.

Keep `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` unset until the FastAPI integration replaces direct table access. The old Grammar project URL no longer works. Without these variables, production works in local learner mode.

## Mobile

The React Native scaffold lives in [mobile](mobile). It follows the shared mobile baseline used by Offtasks and Case Tracker: React Native 0.82, React 19.1, React Navigation, AsyncStorage, app-local providers, and a reusable glass theme.

See [docs/mobile-infrastructure-guide.md](docs/mobile-infrastructure-guide.md) for the cross-app structure guide and native shell setup notes.
