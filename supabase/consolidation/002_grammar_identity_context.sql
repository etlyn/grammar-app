BEGIN;
SET LOCAL lock_timeout = '3s';
SET LOCAL statement_timeout = '30s';

ALTER POLICY progress_read ON grammar.user_progress
  USING ((SELECT nullif(current_setting('etlyn.user_id', true), '')::uuid) = user_id);
ALTER POLICY progress_insert ON grammar.user_progress
  WITH CHECK ((SELECT nullif(current_setting('etlyn.user_id', true), '')::uuid) = user_id);
ALTER POLICY progress_update ON grammar.user_progress
  USING ((SELECT nullif(current_setting('etlyn.user_id', true), '')::uuid) = user_id)
  WITH CHECK ((SELECT nullif(current_setting('etlyn.user_id', true), '')::uuid) = user_id);
ALTER POLICY progress_delete ON grammar.user_progress
  USING ((SELECT nullif(current_setting('etlyn.user_id', true), '')::uuid) = user_id);
ALTER POLICY attempts_read ON grammar.quiz_attempts
  USING ((SELECT nullif(current_setting('etlyn.user_id', true), '')::uuid) = user_id);
ALTER POLICY attempts_insert ON grammar.quiz_attempts
  WITH CHECK ((SELECT nullif(current_setting('etlyn.user_id', true), '')::uuid) = user_id);

INSERT INTO grammar.schema_migrations(version) VALUES ('002_grammar_identity_context');
COMMIT;