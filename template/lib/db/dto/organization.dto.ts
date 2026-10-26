import type { InvitationDTO, OrganizationDTO } from "@/types/commonTypes";
import type {
  InvitationRecord,
  OrganizationOverviewRecord,
} from "@/lib/db/selects/organization.selects";

export function toOrganizationDTO(
  record: OrganizationOverviewRecord,
): OrganizationDTO {
  return {
    id: record.id,
    slug: record.slug,
    name: record.name,
    imageUrl: record.imageUrl,
    timezone: record.settings?.timezone ?? "UTC",
    locale: record.settings?.locale ?? "en-US",
    defaultCurrency: record.settings?.defaultCurrency ?? "USD",
    memberCount: record._count.memberships,
  };
}

export function toInvitationDTO(record: InvitationRecord): InvitationDTO {
  return {
    id: record.id,
    email: record.email,
    role: record.role,
    status: record.status,
    expiresAt: record.expiresAt.toISOString(),
    createdAt: record.createdAt.toISOString(),
  };
}
