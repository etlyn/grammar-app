import { seedCurriculum } from "../data/curriculum";
import { supabase } from "../lib/supabase";
import type { CEFRLevel, GrammarTopic, QuizChoice, QuizItem } from "../types/grammar";

type DbTopic = {
  slug: string;
  title: string;
  level: CEFRLevel;
  order_index: number;
  summary: string | null;
  guidance: string | null;
  learning_goals: string[] | null;
  rules: GrammarTopic["rules"] | null;
  tips: string[] | null;
  source: "seed" | "ai" | "supabase" | null;
};

type DbQuizItem = {
  id: string;
  topic_slug: string;
  level: CEFRLevel;
  prompt: string;
  choices: QuizChoice[];
  answer_id: QuizChoice["id"];
  hint: string | null;
  explanation: string | null;
  keywords: string[] | null;
  source: "seed" | "ai" | "supabase" | null;
};

const bySlug = new Map(seedCurriculum.map((topic) => [topic.slug, topic]));

function hydrateTopic(row: DbTopic, quizItems: DbQuizItem[]): GrammarTopic {
  const fallback = bySlug.get(row.slug);
  const hydratedQuizItems: QuizItem[] = quizItems.map((item) => ({
    id: item.id,
    topicSlug: item.topic_slug,
    level: item.level,
    prompt: item.prompt,
    choices: item.choices,
    answerId: item.answer_id,
    hint: item.hint ?? "Read the sentence for time clues, subject agreement, and the meaning around the blank.",
    explanation: item.explanation ?? "The correct option best matches the meaning and grammar of the complete sentence.",
    keywords: item.keywords ?? [],
    source: item.source ?? "supabase",
  }));
  const fallbackQuizItems = (fallback?.quizItems ?? []).filter((item) => !hydratedQuizItems.some((existing) => existing.id === item.id));

  return {
    slug: row.slug,
    title: row.title,
    level: row.level ?? fallback?.level ?? "A2",
    order: row.order_index ?? fallback?.order ?? 999,
    summary: row.summary ?? fallback?.summary ?? "Study this grammar point with guided examples and practice.",
    learningGoals: row.learning_goals ?? fallback?.learningGoals ?? [],
    guidance: row.guidance ?? fallback?.guidance ?? "Read the examples, notice the form, then practice with feedback.",
    rules: row.rules ?? fallback?.rules ?? [],
    tips: row.tips ?? fallback?.tips ?? [],
    source: row.source ?? "supabase",
    quizItems: [...hydratedQuizItems, ...fallbackQuizItems],
  };
}

export async function loadGrammarCatalog(): Promise<GrammarTopic[]> {
  if (!supabase) return seedCurriculum;

  const [{ data: topics, error: topicsError }, { data: quizItems, error: quizError }] = await Promise.all([
    supabase.from("grammar_topics").select("slug,title,level,order_index,summary,guidance,learning_goals,rules,tips,source").order("order_index"),
    supabase.from("grammar_quiz_items").select("id,topic_slug,level,prompt,choices,answer_id,hint,explanation,keywords,source"),
  ]);

  if (topicsError || quizError || !topics?.length) {
    return seedCurriculum;
  }

  const quizByTopic = new Map<string, DbQuizItem[]>();
  (quizItems ?? []).forEach((item) => {
    const list = quizByTopic.get(item.topic_slug) ?? [];
    list.push(item as DbQuizItem);
    quizByTopic.set(item.topic_slug, list);
  });

  const remoteTopics = (topics as DbTopic[]).map((topic) => hydrateTopic(topic, quizByTopic.get(topic.slug) ?? []));
  const remoteSlugs = new Set(remoteTopics.map((topic) => topic.slug));
  const fallbackTopics = seedCurriculum.filter((topic) => !remoteSlugs.has(topic.slug));

  return [...remoteTopics, ...fallbackTopics].sort((a, b) => a.order - b.order);
}

export async function generateReusableContent(topic: GrammarTopic, level: CEFRLevel): Promise<GrammarTopic | null> {
  if (!supabase) return null;

  const { data, error } = await supabase.functions.invoke("generate-grammar-content", {
    body: {
      topicSlug: topic.slug,
      topicTitle: topic.title,
      level,
    },
  });

  if (error) throw error;
  if (!data?.topic) return null;

  const generated = data.topic as GrammarTopic;
  const existingIds = new Set(topic.quizItems.map((item) => item.id));

  return {
    ...topic,
    ...generated,
    order: topic.order,
    quizItems: [...topic.quizItems, ...generated.quizItems.filter((item: QuizItem) => !existingIds.has(item.id))],
  };
}
