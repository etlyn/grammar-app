import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { courses, type CourseId } from "../services/contentService";
import {
  createSession,
  reduceLearning,
  type LearningAction,
} from "../utils/learningState";
import type { QuizChoice, ProgressByTopic } from "../types/grammar";
import {
  projectEvents,
  snapshotEvent,
  survivingGuestImport,
  type ProgressEvent,
} from "../utils/accountProgress";
import {
  emptyCache,
  eventsOf,
  guestClaimKey,
  mergeEvents,
  mergeSyncResult,
  projectionOf,
  readProgressCache,
  retireStaleOutbox,
  writeProgressCache,
  type ProgressCache,
  type SyncResult,
} from "../utils/progressCache";
import { shuffle } from "../utils/quiz";
import { accountFetchFor, isCurrentAccount } from "../lib/account";

const load = (owner: string | null) => {
  try {
    return {
      cache: readProgressCache(localStorage, owner, courses),
      error: "",
    };
  } catch {
    return {
      cache: emptyCache(owner),
      error:
        "Saved progress could not be read safely. Existing browser data was kept. Enable browser storage or reload before changing learning.",
    };
  }
};
const totalsOf = (progress: ProgressByTopic) => {
  const values = Object.values(progress);
  const totalAnswers = values.reduce((sum, value) => sum + value.total, 0);
  const correctAnswers = values.reduce((sum, value) => sum + value.correct, 0);
  return {
    completedTopics: values.filter((value) => value.isCompleted).length,
    totalAnswers,
    correctAnswers,
    accuracy: totalAnswers
      ? Math.round((correctAnswers / totalAnswers) * 100)
      : 0,
  };
};

/** Mount this workspace by verified provider subject. Course changes select a
 * projection of the same ledger, preserving its account epoch, cursor and sync. */
export function useProgress(
  owner: string | null = null,
  courseId: CourseId = "en",
) {
  const course = courses[courseId];
  const [loaded] = useState(() => load(owner));
  const [cache, setCache] = useState(loaded.cache);
  const current = useRef(cache);
  const [storageMessage, setStorageMessage] = useState(loaded.error);
  const [syncMessage, setSyncMessage] = useState("");
  const [syncing, setSyncing] = useState(false);
  const [syncReady, setSyncReady] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [syncRevision, setSyncRevision] = useState(0);
  const [legacyProgress] = useState(() => {
    try {
      return Boolean(localStorage.getItem("grammar-app-progress-v2"));
    } catch {
      return false;
    }
  });
  const active = useRef(true);
  const inFlight = useRef(false);
  const deleting = useRef(false);
  const persist = useCallback(
    (next: ProgressCache) => {
      if (!active.current || loaded.error || next.owner !== owner) return;
      current.current = next;
      setCache(next);
      try {
        writeProgressCache(localStorage, next, courses);
        setStorageMessage("");
      } catch {
        setStorageMessage(
          "Your browser could not save progress. Keep this page open; unsynced work may be lost if you close it.",
        );
      }
    },
    [owner, loaded.error],
  );
  useEffect(() => {
    active.current = true;
    persist(current.current);
    return () => {
      active.current = false;
    };
  }, [persist]);

  const projection = useMemo(
    () => projectionOf(cache, courses, courseId),
    [cache, courseId],
  );

  const sync = useCallback(async () => {
    if (!owner || inFlight.current || !navigator.onLine || loaded.error) return;
    inFlight.current = true;
    setSyncing(true);
    const fetchAccount = accountFetchFor(owner);
    let reconciliation = "";
    const accept = (result: SyncResult) => {
      if (!active.current) return false;
      const merged = mergeSyncResult(current.current, result, courses);
      if (merged.epochChanged)
        reconciliation =
          "Your Grammacho account data was reset elsewhere. Older queued work in both courses was not restored.";
      if (merged.conflicted)
        reconciliation =
          "An answer was already checked on another device. That saved answer was kept; your other learning is unchanged.";
      persist(merged.cache);
      return true;
    };
    const request = async (
      method: "GET" | "POST",
      retryCursor = true,
    ): Promise<SyncResult> => {
      const value = current.current;
      const response = await fetchAccount(
        `/api/grammacho/v1/progress${method === "GET" ? `?after=${value.cursor}&limit=200` : ""}`,
        method === "GET"
          ? { cache: "no-store" }
          : {
              method,
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                accountEpoch: value.accountEpoch,
                after: value.cursor,
                events: value.outbox.slice(0, 100),
              }),
            },
      );
      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as {
          detail?: string | { code?: string };
        } | null;
        const detail =
          typeof body?.detail === "string" ? body.detail : body?.detail?.code;
        if (
          response.status === 409 &&
          detail === "progress_cursor_changed" &&
          method === "GET" &&
          retryCursor &&
          active.current
        ) {
          persist({ ...current.current, cursor: 0 });
          return request("GET", false);
        }
        if (
          response.status === 409 &&
          [
            "topic_generation_changed",
            "account_epoch_changed",
            "checked_answer_changed",
            "attempt_questions_changed",
          ].includes(detail ?? "")
        )
          throw new Error(detail);
        throw new Error(
          response.status === 401
            ? "Sign in again to sync your progress."
            : "Your progress is saved on this browser. Sync is temporarily unavailable.",
        );
      }
      return (await response.json()) as SyncResult;
    };
    const retire = () => {
      const next = retireStaleOutbox(current.current, courses);
      if (next !== current.current) {
        persist(next);
        reconciliation =
          "A chapter was reset on another device. Older queued answers were not restored.";
      }
    };
    try {
      let result = await request("GET");
      while (active.current && accept(result) && result.hasMore)
        result = await request("GET");
      if (!active.current) return;
      setSyncReady(true);
      retire();
      let conflictRetried = false;
      while (active.current && current.current.outbox.length) {
        try {
          result = await request("POST");
        } catch (error) {
          if (
            !conflictRetried &&
            error instanceof Error &&
            [
              "topic_generation_changed",
              "account_epoch_changed",
              "checked_answer_changed",
              "attempt_questions_changed",
            ].includes(error.message)
          ) {
            conflictRetried = true;
            persist({ ...current.current, cursor: 0 });
            result = await request("GET");
            while (active.current && accept(result) && result.hasMore)
              result = await request("GET");
            if (!active.current) return;
            retire();
            continue;
          }
          throw error;
        }
        if (!accept(result)) return;
        while (active.current && result.hasMore) {
          result = await request("GET");
          if (!accept(result)) return;
        }
      }
      if (active.current)
        setSyncMessage(reconciliation || "Progress synced to your account.");
    } catch (error) {
      if (active.current)
        setSyncMessage(
          error instanceof Error
            ? error.message
            : "Your progress is saved here. Sync will retry when you reconnect.",
        );
    } finally {
      inFlight.current = false;
      if (active.current) setSyncing(false);
    }
  }, [owner, persist, loaded.error]);
  useEffect(() => {
    if (!owner) return;
    void sync();
    const retry = () => {
      void sync();
    };
    window.addEventListener("online", retry);
    window.addEventListener("focus", retry);
    return () => {
      window.removeEventListener("online", retry);
      window.removeEventListener("focus", retry);
    };
  }, [owner, sync, syncRevision]);

  const append = useCallback(
    (before: ProgressCache, additions: ProgressEvent[]) =>
      owner
        ? { ...before, outbox: mergeEvents(before.outbox, additions) }
        : { ...before, events: mergeEvents(before.events, additions) },
    [owner],
  );
  const dispatch = useCallback(
    (action: LearningAction) => {
      const before = current.current;
      if (deleting.current || loaded.error) return;
      if (owner && !before.accountEpoch && action.type !== "select") {
        setSyncMessage(
          "Connect once to load this account’s learning before starting practice. You can sign out to keep learning as a guest.",
        );
        return;
      }
      if (
        owner &&
        action.type !== "select" &&
        before.outbox.some(
          (event) =>
            event.courseId === courseId &&
            event.topicSlug === action.slug &&
            event.kind === "topic-reset",
        )
      ) {
        setSyncMessage(
          "This chapter reset is waiting for sync. Reconnect before starting a new session.",
        );
        return;
      }
      const state = reduceLearning(
        before.states[courseId],
        action,
        course.topics,
      );
      if (state === before.states[courseId]) return;
      const now = "now" in action ? action.now : new Date().toISOString();
      const projected = projectionOf(before, courses, courseId);
      const generation = projected.generations[action.slug] ?? 0;
      const additions: ProgressEvent[] = [];
      if (
        action.type === "start" ||
        action.type === "answer" ||
        action.type === "next"
      ) {
        additions.push(
          snapshotEvent(
            state.sessions[action.slug],
            action.slug,
            generation,
            course.catalogVersion,
            now,
            courseId,
          ),
        );
        if (
          action.type === "answer" &&
          course.topics
            .find((topic) => topic.slug === action.slug)
            ?.quizItems.find((item) => item.id === action.itemId)?.answerId ===
            action.choice
        ) {
          for (const mistake of projected.mistakes.filter(
            (mistake) =>
              mistake.itemId === action.itemId &&
              !mistake.id.startsWith(`${action.sessionId}:`),
          )) {
            additions.push({
              id: crypto.randomUUID(),
              courseId,
              catalogVersion: course.catalogVersion,
              topicSlug: action.slug,
              generation,
              kind: "mistake-review",
              occurredAt: now,
              payload: { mistakeId: mistake.id },
            });
          }
        }
      }
      if (action.type === "reset")
        additions.push({
          id: crypto.randomUUID(),
          courseId,
          catalogVersion: course.catalogVersion,
          topicSlug: action.slug,
          generation: generation + Number(!owner),
          kind: "topic-reset",
          occurredAt: now,
          payload: {},
        });
      persist(
        append(
          { ...before, states: { ...before.states, [courseId]: state } },
          additions,
        ),
      );
      if (owner && additions.length) setSyncRevision((value) => value + 1);
    },
    [owner, persist, append, course, courseId, loaded.error],
  );
  const selectTopic = useCallback(
    (slug: string) => dispatch({ type: "select", slug }),
    [dispatch],
  );
  const start = useCallback(
    (slug: string, focused: boolean) => {
      const topic = course.topics.find((value) => value.slug === slug);
      if (!topic) return;
      const session = createSession(
        topic,
        current.current.states[courseId].progress[slug]?.answeredItemIds,
      );
      if (focused) {
        const mistakes = projectionOf(
          current.current,
          courses,
          courseId,
        ).mistakes;
        const preferred = [
          ...new Set(
            mistakes
              .filter((mistake) => mistake.topicSlug === slug)
              .map((mistake) => mistake.itemId),
          ),
        ];
        session.itemIds = shuffle(
          [
            ...shuffle(preferred),
            ...session.itemIds.filter((id) => !preferred.includes(id)),
            ...topic.quizItems
              .map((item) => item.id)
              .filter(
                (id) =>
                  !preferred.includes(id) && !session.itemIds.includes(id),
              ),
          ].slice(0, 20),
        );
      }
      dispatch({ type: "start", slug, session });
    },
    [dispatch, course, courseId],
  );
  const startSession = useCallback(
    (slug: string) => start(slug, false),
    [start],
  );
  const startFocusedSession = useCallback(
    (slug: string) => start(slug, true),
    [start],
  );
  const answer = useCallback(
    (
      slug: string,
      sessionId: string,
      itemId: string,
      choice: QuizChoice["id"],
    ) =>
      dispatch({
        type: "answer",
        slug,
        sessionId,
        itemId,
        choice,
        now: new Date().toISOString(),
      }),
    [dispatch],
  );
  const next = useCallback(
    (slug: string, sessionId: string) =>
      dispatch({
        type: "next",
        slug,
        sessionId,
        now: new Date().toISOString(),
      }),
    [dispatch],
  );
  const resetTopic = useCallback(
    (slug: string) => dispatch({ type: "reset", slug }),
    [dispatch],
  );
  const resetAll = useCallback(() => {
    const before = current.current;
    const slugs = new Set([
      ...Object.keys(before.states[courseId].progress),
      ...Object.keys(before.states[courseId].sessions),
      ...eventsOf(before)
        .filter((event) => event.courseId === courseId)
        .map((event) => event.topicSlug),
    ]);
    slugs.forEach((slug) => dispatch({ type: "reset", slug }));
  }, [dispatch, courseId]);
  const discardSession = useCallback(
    (slug: string, sessionId: string) => {
      const before = current.current;
      if (
        deleting.current ||
        before.states[courseId].sessions[slug]?.id !== sessionId
      )
        return;
      const sessions = { ...before.states[courseId].sessions };
      delete sessions[slug];
      persist({
        ...before,
        states: {
          ...before.states,
          [courseId]: { ...before.states[courseId], sessions },
        },
        discardedSessions: {
          ...before.discardedSessions,
          [courseId]: [
            ...new Set([...before.discardedSessions[courseId], sessionId]),
          ],
        },
      });
    },
    [courseId, persist],
  );
  const markReviewed = useCallback(
    (mistakeId: string, topicSlug: string) => {
      const before = current.current;
      if (deleting.current || loaded.error || (owner && !before.accountEpoch))
        return;
      const projected = projectionOf(before, courses, courseId);
      if (
        !projected.mistakes.some(
          (mistake) =>
            mistake.id === mistakeId && mistake.topicSlug === topicSlug,
        )
      )
        return;
      const event: ProgressEvent = {
        id: crypto.randomUUID(),
        courseId,
        catalogVersion: course.catalogVersion,
        topicSlug,
        generation: projected.generations[topicSlug] ?? 0,
        kind: "mistake-review",
        occurredAt: new Date().toISOString(),
        payload: { mistakeId },
      };
      persist(append(before, [event]));
      if (owner) setSyncRevision((value) => value + 1);
    },
    [owner, course, courseId, persist, append, loaded.error],
  );

  const [guestLoad] = useState(() => load(null));
  const guestImport = guestLoad.cache;
  const canImport = Boolean(
    owner &&
      syncReady &&
      !syncing &&
      !guestLoad.error &&
      !loaded.error &&
      cache.accountEpoch &&
      cache.importChoices[courseId] === "pending" &&
      (Object.keys(guestImport.states[courseId].progress).length ||
        Object.keys(guestImport.states[courseId].sessions).length) &&
      (() => {
        try {
          const claimed = localStorage.getItem(guestClaimKey(course));
          return !claimed || claimed === owner;
        } catch {
          return false;
        }
      })(),
  );
  const importGuest = useCallback(() => {
    if (!owner || !canImport) return;
    const before = current.current;
    if (!syncReady || inFlight.current || !before.accountEpoch) return;
    const offset = projectEvents(
      before.events,
      course.topics,
      courseId,
    ).generations;
    const imported = survivingGuestImport(
      guestImport.guestBaselines[courseId],
      guestImport.events,
      offset,
      course.catalogVersion,
      guestImport.importIds[courseId],
      new Date().toISOString(),
      courseId,
    );
    try {
      localStorage.setItem(guestClaimKey(course), owner);
    } catch {
      setStorageMessage(
        "Your browser could not remember this import choice. Please enable storage and try again.",
      );
      return;
    }
    const updated = append(
      {
        ...before,
        importChoices: { ...before.importChoices, [courseId]: "imported" },
      },
      imported,
    );
    const projected = projectEvents(eventsOf(updated), course.topics, courseId);
    persist({
      ...updated,
      states: {
        ...updated.states,
        [courseId]: {
          ...updated.states[courseId],
          progress: projected.progress,
          sessions: {
            ...updated.states[courseId].sessions,
            ...projected.sessions,
          },
        },
      },
    });
    setSyncRevision((value) => value + 1);
  }, [
    owner,
    canImport,
    syncReady,
    course,
    courseId,
    guestImport,
    append,
    persist,
  ]);
  const declineImport = useCallback(
    () =>
      persist({
        ...current.current,
        importChoices: {
          ...current.current.importChoices,
          [courseId]: "declined",
        },
      }),
    [persist, courseId],
  );
  const clearAccountData = useCallback(async () => {
    if (!owner || !current.current.accountEpoch)
      throw new Error("Sync this account once before clearing its learning.");
    if (inFlight.current)
      throw new Error("Wait for the current sync to finish, then try again.");
    const epoch = current.current.accountEpoch;
    inFlight.current = true;
    deleting.current = true;
    setClearing(true);
    try {
      const response = await accountFetchFor(owner)(
        "/api/grammacho/v1/account",
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            confirmation: "DELETE MY GRAMMACHO DATA",
            accountEpoch: epoch,
          }),
        },
      );
      if (!response.ok)
        throw new Error(
          response.status === 401 || response.status === 403
            ? "Sign out and sign in again, then confirm clearing your Grammacho learning."
            : "Your learning could not be cleared. Check your connection and try again.",
        );
      const receipt = (await response.json()) as {
        deleted?: boolean;
        identityRetained?: boolean;
        accountEpoch?: string;
      };
      if (!active.current || !(await isCurrentAccount(owner))) return;
      if (
        !receipt.deleted ||
        !receipt.identityRetained ||
        typeof receipt.accountEpoch !== "string" ||
        receipt.accountEpoch === epoch
      )
        throw new Error(
          "The learning-clear response could not be verified. Sync again before retrying.",
        );
      const cleared = emptyCache(owner);
      persist({
        ...cleared,
        accountEpoch: receipt.accountEpoch,
        importChoices: { en: "declined", es: "declined" },
      });
      setSyncMessage(
        "Your Grammacho learning in both courses was cleared. Your Etlyn account and guest history are kept.",
      );
    } finally {
      inFlight.current = false;
      deleting.current = false;
      if (active.current) setClearing(false);
    }
  }, [owner, persist]);
  const totals = useMemo(
    () => totalsOf(cache.states[courseId].progress),
    [cache.states, courseId],
  );
  return {
    ...cache.states[courseId],
    totals,
    totalsForCourse: (id: CourseId) => totalsOf(cache.states[id].progress),
    storageMessage,
    legacyProgress,
    selectTopic,
    startSession,
    startFocusedSession,
    discardSession,
    answer,
    next,
    resetTopic,
    resetAll,
    syncing,
    syncMessage,
    sync,
    canImport,
    importGuest,
    declineImport,
    mistakes: projection.mistakes,
    suggestions: projection.suggestions,
    markReviewed,
    pendingCount: cache.outbox.length,
    clearAccountData,
    clearing,
    accountReady: !owner || Boolean(cache.accountEpoch),
    resetWaiting: Boolean(
      owner &&
        cache.outbox.some(
          (event) =>
            event.courseId === courseId && event.kind === "topic-reset",
        ),
    ),
  };
}
