-- Row-level security for the crm module (AUTH.md §6).
-- Idempotent: db:init and test:rls apply it after migrations, and re-running is safe.
-- Policies read app.organization_id / app.clerk_user_id set per transaction by lib/db/tenant.ts.

ALTER TABLE "CrmAccount" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CrmAccount" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation" ON "CrmAccount";
CREATE POLICY "tenant_isolation" ON "CrmAccount"
FOR ALL
USING ("organizationId"::text = NULLIF(current_setting('app.organization_id', true), ''))
WITH CHECK ("organizationId"::text = NULLIF(current_setting('app.organization_id', true), ''));

ALTER TABLE "CrmActivity" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CrmActivity" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation" ON "CrmActivity";
CREATE POLICY "tenant_isolation" ON "CrmActivity"
FOR ALL
USING ("organizationId"::text = NULLIF(current_setting('app.organization_id', true), ''))
WITH CHECK ("organizationId"::text = NULLIF(current_setting('app.organization_id', true), ''));

ALTER TABLE "CrmContact" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CrmContact" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation" ON "CrmContact";
CREATE POLICY "tenant_isolation" ON "CrmContact"
FOR ALL
USING ("organizationId"::text = NULLIF(current_setting('app.organization_id', true), ''))
WITH CHECK ("organizationId"::text = NULLIF(current_setting('app.organization_id', true), ''));

ALTER TABLE "CrmDeal" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CrmDeal" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation" ON "CrmDeal";
CREATE POLICY "tenant_isolation" ON "CrmDeal"
FOR ALL
USING ("organizationId"::text = NULLIF(current_setting('app.organization_id', true), ''))
WITH CHECK ("organizationId"::text = NULLIF(current_setting('app.organization_id', true), ''));
