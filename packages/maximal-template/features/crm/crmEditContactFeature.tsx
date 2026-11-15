import { loadCrmEditContactWorkflow } from "@/lib/workflows/crmWorkflows";
import { CrmEditContactForm } from "./crmEditContactForm";

/** Server feature loads tenant-authorized Contact data for its edit RHF form. */
export async function CrmEditContactFeature({ contactId }: { contactId: string }) {
  const { contact } = await loadCrmEditContactWorkflow({ contactId });
  return <CrmEditContactForm contact={contact} />;
}
