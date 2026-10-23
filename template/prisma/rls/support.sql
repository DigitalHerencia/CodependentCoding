-- Row-level security for the support module (AUTH.md §6).
-- Idempotent: db:init and test:rls apply it after migrations, and re-running is safe.
-- Policies read app.organization_id / app.clerk_user_id set per transaction by lib/db/tenant.ts.

ALTER TABLE "KnowledgeArticle" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "KnowledgeArticle" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation" ON "KnowledgeArticle";
CREATE POLICY "tenant_isolation" ON "KnowledgeArticle"
FOR ALL
USING ("organizationId"::text = NULLIF(current_setting('app.organization_id', true), ''))
WITH CHECK ("organizationId"::text = NULLIF(current_setting('app.organization_id', true), ''));

ALTER TABLE "SupportMessage" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SupportMessage" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation" ON "SupportMessage";
CREATE POLICY "tenant_isolation" ON "SupportMessage"
FOR ALL
USING ("organizationId"::text = NULLIF(current_setting('app.organization_id', true), ''))
WITH CHECK ("organizationId"::text = NULLIF(current_setting('app.organization_id', true), ''));

ALTER TABLE "SupportTicket" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SupportTicket" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation" ON "SupportTicket";
CREATE POLICY "tenant_isolation" ON "SupportTicket"
FOR ALL
USING ("organizationId"::text = NULLIF(current_setting('app.organization_id', true), ''))
WITH CHECK ("organizationId"::text = NULLIF(current_setting('app.organization_id', true), ''));
