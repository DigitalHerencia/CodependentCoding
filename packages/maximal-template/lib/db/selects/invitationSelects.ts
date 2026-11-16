import "server-only";
import type { Prisma } from "@/generated/prisma/client";

export const invitationSelect = {
  id: true,
  email: true,
  role: true,
  status: true,
  expiresAt: true,
  createdAt: true,
} satisfies Prisma.InvitationSelect;

export type InvitationRecord = Prisma.InvitationGetPayload<{
  select: typeof invitationSelect;
}>;
