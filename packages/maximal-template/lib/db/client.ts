import "server-only";

import { createHash } from "node:crypto";
import { PrismaNeon } from "@prisma/adapter-neon";

import { PrismaClient } from "@/generated/prisma/client";
import { baseEnv } from "@/lib/utils/env";
import { isProduction } from "@/lib/constants/mode";

// Next.js loads .env.local itself; env is read only through lib/utils/env.ts.
const connectionString = baseEnv.read().DATABASE_URL;

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
