const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const {
  projectEvents,
  snapshotEvent,
  legacyImportEvents,
  survivingGuestImport,
  compactAttemptEvents,
} = require(
  path.join(process.env.LEARNING_BUILD_DIR, "utils/accountProgress.js"),
);
const { initialLearningState } = require(
  path.join(process.env.LEARNING_BUILD_DIR, "utils/learningState.js"),
);
const catalog = require("../src/generated/catalog.json");
const topics = catalog.topics;
const topic = topics[0];
const order = topic.quizItems.slice(0, 20).map((item) => item.id);
const now = "2026-11-23T12:00:00.000Z";
const session = (id, count = 1, correct = true, complete = false) => ({
  id,
  itemIds: order,
  answers: order.slice(0, count).map((itemId) => {
    const q = topic.quizItems.find((q) => q.id === itemId);
    return {
      itemId,
      selectedAnswer: correct
        ? q.answerId
        : q.choices.find((c) => c.id !== q.answerId).id,
    };
  }),
  index: Math.min(count, 19),
  complete,
});
const event = (attempt, generation = 0, sequence) => ({
  ...snapshotEvent(attempt, topic.slug, generation, catalog.version, now),
  ...(sequence !== undefined ? { sequence } : {}),
});
const result = (events) => projectEvents(events, topics, "en");

test("attempt snapshots merge once, finish monotonically and retain independent unfinished sessions", () => {
  const first = event(session("a", 1, false), 0, 1),
    next = event(session("a", 20, true, true), 0, 2);
  // The fixture differs in an existing checked answer; real server rejects that.
  // Keep the existing wrong prefix in the later full snapshot for this projection.
  next.payload.answers[0] = first.payload.answers[0];
  const old = event(session("a", 20, true, false));
  old.payload.answers[0] = first.payload.answers[0];
  const unfinished = event(session("b", 2), 0, 3);
  const p = result([first, next, old, unfinished]);
  assert.equal(p.progress[topic.slug].total, 22);
  assert.equal(p.progress[topic.slug].correct, 21);
  assert.equal(p.progress[topic.slug].completedSessions, 1);
  assert.equal(p.progress[topic.slug].isCompleted, true);
  assert.equal(p.sessions[topic.slug].id, "b");
  assert.equal(p.mistakes.length, 1);
});

test("legacy copies use one largest baseline and original included counts, retaining all past pass maxima", () => {
  const baseline = {
    ...initialLearningState(),
    progress: {
      [topic.slug]: {
        correct: 30,
        total: 40,
        bestScore: 70,
        lastScore: 50,
        completedSessions: 2,
        isCompleted: false,
        updatedAt: now,
      },
    },
    sessions: { [topic.slug]: session("imported", 3, true) },
  };
  const imports = legacyImportEvents(baseline, {}, catalog.version, "one", now);
  imports[0].payload.includedAttemptCounts = {
    attemptId: "imported",
    total: 3,
    correct: 3,
    completedSessions: 0,
  };
  const duplicate = structuredClone(imports[0]);
  duplicate.id = "other-copy";
  const priorPass = structuredClone(imports[0]);
  priorPass.id = "older-pass";
  priorPass.payload.progress = {
    ...priorPass.payload.progress,
    total: 20,
    correct: 18,
    bestScore: 90,
    isCompleted: true,
  };
  const finished = event(session("imported", 20, true, true), 0, 4);
  const p = result([...imports, duplicate, priorPass, finished]);
  assert.equal(p.progress[topic.slug].total, 57);
  assert.equal(p.progress[topic.slug].correct, 47);
  assert.equal(p.progress[topic.slug].completedSessions, 3);
  assert.equal(p.progress[topic.slug].bestScore, 100);
  assert.equal(p.progress[topic.slug].isCompleted, true);
});

test("canonical reset generations remove prior attempts and reviews target a specific mistake", () => {
  const wrong = event(session("old", 1, false), 0, 1);
  const reset = {
    id: "reset",
    courseId: "en",
    catalogVersion: catalog.version,
    topicSlug: topic.slug,
    generation: 1,
    kind: "topic-reset",
    occurredAt: now,
    payload: {},
    sequence: 2,
  };
  const newer = event(session("new", 1, false), 1, 3);
  const p = result([wrong, reset, newer]);
  assert.equal(p.progress[topic.slug].total, 1);
  assert.equal(p.mistakes.length, 1);
  const reviewed = {
    id: "review",
    courseId: "en",
    catalogVersion: catalog.version,
    topicSlug: topic.slug,
    generation: 1,
    kind: "mistake-review",
    occurredAt: now,
    payload: { mistakeId: `new:${order[0]}` },
    sequence: 4,
  };
  assert.equal(result([wrong, reset, newer, reviewed]).mistakes.length, 0);
});

test("guest import after a guest reset preserves existing cloud history and excludes stale guest baseline", () => {
  const cloud = event(session("cloud", 2), 4, 1);
  const cloudReset = {
    id: "cloud-reset",
    courseId: "en",
    catalogVersion: catalog.version,
    topicSlug: topic.slug,
    generation: 4,
    kind: "topic-reset",
    occurredAt: now,
    payload: {},
    sequence: 0,
  };
  const stale = event(session("stale", 10), 0);
  const guestReset = {
    id: "guest-reset",
    courseId: "en",
    catalogVersion: catalog.version,
    topicSlug: topic.slug,
    generation: 1,
    kind: "topic-reset",
    occurredAt: now,
    payload: {},
  };
  const current = event(session("guest-current", 3), 1);
  const baseline = {
    ...initialLearningState(),
    progress: {
      [topic.slug]: {
        total: 100,
        correct: 90,
        bestScore: 90,
        lastScore: 90,
        completedSessions: 5,
        isCompleted: true,
        updatedAt: now,
      },
    },
    sessions: {},
  };
  const imported = survivingGuestImport(
    baseline,
    [stale, guestReset, current],
    { [topic.slug]: 4 },
    catalog.version,
    "guest",
    now,
  );
  assert.equal(imported.length, 1);
  assert.equal(imported[0].kind, "attempt");
  assert.equal(imported[0].generation, 4);
  const p = result([cloudReset, cloud, ...imported]);
  assert.equal(p.progress[topic.slug].total, 5);
  assert.equal(p.progress[topic.slug].correct, 5);
});

test("wire snapshots omit server enrichment and separate distinct outgoing mutations", () => {
  const a = session("stable", 2);
  Object.assign(a, {
    correctCount: 2,
    score: 100,
    passed: false,
    mistakes: [],
  });
  const first = snapshotEvent(a, topic.slug, 0, catalog.version, now);
  assert.deepEqual(Object.keys(first.payload).sort(), [
    "answers",
    "complete",
    "id",
    "index",
    "itemIds",
  ]);
  const next = snapshotEvent(
    { ...a, index: 1 },
    topic.slug,
    0,
    catalog.version,
    now,
  );
  assert.notEqual(first.id, next.id);
});

test("compaction retains monotonic snapshots and keeps a mistake review after its attempt", () => {
  const first = event(session("a", 1, false), 0, 1);
  const review = {
    id: "review",
    courseId: "en",
    catalogVersion: catalog.version,
    topicSlug: topic.slug,
    generation: 0,
    kind: "mistake-review",
    occurredAt: now,
    payload: { mistakeId: `a:${order[0]}` },
  };
  const finished = event(session("a", 20, true, true), 0, 10);
  finished.payload.answers[0] = first.payload.answers[0];
  const old = event(session("a", 1, false));
  const compact = compactAttemptEvents([first, review, finished, old]);
  assert.equal(compact.length, 2);
  assert.equal(compact[0].payload.complete, true);
  assert.equal(compact[1].kind, "mistake-review");
  assert.equal(result(compact).progress[topic.slug].total, 20);
});

test("distinct outgoing snapshots have unique IDs and divergent queued answers do not block unrelated learning", () => {
  const { reconcilePendingAttempts } = require(
    path.join(process.env.LEARNING_BUILD_DIR, "utils/accountProgress.js"),
  );
  const first = event(session("shared", 1, true), 0, 1);
  const same = event(session("shared", 1, true));
  assert.notEqual(first.id, same.id);
  const wrong = event(session("shared", 1, false));
  const other = event(session("other", 1, true));
  const reconciled = reconcilePendingAttempts([same, wrong, other], [first]);
  assert.deepEqual(
    reconciled.events.map((e) => e.payload.id),
    ["other"],
  );
  assert.ok(reconciled.conflictedAttemptIds.has("shared"));
  const reordered = event({
    ...session("shared", 1, true),
    itemIds: [...order].reverse(),
  });
  assert.equal(
    reconcilePendingAttempts([reordered, other], [first]).events.length,
    1,
  );
});
