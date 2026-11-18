/** Attribute checks used by authorization policies. */
import "server-only";

import type {
  AccessContext,
  ResourceAccessDescriptor,
} from "@/types/authzTypes";
import { isOutsideRole } from "./roles";

/** Customer identity and record relationships are enforced in either policy variant. */
export type CustomerRecordAttributes = Pick<
  ResourceAccessDescriptor,
  | "organizationId"
  | "ownerMembershipId"
  | "assigneeMembershipId"
  | "requesterUserId"
>;

export function limitedToCustomerRecords(context: AccessContext): boolean {
  return isOutsideRole(context.role);
}

/** A shared flag alone never establishes which customer may read a private record. */
export function hasCustomerRelationship(
  context: AccessContext,
  resource: CustomerRecordAttributes,
): boolean {
  return (
    context.organizationId === resource.organizationId &&
    (resource.ownerMembershipId === context.membershipId ||
      resource.assigneeMembershipId === context.membershipId ||
      resource.requesterUserId === context.userId)
  );
}

/** Support tickets belong to their requester, including on downstream writes. */
export function assertCustomerRequester(
  context: AccessContext,
  resource: Pick<
    CustomerRecordAttributes,
    "organizationId" | "requesterUserId"
  >,
): void {
  if (
    context.organizationId !== resource.organizationId ||
    (limitedToCustomerRecords(context) &&
      resource.requesterUserId !== context.userId)
  )
    throw Object.assign(new Error("Access denied for this customer record."), {
      code: "FORBIDDEN",
    });
}
