# Content releases

The web authoring files and generated snapshot are reviewed in Git. Supabase stores an identical published content release as a private content archive/backend source. Ordinary builds never query the database; database edits alone do not change a deployed app.

## Foundation release

- Version: `foundations-2026-09-v1`.
- Eight topics, 200 questions per topic, 1,600 total.
- Original, guidance-aligned exercises generated offline with AI assistance. Publisher exercise text was not copied.
- Independent educator review is pending; structural validation is not pedagogical certification.
- Schema addition: `supabase/consolidation/003_grammar_content_provenance.sql` adds provenance, unique fingerprints and a private release ledger. No learner tables or existing access policies change.

## Import workflow

1. Inspect the destination's `grammar.schema_migrations`, tables, content counts and access grants. The destination must be the shared Etlyn Apps project, not the retired standalone project.
2. Apply migration 003 once if absent. Do not replay historical migrations on an initialized project.
3. Run `yarn content:check`, `yarn test`, `yarn build`, then `yarn content:sql`.
4. Review the SQL files under the version directory. They upsert stable IDs within this release, refuse another release's existing topics/questions, and check counts in the same transaction. They neither delete nor touch users, progress, attempts, Auth, analytics or another app's schema.
5. Execute the topic SQL in manifest order with an authorised administrative database connection/tool. Each topic is transactional; a failed topic rolls back and can be retried. If interrupted, the release is not complete until the finalization file succeeds.
6. Run the manifest’s finalization file only after all topic imports. It checks the release counts and records the immutable content hash. A changed hash under an already published version fails; author a new version and an explicit migration instead.
7. Verify all stored question fields/IDs/fingerprints and topic content against the snapshot, not just row counts. Verify the private schema still denies browser roles. Save a read-only verification receipt with no credentials or user data.
8. Deploy the matching web build through the existing release workflow when requested. Importing content does not deploy the website.

The runtime database role cannot write content. Do not expose `grammar` via the Data API or add browser grants as a shortcut. The old Edge Function is historical and must not be deployed into Etlyn Apps.

Future revisions must explicitly decide whether to replace, retain or retire old exercises, preserve stable IDs for unchanged items, and migrate web progress only where appropriate. Do not silently overwrite an existing release or regenerate the covered topics to add unrelated material.

## Additive v2 release

`foundations-2026-09-v2` imports only topics 9–18 (10 topics, 2,000 questions). The manifest records its dependency on the unchanged v1 hash. The v2 hash identifies the complete 18-topic web snapshot, while the v2 ledger counts describe only the newly imported rows. The finalizer checks both the retained v1 rows and the added v2 rows. There is no overwrite or reclassification of v1 content, no schema migration, and no learner-record mutation. Browser progress remains under the v1-compatible namespace.

## Full core archive (v3)

Apply consolidation migration `004_grammar_catalog_snapshots.sql` once after verifying it is absent. It adds a private, RLS-protected archive with no browser/runtime grants. Generate SQL with `yarn content:sql`: the manifest contains 67 topic transactions and one finalizer. Each file archives a complete topic payload, including chapter prose and per-choice feedback. Only the 49 new banks are inserted into normalized content tables; v1/v2 normalized records and release hashes remain unchanged. All imports are conflict-detecting and idempotent for identical payloads.

The v3 release ledger counts added normalized rows (49 topics / 9,800 questions). The manifest and full archive describe the complete offline course (67 topics / 13,400 questions). Read the archive only for a version whose `content_releases.content_hash` matches its `catalog_hash`; staged topic imports do not constitute a published release.

Run the generated `verify.sql` to compare all full JSONB payload digests and every field of the newly normalized lessons/questions. Null normalized comparison values for the 18 earlier banks are deliberate: their teaching revisions live in the archive, while earlier normalized releases remain immutable. Independently compare pre/post full-row digests of the retained rows, private grants and learner counts, and save the verification receipt. MD5 checks JSONB equality; SHA-256 identifies the whole release.

## Whole-subject reading archive (v4)

Apply `005_grammar_reading_only_releases.sql` once. It permits zero newly inserted normalized topics/questions in the ledger, which keeps the existing meaning of those counts for a release that changes reading only. It changes no content rows, roles or policies.

The v4 manifest contains the 20-area grammar map and 67 full-topic archive transactions plus a finalizer. Each transaction checks the v3 base payload digest and unchanged quiz-array digest, then combines that verified array with the new complete topic metadata and reading. It verifies the resulting full JSONB digest before committing. This avoids duplicating the question text in the SQL files while producing the identical complete topic snapshot in Supabase.

Ledger additions are **0 topics / 0 questions**; total published coverage is **67 chapters / 403 reading sections / 13,400 questions**. All normalized v1/v2/v3 rows and the entire v3 archive remain unchanged. Run the generated verification query and compare pre/post retained-row digests. The map is reconstructible from the manifest and domain authoring metadata; the web continues to use its build snapshot with no runtime Supabase or AI requests.
