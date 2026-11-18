/** Admin persistence, transport and presentation contracts. */
import type {
  MembershipRole,
  MembershipStatus,
  Prisma,
} from "@/generated/prisma/client";
import type { z } from "zod";
import type { ReactNode, FormEventHandler } from "react";
import type { ControllerRenderProps, FieldErrors } from "react-hook-form";
import type { Route } from "next";
import type {
  addAdminMembershipSchema,
  changeAdminMembershipSchema,
  adminListCriteriaSchema,
} from "@/schemas/adminSchemas";
import type {
  adminMembershipSelect,
  auditEventSelect,
} from "@/lib/db/selects/adminSelects";
/** Public membership projection; no provider secrets cross this boundary. */
export type AdminMembershipDTO = {
  id: string;
  role: MembershipRole;
  status: MembershipStatus;
  canManage: boolean;
  user: { id: string; displayName: string | null; email: string | null };
  createdAt: string;
};
/** Stable registered resource identity and organization-scoped count. */
export type AdminRecordSummaryDTO = {
  id: string;
  resource: string;
  count: number;
};
/** Authorized audit projection with serializable timestamps. */
export type AuditEventDTO = {
  id: string;
  action: string;
  resourceType: string;
  resourceId: string | null;
  actor: {
    id: string;
    displayName: string | null;
    email: string | null;
  } | null;
  createdAt: string;
};
/** Role mutation inferred from the runtime contract. */
export type ChangeAdminMembershipCommand = z.input<
  typeof changeAdminMembershipSchema
>;
/** Existing workspace-access approval input. */
export type AddAdminMembershipCommand = z.input<
  typeof addAdminMembershipSchema
>;
/** Parsed URL criteria. */
export type AdminListCriteria = z.output<typeof adminListCriteriaSchema>;
/** One page, without a second count query. */
export type AdminPage<T> = AdminListCriteria & { items: T[]; hasMore: boolean };
/** Select-derived member persistence record. */
export type AdminMembershipRecord = Prisma.MembershipGetPayload<{
  select: typeof adminMembershipSelect;
}>;
/** Select-derived audit persistence record. */
export type AuditEventRecord = Prisma.AuditEventGetPayload<{
  select: typeof auditEventSelect;
}>;
/** Every registered inventory model supports an organization filter. */
export type AdminTenantCounter = {
  count(args: { where: { organizationId: string } }): Promise<number>;
};
/** Trusted context resolved by tenancy before mutation. */
export type AdminActorContext = { organizationId: string; actorUserId: string };
/** Locked actor projection rejects revoked administrators. */
export type AdminActorRecord = {
  role: MembershipRole;
  status: MembershipStatus;
};
/** The transaction helper enforces ownership and self-edit invariants. */
export type AdminMembershipUpdate = AdminActorContext & {
  membershipId: string;
  role?: MembershipRole;
  status?: MembershipStatus;
};
/** Existing organization-scoped verified-email approval. */
export type AdminAccessApproval = AdminActorContext & AddAdminMembershipCommand;
/** Shared slot-only container. */
export type AdminChildrenProps = Readonly<{ children: ReactNode }>;
/** Responsive shell presentation slots. */
export type AdminShellProps = AdminChildrenProps & {
  header: ReactNode;
  footer: ReactNode;
  skipLink: ReactNode;
};
/** Authenticated feature supplies account menu slots. */
export type AdminShellTemplateProps = AdminChildrenProps & {
  accountMenu: ReactNode;
  mobileAccountMenu: ReactNode;
};
/** Header receives presentation slots only. */
export type AdminHeaderProps = {
  brand: ReactNode;
  navigation: ReactNode;
  accountMenu: ReactNode;
  mobile: ReactNode;
};
/** Navigation receives labels from its owning block. */
export type AdminNavigationProps = {
  label: string;
  items: readonly { href: Route; label: string }[];
};
/** Shared mobile dialog preserves focus and account menu dismissal. */
export type AdminMobileProps = AdminChildrenProps & { title: string };
/** Page-specific skeleton variants use one primitive composition. */
export type AdminSkeletonProps = {
  variant?:
    | "layout"
    | "audit"
    | "records"
    | "record"
    | "users"
    | "user"
    | "new"
    | "edit";
};
/** Retry boundary never exposes provider/database stack errors. */
export type AdminErrorProps = {
  reset: () => void;
  error?: Error & { digest?: string };
};
/** Resolve URL promises inside a Suspense-wrapped feature. */
export type AdminListRouteProps = {
  searchParams: Promise<{ page?: string; query?: string }>;
};
/** Membership URL parameters. */
export type AdminUserRouteProps = { params: Promise<{ userId: string }> };
/** Resource URL parameters. */
export type AdminRecordRouteProps = { params: Promise<{ recordId: string }> };
/** Feature input, normalized by the workflow and runtime schema. */
export type AdminListFeatureProps = { criteria: unknown };
/** Membership lookup input. */
export type AdminUserLookup = { userId: string };
/** Inventory lookup input. */
export type AdminRecordLookup = { recordId: string };
/** Server-composed pagination URLs. */
export type AdminPaginationProps = {
  page: number;
  previous: string | null;
  next: string | null;
};
/** Search handlers supplied by the interactive feature. */
export type AdminSearchProps = {
  query: string;
  onQueryChange: (value: string) => void;
  onSearch: () => void;
};
/** Server-composed list data. */
export type AdminListView<T> = {
  page: AdminPage<T>;
  pagination: AdminPaginationProps;
};
/** Audit template contract. */
export type AdminAuditTemplateProps = AdminSearchProps & {
  events: AuditEventDTO[];
  pagination: AdminPaginationProps;
};
/** User template contract. */
export type AdminUsersTemplateProps = AdminSearchProps & {
  memberships: AdminMembershipDTO[];
  pagination: AdminPaginationProps;
};
/** Record listing contract. */
export type AdminRecordsProps = { records: AdminRecordSummaryDTO[] };
/** Record detail contract. */
export type AdminRecordDetailProps = { record: AdminRecordSummaryDTO };
/** Membership detail/edit contract. */
export type AdminMembershipProps = { membership: AdminMembershipDTO };
/** RHF owns bindings; the block renders them without application imports. */
export type AdminNewUserTemplateProps = {
  email: ControllerRenderProps<AddAdminMembershipCommand, "email">;
  role: ControllerRenderProps<AddAdminMembershipCommand, "role">;
  errors: FieldErrors<AddAdminMembershipCommand>;
  roles: readonly string[];
  pending: boolean;
  approved: boolean;
  onSubmit: FormEventHandler<HTMLFormElement>;
};
/** Edit form presentation receives field bindings and mutation state only. */
export type AdminEditUserTemplateProps = AdminMembershipProps & {
  role: ControllerRenderProps<ChangeAdminMembershipCommand, "role">;
  errors: FieldErrors<ChangeAdminMembershipCommand>;
  roles: readonly string[];
  pending: boolean;
  result: "role" | "access" | "failed" | null;
  onSubmit: FormEventHandler<HTMLFormElement>;
  onToggleAccess: () => void;
};

/** Route title vocabulary resolved exclusively in the block layer. */
export type AdminPageVariant =
  "audit" | "records" | "record" | "users" | "user" | "new" | "edit";
/** Shared page frame composed by each route template. */
export type AdminPageFrameProps = AdminChildrenProps & {
  variant: AdminPageVariant;
  title?: string | undefined;
  toolbar?: ReactNode;
};
/** Inline mutation error and status presentation. */
export type AdminFormFeedbackProps = {
  error?: { message?: string } | undefined;
  approved?: boolean;
  result?: "role" | "access" | "failed" | null;
};

/** Header menus do not require the shell's children slot. */
export type AdminHeaderBlockProps = Omit<AdminShellTemplateProps, "children">;
/** Internal membership state operation selected by the authorized action. */
export type AdminMutationKind = "role" | "suspend" | "restore";

/** Shared audit/member search toolbar. */
export type AdminSearchToolbarProps = AdminSearchProps & {
  variant: "audit" | "users";
};
/** Only audit events are needed by the audit content block. */
export type AdminAuditContentProps = Pick<AdminAuditTemplateProps, "events">;
/** Only member rows are needed by the users content block. */
export type AdminUsersContentProps = Pick<
  AdminUsersTemplateProps,
  "memberships"
>;
/** Validated source for server-composed pagination links. */
export type AdminPaginationSource = AdminListCriteria & { hasMore: boolean };
