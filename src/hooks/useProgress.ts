import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  grammarCatalog,
  progressVersion,
  catalogVersion,
} from "../services/contentService";
import {
  createSession,
  initialLearningState,
  reduceLearning,
  restoreLearning,
  type LearningAction,
  type LearningState,
} from "../utils/learningState";
import type { QuizChoice } from "../types/grammar";
import {
  compactAttemptEvents,
  legacyImportEvents,
  projectEvents,
  reconcilePendingAttempts,
  snapshotEvent,
  survivingGuestImport,
  type ProgressEvent,
} from "../utils/accountProgress";
import { accountFetchFor, isCurrentAccount } from "../lib/account";

const GUEST_KEY = `grammacho-web-progress:${progressVersion}`;
const GUEST_LEDGER = `grammacho-web-guest-ledger:${progressVersion}`;
const IMPORT_OWNER = `grammacho-web-import-owner:${progressVersion}`;
type Cache = {
  version: 1;
  state: LearningState;
  events: ProgressEvent[];
  outbox: ProgressEvent[];
  cursor: number;
  accountEpoch: string | null;
  importChoice: "pending" | "imported" | "declined";
  guestBaseline?: LearningState;
  importId: string;
};
type SyncResult = {
  accountId: string;
  accountEpoch: string;
  revision: number;
  cursor: number;
  hasMore: boolean;
  acceptedEventIds: string[];
  events: ProgressEvent[];
};
const emptyCache = (state = initialLearningState()): Cache => ({
  version: 1,
  state,
  events: [],
  outbox: [],
  cursor: 0,
  accountEpoch: null,
  importChoice: "pending",
  importId: crypto.randomUUID(),
});
const plausibleEvent = (value: unknown): value is ProgressEvent => {
  if (!value || typeof value !== "object") return false;
  const event = value as ProgressEvent;
  if (
    typeof event.id !== "string" ||
    !["en", "es"].includes(event.courseId) ||
    typeof event.topicSlug !== "string" ||
    typeof event.catalogVersion !== "string" ||
    !Number.isInteger(event.generation) ||
    event.generation < 0 ||
    typeof event.occurredAt !== "string" ||
    !event.payload ||
    typeof event.payload !== "object" ||
    Array.isArray(event.payload)
  )
    return false;
  if (event.kind === "attempt") {
    const attempt = event.payload as {
      id?: unknown;
      itemIds?: unknown[];
      answers?: { itemId?: unknown; selectedAnswer?: unknown }[];
      index?: unknown;
      complete?: unknown;
    };
    return (
      typeof attempt.id === "string" &&
      Array.isArray(attempt.itemIds) &&
      attempt.itemIds.length === 20 &&
      attempt.itemIds.every((id) => typeof id === "string") &&
      Array.isArray(attempt.answers) &&
      attempt.answers.every(
        (answer) =>
          answer &&
          typeof answer.itemId === "string" &&
          ["A", "B", "C", "D"].includes(String(answer.selectedAnswer)),
      ) &&
      Number.isInteger(attempt.index) &&
      typeof attempt.complete === "boolean"
    );
  }
  if (event.kind === "legacy-import") {
    const legacy = event.payload as {
      progress?: { total?: unknown; correct?: unknown };
      attempt?: unknown;
    };
    return Boolean(
      legacy.progress &&
        Number.isInteger(legacy.progress.total) &&
        Number.isInteger(legacy.progress.correct) &&
        (!legacy.attempt ||
          plausibleEvent({
            ...event,
            kind: "attempt",
            payload: legacy.attempt,
          })),
    );
  }
  return (
    event.kind === "topic-reset" ||
    (event.kind === "mistake-review" &&
      "mistakeId" in event.payload &&
      typeof event.payload.mistakeId === "string")
  );
};
function readCache(owner: string | null): Cache {
  try {
    const key = owner ? `grammacho-web-account:${owner}` : GUEST_LEDGER;
    const raw = localStorage.getItem(key);
    const value = raw ? (JSON.parse(raw) as Cache) : null;
    if (
      value?.version === 1 &&
      Array.isArray(value.events) &&
      Array.isArray(value.outbox) &&
      typeof value.cursor === "number" &&
      typeof value.importId === "string"
    ) {
      return {
        ...value,
        state: restoreLearning(JSON.stringify(value.state), grammarCatalog),
        events: value.events.filter(plausibleEvent),
        outbox: value.outbox.filter(plausibleEvent),
        accountEpoch:
          typeof value.accountEpoch === "string" ? value.accountEpoch : null,
      };
    }
    if (owner) return emptyCache();
    const state = restoreLearning(
      localStorage.getItem(GUEST_KEY),
      grammarCatalog,
    );
    return { ...emptyCache(state), guestBaseline: state };
  } catch {
    return emptyCache();
  }
}
const mergeEvents = (existing: ProgressEvent[], incoming: ProgressEvent[]) =>
  compactAttemptEvents([
    ...new Map(
      [...existing, ...incoming].map((event) => [event.id, event]),
    ).values(),
  ]);
const optimistic = (events: ProgressEvent[]) =>
  events.map((event) =>
    event.kind === "topic-reset"
      ? { ...event, generation: event.generation + 1 }
      : event,
  );

/** The component is keyed by provider subject. Every closure and storage write
 * belongs to that fixed owner; a later sign-in cannot reuse an old outbox. */
export function useProgress(owner: string | null = null) {
  const [cache, setCache] = useState(() => readCache(owner));
  const current = useRef(cache);
  const [storageMessage, setStorageMessage] = useState("");
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
  const persist = useCallback(
    (next: Cache) => {
      if (!active.current) return;
      current.current = next;
      setCache(next);
      try {
        localStorage.setItem(
          owner ? `grammacho-web-account:${owner}` : GUEST_LEDGER,
          JSON.stringify(next),
        );
        if (!owner) localStorage.setItem(GUEST_KEY, JSON.stringify(next.state));
        setStorageMessage("");
      } catch {
        setStorageMessage(
          "Your browser could not save progress. Keep this page open; unsynced work may be lost if you close it.",
        );
      }
    },
    [owner],
  );
  useEffect(() => {
    active.current = true;
    persist(current.current);
    return () => {
      active.current = false;
    };
  }, [persist]);

  const allEvents = useMemo(
    () => mergeEvents(cache.events, optimistic(cache.outbox)),
    [cache.events, cache.outbox],
  );
  const projection = useMemo(
    () => projectEvents(allEvents, grammarCatalog, "en"),
    [allEvents],
  );
  const generations = useRef(projection.generations);
  generations.current = projection.generations;

  const sync = useCallback(async () => {
    if (!owner || inFlight.current || !navigator.onLine) return;
    inFlight.current = true;
    setSyncing(true);
    const fetchAccount = accountFetchFor(owner);
    let reconciliation = "";
    const accept = (result: SyncResult) => {
      if (!active.current) return false;
      if (
        result.accountId !== owner ||
        typeof result.accountEpoch !== "string" ||
        !Array.isArray(result.events)
      )
        throw new Error("The account response could not be verified.");
      let next = current.current;
      if (next.accountEpoch && next.accountEpoch !== result.accountEpoch) {
        next = { ...emptyCache(), accountEpoch: result.accountEpoch };
        reconciliation =
          "Your Grammacho account data was reset elsewhere. Older queued work was not restored.";
      }
      const accepted = new Set(result.acceptedEventIds);
      let outbox = next.outbox.filter((event) => !accepted.has(event.id));
      // An acknowledgement may precede its canonical event on a paginated
      // response. Retain the accepted local payload until that page arrives.
      const acknowledged = optimistic(
        next.outbox.filter((event) => accepted.has(event.id)),
      );
      const events = mergeEvents(
        mergeEvents(next.events, acknowledged),
        result.events,
      );
      const reconciled = reconcilePendingAttempts(outbox, events);
      outbox = reconciled.events;
      if (reconciled.conflictedAttemptIds.size)
        reconciliation =
          "An answer was already checked on another device. That saved answer was kept; your other learning is unchanged.";
      const projected = projectEvents(
        mergeEvents(events, optimistic(outbox)),
        grammarCatalog,
        "en",
      );
      const sessions = { ...projected.sessions };
      for (const [slug, local] of Object.entries(next.state.sessions)) {
        const oldGeneration = generations.current[slug] ?? 0;
        if (
          oldGeneration === (projected.generations[slug] ?? 0) &&
          !local.complete &&
          !reconciled.conflictedAttemptIds.has(local.id)
        ) {
          const remote = sessions[slug];
          // A later snapshot of the same session wins; a different unfinished
          // local session stays available while its own events are uploaded.
          if (
            !remote ||
            remote.id !== local.id ||
            (local.answers.length >= remote.answers.length &&
              local.index >= remote.index &&
              !remote.complete)
          )
            sessions[slug] = local;
        }
      }
      persist({
        ...next,
        events,
        outbox,
        cursor: result.cursor,
        accountEpoch: result.accountEpoch,
        state: { ...next.state, progress: projected.progress, sessions },
      });
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
    try {
      let result = await request("GET");
      while (active.current && accept(result) && result.hasMore)
        result = await request("GET");
      if (!active.current) return;
      setSyncReady(true);
      // Canonical resets invalidate stale queued work. Keep the ledger itself
      // for provenance, but never upload answers from before a newer reset.
      const canonical = projectEvents(
        current.current.events,
        grammarCatalog,
        "en",
      );
      const valid = current.current.outbox.filter(
        (event) =>
          event.generation >= (canonical.generations[event.topicSlug] ?? 0),
      );
      if (valid.length !== current.current.outbox.length) {
        persist({ ...current.current, outbox: valid });
        reconciliation =
          "A chapter was reset on another device. Older queued answers were not restored.";
      }
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
            const canonicalGeneration = projectEvents(
              current.current.events,
              grammarCatalog,
              "en",
            ).generations;
            persist({
              ...current.current,
              outbox: current.current.outbox.filter(
                (event) =>
                  event.generation >=
                  (canonicalGeneration[event.topicSlug] ?? 0),
              ),
            });
            reconciliation ||=
              "A chapter was reset on another device. Older queued answers were not restored.";
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
  }, [owner, persist]);
  useEffect(() => {
    if (!owner) return;
    void sync();
    const online = () => {
      void sync();
    };
    window.addEventListener("online", online);
    return () => window.removeEventListener("online", online);
  }, [owner, sync, syncRevision]);

  const dispatch = useCallback(
    (action: LearningAction) => {
      const before = current.current;
      if (owner && !before.accountEpoch && action.type !== "select") {
        setSyncMessage(
          "Connect once to load this account’s learning before starting practice. You can sign out to keep learning as a guest.",
        );
        return;
      }
      const state = reduceLearning(before.state, action, grammarCatalog);
      if (state === before.state) return;
      let event: ProgressEvent | undefined;
      const now = "now" in action ? action.now : new Date().toISOString();
      const generation = generations.current[action.slug] ?? 0;
      if (action.type === "answer" || action.type === "next")
        event = snapshotEvent(
          state.sessions[action.slug],
          action.slug,
          generation,
          catalogVersion,
          now,
        );
      if (action.type === "reset")
        event = {
          id: crypto.randomUUID(),
          courseId: "en",
          catalogVersion,
          topicSlug: action.slug,
          generation: owner ? generation : generation + 1,
          kind: "topic-reset",
          occurredAt: now,
          payload: {},
        };
      const next = { ...before, state };
      if (event) {
        if (owner) next.outbox = mergeEvents(before.outbox, [event]);
        else next.events = mergeEvents(before.events, [event]);
      }
      persist(next);
      if (owner && event) setSyncRevision((value) => value + 1);
    },
    [owner, persist],
  );
  const selectTopic = useCallback(
    (slug: string) => dispatch({ type: "select", slug }),
    [dispatch],
  );
  const startSession = useCallback(
    (slug: string) => {
      const topic = grammarCatalog.find((value) => value.slug === slug);
      if (topic)
        dispatch({
          type: "start",
          slug,
          session: createSession(
            topic,
            current.current.state.progress[slug]?.answeredItemIds,
          ),
        });
    },
    [dispatch],
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
  const markReviewed = useCallback(
    (mistakeId: string, topicSlug: string) => {
      const event: ProgressEvent = {
        id: crypto.randomUUID(),
        courseId: "en",
        catalogVersion,
        topicSlug,
        generation: generations.current[topicSlug] ?? 0,
        kind: "mistake-review",
        occurredAt: new Date().toISOString(),
        payload: { mistakeId },
      };
      const before = current.current;
      persist(
        owner
          ? { ...before, outbox: [...before.outbox, event] }
          : { ...before, events: [...before.events, event] },
      );
      if (owner) setSyncRevision((value) => value + 1);
    },
    [owner, persist],
  );
  const [guestImport] = useState(() => readCache(null));
  const canImport = Boolean(
    owner &&
      syncReady &&
      !syncing &&
      cache.accountEpoch &&
      cache.importChoice === "pending" &&
      Object.keys(guestImport.state.progress).length &&
      (() => {
        try {
          const claimed = localStorage.getItem(IMPORT_OWNER);
          return !claimed || claimed === owner;
        } catch {
          return false;
        }
      })(),
  );
  const importGuest = useCallback(() => {
    if (!owner) return;
    const before = current.current;
    if (!syncReady || inFlight.current || !before.accountEpoch) return;
    const offset = projectEvents(
      before.events,
      grammarCatalog,
      "en",
    ).generations;
    const imported = survivingGuestImport(
      guestImport.guestBaseline ?? guestImport.state,
      guestImport.events,
      offset,
      catalogVersion,
      guestImport.importId,
      new Date().toISOString(),
    );
    try {
      localStorage.setItem(IMPORT_OWNER, owner);
    } catch {
      setStorageMessage(
        "Your browser could not remember this import choice. Please enable storage and try again.",
      );
      return;
    }
    const outbox = mergeEvents(before.outbox, imported);
    const projected = projectEvents(
      mergeEvents(before.events, optimistic(outbox)),
      grammarCatalog,
      "en",
    );
    persist({
      ...before,
      importChoice: "imported",
      outbox,
      state: {
        ...before.state,
        progress: projected.progress,
        sessions: { ...before.state.sessions, ...projected.sessions },
      },
    });
    setSyncRevision((value) => value + 1);
  }, [owner, guestImport, persist, syncReady]);
  const declineImport = useCallback(
    () => persist({ ...current.current, importChoice: "declined" }),
    [persist],
  );
  const clearAccountData = useCallback(async () => {
    if (!owner || !current.current.accountEpoch)
      throw new Error("Sync this account once before clearing its learning.");
    if (inFlight.current)
      throw new Error("Wait for the current sync to finish, then try again.");
    const epoch = current.current.accountEpoch;
    inFlight.current = true;
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
      persist({
        ...emptyCache(),
        accountEpoch: receipt.accountEpoch,
        importChoice: "declined",
      });
      setSyncMessage(
        "Your Grammacho learning was cleared. Your Etlyn account and guest history are kept.",
      );
    } finally {
      inFlight.current = false;
      if (active.current) setClearing(false);
    }
  }, [owner, persist]);
  const totals = useMemo(() => {
    const values = Object.values(cache.state.progress);
    const totalAnswers = values.reduce((sum, value) => sum + value.total, 0),
      correctAnswers = values.reduce((sum, value) => sum + value.correct, 0);
    return {
      completedTopics: values.filter((value) => value.isCompleted).length,
      totalAnswers,
      correctAnswers,
      accuracy: totalAnswers
        ? Math.round((correctAnswers / totalAnswers) * 100)
        : 0,
    };
  }, [cache.state.progress]);
  const guestProjection = useMemo(
    () =>
      owner
        ? projection
        : projectEvents(
            [
              ...legacyImportEvents(
                cache.guestBaseline ?? initialLearningState(),
                {},
                catalogVersion,
                cache.importId,
                new Date(0).toISOString(),
              ),
              ...cache.events,
            ],
            grammarCatalog,
            "en",
          ),
    [owner, projection, cache],
  );
  return {
    ...cache.state,
    totals,
    storageMessage,
    legacyProgress,
    selectTopic,
    startSession,
    answer,
    next,
    resetTopic,
    syncing,
    syncMessage,
    sync,
    canImport,
    importGuest,
    declineImport,
    mistakes: guestProjection.mistakes,
    suggestions: guestProjection.suggestions,
    markReviewed,
    pendingCount: cache.outbox.length,
    clearAccountData,
    clearing,
  };
}
