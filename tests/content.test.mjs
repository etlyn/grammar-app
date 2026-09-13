import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { buildTopics, sources, normalize, sha } from "../content/catalog.mjs";
const topics = buildTopics();
const answer = (q) => q.choices.find((c) => c.id === q.answerId).text;
const item = (slug, skill, context) =>
  topics
    .find((t) => t.slug === slug)
    .quizItems.find((q) => q.skill === skill && q.contextKey === context);
test("all core banks have 200 distinct prompts, stable UUIDs, references and explanations", () => {
  assert.equal(topics.length, 67);
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
  assert.equal(ids.size, 13400);
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
  assert.equal(coverage.topics.flatMap((t) => t.questions).length, 13400);
});

test("the original v1 source hash and question identity remain unchanged with compatible progress", async () => {
  const original = await import("../content/foundations.mjs");
  assert.equal(
    original.sha(
      JSON.stringify({
        version: original.VERSION,
        sources: original.sources,
        topics: original.buildTopics(),
      }),
    ),
    "80f731f032a9eb103f1c1ff16dbb914b3e725cae49cb122d7d4df0e44da9c096",
  );
  for (const old of original.buildTopics()) {
    const current = topics.find((t) => t.slug === old.slug);
    assert.deepEqual(current.rules, old.rules);
    assert.equal(current.quizItems.length, old.quizItems.length);
    for (const q of old.quizItems) {
      const { hint, teaching, ...updated } = current.quizItems.find(
        (x) => x.id === q.id,
      );
      const { hint: oldHint, ...unchanged } = q;
      assert.deepEqual(updated, unchanged);
    }
  }
  const snapshot = JSON.parse(
    await readFile(new URL("../src/generated/catalog.json", import.meta.url)),
  );
  assert.equal(snapshot.progressVersion, original.VERSION);
});

test("new grammar edge cases distinguish number, meaning and verb patterns", () => {
  assert.equal(
    answer(item("there-is-there-are", "agreement", "existence-5")),
    "is",
  ); // water
  assert.equal(answer(item("have-got", "question", "possession-7")), "Has"); // apartment
  assert.equal(
    answer(item("countable-uncountable", "noun-agreement", "quantity-44")),
    "is",
  ); // news
  assert.equal(
    answer(item("small-quantities", "positive-amount", "quantity-1")),
    "a few",
  );
  assert.equal(
    answer(item("small-quantities", "shortage", "quantity-26")),
    "very little",
  );
  assert.equal(
    answer(item("possessive-s", "owner-marking", "owner-26")),
    "the bakers'",
  );
  assert.equal(
    answer(item("possessive-s", "owner-marking", "owner-46")),
    "the children's",
  );
  assert.equal(
    answer(item("prepositions-of-place", "location-preposition", "place-24")),
    "on",
  ); // ceiling
  assert.equal(
    answer(item("past-continuous", "background-form", "background-2")),
    "were polishing",
  );
  assert.equal(
    answer(item("infinitive-of-purpose", "purpose-form", "purpose-1")),
    "to let",
  );
  assert.equal(
    answer(item("verb-patterns", "complement-form", "complement-1")),
    "exploring",
  );
  assert.equal(
    answer(item("verb-patterns", "complement-form", "complement-26")),
    "to borrow",
  );
  assert.equal(
    answer(item("ed-ing-adjectives", "experienced-feeling", "emotion-21")),
    "annoyed",
  );
  assert.equal(
    answer(item("ed-ing-adjectives", "cause-of-feeling", "emotion-21")),
    "annoying",
  );
});

test("each extension bank covers four skills and fifty contexts, without duplicate choices", () => {
  for (const topic of topics.filter(
    (t) => t.provenance.version === "foundations-2026-09-v2",
  )) {
    assert.equal(new Set(topic.quizItems.map((q) => q.contextKey)).size, 50);
    const skills = new Set(topic.quizItems.map((q) => q.skill));
    assert.equal(skills.size, 4);
    for (const skill of skills)
      assert.equal(topic.quizItems.filter((q) => q.skill === skill).length, 50);
  }
});

test("every chapter has a sourced place in the progression, highlighted rules and complete answer diagnoses", () => {
  const previous = new Set();
  for (const [index, t] of topics.entries()) {
    assert.equal(t.order, index + 1);
    assert.ok(t.stage);
    assert.ok(t.prerequisites.every((slug) => previous.has(slug)));
    previous.add(t.slug);
    assert.ok(t.chapter.introduction.length);
    assert.ok(t.chapter.rules.length >= 4);
    assert.ok(
      t.chapter.rules.every((r) => r.explanation && r.examples.length >= 2),
    );
    assert.ok(t.chapter.rules.some((r) => r.pattern?.includes("**")));
    for (const q of t.quizItems) {
      assert.equal(q.teaching.steps.length, 3);
      assert.deepEqual(Object.keys(q.teaching.choiceReasons).sort(), [
        "A",
        "B",
        "C",
        "D",
      ]);
      for (const reason of Object.values(q.teaching.choiceReasons)) {
        assert.ok(reason.length >= 16);
        assert.doesNotMatch(reason, /undefined|NaN|\$\{/);
      }
    }
  }
});

test("core contrast questions distinguish time, modality, clause roles and irregular participles", () => {
  const pick = (slug, skill, context = 1) =>
    item(slug, skill, `${slug}-${context}`);
  assert.equal(answer(pick("modal-obligation", "prohibition")), "must not");
  assert.equal(
    answer(pick("modal-obligation", "no-obligation")),
    "do not have to",
  );
  assert.equal(
    answer(pick("verb-pattern-meaning", "remember-future-duty")),
    "to prepare",
  );
  assert.equal(
    answer(pick("verb-pattern-meaning", "remember-past-experience")),
    "preparing",
  );
  assert.equal(
    answer(pick("present-perfect", "perfect-participle", 26)),
    "written",
  );
  assert.equal(answer(pick("past-perfect", "perfect-participle", 29)), "taken");
  assert.equal(
    answer(pick("third-mixed-conditionals", "past-condition-present-result")),
    "would be",
  );
  assert.equal(answer(pick("unreal-subjunctive", "mandative-base")), "prepare");
  assert.equal(
    answer(pick("phrasal-verbs", "pronoun-placement")),
    "turn it on",
  );
  assert.equal(
    answer(pick("passive-voice", "present-passive", 11)),
    "are packed",
  );
  assert.equal(
    answer(pick("nouns-and-plurals", "plural-possession", 4)),
    "children's",
  );
});
