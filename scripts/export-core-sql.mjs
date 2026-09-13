import { readFile, writeFile, mkdir } from "node:fs/promises";
import { createHash } from "node:crypto";
const snapshot = JSON.parse(
  await readFile("src/generated/catalog.json", "utf8"),
);
const literal = (v) => "'" + String(v).replaceAll("'", "''") + "'";
const json = (v) => literal(JSON.stringify(v)) + "::jsonb";
const version = literal(snapshot.version),
  hash = literal(snapshot.contentHash);
const directory = "supabase/content/" + snapshot.version;
await mkdir(directory, { recursive: true });
const files = [],
  digests = [];
const retained = {};
for (const t of snapshot.topics)
  if (t.provenance.version !== snapshot.version) {
    const v = t.provenance.version;
    retained[v] ??= JSON.parse(
      await readFile(`supabase/content/${v}/manifest.json`, "utf8"),
    );
  }
// The v4 reading-only release reuses exactly the verified v3 quiz arrays.
// Structural tests compare all question payloads to the immutable v3 authoring.
const baseArchive =
  snapshot.version === "core-2026-09-v4"
    ? JSON.parse(
        await readFile(
          "supabase/content/core-2026-09-v3/manifest.json",
          "utf8",
        ),
      )
    : null;
// PostgreSQL jsonb canonical ordering: byte length first, then bytewise key order.
export function canonical(v) {
  if (Array.isArray(v)) return "[" + v.map(canonical).join(", ") + "]";
  if (v && typeof v === "object")
    return (
      "{" +
      Object.keys(v)
        .sort(
          (a, b) =>
            Buffer.byteLength(a) - Buffer.byteLength(b) ||
            Buffer.compare(Buffer.from(a), Buffer.from(b)),
        )
        .map((k) => JSON.stringify(k) + ": " + canonical(v[k]))
        .join(", ") +
      "}"
    );
  return JSON.stringify(v);
}
for (const t of snapshot.topics) {
  const slug = literal(t.slug),
    newTopic = t.provenance.version === snapshot.version;
  const digest = createHash("md5").update(canonical(t)).digest("hex");
  digests.push({ slug: t.slug, md5: digest });
  const metadata = {
    ...t.provenance,
    contentHash: snapshot.contentHash,
    sources: snapshot.sources.filter((s) =>
      t.provenance.referenceIds.includes(s.id),
    ),
  };
  let sql = `-- ${t.title}: immutable full teaching payload; ${newTopic ? "new normalized bank" : "retained normalized bank is unchanged"}.\nBEGIN;\nSET LOCAL lock_timeout='3s';\nSET LOCAL statement_timeout='30s';\nSELECT pg_advisory_xact_lock(hashtext('grammar-content-import'));\nDO $guard$ BEGIN\n IF EXISTS(SELECT 1 FROM grammar.content_releases WHERE version=${version} AND content_hash<>${hash}) THEN RAISE EXCEPTION 'Published release is immutable'; END IF;\n IF EXISTS(SELECT 1 FROM grammar.content_catalog_topics WHERE version=${version} AND slug=${slug} AND (catalog_hash<>${hash} OR payload_md5<>${literal(digest)})) THEN RAISE EXCEPTION 'Catalog payload conflict: use a new version'; END IF;\nEND $guard$;\nINSERT INTO grammar.content_catalog_topics(version,slug,catalog_hash,payload) VALUES(${version},${slug},${hash},${json(t)}) ON CONFLICT(version,slug) DO NOTHING;\n`;
  if (baseArchive) {
    const expectedBase = baseArchive.topicDigests.find(
      (d) => d.slug === t.slug,
    );
    if (!expectedBase || newTopic)
      throw Error("Reading-only archive requires a retained topic");
    const { quizItems, ...readingPayload } = t;
    const questionsDigest = createHash("md5")
      .update(canonical(quizItems))
      .digest("hex");
    const fullInsert = `INSERT INTO grammar.content_catalog_topics(version,slug,catalog_hash,payload) VALUES(${version},${slug},${hash},${json(t)}) ON CONFLICT(version,slug) DO NOTHING;`;
    const cloneInsert = `DO $base$ BEGIN
 IF NOT EXISTS(SELECT 1 FROM grammar.content_catalog_topics WHERE version=${literal(baseArchive.version)} AND slug=${slug} AND catalog_hash=${literal(baseArchive.contentHash)} AND payload_md5=${literal(expectedBase.md5)} AND md5((payload->'quizItems')::text)=${literal(questionsDigest)}) THEN RAISE EXCEPTION 'Base archive or retained questions differ'; END IF;
END $base$;
INSERT INTO grammar.content_catalog_topics(version,slug,catalog_hash,payload)
SELECT ${version},${slug},${hash},payload || ${json(readingPayload)} FROM grammar.content_catalog_topics WHERE version=${literal(baseArchive.version)} AND slug=${slug}
ON CONFLICT(version,slug) DO NOTHING;`;
    sql = sql.replace(fullInsert, cloneInsert);
  }
  if (newTopic)
    sql += `DO $guard$ BEGIN\n IF EXISTS(SELECT 1 FROM grammar.grammar_topics WHERE slug=${slug} AND source_metadata->>'version' IS DISTINCT FROM ${version}) THEN RAISE EXCEPTION 'Topic belongs to another release'; END IF;\n IF EXISTS(SELECT 1 FROM grammar.grammar_quiz_items WHERE topic_slug=${slug} AND source_metadata->>'version' IS DISTINCT FROM ${version}) THEN RAISE EXCEPTION 'Questions belong to another release'; END IF;\nEND $guard$;\nINSERT INTO grammar.grammar_topics(slug,title,level,order_index,summary,guidance,learning_goals,rules,tips,source,source_metadata)\nSELECT j->>'slug',j->>'title',j->>'level',(j->>'order')::integer,j->>'summary',j->>'guidance',ARRAY(SELECT jsonb_array_elements_text(j->'learningGoals')),j->'rules',ARRAY(SELECT jsonb_array_elements_text(j->'tips')),'seed',${json(metadata)} FROM (SELECT payload j FROM grammar.content_catalog_topics WHERE version=${version} AND slug=${slug}) p\nON CONFLICT(slug) DO NOTHING;\nINSERT INTO grammar.grammar_quiz_items(id,topic_slug,level,prompt,choices,answer_id,hint,explanation,keywords,source,fingerprint,source_metadata)\nSELECT (q->>'id')::uuid,q->>'topicSlug',q->>'level',q->>'prompt',q->'choices',q->>'answerId',q->>'hint',q->>'explanation',ARRAY(SELECT jsonb_array_elements_text(q->'keywords')),'seed',q->>'fingerprint',(q->'provenance')||jsonb_build_object('contentHash',${hash},'skill',q->>'skill','contextKey',q->>'contextKey','teaching',q->'teaching')\nFROM grammar.content_catalog_topics t CROSS JOIN LATERAL jsonb_array_elements(t.payload->'quizItems') q WHERE t.version=${version} AND t.slug=${slug}\nON CONFLICT(id) DO NOTHING;\n`;
  sql += `DO $verify$ BEGIN\n IF NOT EXISTS(SELECT 1 FROM grammar.content_catalog_topics WHERE version=${version} AND slug=${slug} AND payload_md5=${literal(digest)}) THEN RAISE EXCEPTION 'Full payload mismatch'; END IF;\n IF (SELECT count(*) FROM grammar.grammar_quiz_items WHERE topic_slug=${slug})<>200 THEN RAISE EXCEPTION 'Question count mismatch'; END IF;\nEND $verify$;\nCOMMIT;\n`;
  const name = String(t.order).padStart(2, "0") + "-" + t.slug + ".sql";
  files.push(name);
  await writeFile(directory + "/" + name, sql);
}
const added = snapshot.topics.filter(
  (t) => t.provenance.version === snapshot.version,
);
const retainedChecks = Object.entries(retained)
  .map(
    ([v, r]) =>
      `IF NOT EXISTS(SELECT 1 FROM grammar.content_releases WHERE version=${literal(v)} AND content_hash=${literal(r.contentHash)}) THEN RAISE EXCEPTION 'Retained release missing'; END IF;`,
  )
  .join("\n");
const allDigests = digests
  .map((d) => `(${literal(d.slug)},${literal(d.md5)})`)
  .join(",");
const verify = `WITH expected(slug,hash) AS (VALUES ${allDigests}), sources AS (SELECT ${json(snapshot.sources)} AS items)
SELECT e.slug,(t.payload_md5=e.hash AND t.catalog_hash=${hash}) AS payload_matches,
 jsonb_array_length(t.payload->'quizItems') AS questions,
 CASE WHEN t.payload->'provenance'->>'version'=${version} THEN
 COALESCE((to_jsonb(n)-'created_at'-'updated_at') = jsonb_build_object(
 'slug',t.payload->'slug','title',t.payload->'title','level',t.payload->'level','order_index',t.payload->'order',
 'summary',t.payload->'summary','guidance',t.payload->'guidance','learning_goals',t.payload->'learningGoals',
 'rules',t.payload->'rules','tips',t.payload->'tips','source','seed',
 'source_metadata',(t.payload->'provenance')||jsonb_build_object('contentHash',${hash},'sources',
 (SELECT jsonb_agg(s) FROM sources CROSS JOIN LATERAL jsonb_array_elements(items) s WHERE t.payload->'provenance'->'referenceIds' ? (s->>'id')))),false) END AS normalized_topic_matches,
 CASE WHEN t.payload->'provenance'->>'version'=${version} THEN
 (SELECT count(*) FROM jsonb_array_elements(t.payload->'quizItems') q
 JOIN grammar.grammar_quiz_items n ON n.id=(q->>'id')::uuid
 WHERE (to_jsonb(n)-'created_at'-'updated_at'-'content_hash') = jsonb_build_object(
 'id',q->'id','topic_slug',q->'topicSlug','level',q->'level','prompt',q->'prompt',
 'choices',q->'choices','answer_id',q->'answerId','hint',q->'hint','explanation',q->'explanation',
 'keywords',q->'keywords','source','seed','fingerprint',q->'fingerprint',
 'source_metadata',(q->'provenance')||jsonb_build_object('contentHash',${hash},'skill',q->'skill','contextKey',q->'contextKey','teaching',q->'teaching'))) END AS normalized_questions_matching
FROM expected e LEFT JOIN grammar.content_catalog_topics t ON t.slug=e.slug AND t.version=${version}
LEFT JOIN grammar.grammar_topics n ON n.slug=e.slug ORDER BY e.slug`;
await writeFile(directory + "/verify.sql", verify + ";\n");
const finalName =
  String(snapshot.topics.length + 1).padStart(2, "0") + "-finalize.sql";
const final = `BEGIN;\nSET LOCAL lock_timeout='3s';\nSET LOCAL statement_timeout='30s';\nSELECT pg_advisory_xact_lock(hashtext('grammar-content-import'));\nDO $verify$ BEGIN\n${retainedChecks}\n IF EXISTS(SELECT 1 FROM (${verify}) v WHERE payload_matches IS DISTINCT FROM true OR questions IS DISTINCT FROM 200 OR normalized_topic_matches=false OR normalized_questions_matching<>200) THEN RAISE EXCEPTION 'Stored fields differ from catalog'; END IF;\n IF (SELECT count(*) FROM grammar.content_catalog_topics WHERE version=${version} AND catalog_hash=${hash})<>${snapshot.topics.length} THEN RAISE EXCEPTION 'Incomplete catalog'; END IF;\n IF (WITH expected(slug,hash) AS (VALUES ${allDigests}) SELECT count(*) FROM expected e JOIN grammar.content_catalog_topics t ON t.slug=e.slug AND t.version=${version} AND t.payload_md5=e.hash)<>${snapshot.topics.length} THEN RAISE EXCEPTION 'Payload digest mismatch'; END IF;\n IF (SELECT count(*) FROM grammar.grammar_quiz_items WHERE source_metadata->>'contentHash'=${hash})<>${added.length * 200} THEN RAISE EXCEPTION 'Incomplete new question bank'; END IF;\n IF EXISTS(SELECT 1 FROM grammar.content_releases WHERE version=${version} AND content_hash<>${hash}) THEN RAISE EXCEPTION 'Release hash conflict'; END IF;\nEND $verify$;\nINSERT INTO grammar.content_releases(version,content_hash,topic_count,question_count,sources,review_status) VALUES(${version},${hash},${added.length},${added.length * 200},${json(snapshot.sources)},'automated-checked; educator-review-pending') ON CONFLICT(version) DO NOTHING;\nCOMMIT;\n`;
await writeFile(directory + "/" + finalName, final);
files.push(finalName);
await writeFile(
  directory + "/manifest.json",
  JSON.stringify(
    {
      version: snapshot.version,
      contentHash: snapshot.contentHash,
      progressVersion: snapshot.progressVersion,
      archive: "grammar.content_catalog_topics",
      addedTopics: added.length,
      addedQuestions: added.length * 200,
      totalTopics: snapshot.topics.length,
      totalQuestions: snapshot.topics.length * 200,
      retainedReleases: Object.fromEntries(
        Object.entries(retained).map(([v, r]) => [v, r.contentHash]),
      ),
      archiveDependency: baseArchive
        ? { version: baseArchive.version, contentHash: baseArchive.contentHash }
        : undefined,
      grammarMap: snapshot.grammarMap,
      topicDigests: digests,
      files,
    },
    null,
    2,
  ) + "\n",
);
console.log(
  `Prepared ${files.length} transactional full-catalog files in ${directory}. No database was contacted.`,
);
