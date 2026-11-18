import "server-only";
import type { InvitationDTO, InvitationRecord } from "@/types/invitationTypes";

/** Serialize public invitation fields without exposing token hashes. */
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
