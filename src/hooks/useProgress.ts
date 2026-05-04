import { useCallback, useEffect, useMemo, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { PASSING_ACCURACY, REQUIRED_QUIZ_ITEMS } from "../constants/learning";
import { supabase } from "../lib/supabase";
import type { ProgressByTopic, QuizAttempt, TopicProgress } from "../types/grammar";

const STORAGE_KEY = "grammar-app-progress-v2";

const emptyProgress = (): TopicProgress => ({
  completedLevels: 0,
  isCompleted: false,
  correct: 0,
  total: 0,
  streak: 0,
  lastScore: 0,
  answeredItemIds: [],
  updatedAt: new Date().toISOString(),
});

const readLocalProgress = (): ProgressByTopic => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ProgressByTopic) : {};
  } catch {
    return {};
  }
};

export function useProgress(user: User | null) {
  const [progress, setProgress] = useState<ProgressByTopic>({});
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    setProgress(readLocalProgress());
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  useEffect(() => {
    const loadRemoteProgress = async () => {
      if (!supabase || !user) return;

      setSyncing(true);
      const { data, error } = await supabase
        .from("user_progress")
        .select("topic_slug, completed_levels, is_completed, correct, total, streak, last_score, answered_item_ids, updated_at")
        .eq("user_id", user.id);

      if (!error && data) {
        setProgress((current) => {
          const merged = { ...current };
          data.forEach((row) => {
            const local = merged[row.topic_slug] ?? emptyProgress();
            const total = Math.max(local.total, row.total ?? 0);
            const correct = Math.max(local.correct, row.correct ?? 0);
            const lastScore = total ? Math.round((correct / total) * 100) : 0;
            const isCompleted = Boolean(local.isCompleted || row.is_completed || (total >= REQUIRED_QUIZ_ITEMS && lastScore >= PASSING_ACCURACY));

            merged[row.topic_slug] = {
              completedLevels: isCompleted ? 1 : Math.max(local.completedLevels, row.completed_levels ?? 0),
              isCompleted,
              correct,
              total,
              streak: Math.max(local.streak, row.streak ?? 0),
              lastScore: Math.max(local.lastScore, row.last_score ?? lastScore),
              answeredItemIds: Array.from(new Set([...(local.answeredItemIds ?? []), ...((row.answered_item_ids as string[]) ?? [])])),
              updatedAt: row.updated_at ?? local.updatedAt,
            };
          });
          return merged;
        });
      }
      setSyncing(false);
    };

    loadRemoteProgress();
  }, [user]);

  const upsertRemoteProgress = useCallback(
    async (topicSlug: string, next: TopicProgress) => {
      if (!supabase || !user) return;

      await supabase.from("user_progress").upsert(
        {
          user_id: user.id,
          topic_slug: topicSlug,
          completed_levels: next.completedLevels,
          is_completed: next.isCompleted,
          correct: next.correct,
          total: next.total,
          streak: next.streak,
          last_score: next.lastScore,
          answered_item_ids: next.answeredItemIds,
          updated_at: next.updatedAt,
        },
        { onConflict: "user_id,topic_slug" },
      );
    },
    [user],
  );

  const recordAttempt = useCallback(
    async (attempt: QuizAttempt) => {
      let nextForTopic: TopicProgress | null = null;

      setProgress((current) => {
        const existing = current[attempt.topicSlug] ?? emptyProgress();
        const total = existing.total + 1;
        const correct = existing.correct + (attempt.isCorrect ? 1 : 0);
        const streak = attempt.isCorrect ? existing.streak + 1 : 0;
        const answeredItemIds = Array.from(new Set([...existing.answeredItemIds, attempt.quizItemId]));
        const lastScore = Math.round((correct / total) * 100);
        const isCompleted = total >= REQUIRED_QUIZ_ITEMS && lastScore >= PASSING_ACCURACY;
        const completedLevels = isCompleted ? 1 : 0;

        const updatedProgress: TopicProgress = {
          completedLevels,
          isCompleted,
          correct,
          total,
          streak,
          lastScore,
          answeredItemIds,
          updatedAt: new Date().toISOString(),
        };
        nextForTopic = updatedProgress;

        return {
          ...current,
          [attempt.topicSlug]: updatedProgress,
        };
      });

      if (supabase && user) {
        await supabase.from("quiz_attempts").insert({
          user_id: user.id,
          topic_slug: attempt.topicSlug,
          quiz_item_id: attempt.quizItemId,
          selected_answer: attempt.selectedAnswer,
          correct_answer: attempt.correctAnswer,
          is_correct: attempt.isCorrect,
        });

        if (nextForTopic) {
          await upsertRemoteProgress(attempt.topicSlug, nextForTopic);
        }
      }
    },
    [upsertRemoteProgress, user],
  );

  const resetTopic = useCallback(
    async (topicSlug: string) => {
      setProgress((current) => {
        const next = { ...current };
        delete next[topicSlug];
        return next;
      });

      if (supabase && user) {
        await supabase.from("user_progress").delete().eq("user_id", user.id).eq("topic_slug", topicSlug);
      }
    },
    [user],
  );

  const totals = useMemo(() => {
    const values = Object.values(progress);
    const totalAnswers = values.reduce((sum, item) => sum + item.total, 0);
    const correctAnswers = values.reduce((sum, item) => sum + item.correct, 0);
    const completedTopics = values.filter((item) => item.isCompleted).length;

    return {
      totalAnswers,
      correctAnswers,
      completedTopics,
      accuracy: totalAnswers ? Math.round((correctAnswers / totalAnswers) * 100) : 0,
    };
  }, [progress]);

  return { progress, totals, syncing, recordAttempt, resetTopic };
}
