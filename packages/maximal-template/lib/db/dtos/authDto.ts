/** Serializable profile mapping shared by authenticated reads and mutations. */
import type { Prisma } from "@/generated/prisma/client";
import type { authProfileSelect } from "@/lib/db/selects/authSelects";
import type { AuthProfileDTO } from "@/types/authTypes";

/** Preserve nullable fields while serializing the independent completion marker. */
export function toAuthProfileDto(
  profile: Prisma.UserGetPayload<{ select: typeof authProfileSelect }>,
): AuthProfileDTO {
  return {
    ...profile,
    profileCompletedAt: profile.profileCompletedAt?.toISOString() ?? null,
  };
}
