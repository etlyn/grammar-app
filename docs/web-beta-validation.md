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

## Reading and keyboard redesign — 2026-09-13

The Etlyn design preferences informed a quieter topic rail, separate Read and Practice views, a single reading column, restrained purple actions, and secondary progress/source disclosures. ChatGPT and Wise were preference anchors from the saved skill, not newly audited reference screens.

Validation on the redesigned production preview:

- TypeScript/Vite production build, all ten content/scoring tests, and deterministic content check passed. The curriculum hash and database content are unchanged.
- In-app browser: completed a 20-question session using the keyboard, including answer selection, checking, advancing, result focus, and expanding an answer explanation. Checked answers and Practice mode survived reload.
- Verified arrow wrapping, Tab / Shift+Tab, Enter on a radio, Enter on the Check button, hints, Read/Practice arrow navigation, and keyboard start of another topic.
- Inspected reading, quiz and results layouts on desktop and at 390px; the quiz also fits 320px without horizontal overflow. Mobile topic search and selection worked; Escape restored focus to Topics.
- Fixed focus visibility after feedback expansion on small screens and checked that Next remained fully inside the viewport. The new question returns focus to its first answer.
- The in-app console reported no errors or warnings during these checks. Reduced-motion and forced-colors behavior is implemented in CSS; OS accessibility modes and screen-reader output have not been manually tested.

`tests/browser-smoke.cjs` now follows the separate views and native radio controls, asserting that selection does not save until Enter and that focus advances correctly. Its standalone headless/offline suite was updated but not rerun for this visual revision; the interactive in-app journey above was run instead. The earlier offline verification remains recorded above, and each new production build still regenerates the offline cache.

Keyboard semantics follow the WAI-ARIA [radio group guidance](https://www.w3.org/WAI/ARIA/apg/patterns/radio/) and [tabs guidance](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/). Enter-to-check is an additional scoped quiz action; native arrow and Space behavior is preserved.

## Additive curriculum expansion — 2026-09-13

Release `foundations-2026-09-v2` adds ten British Council guidance-aligned topics with 200 original questions each. The combined static catalog contains 18 topics and 3,600 questions. The app sequence is a chosen progression through published A1–A2 material; it is not represented as an official school sequence. Educator review remains pending.

- Fourteen automated tests pass, including exact preservation of the complete v1 source hash, all new banks' counts/uniqueness/skill distribution, grammar edge cases, balanced session selection, and restoration of existing progress after expansion.
- Production build and deterministic content check pass. JavaScript is approximately 3.27 MB uncompressed / 430 KB gzip; the build precaches the full catalog and app assets. No runtime database or AI calls were added.
- Supabase imported only the ten new topics and 2,000 new questions. Every lesson and question field in both releases was compared to the snapshot using PostgreSQL JSONB field digests. All 18 lessons and all 3,600 questions matched. The v1 release hash, private role grants, and zero-row learner tables were preserved. See [v2 verification receipt](../supabase/content/foundations-2026-09-v2/verification.json).
- In-app production preview: all 18 topics appeared; the existing 22 saved answers, accuracy and unfinished Articles question survived the update. The first new topic accepted arrow/Enter answers, advanced focus and resumed after reload. The final new adjective topic rendered its published source link and correctly scored a paired-adjective answer using the keyboard. No browser errors or warnings were reported during these checks.
- The offline cache was regenerated; an offline browser replay was not repeated for this additive revision. Earlier offline validation is recorded above.

Generate repeatable read-only database comparison SQL with `node scripts/verify-content-sql.mjs /tmp/grammacho-verify-content.sql --split`. The split files compare one topic each. MD5 here checks equality of canonical JSONB fields; the release identity remains the SHA-256 content hash.
