-- Add member-owned dashboard preferences without changing existing tenant data.
CREATE TABLE "DashboardPreference" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "organizationId" UUID NOT NULL,
  "membershipId" UUID NOT NULL,
  "showWorkspaces" BOOLEAN NOT NULL DEFAULT true,
  "showActivity" BOOLEAN NOT NULL DEFAULT true,
  "compactView" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ(6) NOT NULL,

  CONSTRAINT "DashboardPreference_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "DashboardPreference_membershipId_key"
  ON "DashboardPreference"("membershipId");
CREATE INDEX "DashboardPreference_organizationId_membershipId_idx"
  ON "DashboardPreference"("organizationId", "membershipId");

ALTER TABLE "DashboardPreference"
  ADD CONSTRAINT "DashboardPreference_organizationId_fkey"
  FOREIGN KEY ("organizationId") REFERENCES "Organization"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "DashboardPreference"
  ADD CONSTRAINT "DashboardPreference_membershipId_fkey"
  FOREIGN KEY ("membershipId") REFERENCES "Membership"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

-- A new tenant table must have explicit runtime grants and forced RLS.
GRANT SELECT, INSERT, UPDATE, DELETE ON "DashboardPreference" TO app_runtime;
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
