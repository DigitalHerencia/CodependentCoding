/**
 * Runs `prisma/seeds/base.ts`, then every `prisma/seeds/<module>.ts` present, in
 * dependency order (prisma/seeds/registry.ts), in one transaction.
 *
 *   pnpm prisma db seed
 */
import { existsSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

import { config } from "dotenv";

import { PrismaNeon } from "@prisma/adapter-neon";

import { PrismaClient } from "@/generated/prisma/client";
import { seedModules } from "@/prisma/seeds/registry";
import { baseEnv } from "@/lib/env/base";
import { seedAudit, seedBase, type SeedContext } from "@/prisma/seeds/base";

config({ path: ".env.local", quiet: true });
config({ quiet: true });

const connectionString =
  baseEnv.value("DATABASE_URL_UNPOOLED") ?? baseEnv.read().DATABASE_URL;

const prisma = new PrismaClient({
  adapter: new PrismaNeon({
    connectionString,
  }),
});

type ModuleSeed = (context: SeedContext) => Promise<void>;

/** Installed modules with a seed file, dependencies first. */
function seedOrder(root: string): string[] {
  return seedModules.filter((id) =>
    existsSync(path.join(root, "prisma", "seeds", `${id}.ts`)),
  );
}

async function main(): Promise<void> {
  const root = process.cwd();
  const seeds: [string, ModuleSeed][] = [];
  for (const id of seedOrder(root)) {
    const file = pathToFileURL(path.join(root, "prisma", "seeds", `${id}.ts`));
    const loaded = (await import(file.href)) as { seed: ModuleSeed };
    seeds.push([id, loaded.seed]);
  }

  await prisma.$transaction(
    async (tx) => {
      const context = await seedBase(tx);
      for (const [, seed] of seeds) await seed(context);
      await seedAudit(
        context,
        seeds.map(([id]) => id),
      );
    },
    {
      maxWait: 10_000,
      timeout: 60_000,
    },
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error: unknown) => {
    console.error(error);
    await prisma.$disconnect();
    process.exitCode = 1;
  });
