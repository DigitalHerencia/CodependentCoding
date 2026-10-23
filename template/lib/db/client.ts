import "server-only";

import { createHash } from "node:crypto";
import { PrismaNeon } from "@prisma/adapter-neon";
import { config } from "dotenv";

import { PrismaClient } from "@/generated/prisma/client";
import { baseEnv } from "@/lib/env/base";
import { isDevelopment, isProduction } from "@/lib/env/mode";

const localEnvironment: Record<string, string> = {};
config({ path: ".env.local", quiet: true, processEnv: localEnvironment });
config({ path: ".env.local", quiet: true });
config({ quiet: true });

// Local development targets the checked-out app, not an unrelated inherited URL.
const connectionString =
  (isDevelopment ? localEnvironment.DATABASE_URL : undefined) ??
  baseEnv.read().DATABASE_URL;

const adapter = new PrismaNeon({
  connectionString,
});

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
  prismaConnectionFingerprint?: string;
};

const connectionFingerprint = createHash("sha256")
  .update(connectionString)
  .digest("hex");
const cachedClient =
  globalForPrisma.prismaConnectionFingerprint === connectionFingerprint
    ? globalForPrisma.prisma
    : undefined;
if (globalForPrisma.prisma && !cachedClient) {
  void globalForPrisma.prisma.$disconnect();
}

export const prisma =
  cachedClient ??
  new PrismaClient({
    adapter,
  });

if (!isProduction) {
  globalForPrisma.prisma = prisma;
  globalForPrisma.prismaConnectionFingerprint = connectionFingerprint;
}
