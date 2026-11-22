import "server-only";
import type { AccessContext } from "@/types/authzTypes";
import { limitedToCustomerRecords } from "./attributes";

/** Requesters observe their own tickets within the active membership's organization. */
export function supportTicketReadScope(access: AccessContext) {
  return {
    organizationId: access.organizationId,
    ...(limitedToCustomerRecords(access)
      ? { requesterUserId: access.userId }
      : {}),
  };
}

/** Customer queries exclude internal conversation rows and their counts. */
export function supportMessageReadScope(access: AccessContext) {
  return {
    organizationId: access.organizationId,
    ...(limitedToCustomerRecords(access) ? { isInternal: false } : {}),
  };
}
