/** Serializable organization directory projections. */
import "server-only";
import type {
  OrganizationMemberDTO,
  OrganizationMemberRecord,
} from "@/types/authzTypes";

/** Expose only the membership and display fields needed by the directory. */
export function toOrganizationMemberDTO(
  record: OrganizationMemberRecord,
): OrganizationMemberDTO {
  return {
    id: record.id,
    role: record.role,
    status: record.status,
    name: record.user.displayName ?? "Member",
  };
}
