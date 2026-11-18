/** One presentation template per admin page; only blocks resolve copy and primitives. */
import { AdminNavigation } from "@/components/nav/admin-navigation";
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
  AdminEditUserFormBlock,
  AdminFormFeedbackBlock,
  AdminDashboardToolbarBlock,
  AdminDashboardContentBlock,
  AdminInvitationsSectionBlock,
} from "@/components/blocks/admin-blocks";
import type {
  AdminAuditTemplateProps,
  AdminUsersTemplateProps,
  AdminRecordsProps,
  AdminRecordDetailProps,
  AdminMembershipProps,
  AdminEditUserTemplateProps,
  AdminShellTemplateProps,
  AdminDashboardView,
  AdminChildrenProps,
} from "@/types/adminTypes";
/** Compose shell presentation; the feature performs all identity and access checks. */
export function AdminShellTemplate({
  children,
  accountMenu,
}: AdminShellTemplateProps) {
  return (
    <AdminFrameBlock>
      <AdminSkipLinkBlock />
      <AdminNavigation>
        <AdminSidebarBlock accountMenu={accountMenu} />
      </AdminNavigation>
      <div className="flex min-h-dvh min-w-0 flex-1 flex-col">
        <AdminHeaderBlock />
        <main id="admin-main-content" tabIndex={-1} className="min-w-0 flex-1">
          {children}
        </main>
        <AdminFooterBlock />
      </div>
    </AdminFrameBlock>
  );
}

/** The overview's only presentation entry, adapted from the supplied BoldKit dashboard. */
export function AdminDashboardTemplate(props: AdminDashboardView) {
  return (
    <AdminPageBlock
      variant="dashboard"
      toolbar={<AdminDashboardToolbarBlock />}
    >
      <AdminDashboardContentBlock {...props} />
    </AdminPageBlock>
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
      {props.invitations && (
        <AdminInvitationsSectionBlock>
          {props.invitations}
        </AdminInvitationsSectionBlock>
      )}
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
/** The new-user route delegates invitation fields and behavior to its owning slice. */
export function AdminNewUserTemplate({ children }: AdminChildrenProps) {
  return <AdminPageBlock variant="new">{children}</AdminPageBlock>;
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
