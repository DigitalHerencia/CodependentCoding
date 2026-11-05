import "server-only";
import type { Prisma } from "@/generated/prisma/client";
export async function completeOnboardingTx(
  tx: Prisma.TransactionClient,
  userId: string,
  name: string,
) {
  return tx.user.updateMany({
    where: { id: userId, profileCompletedAt: null },
    data: { displayName: name, profileCompletedAt: new Date() },
  });
}
