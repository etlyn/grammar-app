// @ts-nocheck Supabase Edge Functions run on Deno and are type-checked by the Supabase/Deno toolchain, not the Vite browser tsconfig.
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type GeneratedContent = {
  summary: string;
  guidance: string;
  learningGoals: string[];
  rules: Array<{
    title: string;
    explanation: string;
    examples: string[];
    commonMistakes?: string[];
  }>;
  tips: string[];
  quizItems: Array<{
    prompt: string;
    choices: Array<{ id: "A" | "B" | "C" | "D"; text: string }>;
    answerId: "A" | "B" | "C" | "D";
    hint: string;
    explanation: string;
    keywords: string[];
  }>;
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const systemPrompt = `You create original English grammar learning content. Do not quote or copy from copyrighted grammar books. Follow standard grammar-book pedagogy: meaning, form, use, signal words, examples, common mistakes, then practice. Use simple language for learners but keep grammar accurate.`;

serve(async (request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (request.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const openAiKey = Deno.env.get("OPENAI_API_KEY");

  if (!supabaseUrl || !serviceRoleKey) return json({ error: "Supabase service credentials are missing." }, 500);
  if (!openAiKey) return json({ error: "OPENAI_API_KEY is missing. Set it as a Supabase secret." }, 500);

  const { topicSlug, topicTitle, level = "A2" } = await request.json();
  if (!topicSlug || !topicTitle) return json({ error: "topicSlug and topicTitle are required." }, 400);

  const supabase = createClient(supabaseUrl, serviceRoleKey);

  const { data: existingTopic } = await supabase
    .from("grammar_topics")
    .select("slug,title,level,order_index,summary,guidance,learning_goals,rules,tips,source")
    .eq("slug", topicSlug)
    .maybeSingle();

  const { data: existingItems } = await supabase
    .from("grammar_quiz_items")
    .select("id,topic_slug,level,prompt,choices,answer_id,hint,explanation,keywords,source")
    .eq("topic_slug", topicSlug)
    .limit(20);

  if (existingTopic && existingItems && existingItems.length >= 20) {
    return json({
      reused: true,
      topic: {
        slug: existingTopic.slug,
        title: existingTopic.title,
        level: existingTopic.level,
        order: existingTopic.order_index,
        summary: existingTopic.summary,
        guidance: existingTopic.guidance,
        learningGoals: existingTopic.learning_goals,
        rules: existingTopic.rules,
        tips: existingTopic.tips,
        source: existingTopic.source,
        quizItems: existingItems.map((item) => ({
          id: item.id,
          topicSlug: item.topic_slug,
          level: item.level,
          prompt: item.prompt,
          choices: item.choices,
          answerId: item.answer_id,
          hint: item.hint,
          explanation: item.explanation,
          keywords: item.keywords,
          source: item.source,
        })),
      },
    });
  }

  const prompt = `Generate reusable content for an English grammar app topic.
Topic: ${topicTitle}
Learner level: ${level}
Return strict JSON with keys: summary, guidance, learningGoals, rules, tips, quizItems.
Rules: create 3-5 concise rules. Each rule has title, explanation, examples, optional commonMistakes.
Quiz items: create exactly 20 multiple-choice items. Each item has prompt with one blank shown as ____, four choices with ids A-D, answerId, hint, explanation, keywords.
Make questions useful for learning, not trivia. Include enough detail to understand the tense/topic in depth. Reuse standard grammar guidance, but write all text originally.`;

  const aiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${openAiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt },
      ],
      temperature: 0.5,
    }),
  });

  if (!aiResponse.ok) {
    const details = await aiResponse.text();
    return json({ error: "OpenAI request failed.", details }, 502);
  }

  const completion = await aiResponse.json();
  const content = JSON.parse(completion.choices?.[0]?.message?.content ?? "{}") as GeneratedContent;

  const { data: topic, error: topicError } = await supabase
    .from("grammar_topics")
    .upsert(
      {
        slug: topicSlug,
        title: topicTitle,
        level,
        summary: content.summary,
        guidance: content.guidance,
        learning_goals: content.learningGoals ?? [],
        rules: content.rules ?? [],
        tips: content.tips ?? [],
        source: "ai",
        updated_at: new Date().toISOString(),
      },
      { onConflict: "slug" },
    )
    .select("slug,title,level,order_index,summary,guidance,learning_goals,rules,tips,source")
    .single();

  if (topicError) return json({ error: topicError.message }, 500);

  const rows = (content.quizItems ?? []).map((item) => ({
    topic_slug: topicSlug,
    level,
    prompt: item.prompt,
    choices: item.choices,
    answer_id: item.answerId,
    hint: item.hint,
    explanation: item.explanation,
    keywords: item.keywords ?? [],
    source: "ai",
    updated_at: new Date().toISOString(),
  }));

  const { data: quizItems, error: quizError } = await supabase
    .from("grammar_quiz_items")
    .upsert(rows, { onConflict: "content_hash", ignoreDuplicates: false })
    .select("id,topic_slug,level,prompt,choices,answer_id,hint,explanation,keywords,source");

  if (quizError) return json({ error: quizError.message }, 500);

  return json({
    reused: false,
    topic: {
      slug: topic.slug,
      title: topic.title,
      level: topic.level,
      order: topic.order_index,
      summary: topic.summary,
      guidance: topic.guidance,
      learningGoals: topic.learning_goals,
      rules: topic.rules,
      tips: topic.tips,
      source: topic.source,
      quizItems: (quizItems ?? []).map((item) => ({
        id: item.id,
        topicSlug: item.topic_slug,
        level: item.level,
        prompt: item.prompt,
        choices: item.choices,
        answerId: item.answer_id,
        hint: item.hint,
        explanation: item.explanation,
        keywords: item.keywords,
        source: item.source,
      })),
    },
  });
});
