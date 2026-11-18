import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { buildCatalog, validateCatalog } from "../content/spanish/catalog.mjs";

const catalog = buildCatalog();

test("Spanish course supports complete offline chapters, practice and map navigation", () => {
  assert.deepEqual(validateCatalog(catalog), {
    topics: 30,
    questions: 720,
    sections: 120,
  });
  assert.equal(new Set(catalog.topics.map((topic) => topic.stage)).size, 6);
  for (const area of catalog.grammarMap.domains) {
    for (const concept of area.concepts) {
      const chapter = catalog.topics.find(
        (topic) => topic.slug === concept.topicSlug,
      );
      assert.ok(chapter.chapter.rules.some((rule) => rule.id === concept.id));
    }
  }
  const saved = JSON.parse(
    readFileSync(
      new URL("../src/generated/catalog-es.json", import.meta.url),
      "utf8",
    ),
  );
  assert.deepEqual(saved, catalog);
});

test("English snapshot and its saved-progress namespace remain the released course", () => {
  const english = JSON.parse(
    readFileSync(
      new URL("../src/generated/catalog.json", import.meta.url),
      "utf8",
    ),
  );
  assert.equal(
    english.contentHash,
    "87b630c771d79eac83e3be02f06e226cf9455e201ca4d4e9ebd574542396373d",
  );
  assert.notEqual(catalog.progressVersion, english.progressVersion);
  const englishIds = new Set(
    english.topics.flatMap((topic) =>
      topic.quizItems.map((question) => question.id),
    ),
  );
  assert.ok(
    catalog.topics.every((topic) =>
      topic.quizItems.every((question) => !englishIds.has(question.id)),
    ),
  );
});

test("validator rejects duplicate prompts, ambiguous identical options and missing teaching", () => {
  const duplicate = structuredClone(catalog);
  duplicate.topics[0].quizItems[1].prompt =
    duplicate.topics[0].quizItems[0].prompt;
  assert.throws(() => validateCatalog(duplicate), /duplicate exercise/);
  const identical = structuredClone(catalog);
  identical.topics[0].quizItems[0].choices[1].text =
    identical.topics[0].quizItems[0].choices[0].text;
  assert.throws(() => validateCatalog(identical), /invalid options/);
  const missing = structuredClone(catalog);
  delete missing.topics[0].quizItems[0].teaching.choiceReasons.A;
  assert.throws(() => validateCatalog(missing), /missing\/placeholder text/);
});

test("validator rejects dead map links and a bank too short for a session", () => {
  const map = structuredClone(catalog);
  map.grammarMap.domains[0].concepts[0].id = "missing";
  assert.throws(() => validateCatalog(map), /map does not cover/);
  const wrongChapter = structuredClone(catalog);
  wrongChapter.grammarMap.domains[0].concepts[0].topicSlug =
    catalog.topics[1].slug;
  assert.throws(() => validateCatalog(wrongChapter), /owning chapter/);
  const short = structuredClone(catalog);
  short.topics[0].quizItems.splice(0, 5);
  assert.throws(() => validateCatalog(short), /24 exercises/);
});

test("validator rejects empty learner guidance and teaching steps", () => {
  const guide = structuredClone(catalog);
  guide.topics[0].learningGoals[0] = " ";
  assert.throws(() => validateCatalog(guide), /missing\/placeholder text/);
  const teaching = structuredClone(catalog);
  teaching.topics[0].quizItems[0].teaching.steps[0] = "";
  assert.throws(() => validateCatalog(teaching), /missing\/placeholder text/);
});
