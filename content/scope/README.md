# Whole-subject reading scope — v4

The 67 chapters are containers, not a claim that English has 67 concepts. This release adds 135 original reading sections to the previous 268, making 403 sections visible in a searchable map of 20 subject areas. Every map entry opens actual reading: explanation, highlighted pattern, examples and a qualification. Reading is available without passing a quiz. The chapter sequence remains the prerequisite-based learning path; the map is a second, systematic way to navigate it.

The scope is contemporary standard English, including common spoken/written and British/American differences. The aim is familiarity with the major grammatical systems and constructions. We cannot establish that a finite course contains every lexical exception, dialect-specific pattern, historical form or scholarly analysis. Counts describe the organisation of this book, not the number of rules in English. No completion score certifies exhaustive knowledge.

## Reference crosswalk

The published [Cambridge Grammar of the English Language contents](https://www.cambridge.org/features/linguistics/cgel/contents.htm) supplies the system-level checklist below. Chapter 14's published [detailed contents](https://www.cambridge.org/assets/linguistics/cgel/chap14_contents.pdf) additionally informs non-finite scope. These are contents-level comparisons, not a review of the copyrighted textbook's full chapters. Cambridge English Grammar Today, British Council and England's Department for Education sources are recorded in the catalog. They do not endorse this app or prescribe its exact chapter order.

| Map area | Reference chapters | Coverage represented in reading |
| --- | --- | --- |
| Building blocks | 1–2 | Word class vs function; phrase heads; finite/main/subordinate clauses; sentence structure |
| Verbs, tense, aspect, modality | 3 | Verb/auxiliary forms; tense vs time; aspect; stativity; future reference; habits; modal meanings; mood |
| Clause patterns and complements | 4 | Subjects, objects and complements; valency; double objects; resultatives; agreement |
| Nouns, articles, determiners | 5 | Countability; reference; genitives; articles; determiner order; quantifiers and distributives |
| Adjectives and adverbs | 6 | Position; complementation; participial adjectives; adverb scope and stance; gradability |
| Prepositions and particles | 7 | Time/place/movement; complements; stranded prepositions; dependent and multi-word patterns |
| Adjuncts | 8 | Circumstances; conditions; time clauses; reason, purpose, result and concession |
| Negation | 9 | Construction; scope; negative quantifiers; modals; near-negatives; raising; concord |
| Sentence types | 10 | Statements, questions, commands, exclamatives; negative/echo/rhetorical questions; tags |
| Content clauses and reported language | 11 | That/wh/whether/if clauses; reporting perspective; extraposition and object it |
| Relative constructions | 12 | Defining/non-defining; gaps; whole-clause relatives; fused/free relatives; quantifiers; distant dependencies |
| Comparison and degree | 13 | Comparative/superlative; equality; comparative clauses/ellipsis; proportions; degree complements |
| Non-finite and verbless clauses | 14 | Infinitival and participial forms; control; raising; bare infinitives; for/tough; absolute/verbless; dangling modifiers |
| Coordination and added information | 15 | Parallel units; correlatives; shared material; apposition and supplements |
| Focus and information structure | 16 | Passive; fronting; inversion; clefts; existential there; end focus |
| Reference, deixis and cohesion | 17 | Pronouns; case; deixis; anaphora/cataphora; substitution; ellipsis |
| Word forms and inflection | 18 | Five verb forms; number; irregular plurals; spelling; contraction; case |
| Word formation | 19 | Derivation; affixes; compounds; conversion; clipping/blending/back-formation; nominalisation |
| Punctuation and written conventions | 20 | Boundaries; commas; colons/semicolons/dashes; quotes; apostrophes; hyphens; brackets; capitals |
| Spoken grammar, register and variation | Cross-cutting | Headers/tails; hedges; discourse markers; ellipsis; tag intonation; politeness; regional standards; style vs grammaticality |

[CONCEPTS.md](../CONCEPTS.md) lists every section; [CONCEPTS.json](../CONCEPTS.json) provides stable IDs, chapter destinations and references. Original explanations and examples were authored offline with AI assistance. Some section references document taxonomy only, as explicitly stated in their `use` fields. Automated checks verify structure and cross-links; independent educator review remains pending. This is a broad scope crosswalk, not evidence that every rule or explanation has been institutionally reviewed.

## Practice and archive boundaries

All 13,400 v3 quiz payloads remain unchanged, including IDs, answers, hints and per-choice teaching. Each of the 67 banks still has 200 questions and each session draws 20. New reading concepts are not automatically new assessed skills: some now have explanation/example coverage without a dedicated practice task. Future practice expansion must map questions to these section IDs and fill those gaps deliberately.

`readingVersion` distinguishes the v4 reading from each bank's original provenance. The full v4 chapter payloads are archived in Supabase; normalized questions and previous releases remain unchanged. The release ledger records zero newly inserted banks/questions. The grammar map is a deterministic projection of archived reading sections plus the versioned domain metadata in this directory. The manifest includes that map for reconstructing the release.

## Expand without duplicate work

1. Read this crosswalk, `CONCEPTS.json` and `coverage.json` first. Search by stable section ID, concept title, chapter slug, question skill and normalized fingerprint.
2. Keep `foundations.mjs`, `extension/`, `core/` and this released `scope/` authoring content immutable after publication. Add subsequent releases in new modules.
3. Reuse a section ID for the same concept; document revisions in a new reading version. Create a new section only for a substantively different construction. Never infer missing coverage from chapter titles alone.
4. Keep reading coverage and assessed-skill coverage separate. Do not claim 200 dedicated questions per reading section or use rearranged options/lexical permutations to inflate the count.
5. Preserve unchanged quiz IDs, payloads and the compatible progress namespace. Add new questions with explicit section links, source-use notes, meaningful contrasts and duplicate checks.
6. Regenerate indexes and snapshots with `yarn content:build`; run `yarn test`, `yarn content:check` and `yarn build`. Review the rendered reading and navigation. Publish a new immutable archive version using the content import runbook.
