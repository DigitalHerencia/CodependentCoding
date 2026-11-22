import type { TicketPriority, TicketStatus } from "@/generated/prisma/enums";

/** Explicit triage order independent of database enum ordering. */
export const SUPPORT_PRIORITY_ORDER = [
  "URGENT",
  "HIGH",
  "NORMAL",
  "LOW",
] as const satisfies readonly TicketPriority[];
/** Maximum rows transferred by each navigable support projection page. */
export const SUPPORT_PAGE_SIZE = 50;

/** Existing status controls support every listed destination, including reopening. */
export const SUPPORT_STATUS_TRANSITIONS = {
  OPEN: [
    "OPEN",
    "IN_PROGRESS",
    "WAITING_ON_CUSTOMER",
    "WAITING_ON_INTERNAL",
    "RESOLVED",
    "CLOSED",
  ],
  IN_PROGRESS: [
    "OPEN",
    "IN_PROGRESS",
    "WAITING_ON_CUSTOMER",
    "WAITING_ON_INTERNAL",
    "RESOLVED",
    "CLOSED",
  ],
  WAITING_ON_CUSTOMER: [
    "OPEN",
    "IN_PROGRESS",
    "WAITING_ON_CUSTOMER",
    "WAITING_ON_INTERNAL",
    "RESOLVED",
    "CLOSED",
  ],
  WAITING_ON_INTERNAL: [
    "OPEN",
    "IN_PROGRESS",
    "WAITING_ON_CUSTOMER",
    "WAITING_ON_INTERNAL",
    "RESOLVED",
    "CLOSED",
  ],
  RESOLVED: [
    "OPEN",
    "IN_PROGRESS",
    "WAITING_ON_CUSTOMER",
    "WAITING_ON_INTERNAL",
    "RESOLVED",
    "CLOSED",
  ],
  CLOSED: [
    "OPEN",
    "IN_PROGRESS",
    "WAITING_ON_CUSTOMER",
    "WAITING_ON_INTERNAL",
    "RESOLVED",
    "CLOSED",
  ],
} as const satisfies Record<TicketStatus, readonly TicketStatus[]>;
