import "server-only";

import type { Prisma } from "../../generated/prisma/client";
import type { AccessContext, AuthenticatedIdentity } from "../../types/access";

import { prisma } from "./client";
import { resolveAccessContextTx } from "./transactions/tenant-context.tx";

/** Seed identity used only by public, read-only template fetchers. */
const TEMPLATE_DEMO_IDENTITY: AuthenticatedIdentity = {
  clerkUserId: "user_seed_owner",
};

export async function withTenantTransaction<T>(
  identity: AuthenticatedIdentity,
  work: (tx: Prisma.TransactionClient, access: AccessContext) => Promise<T>,
): Promise<T> {
  return prisma.$transaction(
    async (tx) => {
      const access = await resolveAccessContextTx(tx, identity);
      return work(tx, access);
    },
    {
      maxWait: 5_000,
      timeout: 15_000,
    },
  );
}

/**
 * Public template reads run against the seeded demonstration workspace.
 * This does not authenticate the visitor and must never be used by mutations.
 */
export async function withTemplateReadTransaction<T>(
  work: (tx: Prisma.TransactionClient, access: AccessContext) => Promise<T>,
): Promise<T> {
  return withTenantTransaction(TEMPLATE_DEMO_IDENTITY, work);
}
