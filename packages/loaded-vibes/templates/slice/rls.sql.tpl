-- Why: row-level security for the {{module}} module (AUTH.md §6): containment if an app predicate is ever missed.
-- Idempotent: db:init and test:rls apply it after migrations, and re-running is safe.
-- Policies read app.organization_id / app.clerk_user_id set per transaction by lib/db/tenant.ts.

ALTER TABLE "{{Entity}}" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "{{Entity}}" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation" ON "{{Entity}}";
CREATE POLICY "tenant_isolation" ON "{{Entity}}"
FOR ALL
USING ("organizationId"::text = NULLIF(current_setting('app.organization_id', true), ''))
WITH CHECK ("organizationId"::text = NULLIF(current_setting('app.organization_id', true), ''));
