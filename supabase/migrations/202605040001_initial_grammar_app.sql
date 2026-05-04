create extension if not exists pgcrypto;

create table if not exists public.grammar_topics (
  slug text primary key,
  title text not null,
  level text not null default 'A2' check (level in ('A1', 'A2', 'B1', 'B2', 'C1')),
  order_index integer not null default 999,
  summary text,
  guidance text,
  learning_goals text[] not null default '{}',
  rules jsonb not null default '[]'::jsonb,
  tips text[] not null default '{}',
  source text not null default 'supabase' check (source in ('seed', 'ai', 'supabase')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.grammar_quiz_items (
  id uuid primary key default gen_random_uuid(),
  topic_slug text not null references public.grammar_topics(slug) on delete cascade,
  level text not null default 'A2' check (level in ('A1', 'A2', 'B1', 'B2', 'C1')),
  prompt text not null,
  choices jsonb not null,
  answer_id text not null check (answer_id in ('A', 'B', 'C', 'D')),
  hint text,
  explanation text,
  keywords text[] not null default '{}',
  source text not null default 'supabase' check (source in ('seed', 'ai', 'supabase')),
  content_hash text generated always as (md5(topic_slug || '|' || prompt || '|' || answer_id)) stored,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (content_hash)
);

create table if not exists public.user_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  topic_slug text not null,
  completed_levels integer not null default 0,
  is_completed boolean not null default false,
  correct integer not null default 0,
  total integer not null default 0,
  streak integer not null default 0,
  last_score integer not null default 0,
  answered_item_ids text[] not null default '{}',
  updated_at timestamptz not null default now(),
  primary key (user_id, topic_slug)
);

create table if not exists public.quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  topic_slug text not null,
  quiz_item_id text not null,
  selected_answer text not null check (selected_answer in ('A', 'B', 'C', 'D')),
  correct_answer text not null check (correct_answer in ('A', 'B', 'C', 'D')),
  is_correct boolean not null,
  created_at timestamptz not null default now()
);

create index if not exists grammar_topics_order_index_idx on public.grammar_topics(order_index);
create index if not exists grammar_quiz_items_topic_slug_idx on public.grammar_quiz_items(topic_slug);
create index if not exists quiz_attempts_user_topic_idx on public.quiz_attempts(user_id, topic_slug);

alter table public.grammar_topics enable row level security;
alter table public.grammar_quiz_items enable row level security;
alter table public.user_progress enable row level security;
alter table public.quiz_attempts enable row level security;

create policy "Anyone can read grammar topics"
  on public.grammar_topics for select
  using (true);

create policy "Anyone can read grammar quiz items"
  on public.grammar_quiz_items for select
  using (true);

create policy "Users can read own progress"
  on public.user_progress for select
  using (auth.uid() = user_id);

create policy "Users can upsert own progress"
  on public.user_progress for insert
  with check (auth.uid() = user_id);

create policy "Users can update own progress"
  on public.user_progress for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own progress"
  on public.user_progress for delete
  using (auth.uid() = user_id);

create policy "Users can insert own quiz attempts"
  on public.quiz_attempts for insert
  with check (auth.uid() = user_id);

create policy "Users can read own quiz attempts"
  on public.quiz_attempts for select
  using (auth.uid() = user_id);
