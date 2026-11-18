"use server";
/** Admin orchestration shared through the Server Function boundary.
 * @see https://nextjs.org/docs/app/api-reference/directives/use-server
 */
import { notFound } from "next/navigation";
import { requireAuthIdentityAction } from "@/lib/actions/authActions";
import {
  changeAdminMembership,
  restoreAdminMembership,
  suspendAdminMembership,
} from "@/lib/actions/adminActions";
import {
  canAccessAdmin,
  getAdminMembership,
  getAdminMemberships,
  getAdminRecordSummary,
  getAuditEvents,
  getAdminDashboardSummary,
} from "@/lib/fetchers/adminFetchers";
import { adminRecordIdSchema } from "@/schemas/adminSchemas";
import { permissions } from "@/lib/authz/permissions";
import { getManagedOrganizationOptions } from "@/lib/fetchers/authzFetchers";
import { getPendingInvitations } from "@/lib/fetchers/invitationFetchers";
import type {
  AdminRecordLookup,
  AdminUserLookup,
  AdminPaginationProps,
  AdminPaginationSource,
  AdminListFeatureProps,
  AdminMetric,
} from "@/types/adminTypes";
/** Compose links from validated, encoded criteria. */
function pagination(
  path: string,
  page: AdminPaginationSource,
): AdminPaginationProps {
  const href = (value: number) =>
    `${path}?${new URLSearchParams({ query: page.query, page: String(value) })}`;
  return {
    page: page.page,
    previous: page.page > 1 ? href(page.page - 1) : null,
    next: page.hasMore ? href(page.page + 1) : null,
  };
}
/** Authenticate before the profile gate without requiring organization membership. */
export async function requireAdminIdentityWorkflow() {
  await requireAuthIdentityAction();
}
/** Resolve active organization/role before administration renders. */
export async function guardAdminWorkflow() {
  if (!(await canAccessAdmin())) notFound();
}
/** Load an authorized, paginated audit page. */
export async function loadAdminAuditWorkflow({
  criteria,
}: AdminListFeatureProps) {
  const page = await getAuditEvents(await criteria);
  return {
    page,
    pagination: pagination("/admin/audit", page),
    metrics: [
      { label: "events", value: page.items.length },
      {
        label: "actors",
        value: new Set(
          page.items.flatMap((event) => (event.actor ? [event.actor.id] : [])),
        ).size,
      },
    ] satisfies AdminMetric[],
  };
}
/** Stable model IDs identify resources; preserve old label URLs as aliases. */
export async function loadAdminRecordDetailWorkflow({
  recordId,
}: AdminRecordLookup) {
  const id = adminRecordIdSchema.parse(recordId);
  const record = (await getAdminRecordSummary()).find(
    (item) => item.id === id || item.resource === id,
  );
  if (!record) notFound();
  return { record };
}
/** Inventory counts are scoped to registered organization-owned resources. */
export async function loadAdminRecordsWorkflow() {
  const records = await getAdminRecordSummary();
  return {
    records,
    metrics: [
      { label: "resources", value: records.length },
      {
        label: "records",
        value: records.reduce((sum, record) => sum + record.count, 0),
      },
    ] satisfies AdminMetric[],
  };
}
/** Resolve a user within the active organization. */
export async function loadAdminUserDetailWorkflow({ userId }: AdminUserLookup) {
  const membership = await getAdminMembership(userId);
  if (!membership) notFound();
  return { membership };
}
/** Compose the member page and stable pagination URLs. */
export async function loadAdminUsersWorkflow({
  criteria,
}: AdminListFeatureProps) {
  const [page, pending] = await Promise.all([
    getAdminMemberships(await criteria),
    getPendingInvitations(),
  ]);
  return {
    page,
    pending,
    pagination: pagination("/admin/users", page),
    metrics: [
      { label: "members", value: page.items.length },
      {
        label: "active",
        value: page.items.filter((member) => member.status === "ACTIVE").length,
      },
    ] satisfies AdminMetric[],
  };
}
/** Dispatch role updates through the authenticated atomic action. */
export async function changeAdminMembershipWorkflow(input: unknown) {
  return changeAdminMembership(input);
}
/** Recheck actor and target before suspension. */
export async function suspendAdminMembershipWorkflow(input: unknown) {
  return suspendAdminMembership(input);
}
/** Restoration preserves the same self/owner safeguards. */
export async function restoreAdminMembershipWorkflow(input: unknown) {
  return restoreAdminMembership(input);
}

/** Resolve editability on the server before mounting a role form. */
export async function loadAdminUserEditWorkflow(input: AdminUserLookup) {
  const result = await loadAdminUserDetailWorkflow(input);
  if (!result.membership.canManage) notFound();
  return {
    ...result,
    organizations: await getManagedOrganizationOptions(),
    permissions,
  };
}

/** Compose the overview from one authorized tenant summary, with no fabricated performance data. */
export async function loadAdminDashboardWorkflow() {
  return getAdminDashboardSummary();
}
