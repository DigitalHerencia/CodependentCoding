import "server-only";
import type { InvitationDTO } from "@/types/invitationTypes";
import type { InvitationRecord } from "@/lib/db/selects/invitationSelects";

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
