import { config } from "dotenv";

import { defineConfig, env } from "prisma/config";

config({ path: ".env.local", quiet: true });
config({ quiet: true });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    // Neon recommends a direct/non-pooled connection for migrations.
    url: env("DATABASE_NO_POOLING"),
  },
});
