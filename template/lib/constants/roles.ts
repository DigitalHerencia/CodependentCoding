import type { MembershipRole } from "@/generated/prisma/enums";

/**
 * Canonical application roles, highest first (AUTH.md §5): OWNER > ADMIN >
 * MEMBER (staff) > VIEWER (outside people, e.g. clients, who see only records
 * shared with them or their own). Runtime schemas and type aliases derive from this list.
 */
export const appRoles = [
  "OWNER",
  "ADMIN",
  "MEMBER",
  "VIEWER",
] as const satisfies readonly MembershipRole[];
