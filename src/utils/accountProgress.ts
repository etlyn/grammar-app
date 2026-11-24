import type { GrammarTopic, TopicProgress } from "../types/grammar";
import type { LearningState, PracticeSession } from "./learningState";

export type CourseId = "en" | "es";
export type ProgressEvent = {
  id: string;
  courseId: CourseId;
  catalogVersion: string;
  topicSlug: string;
  generation: number;
  kind: "attempt" | "topic-reset" | "mistake-review" | "legacy-import";
  occurredAt: string;
  sequence?: number;
  payload:
    | PracticeSession
    | { mistakeId: string }
    | { progress: LegacyProgress; attempt?: PracticeSession }
    | Record<string, never>;
};
export type LegacyProgress = Pick<
  TopicProgress,
  | "correct"
  | "total"
  | "bestScore"
  | "completedSessions"
  | "isCompleted"
  | "lastScore"
  | "updatedAt"
>;
export type Mistake = {
  id: string;
  topicSlug: string;
  itemId: string;
  choice: string;
  correctChoice: string;
  skill: string;
  occurredAt: string;
};
export type Suggestion = {
  topicSlug: string;
  title: string;
  skill: string;
  mistakeCount: number;
  sectionId?: string;
};
export type Projection = {
  progress: LearningState["progress"];
  sessions: LearningState["sessions"];
  generations: Record<string, number>;
  mistakes: Mistake[];
  suggestions: Suggestion[];
};

const isAttempt = (value: ProgressEvent["payload"]): value is PracticeSession =>
  "id" in value &&
  typeof value.id === "string" &&
  "itemIds" in value &&
  Array.isArray(value.itemIds) &&
  "answers" in value &&
  Array.isArray(value.answers);
const sessionPayload = (value: PracticeSession): PracticeSession => ({
  id: value.id,
  itemIds: [...value.itemIds],
  answers: value.answers.map((answer) => ({
    itemId: answer.itemId,
    selectedAnswer: answer.selectedAnswer,
  })),
  index: value.index,
  complete: value.complete,
});
const chronological = (a: ProgressEvent, b: ProgressEvent) => {
  if (a.sequence !== undefined && b.sequence !== undefined)
    return a.sequence - b.sequence;
  if (a.sequence !== undefined) return -1;
  if (b.sequence !== undefined) return 1;
  return a.occurredAt.localeCompare(b.occurredAt) || a.id.localeCompare(b.id);
};

/** Same pure projection contract on web and native. The server verifies catalog
 * IDs/answers; clients derive scores from their own frozen matching catalog. */
export function projectEvents(
  events: readonly ProgressEvent[],
  topics: readonly GrammarTopic[],
  courseId: CourseId,
): Projection {
  const progress: Projection["progress"] = {},
    sessions: Projection["sessions"] = {},
    generations: Record<string, number> = {};
  const mistakes: Mistake[] = [];
  for (const topic of topics) {
    const history = events.filter(
      (event) => event.courseId === courseId && event.topicSlug === topic.slug,
    );
    const generation = Math.max(
      0,
      ...history
        .filter((event) => event.kind === "topic-reset")
        .map((event) => event.generation),
    );
    generations[topic.slug] = generation;
    const current = history
      .filter(
        (event) =>
          event.generation === generation && event.kind !== "topic-reset",
      )
      .sort(chronological);
    const attempts = new Map<
      string,
      { attempt: PracticeSession; time: string; sequence: number }
    >();
    type Baseline = {
      progress: LegacyProgress;
      attempt?: PracticeSession;
      includedAttemptCounts?: {
        attemptId: string;
        total: number;
        correct: number;
        completedSessions: number;
      };
    };
    let baseline: Baseline | undefined,
      baselineId = "";
    let importedBest = 0,
      importedPass = false;
    const reviewed = new Set<string>();
    for (const event of current) {
      if (event.kind === "mistake-review" && "mistakeId" in event.payload)
        reviewed.add(event.payload.mistakeId as string);
      if (event.kind === "legacy-import" && "progress" in event.payload) {
        const value = event.payload as Baseline;
        importedBest = Math.max(importedBest, value.progress.bestScore ?? 0);
        importedPass ||= value.progress.isCompleted;
        if (
          !baseline ||
          value.progress.total > baseline.progress.total ||
          (value.progress.total === baseline.progress.total &&
            (value.progress.correct > baseline.progress.correct ||
              (value.progress.correct === baseline.progress.correct &&
                event.id > baselineId)))
        ) {
          baseline = value;
          baselineId = event.id;
        }
        if (value.attempt) record(value.attempt, event);
      }
      if (event.kind === "attempt" && isAttempt(event.payload))
        record(event.payload, event);
    }
    function record(attempt: PracticeSession, event: ProgressEvent) {
      const existing = attempts.get(attempt.id);
      if (!existing) {
        attempts.set(attempt.id, {
          attempt,
          time: event.occurredAt,
          sequence: event.sequence ?? 0,
        });
        return;
      }
      const base =
        attempt.answers.length >= existing.attempt.answers.length
          ? attempt
          : existing.attempt;
      const merged = {
        ...base,
        index: Math.max(attempt.index, existing.attempt.index),
        complete: attempt.complete || existing.attempt.complete,
      };
      const advanced =
        merged.answers.length > existing.attempt.answers.length ||
        merged.index > existing.attempt.index ||
        merged.complete !== existing.attempt.complete;
      attempts.set(attempt.id, {
        attempt: merged,
        time: advanced ? event.occurredAt : existing.time,
        sequence: advanced ? (event.sequence ?? 0) : existing.sequence,
      });
    }
    if (!attempts.size && !baseline) continue;
    const correctCount = (attempt?: PracticeSession) =>
      attempt?.answers.filter(
        (answer) =>
          topic.quizItems.find((item) => item.id === answer.itemId)
            ?.answerId === answer.selectedAnswer,
      ).length ?? 0;
    const base = baseline?.progress;
    // Old clients retained aggregate counters and only one detailed session.
    // Keep one largest baseline, subtract its included session once, then add
    // the distinct attempt ledger. Device copies are never summed as baselines.
    let total = Math.max(
      0,
      (base?.total ?? 0) -
        (baseline?.includedAttemptCounts?.total ??
          baseline?.attempt?.answers.length ??
          0),
    );
    let correct = Math.max(
      0,
      (base?.correct ?? 0) -
        (baseline?.includedAttemptCounts?.correct ??
          correctCount(baseline?.attempt)),
    );
    let completedSessions = Math.max(
      0,
      (base?.completedSessions ?? 0) -
        (baseline?.includedAttemptCounts?.completedSessions ??
          Number(baseline?.attempt?.complete ?? false)),
    );
    let bestScore = importedBest,
      lastScore = base?.lastScore ?? 0;
    let isCompleted = importedPass;
    let updatedAt = base?.updatedAt ?? "";
    const ordered = [...attempts.values()].sort(
      (a, b) =>
        (a.sequence && b.sequence
          ? a.sequence - b.sequence
          : a.sequence
            ? -1
            : b.sequence
              ? 1
              : a.time.localeCompare(b.time)) ||
        a.attempt.id.localeCompare(b.attempt.id),
    );
    const seen = new Set<string>();
    for (const { attempt, time } of ordered) {
      const count = correctCount(attempt);
      total += attempt.answers.length;
      correct += count;
      if (time > updatedAt) updatedAt = time;
      attempt.answers.forEach((answer) => seen.add(answer.itemId));
      if (attempt.complete) {
        const score = Math.round((count / attempt.itemIds.length) * 100);
        completedSessions++;
        bestScore = Math.max(bestScore, score);
        lastScore = score;
        if (score >= 80 && attempt.answers.length === 20) isCompleted = true;
      }
      for (const answer of attempt.answers) {
        const item = topic.quizItems.find(
          (question) => question.id === answer.itemId,
        );
        if (!item || answer.selectedAnswer === item.answerId) continue;
        const id = `${attempt.id}:${item.id}`;
        if (!reviewed.has(id))
          mistakes.push({
            id,
            topicSlug: topic.slug,
            itemId: item.id,
            choice: answer.selectedAnswer,
            correctChoice: item.answerId,
            skill: item.skill ?? "practice",
            occurredAt: time,
          });
      }
    }
    // Keep a remote unfinished session resumable; callers retain an active
    // local session rather than replacing it during a background refresh.
    const unfinished = ordered.filter((value) => !value.attempt.complete);
    const latest =
      unfinished[unfinished.length - 1]?.attempt ??
      ordered[ordered.length - 1]?.attempt;
    if (latest) sessions[topic.slug] = latest;
    progress[topic.slug] = {
      completedLevels: Number(isCompleted),
      isCompleted,
      total,
      correct: Math.min(correct, total),
      streak: 0,
      lastScore,
      bestScore,
      completedSessions,
      answeredItemIds: [...seen],
      updatedAt,
    };
  }
  const groups = new Map<string, Suggestion>();
  for (const mistake of mistakes) {
    const topic = topics.find((item) => item.slug === mistake.topicSlug)!;
    const key = `${topic.slug}:${mistake.skill}`;
    const prior = groups.get(key);
    if (prior) prior.mistakeCount++;
    else {
      // Only name a specific section when its stable ID explicitly names the
      // assessed skill. Otherwise link the chapter rather than inventing a match.
      const section = topic.chapter?.rules.find((rule) =>
        rule.id?.endsWith(`:${mistake.skill}`),
      );
      groups.set(key, {
        topicSlug: topic.slug,
        title: topic.title,
        skill: mistake.skill,
        mistakeCount: 1,
        ...(section?.id ? { sectionId: section.id } : {}),
      });
    }
  }
  const suggestions = [...groups.values()]
    .sort(
      (a, b) =>
        b.mistakeCount - a.mistakeCount || a.title.localeCompare(b.title),
    )
    .slice(0, 3);
  return {
    progress,
    sessions,
    generations,
    mistakes: mistakes.sort((a, b) => b.occurredAt.localeCompare(a.occurredAt)),
    suggestions,
  };
}

export function snapshotEvent(
  session: PracticeSession,
  topicSlug: string,
  generation: number,
  catalogVersion: string,
  occurredAt: string,
  eventId = globalThis.crypto.randomUUID(),
): ProgressEvent {
  // Persist this ID with its immutable payload. Different devices may produce
  // the same logical snapshot at different times; they must not share event IDs.
  return {
    id: `attempt:${session.id}:${eventId}`,
    courseId: "en",
    catalogVersion,
    topicSlug,
    generation,
    kind: "attempt",
    occurredAt,
    payload: sessionPayload(session),
  };
}

export function legacyImportEvents(
  state: LearningState,
  generations: Record<string, number>,
  catalogVersion: string,
  importId: string,
  now: string,
): ProgressEvent[] {
  const slugs = new Set([
    ...Object.keys(state.progress),
    ...Object.keys(state.sessions),
  ]);
  return [...slugs].map((topicSlug) => {
    const value = state.progress[topicSlug];
    const session = state.sessions[topicSlug];
    return {
      id: `import:${importId}:${topicSlug}`,
      courseId: "en",
      catalogVersion,
      topicSlug,
      generation: generations[topicSlug] ?? 0,
      kind: "legacy-import",
      occurredAt: now,
      payload: {
        progress: {
          correct: value?.correct ?? 0,
          total: value?.total ?? 0,
          bestScore: value?.bestScore ?? 0,
          completedSessions: value?.completedSessions ?? 0,
          isCompleted: value?.isCompleted ?? false,
          lastScore: value?.lastScore ?? 0,
          updatedAt: value?.updatedAt || now,
        },
        ...(session ? { attempt: sessionPayload(session) } : {}),
      },
    };
  });
}

/** A guest reset is a local editing choice, never a command to erase cloud
 * history. Import only that guest topic's surviving generation. */
export function survivingGuestImport(
  baseline: LearningState,
  events: ProgressEvent[],
  accountGenerations: Record<string, number>,
  catalogVersion: string,
  importId: string,
  now: string,
): ProgressEvent[] {
  const guestGenerations: Record<string, number> = {};
  for (const event of events)
    if (event.kind === "topic-reset")
      guestGenerations[event.topicSlug] = Math.max(
        guestGenerations[event.topicSlug] ?? 0,
        event.generation,
      );
  const legacy = legacyImportEvents(
    baseline,
    accountGenerations,
    catalogVersion,
    importId,
    now,
  ).filter((event) => !guestGenerations[event.topicSlug]);
  const surviving = events
    .filter(
      (event) =>
        event.kind !== "topic-reset" &&
        event.generation === (guestGenerations[event.topicSlug] ?? 0),
    )
    .map((event) => ({
      ...event,
      id: `guest:${importId}:${event.id}`,
      generation: accountGenerations[event.topicSlug] ?? 0,
    }));
  return [...legacy, ...surviving];
}

/** Keep the latest full snapshot per attempt, rather than storing twenty
 * near-identical question-order arrays after each session. Outbox payloads are
 * immutable; replacing an unsent older snapshot with its monotonic successor
 * does not change any event ID's payload. Logical insertion order is retained
 * so a following mistake-review cannot precede its attempt. */
export function compactAttemptEvents(events: ProgressEvent[]): ProgressEvent[] {
  const compact = new Map<string, ProgressEvent>();
  for (const event of events) {
    const key =
      event.kind === "attempt" && isAttempt(event.payload)
        ? `${event.courseId}:${event.topicSlug}:${event.generation}:attempt:${event.payload.id}`
        : event.id;
    const prior = compact.get(key);
    if (!prior) {
      compact.set(key, event);
      continue;
    }
    if (isAttempt(event.payload) && isAttempt(prior.payload)) {
      const previous = prior.payload,
        next = event.payload;
      const regresses =
        next.answers.length < previous.answers.length ||
        next.index < previous.index ||
        (previous.complete && !next.complete);
      const advances =
        next.answers.length > previous.answers.length ||
        next.index > previous.index ||
        (next.complete && !previous.complete);
      const canonicalPreferred =
        event.sequence !== undefined &&
        (prior.sequence === undefined || event.sequence >= prior.sequence);
      if (
        !regresses &&
        (advances ||
          canonicalPreferred ||
          (prior.sequence === undefined &&
            event.sequence === undefined &&
            chronological(prior, event) <= 0))
      )
        compact.set(key, event);
    } else if (chronological(prior, event) <= 0) compact.set(key, event);
  }
  return [...compact.values()];
}

/** Prefer the verified canonical answer when two devices independently check
 * the same question. Do not send a divergent checked prefix or question order;
 * keep every unrelated queued attempt and reset untouched. */
export function reconcilePendingAttempts(
  pending: ProgressEvent[],
  canonical: ProgressEvent[],
) {
  const attempts = new Map<string, PracticeSession>();
  for (const event of [...canonical].sort(chronological)) {
    const attempt =
      event.kind === "attempt" && isAttempt(event.payload)
        ? event.payload
        : event.kind === "legacy-import" && "attempt" in event.payload
          ? (event.payload.attempt as PracticeSession | undefined)
          : undefined;
    if (attempt)
      attempts.set(
        `${event.courseId}:${event.topicSlug}:${event.generation}:${attempt.id}`,
        attempt,
      );
  }
  const conflicts = new Set<string>();
  for (const event of pending) {
    const attempt =
      event.kind === "attempt" && isAttempt(event.payload)
        ? event.payload
        : event.kind === "legacy-import" && "attempt" in event.payload
          ? (event.payload.attempt as PracticeSession | undefined)
          : undefined;
    if (!attempt) continue;
    const accepted = attempts.get(
      `${event.courseId}:${event.topicSlug}:${event.generation}:${attempt.id}`,
    );
    if (!accepted) continue;
    if (
      attempt.itemIds.join("|") !== accepted.itemIds.join("|") ||
      attempt.answers.some(
        (answer, index) =>
          accepted.answers[index] &&
          (answer.itemId !== accepted.answers[index].itemId ||
            answer.selectedAnswer !== accepted.answers[index].selectedAnswer),
      )
    )
      conflicts.add(attempt.id);
  }
  const events = pending.filter((event) => {
    if (event.kind === "attempt" && isAttempt(event.payload))
      return !conflicts.has(event.payload.id);
    if (event.kind === "legacy-import" && "attempt" in event.payload)
      return !conflicts.has(
        (event.payload.attempt as PracticeSession | undefined)?.id ?? "",
      );
    if (event.kind === "mistake-review" && "mistakeId" in event.payload) {
      const mistakeId = event.payload.mistakeId as string;
      return ![...conflicts].some((id) => mistakeId.startsWith(`${id}:`));
    }
    return true;
  });
  return { events, conflictedAttemptIds: conflicts };
}
