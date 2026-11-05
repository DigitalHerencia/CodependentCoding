ALTER TABLE "User" ADD COLUMN "profileCompletedAt" TIMESTAMPTZ(6);

UPDATE "User" AS u
SET "profileCompletedAt" = (
  SELECT min(a."createdAt")
  FROM "AuditEvent" AS a
  WHERE a."actorUserId" = u."id"
    AND a."action" = 'membership.onboarding.completed'
    AND a."resourceType" = 'Membership'
);

ALTER TABLE "Invitation" ADD COLUMN "requiresToken" BOOLEAN NOT NULL DEFAULT true;

DROP POLICY IF EXISTS "membership_application_access" ON "Membership";
CREATE POLICY "membership_application_access" ON "Membership"
FOR ALL TO app_runtime
USING (
  "organizationId" = (SELECT NULLIF(current_setting('app.organization_id', true), '')::uuid)
)
WITH CHECK ("organizationId" = (SELECT NULLIF(current_setting('app.organization_id', true), '')::uuid));

-- An identity may read its own memberships before selecting a tenant.
DROP POLICY IF EXISTS "membership_identity_read" ON "Membership";
CREATE POLICY "membership_identity_read" ON "Membership"
FOR SELECT TO app_runtime
USING ("userId" = (SELECT NULLIF(current_setting('app.user_id', true), '')::uuid));

-- Profiles can be displayed to members of the selected tenant. The identity
-- policy remains the only policy that permits profile writes.
DROP POLICY IF EXISTS "user_tenant_read" ON "User";
CREATE POLICY "user_tenant_read" ON "User"
FOR SELECT TO app_runtime
USING (
  EXISTS (
    SELECT 1 FROM "Membership" AS m
    WHERE m."userId" = "User"."id"
      AND m."organizationId" = (SELECT NULLIF(current_setting('app.organization_id', true), '')::uuid)
  )
);
