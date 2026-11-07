import {
  AdminAuditContentBlock,
  AdminAuditToolbarBlock,
  AdminRecordDetailContentBlock,
  AdminRecordsContentBlock,
  AdminUserDetailContentBlock,
  AdminUsersContentBlock,
  AdminUsersToolbarBlock,
} from "@/components/blocks/admin-page-blocks";
import { DashboardLayout } from "@/components/blocks/shared-blocks";
import { adminPresentationCopy } from "@/content/admin";
import type { ComponentProps } from "react";

export function AdminAuditTemplate(
  props: ComponentProps<typeof AdminAuditContentBlock>,
) {
  return (
    <DashboardLayout
      title={adminPresentationCopy.auditTrail}
      nav={[]}
      toolbar={<AdminAuditToolbarBlock {...props} />}
    >
      <AdminAuditContentBlock {...props} />
    </DashboardLayout>
  );
}
export function AdminRecordDetailTemplate(
  props: ComponentProps<typeof AdminRecordDetailContentBlock>,
) {
  const { record } = props;
  return (
    <DashboardLayout title={record.resource} nav={[]}>
      <AdminRecordDetailContentBlock {...props} />
    </DashboardLayout>
  );
}
export function AdminRecordsTemplate(
  props: ComponentProps<typeof AdminRecordsContentBlock>,
) {
  return (
    <DashboardLayout
      title={adminPresentationCopy.workspaceRecordInventory}
      nav={[]}
    >
      <AdminRecordsContentBlock {...props} />
    </DashboardLayout>
  );
}
export function AdminUserDetailTemplate(
  props: ComponentProps<typeof AdminUserDetailContentBlock>,
) {
  const { membership } = props;
  return (
    <DashboardLayout
      title={
        membership.user.displayName ??
        membership.user.email ??
        adminPresentationCopy.member
      }
      nav={[]}
    >
      <AdminUserDetailContentBlock {...props} />
    </DashboardLayout>
  );
}
export function AdminUsersTemplate(
  props: ComponentProps<typeof AdminUsersContentBlock>,
) {
  return (
    <DashboardLayout
      title={adminPresentationCopy.memberAdministration}
      nav={[]}
      toolbar={<AdminUsersToolbarBlock {...props} />}
    >
      <AdminUsersContentBlock {...props} />
    </DashboardLayout>
  );
}
