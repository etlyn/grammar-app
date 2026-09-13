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
6. Run `09-finalize.sql` only after all topic imports. It checks the release counts and records the immutable content hash. A changed hash under an already published version fails; author a new version and an explicit migration instead.
7. Verify all stored question fields/IDs/fingerprints and topic content against the snapshot, not just row counts. Verify the private schema still denies browser roles. Save a read-only verification receipt with no credentials or user data.
8. Deploy the matching web build through the existing release workflow when requested. Importing content does not deploy the website.

The runtime database role cannot write content. Do not expose `grammar` via the Data API or add browser grants as a shortcut. The old Edge Function is historical and must not be deployed into Etlyn Apps.

Future revisions must explicitly decide whether to replace, retain or retire old exercises, preserve stable IDs for unchanged items, and migrate web progress only where appropriate. Do not silently overwrite an existing release or regenerate the covered topics to add unrelated material.
