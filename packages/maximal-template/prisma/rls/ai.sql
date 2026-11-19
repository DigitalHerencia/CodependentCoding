-- Personal AI records remain scoped by both tenant and authenticated application user.
-- lib/db/tenancy.ts establishes these transaction-local values after resolving identity.
ALTER TABLE "AiGeneration" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AiGeneration" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation" ON "AiGeneration";
DROP POLICY IF EXISTS "ai_generation_read" ON "AiGeneration";
DROP POLICY IF EXISTS "ai_generation_insert" ON "AiGeneration";
DROP POLICY IF EXISTS "ai_generation_update" ON "AiGeneration";
CREATE POLICY "ai_generation_read" ON "AiGeneration" FOR SELECT TO app_runtime
USING (
  "organizationId" = (SELECT NULLIF(current_setting('app.organization_id', true), '')::uuid)
  AND "userId" = (SELECT NULLIF(current_setting('app.user_id', true), ''))
);
CREATE POLICY "ai_generation_insert" ON "AiGeneration" FOR INSERT TO app_runtime
WITH CHECK (
  "organizationId" = (SELECT NULLIF(current_setting('app.organization_id', true), '')::uuid)
  AND "userId" = (SELECT NULLIF(current_setting('app.user_id', true), ''))
);
CREATE POLICY "ai_generation_update" ON "AiGeneration" FOR UPDATE TO app_runtime
USING (
  "organizationId" = (SELECT NULLIF(current_setting('app.organization_id', true), '')::uuid)
  AND "userId" = (SELECT NULLIF(current_setting('app.user_id', true), ''))
)
WITH CHECK (
  "organizationId" = (SELECT NULLIF(current_setting('app.organization_id', true), '')::uuid)
  AND "userId" = (SELECT NULLIF(current_setting('app.user_id', true), ''))
);

-- No DELETE policy for generations; ledger history permits only SELECT and INSERT.
ALTER TABLE "AiUsageLedger" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AiUsageLedger" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation" ON "AiUsageLedger";
DROP POLICY IF EXISTS "ai_usage_read" ON "AiUsageLedger";
DROP POLICY IF EXISTS "ai_usage_insert" ON "AiUsageLedger";
CREATE POLICY "ai_usage_read" ON "AiUsageLedger" FOR SELECT TO app_runtime
USING (
  "organizationId" = (SELECT NULLIF(current_setting('app.organization_id', true), '')::uuid)
  AND "userId" = (SELECT NULLIF(current_setting('app.user_id', true), ''))
);
CREATE POLICY "ai_usage_insert" ON "AiUsageLedger" FOR INSERT TO app_runtime
WITH CHECK (
  "organizationId" = (SELECT NULLIF(current_setting('app.organization_id', true), '')::uuid)
  AND "userId" = (SELECT NULLIF(current_setting('app.user_id', true), ''))
  AND EXISTS (
    SELECT 1 FROM "AiGeneration" AS g
    WHERE g."id" = "AiUsageLedger"."generationId"
      AND g."organizationId" = "AiUsageLedger"."organizationId"
      AND g."userId" = "AiUsageLedger"."userId" AND g."status" = 'SUCCEEDED'
  )
);

