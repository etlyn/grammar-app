import { mkdir, readFile, writeFile } from "node:fs/promises";
import {
  buildTopics,
  sources,
  VERSION,
  sha,
  normalize,
} from "../content/foundations.mjs";
import { fileURLToPath } from "node:url";
import path from "node:path";
const root = fileURLToPath(new URL("../", import.meta.url));
const topics = buildTopics();
const ids = new Set(),
  fingerprints = new Set(),
  prompts = new Set();
const sourceIds = new Set(sources.map((s) => s.id));
for (const topic of topics) {
  if (topic.quizItems.length !== 200)
    throw Error(`${topic.slug}: expected 200 questions`);
  if (
    topic.rules.length < 3 ||
    !topic.provenance.referenceIds.every((id) => sourceIds.has(id))
  )
    throw Error(`${topic.slug}: missing guidance`);
  for (const q of topic.quizItems) {
    if (
      ids.has(q.id) ||
      fingerprints.has(q.fingerprint) ||
      prompts.has(normalize(q.prompt))
    )
      throw Error(`Duplicate question: ${q.prompt}`);
    ids.add(q.id);
    fingerprints.add(q.fingerprint);
    prompts.add(normalize(q.prompt));
    if (
      q.choices.length !== 4 ||
      new Set(q.choices.map((c) => normalize(c.text))).size !== 4 ||
      !q.choices.some((c) => c.id === q.answerId)
    )
      throw Error(`Invalid options: ${q.id}`);
    if (
      !q.explanation ||
      !q.skill ||
      !q.contextKey ||
      !q.provenance.referenceIds.length
    )
      throw Error(`Missing provenance: ${q.id}`);
    if (
      /choose the most natural sentence for the topic|the sentence uses .* accurately|\bundefined\b|\bNaN\b/i.test(
        q.prompt,
      )
    )
      throw Error(`Placeholder: ${q.id}`);
  }
}
const hash = sha(JSON.stringify({ version: VERSION, sources, topics }));
const catalog = { version: VERSION, contentHash: hash, sources, topics };
const coverage = {
  version: VERSION,
  contentHash: hash,
  totalQuestions: ids.size,
  authorship:
    "Original, generated offline with AI assistance; not copied or endorsed official exercises.",
  reviewStatus:
    "Automated structural checks complete; independent educator review pending.",
  topics: topics.map((t) => ({
    slug: t.slug,
    title: t.title,
    count: t.quizItems.length,
    skills: Object.fromEntries(
      [...new Set(t.quizItems.map((q) => q.skill))].map((s) => [
        s,
        t.quizItems.filter((q) => q.skill === s).length,
      ]),
    ),
    referenceIds: t.provenance.referenceIds,
    questions: t.quizItems.map((q) => ({
      id: q.id,
      contextKey: q.contextKey,
      skill: q.skill,
      fingerprint: q.fingerprint,
    })),
  })),
};
const index = `# Grammacho web curriculum coverage\n\nVersion: ${VERSION}\n\nContent SHA-256: ${hash}\n\n${coverage.authorship}\n\n${coverage.reviewStatus}\n\nEight core topics, 200 questions each, 1,600 total. Each bank uses 50 authored lexical/situational contexts with four tasks per context. These are structured form-practice banks, not 1,600 independent real-world situations or a calibrated assessment. Grammar facts and task formats follow the linked references; no publisher question bank is reproduced.\n\n| Topic | Questions | Skills |\n| --- | ---: | --- |\n${coverage.topics
  .map(
    (t) =>
      `| ${t.title} | ${t.count} | ${Object.entries(t.skills)
        .map(([s, n]) => `${s}: ${n}`)
        .join("; ")} |`,
  )
  .join(
    "\n",
  )}\n\n## Expand without duplication\n\n1. Read this index and coverage.json before authoring. The other 50 legacy mobile topics are not part of this web beta.\n2. Use content/foundations.mjs and contexts.mjs as the authoring sources. Preserve existing topic slugs, skill identifiers and context keys; these derive stable UUIDs. Do not regenerate covered topics to add a new topic.\n3. For genuinely new exercises, add unique context keys and new skill coverage, not option-order or name-only variations. To correct an existing answer, review progress compatibility and intentionally version the release.\n4. Verify authoritative references, reuse licences and ambiguity. Distinguish reproduced, adapted and newly authored material. Never claim school/CEFR approval or educator review that has not occurred. Third-party videos and commercial workbooks require separate rights.\n5. Run yarn content:build, yarn test and yarn build. The generator fails on duplicate prompts, duplicate fingerprints, invalid choices or absent provenance. Update the 200-item gate deliberately when expanding an existing bank.\n6. Review all question/answer exports. Human educator review is still needed; automated checks do not establish pedagogical validity.\n7. Create a versioned Supabase import with yarn content:sql. Apply only to the private grammar schema after reviewing the diff; never expose it through the Data API. User progress and auth are outside the content import. Verify database counts and fingerprints after import.\n8. Commit the authoring files, catalog, coverage and release provenance together. Rebuild/redeploy web to distribute new content. No network, database, or AI call is made during an ordinary build or learner session.\n\n## Sources\n\n${sources.map((s) => `- [${s.publisher}: ${s.title}](${s.url}) — ${s.use}${s.license ? `. ${s.license}.` : "."}`).join("\n")}\n`;
const outputs = {
  "src/generated/catalog.json": JSON.stringify(catalog),
  "content/coverage.json": JSON.stringify(coverage, null, 2) + "\n",
  "content/INDEX.md": index,
};
for (const [name, value] of Object.entries(outputs)) {
  const target = path.join(root, name);
  if (process.argv.includes("--check")) {
    if ((await readFile(target, "utf8")) !== value)
      throw Error(`${name} is stale; run yarn content:build`);
  } else {
    await mkdir(path.dirname(target), { recursive: true });
    await writeFile(target, value);
  }
}
console.log(
  `Content validated: ${topics.length} topics, ${ids.size} unique questions; ${hash}`,
);
