/** One presentation template per admin page; only blocks resolve copy and primitives. */
import { AdminNavigation } from "@/components/nav/admin-navigation";
import { AdminShell } from "@/components/shells/admin-shell";
import {
  AdminPageBlock,
  AdminHeaderBlock,
  AdminFrameBlock,
  AdminSidebarBlock,
  AdminMetricsBlock,
  AdminFooterBlock,
  AdminSkipLinkBlock,
  AdminSearchToolbarBlock,
  AdminPaginationBlock,
  AdminAuditContentBlock,
  AdminRecordsContentBlock,
  AdminRecordDetailContentBlock,
  AdminUserDetailContentBlock,
  AdminUsersContentBlock,
  AdminNewUserFormBlock,
  AdminEditUserFormBlock,
  AdminFormFeedbackBlock,
} from "@/components/blocks/admin-blocks";
import type {
  AdminAuditTemplateProps,
  AdminUsersTemplateProps,
  AdminRecordsProps,
  AdminRecordDetailProps,
  AdminMembershipProps,
  AdminNewUserTemplateProps,
  AdminEditUserTemplateProps,
  AdminShellTemplateProps,
} from "@/types/adminTypes";
/** Compose shell presentation; the feature performs all identity and access checks. */
export function AdminShellTemplate({
  children,
  accountMenu,
}: AdminShellTemplateProps) {
  return (
    <AdminFrameBlock>
      <AdminShell
        skipLink={<AdminSkipLinkBlock />}
        navigation={
          <AdminNavigation>
            <AdminSidebarBlock accountMenu={accountMenu} />
          </AdminNavigation>
        }
        header={<AdminHeaderBlock />}
        footer={<AdminFooterBlock />}
      >
        {children}
      </AdminShell>
    </AdminFrameBlock>
  );
}
/** Audit route presentation. */
export function AdminAuditTemplate(props: AdminAuditTemplateProps) {
  return (
    <AdminPageBlock
      variant="audit"
      toolbar={<AdminSearchToolbarBlock variant="audit" {...props} />}
    >
      <AdminMetricsBlock metrics={props.metrics} />
      <AdminAuditContentBlock events={props.events} />
      <AdminPaginationBlock {...props.pagination} />
    </AdminPageBlock>
  );
}
/** Records route presentation. */
export function AdminRecordsTemplate(props: AdminRecordsProps) {
  return (
    <AdminPageBlock variant="records">
      <AdminMetricsBlock metrics={props.metrics} />
      <AdminRecordsContentBlock {...props} />
    </AdminPageBlock>
  );
}
/** Record detail route presentation. */
export function AdminRecordDetailTemplate(props: AdminRecordDetailProps) {
  return (
    <AdminPageBlock variant="record" title={props.record.resource}>
      <AdminRecordDetailContentBlock {...props} />
    </AdminPageBlock>
  );
}
/** Users route presentation. */
export function AdminUsersTemplate(props: AdminUsersTemplateProps) {
  return (
    <AdminPageBlock
      variant="users"
      toolbar={<AdminSearchToolbarBlock variant="users" {...props} />}
    >
      <AdminMetricsBlock metrics={props.metrics} />
      <AdminUsersContentBlock memberships={props.memberships} />
      <AdminPaginationBlock {...props.pagination} />
    </AdminPageBlock>
  );
}
/** User detail route presentation, independent of the edit form. */
export function AdminUserDetailTemplate(props: AdminMembershipProps) {
  return (
    <AdminPageBlock
      variant="user"
      title={
        props.membership.user.displayName ??
        props.membership.user.email ??
        undefined
      }
    >
      <AdminUserDetailContentBlock {...props} />
    </AdminPageBlock>
  );
}
/** New membership approval route presentation. */
export function AdminNewUserTemplate(props: AdminNewUserTemplateProps) {
  return (
    <AdminPageBlock variant="new">
      <AdminNewUserFormBlock {...props} />
      <AdminFormFeedbackBlock
        error={props.errors.root}
        approved={props.approved}
      />
    </AdminPageBlock>
  );
}
/** Membership edit route presentation. */
export function AdminEditUserTemplate(props: AdminEditUserTemplateProps) {
  return (
    <AdminPageBlock variant="edit">
      <AdminEditUserFormBlock {...props} />
      <AdminFormFeedbackBlock error={props.errors.root} result={props.result} />
    </AdminPageBlock>
  );
}
