import { readFile, writeFile, mkdir } from "node:fs/promises";
import { spawnSync } from "node:child_process";
const check = spawnSync(
  process.execPath,
  ["scripts/build-content.mjs", "--check"],
  { stdio: "inherit" },
);
if (check.status !== 0) process.exit(check.status ?? 1);
const catalog = JSON.parse(
  await readFile("src/generated/catalog.json", "utf8"),
);
if (catalog.version.startsWith("core-")) {
  await import("./export-core-sql.mjs");
  process.exit(0);
}
const dir = "supabase/content/" + catalog.version;
await mkdir(dir, { recursive: true });
const literal = (value) => "'" + String(value).replaceAll("'", "''") + "'";
const json = (value) => literal(JSON.stringify(value)) + "::jsonb";
const files = [];
const addedTopics = catalog.topics.filter(
  (t) => t.provenance.version === catalog.version,
);
const addedQuestions = addedTopics.reduce(
  (sum, t) => sum + t.quizItems.length,
  0,
);
const retainedTopics = catalog.topics.filter(
  (t) => t.provenance.version !== catalog.version,
);
const retainedReleases = {};
for (const topic of retainedTopics) {
  const version = topic.provenance.version;
  if (!retainedReleases[version])
    retainedReleases[version] = JSON.parse(
      await readFile(`supabase/content/${version}/manifest.json`, "utf8"),
    );
}
const retainedChecks = Object.entries(retainedReleases)
  .map(([version, release]) => {
    const retained = retainedTopics.filter(
      (t) => t.provenance.version === version,
    );
    const count = retained.reduce((sum, t) => sum + t.quizItems.length, 0);
    return `IF NOT EXISTS(SELECT 1 FROM grammar.content_releases WHERE version=${literal(version)} AND content_hash=${literal(release.contentHash)}) OR (SELECT count(*) FROM grammar.grammar_topics WHERE source_metadata->>'contentHash'=${literal(release.contentHash)})<>${retained.length} OR (SELECT count(*) FROM grammar.grammar_quiz_items WHERE source_metadata->>'contentHash'=${literal(release.contentHash)})<>${count} THEN RAISE EXCEPTION 'Retained release missing or changed'; END IF;`;
  })
  .join("\n");
for (const [index, topic] of catalog.topics.entries()) {
  if (topic.provenance.version !== catalog.version) continue;
  const metadata = {
    ...topic.provenance,
    contentHash: catalog.contentHash,
    sources: catalog.sources.filter((s) =>
      topic.provenance.referenceIds.includes(s.id),
    ),
  };
  const { quizItems, ...lesson } = topic;
  const rows = quizItems.map((q) => ({
    id: q.id,
    topic_slug: q.topicSlug,
    level: q.level,
    prompt: q.prompt,
    choices: q.choices,
    answer_id: q.answerId,
    hint: q.hint,
    explanation: q.explanation,
    keywords: q.keywords,
    source: "seed",
    fingerprint: q.fingerprint,
    source_metadata: {
      ...q.provenance,
      contentHash: catalog.contentHash,
      skill: q.skill,
      contextKey: q.contextKey,
    },
  }));
  const sql = `-- ${topic.title}: ${quizItems.length} original guidance-aligned items.\n-- Content SHA-256 ${catalog.contentHash}\nBEGIN;\nSET LOCAL lock_timeout = '3s';\nSET LOCAL statement_timeout = '30s';\nSELECT pg_advisory_xact_lock(hashtext('grammar-content-import'));\nDO $guard$ BEGIN\n IF EXISTS (SELECT 1 FROM grammar.grammar_topics WHERE slug=${literal(topic.slug)} AND source_metadata->>'version' IS DISTINCT FROM ${literal(catalog.version)}) THEN\n  RAISE EXCEPTION 'Existing topic belongs to another content release; review an explicit migration';\n END IF;\n IF EXISTS (SELECT 1 FROM grammar.grammar_quiz_items WHERE topic_slug=${literal(topic.slug)} AND source_metadata->>'version' IS DISTINCT FROM ${literal(catalog.version)}) THEN\n  RAISE EXCEPTION 'Existing questions belong to another release';\n END IF;\n IF EXISTS (SELECT 1 FROM grammar.content_releases WHERE version=${literal(catalog.version)} AND content_hash<>${literal(catalog.contentHash)}) THEN\n  RAISE EXCEPTION 'Published release is immutable; create a new version';\n END IF;\nEND $guard$;\nINSERT INTO grammar.grammar_topics(slug,title,level,order_index,summary,guidance,learning_goals,rules,tips,source,source_metadata)\nSELECT j->>'slug',j->>'title',j->>'level',(j->>'order')::integer,j->>'summary',j->>'guidance',ARRAY(SELECT jsonb_array_elements_text(j->'learningGoals')),j->'rules',ARRAY(SELECT jsonb_array_elements_text(j->'tips')),'seed',${json(metadata)} FROM (SELECT ${json(lesson)} j) payload\nON CONFLICT(slug) DO UPDATE SET title=excluded.title,level=excluded.level,order_index=excluded.order_index,summary=excluded.summary,guidance=excluded.guidance,learning_goals=excluded.learning_goals,rules=excluded.rules,tips=excluded.tips,source_metadata=excluded.source_metadata,updated_at=now();\nINSERT INTO grammar.grammar_quiz_items(id,topic_slug,level,prompt,choices,answer_id,hint,explanation,keywords,source,fingerprint,source_metadata)\nSELECT id,topic_slug,level,prompt,choices,answer_id,hint,explanation,keywords,source,fingerprint,source_metadata FROM jsonb_to_recordset(${json(rows)}) AS q(id uuid,topic_slug text,level text,prompt text,choices jsonb,answer_id text,hint text,explanation text,keywords text[],source text,fingerprint text,source_metadata jsonb)\nON CONFLICT(id) DO UPDATE SET prompt=excluded.prompt,choices=excluded.choices,answer_id=excluded.answer_id,hint=excluded.hint,explanation=excluded.explanation,keywords=excluded.keywords,fingerprint=excluded.fingerprint,source_metadata=excluded.source_metadata,updated_at=now();\nDO $verify$ BEGIN\n IF (SELECT count(*) FROM grammar.grammar_quiz_items WHERE topic_slug=${literal(topic.slug)} AND source_metadata->>'version'=${literal(catalog.version)})<>200 THEN RAISE EXCEPTION 'Topic count mismatch'; END IF;\nEND $verify$;\nCOMMIT;\n`;
  const name = `${String(index + 1).padStart(2, "0")}-${topic.slug}.sql`;
  files.push(name);
  await writeFile(dir + "/" + name, sql);
}
const final = `BEGIN;\nSET LOCAL lock_timeout='3s';\nSET LOCAL statement_timeout='30s';\nSELECT pg_advisory_xact_lock(hashtext('grammar-content-import'));\nDO $verify$ BEGIN\n ${retainedChecks}\n IF (SELECT count(*) FROM grammar.grammar_topics WHERE source_metadata->>'contentHash'=${literal(catalog.contentHash)})<>${addedTopics.length} OR (SELECT count(*) FROM grammar.grammar_quiz_items WHERE source_metadata->>'contentHash'=${literal(catalog.contentHash)})<>${addedQuestions} THEN RAISE EXCEPTION 'Incomplete content release'; END IF;\n IF EXISTS(SELECT 1 FROM grammar.content_releases WHERE version=${literal(catalog.version)} AND content_hash<>${literal(catalog.contentHash)}) THEN RAISE EXCEPTION 'Release hash conflict'; END IF;\nEND $verify$;\nINSERT INTO grammar.content_releases(version,content_hash,topic_count,question_count,sources,review_status) VALUES(${literal(catalog.version)},${literal(catalog.contentHash)},${addedTopics.length},${addedQuestions},${json(catalog.sources)},'automated-checked; educator-review-pending') ON CONFLICT(version) DO NOTHING;\nCOMMIT;\n`;
const finalizeName = `${String(catalog.topics.length + 1).padStart(2, "0")}-finalize.sql`;
files.push(finalizeName);
await writeFile(dir + "/" + finalizeName, final);
await writeFile(
  dir + "/manifest.json",
  JSON.stringify(
    {
      version: catalog.version,
      contentHash: catalog.contentHash,
      progressVersion: catalog.progressVersion,
      addedTopics: addedTopics.length,
      addedQuestions,
      retainedReleases: Object.fromEntries(
        Object.entries(retainedReleases).map(([version, r]) => [
          version,
          r.contentHash,
        ]),
      ),
      totalTopics: catalog.topics.length,
      totalQuestions: catalog.topics.reduce(
        (n, t) => n + t.quizItems.length,
        0,
      ),
      files,
    },
    null,
    2,
  ) + "\n",
);
console.log(
  `Prepared ${files.length} transactional SQL files in ${dir}; no database was contacted.`,
);
