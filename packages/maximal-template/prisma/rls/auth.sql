-- Local identity and profile policies. Apply after identity.sql initializes roles.
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "User" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "user_identity_isolation" ON "User";
CREATE POLICY "user_identity_isolation" ON "User"
FOR ALL TO app_runtime
USING ("id" = (SELECT NULLIF(current_setting('app.clerk_user_id', true), '')))
WITH CHECK ("id" = (SELECT NULLIF(current_setting('app.clerk_user_id', true), '')));

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

