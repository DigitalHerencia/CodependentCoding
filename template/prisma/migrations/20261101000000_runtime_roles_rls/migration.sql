-- Database roles and row-level security for the identity tables (AUTH.md §6,
-- doctrine 05-data). Applied first, before every module file.
-- Readable source: `pnpm db:rls` writes it into a migration (CC-MIG-001). Idempotent.
-- Policies read app.organization_id / app.clerk_user_id set per transaction by lib/db/tenant.ts.

-- Roles (CC-DB-004). Created here in SQL, never in the Neon Console (Console
-- roles join neon_superuser, which carries BYPASSRLS). Passwords are set out of
-- band (`ALTER ROLE app_runtime PASSWORD ...`); neither role owns a table.
--   app_runtime: the application (DATABASE_URL, pooled).
--   app_system:  webhook and cron handlers (DATABASE_URL_SYSTEM), system tables only.
DO $$
DECLARE
  role_name text;
BEGIN
  FOREACH role_name IN ARRAY ARRAY['app_runtime', 'app_system'] LOOP
    IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = role_name) THEN
      EXECUTE format(
        'CREATE ROLE %I LOGIN NOSUPERUSER NOBYPASSRLS NOCREATEDB NOCREATEROLE',
        role_name
      );
    ELSIF EXISTS (
      SELECT FROM pg_roles
      WHERE rolname = role_name AND (rolsuper OR rolbypassrls)
    ) THEN
      RAISE EXCEPTION '% is SUPERUSER or BYPASSRLS; drop it and rerun', role_name;
    END IF;
  END LOOP;
END $$;

GRANT USAGE ON SCHEMA public TO app_runtime, app_system;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO app_runtime;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO app_runtime;
-- Prisma's migration ledger belongs to the owner alone (absent in Prisma's
-- shadow database, hence the guard).
DO $$
BEGIN
  IF to_regclass('public."_prisma_migrations"') IS NOT NULL THEN
    REVOKE ALL ON "_prisma_migrations" FROM app_runtime, app_system;
  END IF;
END $$;
-- The audit trail is insert-only (ledger D-6).
REVOKE UPDATE, DELETE ON "AuditEvent" FROM app_runtime;
GRANT SELECT, INSERT, UPDATE, DELETE ON "WebhookEvent", "IdempotencyRecord" TO app_system;

-- Every policy compares the column to the cast setting in a scalar sub-select
-- (CC-RLS-002): the (organizationId, ...) indexes stay usable and the setting is
-- read once per statement. NULLIF turns "not set" into NULL: zero rows.

ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "User" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "user_identity_isolation" ON "User";
CREATE POLICY "user_identity_isolation" ON "User"
FOR ALL TO app_runtime
USING ("clerkUserId" = (SELECT NULLIF(current_setting('app.clerk_user_id', true), '')))
WITH CHECK ("clerkUserId" = (SELECT NULLIF(current_setting('app.clerk_user_id', true), '')));

-- Membership resolves from the authenticated Clerk user before an organization
-- is selected; afterwards app.organization_id is the tenant boundary.
ALTER TABLE "Membership" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Membership" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "membership_application_access" ON "Membership";
CREATE POLICY "membership_application_access" ON "Membership"
FOR ALL TO app_runtime
USING (
  "organizationId" = (SELECT NULLIF(current_setting('app.organization_id', true), '')::uuid)
  OR "userId" IN (
    SELECT "id" FROM "User"
    WHERE "clerkUserId" = (SELECT NULLIF(current_setting('app.clerk_user_id', true), ''))
  )
)
WITH CHECK ("organizationId" = (SELECT NULLIF(current_setting('app.organization_id', true), '')::uuid));

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
    WHERE "clerkUserId" = (SELECT NULLIF(current_setting('app.clerk_user_id', true), ''))
  )
)
WITH CHECK ("organizationId" = (SELECT NULLIF(current_setting('app.organization_id', true), '')::uuid));

-- Insert-only audit trail: no UPDATE or DELETE policy, and the grants are
-- revoked above.
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

ALTER TABLE "OrganizationSettings" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "OrganizationSettings" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation" ON "OrganizationSettings";
CREATE POLICY "tenant_isolation" ON "OrganizationSettings"
FOR ALL TO app_runtime
USING ("organizationId" = (SELECT NULLIF(current_setting('app.organization_id', true), '')::uuid))
WITH CHECK ("organizationId" = (SELECT NULLIF(current_setting('app.organization_id', true), '')::uuid));

-- System tables (ledger D-7): written before a tenant is known. RLS is forced
-- like everywhere else; app_system has full access through its own policy.
-- IdempotencyRecord rows that carry an organization are also reachable by the
-- runtime inside that organization (tenant actions claim keys there).
ALTER TABLE "IdempotencyRecord" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "IdempotencyRecord" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "system_access" ON "IdempotencyRecord";
CREATE POLICY "system_access" ON "IdempotencyRecord"
FOR ALL TO app_system
USING (true)
WITH CHECK (true);
DROP POLICY IF EXISTS "tenant_isolation" ON "IdempotencyRecord";
CREATE POLICY "tenant_isolation" ON "IdempotencyRecord"
FOR ALL TO app_runtime
USING ("organizationId" = (SELECT NULLIF(current_setting('app.organization_id', true), '')::uuid))
WITH CHECK ("organizationId" = (SELECT NULLIF(current_setting('app.organization_id', true), '')::uuid));

ALTER TABLE "WebhookEvent" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "WebhookEvent" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "system_access" ON "WebhookEvent";
CREATE POLICY "system_access" ON "WebhookEvent"
FOR ALL TO app_system
USING (true)
WITH CHECK (true);
-- Interim: the webhook handlers still run on the runtime connection until they
-- move to app_system (withSystemTransaction, CC-077). Drop this policy and
-- REVOKE the runtime's grants on "WebhookEvent" in that change.
DROP POLICY IF EXISTS "webhook_ledger_runtime_interim" ON "WebhookEvent";
CREATE POLICY "webhook_ledger_runtime_interim" ON "WebhookEvent"
FOR ALL TO app_runtime
USING (true)
WITH CHECK (true);

-- Row-level security for the crm module (AUTH.md §6).
-- Readable source: `pnpm db:rls` writes it into a migration (CC-MIG-001). Idempotent.
-- Policies read app.organization_id / app.clerk_user_id set per transaction by lib/db/tenant.ts.

ALTER TABLE "CrmAccount" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CrmAccount" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation" ON "CrmAccount";
CREATE POLICY "tenant_isolation" ON "CrmAccount"
FOR ALL TO app_runtime
USING ("organizationId" = (SELECT NULLIF(current_setting('app.organization_id', true), '')::uuid))
WITH CHECK ("organizationId" = (SELECT NULLIF(current_setting('app.organization_id', true), '')::uuid));

ALTER TABLE "CrmActivity" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CrmActivity" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation" ON "CrmActivity";
CREATE POLICY "tenant_isolation" ON "CrmActivity"
FOR ALL TO app_runtime
USING ("organizationId" = (SELECT NULLIF(current_setting('app.organization_id', true), '')::uuid))
WITH CHECK ("organizationId" = (SELECT NULLIF(current_setting('app.organization_id', true), '')::uuid));

ALTER TABLE "CrmContact" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CrmContact" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation" ON "CrmContact";
CREATE POLICY "tenant_isolation" ON "CrmContact"
FOR ALL TO app_runtime
USING ("organizationId" = (SELECT NULLIF(current_setting('app.organization_id', true), '')::uuid))
WITH CHECK ("organizationId" = (SELECT NULLIF(current_setting('app.organization_id', true), '')::uuid));

ALTER TABLE "CrmDeal" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CrmDeal" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation" ON "CrmDeal";
CREATE POLICY "tenant_isolation" ON "CrmDeal"
FOR ALL TO app_runtime
USING ("organizationId" = (SELECT NULLIF(current_setting('app.organization_id', true), '')::uuid))
WITH CHECK ("organizationId" = (SELECT NULLIF(current_setting('app.organization_id', true), '')::uuid));

-- Why: row-level security for the projects module (AUTH.md §6): containment if an app predicate is ever missed.
-- Readable source: `pnpm db:rls` writes it into a migration (CC-MIG-001). Idempotent.
-- Policies read app.organization_id / app.clerk_user_id set per transaction by lib/db/tenant.ts.

ALTER TABLE "Milestone" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Milestone" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation" ON "Milestone";
CREATE POLICY "tenant_isolation" ON "Milestone"
FOR ALL TO app_runtime
USING ("organizationId" = (SELECT NULLIF(current_setting('app.organization_id', true), '')::uuid))
WITH CHECK ("organizationId" = (SELECT NULLIF(current_setting('app.organization_id', true), '')::uuid));

ALTER TABLE "Project" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Project" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation" ON "Project";
CREATE POLICY "tenant_isolation" ON "Project"
FOR ALL TO app_runtime
USING ("organizationId" = (SELECT NULLIF(current_setting('app.organization_id', true), '')::uuid))
WITH CHECK ("organizationId" = (SELECT NULLIF(current_setting('app.organization_id', true), '')::uuid));

ALTER TABLE "ProjectMember" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ProjectMember" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation" ON "ProjectMember";
CREATE POLICY "tenant_isolation" ON "ProjectMember"
FOR ALL TO app_runtime
USING ("organizationId" = (SELECT NULLIF(current_setting('app.organization_id', true), '')::uuid))
WITH CHECK ("organizationId" = (SELECT NULLIF(current_setting('app.organization_id', true), '')::uuid));

ALTER TABLE "Task" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Task" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation" ON "Task";
CREATE POLICY "tenant_isolation" ON "Task"
FOR ALL TO app_runtime
USING ("organizationId" = (SELECT NULLIF(current_setting('app.organization_id', true), '')::uuid))
WITH CHECK ("organizationId" = (SELECT NULLIF(current_setting('app.organization_id', true), '')::uuid));

ALTER TABLE "TaskDependency" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "TaskDependency" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation" ON "TaskDependency";
CREATE POLICY "tenant_isolation" ON "TaskDependency"
FOR ALL TO app_runtime
USING ("organizationId" = (SELECT NULLIF(current_setting('app.organization_id', true), '')::uuid))
WITH CHECK ("organizationId" = (SELECT NULLIF(current_setting('app.organization_id', true), '')::uuid));

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

-- Row-level security for the marketing module (AUTH.md §6).
-- Readable source: `pnpm db:rls` writes it into a migration (CC-MIG-001). Idempotent.
-- Policies read app.organization_id / app.clerk_user_id set per transaction by lib/db/tenant.ts.

ALTER TABLE "Audience" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Audience" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation" ON "Audience";
CREATE POLICY "tenant_isolation" ON "Audience"
FOR ALL TO app_runtime
USING ("organizationId" = (SELECT NULLIF(current_setting('app.organization_id', true), '')::uuid))
WITH CHECK ("organizationId" = (SELECT NULLIF(current_setting('app.organization_id', true), '')::uuid));

ALTER TABLE "Campaign" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Campaign" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation" ON "Campaign";
CREATE POLICY "tenant_isolation" ON "Campaign"
FOR ALL TO app_runtime
USING ("organizationId" = (SELECT NULLIF(current_setting('app.organization_id', true), '')::uuid))
WITH CHECK ("organizationId" = (SELECT NULLIF(current_setting('app.organization_id', true), '')::uuid));

ALTER TABLE "CampaignStep" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CampaignStep" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation" ON "CampaignStep";
CREATE POLICY "tenant_isolation" ON "CampaignStep"
FOR ALL TO app_runtime
USING ("organizationId" = (SELECT NULLIF(current_setting('app.organization_id', true), '')::uuid))
WITH CHECK ("organizationId" = (SELECT NULLIF(current_setting('app.organization_id', true), '')::uuid));

-- Row-level security for the invoicing module (AUTH.md §6).
-- Readable source: `pnpm db:rls` writes it into a migration (CC-MIG-001). Idempotent.
-- Policies read app.organization_id / app.clerk_user_id set per transaction by lib/db/tenant.ts.

ALTER TABLE "Expense" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Expense" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation" ON "Expense";
CREATE POLICY "tenant_isolation" ON "Expense"
FOR ALL TO app_runtime
USING ("organizationId" = (SELECT NULLIF(current_setting('app.organization_id', true), '')::uuid))
WITH CHECK ("organizationId" = (SELECT NULLIF(current_setting('app.organization_id', true), '')::uuid));

ALTER TABLE "Invoice" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Invoice" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation" ON "Invoice";
CREATE POLICY "tenant_isolation" ON "Invoice"
FOR ALL TO app_runtime
USING ("organizationId" = (SELECT NULLIF(current_setting('app.organization_id', true), '')::uuid))
WITH CHECK ("organizationId" = (SELECT NULLIF(current_setting('app.organization_id', true), '')::uuid));

ALTER TABLE "InvoiceLine" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "InvoiceLine" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation" ON "InvoiceLine";
CREATE POLICY "tenant_isolation" ON "InvoiceLine"
FOR ALL TO app_runtime
USING ("organizationId" = (SELECT NULLIF(current_setting('app.organization_id', true), '')::uuid))
WITH CHECK ("organizationId" = (SELECT NULLIF(current_setting('app.organization_id', true), '')::uuid));

-- Row-level security for the social module (AUTH.md §6).
-- Readable source: `pnpm db:rls` writes it into a migration (CC-MIG-001). Idempotent.
-- Policies read app.organization_id / app.clerk_user_id set per transaction by lib/db/tenant.ts.

ALTER TABLE "SocialAccount" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SocialAccount" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation" ON "SocialAccount";
CREATE POLICY "tenant_isolation" ON "SocialAccount"
FOR ALL TO app_runtime
USING ("organizationId" = (SELECT NULLIF(current_setting('app.organization_id', true), '')::uuid))
WITH CHECK ("organizationId" = (SELECT NULLIF(current_setting('app.organization_id', true), '')::uuid));

ALTER TABLE "SocialPost" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SocialPost" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation" ON "SocialPost";
CREATE POLICY "tenant_isolation" ON "SocialPost"
FOR ALL TO app_runtime
USING ("organizationId" = (SELECT NULLIF(current_setting('app.organization_id', true), '')::uuid))
WITH CHECK ("organizationId" = (SELECT NULLIF(current_setting('app.organization_id', true), '')::uuid));

ALTER TABLE "SocialPostMedia" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SocialPostMedia" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation" ON "SocialPostMedia";
CREATE POLICY "tenant_isolation" ON "SocialPostMedia"
FOR ALL TO app_runtime
USING ("organizationId" = (SELECT NULLIF(current_setting('app.organization_id', true), '')::uuid))
WITH CHECK ("organizationId" = (SELECT NULLIF(current_setting('app.organization_id', true), '')::uuid));

ALTER TABLE "SocialVariant" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SocialVariant" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation" ON "SocialVariant";
CREATE POLICY "tenant_isolation" ON "SocialVariant"
FOR ALL TO app_runtime
USING ("organizationId" = (SELECT NULLIF(current_setting('app.organization_id', true), '')::uuid))
WITH CHECK ("organizationId" = (SELECT NULLIF(current_setting('app.organization_id', true), '')::uuid));

-- Row-level security for the ai module (AUTH.md §6).
-- Readable source: `pnpm db:rls` writes it into a migration (CC-MIG-001). Idempotent.
-- Policies read app.organization_id / app.clerk_user_id set per transaction by lib/db/tenant.ts.

ALTER TABLE "AiGeneration" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AiGeneration" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation" ON "AiGeneration";
CREATE POLICY "tenant_isolation" ON "AiGeneration"
FOR ALL TO app_runtime
USING ("organizationId" = (SELECT NULLIF(current_setting('app.organization_id', true), '')::uuid))
WITH CHECK ("organizationId" = (SELECT NULLIF(current_setting('app.organization_id', true), '')::uuid));

ALTER TABLE "AiUsageLedger" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AiUsageLedger" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation" ON "AiUsageLedger";
CREATE POLICY "tenant_isolation" ON "AiUsageLedger"
FOR ALL TO app_runtime
USING ("organizationId" = (SELECT NULLIF(current_setting('app.organization_id', true), '')::uuid))
WITH CHECK ("organizationId" = (SELECT NULLIF(current_setting('app.organization_id', true), '')::uuid));

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

-- Row-level security for the billing module (AUTH.md §6).
-- Readable source: `pnpm db:rls` writes it into a migration (CC-MIG-001). Idempotent.
-- Policies read app.organization_id / app.clerk_user_id set per transaction by lib/db/tenant.ts.

ALTER TABLE "BillingSubscription" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "BillingSubscription" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation" ON "BillingSubscription";
CREATE POLICY "tenant_isolation" ON "BillingSubscription"
FOR ALL TO app_runtime
USING ("organizationId" = (SELECT NULLIF(current_setting('app.organization_id', true), '')::uuid))
WITH CHECK ("organizationId" = (SELECT NULLIF(current_setting('app.organization_id', true), '')::uuid));

-- Row-level security for the uploads module (AUTH.md §6).
-- Readable source: `pnpm db:rls` writes it into a migration (CC-MIG-001). Idempotent.
-- Policies read app.organization_id / app.clerk_user_id set per transaction by lib/db/tenant.ts.

ALTER TABLE "Asset" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Asset" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation" ON "Asset";
CREATE POLICY "tenant_isolation" ON "Asset"
FOR ALL TO app_runtime
USING ("organizationId" = (SELECT NULLIF(current_setting('app.organization_id', true), '')::uuid))
WITH CHECK ("organizationId" = (SELECT NULLIF(current_setting('app.organization_id', true), '')::uuid));
