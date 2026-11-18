/** Admin owns the shared audit seed; reruns never modify existing audit records. */
import { seedIds } from "@/prisma/seeds/base";
import type { SeedContext } from "@/prisma/seeds/base";
/** Append the initial seed-completion event once, preserving its original metadata forever. */
export async function seedAdminAudit(
  { tx, owner, organization }: SeedContext,
  seeded: readonly string[],
): Promise<void> {
  await tx.auditEvent.createMany({
    skipDuplicates: true,
    data: [
      {
        id: seedIds.auditEvent,
        organizationId: organization.id,
        actorUserId: owner.id,
        action: "seed.completed",
        resourceType: "Organization",
        resourceId: organization.id,
        metadata: { recipes: [...seeded] },
      },
    ],
  });
}
