import {
  AdminAuditToolbar,
  AdminPagination,
  AdminUsersToolbar,
} from "@/components/blocks/admin-blocks";
import {
  DashboardPanel,
  DashboardTable,
} from "@/components/blocks/shared-blocks";
import { adminPresentationCopy } from "@/content/admin";
import type {
  AdminMembershipDTO,
  AdminRecordSummaryDTO,
  AuditEventDTO,
} from "@/types/adminTypes";
import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

// Why: Templates: pure presentation for the admin pages, laid out from DTOs; data and slots come from features.

export function AdminAuditContentBlock({
  events,
  pagination,
}: {
  events: AuditEventDTO[];
  pagination: ComponentProps<typeof AdminPagination>;
  toolbar?: ReactNode;
  toolbarProps?: ComponentProps<typeof AdminAuditToolbar>;
}) {
  return (
    <>
      <ol className="space-y-3 border-l-4 border-primary pl-5">
        {events.map((event) => (
          <li key={event.id} className="surface-card p-4">
            <p className="type-label">{event.action}</p>
            <p className="mt-2">
              {event.actor?.displayName ?? adminPresentationCopy.system}
              {adminPresentationCopy.separator}
              {event.resourceType}
            </p>
            <time className="text-sm text-muted-primary">
              {event.createdAt}
            </time>
            <p className="mt-2 text-xs break-all">
              {adminPresentationCopy.resource}
              {event.resourceId ?? adminPresentationCopy.emptyValue}
            </p>
          </li>
        ))}
      </ol>
      {!events.length && <p>{adminPresentationCopy.noMatchingAuditEvents}</p>}
      <AdminPagination {...pagination} />
    </>
  );
}

export function AdminRecordDetailContentBlock({
  record,
}: {
  record: AdminRecordSummaryDTO;
}) {
  return (
    <>
      <DashboardPanel title={adminPresentationCopy.tenantInventory}>
        <p className="text-3xl">{record.count}</p>
        <p className="mt-3">
          {adminPresentationCopy.persistedRecordsInTheActiveWorkspace}
        </p>
      </DashboardPanel>
    </>
  );
}

export function AdminRecordsContentBlock({
  records,
}: {
  records: AdminRecordSummaryDTO[];
}) {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {records.map((record) => (
          <Link
            className="space-y-3 surface-card p-5 hover:bg-primary/10"
            key={record.resource}
            href={`/admin/records/${encodeURIComponent(record.resource)}`}
          >
            <h2 className="type-label">{record.resource}</h2>
            <p className="text-3xl">{record.count}</p>
            <p className="text-sm">{adminPresentationCopy.inspectResource}</p>
          </Link>
        ))}
      </div>
    </>
  );
}

export function AdminUserDetailContentBlock({
  membership,
  children,
}: {
  membership: AdminMembershipDTO;
  children: ReactNode;
}) {
  return (
    <>
      <div className="grid gap-4 lg:grid-cols-2">
        <DashboardPanel title={adminPresentationCopy.identity}>
          <p>{membership.user.email}</p>
          <p className="mt-4">
            {adminPresentationCopy.joined}
            {membership.createdAt.slice(0, 10)}
          </p>
          <p>
            {adminPresentationCopy.access}
            {membership.status}
          </p>
        </DashboardPanel>
        <DashboardPanel title={adminPresentationCopy.accessManagement}>
          {children}
        </DashboardPanel>
      </div>
    </>
  );
}

export function AdminUsersContentBlock({
  memberships,
  pagination,
}: {
  memberships: AdminMembershipDTO[];
  pagination: ComponentProps<typeof AdminPagination>;
  toolbar?: ReactNode;
  toolbarProps?: ComponentProps<typeof AdminUsersToolbar>;
}) {
  return (
    <>
      <DashboardTable
        columns={[
          { key: "person", label: adminPresentationCopy.member },
          { key: "email", label: adminPresentationCopy.email },
          { key: "role", label: adminPresentationCopy.applicationRole },
          { key: "status", label: adminPresentationCopy.accessStatus },
          { key: "joined", label: adminPresentationCopy.joined2 },
        ]}
        rows={memberships.map((membership) => ({
          id: membership.id,
          href: `/admin/users/${membership.user.id}`,
          cells: {
            person:
              membership.user.displayName ??
              membership.user.email ??
              adminPresentationCopy.unnamedUser,
            email: membership.user.email,
            role: membership.role,
            status: membership.status,
            joined: membership.createdAt.slice(0, 10),
          },
        }))}
      />
      <AdminPagination {...pagination} />
    </>
  );
}

export function AdminAuditToolbarBlock(
  props: ComponentProps<typeof AdminAuditContentBlock>,
) {
  const { toolbar: toolbarSlot, toolbarProps } = props;
  return toolbarProps ? <AdminAuditToolbar {...toolbarProps} /> : toolbarSlot;
}
export function AdminUsersToolbarBlock(
  props: ComponentProps<typeof AdminUsersContentBlock>,
) {
  const { toolbar: toolbarSlot, toolbarProps } = props;
  return toolbarProps ? <AdminUsersToolbar {...toolbarProps} /> : toolbarSlot;
}
