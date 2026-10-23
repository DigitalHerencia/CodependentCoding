-- Row-level security for the ai module (AUTH.md §6).
-- Idempotent: db:init and test:rls apply it after migrations, and re-running is safe.
-- Policies read app.organization_id / app.clerk_user_id set per transaction by lib/db/tenant.ts.

ALTER TABLE "AiGeneration" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AiGeneration" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation" ON "AiGeneration";
CREATE POLICY "tenant_isolation" ON "AiGeneration"
FOR ALL
USING ("organizationId"::text = NULLIF(current_setting('app.organization_id', true), ''))
WITH CHECK ("organizationId"::text = NULLIF(current_setting('app.organization_id', true), ''));

ALTER TABLE "AiUsageLedger" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AiUsageLedger" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation" ON "AiUsageLedger";
CREATE POLICY "tenant_isolation" ON "AiUsageLedger"
FOR ALL
USING ("organizationId"::text = NULLIF(current_setting('app.organization_id', true), ''))
WITH CHECK ("organizationId"::text = NULLIF(current_setting('app.organization_id', true), ''));
