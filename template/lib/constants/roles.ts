import type { MembershipRole } from "@/generated/prisma/enums";

/** Canonical application role vocabulary. Runtime schemas and type aliases derive from this list. */
export const appRoles = [
  "OWNER",
  "ADMIN",
  "MANAGER",
  "MEMBER",
  "BILLING",
  "SUPPORT",
  "CLIENT",
  "VIEWER",
] as const satisfies readonly MembershipRole[];
