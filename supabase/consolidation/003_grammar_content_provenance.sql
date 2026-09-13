BEGIN;
SET LOCAL lock_timeout = '3s';
SET LOCAL statement_timeout = '30s';

-- Content metadata only. Existing grants, RLS and learner tables are unchanged.
ALTER TABLE grammar.grammar_topics ADD COLUMN source_metadata jsonb NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE grammar.grammar_quiz_items ADD COLUMN source_metadata jsonb NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE grammar.grammar_quiz_items ADD COLUMN fingerprint text;
CREATE UNIQUE INDEX grammar_quiz_items_fingerprint_idx ON grammar.grammar_quiz_items(fingerprint) WHERE fingerprint IS NOT NULL;
ALTER TABLE grammar.grammar_quiz_items ADD CONSTRAINT grammar_quiz_items_fingerprint_shape CHECK (fingerprint IS NULL OR fingerprint ~ '^[0-9a-f]{64}$');

CREATE TABLE grammar.content_releases (
  version text PRIMARY KEY,
  content_hash text NOT NULL CHECK (content_hash ~ '^[0-9a-f]{64}$'),
  topic_count integer NOT NULL CHECK (topic_count > 0),
  question_count integer NOT NULL CHECK (question_count > 0),
  sources jsonb NOT NULL,
  review_status text NOT NULL,
  imported_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE grammar.content_releases ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON grammar.content_releases FROM PUBLIC, anon, authenticated, service_role, etlyn_grammar_runtime;
INSERT INTO grammar.schema_migrations(version) VALUES ('003_grammar_content_provenance');
COMMIT;
