-- Row-level security for the crm module (AUTH.md §6).
-- CRM policy source; migration generation is governed by prisma.config.ts.
-- Do not edit historical migrations. Validate changes in a disposable RLS database.
-- Policies read app.organization_id / app.clerk_user_id set per transaction by lib/db/tenancy.ts.

ALTER TABLE "CrmAccount" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CrmAccount" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation" ON "CrmAccount";
CREATE POLICY "tenant_isolation" ON "CrmAccount"
FOR ALL TO app_runtime
USING ("organizationId" = (SELECT NULLIF(current_setting('app.organization_id', true), '')::uuid))
WITH CHECK ("organizationId" = (SELECT NULLIF(current_setting('app.organization_id', true), '')::uuid));

ALTER TABLE "CrmActivity" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CrmActivity" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation" ON "CrmActivity";
CREATE POLICY "tenant_isolation" ON "CrmActivity"
FOR ALL TO app_runtime
USING ("organizationId" = (SELECT NULLIF(current_setting('app.organization_id', true), '')::uuid))
WITH CHECK ("organizationId" = (SELECT NULLIF(current_setting('app.organization_id', true), '')::uuid));

ALTER TABLE "CrmContact" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CrmContact" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation" ON "CrmContact";
CREATE POLICY "tenant_isolation" ON "CrmContact"
FOR ALL TO app_runtime
USING ("organizationId" = (SELECT NULLIF(current_setting('app.organization_id', true), '')::uuid))
WITH CHECK ("organizationId" = (SELECT NULLIF(current_setting('app.organization_id', true), '')::uuid));

ALTER TABLE "CrmDeal" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CrmDeal" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation" ON "CrmDeal";
CREATE POLICY "tenant_isolation" ON "CrmDeal"
FOR ALL TO app_runtime
USING ("organizationId" = (SELECT NULLIF(current_setting('app.organization_id', true), '')::uuid))
WITH CHECK ("organizationId" = (SELECT NULLIF(current_setting('app.organization_id', true), '')::uuid));
