-- Row-level security for the support module (AUTH.md §6).
-- Readable source: `pnpm db:rls` writes it into a migration (CC-MIG-001). Idempotent.
-- Policies read app.organization_id / app.clerk_user_id set per transaction by lib/db/tenant.ts.

ALTER TABLE "KnowledgeArticle" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "KnowledgeArticle" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation" ON "KnowledgeArticle";
CREATE POLICY "tenant_isolation" ON "KnowledgeArticle"
FOR ALL TO app_runtime
USING ("organizationId" = (SELECT NULLIF(current_setting('app.organization_id', true), '')::uuid))
WITH CHECK ("organizationId" = (SELECT NULLIF(current_setting('app.organization_id', true), '')::uuid));

ALTER TABLE "SupportMessage" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SupportMessage" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation" ON "SupportMessage";
CREATE POLICY "tenant_isolation" ON "SupportMessage"
FOR ALL TO app_runtime
USING ("organizationId" = (SELECT NULLIF(current_setting('app.organization_id', true), '')::uuid))
WITH CHECK ("organizationId" = (SELECT NULLIF(current_setting('app.organization_id', true), '')::uuid));

ALTER TABLE "SupportTicket" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SupportTicket" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation" ON "SupportTicket";
CREATE POLICY "tenant_isolation" ON "SupportTicket"
FOR ALL TO app_runtime
USING ("organizationId" = (SELECT NULLIF(current_setting('app.organization_id', true), '')::uuid))
WITH CHECK ("organizationId" = (SELECT NULLIF(current_setting('app.organization_id', true), '')::uuid));
