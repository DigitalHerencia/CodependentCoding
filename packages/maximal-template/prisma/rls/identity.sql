-- Database roles and row-level security for the identity tables (AUTH.md §6,
-- doctrine 05-data). Applied first, before every module file.
-- Readable source: `pnpm db:rls` writes it into a migration (CC-MIG-001). Idempotent.
-- Policies read app.organization_id / app.clerk_user_id set per transaction by lib/db/tenancy.ts.

-- Roles (CC-DB-004). Created here in SQL, never in the Neon Console (Console
-- roles join neon_superuser, which carries BYPASSRLS). Passwords are set out of
-- band (`ALTER ROLE app_runtime PASSWORD ...`); neither role owns a table.
--   app_runtime: the application (DATABASE_URL, pooled).
--   app_system:  webhook and cron handlers (DATABASE_URL_SYSTEM), system tables only.
DO $$
DECLARE
  role_name text;
BEGIN
  FOREACH role_name IN ARRAY ARRAY['app_runtime', 'app_system'] LOOP
    IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = role_name) THEN
      EXECUTE format(
        'CREATE ROLE %I LOGIN NOSUPERUSER NOBYPASSRLS NOCREATEDB NOCREATEROLE',
        role_name
      );
    ELSIF EXISTS (
      SELECT FROM pg_roles
      WHERE rolname = role_name AND (rolsuper OR rolbypassrls)
    ) THEN
      RAISE EXCEPTION '% is SUPERUSER or BYPASSRLS; drop it and rerun', role_name;
    END IF;
  END LOOP;
END $$;

GRANT USAGE ON SCHEMA public TO app_runtime, app_system;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO app_runtime;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO app_runtime;
-- Prisma's migration ledger belongs to the owner alone (absent in Prisma's
-- shadow database, hence the guard).
DO $$
BEGIN
  IF to_regclass('public."_prisma_migrations"') IS NOT NULL THEN
    REVOKE ALL ON "_prisma_migrations" FROM app_runtime, app_system;
  END IF;
END $$;
-- The audit trail is insert-only (ledger D-6).
REVOKE UPDATE, DELETE ON "AuditEvent" FROM app_runtime;
GRANT SELECT, INSERT, UPDATE, DELETE ON "WebhookEvent", "IdempotencyRecord" TO app_system;

-- Every policy compares the column to the cast setting in a scalar sub-select
-- (CC-RLS-002): the (organizationId, ...) indexes stay usable and the setting is
-- read once per statement. NULLIF turns "not set" into NULL: zero rows.

-- System tables (ledger D-7): written before a tenant is known. RLS is forced
-- like everywhere else; app_system has full access through its own policy.
-- IdempotencyRecord rows that carry an organization are also reachable by the
-- runtime inside that organization (tenant actions claim keys there).
ALTER TABLE "IdempotencyRecord" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "IdempotencyRecord" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "system_access" ON "IdempotencyRecord";
CREATE POLICY "system_access" ON "IdempotencyRecord"
FOR ALL TO app_system
USING (true)
WITH CHECK (true);
DROP POLICY IF EXISTS "tenant_isolation" ON "IdempotencyRecord";
CREATE POLICY "tenant_isolation" ON "IdempotencyRecord"
FOR ALL TO app_runtime
USING ("organizationId" = (SELECT NULLIF(current_setting('app.organization_id', true), '')::uuid))
WITH CHECK ("organizationId" = (SELECT NULLIF(current_setting('app.organization_id', true), '')::uuid));

ALTER TABLE "WebhookEvent" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "WebhookEvent" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "system_access" ON "WebhookEvent";
CREATE POLICY "system_access" ON "WebhookEvent"
FOR ALL TO app_system
USING (true)
WITH CHECK (true);
-- Interim: the webhook handlers still run on the runtime connection until they
-- move to app_system (withSystemTransaction, CC-077). Drop this policy and
-- REVOKE the runtime's grants on "WebhookEvent" in that change.
DROP POLICY IF EXISTS "webhook_ledger_runtime_interim" ON "WebhookEvent";
CREATE POLICY "webhook_ledger_runtime_interim" ON "WebhookEvent"
FOR ALL TO app_runtime
USING (true)
WITH CHECK (true);


