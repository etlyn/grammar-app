BEGIN;
SET LOCAL lock_timeout = '3s';
SET LOCAL statement_timeout = '30s';
-- Immutable complete topic payloads preserve teaching revisions alongside the
-- earlier normalized source releases. No learner data or browser access.
CREATE TABLE grammar.content_catalog_topics (
  version text NOT NULL,
  slug text NOT NULL,
  catalog_hash text NOT NULL CHECK (catalog_hash ~ '^[0-9a-f]{64}$'),
  payload jsonb NOT NULL CHECK (jsonb_typeof(payload) = 'object'),
  payload_md5 text GENERATED ALWAYS AS (md5(payload::text)) STORED,
  imported_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (version, slug),
  CHECK (payload->>'slug' = slug),
  CHECK (jsonb_array_length(payload->'quizItems') = 200)
);
ALTER TABLE grammar.content_catalog_topics ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON grammar.content_catalog_topics FROM PUBLIC, anon, authenticated, service_role, etlyn_grammar_runtime;
COMMENT ON TABLE grammar.content_catalog_topics IS 'Private immutable build catalog archive, including chapters and per-choice teaching. A release is published only when content_releases contains its matching hash.';
INSERT INTO grammar.schema_migrations(version) VALUES ('004_grammar_catalog_snapshots');
COMMIT;
