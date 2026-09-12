BEGIN;
SET LOCAL lock_timeout = '3s';
SET LOCAL statement_timeout = '30s';

CREATE SCHEMA grammar;
REVOKE ALL ON SCHEMA grammar FROM PUBLIC, anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA grammar REVOKE ALL ON TABLES FROM anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA grammar REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC, anon, authenticated, service_role;

CREATE ROLE etlyn_grammar_runtime NOLOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOBYPASSRLS;
GRANT USAGE ON SCHEMA grammar, auth TO etlyn_grammar_runtime;
GRANT EXECUTE ON FUNCTION auth.uid() TO etlyn_grammar_runtime;

CREATE TABLE grammar.grammar_topics (
  slug text PRIMARY KEY,
  title text NOT NULL,
  level text NOT NULL DEFAULT 'A2' CHECK (level IN ('A1', 'A2', 'B1', 'B2', 'C1')),
  order_index integer NOT NULL DEFAULT 999,
  summary text,
  guidance text,
  learning_goals text[] NOT NULL DEFAULT '{}',
  rules jsonb NOT NULL DEFAULT '[]'::jsonb,
  tips text[] NOT NULL DEFAULT '{}',
  source text NOT NULL DEFAULT 'supabase' CHECK (source IN ('seed', 'ai', 'supabase')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE grammar.grammar_quiz_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_slug text NOT NULL REFERENCES grammar.grammar_topics(slug) ON DELETE CASCADE,
  level text NOT NULL DEFAULT 'A2' CHECK (level IN ('A1', 'A2', 'B1', 'B2', 'C1')),
  prompt text NOT NULL,
  choices jsonb NOT NULL,
  answer_id text NOT NULL CHECK (answer_id IN ('A', 'B', 'C', 'D')),
  hint text,
  explanation text,
  keywords text[] NOT NULL DEFAULT '{}',
  source text NOT NULL DEFAULT 'supabase' CHECK (source IN ('seed', 'ai', 'supabase')),
  content_hash text GENERATED ALWAYS AS (md5(topic_slug || '|' || prompt || '|' || answer_id)) STORED,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (content_hash)
);

CREATE TABLE grammar.user_progress (
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  topic_slug text NOT NULL,
  completed_levels integer NOT NULL DEFAULT 0,
  is_completed boolean NOT NULL DEFAULT false,
  correct integer NOT NULL DEFAULT 0,
  total integer NOT NULL DEFAULT 0,
  streak integer NOT NULL DEFAULT 0,
  last_score integer NOT NULL DEFAULT 0,
  answered_item_ids text[] NOT NULL DEFAULT '{}',
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, topic_slug)
);

CREATE TABLE grammar.quiz_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  topic_slug text NOT NULL,
  quiz_item_id text NOT NULL,
  selected_answer text NOT NULL CHECK (selected_answer IN ('A', 'B', 'C', 'D')),
  correct_answer text NOT NULL CHECK (correct_answer IN ('A', 'B', 'C', 'D')),
  is_correct boolean NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX grammar_topics_order_index_idx ON grammar.grammar_topics(order_index);
CREATE INDEX grammar_quiz_items_topic_slug_idx ON grammar.grammar_quiz_items(topic_slug);
CREATE INDEX quiz_attempts_user_topic_idx ON grammar.quiz_attempts(user_id, topic_slug);

ALTER TABLE grammar.grammar_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE grammar.grammar_quiz_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE grammar.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE grammar.user_progress FORCE ROW LEVEL SECURITY;
ALTER TABLE grammar.quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE grammar.quiz_attempts FORCE ROW LEVEL SECURITY;

CREATE POLICY topics_read ON grammar.grammar_topics FOR SELECT TO etlyn_grammar_runtime USING (true);
CREATE POLICY quiz_items_read ON grammar.grammar_quiz_items FOR SELECT TO etlyn_grammar_runtime USING (true);
CREATE POLICY progress_read ON grammar.user_progress FOR SELECT TO etlyn_grammar_runtime USING ((SELECT auth.uid()) = user_id);
CREATE POLICY progress_insert ON grammar.user_progress FOR INSERT TO etlyn_grammar_runtime WITH CHECK ((SELECT auth.uid()) = user_id);
CREATE POLICY progress_update ON grammar.user_progress FOR UPDATE TO etlyn_grammar_runtime
  USING ((SELECT auth.uid()) = user_id) WITH CHECK ((SELECT auth.uid()) = user_id);
CREATE POLICY progress_delete ON grammar.user_progress FOR DELETE TO etlyn_grammar_runtime USING ((SELECT auth.uid()) = user_id);
CREATE POLICY attempts_read ON grammar.quiz_attempts FOR SELECT TO etlyn_grammar_runtime USING ((SELECT auth.uid()) = user_id);
CREATE POLICY attempts_insert ON grammar.quiz_attempts FOR INSERT TO etlyn_grammar_runtime WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE TABLE grammar.schema_migrations (
  version text PRIMARY KEY,
  applied_at timestamptz NOT NULL DEFAULT now()
);
INSERT INTO grammar.schema_migrations(version) VALUES ('001_grammar_schema');

REVOKE ALL ON ALL TABLES IN SCHEMA grammar FROM PUBLIC, anon, authenticated, service_role;
GRANT SELECT ON grammar.grammar_topics, grammar.grammar_quiz_items TO etlyn_grammar_runtime;
GRANT SELECT, INSERT, UPDATE, DELETE ON grammar.user_progress TO etlyn_grammar_runtime;
GRANT SELECT, INSERT ON grammar.quiz_attempts TO etlyn_grammar_runtime;
ALTER ROLE etlyn_grammar_runtime SET statement_timeout = '3s';
ALTER ROLE etlyn_grammar_runtime SET lock_timeout = '2s';
ALTER ROLE etlyn_grammar_runtime SET idle_in_transaction_session_timeout = '30s';
COMMIT;