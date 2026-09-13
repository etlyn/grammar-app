// Produce a read-only field comparison query. PostgreSQL jsonb::text sorts object
// keys by UTF-8 byte length, then bytes; reproduce that serialization for MD5.
// MD5 is only a transport-efficient equality check, not a security signature.
import { readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
const catalog = JSON.parse(
  await readFile("src/generated/catalog.json", "utf8"),
);
if (catalog.version === "core-2026-09-v3") {
  const destination = process.argv[2] || "/tmp/grammacho-verify-content.sql";
  await writeFile(
    destination,
    await readFile(`supabase/content/${catalog.version}/verify.sql`, "utf8"),
  );
  console.log(
    `Full archive and new normalized bank comparison: ${destination}. This release uses one combined read-only query; --split is unnecessary.`,
  );
  process.exit(0);
}
const literal = (s) => "'" + s.replaceAll("'", "''") + "'";
const canonical = (value) => {
  if (Array.isArray(value)) return "[" + value.map(canonical).join(", ") + "]";
  if (value && typeof value === "object")
    return (
      "{" +
      Object.keys(value)
        .sort(
          (a, b) =>
            Buffer.byteLength(a) - Buffer.byteLength(b) ||
            Buffer.compare(Buffer.from(a), Buffer.from(b)),
        )
        .map((k) => JSON.stringify(k) + ": " + canonical(value[k]))
        .join(", ") +
      "}"
    );
  return JSON.stringify(value);
};
const digest = (value) =>
  createHash("md5").update(canonical(value)).digest("hex");
const topicRows = [],
  questionRows = [];
for (const t of catalog.topics) {
  const version = t.provenance.version;
  const hash =
    version === catalog.version
      ? catalog.contentHash
      : JSON.parse(
          await readFile(`supabase/content/${version}/manifest.json`, "utf8"),
        ).contentHash;
  const metadata = {
    ...t.provenance,
    contentHash: hash,
    sources: catalog.sources.filter((s) =>
      t.provenance.referenceIds.includes(s.id),
    ),
  };
  const row = {
    slug: t.slug,
    title: t.title,
    level: t.level,
    order_index: t.order,
    summary: t.summary,
    guidance: t.guidance,
    learning_goals: t.learningGoals,
    rules: t.rules,
    tips: t.tips,
    source: "seed",
    source_metadata: metadata,
  };
  topicRows.push(`(${literal(t.slug)},${literal(digest(row))})`);
  for (const q of t.quizItems) {
    const row = {
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
        contentHash: hash,
        skill: q.skill,
        contextKey: q.contextKey,
      },
    };
    questionRows.push(
      `(${literal(q.id)}::uuid,${literal(t.slug)},${literal(digest(row))})`,
    );
  }
}
const makeQuery = (topicRows, questionRows) =>
  `-- Read-only comparison of all catalog fields, excluding database timestamps and generated content_hash.\nWITH expected_topics(slug,digest) AS (VALUES ${topicRows.join(",\n")}),\nexpected_questions(id,slug,digest) AS (VALUES ${questionRows.join(",\n")})\nSELECT e.slug, (md5((to_jsonb(t)-'created_at'-'updated_at')::text)=e.digest) AS lesson_matches,\n (SELECT count(*) FROM grammar.grammar_quiz_items q WHERE q.topic_slug=e.slug) AS stored_questions,\n (SELECT count(*) FROM expected_questions x LEFT JOIN grammar.grammar_quiz_items q ON q.id=x.id WHERE x.slug=e.slug AND md5((to_jsonb(q)-'created_at'-'updated_at'-'content_hash')::text)=x.digest) AS matching_questions\nFROM expected_topics e LEFT JOIN grammar.grammar_topics t USING(slug) ORDER BY t.order_index;\n`;
const destination = process.argv[2] || `/tmp/grammacho-verify-content.sql`;
await writeFile(destination, makeQuery(topicRows, questionRows));
if (process.argv.includes("--split")) {
  for (const t of catalog.topics)
    await writeFile(
      `/tmp/grammacho-verify-${t.slug}.sql`,
      makeQuery(
        topicRows.filter((r) => r.startsWith(`(${literal(t.slug)},`)),
        questionRows.filter((r) => r.includes(`,${literal(t.slug)},`)),
      ),
    );
}
console.log(
  `Read-only verification query: ${destination} (${catalog.topics.length} topics, ${questionRows.length} questions)`,
);
