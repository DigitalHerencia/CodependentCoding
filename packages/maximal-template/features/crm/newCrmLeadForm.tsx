"use client";

import { NewCrmContactForm } from "./newCrmContactForm";

/** Lead creation reuses the contact RHF contract with LEAD defaults. */
export function NewCrmLeadForm() {
  return <NewCrmContactForm lead />;
}
