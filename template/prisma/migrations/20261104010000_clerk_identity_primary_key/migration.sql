-- Preserve existing identities and every user relationship while adopting Clerk IDs.
-- Source migration only; apply with the migration owner during the owner-run database step.
BEGIN;
DROP POLICY IF EXISTS "user_identity_isolation" ON "User";
DROP POLICY IF EXISTS "user_tenant_read" ON "User";
DROP POLICY IF EXISTS "membership_identity_read" ON "Membership";
DROP POLICY IF EXISTS "invitation_application_access" ON "Invitation";
ALTER TABLE "Membership" DROP CONSTRAINT "Membership_userId_fkey";
ALTER TABLE "SupportTicket" DROP CONSTRAINT "SupportTicket_requesterUserId_fkey";
ALTER TABLE "AiGeneration" DROP CONSTRAINT "AiGeneration_userId_fkey";
ALTER TABLE "AiUsageLedger" DROP CONSTRAINT "AiUsageLedger_userId_fkey";
ALTER TABLE "AuditEvent" DROP CONSTRAINT "AuditEvent_actorUserId_fkey";
ALTER TABLE "User" ALTER COLUMN "id" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "id" TYPE TEXT USING "id"::text;
ALTER TABLE "Membership" ALTER COLUMN "userId" TYPE TEXT USING "userId"::text;
ALTER TABLE "SupportTicket" ALTER COLUMN "requesterUserId" TYPE TEXT USING "requesterUserId"::text;
ALTER TABLE "AiGeneration" ALTER COLUMN "userId" TYPE TEXT USING "userId"::text;
ALTER TABLE "AiUsageLedger" ALTER COLUMN "userId" TYPE TEXT USING "userId"::text;
ALTER TABLE "AuditEvent" ALTER COLUMN "actorUserId" TYPE TEXT USING "actorUserId"::text;
ALTER TABLE "Invitation" ALTER COLUMN "invitedByUserId" TYPE TEXT USING "invitedByUserId"::text;
ALTER TABLE "Invitation" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "User" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "Membership" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "SupportTicket" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "AiGeneration" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "AiUsageLedger" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "AuditEvent" DISABLE ROW LEVEL SECURITY;
UPDATE "Membership" AS target SET "userId" = source."clerkUserId" FROM "User" AS source WHERE target."userId" = source."id";
UPDATE "SupportTicket" AS target SET "requesterUserId" = source."clerkUserId" FROM "User" AS source WHERE target."requesterUserId" = source."id";
UPDATE "AiGeneration" AS target SET "userId" = source."clerkUserId" FROM "User" AS source WHERE target."userId" = source."id";
UPDATE "AiUsageLedger" AS target SET "userId" = source."clerkUserId" FROM "User" AS source WHERE target."userId" = source."id";
UPDATE "AuditEvent" AS target SET "actorUserId" = source."clerkUserId" FROM "User" AS source WHERE target."actorUserId" = source."id";
UPDATE "Invitation" AS target SET "invitedByUserId" = source."clerkUserId" FROM "User" AS source WHERE target."invitedByUserId" = source."id";
UPDATE "User" SET "id" = "clerkUserId";
ALTER TABLE "User" DROP COLUMN "clerkUserId";
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "SupportTicket" ADD CONSTRAINT "SupportTicket_requesterUserId_fkey" FOREIGN KEY ("requesterUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "AiGeneration" ADD CONSTRAINT "AiGeneration_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "AiUsageLedger" ADD CONSTRAINT "AiUsageLedger_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "AuditEvent" ADD CONSTRAINT "AuditEvent_actorUserId_fkey" FOREIGN KEY ("actorUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Invitation" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Invitation" FORCE ROW LEVEL SECURITY;
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "User" FORCE ROW LEVEL SECURITY;
ALTER TABLE "Membership" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Membership" FORCE ROW LEVEL SECURITY;
ALTER TABLE "SupportTicket" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SupportTicket" FORCE ROW LEVEL SECURITY;
ALTER TABLE "AiGeneration" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AiGeneration" FORCE ROW LEVEL SECURITY;
ALTER TABLE "AiUsageLedger" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AiUsageLedger" FORCE ROW LEVEL SECURITY;
ALTER TABLE "AuditEvent" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AuditEvent" FORCE ROW LEVEL SECURITY;
CREATE POLICY "user_identity_isolation" ON "User"
FOR ALL TO app_runtime
USING ("id" = (SELECT NULLIF(current_setting('app.clerk_user_id', true), '')))
WITH CHECK ("id" = (SELECT NULLIF(current_setting('app.clerk_user_id', true), '')));
CREATE POLICY "user_tenant_read" ON "User"
FOR SELECT TO app_runtime
USING (
  EXISTS (
    SELECT 1 FROM "Membership" AS m
    WHERE m."userId" = "User"."id"
      AND m."organizationId" = (SELECT NULLIF(current_setting('app.organization_id', true), '')::uuid)
  )
);
CREATE POLICY "membership_identity_read" ON "Membership"
FOR SELECT TO app_runtime
USING ("userId" = (SELECT NULLIF(current_setting('app.user_id', true), '')));
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
COMMIT;
