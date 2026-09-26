# Grammacho project instructions

For web curriculum expansion or corrections, first read [content/INDEX.md](content/INDEX.md) and consult [content/coverage.json](content/coverage.json). They record covered topics, stable question IDs, skills, provenance and duplicate fingerprints.

The web beta uses only the build snapshot in `src/generated/catalog.json`; no runtime AI, Supabase content queries or account flow. Ordinary builds run without network access. `content/catalog.mjs` composes the immutable v1 authoring sources (`content/foundations.mjs`, `content/contexts.mjs`), the v2 extension (`content/extension/`), the v3 core course (`content/core/`) and the v4 reading expansion (`content/scope/`). Read `content/scope/README.md` and `content/CONCEPTS.json` for current reading coverage; `content/core/README.md` records the earlier practice scope. Add subsequent releases in new modules. Preserve covered question IDs and do not pad a bank with permutations to increase its count. Clearly distinguish original, adapted and reproduced exercises, record source rights, and never imply official approval or educator review without evidence.

The native client has been extracted to the independent `grammacho-mobile` repository with a frozen legacy curriculum. This repository is web-only; do not recreate cross-repository source aliases.

Validate changes with `yarn test`, `yarn content:check`, and `yarn build` on Node 20 or later. The private `grammar` Supabase schema must remain private; use the consolidation runbook and content import documentation, never browser service-role credentials or the retired Edge Function. User progress is outside content seed imports.
