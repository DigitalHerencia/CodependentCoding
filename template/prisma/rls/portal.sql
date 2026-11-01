-- Row-level security for the portal module (AUTH.md §6).
-- Readable source: `pnpm db:rls` writes it into a migration (CC-MIG-001). Idempotent.
-- Policies read app.organization_id / app.clerk_user_id set per transaction by lib/db/tenant.ts.

ALTER TABLE "PortalApproval" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "PortalApproval" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation" ON "PortalApproval";
CREATE POLICY "tenant_isolation" ON "PortalApproval"
FOR ALL TO app_runtime
USING ("organizationId" = (SELECT NULLIF(current_setting('app.organization_id', true), '')::uuid))
WITH CHECK ("organizationId" = (SELECT NULLIF(current_setting('app.organization_id', true), '')::uuid));

ALTER TABLE "PortalDocument" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "PortalDocument" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation" ON "PortalDocument";
CREATE POLICY "tenant_isolation" ON "PortalDocument"
FOR ALL TO app_runtime
USING ("organizationId" = (SELECT NULLIF(current_setting('app.organization_id', true), '')::uuid))
WITH CHECK ("organizationId" = (SELECT NULLIF(current_setting('app.organization_id', true), '')::uuid));

ALTER TABLE "PortalDocumentVersion" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "PortalDocumentVersion" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation" ON "PortalDocumentVersion";
CREATE POLICY "tenant_isolation" ON "PortalDocumentVersion"
FOR ALL TO app_runtime
USING ("organizationId" = (SELECT NULLIF(current_setting('app.organization_id', true), '')::uuid))
WITH CHECK ("organizationId" = (SELECT NULLIF(current_setting('app.organization_id', true), '')::uuid));
