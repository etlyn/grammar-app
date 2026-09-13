# Core course: scope and expansion reference

Release `core-2026-09-v3` contains 67 chapters and 13,400 original questions. It adds 49 banks to the 18 previously published banks. Each chapter has 200 items; practice draws 20 without replacement, balances four skills and prioritises unseen items. Read [the ordered index](../INDEX.md) and [machine-readable coverage](../coverage.json) before authoring changes. Coverage records every ID, skill, context and duplicate fingerprint.

## Why this order

The six stages move from sentence foundations through everyday descriptions, time and experience, connected meanings, complex sentences and advanced control. Prerequisites are explicit in the catalog. The order is an editorial synthesis of the British Council's [A1–A2](https://learnenglish.britishcouncil.org/free-resources/grammar/a1-a2), [B1–B2](https://learnenglish.britishcouncil.org/free-resources/grammar/b1-b2) and [C1](https://learnenglish.britishcouncil.org/free-resources/grammar/c1) collections, plus England's [statutory English curriculum](https://www.gov.uk/government/publications/national-curriculum-in-england-english-programmes-of-study/national-curriculum-in-england-english-programmes-of-study) for word classes, sentence structure, cohesion and punctuation. The latter is a school curriculum, not an EFL course sequence.

No institution prescribes this exact 67-chapter order. CEFR labels describe approximate course difficulty, not validated item-level assessment: the [Council of Europe](https://www.coe.int/en/web/common-european-framework-reference-languages/introduction-and-context) provides a reference framework, and [English Profile](https://englishprofile.org/) describes its interpretation for English. There is no universal finite list whose completion establishes mastery of every English construction or variety. This is a broad core grammar map; vocabulary, pronunciation, listening, writing fluency, literary style and specialist discourse need additional learning.

## What the banks measure

Each bank contains four authored tasks across 50 lexical or situational contexts. Many banks intentionally share contexts to isolate a grammatical contrast. The 13,400 records are distinct contextual prompts, not 13,400 independently calibrated exam items. Repeated forms build fluency, but recognising a form does not by itself demonstrate spontaneous communication.

`coverage.json` records the precise four assessed skills for each bank. Chapters teach additional examples and edge cases; not every sentence in a chapter has its own assessed skill. Examples of reading beyond the current dedicated question families include *try / go on* meaning changes, institutional article usage, and some non-finite clause variants. Inspect the skill entries before claiming a sub-concept is assessed. Future expansion should add meaning-rich editing, mixed-topic transfer and productive writing, rather than inflate these counts through option permutations.

## Content rights and review

All new explanations and questions were authored offline with AI assistance using the linked grammar guidance. No British Council quiz bank was copied. Its [terms](https://www.britishcouncil.org/terms) do not grant general permission to republish learning materials on another website. Public visibility alone is not a reuse licence. The original first eight banks also reference the openly licensed PCC workbook for activity formats; their provenance remains in the catalog.

Structural tests verify counts, uniqueness, option validity, references, identifiers and complete feedback. Representative grammar contrasts receive semantic regression checks. Independent educator review, learner trials, CEFR calibration and an exhaustive linguistic audit remain pending. Do not describe these questions as official school tests or educator-approved material.

## Safe future changes

1. Inspect the chapter, all covered skills and fingerprints before adding material. Search by concept as well as title; several chapters develop an earlier concept at a later level.
2. Check the authoritative guidance and reuse terms. Record guidance-only, original, adapted or reproduced provenance accurately.
3. Use a new release for future changes. Preserve IDs, prompts and answer meanings for unchanged items; do not regenerate an existing bank to add an unrelated topic.
4. Keep questions unambiguous in the stated context. Record a helpful hint, concise reasoning steps and a distinct explanation for every distractor. Avoid treating a valid dialect or register alternative as universally wrong.
5. Generate and validate the snapshot and index with the documented commands; review samples from every skill, not just counts.
6. Import through the private content runbook. Ordinary builds and practice never call an AI provider or Supabase.

The v1/v2 normalized database rows remain immutable. The v3 `grammar.content_catalog_topics` archive stores the complete current lessons and all 13,400 question payloads, including revised teaching for earlier questions. The v3 normalized inserts contain only the 49 new banks. The full archive and matching release hash define this web release; old normalized rows alone cannot reconstruct its richer reading and feedback. Browser progress retains the v1-compatible namespace.
