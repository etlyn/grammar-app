# Shared Etlyn Supabase

## Current structure

Etlyn-owned applications share **Etlyn Apps** (`nqsclqtpnosuhoobgyxc`, AWS Ohio), formerly Task App, in **Etlyn's Org**. This is one managed PostgreSQL database and compute instance with separate schemas, not separate databases.

| Schema | Owner and access |
| --- | --- |
| `public` | Existing Offtasks tables and protected analytics migration metadata; unchanged by this consolidation. |
| `auth` | Shared Supabase identities; managed by Supabase. |
| `storage` | Shared Supabase Storage metadata; use app-specific buckets and policies when needed. |
| `analytics` | Private analytics data, owned by etlyn-server; existing tenant RLS and hourly retention remain intact. |
| `grammar` | Grammar content, progress, attempts, and migration metadata; private backend access only. |

Sharing Auth does not grant access to another app's data. Use app-scoped schemas, least-privilege database roles, RLS, and server-side authorization. Do not distribute project-wide privileged credentials to clients. Shared compute also shares capacity, outages, administrators, and Auth settings. Keep non-production and independently administered or sensitive client projects separate.

## Applied migrations

On 2026-09-12, these transactions were applied in order to Etlyn Apps:

1. [001_grammar_schema.sql](001_grammar_schema.sql): four Grammar tables, indexes, RLS, migration metadata, and `etlyn_grammar_runtime`.
2. [002_grammar_identity_context.sql](002_grammar_identity_context.sql): private transaction-local identity policies. The live bootstrap test showed that the managed Auth schema did not grant the requested runtime access; these policies do not depend on `auth.uid()`.

Both versions are recorded in `grammar.schema_migrations`. Do not replay these files against an initialized destination. Apply new changes as subsequent numbered migrations. Keep the historical bootstrap unchanged and always apply both migrations for a fresh installation.

The runtime role is `NOLOGIN`, has no password, cannot bypass RLS, owns no tables, and has no table access in `public`, `auth`, `storage`, or `analytics`. It can read content, read/write its user's progress, and insert/read its user's attempts. Content mutation and user-wide deletion require a separately reviewed backend workflow. Browser roles `anon` and `authenticated`, and the generic `service_role`, have no Grammar schema/table grants. Do not expose `grammar` through the Data API.

## Backend contract

FastAPI integration is intentionally deferred. Before enabling it:

- Verify the shared Supabase access token server-side, including its signature, issuer, audience, and expiry, and apply app authorization independently.
- Use a dedicated restricted database login and verified TLS, not `postgres` or the generic service-role key.
- Start a transaction and use a bound parameter with `SELECT set_config('etlyn.user_id', :verified_user_id, true)`. Derive this UUID from the verified identity, never from a request-body user ID.
- Perform the app queries in that same transaction; commit or roll back before returning a pooled connection. Missing identity denies user rows. A trusted backend connection can set this context, so RLS does not replace token verification.
- Keep AI generation, content writes, deletion, and business logic in etlyn-server. Do not deploy the legacy Grammar Edge Function into Etlyn Apps.

The web/mobile direct-Supabase clients still address the legacy `public` tables. They have not been rewired or deployed against Etlyn Apps. Leave their Supabase variables unset and use local learner mode until the FastAPI work is complete.

## Retirement and recovery

The standalone **Grammar App** project (`lhkotbpgeavmayogxxtl`, AWS Tokyo) was deleted on 2026-09-12 after destination verification and recovery export. Supabase confirmed deletion; the organization project list contains only Etlyn Apps. This removes the extra compute instance. Accrued hourly charges remain, and invoice totals depend on credits and other usage.

The final source inventory had zero rows in all four Grammar tables, one verified email/password user, one identity, no MFA factors, no Storage buckets/objects, no deployed Edge Functions, no custom public SQL functions, and no additional application schemas. No learning data needed copying. The existing verified account with the same normalized email in Etlyn Apps was retained; its credentials and UUID were not overwritten. The old Grammar password and sessions were not imported. Use the existing Etlyn Apps credentials or its password-reset flow when hosted authentication is implemented.

An encrypted recovery export is stored outside Git in the workspace hub's ignored `local/supabase/grammar-retirement-2026-09-12/` directory. It contains all 27 source `auth`/`public` tables and column, constraint, index, policy, and trigger metadata, plus a separate copy of the legacy Grammar schema. OpenPGP decryption and integrity were verified in memory, including the preserved password record and the account match. No plaintext Auth export was written to disk or returned in tool output.

The recovery directory and private key are owner-only. Preserve both the encrypted archive and private key in an approved encrypted backup; the current copy is local only. This is a data/metadata recovery archive, not a `pg_dump` or a complete Supabase project image. It excludes project API keys, service configuration, logs, and Storage objects; Storage was empty. Supabase's source physical backups were not downloadable and were removed with the project.

For recovery, decrypt on a trusted machine with a compatible OpenPGP implementation, inspect the JSON offline, and restore only the required records into a disposable compatible Supabase project first. Use the archived legacy SQL for the four original app tables. Reconcile account UUIDs before importing user-owned data. Do not overwrite the shared target Auth schema, import historical Auth migrations, or revive old sessions/refresh tokens. A full managed-Auth restore rehearsal has not been performed.

## Verification

Run [verify.sql](verify.sql) as an administrator in one connection. It tests API-role denial, cross-app table isolation, user isolation, and rollback cleanup using synthetic users and a temporary role membership. It ends in `ROLLBACK`; never change that to `COMMIT`.

The schema and verification SQL passed in temporary PGlite, including a run with Auth-schema access revoked and preservation of an unrelated app table/grant. Live Supabase checks passed after migration 002. Follow-up queries confirmed both versions, zero Grammar rows, no synthetic users, runtime login disabled, existing public tables retained, and the analytics retention job still active at `17 * * * *`.