/** Auth Fetchers contracts and composition for the owning application slice. */
import "server-only";

/** Read-only authenticated profile queries independent of organization membership. */
import { withIdentityTransaction } from "@/lib/db/rls";
import { authProfileSelect } from "@/lib/db/selects/authSelects";
import { toAuthProfileDto } from "@/lib/db/dtos/authDto";

/** Resolve only the current identity; never accept a caller-selected user ID. */
export async function getOwnOnboardingProfile() {
  return withIdentityTransaction(async (tx, user) =>
    toAuthProfileDto(
      await tx.user.findUniqueOrThrow({
        where: { id: user.id },
        select: authProfileSelect,
      }),
    ),
  );
}
