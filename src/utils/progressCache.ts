import type { GrammarTopic } from "../types/grammar";
import {
  initialLearningState,
  restoreLearning,
  type LearningState,
  type PracticeSession,
} from "./learningState";
import {
  compactAttemptEvents,
  legacyImportEvents,
  projectEvents,
  reconcilePendingAttempts,
  type CourseId,
  type ProgressEvent,
} from "./accountProgress";

export type ProgressCourse = {
  id: CourseId;
  topics: GrammarTopic[];
  catalogVersion: string;
  progressVersion: string;
};
export type ProgressCourses = Record<CourseId, ProgressCourse>;
type CourseValues<T> = Record<CourseId, T>;
export type ProgressCache = {
  version: 2;
  owner: string | null;
  states: CourseValues<LearningState>;
  guestBaselines: CourseValues<LearningState>;
  importChoices: CourseValues<"pending" | "imported" | "declined">;
  importIds: CourseValues<string>;
  discardedSessions: CourseValues<string[]>;
  events: ProgressEvent[];
  outbox: ProgressEvent[];
  cursor: number;
  accountEpoch: string | null;
};
export type SyncResult = {
  accountId: string;
  accountEpoch: string;
  revision: number;
  cursor: number;
  hasMore: boolean;
  acceptedEventIds: string[];
  events: ProgressEvent[];
};
export const courseIds: CourseId[] = ["en", "es"];
export const guestStateKey = (course: ProgressCourse) =>
  `grammacho-web-progress:${course.progressVersion}`;
export const guestClaimKey = (course: ProgressCourse) =>
  `grammacho-web-import-owner:${course.progressVersion}`;
// Retain the original English ledger/account keys. Version 1 is migrated in place.
export const progressCacheKey = (
  owner: string | null,
  courses: ProgressCourses,
) =>
  owner
    ? `grammacho-web-account:${owner}`
    : `grammacho-web-guest-ledger:${courses.en.progressVersion}`;
export const emptyCache = (owner: string | null): ProgressCache => ({
  version: 2,
  owner,
  states: { en: initialLearningState(), es: initialLearningState() },
  guestBaselines: { en: initialLearningState(), es: initialLearningState() },
  importChoices: { en: "pending", es: "pending" },
  importIds: { en: crypto.randomUUID(), es: crypto.randomUUID() },
  discardedSessions: { en: [], es: [] },
  events: [],
  outbox: [],
  cursor: 0,
  accountEpoch: null,
});
export const mergeEvents = (
  existing: ProgressEvent[],
  incoming: ProgressEvent[],
) =>
  compactAttemptEvents([
    ...new Map(
      [...existing, ...incoming].map((event) => [event.id, event]),
    ).values(),
  ]);
export const optimisticEvents = (events: ProgressEvent[]) =>
  events.map((event) =>
    event.kind === "topic-reset"
      ? { ...event, generation: event.generation + 1 }
      : event,
  );
export const eventsOf = (cache: ProgressCache) =>
  mergeEvents(cache.events, optimisticEvents(cache.outbox));
export const projectionOf = (
  cache: ProgressCache,
  courses: ProgressCourses,
  id: CourseId,
) =>
  projectEvents(
    [
      ...(!cache.owner
        ? legacyImportEvents(
            cache.guestBaselines[id],
            {},
            courses[id].catalogVersion,
            cache.importIds[id],
            new Date(0).toISOString(),
            id,
          )
        : []),
      ...eventsOf(cache),
    ],
    courses[id].topics,
    id,
  );

/** Both local caches and server pages must name this exact bundled catalog. */
export function plausibleEvent(
  value: unknown,
  courses: ProgressCourses,
): value is ProgressEvent {
  if (!value || typeof value !== "object") return false;
  const event = value as ProgressEvent;
  if (
    !courseIds.includes(event.courseId) ||
    typeof event.id !== "string" ||
    !event.id ||
    typeof event.topicSlug !== "string" ||
    !Number.isSafeInteger(event.generation) ||
    event.generation < 0 ||
    typeof event.occurredAt !== "string" ||
    !event.payload ||
    typeof event.payload !== "object" ||
    Array.isArray(event.payload)
  )
    return false;
  const course = courses[event.courseId];
  const topic = course.topics.find((topic) => topic.slug === event.topicSlug);
  if (!topic || event.catalogVersion !== course.catalogVersion) return false;
  const attemptValid = (attempt: PracticeSession) => {
    if (
      !attempt ||
      typeof attempt !== "object" ||
      typeof attempt.id !== "string" ||
      !attempt.id ||
      !Array.isArray(attempt.itemIds) ||
      attempt.itemIds.length !== 20 ||
      new Set(attempt.itemIds).size !== 20 ||
      !attempt.itemIds.every((id) =>
        topic.quizItems.some((item) => item.id === id),
      ) ||
      !Array.isArray(attempt.answers) ||
      !Number.isInteger(attempt.index) ||
      attempt.index < 0 ||
      attempt.index >= 20 ||
      typeof attempt.complete !== "boolean" ||
      attempt.answers.length < attempt.index ||
      attempt.answers.length > attempt.index + 1
    )
      return false;
    if (
      !attempt.answers.every(
        (answer, index) =>
          answer &&
          answer.itemId === attempt.itemIds[index] &&
          ["A", "B", "C", "D"].includes(answer.selectedAnswer),
      )
    )
      return false;
    return (
      !attempt.complete ||
      (attempt.index === 19 && attempt.answers.length === 20)
    );
  };
  if (event.kind === "attempt")
    return attemptValid(event.payload as PracticeSession);
  if (event.kind === "legacy-import" && "progress" in event.payload) {
    const { progress, attempt } = event.payload;
    return Boolean(
      progress &&
        Number.isSafeInteger(progress.total) &&
        progress.total >= 0 &&
        Number.isSafeInteger(progress.correct) &&
        progress.correct >= 0 &&
        progress.correct <= progress.total &&
        (!attempt || attemptValid(attempt)),
    );
  }
  return (
    event.kind === "topic-reset" ||
    (event.kind === "mistake-review" &&
      "mistakeId" in event.payload &&
      typeof event.payload.mistakeId === "string")
  );
}

export function readProgressCache(
  storage: Pick<Storage, "getItem">,
  owner: string | null,
  courses: ProgressCourses,
): ProgressCache {
  const blank = emptyCache(owner);
  const raw = storage.getItem(progressCacheKey(owner, courses));
  if (raw) {
    const value = JSON.parse(raw);
    const v2 = value?.version === 2 && value.owner === owner;
    const v1 = value?.version === 1;
    if (
      (!v1 && !v2) ||
      !Array.isArray(value.events) ||
      !Array.isArray(value.outbox) ||
      !Number.isSafeInteger(value.cursor) ||
      value.cursor < 0
    )
      throw new Error("Saved progress could not be read safely.");
    const next: ProgressCache = {
      ...blank,
      events: value.events.filter((event: unknown) =>
        plausibleEvent(event, courses),
      ),
      outbox: owner
        ? value.outbox.filter((event: unknown) =>
            plausibleEvent(event, courses),
          )
        : [],
      cursor: owner ? value.cursor : 0,
      accountEpoch:
        owner && typeof value.accountEpoch === "string"
          ? value.accountEpoch
          : null,
    };
    for (const id of courseIds) {
      const state = v2
        ? value.states?.[id]
        : id === "en"
          ? value.state
          : undefined;
      const baseline = v2
        ? value.guestBaselines?.[id]
        : id === "en"
          ? value.guestBaseline
          : undefined;
      next.states[id] = restoreLearning(
        state
          ? JSON.stringify(state)
          : owner
            ? null
            : storage.getItem(guestStateKey(courses[id])),
        courses[id].topics,
      );
      next.guestBaselines[id] = restoreLearning(
        baseline ? JSON.stringify(baseline) : null,
        courses[id].topics,
      );
      const choice = v2
        ? value.importChoices?.[id]
        : id === "en"
          ? value.importChoice
          : undefined;
      if (["pending", "imported", "declined"].includes(choice))
        next.importChoices[id] = choice;
      const importId = v2
        ? value.importIds?.[id]
        : id === "en"
          ? value.importId
          : undefined;
      if (typeof importId === "string" && importId)
        next.importIds[id] = importId;
      if (v2 && Array.isArray(value.discardedSessions?.[id]))
        next.discardedSessions[id] = value.discardedSessions[id].filter(
          (value: unknown) => typeof value === "string",
        );
    }
    // Old web accounts already cached Spanish events downloaded from native.
    // Restore that course from the shared ledger without altering English state.
    if (owner && v1) {
      const spanish = projectEvents(eventsOf(next), courses.es.topics, "es");
      next.states.es = {
        ...next.states.es,
        progress: spanish.progress,
        sessions: spanish.sessions,
      };
    }
    return next;
  }
  if (!owner)
    for (const id of courseIds) {
      const state = restoreLearning(
        storage.getItem(guestStateKey(courses[id])),
        courses[id].topics,
      );
      blank.states[id] = state;
      blank.guestBaselines[id] = state;
    }
  return blank;
}

export function writeProgressCache(
  storage: Pick<Storage, "setItem">,
  cache: ProgressCache,
  courses: ProgressCourses,
) {
  storage.setItem(
    progressCacheKey(cache.owner, courses),
    JSON.stringify(cache),
  );
  // Keep the existing guest state keys compatible. Account state never uses them.
  if (!cache.owner)
    for (const id of courseIds)
      storage.setItem(
        guestStateKey(courses[id]),
        JSON.stringify(cache.states[id]),
      );
}

export function mergeSyncResult(
  cache: ProgressCache,
  result: SyncResult,
  courses: ProgressCourses,
) {
  if (
    result.accountId !== cache.owner ||
    typeof result.accountEpoch !== "string" ||
    !result.accountEpoch ||
    !Array.isArray(result.events) ||
    !result.events.every((event) => plausibleEvent(event, courses)) ||
    !Array.isArray(result.acceptedEventIds) ||
    !result.acceptedEventIds.every((id) => typeof id === "string") ||
    !Number.isSafeInteger(result.cursor) ||
    result.cursor < 0 ||
    typeof result.hasMore !== "boolean"
  )
    throw new Error("The account response could not be verified.");
  const epochChanged = Boolean(
    cache.accountEpoch && cache.accountEpoch !== result.accountEpoch,
  );
  const base = epochChanged ? emptyCache(cache.owner) : cache;
  const accepted = new Set(result.acceptedEventIds);
  // Keep acknowledged payloads until their canonical page arrives.
  const acknowledged = optimisticEvents(
    base.outbox.filter((event) => accepted.has(event.id)),
  );
  const events = mergeEvents(
    mergeEvents(base.events, acknowledged),
    result.events,
  );
  const reconciled = reconcilePendingAttempts(
    base.outbox.filter((event) => !accepted.has(event.id)),
    events,
  );
  const next: ProgressCache = {
    ...base,
    states: { ...base.states },
    events,
    outbox: reconciled.events,
    cursor: result.cursor,
    accountEpoch: result.accountEpoch,
  };
  for (const id of courseIds) {
    const previous = projectEvents(eventsOf(base), courses[id].topics, id);
    const projected = projectEvents(eventsOf(next), courses[id].topics, id);
    const sessions = { ...projected.sessions };
    for (const [slug, local] of Object.entries(base.states[id].sessions)) {
      if (
        (previous.generations[slug] ?? 0) !==
          (projected.generations[slug] ?? 0) ||
        local.complete ||
        reconciled.conflictedAttemptIds.has(local.id)
      )
        continue;
      const remote = sessions[slug];
      if (
        !remote ||
        remote.id !== local.id ||
        (local.answers.length >= remote.answers.length &&
          local.index >= remote.index &&
          !remote.complete)
      )
        sessions[slug] = local;
    }
    for (const [slug, session] of Object.entries(sessions))
      if (base.discardedSessions[id].includes(session.id))
        delete sessions[slug];
    next.states[id] = {
      ...base.states[id],
      progress: projected.progress,
      sessions,
    };
  }
  return {
    cache: next,
    epochChanged,
    conflicted: reconciled.conflictedAttemptIds.size > 0,
  };
}

export function retireStaleOutbox(
  cache: ProgressCache,
  courses: ProgressCourses,
): ProgressCache {
  const generations = {
    en: projectEvents(cache.events, courses.en.topics, "en").generations,
    es: projectEvents(cache.events, courses.es.topics, "es").generations,
  };
  const outbox = cache.outbox.filter(
    (event) =>
      event.generation >= (generations[event.courseId][event.topicSlug] ?? 0),
  );
  return outbox.length === cache.outbox.length ? cache : { ...cache, outbox };
}
