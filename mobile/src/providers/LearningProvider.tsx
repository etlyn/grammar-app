import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  PASSING_ACCURACY,
  REQUIRED_QUIZ_ITEMS,
} from '@grammar/constants/learning';
import type {
  GrammarTopic,
  ProgressByTopic,
  QuizAttempt,
  TopicProgress,
} from '@grammar/types/grammar';
import { loadGrammarCatalog } from '@/services/contentService';

type ProgressTotals = {
  totalAnswers: number;
  correctAnswers: number;
  completedTopics: number;
  accuracy: number;
};

interface LearningContextValue {
  activeSlug: string;
  activeTopic?: GrammarTopic;
  loadingTopics: boolean;
  progress: ProgressByTopic;
  progressForActiveTopic?: TopicProgress;
  selectTopic: (slug: string) => void;
  recordAttempt: (attempt: QuizAttempt) => Promise<void>;
  resetTopic: (topicSlug: string) => Promise<void>;
  topics: GrammarTopic[];
  totals: ProgressTotals;
}

const STORAGE_KEY = 'grammacho:progress-v1';

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

const LearningContext = createContext<LearningContextValue>({
  activeSlug: '',
  loadingTopics: true,
  progress: {},
  selectTopic: () => undefined,
  recordAttempt: async () => undefined,
  resetTopic: async () => undefined,
  topics: [],
  totals: {
    totalAnswers: 0,
    correctAnswers: 0,
    completedTopics: 0,
    accuracy: 0,
  },
});

export const LearningProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [topics, setTopics] = useState<GrammarTopic[]>([]);
  const [activeSlug, setActiveSlug] = useState('');
  const [progress, setProgress] = useState<ProgressByTopic>({});
  const [loadingTopics, setLoadingTopics] = useState(true);
  const [hydratedProgress, setHydratedProgress] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const hydrate = async () => {
      try {
        const [catalog, storedProgress] = await Promise.all([
          loadGrammarCatalog(),
          AsyncStorage.getItem(STORAGE_KEY),
        ]);

        if (!isMounted) {
          return;
        }

        setTopics(catalog);
        setActiveSlug(current => current || catalog[0]?.slug || '');
        setProgress(storedProgress ? JSON.parse(storedProgress) : {});
      } catch (error) {
        console.warn('Failed to load grammar catalog', error);
      } finally {
        if (isMounted) {
          setHydratedProgress(true);
          setLoadingTopics(false);
        }
      }
    };

    hydrate();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!hydratedProgress) {
      return;
    }

    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(progress)).catch(error => {
      console.warn('Failed to store progress', error);
    });
  }, [hydratedProgress, progress]);

  const activeTopic = useMemo(
    () => topics.find(topic => topic.slug === activeSlug) ?? topics[0],
    [activeSlug, topics],
  );

  const progressForActiveTopic = activeTopic
    ? progress[activeTopic.slug]
    : undefined;

  const selectTopic = useCallback((slug: string) => {
    setActiveSlug(slug);
  }, []);

  const recordAttempt = useCallback(async (attempt: QuizAttempt) => {
    setProgress(current => {
      const existing = current[attempt.topicSlug] ?? emptyProgress();
      const total = existing.total + 1;
      const correct = existing.correct + (attempt.isCorrect ? 1 : 0);
      const streak = attempt.isCorrect ? existing.streak + 1 : 0;
      const answeredItemIds = Array.from(
        new Set([...existing.answeredItemIds, attempt.quizItemId]),
      );
      const lastScore = Math.round((correct / total) * 100);
      const isCompleted =
        total >= REQUIRED_QUIZ_ITEMS && lastScore >= PASSING_ACCURACY;

      return {
        ...current,
        [attempt.topicSlug]: {
          completedLevels: isCompleted ? 1 : 0,
          isCompleted,
          correct,
          total,
          streak,
          lastScore,
          answeredItemIds,
          updatedAt: new Date().toISOString(),
        },
      };
    });
  }, []);

  const resetTopic = useCallback(async (topicSlug: string) => {
    setProgress(current => {
      const next = { ...current };
      delete next[topicSlug];
      return next;
    });
  }, []);

  const totals = useMemo(() => {
    const values = Object.values(progress);
    const totalAnswers = values.reduce((sum, item) => sum + item.total, 0);
    const correctAnswers = values.reduce((sum, item) => sum + item.correct, 0);
    const completedTopics = values.filter(item => item.isCompleted).length;

    return {
      totalAnswers,
      correctAnswers,
      completedTopics,
      accuracy: totalAnswers
        ? Math.round((correctAnswers / totalAnswers) * 100)
        : 0,
    };
  }, [progress]);

  const value = useMemo(
    () => ({
      activeSlug: activeTopic?.slug ?? activeSlug,
      activeTopic,
      loadingTopics,
      progress,
      progressForActiveTopic,
      selectTopic,
      recordAttempt,
      resetTopic,
      topics,
      totals,
    }),
    [
      activeSlug,
      activeTopic,
      loadingTopics,
      progress,
      progressForActiveTopic,
      recordAttempt,
      resetTopic,
      selectTopic,
      topics,
      totals,
    ],
  );

  return (
    <LearningContext.Provider value={value}>
      {children}
    </LearningContext.Provider>
  );
};

export const useLearning = () => useContext(LearningContext);
