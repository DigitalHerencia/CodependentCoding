/** Minimal projections for the authenticated user's application-owned profile. */
import type { Prisma } from "@/generated/prisma/client";

/** Profile fields are local application data and never sourced from Clerk. */
export const authProfileSelect = {
  firstName: true,
  lastName: true,
  bio: true,
  phoneNumber: true,
  profileCompletedAt: true,
} satisfies Prisma.UserSelect;

/** Identity fields required to establish caller-scoped RLS before selecting a tenant. */
export const authIdentitySelect = {
  id: true,
  email: true,
  displayName: true,
  profileCompletedAt: true,
} satisfies Prisma.UserSelect;
/** Atomic identity upserts return only the stable provider user ID. */
export const authUserIdSelect = { id: true } satisfies Prisma.UserSelect;
