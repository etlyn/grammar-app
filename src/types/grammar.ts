export type CEFRLevel = "A1" | "A2" | "B1" | "B2" | "C1";

export type ContentSource = "seed" | "ai" | "supabase";

export type GrammarRule = {
  id?: string;
  domain?: string;
  referenceIds?: string[];
  readingVersion?: string;
  title: string;
  explanation: string;
  examples: string[];
  commonMistakes?: string[];
  paragraphs?: string[];
  pattern?: string;
};

export type QuizChoice = {
  id: "A" | "B" | "C" | "D";
  text: string;
};

export type ContentProvenance = {
  version: string;
  kind: string;
  referenceIds: string[];
  reviewStatus: string;
  authorship?: string;
  assessment?: string;
};

export type QuizItem = {
  id: string;
  topicSlug: string;
  level: CEFRLevel;
  prompt: string;
  choices: QuizChoice[];
  answerId: QuizChoice["id"];
  hint: string;
  explanation: string;
  keywords: string[];
  skill?: string;
  contextKey?: string;
  fingerprint?: string;
  provenance?: ContentProvenance;
  teaching?: { steps: string[]; choiceReasons: Record<string, string> };
  source: ContentSource;
};

export type GrammarTopic = {
  slug: string;
  title: string;
  level: CEFRLevel;
  order: number;
  summary: string;
  stage?: string;
  prerequisites?: string[];
  readingReferenceIds?: string[];
  chapter?: {
    readingVersion?: string;
    introduction: string[];
    rules: GrammarRule[];
    recap: string[];
  };
  learningGoals: string[];
  guidance: string;
  rules: GrammarRule[];
  tips: string[];
  quizItems: QuizItem[];
  provenance?: ContentProvenance;
  source: ContentSource;
};

export type TopicProgress = {
  bestScore?: number;
  completedSessions?: number;
  completedLevels: number;
  isCompleted: boolean;
  correct: number;
  total: number;
  streak: number;
  lastScore: number;
  answeredItemIds: string[];
  updatedAt: string;
};

export type ProgressByTopic = Record<string, TopicProgress>;

export type QuizAttempt = {
  topicSlug: string;
  quizItemId: string;
  selectedAnswer: QuizChoice["id"];
  correctAnswer: QuizChoice["id"];
  isCorrect: boolean;
};

export type GrammarMap = {
  title: string;
  scope: string;
  description: string;
  referenceIds: string[];
  domains: {
    id: string;
    title: string;
    summary: string;
    referenceChapters: string;
    concepts: {
      id: string;
      title: string;
      topicSlug: string;
      topicTitle: string;
      order: number;
      stage: string;
      referenceIds: string[];
    }[];
  }[];
};
