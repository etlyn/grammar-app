BEGIN;
SET LOCAL lock_timeout = '3s';
SET LOCAL statement_timeout = '30s';
-- Ledger counts describe newly inserted normalized banks/questions. Reading-only
-- archive releases legitimately add zero; negative counts remain invalid.
ALTER TABLE grammar.content_releases
  DROP CONSTRAINT content_releases_topic_count_check,
  ADD CONSTRAINT content_releases_topic_count_check CHECK (topic_count >= 0),
  DROP CONSTRAINT content_releases_question_count_check,
  ADD CONSTRAINT content_releases_question_count_check CHECK (question_count >= 0);
INSERT INTO grammar.schema_migrations(version) VALUES ('005_grammar_reading_only_releases');
COMMIT;
