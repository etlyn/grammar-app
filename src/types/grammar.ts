export type CEFRLevel = "A1" | "A2" | "B1" | "B2" | "C1";

export type ContentSource = "seed" | "ai" | "supabase";

export type GrammarRule = {
  title: string;
  explanation: string;
  examples: string[];
  commonMistakes?: string[];
};

export type QuizChoice = {
  id: "A" | "B" | "C" | "D";
  text: string;
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
  source: ContentSource;
};

export type GrammarTopic = {
  slug: string;
  title: string;
  level: CEFRLevel;
  order: number;
  summary: string;
  learningGoals: string[];
  guidance: string;
  rules: GrammarRule[];
  tips: string[];
  quizItems: QuizItem[];
  source: ContentSource;
};

export type TopicProgress = {
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
