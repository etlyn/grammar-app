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

Copy `.env.example` to `.env.local` and add Supabase browser keys:

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-public-anon-key
```

If these are missing, the app runs in local learner mode with the seed curriculum.

## Supabase

1. Create a Supabase project.
2. Run the SQL migration in `supabase/migrations`.
3. Enable email magic-link auth in Supabase Auth settings.
4. Deploy the Edge Function:

```bash
supabase functions deploy generate-grammar-content
supabase secrets set OPENAI_API_KEY=sk-your-server-side-key
```

The browser never receives the OpenAI key. The function first checks saved content and only generates more when reusable content does not already exist.

## Production

```bash
yarn build
yarn start
yarn preview
```

The production build is emitted to `dist`. GitHub Pages deployment is configured in `.github/workflows/main.yml`.

For hosted Supabase auth/content, set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in the deployment environment before building. Without them, production still works in local learner mode.
