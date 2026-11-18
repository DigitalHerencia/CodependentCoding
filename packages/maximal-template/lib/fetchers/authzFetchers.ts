/** Authorized read-only organization and membership queries. */
import "server-only";
import { toOrganizationMemberDTO } from "@/lib/db/dtos/authzDto";
import {
  organizationMemberSelect,
  organizationSwitcherMembershipSelect,
} from "@/lib/db/selects/authzSelects";

import type { OrganizationSwitcherDTO } from "@/types/authzTypes";
import { activeMembershipScope } from "@/lib/authz/mode";
import { limitedToCustomerRecords } from "@/lib/authz/attributes";
import { assertPermission, hasPermission } from "@/lib/authz/permissions";
import { withAuthenticatedRead } from "@/lib/db/tenancy";

/** Check whether the current membership may inspect integration configuration. */
export async function canViewIntegrationStatuses() {
  return withAuthenticatedRead(async (_tx, access) =>
    hasPermission(access, "base.settings:update"),
  );
}

/** The current authenticated membership role, scoped to the active organization. */
export async function getActiveMembershipRole() {
  return withAuthenticatedRead(async (_tx, access) => access.role);
}

/** The organizations the caller can switch between, oldest membership first. */
export async function getOrganizationSwitcher(): Promise<OrganizationSwitcherDTO> {
  return withAuthenticatedRead(async (tx, access) => {
    assertPermission(access, "base.organization:read");
    const rows = await tx.membership.findMany({
      where: activeMembershipScope(access.userId),
      orderBy: [{ createdAt: "asc" }, { id: "asc" }],
      select: organizationSwitcherMembershipSelect,
    });
    return {
      activeOrganizationId: access.organizationId,
      organizations: rows.map(({ organization }) => organization),
    };
  });
}

/** Read the current organization directory within the caller's authorized scope. */
export async function getOrganizationMembers() {
  return withAuthenticatedRead(async (tx, access) => {
    assertPermission(access, "base.membership:read");
    const rows = await tx.membership.findMany({
      where: {
        organizationId: access.organizationId,
        ...(limitedToCustomerRecords(access) ? { userId: access.userId } : {}),
      },
      orderBy: { createdAt: "asc" },
      select: organizationMemberSelect,
    });
    return rows.map(toOrganizationMemberDTO);
  });
}
