const { test } = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const { webcrypto } = require("node:crypto");
globalThis.crypto = webcrypto;
const {
  initialLearningState,
  reduceLearning,
  createSession,
  restoreLearning,
} = require(
  path.join(process.env.LEARNING_BUILD_DIR, "utils/learningState.js"),
);
const { topics } = require("../src/generated/catalog.json");
const topic = topics.find((t) => t.slug === "present-simple-be");
const slug = topic.slug;
const now = "2026-09-13T00:00:00.000Z";
function finish(state, count, id) {
  const session = createSession(
    topic,
    state.progress[slug]?.answeredItemIds,
    id,
  );
  state = reduceLearning(state, { type: "start", slug, session }, topics);
  for (let i = 0; i < 20; i++) {
    const item = topic.quizItems.find((q) => q.id === session.itemIds[i]);
    const choice =
      i < count
        ? item.answerId
        : item.choices.find((c) => c.id !== item.answerId).id;
    state = reduceLearning(
      state,
      { type: "answer", slug, sessionId: id, itemId: item.id, choice, now },
      topics,
    );
    state = reduceLearning(
      state,
      { type: "next", slug, sessionId: id, now },
      topics,
    );
  }
  return state;
}
test("a passing retry completes the topic even after a failed session", () => {
  let state = finish(initialLearningState(), 10, "first");
  assert.equal(state.progress[slug].isCompleted, false);
  state = finish(state, 18, "second");
  assert.equal(state.progress[slug].isCompleted, true);
  assert.equal(state.progress[slug].lastScore, 90);
  assert.equal(state.progress[slug].correct, 28);
  assert.equal(state.progress[slug].total, 40);
  assert.equal(state.progress[slug].completedSessions, 2);
  state = finish(state, 3, "third");
  assert.equal(state.progress[slug].isCompleted, true);
  assert.equal(state.progress[slug].bestScore, 90);
});
test("15/20 fails; 16/20 passes; finishing twice is idempotent", () => {
  assert.equal(
    finish(initialLearningState(), 15, "fail").progress[slug].isCompleted,
    false,
  );
  const state = finish(initialLearningState(), 16, "pass");
  assert.equal(state.progress[slug].isCompleted, true);
  assert.deepEqual(
    reduceLearning(
      state,
      { type: "next", slug, sessionId: "pass", now },
      topics,
    ),
    state,
  );
});
test("reload preserves order, answer, index and totals without double-counting", () => {
  const session = createSession(topic, [], "resume");
  let state = reduceLearning(
    initialLearningState(),
    { type: "start", slug, session },
    topics,
  );
  const q = topic.quizItems.find((q) => q.id === session.itemIds[0]);
  const action = {
    type: "answer",
    slug,
    sessionId: session.id,
    itemId: q.id,
    choice: q.answerId,
    now,
  };
  state = reduceLearning(state, action, topics);
  const restored = restoreLearning(JSON.stringify(state), topics);
  assert.deepEqual(restored, state);
  assert.deepEqual(reduceLearning(restored, action, topics), state);
  assert.deepEqual(
    reduceLearning(state, { ...action, sessionId: "stale" }, topics),
    state,
  );
});
test("cannot skip unanswered items or replace an unfinished session", () => {
  const session = createSession(topic, [], "active");
  const state = reduceLearning(
    initialLearningState(),
    { type: "start", slug, session },
    topics,
  );
  assert.deepEqual(
    reduceLearning(
      state,
      { type: "next", slug, sessionId: "active", now },
      topics,
    ),
    state,
  );
  assert.deepEqual(
    reduceLearning(
      state,
      { type: "start", slug, session: createSession(topic, [], "replacement") },
      topics,
    ),
    state,
  );
});
test("new sessions balance skills, contain 20 different items and prioritise unseen items", () => {
  const first = createSession(topic, [], "a");
  const second = createSession(topic, first.itemIds, "b");
  assert.equal(new Set(first.itemIds).size, 20);
  assert.equal(
    second.itemIds.filter((id) => first.itemIds.includes(id)).length,
    0,
  );
  const counts = {};
  for (const id of first.itemIds) {
    const skill = topic.quizItems.find((q) => q.id === id).skill;
    counts[skill] = (counts[skill] ?? 0) + 1;
  }
  assert.deepEqual(Object.values(counts), [5, 5, 5, 5]);
});
test("reset clears only the selected topic", () => {
  const state = finish(initialLearningState(), 20, "one");
  state.progress[topics[1].slug] = { ...state.progress[slug] };
  const reset = reduceLearning(state, { type: "reset", slug }, topics);
  assert.equal(reset.progress[slug], undefined);
  assert.equal(reset.sessions[slug], undefined);
  assert.deepEqual(
    reset.progress[topics[1].slug],
    state.progress[topics[1].slug],
  );
});
test("corrupt and stale stored data cannot crash practice", () => {
  assert.deepEqual(restoreLearning("{broken", topics), initialLearningState());
  const state = finish(initialLearningState(), 20, "valid");
  state.sessions[slug].itemIds[0] = "removed-question";
  assert.equal(
    restoreLearning(JSON.stringify(state), topics).sessions[slug],
    undefined,
  );
  state.progress[slug].total = -1;
  assert.deepEqual(
    restoreLearning(JSON.stringify(state), topics),
    initialLearningState(),
  );
});

test("adding topics preserves existing completed progress and an unfinished session", () => {
  const before = topics.filter((t) =>
    t.provenance.version.startsWith("foundations-"),
  );
  let state = finish(initialLearningState(), 18, "previous-release");
  const session = createSession(
    topic,
    state.progress[slug].answeredItemIds,
    "unfinished",
  );
  state = reduceLearning(state, { type: "start", slug, session }, before);
  const q = topic.quizItems.find((q) => q.id === session.itemIds[0]);
  state = reduceLearning(
    state,
    {
      type: "answer",
      slug,
      sessionId: session.id,
      itemId: q.id,
      choice: q.answerId,
      now,
    },
    before,
  );
  assert.deepEqual(restoreLearning(JSON.stringify(state), topics), state);
  for (const added of topics.filter(
    (t) => !t.provenance.version.startsWith("foundations-"),
  )) {
    const next = createSession(added, [], added.slug);
    assert.equal(next.itemIds.length, 20);
    const skills = next.itemIds.map(
      (id) => added.quizItems.find((q) => q.id === id).skill,
    );
    assert.equal(new Set(skills).size, 4);
    for (const skill of new Set(skills))
      assert.equal(skills.filter((s) => s === skill).length, 5);
  }
});
