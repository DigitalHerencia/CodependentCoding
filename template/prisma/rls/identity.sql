-- Row-level security for the identity tables (AUTH.md §6).
-- Idempotent: db:init and test:rls apply it after migrations, and re-running is safe.
-- Policies read app.organization_id / app.clerk_user_id set per transaction by lib/db/tenant.ts.

ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "User" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "user_identity_isolation" ON "User";
CREATE POLICY "user_identity_isolation" ON "User"
FOR ALL
USING ("clerkUserId" = NULLIF(current_setting('app.clerk_user_id', true), ''))
WITH CHECK ("clerkUserId" = NULLIF(current_setting('app.clerk_user_id', true), ''));

-- Membership resolves from the authenticated Clerk user before an organization
-- is selected; afterwards app.organization_id is the tenant boundary.
ALTER TABLE "Membership" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Membership" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "membership_application_access" ON "Membership";
CREATE POLICY "membership_application_access" ON "Membership"
FOR ALL
USING (
  "organizationId"::text = NULLIF(current_setting('app.organization_id', true), '')
  OR "userId" IN (
    SELECT "id" FROM "User"
    WHERE "clerkUserId" = NULLIF(current_setting('app.clerk_user_id', true), '')
  )
)
WITH CHECK ("organizationId"::text = NULLIF(current_setting('app.organization_id', true), ''));

-- An organization is visible when selected or when the user holds an active
-- membership in it (the Membership policy above limits which rows are seen).
ALTER TABLE "Organization" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Organization" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "organization_application_access" ON "Organization";
CREATE POLICY "organization_application_access" ON "Organization"
FOR ALL
USING (
  "id"::text = NULLIF(current_setting('app.organization_id', true), '')
  OR EXISTS (
    SELECT 1 FROM "Membership"
    WHERE "Membership"."organizationId" = "Organization"."id"
      AND "Membership"."status" = 'ACTIVE'
  )
)
WITH CHECK ("id"::text = NULLIF(current_setting('app.organization_id', true), ''));

ALTER TABLE "AuditEvent" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AuditEvent" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation" ON "AuditEvent";
CREATE POLICY "tenant_isolation" ON "AuditEvent"
FOR ALL
USING ("organizationId"::text = NULLIF(current_setting('app.organization_id', true), ''))
WITH CHECK ("organizationId"::text = NULLIF(current_setting('app.organization_id', true), ''));

ALTER TABLE "OrganizationSettings" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "OrganizationSettings" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation" ON "OrganizationSettings";
CREATE POLICY "tenant_isolation" ON "OrganizationSettings"
FOR ALL
USING ("organizationId"::text = NULLIF(current_setting('app.organization_id', true), ''))
WITH CHECK ("organizationId"::text = NULLIF(current_setting('app.organization_id', true), ''));

-- WebhookEvent and IdempotencyRecord are system tables written before a tenant
-- is known; they have no RLS (tests/rls SYSTEM_TABLES pins this list).
