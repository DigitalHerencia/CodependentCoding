-- Admin-owned audit RLS. Organization context is set transaction-locally by tenancy.
-- Insert-only audit trail: no UPDATE or DELETE policy, and the grants are
-- revoked in identity.sql before these policies are installed.
ALTER TABLE "AuditEvent" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AuditEvent" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation" ON "AuditEvent";
DROP POLICY IF EXISTS "audit_insert" ON "AuditEvent";
CREATE POLICY "audit_insert" ON "AuditEvent"
FOR INSERT TO app_runtime
WITH CHECK ("organizationId" = (SELECT NULLIF(current_setting('app.organization_id', true), '')::uuid));
DROP POLICY IF EXISTS "audit_read" ON "AuditEvent";
CREATE POLICY "audit_read" ON "AuditEvent"
FOR SELECT TO app_runtime
USING ("organizationId" = (SELECT NULLIF(current_setting('app.organization_id', true), '')::uuid));

