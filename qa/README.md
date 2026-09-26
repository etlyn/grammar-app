# Grammacho acceptance

The product owns `qa/manifest.json`. Import a committed immutable SHA into Etlyn E2E and record build, environment, tester and actual outcomes. Definitions are not passing results. The first two suites map to PRD R1/R3; independent review and pilot cases map to R2/R4 and require human evidence. Native acceptance belongs to the separate native repository.

Validate using `node ../etlyn-e2e/scripts/validate-manifest.mjs qa/manifest.json` from this repository. Existing `yarn test`, `yarn content:check`, `yarn build` and `tests/browser-smoke.cjs` supply focused automated evidence; they do not prove educator approval or a live pilot.
