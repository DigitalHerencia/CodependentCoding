/** Authorized read-only organization and membership queries. */
import "server-only";
import { toOrganizationMemberDTO } from "@/lib/db/dtos/authzDto";
import {
  organizationMemberSelect,
  organizationSwitcherMembershipSelect,
  manageableOrganizationMembershipSelect,
} from "@/lib/db/selects/authzSelects";

import type { OrganizationSwitcherDTO } from "@/types/authzTypes";
import { activeMembershipScope } from "@/lib/authz/mode";
import { limitedToCustomerRecords } from "@/lib/authz/attributes";
import { assertPermission, hasPermission } from "@/lib/authz/permissions";
import { isPrivilegedRole } from "@/lib/authz/roles";
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

/** List only destinations where the caller can administer memberships; single tenancy stays fixed. */
export async function getManagedOrganizationOptions() {
  return withAuthenticatedRead(async (tx, access) => {
    assertPermission(access, "admin.membership:update");
    const rows = await tx.membership.findMany({
      where: activeMembershipScope(access.userId),
      orderBy: [{ createdAt: "asc" }, { id: "asc" }],
      select: manageableOrganizationMembershipSelect,
    });
    return rows
      .filter(
        (row) =>
          isPrivilegedRole(row.role) &&
          (row.organization.id === access.organizationId ||
            !row.deniedPermissions.includes("admin.membership:create")),
      )
      .map(({ organization }) => organization);
  });
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
  return readOrganizationMembers();
}

/** Fetch a bounded directory window, including one row to detect a next page. */
export async function getOrganizationMembersPage(requestedPage: number) {
  const pageSize = 50;
  const maxPage = Math.floor(2_147_483_647 / pageSize) + 1;
  const page =
    Number.isSafeInteger(requestedPage) &&
    requestedPage > 0 &&
    requestedPage <= maxPage
      ? requestedPage
      : 1;
  const rows = await readOrganizationMembers({
    skip: (page - 1) * pageSize,
    take: pageSize + 1,
  });
  return {
    members: rows.slice(0, pageSize),
    page,
    hasNextPage: rows.length > pageSize && page < maxPage,
  };
}

/** Apply the same active membership scope for both the directory and existing owner consumers. */
async function readOrganizationMembers(window?: {
  skip: number;
  take: number;
}) {
  return withAuthenticatedRead(async (tx, access) => {
    assertPermission(access, "base.membership:read");
    const rows = await tx.membership.findMany({
      where: {
        organizationId: access.organizationId,
        ...(limitedToCustomerRecords(access) ? { userId: access.userId } : {}),
      },
      orderBy: [{ createdAt: "asc" }, { id: "asc" }],
      ...window,
      select: organizationMemberSelect,
    });
    return rows.map(toOrganizationMemberDTO);
  });
}
