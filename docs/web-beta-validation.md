# Web beta validation — 2026-09-13

Content release `foundations-2026-09-v1`: eight topics and 1,600 questions. The canonical content hash is recorded in `content/coverage.json` and the Supabase verification receipt.

## Completed checks

- Production TypeScript/Vite build and deterministic content check passed without database or AI access.
- Ten automated tests cover 200 items per topic, global uniqueness, four distinct options, references, snapshot consistency, irregular/phonetic examples, session balance, unseen-item preference, pass thresholds, retry completion, persisted progress, duplicate events, stale events, corrupt storage and topic-local resets.
- A headless Chrome journey on the production preview completed 20 questions, reloaded after an answer, finished and reloaded a passing session, installed the service worker, reloaded offline, started another topic offline, and searched/switched topics at a 390px viewport. No runtime page errors or external requests occurred. Desktop and mobile-width screenshots were inspected.
- Supabase content was read back and every lesson/question field was compared against the snapshot, including choices, explanations, stable IDs, fingerprints and provenance. See `supabase/content/foundations-2026-09-v1/verification.json`.
- The shared `grammar` schema still denies USAGE to `anon`, `authenticated` and `service_role`. Content imports do not change learner records or another app's data.

## Repeat the browser check

Start the production preview with `yarn preview --host 127.0.0.1 --port 4173`, then run `yarn test:browser`. This optional test needs Playwright and a local Chrome installation. Set `PLAYWRIGHT_MODULE` to an existing Playwright module path if it is not locally installed; set `GRAMMACHO_PREVIEW_URL` if the preview uses another port. Chrome runs with a fresh temporary profile. Screenshots are written to the operating system's temporary directory.

## Limits

- Independent educator review and learner trials are pending. The 1,600 records are structured form practice using 50 contexts and four tasks per topic; they are not independently calibrated exam questions.
- No CEFR placement claim, official school endorsement or publisher-question reproduction is made.
- Static content contributes about 215 KB gzip to the approximately 1.47 MB uncompressed app JavaScript. The complete bank is intentionally bundled and precached for offline practice. Vite reports its normal large-chunk warning.
- This change prepares a web build and seeds Supabase. It does not deploy GitHub Pages or change the native mobile app.
