import { useCallback, useEffect, useMemo, useState } from "react";
import { grammarCatalog, catalogVersion } from "../services/contentService";
import {
  createSession,
  initialLearningState,
  reduceLearning,
  restoreLearning,
  type LearningAction,
} from "../utils/learningState";
import type { QuizChoice } from "../types/grammar";
const STORAGE_KEY = `grammacho-web-progress:${catalogVersion}`;

export function useProgress() {
  const [storageMessage, setStorageMessage] = useState("");
  const [state, setState] = useState(() => {
    try {
      return restoreLearning(
        window.localStorage.getItem(STORAGE_KEY),
        grammarCatalog,
      );
    } catch {
      return initialLearningState();
    }
  });
  const [legacyProgress] = useState(() => {
    try {
      return Boolean(window.localStorage.getItem("grammar-app-progress-v2"));
    } catch {
      return false;
    }
  });
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      setStorageMessage("");
    } catch {
      setStorageMessage(
        "Your browser could not save progress. You can keep practising, but this session may be lost when you close the page.",
      );
    }
  }, [state]);
  const dispatch = useCallback(
    (action: LearningAction) =>
      setState((current) => reduceLearning(current, action, grammarCatalog)),
    [],
  );
  const startSession = useCallback((slug: string) => {
    const topic = grammarCatalog.find((t) => t.slug === slug);
    if (!topic) return;
    setState((current) =>
      reduceLearning(
        current,
        {
          type: "start",
          slug,
          session: createSession(
            topic,
            current.progress[slug]?.answeredItemIds,
          ),
        },
        grammarCatalog,
      ),
    );
  }, []);
  const selectTopic = useCallback(
    (slug: string) => dispatch({ type: "select", slug }),
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
  const totals = useMemo(() => {
    const values = Object.values(state.progress);
    const totalAnswers = values.reduce((s, p) => s + p.total, 0);
    const correctAnswers = values.reduce((s, p) => s + p.correct, 0);
    return {
      totalAnswers,
      correctAnswers,
      completedTopics: values.filter((p) => p.isCompleted).length,
      accuracy: totalAnswers
        ? Math.round((correctAnswers / totalAnswers) * 100)
        : 0,
    };
  }, [state.progress]);
  return {
    ...state,
    totals,
    storageMessage,
    legacyProgress,
    startSession,
    selectTopic,
    answer,
    next,
    resetTopic,
  };
}
