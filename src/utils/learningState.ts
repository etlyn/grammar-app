import type {
  GrammarTopic,
  ProgressByTopic,
  QuizChoice,
  TopicProgress,
} from "../types/grammar";
import { shuffle } from "./quiz";
import { PASSING_ACCURACY, REQUIRED_QUIZ_ITEMS } from "../constants/learning";

export type SavedAnswer = { itemId: string; selectedAnswer: QuizChoice["id"] };
export type PracticeSession = {
  id: string;
  itemIds: string[];
  answers: SavedAnswer[];
  index: number;
  complete: boolean;
};
export type LearningState = {
  version: 1;
  activeSlug: string;
  progress: ProgressByTopic;
  sessions: Record<string, PracticeSession>;
};
export type LearningAction =
  | { type: "select"; slug: string }
  | { type: "start"; slug: string; session: PracticeSession }
  | {
      type: "answer";
      slug: string;
      sessionId: string;
      itemId: string;
      choice: QuizChoice["id"];
      now: string;
    }
  | { type: "next"; slug: string; sessionId: string; now: string }
  | { type: "reset"; slug: string };
export const initialLearningState = (): LearningState => ({
  version: 1,
  activeSlug: "",
  progress: {},
  sessions: {},
});
const blank = (): TopicProgress => ({
  completedLevels: 0,
  isCompleted: false,
  correct: 0,
  total: 0,
  streak: 0,
  lastScore: 0,
  bestScore: 0,
  completedSessions: 0,
  answeredItemIds: [],
  updatedAt: "",
});

export function createSession(
  topic: GrammarTopic,
  seen: readonly string[] = [],
  id = globalThis.crypto.randomUUID(),
): PracticeSession {
  const seenIds = new Set(seen);
  const skills = [
    ...new Set(topic.quizItems.map((q) => q.skill ?? "practice")),
  ];
  const pools = skills.map((skill) => {
    const items = topic.quizItems.filter(
      (q) => (q.skill ?? "practice") === skill,
    );
    return [
      ...shuffle(items.filter((q) => !seenIds.has(q.id))),
      ...shuffle(items.filter((q) => seenIds.has(q.id))),
    ];
  });
  const chosen: string[] = [];
  const contexts = new Set<string>();
  // Balance skills and prefer different situations in a session.
  while (chosen.length < REQUIRED_QUIZ_ITEMS && pools.some((p) => p.length)) {
    for (const pool of pools) {
      if (!pool.length || chosen.length >= REQUIRED_QUIZ_ITEMS) continue;
      let index = pool.findIndex(
        (q) => !seenIds.has(q.id) && !contexts.has(q.contextKey ?? q.id),
      );
      if (index < 0) index = pool.findIndex((q) => !seenIds.has(q.id));
      if (index < 0)
        index = pool.findIndex((q) => !contexts.has(q.contextKey ?? q.id));
      if (index < 0) index = 0;
      const [item] = pool.splice(index, 1);
      chosen.push(item.id);
      contexts.add(item.contextKey ?? item.id);
    }
  }
  return {
    id,
    itemIds: shuffle(chosen),
    answers: [],
    index: 0,
    complete: false,
  };
}

export function reduceLearning(
  state: LearningState,
  action: LearningAction,
  topics: readonly GrammarTopic[],
): LearningState {
  const topic = topics.find((t) => t.slug === action.slug);
  if (!topic) return state;
  if (action.type === "select") return { ...state, activeSlug: topic.slug };
  if (action.type === "reset") {
    const progress = { ...state.progress },
      sessions = { ...state.sessions };
    delete progress[topic.slug];
    delete sessions[topic.slug];
    return { ...state, progress, sessions };
  }
  if (action.type === "start") {
    if (state.sessions[topic.slug] && !state.sessions[topic.slug].complete)
      return state;
    return {
      ...state,
      sessions: { ...state.sessions, [topic.slug]: action.session },
    };
  }
  const session = state.sessions[topic.slug];
  if (!session || session.id !== action.sessionId || session.complete)
    return state;
  const previous = state.progress[topic.slug] ?? blank();
  if (action.type === "answer") {
    if (
      session.itemIds[session.index] !== action.itemId ||
      session.answers.some((a) => a.itemId === action.itemId)
    )
      return state;
    const item = topic.quizItems.find((q) => q.id === action.itemId);
    if (!item || !item.choices.some((c) => c.id === action.choice))
      return state;
    const correct = item.answerId === action.choice;
    const progress = {
      ...previous,
      total: previous.total + 1,
      correct: previous.correct + Number(correct),
      streak: correct ? previous.streak + 1 : 0,
      answeredItemIds: [...new Set([...previous.answeredItemIds, item.id])],
      updatedAt: action.now,
    };
    return {
      ...state,
      progress: { ...state.progress, [topic.slug]: progress },
      sessions: {
        ...state.sessions,
        [topic.slug]: {
          ...session,
          answers: [
            ...session.answers,
            { itemId: item.id, selectedAnswer: action.choice },
          ],
        },
      },
    };
  }
  if (!session.answers.some((a) => a.itemId === session.itemIds[session.index]))
    return state;
  if (session.index < session.itemIds.length - 1)
    return {
      ...state,
      sessions: {
        ...state.sessions,
        [topic.slug]: { ...session, index: session.index + 1 },
      },
    };
  const correct = session.answers.filter(
    (a) =>
      topic.quizItems.find((q) => q.id === a.itemId)?.answerId ===
      a.selectedAnswer,
  ).length;
  const score = Math.round((correct / session.itemIds.length) * 100);
  const passed =
    session.answers.length >= REQUIRED_QUIZ_ITEMS && score >= PASSING_ACCURACY;
  const completed = previous.isCompleted || passed;
  const progress = {
    ...previous,
    isCompleted: completed,
    completedLevels: completed ? 1 : 0,
    lastScore: score,
    bestScore: Math.max(previous.bestScore ?? 0, score),
    completedSessions: (previous.completedSessions ?? 0) + 1,
    updatedAt: action.now,
  };
  return {
    ...state,
    progress: { ...state.progress, [topic.slug]: progress },
    sessions: {
      ...state.sessions,
      [topic.slug]: { ...session, complete: true },
    },
  };
}

export function restoreLearning(
  raw: string | null,
  topics: readonly GrammarTopic[],
): LearningState {
  if (!raw) return initialLearningState();
  try {
    const value = JSON.parse(raw);
    if (
      value.version !== 1 ||
      typeof value.activeSlug !== "string" ||
      !value.progress ||
      !value.sessions
    )
      throw Error("Invalid state");
    const state = initialLearningState();
    state.activeSlug = topics.some((t) => t.slug === value.activeSlug)
      ? value.activeSlug
      : "";
    for (const topic of topics) {
      const p = value.progress[topic.slug];
      if (p) {
        const counters = [
          "total",
          "correct",
          "streak",
          "completedLevels",
          "lastScore",
          "bestScore",
          "completedSessions",
        ];
        if (
          !counters.every((k) => Number.isInteger(p[k]) && p[k] >= 0) ||
          p.correct > p.total ||
          p.bestScore > 100 ||
          p.lastScore > 100 ||
          typeof p.isCompleted !== "boolean" ||
          !Array.isArray(p.answeredItemIds) ||
          !p.answeredItemIds.every((x: unknown) => typeof x === "string") ||
          typeof p.updatedAt !== "string"
        )
          throw Error("Invalid progress");
        state.progress[topic.slug] = p;
      }
      const s = value.sessions[topic.slug];
      if (!s) continue;
      const validIds = new Set(topic.quizItems.map((q) => q.id));
      if (
        typeof s.id !== "string" ||
        !s.id ||
        !Array.isArray(s.itemIds) ||
        s.itemIds.length !== REQUIRED_QUIZ_ITEMS ||
        new Set(s.itemIds).size !== s.itemIds.length ||
        !s.itemIds.every((id: string) => validIds.has(id)) ||
        !Array.isArray(s.answers) ||
        typeof s.complete !== "boolean" ||
        !Number.isInteger(s.index) ||
        s.index < 0 ||
        s.index >= s.itemIds.length
      )
        continue;
      if (
        s.answers.length < s.index ||
        s.answers.length > s.index + 1 ||
        !s.answers.every(
          (a: SavedAnswer, i: number) =>
            a.itemId === s.itemIds[i] &&
            ["A", "B", "C", "D"].includes(a.selectedAnswer),
        )
      )
        continue;
      if (
        s.complete &&
        (s.answers.length !== s.itemIds.length ||
          s.index !== s.itemIds.length - 1)
      )
        continue;
      state.sessions[topic.slug] = s;
    }
    return state;
  } catch {
    return initialLearningState();
  }
}
