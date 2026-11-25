const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const {
  COURSE_STORAGE_KEY,
  resolveInitialCourseId,
  hasExistingEnglishLearning,
} = require(
  path.join(process.env.LEARNING_BUILD_DIR, "utils/courseSelection.js"),
);
const version = require("../src/generated/catalog.json").progressVersion;
const storage = (entries) => ({
  getItem: (key) => entries[key] ?? null,
  key: (index) => Object.keys(entries)[index] ?? null,
  length: Object.keys(entries).length,
});

test("new browsers start in Spanish and an explicit course choice wins over English history", () => {
  assert.equal(resolveInitialCourseId(version, storage({})), "es");
  assert.equal(
    resolveInitialCourseId(
      version,
      storage({
        [COURSE_STORAGE_KEY]: "es",
        [`grammacho-web-progress:${version}`]: "old",
      }),
    ),
    "es",
  );
  assert.equal(
    resolveInitialCourseId(version, storage({ [COURSE_STORAGE_KEY]: "en" })),
    "en",
  );
});
test("existing English guest, old prototype and verified-account caches retain English on upgrade", () => {
  for (const [key, value] of [
    [
      `grammacho-web-progress:${version}`,
      JSON.stringify({
        activeSlug: "sentence-basics",
        progress: {},
        sessions: {},
      }),
    ],
    [`grammacho-web-guest-ledger:${version}`, JSON.stringify({ version: 1 })],
    ["grammar-app-progress-v2", "saved"],
    ["grammacho-web-account:learner", JSON.stringify({ version: 1 })],
  ]) {
    assert.equal(
      resolveInitialCourseId(version, storage({ [key]: value })),
      "en",
    );
  }
});
test("empty v2 welcome mirrors do not change Spanish defaults or imply previous learning", () => {
  const blank = { version: 1, activeSlug: "", progress: {}, sessions: {} };
  const entries = {
    [`grammacho-web-progress:${version}`]: JSON.stringify(blank),
    [`grammacho-web-guest-ledger:${version}`]: JSON.stringify({
      version: 2,
      states: { en: blank, es: blank },
    }),
    "grammacho-web-account:learner": JSON.stringify({
      version: 2,
      states: { en: blank, es: { ...blank, activeSlug: "es-stress" } },
    }),
  };
  assert.equal(hasExistingEnglishLearning(version, storage(entries)), false);
  assert.equal(resolveInitialCourseId(version, storage(entries)), "es");
});
test("blocked storage getters are caught before app initialization and invalid course choices are ignored", () => {
  assert.equal(
    resolveInitialCourseId(version, {
      getItem() {
        throw new Error("blocked");
      },
      key() {
        return null;
      },
      length: 0,
    }),
    "es",
  );
  const original = Object.getOwnPropertyDescriptor(globalThis, "localStorage");
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    get() {
      throw new Error("opaque origin");
    },
  });
  try {
    assert.equal(resolveInitialCourseId(version), "es");
  } finally {
    if (original) Object.defineProperty(globalThis, "localStorage", original);
    else delete globalThis.localStorage;
  }
  assert.equal(
    resolveInitialCourseId(version, storage({ [COURSE_STORAGE_KEY]: "fr" })),
    "es",
  );
});
