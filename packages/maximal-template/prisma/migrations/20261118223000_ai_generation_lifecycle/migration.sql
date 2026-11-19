-- Source only: the owner must apply pending migrations before running the refactored AI domain.
-- Retain every historical enum/value; do not infer measurements or repair past ledger entries.
-- The marker preserves all stored amounts while excluding unverified legacy estimates from measured totals.
ALTER TABLE "AiGeneration" ADD COLUMN "measurementVersion" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "AiUsageLedger" ADD COLUMN "measurementVersion" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "AiGeneration"
  ALTER COLUMN "status" SET DEFAULT 'RUNNING',
  ALTER COLUMN "inputTokens" DROP DEFAULT,
  ALTER COLUMN "inputTokens" DROP NOT NULL,
  ALTER COLUMN "outputTokens" DROP DEFAULT,
  ALTER COLUMN "outputTokens" DROP NOT NULL,
  ALTER COLUMN "cost" DROP DEFAULT,
  ALTER COLUMN "cost" DROP NOT NULL;
ALTER TABLE "AiUsageLedger"
  ALTER COLUMN "inputTokens" DROP NOT NULL,
  ALTER COLUMN "outputTokens" DROP NOT NULL,
  ALTER COLUMN "cost" DROP NOT NULL;

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

