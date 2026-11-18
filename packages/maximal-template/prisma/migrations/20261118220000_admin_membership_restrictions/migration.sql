-- Additive membership restrictions preserve existing grants with an empty deny list.
ALTER TABLE "Membership" ADD COLUMN "deniedPermissions" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];
-- Match the ordered, tenant-scoped audit pagination and overview range query.
CREATE INDEX "AuditEvent_organizationId_createdAt_id_idx" ON "AuditEvent"("organizationId", "createdAt" DESC, "id" DESC);
DROP INDEX IF EXISTS "AuditEvent_organizationId_createdAt_idx";
