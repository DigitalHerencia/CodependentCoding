import { config } from "dotenv";

import { defineConfig } from "prisma/config";

config({ path: ".env.local", quiet: true });
config({ quiet: true });

const directDatabaseUrl =
  process.env.DIRECT_DATABASE_URL?.trim() ?? process.env.DATABASE_URL?.trim();

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  // Generate and static tooling do not require database credentials. Prisma
  // migration commands still fail explicitly when a database URL is absent.
  ...(directDatabaseUrl
    ? { datasource: { url: directDatabaseUrl } }
    : {}),
});
