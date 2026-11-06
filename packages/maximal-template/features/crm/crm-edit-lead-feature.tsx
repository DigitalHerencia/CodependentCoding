import { loadCrmEditLeadWorkflow } from "@/lib/workflows/crmWorkflows";
import { NewCrmContactForm } from "./newCrmContactForm";

export async function CrmEditLeadFeature({ leadId }: { leadId: string }) {
  const { contact } = await loadCrmEditLeadWorkflow({ leadId });
  return <NewCrmContactForm contact={contact} lead />;
}
