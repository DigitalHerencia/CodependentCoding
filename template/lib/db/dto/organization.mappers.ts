import "server-only"

import type { Prisma } from "@/prisma/generated/prisma/client"
import { organizationSettingsSelect, teamMemberSelect } from "@/lib/db/selects/organization.selects"
import type { OrganizationSettingsDTO, TeamMemberDTO } from "@/types/organizationTypes"

type OrganizationRecord = Prisma.OrganizationGetPayload<{
  select: typeof organizationSettingsSelect
}>
type TeamMemberRecord = Prisma.MembershipGetPayload<{ select: typeof teamMemberSelect }>

export function mapOrganizationSettingsDTO(record: OrganizationRecord): OrganizationSettingsDTO {
  return record
}

export function mapTeamMemberDTO(record: TeamMemberRecord, currentUserId: string): TeamMemberDTO {
  return {
    id: record.id,
    displayName: record.user.displayName ?? record.user.email ?? "Unnamed user",
    email: record.user.email,
    role: record.role,
    joinedAt: record.createdAt.toISOString(),
    isCurrentUser: record.user.id === currentUserId,
  }
}
