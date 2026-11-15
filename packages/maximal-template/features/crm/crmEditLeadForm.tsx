"use client";

import type { CrmContactDTO } from "@/types/crmTypes";
import { CrmEditContactForm } from "./crmEditContactForm";

/** Lead edits reuse contact field validation while keeping status as LEAD. */
export function CrmEditLeadForm({ contact }: { contact: CrmContactDTO }) {
  return <CrmEditContactForm contact={contact} lead />;
}
