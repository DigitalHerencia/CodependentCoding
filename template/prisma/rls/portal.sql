-- Row-level security for the portal module (AUTH.md §6).
-- Idempotent: db:init and test:rls apply it after migrations, and re-running is safe.
-- Policies read app.organization_id / app.clerk_user_id set per transaction by lib/db/tenant.ts.

ALTER TABLE "PortalApproval" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "PortalApproval" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation" ON "PortalApproval";
CREATE POLICY "tenant_isolation" ON "PortalApproval"
FOR ALL
USING ("organizationId"::text = NULLIF(current_setting('app.organization_id', true), ''))
WITH CHECK ("organizationId"::text = NULLIF(current_setting('app.organization_id', true), ''));

ALTER TABLE "PortalDocument" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "PortalDocument" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation" ON "PortalDocument";
CREATE POLICY "tenant_isolation" ON "PortalDocument"
FOR ALL
USING ("organizationId"::text = NULLIF(current_setting('app.organization_id', true), ''))
WITH CHECK ("organizationId"::text = NULLIF(current_setting('app.organization_id', true), ''));

ALTER TABLE "PortalDocumentVersion" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "PortalDocumentVersion" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation" ON "PortalDocumentVersion";
CREATE POLICY "tenant_isolation" ON "PortalDocumentVersion"
FOR ALL
USING ("organizationId"::text = NULLIF(current_setting('app.organization_id', true), ''))
WITH CHECK ("organizationId"::text = NULLIF(current_setting('app.organization_id', true), ''));
