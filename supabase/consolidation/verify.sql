BEGIN;
SET LOCAL statement_timeout = '15s';
DO $verify$
DECLARE api_role text;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM grammar.schema_migrations WHERE version = '002_grammar_identity_context') THEN
    RAISE EXCEPTION 'Unexpected grammar schema version';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'etlyn_grammar_runtime') THEN
    RAISE EXCEPTION 'Missing grammar runtime role';
  END IF;
  FOREACH api_role IN ARRAY ARRAY['anon', 'authenticated', 'service_role'] LOOP
    IF has_schema_privilege(api_role, 'grammar', 'USAGE,CREATE') THEN
      RAISE EXCEPTION 'Grammar schema exposed to %', api_role;
    END IF;
    IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'grammar'
      AND has_table_privilege(api_role, format('%I.%I', schemaname, tablename), 'SELECT,INSERT,UPDATE,DELETE,TRUNCATE')) THEN
      RAISE EXCEPTION 'Grammar table exposed to %', api_role;
    END IF;
  END LOOP;
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'etlyn_grammar_runtime'
    AND (rolcanlogin OR rolsuper OR rolbypassrls OR rolcreatedb OR rolcreaterole)) THEN
    RAISE EXCEPTION 'Unsafe grammar runtime role';
  END IF;
  IF EXISTS (SELECT 1 FROM pg_class JOIN pg_namespace ON pg_namespace.oid = relnamespace
    WHERE nspname IN ('public', 'auth', 'storage', 'analytics') AND relkind IN ('r', 'p')
    AND has_table_privilege('etlyn_grammar_runtime', pg_class.oid, 'SELECT,INSERT,UPDATE,DELETE,TRUNCATE')) THEN
    RAISE EXCEPTION 'Grammar runtime can access another application';
  END IF;
END $verify$;

INSERT INTO auth.users(id) VALUES
  ('11111111-1111-4111-8111-111111111111'),
  ('22222222-2222-4222-8222-222222222222');
GRANT etlyn_grammar_runtime TO CURRENT_USER;
SET LOCAL ROLE etlyn_grammar_runtime;
DO $probe$
BEGIN
  IF EXISTS (SELECT 1 FROM grammar.user_progress) THEN
    RAISE EXCEPTION 'Progress visible without identity';
  END IF;
  PERFORM set_config('etlyn.user_id', '11111111-1111-4111-8111-111111111111', true);
  INSERT INTO grammar.user_progress(user_id, topic_slug) VALUES (current_setting('etlyn.user_id')::uuid, '__consolidation_probe');
  UPDATE grammar.user_progress SET last_score = 80 WHERE user_id = current_setting('etlyn.user_id')::uuid AND topic_slug = '__consolidation_probe';
  IF NOT EXISTS (SELECT 1 FROM grammar.user_progress WHERE topic_slug = '__consolidation_probe' AND last_score = 80) THEN
    RAISE EXCEPTION 'Own progress write/read failed';
  END IF;
  INSERT INTO grammar.quiz_attempts(user_id, topic_slug, quiz_item_id, selected_answer, correct_answer, is_correct)
  VALUES (current_setting('etlyn.user_id')::uuid, '__consolidation_probe', '__item', 'A', 'A', true);
  IF NOT EXISTS (SELECT 1 FROM grammar.quiz_attempts WHERE topic_slug = '__consolidation_probe') THEN
    RAISE EXCEPTION 'Own attempt write/read failed';
  END IF;
  PERFORM set_config('etlyn.user_id', '', true);
  IF EXISTS (SELECT 1 FROM grammar.user_progress WHERE topic_slug = '__consolidation_probe')
    OR EXISTS (SELECT 1 FROM grammar.quiz_attempts WHERE topic_slug = '__consolidation_probe') THEN
    RAISE EXCEPTION 'User data visible without identity';
  END IF;
  PERFORM set_config('etlyn.user_id', '22222222-2222-4222-8222-222222222222', true);
  IF EXISTS (SELECT 1 FROM grammar.user_progress WHERE topic_slug = '__consolidation_probe') THEN
    RAISE EXCEPTION 'Cross-user read succeeded';
  END IF;
  IF EXISTS (SELECT 1 FROM grammar.quiz_attempts WHERE topic_slug = '__consolidation_probe') THEN
    RAISE EXCEPTION 'Cross-user attempt read succeeded';
  END IF;
  BEGIN
    INSERT INTO grammar.quiz_attempts(user_id, topic_slug, quiz_item_id, selected_answer, correct_answer, is_correct)
    VALUES ('11111111-1111-4111-8111-111111111111', '__consolidation_probe', '__item', 'A', 'A', true);
    RAISE EXCEPTION 'Cross-user attempt insert succeeded';
  EXCEPTION WHEN insufficient_privilege THEN NULL;
  END;
  BEGIN
    INSERT INTO grammar.user_progress(user_id, topic_slug)
    VALUES ('11111111-1111-4111-8111-111111111111', '__other_probe');
    RAISE EXCEPTION 'Cross-user insert succeeded';
  EXCEPTION WHEN insufficient_privilege THEN NULL;
  END;
  UPDATE grammar.user_progress SET last_score = 0 WHERE topic_slug = '__consolidation_probe';
  DELETE FROM grammar.user_progress WHERE topic_slug = '__consolidation_probe';
  PERFORM set_config('etlyn.user_id', '11111111-1111-4111-8111-111111111111', true);
  IF NOT EXISTS (SELECT 1 FROM grammar.user_progress WHERE topic_slug = '__consolidation_probe' AND last_score = 80) THEN
    RAISE EXCEPTION 'Cross-user update/delete changed data';
  END IF;
  DELETE FROM grammar.user_progress WHERE user_id = current_setting('etlyn.user_id')::uuid AND topic_slug = '__consolidation_probe';
  IF EXISTS (SELECT 1 FROM grammar.user_progress WHERE topic_slug = '__consolidation_probe') THEN
    RAISE EXCEPTION 'Own progress delete failed';
  END IF;
END $probe$;
RESET ROLE;
SELECT 'Grammar grants and RLS checks passed; synthetic users and membership rolled back' AS result;
ROLLBACK;