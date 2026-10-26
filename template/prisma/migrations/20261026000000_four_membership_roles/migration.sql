-- Fold the eight membership roles into OWNER > ADMIN > MEMBER > VIEWER (AUTH.md §5).
-- Staff roles become MEMBER; CLIENT becomes VIEWER, which policies limit to shared or own records.
-- Membership forces RLS, so lift it for the data update, then restore it.
ALTER TABLE "Membership" NO FORCE ROW LEVEL SECURITY;
ALTER TABLE "Membership" DISABLE ROW LEVEL SECURITY;

UPDATE "Membership" SET "role" = 'MEMBER' WHERE "role" IN ('MANAGER', 'BILLING', 'SUPPORT');
UPDATE "Membership" SET "role" = 'VIEWER' WHERE "role" = 'CLIENT';

ALTER TYPE "MembershipRole" RENAME TO "MembershipRole_old";
CREATE TYPE "MembershipRole" AS ENUM ('OWNER', 'ADMIN', 'MEMBER', 'VIEWER');
ALTER TABLE "Membership" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "Membership" ALTER COLUMN "role" TYPE "MembershipRole" USING ("role"::text::"MembershipRole");
ALTER TABLE "Membership" ALTER COLUMN "role" SET DEFAULT 'MEMBER';
DROP TYPE "MembershipRole_old";

ALTER TABLE "Membership" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Membership" FORCE ROW LEVEL SECURITY;
