# Grammacho acceptance

`manifest.json` owns 12 stable acceptance cases. Run `yarn build`, start `yarn preview --host 127.0.0.1 --port 4173 --strictPort`, then run `yarn test:browser`. Install the pinned browser with `yarn playwright install chromium` first. For a local installed Chrome use `PLAYWRIGHT_CHANNEL=chrome`.

The browser script executes nine cases: concept search/navigation, 20-answer practice, keyboard behavior, restored answers, topic-only reset with cancel, offline reopen, narrow-layout focus, forced colors/reduced motion, and local storage loss. It uses a disposable browser context and no remote APIs. `GRAMMACHO_PREVIEW_URL` selects the built preview; `GRAMMACHO_RESULTS_PATH` writes outcomes; `GRAMMACHO_BUILD_SHA` must identify the source actually built. It defaults to the current Git HEAD, so build a clean committed revision when recording formal evidence.

Three cases are explicitly blocked in automated outcomes: real VoiceOver announcements, independent educator review and tutor/learner outcomes. A successful browser job does not mark those passed. The GitHub workflow runs unit/content/build/browser checks and retains actual outcomes; it does not claim full PRD acceptance or a completed independent review. Full acceptance requires an E2E report covering all cases and must reject blocked outcomes.

September 26, 2026: nine automated assertions passed on the current web implementation. Native remains independently owned by `etlyn/grammacho-mobile` with a frozen legacy curriculum.
