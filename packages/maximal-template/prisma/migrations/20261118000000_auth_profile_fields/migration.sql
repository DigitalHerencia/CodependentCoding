-- Application-owned optional profile fields. Existing completion markers stay intact.
ALTER TABLE "User"
  ADD COLUMN "firstName" TEXT,
  ADD COLUMN "lastName" TEXT,
  ADD COLUMN "bio" TEXT,
  ADD COLUMN "phoneNumber" TEXT,
  ADD COLUMN "username" TEXT;
