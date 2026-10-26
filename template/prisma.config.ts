import { config } from "dotenv";

import { defineConfig } from "prisma/config";

config({ path: ".env.local", quiet: true });
config({ quiet: true });

// Blank values (copied from .env.example) count as unset.
const directDatabaseUrl =
  process.env.DIRECT_DATABASE_URL?.trim() || process.env.DATABASE_URL?.trim();

export default defineConfig({
  schema: "prisma/schema",
  migrations: {
    path: "prisma/migrations",
    // react-server: lib/env/* is server-only.
    seed: "tsx --conditions=react-server prisma/seed.ts",
  },
  ...(directDatabaseUrl ? { datasource: { url: directDatabaseUrl } } : {}),
});
