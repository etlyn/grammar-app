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

## Core course and book reading — 2026-09-13

Release `core-2026-09-v3`: 67 chapters, 13,400 questions, six stages. It adds 49 banks and revises the chapter prose, hints and per-choice feedback for the earlier 18 banks. The exact source-guidance and assessment boundaries are recorded in [the core course index](../content/core/README.md).

- All 16 automated tests passed: counts, global duplicate checks, all four answer diagnoses, chapter metadata and emphasis, representative grammar contrasts, original source identity, retained progress, balanced random sessions, scoring and persistence. Production TypeScript/Vite build and deterministic content check passed.
- The in-app production browser completed a 20-question keyboard session with 9 correct and 11 intentionally/unselectively missed answers. All 11 misses had amber review containers; all 20 were reviewable. Enter expanded a missed question with its selected-answer diagnosis and three explanatory steps. The 9/20 result survived reload.
- Up/Down selected answers; Enter/Right submitted the selected answer and advanced after feedback. Enter without a selection did not submit. Left reviewed a saved answer; Right returned with the draft selection and its focus intact. Reviewing did not add a saved answer. Tapping Shift revealed the hint; Shift+Tab retained normal backward focus movement without revealing it.
- Inspected the expanded reading and result layouts at desktop width. At 390px, the present-simple chapter fit without horizontal overflow, with bold **s**, **es** and **ies** endings. The shared footer had one “Keep in mind” note. Mobile topic search and selection worked; Escape restored focus to Topics. Inspected the advanced inversion chapter, its worked examples and rule contrasts. The browser console reported no runtime errors during the checks.
- The standalone browser smoke script now includes no-selection submission, Shift/Shift+Tab, history/draft preservation and a deliberately incorrect result. It was syntax-checked but not run as an external headless process for this revision; the interactive browser journey above was run. OS screen-reader and forced-colour testing remain pending.
- The full build is approximately 21.76 MB uncompressed / 1.85 MB gzip JavaScript and precaches ten assets after the first successful online load. Vite's large-chunk warning is expected. This retains the requested fully bundled beta; splitting topic payloads while precaching every chunk is a future first-load performance improvement. No runtime AI or database content request was added. A new offline replay was not performed; the earlier offline check remains recorded above.
- Supabase stores all 67 complete topic payloads and 13,400 questions in the private full-content archive. Every payload matched its local JSONB digest; all 49 new normalized lessons and all 9,800 new normalized questions matched field-for-field. Full-row digests, including timestamps, proved that the original 18 normalized lessons and 3,600 questions were unchanged. Existing release hashes and zero-row learner tables were unchanged. See [the v3 verification receipt](../supabase/content/core-2026-09-v3/verification.json).
- The archive has RLS enabled and no SELECT/write privileges for browser or runtime roles. Supabase's informational [RLS without policies notice](https://supabase.com/docs/guides/database/database-linter?lint=0008_rls_enabled_no_policy) is intentional for this administrative archive. Existing shared-project warnings concerning [function search paths](https://supabase.com/docs/guides/database/database-linter?lint=0011_function_search_path_mutable), [password protection](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection) and [MFA options](https://supabase.com/docs/guides/auth/auth-mfa) were present before this migration and were not changed by the grammar content release.

Independent educator review and productive-language assessment remain pending. These are original structured practice banks based on published guidance, not copied official school quizzes or a promise that every possible English construction has been mastered.

## Whole-subject reading release — core-2026-09-v4

- 20 grammar areas, 67 chapters, 403 reading sections (135 added). Every section has a stable identifier, chapter destination, source references, explanatory text, highlighted pattern, examples and qualifications.
- `yarn test`: 18 tests passed. New checks reconstruct the immutable v3 catalog/hash and compare every quiz payload, and validate every map destination exactly once.
- `yarn content:check` and `yarn build`: passed on Node 20+. Production assets and the complete curriculum remain in the build-time service-worker precache. The existing bundle-size warning remains because the full course ships offline; compressed JS is approximately 1.92 MB.
- Browser validation against the production preview: existing saved view retained; 20-area map; negation search (7 sections); empty search and clear; all 403 entries expanded; no horizontal overflow at 390×844; direct section link focuses the correct section and scrolls it into view; next chapter opens reading; Left/Home/End navigate the three tabs; mobile Topics dialog opens and Escape restores focus. The existing practice keyboard/scoring logic was not changed.
- The repository's standalone Playwright smoke script now includes initial map checks. It was not executed in this session; the browser checks above used the supported computer-use tool.
- Supabase migration 005 allows zero added normalized rows for reading-only releases. All 67 complete v4 payloads matched the local JSONB digests, including all 13,400 questions and 403 reading sections. Pre/post full-row digests prove all normalized topics/questions and the complete v3 archive unchanged. See [verification receipt](../supabase/content/core-2026-09-v4/verification-receipt.json).
- RLS remains enabled; browser roles still lack private-schema and archive access. The runtime role retains private-schema usage but has no archive read/write grant. Security advisors report the same intentionally policy-free private archives and unrelated pre-existing e2e search-path/Auth settings noted in the v3 report; this release adds no access grants.

The map is a broad subject-family crosswalk to Cambridge's published contents, not a line-by-line audit of its copyrighted textbook. Original learner prose is not publisher-endorsed. Independent educator review remains pending. New reading coverage and dedicated practice-skill coverage are explicitly distinguished in the source index and map guidance.
