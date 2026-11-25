const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const { createSession, initialLearningState, reduceLearning } = require(
  path.join(process.env.LEARNING_BUILD_DIR, "utils/learningState.js"),
);
const {
  snapshotEvent,
  legacyImportEvents,
  survivingGuestImport,
  projectEvents,
} = require(
  path.join(process.env.LEARNING_BUILD_DIR, "utils/accountProgress.js"),
);
const {
  emptyCache,
  eventsOf,
  guestStateKey,
  progressCacheKey,
  projectionOf,
  readProgressCache,
  writeProgressCache,
  mergeSyncResult,
  retireStaleOutbox,
} = require(
  path.join(process.env.LEARNING_BUILD_DIR, "utils/progressCache.js"),
);
const english = require("../src/generated/catalog.json");
const spanish = require("../src/generated/catalog-es.json");
const courses = {
  en: {
    id: "en",
    topics: english.topics,
    catalogVersion: english.version,
    progressVersion: english.progressVersion,
  },
  es: {
    id: "es",
    topics: spanish.topics,
    catalogVersion: spanish.version,
    progressVersion: spanish.progressVersion,
  },
};
const now = "2026-11-24T12:00:00.000Z";
const storage = () => {
  const values = new Map();
  return {
    values,
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
  };
};
const attempt = (id, courseId, correct = false, complete = false) => {
  const topic = courses[courseId].topics[0];
  const session = createSession(topic, [], id);
  session.answers = (
    complete ? session.itemIds : session.itemIds.slice(0, 1)
  ).map((itemId) => {
    const item = topic.quizItems.find((item) => item.id === itemId);
    return {
      itemId,
      selectedAnswer: correct
        ? item.answerId
        : item.choices.find((choice) => choice.id !== item.answerId).id,
    };
  });
  session.index = complete ? 19 : 0;
  session.complete = complete;
  return snapshotEvent(
    session,
    topic.slug,
    0,
    courses[courseId].catalogVersion,
    now,
    courseId,
  );
};
const envelope = (events, overrides = {}) => ({
  accountId: "learner-a",
  accountEpoch: "epoch-a",
  revision: 2,
  cursor: 2,
  hasMore: false,
  acceptedEventIds: [],
  events,
  ...overrides,
});

test("original English guest state and ledger migrate without losing answers, active chapter or consent identity", () => {
  const store = storage();
  const topic = english.topics[0];
  let state = reduceLearning(
    initialLearningState(),
    { type: "select", slug: topic.slug },
    english.topics,
  );
  const event = attempt("old-browser", "en", false);
  state = reduceLearning(
    state,
    {
      type: "start",
      slug: topic.slug,
      session: { ...event.payload, answers: [] },
    },
    english.topics,
  );
  state = reduceLearning(
    state,
    {
      type: "answer",
      slug: topic.slug,
      sessionId: event.payload.id,
      itemId: event.payload.itemIds[0],
      choice: event.payload.answers[0].selectedAnswer,
      now,
    },
    english.topics,
  );
  store.setItem(guestStateKey(courses.en), JSON.stringify(state));
  const fallback = readProgressCache(store, null, courses);
  assert.deepEqual(fallback.states.en, state);
  assert.deepEqual(fallback.guestBaselines.en, state);
  assert.deepEqual(fallback.states.es, initialLearningState());
  store.setItem(
    progressCacheKey(null, courses),
    JSON.stringify({
      version: 1,
      state,
      guestBaseline: initialLearningState(),
      events: [event],
      outbox: [],
      cursor: 0,
      importId: "old-import",
      importChoice: "pending",
      accountEpoch: null,
    }),
  );
  const migrated = readProgressCache(store, null, courses);
  assert.deepEqual(migrated.states.en, state);
  assert.equal(migrated.importIds.en, "old-import");
  assert.equal(projectionOf(migrated, courses, "en").mistakes.length, 1);
  writeProgressCache(store, migrated, courses);
  assert.deepEqual(readProgressCache(store, null, courses), migrated);
  assert.deepEqual(JSON.parse(store.getItem(guestStateKey(courses.en))), state);
});

test("English v1 account cache retains its cursor, epoch, pending writes and downloaded Spanish native attempt", () => {
  const store = storage();
  const en = attempt("old-en", "en");
  const es = attempt("native-es", "es");
  store.setItem(
    progressCacheKey("learner-a", courses),
    JSON.stringify({
      version: 1,
      state: initialLearningState(),
      events: [en, { ...es, sequence: 8 }],
      outbox: [attempt("offline-en", "en")],
      cursor: 8,
      accountEpoch: "epoch-a",
      importChoice: "declined",
      importId: "old-claim",
    }),
  );
  const cache = readProgressCache(store, "learner-a", courses);
  assert.equal(cache.cursor, 8);
  assert.equal(cache.accountEpoch, "epoch-a");
  assert.equal(cache.outbox.length, 1);
  assert.equal(cache.importChoices.en, "declined");
  assert.equal(cache.importChoices.es, "pending");
  assert.equal(cache.states.es.sessions[es.topicSlug].id, "native-es");
  assert.equal(cache.states.es.progress[es.topicSlug].total, 1);
  assert.deepEqual(readProgressCache(store, "learner-b", courses).events, []);
});

test("shared account sync projects both courses and rejects a different verified account or mismatched catalog", () => {
  const base = emptyCache("learner-a");
  const en = attempt("en-device", "en");
  const es = attempt("es-device", "es");
  const { cache } = mergeSyncResult(
    base,
    envelope([
      { ...en, sequence: 1 },
      { ...es, sequence: 2 },
    ]),
    courses,
  );
  assert.equal(cache.states.en.progress[en.topicSlug].total, 1);
  assert.equal(cache.states.es.progress[es.topicSlug].total, 1);
  assert.equal(projectionOf(cache, courses, "en").mistakes.length, 1);
  assert.equal(projectionOf(cache, courses, "es").mistakes.length, 1);
  assert.throws(
    () =>
      mergeSyncResult(cache, envelope([], { accountId: "learner-b" }), courses),
    /verified/,
  );
  assert.throws(
    () =>
      mergeSyncResult(cache, envelope([{ ...es, courseId: "en" }]), courses),
    /verified/,
  );
  assert.throws(
    () =>
      mergeSyncResult(
        cache,
        envelope([{ ...es, catalogVersion: "other" }]),
        courses,
      ),
    /verified/,
  );
  const store = storage();
  store.setItem(progressCacheKey("learner-b", courses), JSON.stringify(cache));
  assert.throws(() => readProgressCache(store, "learner-b", courses), /safely/);
});

test("an account epoch change clears both courses and all queued writes before accepting fresh learning", () => {
  let base = mergeSyncResult(
    emptyCache("learner-a"),
    envelope([attempt("en-old", "en"), attempt("es-old", "es")]),
    courses,
  ).cache;
  base.outbox = [attempt("en-offline", "en"), attempt("es-offline", "es")];
  base.importChoices = { en: "imported", es: "declined" };
  const fresh = attempt("es-fresh", "es", true);
  const result = mergeSyncResult(
    base,
    envelope([fresh], { accountEpoch: "epoch-b", cursor: 1 }),
    courses,
  );
  assert.equal(result.epochChanged, true);
  assert.deepEqual(result.cache.states.en.progress, {});
  assert.equal(result.cache.states.es.sessions[fresh.topicSlug].id, "es-fresh");
  assert.deepEqual(result.cache.outbox, []);
  assert.equal(result.cache.accountEpoch, "epoch-b");
});

test("topic resets retire only that course's old queued attempt, including when the other course is currently selected", () => {
  const en = attempt("en-keep", "en");
  const es = attempt("es-retire", "es");
  const reset = {
    id: "es-reset",
    courseId: "es",
    catalogVersion: spanish.version,
    topicSlug: es.topicSlug,
    generation: 1,
    kind: "topic-reset",
    occurredAt: now,
    payload: {},
    sequence: 3,
  };
  const base = {
    ...emptyCache("learner-a"),
    accountEpoch: "epoch-a",
    events: [reset],
    outbox: [en, es],
  };
  const next = retireStaleOutbox(base, courses);
  assert.deepEqual(
    next.outbox.map((event) => event.id),
    [en.id],
  );
  assert.deepEqual(
    projectEvents(eventsOf(next), spanish.topics, "es").progress,
    {},
  );
});

test("a paginated acknowledgement retains a Spanish attempt until its canonical page arrives", () => {
  const es = attempt("es-pending", "es");
  const base = {
    ...emptyCache("learner-a"),
    accountEpoch: "epoch-a",
    outbox: [es],
  };
  const first = mergeSyncResult(
    base,
    envelope([], { acceptedEventIds: [es.id], hasMore: true, cursor: 10 }),
    courses,
  ).cache;
  assert.equal(first.outbox.length, 0);
  assert.equal(first.states.es.progress[es.topicSlug].total, 1);
  const second = mergeSyncResult(
    first,
    envelope([{ ...es, sequence: 11 }], { cursor: 11 }),
    courses,
  ).cache;
  assert.equal(second.states.es.progress[es.topicSlug].total, 1);
  assert.equal(second.events.filter((event) => event.id === es.id).length, 1);
});

test("course-scoped guest consent imports Spanish only and maps its surviving reset generation", () => {
  const en = attempt("guest-en", "en");
  const esOld = attempt("guest-es-old", "es");
  const es = { ...attempt("guest-es-current", "es"), generation: 2 };
  const reset = {
    id: "guest-reset",
    courseId: "es",
    catalogVersion: spanish.version,
    topicSlug: es.topicSlug,
    generation: 2,
    kind: "topic-reset",
    occurredAt: now,
    payload: {},
  };
  const imported = survivingGuestImport(
    initialLearningState(),
    [en, esOld, reset, es],
    { [es.topicSlug]: 4 },
    spanish.version,
    "consented-es",
    now,
    "es",
  );
  assert.equal(imported.length, 1);
  assert.equal(imported[0].courseId, "es");
  assert.equal(imported[0].generation, 4);
  assert.equal(imported[0].payload.id, "guest-es-current");
});

test("course-specific baselines preserve aggregate totals and known mistakes without inventing old answers", () => {
  const es = attempt("legacy-spanish", "es");
  const topic = spanish.topics[0];
  const baseline = {
    ...initialLearningState(),
    progress: {
      [topic.slug]: {
        correct: 30,
        total: 40,
        bestScore: 80,
        lastScore: 70,
        completedSessions: 2,
        isCompleted: true,
        updatedAt: now,
      },
    },
    sessions: { [topic.slug]: es.payload },
  };
  const events = legacyImportEvents(
    baseline,
    {},
    spanish.version,
    "es-baseline",
    now,
    "es",
  );
  const projected = projectEvents(events, spanish.topics, "es");
  assert.equal(events[0].courseId, "es");
  assert.equal(projected.progress[topic.slug].total, 40);
  assert.equal(projected.progress[topic.slug].correct, 30);
  assert.equal(projected.mistakes.length, 1);
  assert.deepEqual(projectEvents(events, english.topics, "en").progress, {});
});

test("completed Spanish sessions use the same 16-of-20 pass rule and unfinished state remains course-specific on reload", () => {
  const es = attempt("complete-es", "es", true, true);
  const en = attempt("unfinished-en", "en");
  const { cache } = mergeSyncResult(
    emptyCache("learner-a"),
    envelope([en, es]),
    courses,
  );
  assert.equal(cache.states.es.progress[es.topicSlug].isCompleted, true);
  assert.equal(cache.states.es.progress[es.topicSlug].bestScore, 100);
  assert.equal(cache.states.en.sessions[en.topicSlug].complete, false);
  const store = storage();
  writeProgressCache(store, cache, courses);
  const restored = readProgressCache(store, "learner-a", courses);
  assert.equal(restored.states.en.sessions[en.topicSlug].id, "unfinished-en");
  assert.equal(restored.states.es.sessions[es.topicSlug].id, "complete-es");
  assert.equal(store.getItem(guestStateKey(courses.en)), null);
  assert.equal(store.getItem(guestStateKey(courses.es)), null);
});

test("discarded Spanish sessions do not reappear during account sync and English sessions remain resumable", () => {
  const en = attempt("resume-en", "en");
  const es = attempt("discard-es", "es");
  let { cache } = mergeSyncResult(
    emptyCache("learner-a"),
    envelope([en, es]),
    courses,
  );
  cache = {
    ...cache,
    discardedSessions: { en: [], es: [es.payload.id] },
    states: { ...cache.states, es: { ...cache.states.es, sessions: {} } },
  };
  cache = mergeSyncResult(cache, envelope([en, es]), courses).cache;
  assert.equal(cache.states.en.sessions[en.topicSlug].id, "resume-en");
  assert.equal(cache.states.es.sessions[es.topicSlug], undefined);
  assert.equal(cache.states.es.progress[es.topicSlug].total, 1);
});
