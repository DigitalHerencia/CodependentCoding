"use client";

import { CrmNewContactForm } from "./crmNewContactForm";

/** Lead creation reuses the typed CRM contact RHF contract with fixed LEAD status. */
export function CrmNewLeadForm() {
  return <CrmNewContactForm lead />;
}
