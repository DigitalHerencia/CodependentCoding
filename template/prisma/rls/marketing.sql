-- Row-level security for the marketing module (AUTH.md §6).
-- Idempotent: db:init and test:rls apply it after migrations, and re-running is safe.
-- Policies read app.organization_id / app.clerk_user_id set per transaction by lib/db/tenant.ts.

ALTER TABLE "Audience" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Audience" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation" ON "Audience";
CREATE POLICY "tenant_isolation" ON "Audience"
FOR ALL
USING ("organizationId"::text = NULLIF(current_setting('app.organization_id', true), ''))
WITH CHECK ("organizationId"::text = NULLIF(current_setting('app.organization_id', true), ''));

ALTER TABLE "Campaign" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Campaign" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation" ON "Campaign";
CREATE POLICY "tenant_isolation" ON "Campaign"
FOR ALL
USING ("organizationId"::text = NULLIF(current_setting('app.organization_id', true), ''))
WITH CHECK ("organizationId"::text = NULLIF(current_setting('app.organization_id', true), ''));

ALTER TABLE "CampaignStep" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CampaignStep" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation" ON "CampaignStep";
CREATE POLICY "tenant_isolation" ON "CampaignStep"
FOR ALL
USING ("organizationId"::text = NULLIF(current_setting('app.organization_id', true), ''))
WITH CHECK ("organizationId"::text = NULLIF(current_setting('app.organization_id', true), ''));
