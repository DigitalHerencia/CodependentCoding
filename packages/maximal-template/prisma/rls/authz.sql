-- Organization authorization policies. Apply after identity.sql initializes roles.
-- Membership resolves from the authenticated Clerk user before an organization
-- is selected; afterwards app.organization_id is the tenant boundary.
ALTER TABLE "Membership" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Membership" FORCE ROW LEVEL SECURITY;
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
USING ("userId" = (SELECT NULLIF(current_setting('app.user_id', true), '')));

-- An organization is visible when selected or when the user holds an active
-- membership in it (the Membership policy above limits which rows are seen).
ALTER TABLE "Organization" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Organization" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "organization_identity_isolation" ON "Organization";
DROP POLICY IF EXISTS "organization_application_access" ON "Organization";
CREATE POLICY "organization_application_access" ON "Organization"
FOR ALL TO app_runtime
USING (
  "id" = (SELECT NULLIF(current_setting('app.organization_id', true), '')::uuid)
  OR EXISTS (
    SELECT 1 FROM "Membership"
    WHERE "Membership"."organizationId" = "Organization"."id"
      AND "Membership"."status" = 'ACTIVE'
  )
)
WITH CHECK ("id" = (SELECT NULLIF(current_setting('app.organization_id', true), '')::uuid));

-- Invitations belong to their organization; the invitee also sees invitations
-- sent to their own email so they can accept before joining. Writes stay
-- inside the organization (accepting sets app.organization_id first).
ALTER TABLE "Invitation" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Invitation" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "invitation_application_access" ON "Invitation";
CREATE POLICY "invitation_application_access" ON "Invitation"
FOR ALL TO app_runtime
USING (
  "organizationId" = (SELECT NULLIF(current_setting('app.organization_id', true), '')::uuid)
  OR lower("email") IN (
    SELECT lower("email") FROM "User"
    WHERE "id" = (SELECT NULLIF(current_setting('app.clerk_user_id', true), ''))
  )
)
WITH CHECK ("organizationId" = (SELECT NULLIF(current_setting('app.organization_id', true), '')::uuid));

ALTER TABLE "OrganizationSettings" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "OrganizationSettings" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation" ON "OrganizationSettings";
CREATE POLICY "tenant_isolation" ON "OrganizationSettings"
FOR ALL TO app_runtime
USING ("organizationId" = (SELECT NULLIF(current_setting('app.organization_id', true), '')::uuid))
WITH CHECK ("organizationId" = (SELECT NULLIF(current_setting('app.organization_id', true), '')::uuid));


-- Membership-owned dashboard preferences: one organization's active member
-- cannot read or modify another member's preferences, even in the same tenant.
ALTER TABLE "DashboardPreference" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "DashboardPreference" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "dashboard_membership_isolation" ON "DashboardPreference";
CREATE POLICY "dashboard_membership_isolation" ON "DashboardPreference"
FOR ALL TO app_runtime
USING (
  "organizationId" = (SELECT NULLIF(current_setting('app.organization_id', true), '')::uuid)
  AND EXISTS (
    SELECT 1 FROM "Membership" AS m
    WHERE m."id" = "DashboardPreference"."membershipId"
      AND m."organizationId" = "DashboardPreference"."organizationId"
      AND m."userId" = (SELECT NULLIF(current_setting('app.user_id', true), ''))
      AND m."status" = 'ACTIVE'
  )
)
WITH CHECK (
  "organizationId" = (SELECT NULLIF(current_setting('app.organization_id', true), '')::uuid)
  AND EXISTS (
    SELECT 1 FROM "Membership" AS m
    WHERE m."id" = "DashboardPreference"."membershipId"
      AND m."organizationId" = "DashboardPreference"."organizationId"
      AND m."userId" = (SELECT NULLIF(current_setting('app.user_id', true), ''))
      AND m."status" = 'ACTIVE'
  )
);
