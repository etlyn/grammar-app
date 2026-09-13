import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  buildTopics,
  sources,
  normalize,
  sha,
} from "../content/foundations.mjs";
const topics = buildTopics();
const answer = (q) => q.choices.find((c) => c.id === q.answerId).text;
const item = (slug, skill, context) =>
  topics
    .find((t) => t.slug === slug)
    .quizItems.find((q) => q.skill === skill && q.contextKey === context);
test("all eight banks have 200 distinct prompts, stable UUIDs, references and explanations", () => {
  assert.equal(topics.length, 8);
  const ids = new Set();
  const prompts = new Set();
  for (const t of topics) {
    assert.equal(t.quizItems.length, 200);
    for (const q of t.quizItems) {
      assert.match(
        q.id,
        /^[0-9a-f]{8}-[0-9a-f]{4}-5[0-9a-f]{3}-a[0-9a-f]{3}-[0-9a-f]{12}$/,
      );
      assert.ok(!ids.has(q.id));
      ids.add(q.id);
      assert.ok(!prompts.has(normalize(q.prompt)));
      prompts.add(normalize(q.prompt));
      assert.equal(new Set(q.choices.map((c) => normalize(c.text))).size, 4);
      assert.ok(answer(q));
      assert.ok(q.explanation);
      assert.ok(
        q.provenance.referenceIds.every((id) =>
          sources.some((s) => s.id === id),
        ),
      );
    }
  }
  assert.equal(ids.size, 1600);
});
test("phonetic articles, irregular past forms and unchanged verb forms are handled", () => {
  assert.equal(
    answer(item("articles", "indefinite-sound", "noun-uniform")),
    "a",
  );
  assert.equal(
    answer(item("articles", "indefinite-sound", "noun-hourglass")),
    "an",
  );
  assert.equal(
    answer(item("articles", "indefinite-sound", "noun-USB-cable")),
    "a",
  );
  assert.equal(
    answer(item("articles", "indefinite-sound", "noun-X-ray-image")),
    "an",
  );
  assert.equal(
    answer(item("past-simple", "affirmative", "verb-buy")),
    "bought",
  );
  assert.equal(
    answer(item("past-simple", "base-after-did", "verb-cut")),
    "cut",
  );
  assert.equal(
    answer(
      item(
        "comparatives-and-superlatives",
        "comparative-form",
        "adjective-good",
      ),
    ),
    "better",
  );
  assert.equal(
    answer(
      item(
        "comparatives-and-superlatives",
        "superlative-form",
        "adjective-bad",
      ),
    ),
    "worst",
  );
});
test("catalog and coverage are reproducible, with fingerprints for future deduplication", async () => {
  const catalog = JSON.parse(
    await readFile(new URL("../src/generated/catalog.json", import.meta.url)),
  );
  assert.deepEqual(catalog.topics, topics);
  assert.equal(
    catalog.contentHash,
    sha(JSON.stringify({ version: catalog.version, sources, topics })),
  );
  const coverage = JSON.parse(
    await readFile(new URL("../content/coverage.json", import.meta.url)),
  );
  assert.equal(coverage.contentHash, catalog.contentHash);
  assert.equal(coverage.topics.flatMap((t) => t.questions).length, 1600);
});
